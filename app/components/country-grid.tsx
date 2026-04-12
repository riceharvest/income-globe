import { useMemo } from "react";
import { type CountryData } from "~/data/countries";
import { cn } from "~/lib/utils";

type SortOption = "name" | "median_asc" | "median_desc";

interface CountryGridProps {
  countries: CountryData[];
  onSelectCountry: (code: string) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

type IndicatorKey = "unemployment" | "obesity" | "adolescentBirthRate" | "laborForceGap";

function getIndicatorStatus(country: CountryData, indicator: IndicatorKey): "good" | "moderate" | "bad" {
  switch (indicator) {
    case "unemployment": {
      const v = country.unemploymentRate;
      if (v == null) return "moderate";
      if (v > 15) return "bad";
      if (v >= 5) return "moderate";
      return "good";
    }
    case "obesity": {
      const v = country.obesityRate;
      if (v == null) return "moderate";
      if (v > 30) return "bad";
      if (v >= 15) return "moderate";
      return "good";
    }
    case "adolescentBirthRate": {
      const v = country.gender.adolescentBirthRate;
      if (v == null) return "moderate";
      if (v > 50) return "bad";
      if (v >= 10) return "moderate";
      return "good";
    }
    case "laborForceGap": {
      const v = country.gender.laborForceGap;
      if (v == null) return "moderate";
      const abs = Math.abs(v);
      if (abs > 20) return "bad";
      if (abs >= 5) return "moderate";
      return "good";
    }
  }
}

const STATUS_COLORS: Record<"good" | "moderate" | "bad", string> = {
  good: "bg-green-500",
  moderate: "bg-yellow-500",
  bad: "bg-red-500",
};

const INDICATOR_LABELS: Record<IndicatorKey, string> = {
  unemployment: "Unemp.",
  obesity: "Obesity",
  adolescentBirthRate: "Teen Birth",
  laborForceGap: "Gender Gap",
};

function formatPopulation(pop: number): string {
  if (pop >= 1_000_000) return `${(pop / 1_000_000).toFixed(1)}M`;
  if (pop >= 1_000) return `${Math.round(pop / 1_000)}k`;
  return pop.toString();
}

function formatIncome(val: number): string {
  return `$${val.toLocaleString("en-US")}/yr`;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "name", label: "A–Z" },
  { value: "median_asc", label: "Lowest P50" },
  { value: "median_desc", label: "Highest P50" },
];

interface CountryCardProps {
  country: CountryData;
  maxP50: number;
  isSelected: boolean;
  onClick: () => void;
}

function CountryCard({ country, maxP50, isSelected, onClick }: CountryCardProps) {
  const barWidth = maxP50 > 0 ? (country.income.p50 / maxP50) * 100 : 0;

  const indicators: IndicatorKey[] = ["unemployment", "obesity", "adolescentBirthRate", "laborForceGap"];

  return (
    <button
      onClick={onClick}
      className={cn(
        "bg-card border border-border rounded-xl p-4 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer text-left w-full",
        isSelected && "ring-2 ring-primary"
      )}
    >
      {/* Top row: flag + name + region badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{country.flag}</span>
        <span className="font-semibold text-sm flex-1 truncate">{country.name}</span>
        <span className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs shrink-0">
          {country.region}
        </span>
      </div>

      {/* Income bar */}
      <div className="mb-3">
        <p className="text-xs text-muted-foreground mb-1">Median Income</p>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full transition-all"
            style={{ width: `${barWidth}%` }}
          />
        </div>
        <p className="text-sm font-medium mt-1">{formatIncome(country.income.p50)}</p>
      </div>

      {/* Indicator dots */}
      <div className="flex items-center gap-3 mb-3">
        {indicators.map((key) => {
          const status = getIndicatorStatus(country, key);
          return (
            <div key={key} className="flex flex-col items-center gap-0.5">
              <span className={cn("w-2.5 h-2.5 rounded-full", STATUS_COLORS[status])} />
              <span className="text-xs text-muted-foreground">{INDICATOR_LABELS[key]}</span>
            </div>
          );
        })}
      </div>

      {/* Bottom: population + HDI badge */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {formatPopulation(country.population)} people
        </span>
        {country.hdi != null && (
          <span className="text-xs bg-secondary text-secondary-foreground rounded-full px-2 py-0.5">
            HDI {country.hdi.toFixed(2)}
          </span>
        )}
      </div>
    </button>
  );
}

export default function CountryGrid({
  countries,
  onSelectCountry,
  sort,
  onSortChange,
}: CountryGridProps) {
  const maxP50 = useMemo(
    () => Math.max(...countries.map((c) => c.income.p50), 0),
    [countries]
  );

  const sorted = useMemo(() => {
    const arr = [...countries];
    switch (sort) {
      case "name":
        return arr.sort((a, b) => a.name.localeCompare(b.name));
      case "median_asc":
        return arr.sort((a, b) => a.income.p50 - b.income.p50);
      case "median_desc":
        return arr.sort((a, b) => b.income.p50 - a.income.p50);
    }
  }, [countries, sort]);

  return (
    <div>
      {/* Sort controls */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-muted-foreground">Sort:</span>
        <div className="flex gap-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSortChange(opt.value)}
              className={cn(
                "text-sm px-3 py-1.5 rounded-md transition-colors",
                sort === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {sorted.map((country) => (
          <CountryCard
            key={country.code}
            country={country}
            maxP50={maxP50}
            isSelected={false}
            onClick={() => onSelectCountry(country.code)}
          />
        ))}
      </div>
    </div>
  );
}