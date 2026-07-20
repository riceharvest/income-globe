import { useState, useMemo } from "react";
import { useSearchParams } from "react-router";

export const meta = () => [
  { title: "Compare Countries — Income Globe" },
  { name: "description", content: "Compare income distributions side by side for up to 3 countries." },
];
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  uniqueCountriesData,
  formatUsd,
  indicatorLabels,
  type CountryData,
  type IndicatorType,
} from "~/data/countries";
import { BarChart3, X, Plus, Search } from "lucide-react";
import { Input } from "~/components/ui/input";

const MAX_COMPARE = 3;

const percentileKeys = ["p10", "p25", "p50", "p75", "p90"] as const;
const percentileLabels: Record<string, string> = {
  p10: "P10",
  p25: "P25",
  p50: "Median",
  p75: "P75",
  p90: "P90",
};

const compareColors = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
];
const compareTextColors = [
  "text-blue-500",
  "text-emerald-500",
  "text-amber-500",
];

const indicatorTabs: { value: IndicatorType; label: string }[] = [
  { value: "posttax_national", label: "Post-tax" },
  { value: "pretax_national", label: "Pre-tax" },
  { value: "consumption", label: "Consumption" },
  { value: "labor_income", label: "Wages" },
  { value: "wealth", label: "Wealth" },
];

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

export default function Compare() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCodes = searchParams.get("countries")?.split(",").filter(Boolean) || [];

  const [selectedCodes, setSelectedCodes] = useState<string[]>(initialCodes);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [activeIndicator, setActiveIndicator] = useState<IndicatorType>("posttax_national");

  const selected = useMemo(
    () =>
      selectedCodes
        .map((code) => uniqueCountriesData.find((c) => c.code === code))
        .filter(Boolean) as CountryData[],
    [selectedCodes]
  );

  const availableCountries = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return uniqueCountriesData
      .filter((c) => !selectedCodes.includes(c.code))
      .filter(
        (c) =>
          !q || c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
      );
  }, [selectedCodes, searchQuery]);

  function addCountry(code: string) {
    if (selectedCodes.length >= MAX_COMPARE) return;
    const next = [...selectedCodes, code];
    setSelectedCodes(next);
    setSearchParams({ countries: next.join(",") });
    setSearchQuery("");
    setShowPicker(false);
  }

  function removeCountry(code: string) {
    const next = selectedCodes.filter((c) => c !== code);
    setSelectedCodes(next);
    if (next.length > 0) {
      setSearchParams({ countries: next.join(",") });
    } else {
      setSearchParams({});
    }
  }

  const getIncomeData = (country: CountryData) =>
    (country.indicators as any)[activeIndicator] ?? country.indicators.posttax_national;

  const maxValue = selected.length > 0
    ? Math.max(...selected.map((c) => getIncomeData(c).p90)) * 1.1
    : 10000;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Compare Countries</h1>
        <p className="text-muted-foreground">
          Select up to {MAX_COMPARE} countries to compare income distributions side by side.
        </p>
      </div>

      {/* Selected countries */}
      <div className="flex flex-wrap items-center gap-2">
        {selected.map((c, i) => (
          <Badge
            key={c.code}
            variant="secondary"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm"
          >
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full ${compareColors[i]}`}
            />
            <span>{c.flag}</span>
            <span>{c.name}</span>
            <button
              onClick={() => removeCountry(c.code)}
              className="ml-1 rounded-full p-0.5 hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        {selectedCodes.length < MAX_COMPARE && (
          <div className="relative">
            <button
              onClick={() => setShowPicker(!showPicker)}
              className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
              Add country
            </button>

            {showPicker && (
              <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-border bg-popover p-2 shadow-xl">
                <div className="relative mb-2">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 pl-8 text-sm"
                    autoFocus
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {availableCountries.slice(0, 50).map((c) => (
                    <button
                      key={c.code}
                      onClick={() => addCountry(c.code)}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-secondary"
                    >
                      <span>{c.flag}</span>
                      <span>{c.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {formatUsd(c.income.p50)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Indicator tabs */}
      {selected.length >= 2 && (
        <Tabs
          value={activeIndicator}
          onValueChange={(v) => setActiveIndicator(v as IndicatorType)}
        >
          <TabsList>
            {indicatorTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {/* Comparison */}
      {selected.length >= 2 ? (
        <div className="space-y-6">
          {/* Bar chart comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {indicatorLabels[activeIndicator]}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {percentileKeys.map((pKey) => {
                const isMedian = pKey === "p50";
                return (
                  <div key={pKey} className="space-y-2">
                    <p
                      className={`text-sm ${
                        isMedian ? "font-bold" : "font-medium text-muted-foreground"
                      }`}
                    >
                      {percentileLabels[pKey]}
                    </p>
                    {selected.map((c, i) => {
                      const data = getIncomeData(c);
                      const val = data[pKey];
                      const width = (val / maxValue) * 100;
                      return (
                        <div key={c.code} className="flex items-center gap-2">
                          <span className="w-8 text-sm">{c.flag}</span>
                          <div className="relative h-6 flex-1 overflow-hidden rounded-full bg-muted/50">
                            <div
                              className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                                isMedian ? compareColors[i] : `${compareColors[i]} opacity-60`
                              }`}
                              style={{ width: `${width}%` }}
                            />
                          </div>
                          <span
                            className={`w-16 text-right text-sm tabular-nums ${
                              isMedian ? "font-bold" : "text-muted-foreground"
                            }`}
                          >
                            {formatUsd(val)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Side-by-side stats */}
          <div className={`grid gap-4 ${selected.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
            {selected.map((c, i) => {
              const data = getIncomeData(c);
              const gap = (data.p90 / data.p10).toFixed(1);
              return (
                <Card key={c.code} className="overflow-hidden">
                  <div className={`h-1 ${compareColors[i]}`} />
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{c.flag}</span>
                      <div>
                        <p className="font-semibold">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.region}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div>
                        <p className="text-xl font-bold tabular-nums">{formatUsd(data.p50)}</p>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Median</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold tabular-nums">{gap}×</p>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">P90/P10 gap</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-1">
                      {percentileKeys.map((pKey) => (
                        <div key={pKey} className="flex justify-between text-sm">
                          <span className={`${pKey === "p50" ? "font-bold" : "text-muted-foreground"}`}>
                            {percentileLabels[pKey]}
                          </span>
                          <span className={`tabular-nums ${pKey === "p50" ? "font-bold" : ""}`}>
                            ${data[pKey].toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
          <BarChart3 className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-lg font-medium">Select at least 2 countries</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Click "Add country" above to start comparing
          </p>
        </div>
      )}
    </div>
  );
}
