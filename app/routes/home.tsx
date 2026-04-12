import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router";
import { Search, LayoutGrid, Table2, Globe, Command } from "lucide-react";
import { Input } from "~/components/ui/input";
import { CountryCard } from "~/components/country-card";
import { CompactTable } from "~/components/compact-table";
import { IndicatorsPanel } from "~/components/indicators-panel";
import { FilterSidebar } from "~/components/filter-sidebar";
import { CountryDetailPanel } from "~/components/country-detail-panel";
import { CommandPalette } from "~/components/command-palette";
import {
  uniqueCountriesData,
  regions,
  type Region,
  type IndicatorSelection,
  createDefaultIndicator,
  getIndicatorValue,
} from "~/data/countries";
import { cn } from "~/lib/utils";

export const meta = () => [
  { title: "Explore — Women Global" },
  {
    name: "description",
    content:
      "Explore gender-specific indicators and income distribution data for 31 countries worldwide.",
  },
];

type ViewMode = "grid" | "table";
type SortOption = "name" | "median_asc" | "median_desc";
type GroupId = "country" | "economic" | "health" | "gender" | "income";

const SORT_LABELS: Record<SortOption, string> = {
  name: "A-Z",
  median_asc: "Lowest",
  median_desc: "Highest",
};

// All columns by group
const GROUP_COLUMNS: Record<GroupId, string[]> = {
  country: ["name", "region"],
  economic: ["population", "minimumWageEur", "costOfLivingIndex", "internetPenetration", "unemploymentRate", "englishSpeakingPercent"],
  health: ["obesityRate", "smokingRate", "femaleHeightCm", "femaleBmi"],
  gender: ["adolescentBirthRate", "childMarriagePercent", "laborForceGap", "contraceptiveUse"],
  income: [], // income is handled by indicators panel
};

export function ErrorBoundary() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-200">Something went wrong</h2>
        <p className="text-gray-400">Please try refreshing the page.</p>
        <a
          href="/"
          className="inline-block px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white transition-colors"
        >
          Go home
        </a>
      </div>
    </div>
  );
}

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState<Region>("All Regions");
  const [sort, setSort] = useState<SortOption>("median_desc");
  const [activeGroups, setActiveGroups] = useState<Set<GroupId>>(
    new Set(["country", "economic", "health", "gender", "income"])
  );
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [indicators, setIndicators] = useState<IndicatorSelection[]>([
    createDefaultIndicator(),
  ]);

  // Global Cmd+K shortcut
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowCommandPalette((v) => !v);
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const filtered = useMemo(() => {
    let data = [...uniqueCountriesData];

    if (region !== "All Regions") {
      data = data.filter((d) => d.region === region);
    }

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.code.toLowerCase().includes(q) ||
          d.region.toLowerCase().includes(q)
      );
    }

    const primaryIndicator = indicators[0];
    if (sort === "median_asc") {
      data.sort(
        (a, b) =>
          getIndicatorValue(a, primaryIndicator) -
          getIndicatorValue(b, primaryIndicator)
      );
    } else if (sort === "median_desc") {
      data.sort(
        (a, b) =>
          getIndicatorValue(b, primaryIndicator) -
          getIndicatorValue(a, primaryIndicator)
      );
    } else {
      data.sort((a, b) => a.name.localeCompare(b.name));
    }

    return data;
  }, [search, region, sort, indicators]);

  const maxMedian = Math.max(...uniqueCountriesData.map((c) => c.income.p50));

  // Build visibleGroupColumns for CompactTable from activeGroups
  const visibleGroupColumns = useMemo(() => {
    const result: Record<string, boolean> = {};
    (Object.keys(GROUP_COLUMNS) as GroupId[]).forEach((g) => {
      GROUP_COLUMNS[g].forEach((col) => {
        result[col] = activeGroups.has(g);
      });
    });
    return result;
  }, [activeGroups]);

  function handleQuickAction(action: string) {
    if (action === "top10") {
      setSort("median_desc");
      setRegion("All Regions");
      setSearch("");
    } else if (action === "bottom10") {
      setSort("median_asc");
      setRegion("All Regions");
      setSearch("");
    } else if (action === "reset") {
      setSearch("");
      setRegion("All Regions");
      setSort("median_desc");
      setActiveGroups(new Set(["country", "economic", "health", "gender", "income"]));
    }
    setShowCommandPalette(false);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ── Filter Sidebar ── */}
      <FilterSidebar
        groups={activeGroups}
        onChange={setActiveGroups}
        region={region}
        onRegionChange={(r) => setRegion(r as Region)}
      />

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-auto flex flex-col">
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 bg-card border-b border-border h-14 flex items-center gap-3 px-4">
          {/* Logo / Title */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <Globe className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm hidden sm:inline">
              Income Globe
            </span>
          </Link>

          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search countries…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-9 text-sm"
            />
          </div>

          {/* Cmd+K hint */}
          <button
            onClick={() => setShowCommandPalette(true)}
            className="hidden md:flex items-center gap-1 text-xs text-muted-foreground border border-border rounded-md px-2 py-1 hover:bg-secondary transition-colors"
          >
            <Command className="h-3 w-3" />
            <span>K</span>
          </button>

          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-border flex-shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "rounded-l-lg p-1.5 transition-colors",
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "rounded-r-lg p-1.5 transition-colors",
                viewMode === "table"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Table view"
            >
              <Table2 className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Indicator selector */}
          <IndicatorsPanel indicators={indicators} onChange={setIndicators} />

          {/* Sort controls (grid only) */}
          {viewMode === "grid" && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort:</span>
              {(Object.keys(SORT_LABELS) as SortOption[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  className={cn(
                    "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                    sort === s
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {SORT_LABELS[s]}
                </button>
              ))}
            </div>
          )}

          {/* Results count */}
          <p className="text-sm text-muted-foreground">
            Showing {filtered.length} of {uniqueCountriesData.length} countries
          </p>

          {/* Content */}
          {filtered.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((country) => (
                  <CountryCard
                    key={country.code}
                    country={country}
                    maxMedian={maxMedian}
                    onSelect={(code) => setSelectedCountryCode(code)}
                  />
                ))}
              </div>
            ) : (
              <CompactTable
                countries={filtered}
                indicators={indicators}
                visibleGroupColumns={visibleGroupColumns}
                highlightedCodes={
                  selectedCountryCode ? new Set([selectedCountryCode]) : undefined
                }
                onRowClick={(code) => setSelectedCountryCode(code)}
              />
            )
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
              <Search className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="text-lg font-medium">No countries found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setRegion("All Regions");
                }}
                className="mt-4 text-sm font-medium text-primary hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* ── Detail Panel ── */}
      <CountryDetailPanel
        countryCode={selectedCountryCode}
        onClose={() => setSelectedCountryCode(null)}
        countries={uniqueCountriesData}
        indicators={indicators}
      />

      {/* ── Command Palette ── */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        countries={uniqueCountriesData}
        onSelectCountry={(code) => {
          setSelectedCountryCode(code);
          setShowCommandPalette(false);
        }}
        onQuickAction={handleQuickAction}
      />
    </div>
  );
}
