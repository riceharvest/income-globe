import { useState, useMemo } from "react";
import { useSearchParams } from "react-router";

export const meta = () => [
  { title: "Where Do You Fit? — Income Globe" },
  { name: "description", content: "Enter your income and see where you rank in any country's income distribution." },
];
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  uniqueCountriesData,
  calculatePercentile,
  formatUsd,
  indicatorLabels,
  type CountryData,
  type IndicatorType,
} from "~/data/countries";
import { Calculator, Search, TrendingUp } from "lucide-react";

const indicatorTabs: { value: IndicatorType; label: string }[] = [
  { value: "posttax_national", label: "Post-tax" },
  { value: "pretax_national", label: "Pre-tax" },
  { value: "consumption", label: "Consumption" },
  { value: "labor_income", label: "Wages" },
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

export default function CalculatorPage() {
  const [searchParams] = useSearchParams();
  const initialCode = searchParams.get("country") || "";

  const [income, setIncome] = useState("");
  const [selectedCode, setSelectedCode] = useState(initialCode);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [activeIndicator, setActiveIndicator] = useState<IndicatorType>("posttax_national");

  const selectedCountry = useMemo(
    () => uniqueCountriesData.find((c) => c.code === selectedCode),
    [selectedCode]
  );

  const currentIncomeData = useMemo(() => {
    if (!selectedCountry) return null;
    return (selectedCountry.indicators as any)[activeIndicator] ?? selectedCountry.indicators.posttax_national;
  }, [selectedCountry, activeIndicator]);

  const percentile = useMemo(() => {
    if (!currentIncomeData || !income) return null;
    const val = parseFloat(income);
    if (isNaN(val) || val < 0) return null;
    return calculatePercentile(val, currentIncomeData);
  }, [currentIncomeData, income]);

  const filteredCountries = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return uniqueCountriesData.filter(
      (c) =>
        !q || c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  function getPercentileColor(p: number): string {
    if (p <= 25) return "text-red-400";
    if (p <= 50) return "text-amber-400";
    if (p <= 75) return "text-emerald-400";
    return "text-blue-400";
  }

  function getPercentileMessage(p: number, country: string): string {
    if (p <= 10)
      return `You're in the bottom 10% of earners in ${country}. Most people earn more than you.`;
    if (p <= 25)
      return `You earn less than about 75% of people in ${country}.`;
    if (p <= 50)
      return `You're below the median in ${country}. About half the population earns more.`;
    if (p <= 75)
      return `You're above the median in ${country}. You earn more than most people.`;
    if (p <= 90)
      return `You're in the top 25% of earners in ${country}. You're doing well.`;
    return `You're in the top 10% of earners in ${country}. You earn more than the vast majority.`;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Where Do You Fit?</h1>
        <p className="text-muted-foreground">
          Enter your monthly income and select a country to see where you stand in
          the income distribution.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Input card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Your Income
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Income input */}
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Monthly income (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  type="number"
                  placeholder="e.g. 2000"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="h-12 pl-7 text-lg tabular-nums"
                  min="0"
                />
              </div>
            </div>

            {/* Indicator selector */}
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Compare against
              </label>
              <Tabs
                value={activeIndicator}
                onValueChange={(v) => setActiveIndicator(v as IndicatorType)}
              >
                <TabsList className="w-full">
                  {indicatorTabs.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value} className="flex-1">
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Country picker */}
            <div>
              <label className="mb-1.5 block text-sm font-medium">Country</label>
              <div className="relative">
                <button
                  onClick={() => setShowPicker(!showPicker)}
                  className="flex h-12 w-full items-center gap-2 rounded-lg border border-input bg-background px-3 text-left transition-colors hover:bg-secondary/50"
                >
                  {selectedCountry ? (
                    <>
                      <span className="text-xl">{selectedCountry.flag}</span>
                      <span className="font-medium">{selectedCountry.name}</span>
                      <span className="ml-auto text-sm text-muted-foreground">
                        Median: {formatUsd(selectedCountry.income.p50)}
                      </span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">Select a country...</span>
                  )}
                </button>

                {showPicker && (
                  <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-xl border border-border bg-popover p-2 shadow-xl">
                    <div className="relative mb-2">
                      <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search countries..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-8 pl-8 text-sm"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-56 overflow-y-auto">
                      {filteredCountries.slice(0, 50).map((c) => (
                        <button
                          key={c.code}
                          onClick={() => {
                            setSelectedCode(c.code);
                            setShowPicker(false);
                            setSearchQuery("");
                          }}
                          className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-secondary ${
                            c.code === selectedCode ? "bg-secondary" : ""
                          }`}
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
            </div>
          </CardContent>
        </Card>

        {/* Result card */}
        <Card className="relative overflow-hidden">
          {percentile !== null && selectedCountry && currentIncomeData ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              <CardContent className="relative flex flex-col items-center justify-center p-8 text-center">
                <Badge variant="secondary" className="mb-2 text-xs">
                  {indicatorLabels[activeIndicator]}
                </Badge>
                <p className="text-sm uppercase tracking-wider text-muted-foreground">
                  Your percentile in {selectedCountry.name}
                </p>
                <p
                  className={`mt-2 text-7xl font-bold tabular-nums ${getPercentileColor(
                    percentile
                  )}`}
                >
                  {percentile}
                  <span className="text-2xl">th</span>
                </p>
                <p className="mt-3 max-w-xs text-sm text-muted-foreground">
                  {getPercentileMessage(percentile, selectedCountry.name)}
                </p>

                <Separator className="my-6" />

                {/* Context */}
                <div className="w-full space-y-3">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    How you compare
                  </p>
                  <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-red-500 via-amber-500 via-emerald-500 to-blue-500"
                      style={{ width: "100%" }}
                    />
                    <div
                      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${percentile}%` }}
                    >
                      <div className="h-5 w-1 rounded-full bg-foreground shadow-lg" />
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Lowest earners</span>
                    <span>Highest earners</span>
                  </div>

                  {/* Reference points */}
                  <div className="mt-4 grid grid-cols-5 gap-1 text-center">
                    {(["p10", "p25", "p50", "p75", "p90"] as const).map((key) => {
                      const val = currentIncomeData[key];
                      const isAbove = parseFloat(income) >= val;
                      return (
                        <div
                          key={key}
                          className={`rounded-lg p-2 ${
                            isAbove ? "bg-primary/10" : "bg-muted/50"
                          }`}
                        >
                          <p className="text-[10px] uppercase text-muted-foreground">
                            {key === "p50" ? "Med" : key.toUpperCase()}
                          </p>
                          <p
                            className={`text-xs font-medium tabular-nums ${
                              isAbove ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {formatUsd(val)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <TrendingUp className="mb-3 h-12 w-12 text-muted-foreground/30" />
              <p className="text-lg font-medium">Enter your details</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Type your monthly income and select a country to see your percentile
              </p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
