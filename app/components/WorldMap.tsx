import { memo, useMemo, useRef, useState, useCallback, useEffect } from "react";
import { geoEqualEarth, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";
import { Plus, Minus, RotateCcw } from "lucide-react";
import topoData from "world-atlas/countries-50m.json";
import { countries, type CountryData } from "~/data/countries";
import {
  colorScaleFor,
  hotspotColorScaleFor,
  noDataFill,
  oceanFill,
  borderStroke,
} from "~/lib/color";
import { formatValue, rankCountries, statValue, type Mode, type StatDef } from "~/lib/stats";
import { getPwdDensity } from "~/data/pwd-density-map";
import { MapLegendOverlay } from "~/components/MapLegendOverlay";
import {
  GhslTiledOverlay,
  type GhslOverlayHandle,
  type MapView,
} from "~/components/GhslTiledOverlay";
import {
  PopDensityOverlayControl,
  type PopDensityOverlayState,
  type PopDensityStyle,
} from "~/components/PopDensityOverlayControl";

interface GeoFeature {
  type: "Feature";
  id?: string;
  properties: { name?: string };
  geometry: GeoJSON.Geometry;
}

const WIDTH = 1000;
const HEIGHT = 520;

const byNumeric = new Map<number, CountryData>();
for (const c of countries) {
  const n = parseInt(c.numericCode, 10);
  if (Number.isFinite(n)) byNumeric.set(n, c);
}

// Precompute projection and ALL SVG path strings once at module load (0 ms per render!)
const worldProjection = geoEqualEarth().fitExtent(
  [
    [4, 4],
    [WIDTH - 4, HEIGHT - 4],
  ],
  { type: "Sphere" } as unknown as GeoJSON.Feature,
);
const staticPathGen = geoPath(worldProjection);

const SPHERE_PATH_D =
  staticPathGen({ type: "Sphere" } as unknown as GeoJSON.Feature) ?? "";

const rawGeoFeatures = (
  feature(
    topoData as never,
    (topoData as unknown as { objects: { countries: never } }).objects.countries,
  ) as unknown as { features: GeoFeature[] }
).features;

interface PrecomputedCountryFeature {
  key: string;
  num: number;
  country: CountryData | null;
  fallbackName: string;
  d: string;
}

const PRECOMPUTED_FEATURES: PrecomputedCountryFeature[] = rawGeoFeatures.map(
  (f, idx) => {
    const num = f.id ? parseInt(f.id, 10) : NaN;
    const country = Number.isFinite(num) ? (byNumeric.get(num) ?? null) : null;
    const key = f.id ?? f.properties.name ?? `f-${idx}`;
    return {
      key,
      num,
      country,
      fallbackName: country?.name ?? f.properties.name ?? "Country",
      d: staticPathGen(f as unknown as GeoJSON.Feature) ?? "",
    };
  },
);

const PATH_D_BY_KEY = new Map<string, string>();
const PATH_D_BY_CODE = new Map<string, string>();
for (const pf of PRECOMPUTED_FEATURES) {
  PATH_D_BY_KEY.set(pf.key, pf.d);
  if (pf.country) {
    const existing = PATH_D_BY_CODE.get(pf.country.code);
    PATH_D_BY_CODE.set(pf.country.code, existing ? `${existing} ${pf.d}` : pf.d);
  }
}

const WORLD_BORDER_MESH_D =
  staticPathGen(
    mesh(
      topoData as never,
      (topoData as unknown as { objects: { countries: never } }).objects.countries,
    ) as unknown as GeoJSON.MultiLineString,
  ) ?? "";

export interface HoverInfo {
  country: CountryData | null;
  name: string;
  x: number;
  y: number;
}

interface HoverTarget {
  key: string;
  country: CountryData | null;
  name: string;
}

const WorldPathsLayer = memo(function WorldPathsLayer({
  stat,
  valueByNumeric,
  fill,
  hotspotFill,
  region,
  overlayEnabled,
  overlayStyle,
  onSelectCountry,
}: {
  stat: StatDef;
  valueByNumeric: Map<number, number | null>;
  fill: (v: number) => string;
  hotspotFill: (v: number) => string;
  region: string | null;
  overlayEnabled: boolean;
  overlayStyle: PopDensityStyle;
  onSelectCountry: (c: CountryData) => void;
}) {
  const isClassicOverlay = overlayEnabled && overlayStyle === "classic";
  const isHotspotOverlay = overlayEnabled && overlayStyle === "hotspot";
  const strokeColor = isClassicOverlay ? "#cbd5e1" : borderStroke;

  return (
    <>
      <path d={SPHERE_PATH_D} fill={oceanFill} />
      {PRECOMPUTED_FEATURES.map((pf) => {
        const v = Number.isFinite(pf.num) ? valueByNumeric.get(pf.num) : undefined;
        const dimmed =
          region != null && pf.country != null && pf.country.region !== region;
        const baseFill = isClassicOverlay
          ? "#f4f4f5"
          : v != null
            ? isHotspotOverlay
              ? hotspotFill(v)
              : fill(v)
            : isHotspotOverlay
              ? "#04060a"
              : noDataFill;

        return (
          <path
            key={pf.key}
            data-key={pf.key}
            data-num={Number.isFinite(pf.num) ? pf.num : undefined}
            data-name={pf.fallbackName}
            d={pf.d}
            fill={baseFill}
            fillOpacity={dimmed ? 0.12 : 1}
            stroke={strokeColor}
            strokeWidth={0.5}
            vectorEffect="non-scaling-stroke"
            tabIndex={pf.country ? 0 : -1}
            role={pf.country ? "button" : undefined}
            aria-label={
              pf.country
                ? `${pf.country.name}: ${formatValue(stat, v ?? null)}`
                : pf.fallbackName
            }
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && pf.country) {
                e.preventDefault();
                onSelectCountry(pf.country);
              }
            }}
            className="focus:outline-none"
            onClick={() => {
              if (pf.country) onSelectCountry(pf.country);
            }}
          />
        );
      })}
    </>
  );
});

