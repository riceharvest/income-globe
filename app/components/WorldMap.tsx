import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { geoEqualEarth, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { Plus, Minus, RotateCcw } from "lucide-react";
import topoData from "world-atlas/countries-110m.json";
import { countries, type CountryData } from "~/data/countries";
import { colorScaleFor, noDataFill, oceanFill, borderStroke } from "~/lib/color";
import { formatValue, statValue, type Mode, type StatDef } from "~/lib/stats";

interface GeoFeature {
  type: "Feature";
  id?: string;
  properties: { name?: string };
  geometry: GeoJSON.Geometry;
}

const geoFeatures = (
  feature(
    topoData as never,
    (topoData as unknown as { objects: { countries: never } }).objects.countries,
  ) as unknown as { features: GeoFeature[] }
).features;

const byNumeric = new Map<number, CountryData>();
for (const c of countries) {
  const n = parseInt(c.numericCode, 10);
  if (Number.isFinite(n)) byNumeric.set(n, c);
}

const WIDTH = 1000;
const HEIGHT = 520;

export interface HoverInfo {
  country: CountryData | null;
  name: string;
  x: number;
  y: number;
}

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
  const [view, setView] = useState({ k: 1, x: 0, y: 0 });
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ px: number; py: number; x: number; y: number; moved: boolean } | null>(null);

  const path = useMemo(() => {
    const projection = geoEqualEarth().fitExtent(
      [
        [4, 4],
        [WIDTH - 4, HEIGHT - 4],
      ],
      { type: "Sphere" } as unknown as GeoJSON.Feature,
    );
    return geoPath(projection);
  }, []);

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

  const valueByNumeric = useMemo(() => {
    const m = new Map<number, number | null>();
    for (const [n, c] of byNumeric) m.set(n, statValue(stat, c, mode));
    return m;
  }, [stat, mode]);

  const zoomIn = useCallback(() => {
    setView((v) => ({
      k: Math.min(12, v.k * 1.35),
      x: v.x - (WIDTH * 0.35) / 2,
      y: v.y - (HEIGHT * 0.35) / 2,
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setView((v) => {
      const k = Math.max(1, v.k / 1.35);
      return k === 1 ? { k: 1, x: 0, y: 0 } : { k, x: v.x + (WIDTH * 0.35) / 2, y: v.y + (HEIGHT * 0.35) / 2 };
    });
  }, []);

  const resetZoom = useCallback(() => {
    setView({ k: 1, x: 0, y: 0 });
  }, []);

  const onWheel = useCallback((e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = ((e.clientX - rect.left) / rect.width) * WIDTH;
    const my = ((e.clientY - rect.top) / rect.height) * HEIGHT;
    setView((v) => {
      const factor = e.deltaY < 0 ? 1.25 : 0.8;
      const k = Math.min(12, Math.max(1, v.k * factor));
      const scale = k / v.k;
      return {
        k,
        x: mx - (mx - v.x) * scale,
        y: my - (my - v.y) * scale,
      };
    });
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setView((v) => {
      drag.current = { px: e.clientX, py: e.clientY, x: v.x, y: v.y, moved: false };
      return v;
    });
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    const d = drag.current;
    const rect = svgRef.current?.getBoundingClientRect();
    if (d) {
      const dx = e.clientX - d.px;
      const dy = e.clientY - d.py;
      if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true;
      if (rect) {
        setView((v) => ({
          ...v,
          x: d.x + (dx / rect.width) * WIDTH,
          y: d.y + (dy / rect.height) * HEIGHT,
        }));
      }
      return;
    }
    if (!rect) return;
    const target = (e.target as SVGElement).closest("path[data-num]");
    if (target) {
      const num = parseInt(target.getAttribute("data-num")!, 10);
      const c = byNumeric.get(num) ?? null;
      setHover({
        country: c,
        name: target.getAttribute("data-name") ?? "",
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    } else {
      setHover(null);
    }
  }, []);

  const onPointerUp = useCallback(() => {
    drag.current = null;
  }, []);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => e.preventDefault();
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  const containerRect = svgRef.current?.getBoundingClientRect();
  const tooltipX = hover
    ? Math.min(Math.max(12, hover.x + 14), (containerRect?.width ?? 400) - 180)
    : 0;
  const tooltipY = hover
    ? Math.max(12, Math.min(hover.y - 45, (containerRect?.height ?? 300) - 60))
    : 0;

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: oceanFill }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-full w-full cursor-grab active:cursor-grabbing"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={() => {
          setHover(null);
          drag.current = null;
        }}
      >
        <g transform={`translate(${view.x},${view.y}) scale(${view.k})`}>
          <path d={path({ type: "Sphere" } as unknown as GeoJSON.Feature) ?? ""} fill={oceanFill} />
          {geoFeatures.map((f) => {
            const num = f.id ? parseInt(f.id, 10) : NaN;
            const country = byNumeric.get(num);
            const v = valueByNumeric.get(num);
            const isSelected = country != null && country.code === selectedCode;
            const dimmed = region != null && country != null && country.region !== region;
            return (
              <path
                key={f.id ?? f.properties.name}
                data-num={Number.isFinite(num) ? num : undefined}
                data-name={country?.name ?? f.properties.name ?? ""}
                d={path(f as unknown as GeoJSON.Feature) ?? ""}
                fill={v != null ? fill(v) : noDataFill}
                fillOpacity={dimmed ? 0.12 : 1}
                stroke={isSelected ? "#38bdf8" : borderStroke}
                strokeWidth={isSelected ? 1.8 / view.k : 0.4 / view.k}
                tabIndex={country ? 0 : -1}
                role={country ? "button" : undefined}
                aria-label={
                  country
                    ? `${country.name}: ${formatValue(stat, v ?? null)}`
                    : f.properties.name ?? "Country"
                }
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && country) {
                    e.preventDefault();
                    onSelect(country);
                  }
                }}
                className="transition-[fill,opacity,stroke-width] duration-150 hover:brightness-150 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                onClick={() => {
                  if (!drag.current?.moved && country) onSelect(country);
                }}
              />
            );
          })}
        </g>
      </svg>

      {hover && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg border border-zinc-800 bg-zinc-950/95 px-3 py-2 text-xs shadow-2xl backdrop-blur-md"
          style={{
            left: tooltipX,
            top: tooltipY,
          }}
        >
          <div className="font-semibold text-zinc-100 flex items-center gap-1.5">
            {hover.country ? (
              <>
                <span className="text-sm">{hover.country.flag}</span>
                <span>{hover.country.name}</span>
              </>
            ) : (
              hover.name
            )}
          </div>
          <div className="mt-0.5 text-cyan-300 font-medium tabular-nums">
            {hover.country
              ? formatValue(stat, statValue(stat, hover.country, mode))
              : "No data"}
          </div>
        </div>
      )}

      {/* Map Control Buttons */}
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
        {view.k > 1 && (
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
