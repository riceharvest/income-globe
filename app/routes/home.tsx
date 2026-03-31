import { useState, useMemo } from "react";
import { Input } from "~/components/ui/input";
import { CountryCard } from "~/components/country-card";
import { DataTable } from "~/components/data-table";
import { IndicatorsPanel } from "~/components/indicators-panel";
import {
  uniqueCountriesData,
  regions,
  type Region,
  type IndicatorSelection,
  createDefaultIndicator,
  getIndicatorValue,
} from "~/data/countries";
import { Search, ArrowUpDown, Globe, LayoutGrid, Table2 } from "lucide-react";

export const meta = () => [
  { title: "Explore — Income Globe" },
  { name: "description", content: "Browse income distribution data for 31 countries worldwide." },
];

type SortOption = "name" | "median_asc" | "median_desc";
type ViewMode = "cards" | "table";

const sortLabels: Record<SortOption, string> = {
  name: "A-Z",
  median_asc: "Lowest",
  median_desc: "Highest",
};

export function ErrorBoundary() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-200">Something went wrong</h2>
        <p className="text-gray-400">Please try refreshing the page.</p>
        <a href="/" className="inline-block px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white transition-colors">
          Go home
        </a>
      </div>
    </div>
  );
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState<Region>("All Regions");
  const [sort, setSort] = useState<SortOption>("median_desc");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [indicators, setIndicators] = useState<IndicatorSelection[]>([
    createDefaultIndicator(),
  ]);

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

    // Sort based on first indicator for card view
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

  const maxMedian = Math.max(
    ...uniqueCountriesData.map((c) => c.income.p50)
  );

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Global Income Distribution
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Income distribution data for {uniqueCountriesData.length} countries.
          Select indicators, percentile groups, and dimensions — sourced from{" "}
          <span className="text-foreground">WID.world</span>,{" "}
          <span className="text-foreground">OECD</span>, and{" "}
          <span className="text-foreground">ILO</span>.
        </p>
      </div>

      {/* Indicator selector panel */}
      <IndicatorsPanel indicators={indicators} onChange={setIndicators} />

      {/* Search + Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search countries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 pl-10 text-base"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                region === r
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {r === "All Regions" ? (
                <span className="flex items-center gap-1">
                  <Globe className="h-3 w-3" /> All
                </span>
              ) : (
                r
              )}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-1.5">
            {/* View mode toggle */}
            <div className="mr-2 flex items-center rounded-lg border border-border">
              <button
                onClick={() => setViewMode("table")}
                className={`rounded-l-lg p-1.5 transition-colors ${
                  viewMode === "table"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Table view"
              >
                <Table2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("cards")}
                className={`rounded-r-lg p-1.5 transition-colors ${
                  viewMode === "cards"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Card view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>

            {viewMode === "cards" && (
              <>
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                {(Object.keys(sortLabels) as SortOption[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSort(s)}
                    className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                      sort === s
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {sortLabels[s]}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filtered.length} of {uniqueCountriesData.length} countries
      </p>

      {/* Content: Table or Cards */}
      {filtered.length > 0 ? (
        viewMode === "table" ? (
          <DataTable countries={filtered} indicators={indicators} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((country) => (
              <CountryCard
                key={country.code}
                country={country}
                maxMedian={maxMedian}
              />
            ))}
          </div>
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
  );
}