export function WorldMap({
  stat,
  mode,
  region,
  selectedCode,
  onSelect,
}: {
  stat: StatDef;
  mode: Mode;
  region: string | null;
  selectedCode: string | null;
  onSelect: (c: CountryData) => void;
}) {
  const viewRef = useRef<MapView>({ k: 1, x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [hoverTarget, setHoverTarget] = useState<HoverTarget | null>(null);
  const hoverKeyRef = useRef<string | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const lastPointerPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [popOverlay, setPopOverlay] = useState<PopDensityOverlayState>({
    enabled: false,
    opacity: 0.95,
    style: "hotspot",
  });

  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const overlayRef = useRef<GhslOverlayHandle>(null);
  const rafRef = useRef<number>(0);
  const drag = useRef<{
    px: number;
    py: number;
    x: number;
    y: number;
    moved: boolean;
  } | null>(null);

  const commitViewImperative = useCallback((next: MapView) => {
    viewRef.current = next;
    const zoomedNow = next.k > 1.001;
    setIsZoomed((prev) => (prev === zoomedNow ? prev : zoomedNow));
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const v = viewRef.current;
      gRef.current?.setAttribute(
        "transform",
        `translate(${v.x},${v.y}) scale(${v.k})`,
      );
      overlayRef.current?.drawView(v);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("overlay");
    if (p === "1" || p === "hotspot")
      setPopOverlay((s) => ({ ...s, enabled: true, style: "hotspot" }));
    else if (p === "blend")
      setPopOverlay((s) => ({ ...s, enabled: true, style: "blend" }));
    else if (p === "classic")
      setPopOverlay((s) => ({ ...s, enabled: true, style: "classic" }));
    const z = params.get("zoom");
    if (z) {
      const [ks, xs, ys] = z.split(",").map(Number);
      if (Number.isFinite(ks) && ks >= 1) {
        commitViewImperative({
          k: Math.min(24, ks),
          x: Number.isFinite(xs) ? xs : 0,
          y: Number.isFinite(ys) ? ys : 0,
        });
      }
    }
  }, [commitViewImperative]);

  const extent = useMemo<[number, number]>(() => {
    let min = Infinity;
    let max = -Infinity;
    for (const c of countries) {
      if (region && c.region !== region) continue;
      const v = statValue(stat, c, mode);
      if (v == null) continue;
      if (v < min) min = v;
      if (v > max) max = v;
    }
    if (!Number.isFinite(min)) return [0, 1];
    return min === max ? [min, min + 1] : [min, max];
  }, [stat, mode, region]);

  const fill = useMemo(() => colorScaleFor(stat, extent), [stat, extent]);
  const hotspotFill = useMemo(
    () => hotspotColorScaleFor(stat, extent),
    [stat, extent],
  );

  const valueByNumeric = useMemo(() => {
    const m = new Map<number, number | null>();
    for (const [n, c] of byNumeric) m.set(n, statValue(stat, c, mode));
    return m;
  }, [stat, mode]);

  const rankedEntries = useMemo(() => rankCountries(stat, mode), [stat, mode]);
  const rankByCode = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of rankedEntries) m.set(r.country.code, r.rank);
    return m;
  }, [rankedEntries]);

  const zoomIn = useCallback(() => {
    const v = viewRef.current;
    const k = Math.min(24, v.k * 1.4);
    const scale = k / v.k;
    const cx = WIDTH / 2;
    const cy = HEIGHT / 2;
    commitViewImperative({
      k,
      x: cx - (cx - v.x) * scale,
      y: cy - (cy - v.y) * scale,
    });
  }, [commitViewImperative]);

  const zoomOut = useCallback(() => {
    const v = viewRef.current;
    const k = Math.max(1, v.k / 1.4);
    if (k === 1) {
      commitViewImperative({ k: 1, x: 0, y: 0 });
      return;
    }
    const scale = k / v.k;
    const cx = WIDTH / 2;
    const cy = HEIGHT / 2;
    commitViewImperative({
      k,
      x: cx - (cx - v.x) * scale,
      y: cy - (cy - v.y) * scale,
    });
  }, [commitViewImperative]);

  const resetZoom = useCallback(() => {
    commitViewImperative({ k: 1, x: 0, y: 0 });
  }, [commitViewImperative]);

  const onWheel = useCallback(
    (e: React.WheelEvent<SVGSVGElement>) => {
      e.preventDefault();
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      const fitScale = Math.min(rect.width / WIDTH, rect.height / HEIGHT);
      const offsetX = (rect.width - WIDTH * fitScale) / 2;
      const offsetY = (rect.height - HEIGHT * fitScale) / 2;
      const mx = (e.clientX - rect.left - offsetX) / fitScale;
      const my = (e.clientY - rect.top - offsetY) / fitScale;
      const v = viewRef.current;
      const factor = e.deltaY < 0 ? 1.25 : 0.8;
      const k = Math.min(24, Math.max(1, v.k * factor));
      if (k === 1) {
        commitViewImperative({ k: 1, x: 0, y: 0 });
        return;
      }
      const scale = k / v.k;
      commitViewImperative({
        k,
        x: mx - (mx - v.x) * scale,
        y: my - (my - v.y) * scale,
      });
    },
    [commitViewImperative],
  );

  const onPointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    const v = viewRef.current;
    drag.current = {
      px: e.clientX,
      py: e.clientY,
      x: v.x,
      y: v.y,
      moved: false,
    };
  }, []);

  const updateTooltipPosition = useCallback(
    (localX: number, localY: number, containerW: number, containerH: number) => {
      const el = tooltipRef.current;
      if (!el) return;
      const tx = Math.min(Math.max(12, localX + 14), containerW - 210);
      const ty = Math.max(12, Math.min(localY - 45, containerH - 76));
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    },
    [],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      const d = drag.current;
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;

      if (d) {
        const dx = e.clientX - d.px;
        const dy = e.clientY - d.py;
        if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true;
        const fitScale = Math.min(rect.width / WIDTH, rect.height / HEIGHT);
        commitViewImperative({
          k: viewRef.current.k,
          x: d.x + dx / fitScale,
          y: d.y + dy / fitScale,
        });
        return;
      }

      const lx = e.clientX - rect.left;
      const ly = e.clientY - rect.top;
      lastPointerPos.current = { x: lx, y: ly };
      updateTooltipPosition(lx, ly, rect.width, rect.height);

      const target = (e.target as SVGElement).closest("path[data-key]");
      if (target) {
        const key = target.getAttribute("data-key")!;
        if (hoverKeyRef.current !== key) {
          hoverKeyRef.current = key;
          const numAttr = target.getAttribute("data-num");
          const c = numAttr ? (byNumeric.get(parseInt(numAttr, 10)) ?? null) : null;
          setHoverTarget({
            key,
            country: c,
            name: target.getAttribute("data-name") ?? "",
          });
        }
      } else if (hoverKeyRef.current !== null) {
        hoverKeyRef.current = null;
        setHoverTarget(null);
      }
    },
    [commitViewImperative, updateTooltipPosition],
  );

  useEffect(() => {
    if (!hoverTarget || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    updateTooltipPosition(
      lastPointerPos.current.x,
      lastPointerPos.current.y,
      rect.width,
      rect.height,
    );
  }, [hoverTarget, updateTooltipPosition]);

  const onPointerUp = useCallback(() => {
    // Delay clearing drag.moved slightly so click handler sees moved=true after pan
    setTimeout(() => {
      drag.current = null;
    }, 0);
  }, []);

  const handleSelectCountry = useCallback(
    (c: CountryData) => {
      if (!drag.current?.moved) onSelect(c);
    },
    [onSelect],
  );

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => e.preventDefault();
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  const formatTick = useCallback(
    (v: number) =>
      Math.abs(v) >= 1000
        ? v.toLocaleString("en-US", { maximumFractionDigits: 0 })
        : v.toFixed(stat.decimals),
    [stat],
  );

  const hoveredPathD = hoverTarget ? PATH_D_BY_KEY.get(hoverTarget.key) : null;
  const selectedPathD = selectedCode
    ? (PATH_D_BY_CODE.get(selectedCode) ?? null)
    : null;

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: oceanFill }}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-full w-full cursor-grab active:cursor-grabbing"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={() => {
          hoverKeyRef.current = null;
          setHoverTarget(null);
          drag.current = null;
        }}
      >
        <g
          ref={gRef}
          transform={`translate(${viewRef.current.x},${viewRef.current.y}) scale(${viewRef.current.k})`}
        >
          <WorldPathsLayer
            stat={stat}
            valueByNumeric={valueByNumeric}
            fill={fill}
            hotspotFill={hotspotFill}
            region={region}
            overlayEnabled={popOverlay.enabled}
            overlayStyle={popOverlay.style}
            onSelectCountry={handleSelectCountry}
          />
          {hoveredPathD && (
            <path
              d={hoveredPathD}
              fill="rgba(255,255,255,0.12)"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              style={{ pointerEvents: "none" }}
            />
          )}
          {selectedPathD && !popOverlay.enabled && (
            <path
              d={selectedPathD}
              fill="none"
              stroke="#38bdf8"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
              style={{ pointerEvents: "none" }}
            />
          )}
        </g>
      </svg>

      {/* Hardware-accelerated Canvas GHSL Multi-Zoom Tile Layer */}
      {popOverlay.enabled && (
        <GhslTiledOverlay
          ref={overlayRef}
          scope="world"
          styleMode={popOverlay.style}
          opacity={popOverlay.opacity}
          initialView={viewRef.current}
          width={WIDTH}
          height={HEIGHT}
          borderPathD={WORLD_BORDER_MESH_D}
          hoveredPathD={hoveredPathD}
          selectedPathD={selectedPathD}
        />
      )}

      {/* Luminocity3D Population Density Overlay Control */}
      <PopDensityOverlayControl state={popOverlay} onChange={setPopOverlay} />

      {/* Floating Map Legend Overlay */}
      <MapLegendOverlay
        stat={stat}
        mode={mode}
        region={region}
        formatTick={formatTick}
      />

      {/* Country Hover Tooltip (GPU translate3d positioned, 0 re-renders on move) */}
      {hoverTarget && (
        <div
          ref={tooltipRef}
          className="pointer-events-none absolute left-0 top-0 z-10 rounded-lg border border-zinc-800 bg-zinc-950/95 px-3 py-2 text-xs shadow-2xl backdrop-blur-md will-change-transform"
        >
          <div className="font-semibold text-zinc-100 flex items-center gap-1.5">
            {hoverTarget.country ? (
              <>
                <span className="text-sm leading-none">
                  {hoverTarget.country.flag}
                </span>
                <span>{hoverTarget.country.name}</span>
              </>
            ) : (
              hoverTarget.name
            )}
          </div>
          <div className="mt-0.5 flex items-baseline justify-between gap-3">
            <span className="text-cyan-300 font-semibold tabular-nums">
              {hoverTarget.country
                ? formatValue(stat, statValue(stat, hoverTarget.country, mode))
                : "No data"}
            </span>
            {hoverTarget.country && rankByCode.has(hoverTarget.country.code) && (
              <span className="text-[10px] text-zinc-400 font-mono">
                Rank #{rankByCode.get(hoverTarget.country.code)}
              </span>
            )}
          </div>
          {popOverlay.enabled &&
            hoverTarget.country &&
            getPwdDensity(hoverTarget.country.code) != null && (
              <div className="mt-1 flex items-center justify-between gap-3 border-t border-zinc-800/80 pt-1 text-[10px]">
                <span className="text-zinc-400">Lived density (GHSL):</span>
                <span className="font-mono font-medium text-amber-300">
                  {getPwdDensity(hoverTarget.country.code)!.toLocaleString(
                    "en-US",
                  )}{" "}
                  /km²
                </span>
              </div>
            )}
        </div>
      )}

      {/* Map Zoom Controls */}
      <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-1 rounded-lg border border-zinc-800/90 bg-zinc-950/90 p-1 shadow-lg backdrop-blur">
        <button
          onClick={zoomIn}
          title="Zoom in (+)"
          aria-label="Zoom in"
          className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          onClick={zoomOut}
          title="Zoom out (-)"
          aria-label="Zoom out"
          className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
        >
          <Minus className="h-4 w-4" />
        </button>
        {isZoomed && (
          <button
            onClick={resetZoom}
            title="Reset map zoom"
            aria-label="Reset zoom"
            className="rounded p-1.5 text-cyan-400 hover:bg-zinc-800 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
