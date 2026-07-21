import { useEffect } from "react";
import { X } from "lucide-react";
import type { CountryData } from "~/data/countries";
import { formatValue, statGroups, stats, type Sex, type StatDef } from "~/lib/stats";
import { accentFor } from "~/lib/color";
import { cn } from "~/lib/utils";

function StatRow({ stat, country }: { stat: StatDef; country: CountryData }) {
  if (stat.sexed) {
    const m = stat.get(country, "male");
    const f = stat.get(country, "female");
    return (
      <div className="grid grid-cols-[1fr_auto_auto] items-baseline gap-3 py-1">
        <span className="truncate text-xs text-zinc-400">{stat.label}</span>
        <span className="w-20 text-right text-xs tabular-nums text-zinc-200">
          {formatValue(stat, m)}
        </span>
        <span className="w-20 text-right text-xs tabular-nums text-zinc-200">
          {formatValue(stat, f)}
        </span>
      </div>
    );
  }
  const v = stat.get(country, stat.fixedSex ?? "male");
  return (
    <div className="grid grid-cols-[1fr_auto] items-baseline gap-3 py-1">
      <span className="truncate text-xs text-zinc-400">
        {stat.label}
        {stat.fixedSex && (
          <span className="ml-1.5 text-[10px] uppercase text-zinc-600">
            {stat.fixedSex === "female" ? "♀" : "♂"}
          </span>
        )}
      </span>
      <span className="text-right text-xs tabular-nums text-zinc-200">
        {formatValue(stat, v)}
      </span>
    </div>
  );
}

export function CountryDrawer({
  country,
  activeStat,
  sex,
  onClose,
  onSelectStat,
}: {
  country: CountryData | null;
  activeStat: StatDef;
  sex: Sex;
  onClose: () => void;
  onSelectStat: (s: StatDef) => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!country) return null;

  return (
    <div className="absolute inset-y-0 right-0 z-20 flex w-[26rem] max-w-[92vw] flex-col border-l border-zinc-800 bg-zinc-950/98 shadow-2xl backdrop-blur">
      <div className="flex items-start justify-between border-b border-zinc-800 px-5 py-4">
        <div>
          <div className="text-base font-semibold text-zinc-100">
            {country.flag} {country.name}
          </div>
          <div className="mt-0.5 text-[11px] text-zinc-500">
            {country.region} · pop. {(country.population / 1e6).toFixed(1)}M ·{" "}
            {country.dataSource} {country.dataYear}
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div
        className={cn(
          "border-b border-zinc-800 px-5 py-3",
        )}
      >
        <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
          Selected stat
        </div>
        <div className="mt-1 flex items-baseline justify-between">
          <span className="text-sm text-zinc-200">{activeStat.label}</span>
          <span className="text-lg font-semibold tabular-nums" style={{ color: accentFor(activeStat) }}>
            {formatValue(activeStat, activeStat.get(country, sex))}
          </span>
        </div>
        {activeStat.sexed && (
          <div className="mt-0.5 text-[11px] text-zinc-500">
            showing {sex} · switch to{" "}
            {formatValue(
              activeStat,
              activeStat.get(country, sex === "male" ? "female" : "male"),
            )}{" "}
            for {sex === "male" ? "female" : "male"}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-6 [scrollbar-width:thin]">
        {statGroups.map((group) => {
          const items = stats.filter((s) => s.group === group);
          if (items.length === 0) return null;
          const anySexed = items.some((s) => s.sexed);
          return (
            <div key={group} className="mt-5">
              <div className="flex items-baseline justify-between border-b border-zinc-900 pb-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                  {group}
                </span>
                {anySexed && (
                  <span className="text-[9px] uppercase tracking-wide text-zinc-700">
                    M / F
                  </span>
                )}
              </div>
              <div className="divide-y divide-zinc-900/60">
                {items.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onSelectStat(s)}
                    className={cn(
                      "block w-full text-left hover:bg-zinc-900/50",
                      s.id === activeStat.id && "bg-cyan-950/30",
                    )}
                  >
                    <StatRow stat={s} country={country} />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
