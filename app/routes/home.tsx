import { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "react-router";
import {
  Search,
  LayoutGrid,
  Table2,
  Globe,
  Command,
  PanelRightClose,
  PanelRightOpen,
  Map as MapIcon,
  SlidersHorizontal,
} from "lucide-react";
import { Input } from "~/components/ui/input";
import { CountryCard } from "~/components/country-card";
import { CompactTable } from "~/components/compact-table";
import { IndicatorsPanel } from "~/components/indicators-panel";
import { FilterSidebar } from "~/components/filter-sidebar";
import { CountryDetailPanel } from "~/components/country-detail-panel";
import { CommandPalette } from "~/components/command-palette";
import { WorldMap, type MapMetricKey } from "~/components/world-map";
import { CountrySidebar } from "~/components/country-sidebar";
import {
  uniqueCountriesData,
  type Region,
  type CountryData,
  type IndicatorSelection,
  createDefaultIndicator,
  getIndicatorValue,
} from "~/data/countries";
import { cn } from "~/lib/utils";

export const meta = () => [
  { title: "Income Globe — Global Income & Demographic Intelligence" },
  {
    name: "description",
    content:
      "Interactive world map and intelligence dashboard comparing income percentiles, economic stats, demographics, and health metrics across 169 countries.",
  },
];

type ViewMode = "map" | "grid" | "table";
type GroupId = "country" | "economic" | "health" | "gender" | "culture" | "income";
type SortKey = string;

const SORT_LABELS: Record<string, string> = {
  income: "Income (P50)",
  name: "A-Z",
  region: "Region",
  population: "Population",
  minimumWageEur: "Min Wage",
  costOfLivingIndex: "Cost of Living",
  internetPenetration: "Internet %",
  unemploymentRate: "Unemploy. %",
  obesityRate: "Obesity %",
  femaleHeightCm: "Height",
  femaleBmi: "BMI",
  adolescentBirthRate: "Adolescent Birth",
  laborForceGap: "Labor Gap",
};

const GROUP_COLUMNS: Record<GroupId, string[]> = {
  country: ["name", "region"],
  economic: [
    "population",
    "minimumWageEur",
    "costOfLivingIndex",
    "internetPenetration",
    "unemploymentRate",
    "englishSpeakingPercent",
  ],
  health: [
    "obesityRate",
    "smokingRate",
    "femaleHeightCm",
    "femaleBmi",
    "femaleObesity",
    "hiv",
  ],
  gender: [
    "adolescentBirthRate",
    "childMarriagePercent",
    "laborForceGap",
    "contraceptiveUse",
    "outOfWedlock",
  ],
  culture: ["religion", "education", "outOfWedlock"],
  income: ["income"],
};

export function ErrorBoundary() {
  return (
    <div className="flex items-center justify-center min-h-screen p-6 text-center bg-background">
      <div className="space-y-4 max-w-md bg-card/80 backdrop-blur-xl p-8 rounded-2xl border border-border/60 shadow-2xl">
        <Globe className="h-10 w-10 text-emerald-400 mx-auto animate-pulse" />
        <h2 className="text-xl font-bold text-foreground">Something went wrong</h2>
        <p className="text-xs text-muted-foreground">
          An error occurred while rendering the interactive layout.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors"
        >
          Reload Dashboard
        </a>
      </div>
    </div>
  );
}

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState<Region | "All Regions">("All Regions");

  // Connected State: sort & mapMetricKey
  const [sort, setSort] = useState<SortKey>("income");
  const [mapMetricKey, setMapMetricKey] = useState<MapMetricKey>("p50");

  const [activeGroups, setActiveGroups] = useState<Set<GroupId>>(
    new Set(["country", "economic", "health", "gender", "culture", "income"])
  );

  // Active selected country (defaults to US)
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("US");

  // Layout UI Toggles
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [countrySidebarOpen, setCountrySidebarOpen] = useState(true);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showDetailPanel, setShowDetailPanel] = useState(false);

  const [indicators, setIndicators] = useState<IndicatorSelection[]>([
    createDefaultIndicator(),
  ]);

  const [globalSettings, setGlobalSettings] = useState({
    currency: "usd_ppp" as "usd_ppp" | "usd_market",
    prices: "constant_2024" as "constant_2024" | "current",
    timePeriod: "monthly" as "monthly" | "annual",
  });

  // Global Cmd+K keyboard shortcut
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

  // Connected state handler: Triggered when user clicks ANY stat value in sidebar!
  // Automatically updates sort AND mapMetricKey so map colors and country list sorting update simultaneously!
  const handleSelectMetric = useCallback((metricKey: string) => {
    setSort(metricKey);
    setMapMetricKey(metricKey as MapMetricKey);
  }, []);

  // Filtered & Sorted dataset
  const filteredCountries = useMemo(() => {
    let data = [...uniqueCountriesData];

    if (region !== "All Regions") {
      data = data.filter((d) => d.region === region);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      data = data.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.code.toLowerCase().includes(q) ||
          d.region.toLowerCase().includes(q)
      );
    }

    const primaryIndicator = indicators[0];

    function getSortVal(c: CountryData): string | number {
      if (sort === "name") return c.name;
      if (sort === "region") return c.region;
      if (sort === "income" || sort === "p50") return getIndicatorValue(c, primaryIndicator);
      if (sort === "p90") return c.income?.p90 ?? -Infinity;
      if (sort === "p10") return c.income?.p10 ?? -Infinity;

      const val = (c as any)[sort];
      if (val != null && typeof val === "number") return val;
      return -Infinity;
    }

    data.sort((a, b) => {
      const va = getSortVal(a);
      const vb = getSortVal(b);
      if (typeof va === "string" && typeof vb === "string") {
        return sort === "name" || sort === "region"
          ? va.localeCompare(vb)
          : vb.localeCompare(va);
      }
      return (vb as number) - (va as number);
    });

    return data;
  }, [search, region, sort, indicators]);

  const maxMedian = Math.max(...uniqueCountriesData.map((c) => c.income.p50));

  const visibleGroupColumns = useMemo(() => {
    const result: Record<string, boolean> = {};
    (Object.keys(GROUP_COLUMNS) as GroupId[]).forEach((g) => {
      GROUP_COLUMNS[g].forEach((col) => {
        result[col] = activeGroups.has(g);
      });
    });
    return result;
  }, [activeGroups]);

  function handleSelectCountry(code: string | CountryData) {
    const countryCode = typeof code === "string" ? code : code.code;
    setSelectedCountryCode(countryCode);
    if (!countrySidebarOpen) {
      setCountrySidebarOpen(true);
    }
  }

  function handleQuickAction(action: string) {
    if (action === "top10" || action === "bottom10") {
      setSort("income");
      setMapMetricKey("p50");
      setRegion("All Regions");
      setSearch("");
    } else if (action === "reset") {
      setSearch("");
      setRegion("All Regions");
      setSort("income");
      setMapMetricKey("p50");
      setActiveGroups(
        new Set(["country", "economic", "health", "gender", "income"])
      );
    }
    setShowCommandPalette(false);
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground select-none font-sans">
      {/* ── Collapsible Left Filter Sidebar ── */}
      {filterSidebarOpen && (
        <div className="z-40 h-full flex-shrink-0 border-r border-border/60 bg-card/50 backdrop-blur-xl animate-in slide-in-from-left duration-200">
          <FilterSidebar
            groups={activeGroups}
            onChange={setActiveGroups}
            region={region as Region}
            onRegionChange={(r) => setRegion(r as Region)}
          />
        </div>
      )}

      {/* ── Main Layout Column ── */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* ── Sticky Top Header Bar ── */}
        <header className="h-14 bg-card/90 backdrop-blur-xl border-b border-border/60 px-4 flex items-center justify-between gap-3 z-30 flex-shrink-0">
          {/* Left: Brand Logo & Filter Sidebar Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterSidebarOpen((v) => !v)}
              className={cn(
                "p-2 rounded-xl border border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all",
                filterSidebarOpen && "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-500/10"
              )}
              title={filterSidebarOpen ? "Hide Filter Sidebar" : "Show Filter Sidebar"}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="p-1.5 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Globe className="h-4 w-4" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="font-bold text-sm tracking-tight text-foreground">
                  Income Globe
                </span>
                <span className="text-[9px] text-emerald-400 font-semibold tracking-wider uppercase -mt-0.5">
                  Intelligence
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Instant Search Bar & Cmd+K Shortcut Badge */}
          <div className="flex items-center gap-2 flex-1 max-w-md mx-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search 169 countries by name or region..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-9 pr-14 text-xs bg-secondary/40 focus:bg-background/80 backdrop-blur border-border/50 rounded-xl transition-all focus:ring-1 focus:ring-emerald-500/50"
              />
              <button
                onClick={() => setShowCommandPalette(true)}
                className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 text-[10px] text-muted-foreground font-mono bg-secondary/80 px-1.5 py-0.5 rounded-lg border border-border/40 hover:text-foreground hover:bg-secondary transition-colors"
              >
                <Command className="h-2.5 w-2.5" />
                <span>K</span>
              </button>
            </div>
          </div>

          {/* Right: View Mode Switcher & Country Sidebar Toggle */}
          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-secondary/60 p-1 rounded-xl border border-border/40 shadow-inner">
              <button
                onClick={() => setViewMode("map")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all",
                  viewMode === "map"
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="World Map View"
              >
                <MapIcon className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Map</span>
              </button>

              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all",
                  viewMode === "grid"
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Grid Card View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Grid</span>
              </button>

              <button
                onClick={() => setViewMode("table")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all",
                  viewMode === "table"
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Compact Table View"
              >
                <Table2 className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Table</span>
              </button>
            </div>

            {/* Country Sidebar Toggle Button */}
            <button
              onClick={() => setCountrySidebarOpen((v) => !v)}
              className={cn(
                "p-2 rounded-xl border border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all",
                countrySidebarOpen && "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-500/10"
              )}
              title={countrySidebarOpen ? "Close Country Sidebar" : "Open Country Sidebar"}
            >
              {countrySidebarOpen ? (
                <PanelRightClose className="h-4 w-4" />
              ) : (
                <PanelRightOpen className="h-4 w-4" />
              )}
            </button>
          </div>
        </header>

        {/* ── Main Content Area ── */}
        <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden relative">
          {/* VIEW MODE: WORLD MAP */}
          {viewMode === "map" && (
            <div className="flex-1 w-full h-full min-h-0 relative overflow-hidden bg-background">
              <WorldMap
                activeMetricKey={mapMetricKey}
                onMetricChange={(key) => {
                  setMapMetricKey(key);
                  setSort(key);
                }}
                selectedCountryCode={selectedCountryCode}
                onSelectCountry={handleSelectCountry}
                height="100%"
                className="w-full h-full"
              />
            </div>
          )}

          {/* VIEW MODE: GRID */}
          {viewMode === "grid" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <IndicatorsPanel
                indicators={indicators}
                onChange={setIndicators}
                globalSettings={globalSettings}
                onGlobalSettingsChange={setGlobalSettings}
              />

              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-card/40 backdrop-blur-md rounded-2xl border border-border/50">
                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                  <span>Showing</span>
                  <strong className="text-foreground font-bold bg-secondary px-2 py-0.5 rounded-md border border-border/40 font-mono">
                    {filteredCountries.length}
                  </strong>
                  <span>of {uniqueCountriesData.length} countries</span>
                </p>

                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-muted-foreground font-medium mr-1">Sort Key:</span>
                  {(Object.keys(SORT_LABELS) as SortKey[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSelectMetric(s)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
                        sort === s
                          ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                          : "bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/30"
                      )}
                    >
                      {SORT_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredCountries.map((c) => (
                  <CountryCard
                    key={c.code}
                    country={c}
                    maxMedian={maxMedian}
                    sortKey={sort as any}
                    onSelect={(code) => handleSelectCountry(code)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* VIEW MODE: TABLE */}
          {viewMode === "table" && (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden p-4 space-y-4">
              <IndicatorsPanel
                indicators={indicators}
                onChange={setIndicators}
                globalSettings={globalSettings}
                onGlobalSettingsChange={setGlobalSettings}
              />
              <div className="flex-1 overflow-auto rounded-2xl border border-border/60 bg-card/30 backdrop-blur-md">
                <CompactTable
                  countries={filteredCountries}
                  indicators={indicators}
                  visibleGroupColumns={visibleGroupColumns}
                  highlightedCodes={
                    selectedCountryCode ? new Set([selectedCountryCode]) : undefined
                  }
                  onRowClick={(code) => handleSelectCountry(code)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Collapsible Right Country Sidebar ── */}
      {countrySidebarOpen && (
        <div className="w-[420px] max-w-full h-full flex-shrink-0 z-30 border-l border-border/60 bg-card/60 backdrop-blur-xl animate-in slide-in-from-right duration-200">
          <CountrySidebar
            selectedCountryCode={selectedCountryCode}
            onSelectCountry={handleSelectCountry}
            activeSortKey={sort}
            onSelectMetric={handleSelectMetric}
            className="w-full h-full"
            onCloseMobile={() => setCountrySidebarOpen(false)}
          />
        </div>
      )}

      {/* ── Slide-over Detail Panel ── */}
      <CountryDetailPanel
        countryCode={showDetailPanel ? selectedCountryCode : null}
        onClose={() => setShowDetailPanel(false)}
        countries={uniqueCountriesData}
        indicators={indicators}
      />

      {/* ── Global Command Palette (Cmd+K) ── */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        countries={uniqueCountriesData}
        onSelectCountry={(code) => {
          handleSelectCountry(code);
          setShowCommandPalette(false);
        }}
        onQuickAction={handleQuickAction}
      />
    </div>
  );
}
