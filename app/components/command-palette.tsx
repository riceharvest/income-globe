import { useState, useEffect, useRef, useMemo } from "react";
import { Search, ArrowUp, ArrowDown, X, Command } from "lucide-react";
import { useNavigate } from "react-router";
import { type CountryData } from "~/data/countries";
import { cn } from "~/lib/utils";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  countries: CountryData[];
  onSelectCountry: (code: string) => void;
  onQuickAction?: (action: string) => void;
}

interface QuickAction {
  label: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
}

function formatIncome(value: number): string {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  }
  return `$${value}`;
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const lower = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const idx = lower.indexOf(lowerQuery);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="text-foreground font-semibold">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export function CommandPalette({
  isOpen,
  onClose,
  countries,
  onSelectCountry,
  onQuickAction,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return countries
      .filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 10);
  }, [query, countries]);

  const quickActions: QuickAction[] = useMemo(
    () => [
      {
        label: "Show Top 10 by Median Income",
        description: "Rank countries by P50 income, highest first",
        icon: <ArrowUp className="w-4 h-4" />,
        action: () => onQuickAction?.("top10"),
      },
      {
        label: "Show Bottom 10 by Median Income",
        description: "Rank countries by P50 income, lowest first",
        icon: <ArrowDown className="w-4 h-4" />,
        action: () => onQuickAction?.("bottom10"),
      },
      {
        label: "Reset all filters",
        description: "Clear all active filters and return to overview",
        icon: <X className="w-4 h-4" />,
        action: () => onQuickAction?.("reset"),
      },
      {
        label: "Compare two countries",
        description: "Side-by-side income comparison",
        icon: <Command className="w-4 h-4" />,
        action: () => {
          navigate("/compare");
          onClose();
        },
      },
    ],
    [onQuickAction, navigate, onClose]
  );

  const totalItems = query.trim() ? results.length : quickActions.length;

  // Focus input + reset state when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIdx(0);
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIdx(0);
  }, [results]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((i) => Math.min(i + 1, totalItems - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (query.trim() && results[selectedIdx]) {
        onSelectCountry(results[selectedIdx].code);
        onClose();
      } else if (!query.trim() && quickActions[selectedIdx]) {
        quickActions[selectedIdx].action();
        onClose();
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  }

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-start justify-center pt-[20vh]"
      onClick={handleOverlayClick}
    >
      <div
        className="w-full max-w-lg bg-card rounded-2xl border border-border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search countries..."
            className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-xs text-muted-foreground border border-border rounded px-1.5 py-0.5 hidden sm:block">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {query.trim() ? (
            results.length > 0 ? (
              <ul>
                {results.map((country, i) => (
                  <li
                    key={country.code}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors",
                      i === selectedIdx ? "bg-muted" : "hover:bg-muted/50"
                    )}
                    onClick={() => {
                      onSelectCountry(country.code);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIdx(i)}
                  >
                    <span className="text-xl shrink-0">{country.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {highlightMatch(country.name, query)}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {country.region}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground shrink-0">
                      {formatIncome(country.income.p50)}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-10 text-center text-sm text-muted-foreground">
                No countries found for &ldquo;{query}&rdquo;
              </div>
            )
          ) : (
            <ul>
              {quickActions.map((qa, i) => (
                <li
                  key={qa.label}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors",
                    i === selectedIdx ? "bg-muted" : "hover:bg-muted/50"
                  )}
                  onClick={() => {
                    qa.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIdx(i)}
                >
                  <span className="text-muted-foreground shrink-0">{qa.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{qa.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {qa.description}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <kbd className="border border-border rounded px-1">↑</kbd>
            <kbd className="border border-border rounded px-1">↓</kbd>
            <span>navigate</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="border border-border rounded px-1">↵</kbd>
            <span>select</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="border border-border rounded px-1">ESC</kbd>
            <span>close</span>
          </span>
        </div>
      </div>
    </div>
  );
}