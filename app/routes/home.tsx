import { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "react-router";
import {
  Search,
  LayoutGrid,
  Table2,
  Globe,
  PanelRightClose,
  PanelRightOpen,
  Map as MapIcon,
  SlidersHorizontal,
  Award,
  DollarSign,
  TrendingUp,
  Activity,
  Users,
  Building2,
  Heart,
  RotateCcw,
} from "lucide-react";
import { Input } from "~/components/ui/input";
import { WorldMap, type MapMetricKey, MAP_METRICS } from "~/components/world-map";
import { CountrySidebar } from "~/components/country-sidebar";
import { CountryGrid } from "~/components/country-grid";
import { CountryTable } from "~/components/country-table";
import {
  uniqueCountriesData,
  regions,
  type Region,
  type CountryData,
  getSortValue,
} from "~/data/countries";
import { cn } from "~/lib/utils";

export const meta = () => [
  { title: "Income Globe — Global Income & Physical Intelligence" },
  {
    name: "description",
    content:
      "Interactive 2D world map and country intelligence dashboard comparing income percentiles, economic stats, demographics, and physical characteristics across 245 countries.",
  },
];

type ViewMode = "map" | "grid" | "table";

const SORT_OPTIONS: Array<{ key: string; label: string }> = [
  { key: "income", label: "Income (P50)" },
  { key: "p90", label: "Top 10% (P90)" },
  { key: "p10", label: "Bottom 10% (P10)" },
  { key: "name", label: "Country Name" },
  { key: "region", label: "Region" },
  { key: "population", label: "Population" },
  { key: "minimumWageEur", label: "Min Wage" },
  { key: "costOfLivingIndex", label: "Cost of Living" },
  { key: "unemploymentRate", label: "Unemployment" },
  { key: "hdi", label: "HDI Score" },
  { key: "bmi", label: "BMI" },
  { key: "femaleHeightCm", label: "Female Height" },
  { key: "maleHeightCm", label: "Male Height" },
  { key: "obesityRate", label: "Obesity %" },
  { key: "caloricIntakeKcal", label: "Daily Calories" },
  { key: "lifeExpectancy", label: "Life Expectancy" },
  { key: "smokingRate", label: "Smoking %" },
  { key: "alcoholLiters", label: "Alcohol L/yr" },
  { key: "adolescentBirthRate", label: "Adolescent Birth" },
  { key: "laborForceGap", label: "Labor Gap" },
  { key: "contraceptiveUse", label: "Contraceptive %" },
];

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
  const [selectedRegion, setSelectedRegion] = useState<string>("All Regions");

  // Connected State: sort & mapMetricKey
  const [sortKey, setSortKey] = useState<string>("income");
  const [mapMetricKey, setMapMetricKey] = useState<MapMetricKey>("p50");

  // Active selected country (defaults to US)
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("US");

  // Layout UI Toggles
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [countrySidebarOpen, setCountrySidebarOpen] = useState(true);

  // Connected state handler: Triggered when user clicks ANY stat value in sidebar!
  const handleSelectMetric = useCallback((metricKey: string) => {
    setSortKey(metricKey);
    const isMapMetric = MAP_METRICS.some((m) => m.key === metricKey);
    if (isMapMetric) {
      setMapMetricKey(metricKey as MapMetricKey);
    }
  }, []);

  // Filtered & Sorted dataset
  const filteredCountries = useMemo(() => {
    let data = [...uniqueCountriesData];

    if (selectedRegion !== "All Regions") {
      data = data.filter((d) => d.region === selectedRegion);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      data = data.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.code.toLowerCase().includes(q) ||
          d.alpha2.toLowerCase().includes(q) ||
          d.alpha3.toLowerCase().includes(q) ||
          d.region.toLowerCase().includes(q)
      );
    }

    data.sort((a, b) => {
      const va = getSortValue(a, sortKey);
      const vb = getSortValue(b, sortKey);

      if (typeof va === "string" && typeof vb === "string") {
        return sortKey === "name" || sortKey === "region"
          ? va.localeCompare(vb)
          : vb.localeCompare(va);
      }
      return (vb as number) - (va as number);
    });

    return data;
  }, [search, selectedRegion, sortKey]);

  function handleSelectCountry(code: string | CountryData) {
    const countryCode = typeof code === "string" ? code : code.code;
    setSelectedCountryCode(countryCode);
    if (!countrySidebarOpen) {
      setCountrySidebarOpen(true);
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground select-none font-sans">
      {/* ── Collapsible Left Filter Drawer ── */}
      {filterDrawerOpen && (
        <div className="w-64 h-full flex-shrink-0 z-40 border-r border-border/60 bg-card/70 backdrop-blur-2xl p-4 space-y-4 animate-in slide-in-from-left duration-200">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <span className="font-bold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Regional Filters</span>
            </span>
            <button
              onClick={() => setFilterDrawerOpen(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <span className="text-muted-foreground font-semibold">Select Region</span>
            <div className="space-y-1">
              {["All Regions", ...regions].map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRegion(r)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all",
                    selectedRegion === r
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                      : "bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Main Work Area ── */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* ── Sticky Top Header Bar ── */}
        <header className="h-14 bg-card/90 backdrop-blur-xl border-b border-border/60 px-4 flex items-center justify-between gap-3 z-30 flex-shrink-0">
          {/* Left: Logo & Region Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterDrawerOpen((v) => !v)}
              className={cn(
                "p-2 rounded-xl border border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all",
                filterDrawerOpen &&
                  "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-500/10"
              )}
              title={filterDrawerOpen ? "Hide Filter Drawer" : "Show Filter Drawer"}
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

          {/* Center: Global Instant Search */}
          <div className="flex items-center gap-2 flex-1 max-w-md mx-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search 245 countries by name, code (US/USA), or region..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-9 pr-4 text-xs bg-secondary/40 focus:bg-background/80 backdrop-blur border-border/50 rounded-xl transition-all focus:ring-1 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          {/* Right: View Mode Switcher & Sidebar Toggle */}
          <div className="flex items-center gap-2">
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
                title="Grid View"
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
                title="Table View"
              >
                <Table2 className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Table</span>
              </button>
            </div>

            <button
              onClick={() => setCountrySidebarOpen((v) => !v)}
              className={cn(
                "p-2 rounded-xl border border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all",
                countrySidebarOpen &&
                  "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-500/10"
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

        {/* ── Main View Content Area ── */}
        <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden relative">
          {/* VIEW MODE: WORLD MAP */}
          {viewMode === "map" && (
            <div className="flex-1 w-full h-full min-h-0 relative overflow-hidden bg-background">
              <WorldMap
                activeMetricKey={mapMetricKey}
                onMetricChange={(key) => {
                  setMapMetricKey(key);
                  setSortKey(key);
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
              {/* Sort Bar */}
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
                  {SORT_OPTIONS.slice(0, 8).map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectMetric(opt.key)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
                        sortKey === opt.key
                          ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                          : "bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/30"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <CountryGrid
                countries={filteredCountries}
                sortKey={sortKey}
                selectedCountryCode={selectedCountryCode}
                onSelectCountry={handleSelectCountry}
              />
            </div>
          )}

          {/* VIEW MODE: TABLE */}
          {viewMode === "table" && (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden p-4 space-y-3">
              <div className="flex-1 overflow-auto rounded-2xl border border-border/60 bg-card/30 backdrop-blur-md">
                <CountryTable
                  countries={filteredCountries}
                  sortKey={sortKey}
                  onSortChange={handleSelectMetric}
                  selectedCountryCode={selectedCountryCode}
                  onSelectCountry={handleSelectCountry}
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
            activeSortKey={sortKey}
            onSelectMetric={handleSelectMetric}
            className="w-full h-full"
            onCloseMobile={() => setCountrySidebarOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
