import { useEffect, useMemo, useRef, useState } from "react";
import { Search, BarChart2, Compass, Globe, Flag, X } from "lucide-react";
import { countries, type CountryData } from "~/data/countries";
import { usStates, type USStateData } from "~/data/us-states";
import { stats, type StatDef, type Mode, type DataScope } from "~/lib/stats";
import { cn } from "~/lib/utils";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCountry: (c: CountryData) => void;
  onSelectState?: (s: USStateData) => void;
  onSelectStat: (s: StatDef) => void;
  onSetMode: (m: Mode) => void;
  onSetScope?: (scope: DataScope) => void;
}

type PaletteItem =
  | { type: "action"; id: string; label: string; mode?: Mode; scope?: DataScope; icon: React.ReactNode }
  | { type: "stat"; id: string; label: string; group: string; stat: StatDef }
  | { type: "country"; id: string; label: string; region: string; flag: string; country: CountryData }
  | { type: "state"; id: string; label: string; region: string; state: USStateData };

export function CommandPalette({
  isOpen,
  onClose,
  onSelectCountry,
  onSelectState,
  onSelectStat,
  onSetMode,
  onSetScope,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const items = useMemo<PaletteItem[]>(() => {
    const q = query.trim().toLowerCase();
    const result: PaletteItem[] = [];

    // Scope switch actions
    if (!q || "united states".includes(q) || "usa".includes(q) || "states".includes(q) || "scope".includes(q)) {
      result.push({
        type: "action",
        id: "act-scope-us",
        label: "Switch to US States view (50 States & DC)",
        scope: "us",
        icon: <Flag className="h-3.5 w-3.5 text-cyan-400" />,
      });
    }
    if (!q || "world".includes(q) || "global".includes(q) || "countries".includes(q)) {
      result.push({
        type: "action",
        id: "act-scope-world",
        label: "Switch to World Countries view",
        scope: "world",
        icon: <Globe className="h-3.5 w-3.5 text-cyan-400" />,
      });
    }

    // Quick mode actions
    if (!q || "male".includes(q) || "female".includes(q) || "gap".includes(q)) {
      if (!q || "male".includes(q)) {
        result.push({
          type: "action",
          id: "act-male",
          label: "Switch view to Male values",
          mode: "male",
          icon: <Compass className="h-3.5 w-3.5 text-blue-400" />,
        });
      }
      if (!q || "female".includes(q)) {
        result.push({
          type: "action",
          id: "act-female",
          label: "Switch view to Female values",
          mode: "female",
          icon: <Compass className="h-3.5 w-3.5 text-rose-400" />,
        });
      }
      if (!q || "gap".includes(q) || "difference".includes(q)) {
        result.push({
          type: "action",
          id: "act-gap",
          label: "Switch view to M−F Gap",
          mode: "gap",
          icon: <Compass className="h-3.5 w-3.5 text-cyan-400" />,
        });
      }
    }

    // Stats
    const matchingStats = q
      ? stats.filter(
          (s) =>
            s.label.toLowerCase().includes(q) ||
            s.group.toLowerCase().includes(q) ||
            s.info.toLowerCase().includes(q),
        )
      : stats.slice(0, 8);

    matchingStats.forEach((s) => {
      result.push({
        type: "stat",
        id: `stat-${s.id}`,
        label: s.label,
        group: s.group,
        stat: s,
      });
    });

    // US States
    const matchingStates = q
      ? usStates.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.code.toLowerCase() === q ||
            s.region.toLowerCase().includes(q),
        )
      : usStates.slice(0, 6);

    matchingStates.forEach((s) => {
      result.push({
        type: "state",
        id: `s-${s.code}`,
        label: `${s.name} (${s.code})`,
        region: `${s.region} · ${s.electoralVotes} EV`,
        state: s,
      });
    });

    // Countries
    const matchingCountries = q
      ? countries.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.code.toLowerCase().includes(q) ||
            c.region.toLowerCase().includes(q),
        )
      : countries.slice(0, 8);

    matchingCountries.forEach((c) => {
      result.push({
        type: "country",
        id: `c-${c.code}`,
        label: c.name,
        region: c.region,
        flag: c.flag,
        country: c,
      });
    });

    return result;
  }, [query]);

  // Keep selected index within bounds
  useEffect(() => {
    setSelectedIndex((prev) => (items.length > 0 ? Math.min(prev, items.length - 1) : 0));
  }, [items]);

  const handleSelect = (item: PaletteItem) => {
    if (item.type === "action") {
      if (item.mode) onSetMode(item.mode);
      if (item.scope && onSetScope) onSetScope(item.scope);
    } else if (item.type === "stat") {
      onSelectStat(item.stat);
    } else if (item.type === "country") {
      onSelectCountry(item.country);
    } else if (item.type === "state" && onSelectState) {
      onSelectState(item.state);
    }
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (items.length > 0 ? (prev + 1) % items.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          items.length > 0 ? (prev - 1 + items.length) % items.length : 0,
        );
      } else if (e.key === "Enter" && items[selectedIndex]) {
        e.preventDefault();
        handleSelect(items[selectedIndex]);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, items, selectedIndex, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.children[selectedIndex] as HTMLElement;
    if (el) {
      el.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24">
      <div
        className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl">
        <div className="flex items-center border-b border-zinc-800 px-4 py-3">
          <Search className="mr-3 h-4 w-4 shrink-0 text-zinc-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search countries, stats, or commands (e.g. France, Height, Female)..."
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="mr-2 text-zinc-500 hover:text-zinc-300"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <span className="rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">
            ESC
          </span>
        </div>

        <div
          ref={listRef}
          className="max-h-80 overflow-y-auto p-2 [scrollbar-width:thin]"
        >
          {items.map((item, idx) => {
            const active = idx === selectedIndex;
            return (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors",
                  active ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:text-zinc-200",
                )}
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  {item.type === "action" && item.icon}
                  {item.type === "stat" && (
                    <BarChart2 className="h-3.5 w-3.5 text-cyan-400" />
                  )}
                  {item.type === "country" && (
                    <span className="text-sm leading-none">{item.flag}</span>
                  )}
                  <span className="truncate font-medium">{item.label}</span>
                </div>

                <div className="ml-2 shrink-0 text-[10px] text-zinc-500">
                  {item.type === "action" && "Mode Action"}
                  {item.type === "stat" && item.group}
                  {item.type === "country" && item.region}
                </div>
              </div>
            );
          })}

          {items.length === 0 && (
            <div className="py-8 text-center text-xs text-zinc-500">
              No results found for “{query}”
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-950/60 px-4 py-2 text-[11px] text-zinc-500">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1 text-[9px]">↑↓</kbd>{" "}
              Navigate
            </span>
            <span>
              <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1 text-[9px]">↵</kbd>{" "}
              Select
            </span>
          </div>
          <div>
            <span>income·globe</span>
          </div>
        </div>
      </div>
    </div>
  );
}
