import { useEffect, useMemo, useState } from "react";
import { Info, Search, X } from "lucide-react";
import {
  statGroups,
  stats,
  histogram,
  percentileTicks,
  valueExtent,
  type Mode,
  type StatDef,
} from "~/lib/stats";
import { legendGradient, rampFor } from "~/lib/color";
import { cn } from "~/lib/utils";

export function StatSidebar({
  activeStat,
  mode,
  region,
  onSelect,
  formatTick,
}: {
  activeStat: StatDef;
  mode: Mode;
  region?: string | null;
  onSelect: (s: StatDef) => void;
  formatTick: (v: number) => string;
}) {
  const [query, setQuery] = useState("");
  const [infoStat, setInfoStat] = useState<StatDef | null>(null);

  useEffect(() => {
    if (!infoStat) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setInfoStat(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [infoStat]);

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? stats.filter(
          (s) =>
            s.label.toLowerCase().includes(q) ||
            s.group.toLowerCase().includes(q) ||
            s.info.toLowerCase().includes(q),
        )
      : stats;
    return statGroups
      .map((g) => ({ group: g, items: filtered.filter((s) => s.group === g) }))
      .filter((g) => g.items.length > 0);
  }, [query]);

  return (
    <aside className="relative flex h-full w-72 shrink-0 flex-col border-r border-zinc-800/80 bg-zinc-950">
      <div className="border-b border-zinc-800/80 px-4 py-3.5">
        <div className="text-sm font-semibold tracking-tight text-zinc-100 flex items-center gap-1.5">
          <span>income</span>
          <span className="text-cyan-400 font-bold">·</span>
          <span>globe</span>
        </div>
        <div className="mt-0.5 text-[11px] text-zinc-500">
          Global statistics, mapped by sex
        </div>
      </div>

      <div className="px-3 pt-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stats…"
            className="w-full rounded-md border border-zinc-800 bg-zinc-900/60 py-1.5 pl-8 pr-7 text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-zinc-700 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-2 flex-1 overflow-y-auto px-2 pb-2 [scrollbar-width:thin]">
        {grouped.map(({ group, items }) => (
          <div key={group} className="mt-3 first:mt-1">
            <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
              {group}
            </div>
            {items.map((s) => (
              <div
                key={s.id}
                className={cn(
                  "group flex w-full items-center rounded-md transition-colors",
                  s.id === activeStat.id
                    ? "bg-cyan-950/40 text-cyan-200 border border-cyan-800/40"
                    : "hover:bg-zinc-900",
                )}
              >
                <button
                  onClick={() => onSelect(s)}
                  className={cn(
                    "flex min-w-0 flex-1 items-center justify-between px-2 py-1.5 text-left text-xs font-medium",
                    s.id === activeStat.id
                      ? "text-cyan-300"
                      : "text-zinc-400 group-hover:text-zinc-200",
                  )}
                >
                  <span className="truncate">{s.label}</span>
                  {s.sexed && (
                    <span className="ml-2 shrink-0 rounded border border-zinc-700/70 px-1 text-[9px] font-medium uppercase text-zinc-500">
                      M/F
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setInfoStat(s)}
                  aria-label={`About ${s.label}`}
                  className={cn(
                    "mr-1.5 shrink-0 rounded-full p-1 text-zinc-600 transition-colors hover:bg-zinc-700/60 hover:text-cyan-300",
                    infoStat?.id === s.id && "bg-zinc-700/60 text-cyan-300",
                  )}
                >
                  <Info className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        ))}
        {grouped.length === 0 && (
          <div className="px-2 pt-6 text-center text-xs text-zinc-600">
            No stats match “{query}”
          </div>
        )}
      </div>

      <div className="border-t border-zinc-800/80 px-4 py-3">
        <Distribution stat={activeStat} mode={mode} region={region} formatTick={formatTick} />
      </div>

      {/* Info Modal / Dialog for responsive compatibility */}
      {infoStat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm"
            onClick={() => setInfoStat(null)}
          />
          <div className="relative z-10 w-full max-w-md rounded-xl border border-zinc-700/80 bg-zinc-900 p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-semibold text-zinc-100">
                  {infoStat.label}
                </div>
                <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                  {infoStat.group}
                  {infoStat.unit ? ` · ${infoStat.unit}` : ""}
                  {infoStat.sexed
                    ? " · male & female"
                    : infoStat.fixedSex
                      ? ` · ${infoStat.fixedSex} only`
                      : " · all adults"}
                </div>
              </div>
              <button
                onClick={() => setInfoStat(null)}
                aria-label="Close modal"
                className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-zinc-300">
              {infoStat.info}
            </p>
            <div className="mt-4 border-t border-zinc-800 pt-3">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                How to read the numbers
              </div>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                {infoStat.howToRead}
              </p>
            </div>
            <button
              onClick={() => {
                onSelect(infoStat);
                setInfoStat(null);
              }}
              className="mt-4 w-full rounded-lg border border-cyan-800/60 bg-cyan-950/60 px-3 py-2 text-xs font-medium text-cyan-300 hover:bg-cyan-950 transition-colors"
            >
              Show on map
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}

function Distribution({
  stat,
  mode,
  region,
  formatTick,
}: {
  stat: StatDef;
  mode: Mode;
  region?: string | null;
  formatTick: (v: number) => string;
}) {
  const extent = useMemo(() => valueExtent(stat, mode, region), [stat, mode, region]);
  const hist = useMemo(() => histogram(stat, mode, 24, region), [stat, mode, region]);
  const [p25, p50, p75] = useMemo(() => percentileTicks(stat, mode, region), [stat, mode, region]);
  const ramp = rampFor(stat);
  const [hoveredBin, setHoveredBin] = useState<{ count: number; min: number; max: number } | null>(null);

  const pos = (v: number) =>
    `${Math.min(100, Math.max(0, ((v - extent[0]) / (extent[1] - extent[0])) * 100))}%`;

  return (
    <div className="relative">
      <div className="flex items-center justify-between text-[11px] font-medium text-zinc-400 mb-1.5">
        <span>Global Distribution</span>
        {hoveredBin ? (
          <span className="text-[10px] text-cyan-300 font-mono">
            {hoveredBin.count} countries ({formatTick(hoveredBin.min)}–{formatTick(hoveredBin.max)})
          </span>
        ) : (
          <span className="text-[10px] text-zinc-500 font-mono">
            med: {formatTick(p50)}
          </span>
        )}
      </div>

      {/* Distribution histogram bars */}
      <div className="flex h-9 items-end gap-px" aria-hidden>
        {hist.counts.map((n, i) => {
          const binMin = extent[0] + i * hist.binWidth;
          const binMax = extent[0] + (i + 1) * hist.binWidth;
          return (
            <div
              key={i}
              onMouseEnter={() => setHoveredBin({ count: n, min: binMin, max: binMax })}
              onMouseLeave={() => setHoveredBin(null)}
              className="flex-1 rounded-sm transition-all duration-150 cursor-pointer hover:opacity-100 hover:scale-y-110 origin-bottom"
              style={{
                height: `${Math.max(6, (n / hist.maxCount) * 100)}%`,
                background: ramp((i + 0.5) / hist.counts.length),
                opacity: hoveredBin?.min === binMin ? 1 : 0.75,
              }}
            />
          );
        })}
      </div>

      {/* Color legend */}
      <div
        className="mt-1.5 h-2 w-full rounded-full shadow-inner"
        style={{ background: `linear-gradient(to right, ${legendGradient(stat).join(",")})` }}
      />

      {/* Percentile markers */}
      <div className="relative mt-1 h-3.5 text-[9px] tabular-nums text-zinc-500">
        <span className="absolute -translate-x-1/2 font-mono" style={{ left: pos(p25) }} title={`25th percentile: ${formatTick(p25)}`}>
          p25
        </span>
        <span className="absolute -translate-x-1/2 font-mono text-zinc-300 font-semibold" style={{ left: pos(p50) }} title={`Median (50th percentile): ${formatTick(p50)}`}>
          p50
        </span>
        <span className="absolute -translate-x-1/2 font-mono" style={{ left: pos(p75) }} title={`75th percentile: ${formatTick(p75)}`}>
          p75
        </span>
      </div>

      <div className="flex justify-between text-[10px] tabular-nums text-zinc-500 font-mono">
        <span>{formatTick(extent[0])}</span>
        <span className="text-zinc-300">{formatTick(p50)}</span>
        <span>{formatTick(extent[1])}</span>
      </div>
    </div>
  );
}
