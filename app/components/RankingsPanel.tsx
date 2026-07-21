import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown01, ArrowDown10, Download, Search, X } from "lucide-react";
import {
  rankCountries,
  formatValue,
  modeLabels,
  type Mode,
  type StatDef,
} from "~/lib/stats";
import { accentFor } from "~/lib/color";
import type { CountryData } from "~/data/countries";
import { cn } from "~/lib/utils";

export function RankingsPanel({
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
  const rows = useMemo(() => rankCountries(stat, mode), [stat, mode]);
  const [asc, setAsc] = useState(false);
  const [query, setQuery] = useState("");
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const filtered = useMemo(() => {
    let out = rows;
    if (region) out = out.filter((r) => r.country.region === region);
    const q = query.trim().toLowerCase();
    if (q) out = out.filter((r) => r.country.name.toLowerCase().includes(q));
    return out;
  }, [rows, region, query]);

  const ordered = useMemo(() => (asc ? [...filtered].reverse() : filtered), [filtered, asc]);
  
  // Max absolute value for relative bar scaling
  const maxAbs = useMemo(() => {
    let m = 0;
    for (const r of rows) {
      if (Math.abs(r.value) > m) m = Math.abs(r.value);
    }
    return m || 1;
  }, [rows]);

  const accent = accentFor(stat);

  // Auto-scroll selected country into view
  useEffect(() => {
    if (selectedCode && itemRefs.current.has(selectedCode)) {
      itemRefs.current.get(selectedCode)?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedCode]);

  const exportCsv = () => {
    const header = "rank,code,name,region,value";
    const lines = filtered.map(
      ({ country, value, rank }) =>
        `${rank},${country.code},"${country.name.replace(/"/g, '""')}",${country.region},${value}`,
    );
    const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${stat.id}-${modeLabels[mode].replace(/[^a-z]/gi, "")}${region ? `-${region.toLowerCase()}` : ""}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <aside className="flex h-full w-full flex-col bg-zinc-950 md:w-80 md:shrink-0 md:border-l md:border-zinc-800/80">
      <div className="flex items-start justify-between gap-2 border-b border-zinc-800/80 px-4 py-3">
        <div className="min-w-0">
          <div className="text-xs font-semibold text-zinc-200">Rankings</div>
          <div className="mt-0.5 truncate text-[11px] text-zinc-500">
            {stat.label} · {modeLabels[mode]}
            {region ? ` · ${region}` : ""} · {filtered.length} countries
          </div>
        </div>
        <div className="mt-0.5 flex shrink-0 gap-1">
          <button
            onClick={exportCsv}
            title="Download rankings as CSV"
            aria-label="Download CSV"
            className="rounded-md border border-zinc-800 p-1.5 text-zinc-500 transition-colors hover:border-zinc-700 hover:text-zinc-200"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setAsc((a) => !a)}
            title={
              asc
                ? "Showing lowest first — click for highest first"
                : "Showing highest first — click for lowest first"
            }
            aria-label="Flip sort order"
            className="rounded-md border border-zinc-800 p-1.5 text-zinc-500 transition-colors hover:border-zinc-700 hover:text-zinc-200"
          >
            {asc ? <ArrowDown01 className="h-3.5 w-3.5" /> : <ArrowDown10 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      <div className="border-b border-zinc-800/80 px-3 py-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a country…"
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

      <div className="flex-1 overflow-y-auto [scrollbar-width:thin]">
        {ordered.map(({ country, value, rank }) => {
          const active = country.code === selectedCode;
          const barWidthPercent = Math.max(2, (Math.abs(value) / maxAbs) * 100);

          return (
            <button
              key={country.code}
              ref={(el) => {
                if (el) itemRefs.current.set(country.code, el);
                else itemRefs.current.delete(country.code);
              }}
              onClick={() => onSelect(country)}
              className={cn(
                "group flex w-full items-center gap-2.5 border-b border-zinc-900 px-4 py-2 text-left transition-colors",
                active ? "bg-cyan-950/40 border-cyan-800/50" : "hover:bg-zinc-900/70",
              )}
            >
              <span className="w-6 shrink-0 text-right text-[11px] tabular-nums text-zinc-600 font-medium">
                {rank}
              </span>
              <span className="shrink-0 text-sm leading-none">{country.flag}</span>
              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-xs font-medium",
                  active ? "text-cyan-300" : "text-zinc-300 group-hover:text-zinc-100",
                )}
              >
                {country.name}
              </span>
              <span className="relative h-1 w-14 shrink-0 overflow-hidden rounded-full bg-zinc-800">
                <span
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
                  style={{
                    width: `${barWidthPercent}%`,
                    background: value < 0 ? "#fb7185" : accent,
                    opacity: active ? 1 : 0.75,
                  }}
                />
              </span>
              <span className="w-16 shrink-0 text-right text-[11px] tabular-nums text-zinc-400 font-medium">
                {formatValue(stat, value)}
              </span>
            </button>
          );
        })}
        {ordered.length === 0 && (
          <div className="px-4 pt-6 text-center text-xs text-zinc-600">
            No countries match “{query}”
          </div>
        )}
      </div>
    </aside>
  );
}
