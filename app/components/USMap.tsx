import { memo, useMemo, useRef, useState, useCallback, useEffect } from "react";
import { geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";
import { Plus, Minus, RotateCcw } from "lucide-react";
import topoData from "us-atlas/states-albers-10m.json";
import { usStateByFips, type USStateData } from "~/data/us-states";
import {
  colorScaleFor,
  hotspotColorScaleFor,
  noDataFill,
  oceanFill,
} from "~/lib/color";
import {
  formatValue,
  rankCountries,
  statValue,
  valueExtent,
  type Mode,
  type StatDef,
} from "~/lib/stats";
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
  id: string;
  properties: { name: string };
  geometry: GeoJSON.Geometry;
}

const WIDTH = 960;
const HEIGHT = 600;

const staticPathGen = geoPath();

const rawGeoFeatures = (
  feature(
    topoData as never,
    (topoData as unknown as { objects: { states: never } }).objects.states,
  ) as unknown as { features: GeoFeature[] }
).features;

const nationFeature = feature(
  topoData as never,
  (topoData as unknown as { objects: { nation: never } }).objects.nation,
) as unknown as GeoJSON.Feature;

const NATION_CLIP_D = staticPathGen(nationFeature) ?? "";

const US_BORDER_MESH_D =
  staticPathGen(
    mesh(
      topoData as never,
      (topoData as unknown as { objects: { states: never } }).objects.states,
    ) as unknown as GeoJSON.MultiLineString,
  ) ?? "";

interface PrecomputedStateFeature {
  fips: string;
  state: USStateData | null;
  fallbackName: string;
  d: string;
}

const PRECOMPUTED_STATES: PrecomputedStateFeature[] = rawGeoFeatures.map((f) => {
  const state = usStateByFips.get(f.id) ?? null;
  return {
    fips: f.id,
    state,
    fallbackName: state?.name ?? f.properties.name,
    d: staticPathGen(f as unknown as GeoJSON.Feature) ?? "",
  };
});

const PATH_D_BY_FIPS = new Map<string, string>();
const PATH_D_BY_CODE = new Map<string, string>();
for (const ps of PRECOMPUTED_STATES) {
  PATH_D_BY_FIPS.set(ps.fips, ps.d);
  if (ps.state) PATH_D_BY_CODE.set(ps.state.code, ps.d);
}

export interface HoverInfo {
  state: USStateData | null;
  name: string;
  x: number;
  y: number;
}

interface HoverStateTarget {
  fips: string;
  state: USStateData | null;
  name: string;
}

const USPathsLayer = memo(function USPathsLayer({
  stat,
  valueByFips,
  fill,
  hotspotFill,
  region,
  overlayEnabled,
  overlayStyle,
  onSelectState,
}: {
  stat: StatDef;
  valueByFips: Map<string, number | null>;
  fill: (v: number) => string;
  hotspotFill: (v: number) => string;
  region: string | null;
  overlayEnabled: boolean;
  overlayStyle: PopDensityStyle;
  onSelectState: (s: USStateData) => void;
}) {
  const isClassicOverlay = overlayEnabled && overlayStyle === "classic";
  const isHotspotOverlay = overlayEnabled && overlayStyle === "hotspot";
  const strokeColor = isClassicOverlay ? "#cbd5e1" : "#27272a";

  return (
    <>
      {PRECOMPUTED_STATES.map((ps) => {
        const v = valueByFips.get(ps.fips);
        const dimmed =
          region != null && ps.state != null && ps.state.region !== region;
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
            key={ps.fips}
            data-fips={ps.fips}
            data-code={ps.state?.code}
            data-name={ps.fallbackName}
            d={ps.d}
            fill={baseFill}
            fillOpacity={dimmed ? 0.15 : 1}
            stroke={strokeColor}
            strokeWidth={0.65}
            vectorEffect="non-scaling-stroke"
            tabIndex={ps.state ? 0 : -1}
            role={ps.state ? "button" : undefined}
            aria-label={
              ps.state
                ? `${ps.state.name}: ${formatValue(stat, v ?? null)}`
                : ps.fallbackName
            }
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && ps.state) {
                e.preventDefault();
                onSelectState(ps.state);
              }
            }}
            className="focus:outline-none"
            onClick={() => {
              if (ps.state) onSelectState(ps.state);
            }}
          />
        );
      })}
    </>
  );
});

