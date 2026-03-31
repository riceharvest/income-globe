import { useState } from "react";
import { useParams, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { IncomeBar } from "~/components/income-bar";
import {
  getCountryByCode,
  formatUsd,
  formatLocalCurrency,
  uniqueCountriesData,
  indicatorLabels,
  type IndicatorType,
} from "~/data/countries";
import { ArrowLeft, Database, TrendingUp } from "lucide-react";

const percentileDescriptions: Record<string, string> = {
  p10: "Bottom 10% earn less than this",
  p25: "Bottom 25% earn less than this",
  p50: "Half the population earns less than this",
  p75: "Top 25% earn more than this",
  p90: "Top 10% earn more than this",
};

const indicatorTabs: { value: IndicatorType; label: string }[] = [
  { value: "posttax_national", label: "Post-tax" },
  { value: "pretax_national", label: "Pre-tax" },
  { value: "consumption", label: "Consumption" },
  { value: "labor_income", label: "Wages" },
  { value: "wealth", label: "Wealth" },
];

export default function CountryDetail() {
  const { code } = useParams();
  const country = getCountryByCode(code?.toUpperCase() || "");
  const [activeIndicator, setActiveIndicator] = useState<IndicatorType>("posttax_national");

  if (!country) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-6xl">🌍</p>
        <h2 className="mt-4 text-2xl font-bold">Country not found</h2>
        <p className="mt-2 text-muted-foreground">
          We don't have data for this country yet.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to all countries
        </Link>
      </div>
    );
  }

  const currentData = country.indicators[activeIndicator];
  const entries = [
    { key: "p10", label: "P10", value: currentData.p10, percentile: 10 },
    { key: "p25", label: "P25", value: currentData.p25, percentile: 25 },
    { key: "p50", label: "Median (P50)", value: currentData.p50, percentile: 50 },
    { key: "p75", label: "P75", value: currentData.p75, percentile: 75 },
    { key: "p90", label: "P90", value: currentData.p90, percentile: 90 },
  ];

  const maxIncome = Math.max(...uniqueCountriesData.map((c) => c.income.p90));
  const gapRatio = (currentData.p90 / currentData.p10).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> All countries
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4">
        <span className="text-5xl">{country.flag}</span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{country.name}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{country.region}</Badge>
            <Badge variant="secondary">{country.currency}</Badge>
            <Badge variant="secondary">
              <Database className="mr-1 h-3 w-3" />
              {country.dataSource} · {country.dataYear}
            </Badge>
          </div>
        </div>
      </div>

      {/* Key stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold">{formatUsd(currentData.p50)}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
              Median monthly income
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold">{gapRatio}×</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
              P90/P10 income gap
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold">
              {country.population
                ? `${(country.population / 1_000_000).toFixed(0)}M`
                : "—"}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
              Population
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Indicator tabs */}
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

      {/* Distribution chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {indicatorLabels[activeIndicator]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <IncomeBar
            income={currentData}
            maxValue={maxIncome}
            showLabels
            highlightMedian
          />
        </CardContent>
      </Card>

      {/* Detailed breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {entries.map((entry) => {
              const isMedian = entry.key === "p50";
              return (
                <div key={entry.key}>
                  <div
                    className={`flex items-center justify-between ${
                      isMedian ? "rounded-lg bg-primary/5 p-3 -mx-3" : ""
                    }`}
                  >
                    <div>
                      <p
                        className={`font-medium ${
                          isMedian ? "text-lg font-bold" : ""
                        }`}
                      >
                        {entry.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {percentileDescriptions[entry.key]}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`tabular-nums ${
                          isMedian ? "text-2xl font-bold" : "text-lg font-semibold"
                        }`}
                      >
                        ${entry.value.toLocaleString()}
                        <span className="text-sm text-muted-foreground">/mo</span>
                      </p>
                      <p className="text-xs text-muted-foreground tabular-nums">
                        {formatLocalCurrency(
                          entry.value,
                          country.currencySymbol,
                          country.exchangeRate
                        )}
                        /mo
                      </p>
                    </div>
                  </div>
                  {entry.key !== "p90" && <Separator className="mt-4" />}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="flex flex-wrap gap-3">
        <Link
          to={`/calculator?country=${country.code}`}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Where do I fit in {country.name}?
        </Link>
        <Link
          to={`/compare?countries=${country.code}`}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
        >
          Compare with other countries
        </Link>
      </div>
    </div>
  );
}
