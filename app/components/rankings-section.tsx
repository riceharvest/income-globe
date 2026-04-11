import { useState, useMemo } from "react";
import { uniqueCountriesData, type CountryData } from "~/data/countries";
import { Card, CardContent } from "~/components/ui/card";
import { ArrowUpDown } from "lucide-react";

type Tab = "income" | "demographics" | "quality";

type RankingMetric = {
  id: string;
  label: string;
  getValue: (c: CountryData) => number | undefined;
  format: (v: number) => string;
  unit: string;
};

const INCOME_METRICS: RankingMetric[] = [
  {
    id: "median_income",
    label: "Median Income (post-tax, monthly)",
    getValue: (c) => c.income.p50,
    format: (v) => `$${v.toLocaleString()}`,
    unit: "/mo",
  },
];

const DEMOGRAPHICS_METRICS: RankingMetric[] = [
  {
    id: "english",
    label: "English Speaking %",
    getValue: (c) => c.englishSpeakingPercent,
    format: (v) => `${v}%`,
    unit: "",
  },
  {
    id: "female_bmi",
    label: "Avg Female BMI",
    getValue: (c) => c.femaleBmi,
    format: (v) => v.toFixed(1),
    unit: "",
  },
  {
    id: "female_height",
    label: "Avg Female Height",
    getValue: (c) => c.femaleHeightCm,
    format: (v) => `${v} cm`,
    unit: "",
  },
];

const QUALITY_METRICS: RankingMetric[] = [
  {
    id: "hdi",
    label: "Human Development Index",
    getValue: (c) => c.hdi,
    format: (v) => v.toFixed(2),
    unit: "",
  },
  {
    id: "min_wage",
    label: "Minimum Wage",
    getValue: (c) => c.minimumWageEur,
    format: (v) => `€${v.toLocaleString()}`,
    unit: "/mo",
  },
  {
    id: "cost_living",
    label: "Cost of Living Index",
    getValue: (c) => c.costOfLivingIndex,
    format: (v) => String(v),
    unit: " (NYC=100)",
  },
  {
    id: "internet",
    label: "Internet Penetration",
    getValue: (c) => c.internetPenetration,
    format: (v) => `${v}%`,
    unit: "",
  },
  {
    id: "unemployment",
    label: "Unemployment Rate",
    getValue: (c) => c.unemploymentRate,
    format: (v) => `${v}%`,
    unit: "",
  },
  {
    id: "obesity",
    label: "Obesity Rate",
    getValue: (c) => c.obesityRate,
    format: (v) => `${v}%`,
    unit: "",
  },
  {
    id: "smoking",
    label: "Smoking Rate",
    getValue: (c) => c.smokingRate,
    format: (v) => `${v}%`,
    unit: "",
  },
];

function getMetrics(tab: Tab): RankingMetric[] {
  if (tab === "income") return INCOME_METRICS;
  if (tab === "demographics") return DEMOGRAPHICS_METRICS;
  return QUALITY_METRICS;
}

function getTopAndBottom(
  metric: RankingMetric,
  count = 5
): { top: CountryData[]; bottom: CountryData[] } {
  const withData = uniqueCountriesData.filter(
    (c) => metric.getValue(c) !== undefined
  );
  const sorted = [...withData].sort(
    (a, b) => metric.getValue(b)! - metric.getValue(a)!
  );
  return {
    top: sorted.slice(0, count),
    bottom: sorted.slice(-count).reverse(),
  };
}

function RankingList({
  countries,
  metric,
  accent,
}: {
  countries: CountryData[];
  metric: RankingMetric;
  accent: "green" | "red";
}) {
  const bgClass =
    accent === "green"
      ? "bg-emerald-950/30 border-emerald-500/20"
      : "bg-red-950/30 border-red-500/20";
  const dotClass =
    accent === "green" ? "bg-emerald-500" : "bg-red-500";

  return (
    <div className={`space-y-1 rounded-lg border p-3 ${bgClass}`}>
      {countries.length === 0 ? (
        <p className="text-xs text-muted-foreground">No data</p>
      ) : (
        countries.map((country, idx) => {
          const val = metric.getValue(country);
          return (
            <div
              key={country.code}
              className="flex items-center gap-2 text-xs"
            >
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full ${dotClass} shrink-0`}
              />
              <span className="w-4 text-muted-foreground">{idx + 1}</span>
              <span className="text-base">{country.flag}</span>
              <span className="flex-1 truncate font-medium">{country.name}</span>
              <span className="tabular-nums text-muted-foreground">
                {val !== undefined ? metric.format(val) : "—"}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
}

export function RankingsSection() {
  const [tab, setTab] = useState<Tab>("quality");
  const [selectedMetric, setSelectedMetric] = useState<string>(
    QUALITY_METRICS[0].id
  );

  const metrics = getMetrics(tab);
  const activeMetric =
    metrics.find((m) => m.id === selectedMetric) || metrics[0];

  const { top, bottom } = useMemo(
    () => getTopAndBottom(activeMetric),
    [activeMetric]
  );

  function handleTabChange(newTab: Tab) {
    setTab(newTab);
    const m = getMetrics(newTab);
    setSelectedMetric(m[0].id);
  }

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-5">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Rankings</h2>
          <p className="text-sm text-muted-foreground">
            Compare countries by different metrics
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 rounded-lg border border-border p-1">
          {(["income", "demographics", "quality"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                tab === t
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "income"
                ? "Income"
                : t === "demographics"
                ? "Demographics"
                : "Quality of Life"}
            </button>
          ))}
        </div>
      </div>

      {/* Metric selector */}
      <div className="flex flex-wrap items-center gap-2">
        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
        {metrics.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelectedMetric(m.id)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              selectedMetric === m.id
                ? "bg-secondary text-secondary-foreground ring-1 ring-secondary"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Two-column rankings */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Top 5
            </span>
          </div>
          <RankingList countries={top} metric={activeMetric} accent="green" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
              Bottom 5
            </span>
          </div>
          <RankingList countries={bottom} metric={activeMetric} accent="red" />
        </div>
      </div>
    </div>
  );
}