import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { HelpCircle, ListFilter, Search, Table2, X } from "lucide-react";
import type { Route } from "./+types/home";
import { getCountryByCode, regions, type CountryData } from "~/data/countries";
import {
  defaultStatId,
  rankCountries,
  statsById,
  type Mode,
  type StatDef,
} from "~/lib/stats";
import { WorldMap } from "~/components/WorldMap";
import { StatSidebar } from "~/components/StatSidebar";
import { RankingsPanel } from "~/components/RankingsPanel";
import { CountryDrawer } from "~/components/CountryDrawer";
import { SexToggle } from "~/components/SexToggle";
import { CommandPalette } from "~/components/CommandPalette";
import { KeyboardShortcutsModal } from "~/components/KeyboardShortcutsModal";
import { cn } from "~/lib/utils";

export function meta(_: Route.MetaArgs) {
  return [{ title: "income·globe — world statistics by sex" }];
}

const validModes: Mode[] = ["male", "female", "gap"];

export default function Home() {
  const [params, setParams] = useSearchParams();

  const statId = params.get("stat") ?? defaultStatId;
  const stat = statsById.get(statId) ?? statsById.get(defaultStatId)!;
  const rawMode = params.get("sex") ?? "female";
  const mode: Mode = (validModes as string[]).includes(rawMode)
    ? (rawMode as Mode)
    : "female";
  const selectedCode = params.get("country");
  const region = params.get("region");

  // Modals state
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const patchParams = useCallback(
    (patch: Record<string, string | null>) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [k, v] of Object.entries(patch)) {
            if (v == null) next.delete(k);
            else next.set(k, v);
          }
          return next;
        },
        { preventScrollReset: true },
      );
    },
    [setParams],
  );

  const selectStat = useCallback(
    (s: StatDef) => patchParams({ stat: s.id === defaultStatId ? null : s.id }),
    [patchParams],
  );
  const setMode = useCallback((m: Mode) => patchParams({ sex: m }), [patchParams]);
  const setRegion = useCallback(
    (r: string | null) => patchParams({ region: r }),
    [patchParams],
  );
  const selectCountry = useCallback(
    (c: CountryData) =>
      patchParams({ country: selectedCode === c.code ? null : c.code }),
    [patchParams, selectedCode],
  );

  const selected = selectedCode ? getCountryByCode(selectedCode) ?? null : null;
  const [pinnedCode, setPinnedCode] = useState<string | null>(null);
  const pinned = pinnedCode ? getCountryByCode(pinnedCode) ?? null : null;

  // Mobile panel overlays
  const [mobilePanel, setMobilePanel] = useState<"stats" | "rankings" | null>(null);

  // Keyboard navigation & global shortcuts
  const orderedCodes = useMemo(
    () =>
      rankCountries(stat, mode)
        .filter((r) => !region || r.country.region === region)
        .map((r) => r.country.code),
    [stat, mode, region],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return;

      // Cmd+K or Ctrl+K or / -> Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsPaletteOpen((v) => !v);
        return;
      }
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsPaletteOpen(true);
        return;
      }
      // ? -> Keyboard shortcuts modal
      if (e.key === "?" && e.shiftKey) {
        e.preventDefault();
        setIsShortcutsOpen((v) => !v);
        return;
      }
      // M/F/G hotkeys for sex toggle (when sexed stat)
      if (stat.sexed) {
        if (e.key.toLowerCase() === "m") {
          setMode("male");
          return;
        }
        if (e.key.toLowerCase() === "f") {
          setMode("female");
          return;
        }
        if (e.key.toLowerCase() === "g") {
          setMode("gap");
          return;
        }
      }

      // Arrow keys for country navigation
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const dir = e.key === "ArrowDown" ? 1 : -1;
        const idx = selectedCode ? orderedCodes.indexOf(selectedCode) : -1;
        const next =
          idx === -1
            ? orderedCodes[0]
            : orderedCodes[(idx + dir + orderedCodes.length) % orderedCodes.length];
        if (next) patchParams({ country: next });
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [orderedCodes, selectedCode, patchParams, stat.sexed, setMode]);

  const formatTick = useCallback(
    (v: number) =>
      Math.abs(v) >= 1000
        ? v.toLocaleString("en-US", { maximumFractionDigits: 0 })
        : v.toFixed(stat.decimals),
    [stat],
  );

  const modeLabel = stat.sexed
    ? mode === "gap"
      ? "male − female difference"
      : `${mode} values`
    : stat.fixedSex
      ? `${stat.fixedSex} only`
      : "all adults";

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-zinc-950 text-zinc-200">
      {/* Desktop Stat Sidebar */}
      <div className="hidden md:flex">
        <StatSidebar
          activeStat={stat}
          mode={mode}
          region={region}
          onSelect={selectStat}
          formatTick={formatTick}
        />
      </div>

      <main className="relative flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-zinc-800/80 px-3 py-2.5 md:px-4">
          <div className="flex min-w-0 items-center gap-2">
            <button
              onClick={() => setMobilePanel("stats")}
              aria-label="Open stats"
              className="rounded-md border border-zinc-800 p-1.5 text-zinc-400 md:hidden hover:bg-zinc-800"
            >
              <ListFilter className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-400 md:hidden">
                  income<span className="text-cyan-400">·</span>globe
                </span>
                <h1 className="truncate text-sm font-medium text-zinc-100">
                  {stat.label}
                </h1>
              </div>
              <p className="truncate text-[11px] text-zinc-500">
                {stat.group}
                {stat.unit ? ` · ${stat.unit}` : ""} · {modeLabel}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {/* Search Trigger Button */}
            <button
              onClick={() => setIsPaletteOpen(true)}
              className="flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-1.5 text-xs text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition-colors"
              title="Search countries & stats (⌘K)"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden font-mono text-[9px] text-zinc-500 sm:inline">⌘K</kbd>
            </button>

            {/* Shortcuts Help Button */}
            <button
              onClick={() => setIsShortcutsOpen(true)}
              className="rounded-md border border-zinc-800 p-1.5 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition-colors"
              title="Keyboard Shortcuts (?)"
              aria-label="Keyboard Shortcuts"
            >
              <HelpCircle className="h-4 w-4" />
            </button>

            <SexToggle
              mode={mode}
              onChange={setMode}
              disabled={!stat.sexed}
              lockedLabel={
                stat.fixedSex
                  ? `${stat.fixedSex === "female" ? "Female" : "Male"} only`
                  : "No sex split"
              }
            />

            <button
              onClick={() => setMobilePanel("rankings")}
              aria-label="Open rankings"
              className="rounded-md border border-zinc-800 p-1.5 text-zinc-400 md:hidden hover:bg-zinc-800"
            >
              <Table2 className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Region filter chips */}
        <div className="flex gap-1.5 overflow-x-auto border-b border-zinc-800/60 px-3 py-1.5 [scrollbar-width:none] md:px-4">
          <button
            onClick={() => setRegion(null)}
            className={cn(
              "shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors",
              region == null
                ? "border-cyan-600/80 bg-cyan-950/60 text-cyan-200"
                : "border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700",
            )}
          >
            All regions
          </button>
          {regions.filter((r) => r !== "All Regions").map((r) => (
            <button
              key={r}
              onClick={() => setRegion(region === r ? null : r)}
              className={cn(
                "shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors",
                region === r
                  ? "border-cyan-600/80 bg-cyan-950/60 text-cyan-200"
                  : "border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700",
              )}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="relative min-h-0 flex-1">
          <WorldMap
            stat={stat}
            mode={mode}
            region={region}
            selectedCode={selectedCode}
            onSelect={selectCountry}
          />
          <CountryDrawer
            country={selected}
            activeStat={stat}
            mode={mode}
            pinned={pinned}
            onPin={(c) => setPinnedCode(c?.code ?? null)}
            onClose={() => patchParams({ country: null })}
            onSelectStat={selectStat}
          />
        </div>
      </main>

      {/* Desktop Rankings */}
      <div className="hidden md:flex">
        <RankingsPanel
          stat={stat}
          mode={mode}
          region={region}
          selectedCode={selectedCode}
          onSelect={selectCountry}
        />
      </div>

      {/* Mobile overlays */}
      {mobilePanel && (
        <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950 md:hidden">
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
            <span className="text-sm font-semibold text-zinc-100">
              {mobilePanel === "stats" ? "Statistics" : "Rankings"}
            </span>
            <button
              onClick={() => setMobilePanel(null)}
              aria-label="Close"
              className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="min-h-0 flex-1">
            {mobilePanel === "stats" ? (
              <StatSidebar
                activeStat={stat}
                mode={mode}
                onSelect={(s) => {
                  selectStat(s);
                  setMobilePanel(null);
                }}
                formatTick={formatTick}
              />
            ) : (
              <RankingsPanel
                stat={stat}
                mode={mode}
                region={region}
                selectedCode={selectedCode}
                onSelect={(c) => {
                  selectCountry(c);
                  setMobilePanel(null);
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onSelectCountry={(c) => {
          selectCountry(c);
        }}
        onSelectStat={(s) => {
          selectStat(s);
        }}
        onSetMode={(m) => {
          setMode(m);
        }}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
