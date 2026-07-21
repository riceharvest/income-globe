import { useEffect } from "react";
import { MapPin, Pin, PinOff, X } from "lucide-react";
import type { CountryData } from "~/data/countries";
import {
  formatValue,
  statGroups,
  stats,
  statValue,
  type Mode,
  type StatDef,
} from "~/lib/stats";
import { accentFor } from "~/lib/color";
import { cn } from "~/lib/utils";

function ComparisonStatRow({
  stat,
  country,
  pinned,
  mode,
}: {
  stat: StatDef;
  country: CountryData;
  pinned: CountryData | null;
  mode: Mode;
}) {
  const curVal = statValue(stat, country, mode);
  const pinVal = pinned ? statValue(stat, pinned, mode) : null;
  const delta = curVal != null && pinVal != null ? curVal - pinVal : null;

  if (pinned) {
    return (
      <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2 py-1 text-xs">
        <span className="truncate text-zinc-400 font-medium">
          {stat.label}
          {stat.fixedSex && (
            <span className="ml-1 text-[9px] uppercase text-zinc-600">
              {stat.fixedSex === "female" ? "♀" : "♂"}
            </span>
          )}
        </span>
        <span className="w-16 text-right tabular-nums text-zinc-200 font-medium">
          {formatValue(stat, curVal)}
        </span>
        <span className="w-16 text-right tabular-nums text-zinc-500">
          {formatValue(stat, pinVal)}
        </span>
        <span className="w-16 text-right tabular-nums text-[11px]">
          {delta != null ? (
            <span className={delta >= 0 ? "text-emerald-400" : "text-rose-400"}>
              {delta >= 0 ? "+" : ""}
              {formatValue(stat, delta)}
            </span>
          ) : (
            "—"
          )}
        </span>
      </div>
    );
  }

  if (stat.sexed) {
    const m = stat.get(country, "male");
    const f = stat.get(country, "female");
    return (
      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 py-1 text-xs">
        <span className="truncate text-zinc-400 font-medium">{stat.label}</span>
        <span className="w-16 text-right tabular-nums text-zinc-200">
          {formatValue(stat, m)}
        </span>
        <span className="w-16 text-right tabular-nums text-zinc-200">
          {formatValue(stat, f)}
        </span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3 py-1 text-xs">
      <span className="truncate text-zinc-400 font-medium">
        {stat.label}
        {stat.fixedSex && (
          <span className="ml-1.5 text-[10px] uppercase text-zinc-600">
            {stat.fixedSex === "female" ? "♀" : "♂"}
          </span>
        )}
      </span>
      <span className="text-right tabular-nums text-zinc-200 font-medium">
        {formatValue(stat, curVal)}
      </span>
    </div>
  );
}

export function CountryDrawer({
  country,
  activeStat,
  mode,
  pinned,
  onPin,
  onClose,
  onSelectStat,
}: {
  country: CountryData | null;
  activeStat: StatDef;
  mode: Mode;
  pinned: CountryData | null;
  onPin: (c: CountryData | null) => void;
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

  const isPinned = pinned?.code === country.code;
  const comparing = pinned != null && !isPinned;
  const cur = statValue(activeStat, country, mode);
  const pinVal = comparing ? statValue(activeStat, pinned, mode) : null;
  const delta = cur != null && pinVal != null ? cur - pinVal : null;

  return (
    <div className="absolute inset-y-0 right-0 z-20 flex w-[28rem] max-w-[92vw] flex-col border-l border-zinc-800/90 bg-zinc-950/98 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-zinc-800/90 px-5 py-4">
        <div>
          <div className="text-base font-semibold text-zinc-100 flex items-center gap-2">
            <span>{country.flag}</span>
            <span>{country.name}</span>
          </div>
          <div className="mt-0.5 text-[11px] text-zinc-500">
            {country.region} · pop. {(country.population / 1e6).toFixed(1)}M ·{" "}
            {country.dataSource} {country.dataYear}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPin(isPinned ? null : country)}
            title={isPinned ? "Unpin country" : "Pin country to compare against others"}
            aria-label={isPinned ? "Unpin country" : "Pin to compare"}
            className={cn(
              "rounded-md p-1.5 transition-colors hover:bg-zinc-800",
              isPinned ? "text-cyan-400 bg-cyan-950/50 border border-cyan-800/50" : "text-zinc-500 hover:text-zinc-200",
            )}
          >
            {isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
          </button>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            aria-label="Close country drawer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Selected stat card */}
      <div className="border-b border-zinc-800/80 bg-zinc-900/40 px-5 py-3.5">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
          Active Map Statistic
        </div>
        <div className="mt-1 flex items-baseline justify-between">
          <span className="text-sm font-medium text-zinc-200">{activeStat.label}</span>
          <span className="text-xl font-bold tabular-nums" style={{ color: accentFor(activeStat) }}>
            {formatValue(activeStat, cur)}
          </span>
        </div>
        {activeStat.sexed && mode !== "gap" && (
          <div className="mt-0.5 text-[11px] text-zinc-500">
            Showing {mode} · {mode === "male" ? "Female" : "Male"}:{" "}
            <span className="text-zinc-300">
              {formatValue(activeStat, activeStat.get(country, mode === "male" ? "female" : "male"))}
            </span>
          </div>
        )}

        {comparing && (
          <div className="mt-3 rounded-lg border border-cyan-900/50 bg-cyan-950/30 p-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="truncate text-zinc-300 font-medium flex items-center gap-1.5">
                <Pin className="h-3.5 w-3.5 text-cyan-400" />
                <span>{pinned.flag} {pinned.name} (Pinned)</span>
              </span>
              <span className="tabular-nums font-semibold text-zinc-200">
                {formatValue(activeStat, pinVal)}
              </span>
            </div>
            {delta != null && (
              <div className="mt-1 text-right text-[11px] tabular-nums text-zinc-400">
                {country.name} difference:{" "}
                <span className={cn("font-semibold", delta >= 0 ? "text-emerald-400" : "text-rose-400")}>
                  {delta >= 0 ? "+" : ""}
                  {formatValue(activeStat, delta)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* All stats groups */}
      <div className="flex-1 overflow-y-auto px-5 pb-6 [scrollbar-width:thin]">
        {statGroups.map((group) => {
          const items = stats.filter((s) => s.group === group);
          if (items.length === 0) return null;

          return (
            <div key={group} className="mt-5">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                  {group}
                </span>
                {comparing ? (
                  <div className="grid grid-cols-3 gap-2 text-[9px] font-semibold uppercase text-zinc-500 text-right w-48">
                    <span>{country.code}</span>
                    <span>{pinned.code}</span>
                    <span>Δ</span>
                  </div>
                ) : items.some((s) => s.sexed) ? (
                  <span className="text-[9px] font-semibold uppercase text-zinc-500">
                    Male / Female
                  </span>
                ) : null}
              </div>

              <div className="divide-y divide-zinc-900/60">
                {items.map((s) => {
                  const isActive = s.id === activeStat.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => onSelectStat(s)}
                      title={`Click to map "${s.label}" across the globe`}
                      className={cn(
                        "group block w-full text-left transition-colors px-1 rounded-sm",
                        isActive
                          ? "bg-cyan-950/40 text-cyan-200"
                          : "hover:bg-zinc-900/60",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0 pr-2">
                          <ComparisonStatRow
                            stat={s}
                            country={country}
                            pinned={pinned}
                            mode={mode}
                          />
                        </div>
                        <MapPin
                          className={cn(
                            "h-3 w-3 shrink-0 transition-opacity",
                            isActive
                              ? "opacity-100 text-cyan-400"
                              : "opacity-0 group-hover:opacity-60 text-zinc-400",
                          )}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
