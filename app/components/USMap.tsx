import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { Plus, Minus, RotateCcw } from "lucide-react";
import topoData from "us-atlas/states-albers-10m.json";
import { usStates, usStateByFips, type USStateData } from "~/data/us-states";
import { colorScaleFor, noDataFill, oceanFill, borderStroke } from "~/lib/color";
import {
  formatValue,
  rankCountries,
  statValue,
  valueExtent,
  type Mode,
  type StatDef,
} from "~/lib/stats";
import { MapLegendOverlay } from "~/components/MapLegendOverlay";

interface GeoFeature {
  type: "Feature";
  id: string;
  properties: { name: string };
  geometry: GeoJSON.Geometry;
}

const geoFeatures = (
  feature(
    topoData as never,
    (topoData as unknown as { objects: { states: never } }).objects.states,
  ) as unknown as { features: GeoFeature[] }
).features;

const WIDTH = 960;
const HEIGHT = 600;

export interface HoverInfo {
  state: USStateData | null;
  name: string;
  x: number;
  y: number;
}

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
  const [view, setView] = useState({ k: 1, x: 0, y: 0 });
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ px: number; py: number; x: number; y: number; moved: boolean } | null>(null);

  const path = useMemo(() => geoPath(), []);

  const extent = useMemo<[number, number]>(() => {
    return valueExtent(stat, mode, region, "us");
  }, [stat, mode, region]);

  const fill = useMemo(() => colorScaleFor(stat, extent), [stat, extent]);

  const valueByFips = useMemo(() => {
    const m = new Map<string, number | null>();
    for (const [fips, s] of usStateByFips) {
      m.set(fips, statValue(stat, s, mode));
    }
    return m;
  }, [stat, mode]);

  const rankedEntries = useMemo(() => rankCountries(stat, mode, "us"), [stat, mode]);
  const rankByCode = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of rankedEntries) m.set(r.country.code, r.rank);
    return m;
  }, [rankedEntries]);

  const zoomIn = useCallback(() => {
    setView((v) => ({
      k: Math.min(10, v.k * 1.35),
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
      const k = Math.min(10, Math.max(1, v.k * factor));
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
    const target = (e.target as SVGElement).closest("path[data-fips]");
    if (target) {
      const fips = target.getAttribute("data-fips")!;
      const s = usStateByFips.get(fips) ?? null;
      setHover({
        state: s,
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
    ? Math.min(Math.max(12, hover.x + 14), (containerRect?.width ?? 400) - 220)
    : 0;
  const tooltipY = hover
    ? Math.max(12, Math.min(hover.y - 45, (containerRect?.height ?? 300) - 95))
    : 0;

  const formatTick = useCallback(
    (v: number) =>
      Math.abs(v) >= 1000
        ? v.toLocaleString("en-US", { maximumFractionDigits: 0 })
        : v.toFixed(stat.decimals),
    [stat],
  );

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
          {geoFeatures.map((f) => {
            const fips = f.id;
            const state = usStateByFips.get(fips);
            const v = valueByFips.get(fips);
            const isSelected = state != null && state.code === selectedCode;
            const dimmed = region != null && state != null && state.region !== region;
            return (
              <path
                key={f.id}
                data-fips={fips}
                data-code={state?.code}
                data-name={state?.name ?? f.properties.name}
                d={path(f as unknown as GeoJSON.Feature) ?? ""}
                fill={v != null ? fill(v) : noDataFill}
                fillOpacity={dimmed ? 0.15 : 1}
                stroke={isSelected ? "#38bdf8" : "#27272a"}
                strokeWidth={isSelected ? 2.5 / view.k : 0.6 / view.k}
                tabIndex={state ? 0 : -1}
                role={state ? "button" : undefined}
                aria-label={
                  state
                    ? `${state.name}: ${formatValue(stat, v ?? null)}`
                    : f.properties.name
                }
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && state) {
                    e.preventDefault();
                    onSelect(state);
                  }
                }}
                className="transition-[fill,opacity,stroke-width] duration-150 hover:brightness-150 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                onClick={() => {
                  if (!drag.current?.moved && state) onSelect(state);
                }}
              />
            );
          })}
        </g>
      </svg>

      {/* Floating Map Legend Overlay */}
      <MapLegendOverlay
        stat={stat}
        mode={mode}
        region={region}
        formatTick={formatTick}
        scope="us"
      />

      {/* State Hover Tooltip */}
      {hover && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg border border-zinc-800 bg-zinc-950/95 px-3 py-2 text-xs shadow-2xl backdrop-blur-md animate-fade-in min-w-44"
          style={{
            left: tooltipX,
            top: tooltipY,
          }}
        >
          <div className="font-semibold text-zinc-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 truncate">
              <span className="rounded bg-zinc-800 px-1 py-0.2 text-[10px] font-mono text-zinc-300">
                {hover.state?.code ?? "US"}
              </span>
              <span className="truncate">{hover.state?.name ?? hover.name}</span>
            </div>
            {hover.state && (
              <span className="shrink-0 text-[10px] text-zinc-400 font-mono">
                {hover.state.electoralVotes} EV
              </span>
            )}
          </div>

          <div className="mt-1 flex items-baseline justify-between gap-3">
            <span className="text-cyan-300 font-semibold tabular-nums">
              {hover.state
                ? formatValue(stat, statValue(stat, hover.state, mode))
                : "No data"}
            </span>
            {hover.state && rankByCode.has(hover.state.code) && (
              <span className="text-[10px] text-zinc-400 font-mono">
                #{rankByCode.get(hover.state.code)} of 51
              </span>
            )}
          </div>

          {/* Presidential split badge */}
          {hover.state?.politics?.presidential2024 && (
            <div className="mt-1.5 flex items-center justify-between border-t border-zinc-800/80 pt-1 text-[10px]">
              <span className="text-zinc-500">2024 Result:</span>
              <span
                className={`font-medium ${
                  hover.state.politics.presidential2024.winner === "Democrat"
                    ? "text-sky-400"
                    : "text-rose-400"
                }`}
              >
                {hover.state.politics.presidential2024.winner === "Democrat" ? "🔵 Harris" : "🔴 Trump"}{" "}
                {hover.state.politics.presidential2024.margin > 0 ? "+" : ""}
                {hover.state.politics.presidential2024.margin.toFixed(1)}%
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
