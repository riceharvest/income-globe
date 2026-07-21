import { useEffect, useMemo, useState } from "react";
import { Info, Search, X } from "lucide-react";
import { statGroups, stats, type StatDef } from "~/lib/stats";
import { legendGradient } from "~/lib/color";
import { cn } from "~/lib/utils";

export function StatSidebar({
  activeStat,
  onSelect,
  extent,
  formatTick,
}: {
  activeStat: StatDef;
  onSelect: (s: StatDef) => void;
  extent: [number, number];
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
            s.group.toLowerCase().includes(q),
        )
      : stats;
    return statGroups
      .map((g) => ({ group: g, items: filtered.filter((s) => s.group === g) }))
      .filter((g) => g.items.length > 0);
  }, [query]);

  return (
    <aside className="relative flex h-full w-72 shrink-0 flex-col border-r border-zinc-800/80 bg-zinc-950">
      <div className="border-b border-zinc-800/80 px-4 py-3.5">
        <div className="text-sm font-semibold tracking-tight text-zinc-100">
          income<span className="text-cyan-400">·</span>globe
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
            className="w-full rounded-md border border-zinc-800 bg-zinc-900/60 py-1.5 pl-8 pr-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-zinc-700 focus:outline-none"
          />
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
                    ? "bg-zinc-800/80"
                    : "hover:bg-zinc-900",
                )}
              >
                <button
                  onClick={() => onSelect(s)}
                  className={cn(
                    "flex min-w-0 flex-1 items-center justify-between px-2 py-1.5 text-left text-xs",
                    s.id === activeStat.id
                      ? "text-zinc-100"
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
        <div
          className="h-2 w-full rounded-full"
          style={{
            background: `linear-gradient(to right, ${legendGradient().join(",")})`,
          }}
        />
        <div className="mt-1 flex justify-between text-[10px] tabular-nums text-zinc-500">
          <span>{formatTick(extent[0])}</span>
          <span className="text-zinc-600">{activeStat.unit ?? ""}</span>
          <span>{formatTick(extent[1])}</span>
        </div>
      </div>

      {infoStat && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setInfoStat(null)}
          />
          <div className="absolute left-[17.5rem] top-3 z-40 w-80 rounded-lg border border-zinc-700/80 bg-zinc-900 p-4 shadow-2xl">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-sm font-semibold text-zinc-100">
                  {infoStat.label}
                </div>
                <div className="mt-0.5 text-[10px] uppercase tracking-widest text-zinc-500">
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
                aria-label="Close"
                className="rounded-md p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-2.5 text-xs leading-relaxed text-zinc-300">
              {infoStat.info}
            </p>
            <div className="mt-3 border-t border-zinc-800 pt-2.5">
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
              className="mt-3 w-full rounded-md border border-cyan-800/60 bg-cyan-950/40 px-2 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-950/70"
            >
              Show on map
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
