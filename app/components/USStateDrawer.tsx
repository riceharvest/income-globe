import { useEffect } from "react";
import { MapPin, Pin, PinOff, X, Vote } from "lucide-react";
import type { USStateData } from "~/data/us-states";
import {
  formatValue,
  statGroups,
  stats,
  statValue,
  rankCountries,
  type Mode,
  type StatDef,
} from "~/lib/stats";
import { accentFor } from "~/lib/color";
import { cn } from "~/lib/utils";

function StateStatRow({
  stat,
  state,
  pinned,
  mode,
}: {
  stat: StatDef;
  state: USStateData;
  pinned: USStateData | null;
  mode: Mode;
}) {
  const curVal = statValue(stat, state, mode);
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
    const m = stat.get(state, "male");
    const f = stat.get(state, "female");
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

export function USStateDrawer({
  state,
  activeStat,
  mode,
  pinned,
  onPin,
  onClose,
  onSelectStat,
}: {
  state: USStateData | null;
  activeStat: StatDef;
  mode: Mode;
  pinned: USStateData | null;
  onPin: (s: USStateData | null) => void;
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

  if (!state) return null;

  const isPinned = pinned?.code === state.code;
  const comparing = pinned != null && !isPinned;
  const cur = statValue(activeStat, state, mode);
  const pinVal = comparing ? statValue(activeStat, pinned, mode) : null;
  const delta = cur != null && pinVal != null ? cur - pinVal : null;

  const rankedStates = rankCountries(activeStat, mode, "us");
  const rank = rankedStates.findIndex((r) => r.country.code === state.code) + 1;

  const pres = state.politics.presidential2024;
  const ideo = state.politics.ideology;
  const lean = state.politics.partyLean;

  return (
    <div className="absolute inset-y-0 right-0 z-20 flex w-[28rem] max-w-[92vw] flex-col border-l border-zinc-800/90 bg-zinc-950/98 shadow-2xl backdrop-blur-md animate-drawer-in">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-zinc-800/90 px-5 py-4">
        <div>
          <div className="text-base font-semibold text-zinc-100 flex items-center gap-2">
            <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs font-mono font-bold text-cyan-300">
              {state.code}
            </span>
            <span>{state.name}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-zinc-400">
            <span>Capital: <span className="text-zinc-300">{state.capital}</span></span>
            <span>·</span>
            <span>{state.region} ({state.division})</span>
            <span>·</span>
            <span>pop. {(state.population / 1e6).toFixed(1)}M</span>
            <span>·</span>
            <span className="text-amber-400 font-medium">{state.electoralVotes} EVs</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPin(isPinned ? null : state)}
            title={isPinned ? "Unpin state" : "Pin state to compare against others"}
            aria-label={isPinned ? "Unpin state" : "Pin to compare"}
            className={cn(
              "rounded-md p-1.5 transition-colors hover:bg-zinc-800",
              isPinned
                ? "text-cyan-400 bg-cyan-950/50 border border-cyan-800/50"
                : "text-zinc-500 hover:text-zinc-200",
            )}
          >
            {isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
          </button>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            aria-label="Close state drawer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Featured Political Views Split Card */}
      <div className="border-b border-zinc-800/80 bg-zinc-900/60 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
            <Vote className="h-3.5 w-3.5 text-cyan-400" />
            <span>2024 Political Views Split</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                pres.winner === "Democrat"
                  ? "bg-sky-950 text-sky-300 border border-sky-800/60"
                  : "bg-rose-950 text-rose-300 border border-rose-800/60",
              )}
            >
              {pres.winner === "Democrat" ? "🔵 Harris" : "🔴 Trump"} +{Math.abs(pres.margin).toFixed(1)}%
            </span>
            <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
              PVI {state.politics.cookPVI}
            </span>
          </div>
        </div>

        {/* 2024 Presidential Vote Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-semibold text-sky-400 flex items-center gap-1">
              <span>Harris (Dem)</span>
              <span className="font-mono">{pres.demPercent.toFixed(1)}%</span>
            </span>
            <span className="text-[10px] text-zinc-500">
              {pres.otherPercent > 0 ? `Other ${pres.otherPercent.toFixed(1)}%` : ""}
            </span>
            <span className="font-semibold text-rose-400 flex items-center gap-1">
              <span className="font-mono">{pres.repPercent.toFixed(1)}%</span>
              <span>Trump (Rep)</span>
            </span>
          </div>

          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              style={{ width: `${pres.demPercent}%` }}
              className="bg-sky-500 transition-all duration-300"
              title={`Democrat (Harris): ${pres.demPercent}%`}
            />
            {pres.otherPercent > 0 && (
              <div
                style={{ width: `${pres.otherPercent}%` }}
                className="bg-zinc-600 transition-all duration-300"
                title={`Other: ${pres.otherPercent}%`}
              />
            )}
            <div
              style={{ width: `${pres.repPercent}%` }}
              className="bg-rose-500 transition-all duration-300"
              title={`Republican (Trump): ${pres.repPercent}%`}
            />
          </div>
        </div>

        {/* Political Ideology Breakdown */}
        <div className="mt-3.5 pt-3 border-t border-zinc-800/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
            Self-Identified Ideology (Pew / Gallup)
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded border border-rose-950/80 bg-rose-950/30 p-1.5">
              <div className="text-[10px] text-rose-300/80 font-medium">Conservative</div>
              <div className="text-sm font-bold text-rose-400 font-mono mt-0.5">{ideo.conservative}%</div>
            </div>
            <div className="rounded border border-purple-950/80 bg-purple-950/30 p-1.5">
              <div className="text-[10px] text-purple-300/80 font-medium">Moderate</div>
              <div className="text-sm font-bold text-purple-400 font-mono mt-0.5">{ideo.moderate}%</div>
            </div>
            <div className="rounded border border-sky-950/80 bg-sky-950/30 p-1.5">
              <div className="text-[10px] text-sky-300/80 font-medium">Liberal</div>
              <div className="text-sm font-bold text-sky-400 font-mono mt-0.5">{ideo.liberal}%</div>
            </div>
          </div>
        </div>

        {/* Party Lean */}
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-zinc-400">
          <span>Party Lean:</span>
          <div className="flex gap-2 text-[11px] font-mono">
            <span className="text-sky-400">Dem {lean.democrat}%</span>
            <span className="text-zinc-500">·</span>
            <span className="text-rose-400">Rep {lean.republican}%</span>
            <span className="text-zinc-500">·</span>
            <span className="text-zinc-400">Ind {lean.independent}%</span>
          </div>
        </div>
      </div>

      {/* Selected Map Stat Card */}
      <div className="border-b border-zinc-800/80 bg-zinc-900/40 px-5 py-3.5">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 flex items-center justify-between">
          <span>Active Map Statistic</span>
          {rank > 0 && (
            <span className="font-mono text-cyan-400">Rank #{rank} of 51</span>
          )}
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
              {formatValue(activeStat, activeStat.get(state, mode === "male" ? "female" : "male"))}
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
                {state.name} difference:{" "}
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
                    <span>{state.code}</span>
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
                      title={`Click to map "${s.label}" across all US states`}
                      className={cn(
                        "group block w-full text-left transition-colors px-1 rounded-sm",
                        isActive
                          ? "bg-cyan-950/40 text-cyan-200"
                          : "hover:bg-zinc-900/60",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0 pr-2">
                          <StateStatRow
                            stat={s}
                            state={state}
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
