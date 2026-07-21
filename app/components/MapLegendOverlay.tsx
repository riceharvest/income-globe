import { useMemo } from "react";
import { type StatDef, type Mode, valueExtent, percentileTicks } from "~/lib/stats";
import { legendGradient, accentFor } from "~/lib/color";

interface MapLegendOverlayProps {
  stat: StatDef;
  mode: Mode;
  region: string | null;
  formatTick: (v: number) => string;
}

export function MapLegendOverlay({ stat, mode, region, formatTick }: MapLegendOverlayProps) {
  const extent = useMemo(() => valueExtent(stat, mode, region), [stat, mode, region]);
  const [, p50] = useMemo(() => percentileTicks(stat, mode, region), [stat, mode, region]);
  const gradientStops = useMemo(() => legendGradient(stat), [stat]);
  const accent = useMemo(() => accentFor(stat), [stat]);

  return (
    <div className="pointer-events-none absolute bottom-3 left-3 z-10 hidden sm:flex flex-col gap-1.5 rounded-xl border border-zinc-800/80 bg-zinc-950/85 p-3 shadow-xl backdrop-blur-md max-w-xs text-xs">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate font-semibold text-zinc-100 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
            <span className="truncate">{stat.label}</span>
          </div>
          <div className="truncate text-[10px] text-zinc-400">
            {region ? `${region} · ` : ""}{extent[0] === 0 && extent[1] === 1 ? "No data" : "Color Scale"}
          </div>
        </div>
      </div>

      {/* Gradient Scale Bar */}
      <div className="mt-0.5">
        <div
          className="h-2.5 w-48 rounded-full border border-zinc-800/60 shadow-inner"
          style={{ background: `linear-gradient(to right, ${gradientStops.join(",")})` }}
        />
        <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-zinc-400">
          <span>{formatTick(extent[0])}</span>
          <span className="text-zinc-200 font-medium">{formatTick(p50)} (med)</span>
          <span>{formatTick(extent[1])}</span>
        </div>
      </div>
    </div>
  );
}
