import { useMemo } from "react";
import { rankCountries, formatValue, type Sex, type StatDef } from "~/lib/stats";
import type { CountryData } from "~/data/countries";
import { cn } from "~/lib/utils";

export function RankingsPanel({
  stat,
  sex,
  selectedCode,
  onSelect,
}: {
  stat: StatDef;
  sex: Sex;
  selectedCode: string | null;
  onSelect: (c: CountryData) => void;
}) {
  const rows = useMemo(() => rankCountries(stat, sex), [stat, sex]);
  const max = rows.length > 0 ? rows[0].value : 1;

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-l border-zinc-800/80 bg-zinc-950">
      <div className="border-b border-zinc-800/80 px-4 py-3">
        <div className="text-xs font-semibold text-zinc-200">Rankings</div>
        <div className="mt-0.5 truncate text-[11px] text-zinc-500">
          {stat.label}
          {stat.sexed ? ` · ${sex}` : stat.fixedSex ? ` · ${stat.fixedSex}` : ""}
          {" · "}
          {rows.length} countries
        </div>
      </div>
      <div className="flex-1 overflow-y-auto [scrollbar-width:thin]">
        {rows.map(({ country, value, rank }) => {
          const active = country.code === selectedCode;
          return (
            <button
              key={country.code}
              onClick={() => onSelect(country)}
              className={cn(
                "group flex w-full items-center gap-2.5 border-b border-zinc-900 px-4 py-2 text-left transition-colors",
                active ? "bg-zinc-800/60" : "hover:bg-zinc-900/70",
              )}
            >
              <span className="w-6 shrink-0 text-right text-[11px] tabular-nums text-zinc-600">
                {rank}
              </span>
              <span className="shrink-0 text-sm leading-none">{country.flag}</span>
              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-xs",
                  active ? "text-zinc-100" : "text-zinc-300",
                )}
              >
                {country.name}
              </span>
              <span className="relative h-1 w-14 shrink-0 overflow-hidden rounded-full bg-zinc-800">
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-cyan-500/70"
                  style={{ width: `${Math.max(2, (value / max) * 100)}%` }}
                />
              </span>
              <span className="w-16 shrink-0 text-right text-[11px] tabular-nums text-zinc-400">
                {formatValue(stat, value)}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