export function USMap({
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
  onSelect: (s: USStateData) => void;
}) {
  const viewRef = useRef<MapView>({ k: 1, x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [hoverTarget, setHoverTarget] = useState<HoverStateTarget | null>(null);
  const hoverFipsRef = useRef<string | null>(null);
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
          k: Math.min(16, ks),
          x: Number.isFinite(xs) ? xs : 0,
          y: Number.isFinite(ys) ? ys : 0,
        });
      }
    }
  }, [commitViewImperative]);

  const extent = useMemo<[number, number]>(() => {
    return valueExtent(stat, mode, region, "us");
  }, [stat, mode, region]);

  const fill = useMemo(() => colorScaleFor(stat, extent), [stat, extent]);
  const hotspotFill = useMemo(
    () => hotspotColorScaleFor(stat, extent),
    [stat, extent],
  );

  const valueByFips = useMemo(() => {
    const m = new Map<string, number | null>();
    for (const [fips, s] of usStateByFips) {
      m.set(fips, statValue(stat, s, mode));
    }
    return m;
  }, [stat, mode]);

  const rankedEntries = useMemo(
    () => rankCountries(stat, mode, "us"),
    [stat, mode],
  );
  const rankByCode = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of rankedEntries) m.set(r.country.code, r.rank);
    return m;
  }, [rankedEntries]);

  const zoomIn = useCallback(() => {
    const v = viewRef.current;
    const k = Math.min(16, v.k * 1.4);
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
      const k = Math.min(16, Math.max(1, v.k * factor));
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
      const tx = Math.min(Math.max(12, localX + 14), containerW - 220);
      const ty = Math.max(12, Math.min(localY - 50, containerH - 95));
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

      const target = (e.target as SVGElement).closest("path[data-fips]");
      if (target) {
        const fips = target.getAttribute("data-fips")!;
        if (hoverFipsRef.current !== fips) {
          hoverFipsRef.current = fips;
          const s = usStateByFips.get(fips) ?? null;
          setHoverTarget({
            fips,
            state: s,
            name: target.getAttribute("data-name") ?? "",
          });
        }
      } else if (hoverFipsRef.current !== null) {
        hoverFipsRef.current = null;
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
    setTimeout(() => {
      drag.current = null;
    }, 0);
  }, []);

  const handleSelectState = useCallback(
    (s: USStateData) => {
      if (!drag.current?.moved) onSelect(s);
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

  const hoveredPathD = hoverTarget
    ? PATH_D_BY_FIPS.get(hoverTarget.fips)
    : null;
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
          hoverFipsRef.current = null;
          setHoverTarget(null);
          drag.current = null;
        }}
      >
        <g
          ref={gRef}
          transform={`translate(${viewRef.current.x},${viewRef.current.y}) scale(${viewRef.current.k})`}
        >
          <USPathsLayer
            stat={stat}
            valueByFips={valueByFips}
            fill={fill}
            hotspotFill={hotspotFill}
            region={region}
            overlayEnabled={popOverlay.enabled}
            overlayStyle={popOverlay.style}
            onSelectState={handleSelectState}
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
              strokeWidth={2.5}
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
          scope="us"
          styleMode={popOverlay.style}
          opacity={popOverlay.opacity}
          initialView={viewRef.current}
          width={WIDTH}
          height={HEIGHT}
          borderPathD={US_BORDER_MESH_D}
          clipPathD={NATION_CLIP_D}
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
        scope="us"
      />

      {/* State Hover Tooltip */}
      {hoverTarget && (
        <div
          ref={tooltipRef}
          className="pointer-events-none absolute left-0 top-0 z-10 rounded-lg border border-zinc-800 bg-zinc-950/95 px-3 py-2 text-xs shadow-2xl backdrop-blur-md min-w-44 will-change-transform"
        >
          <div className="font-semibold text-zinc-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 truncate">
              <span className="rounded bg-zinc-800 px-1 py-0.2 text-[10px] font-mono text-zinc-300">
                {hoverTarget.state?.code ?? "US"}
              </span>
              <span className="truncate">
                {hoverTarget.state?.name ?? hoverTarget.name}
              </span>
            </div>
            {hoverTarget.state && (
              <span className="shrink-0 text-[10px] text-zinc-400 font-mono">
                {hoverTarget.state.electoralVotes} EV
              </span>
            )}
          </div>

          <div className="mt-1 flex items-baseline justify-between gap-3">
            <span className="text-cyan-300 font-semibold tabular-nums">
              {hoverTarget.state
                ? formatValue(stat, statValue(stat, hoverTarget.state, mode))
                : "No data"}
            </span>
            {hoverTarget.state && rankByCode.has(hoverTarget.state.code) && (
              <span className="text-[10px] text-zinc-400 font-mono">
                #{rankByCode.get(hoverTarget.state.code)} of 51
              </span>
            )}
          </div>

          {popOverlay.enabled &&
            hoverTarget.state &&
            getPwdDensity(hoverTarget.state.code, true) != null && (
              <div className="mt-1 flex items-center justify-between gap-3 border-t border-zinc-800/80 pt-1 text-[10px]">
                <span className="text-zinc-400">Lived density (GHSL):</span>
                <span className="font-mono font-medium text-amber-300">
                  {getPwdDensity(hoverTarget.state.code, true)!.toLocaleString(
                    "en-US",
                  )}{" "}
                  /km²
                </span>
              </div>
            )}

          {hoverTarget.state?.politics?.presidential2024 && (
            <div className="mt-1.5 flex items-center justify-between border-t border-zinc-800/80 pt-1 text-[10px]">
              <span className="text-zinc-500">2024 Result:</span>
              <span
                className={`font-medium ${
                  hoverTarget.state.politics.presidential2024.winner ===
                  "Democrat"
                    ? "text-sky-400"
                    : "text-rose-400"
                }`}
              >
                {hoverTarget.state.politics.presidential2024.winner ===
                "Democrat"
                  ? "🔵 Harris"
                  : "🔴 Trump"}{" "}
                {hoverTarget.state.politics.presidential2024.margin > 0
                  ? "+"
                  : ""}
                {hoverTarget.state.politics.presidential2024.margin.toFixed(1)}%
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
