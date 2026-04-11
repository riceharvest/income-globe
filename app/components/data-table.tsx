import { useState, useMemo } from "react";
import { Link } from "react-router";
import {
  type CountryData,
  type IndicatorSelection,
  getIndicatorValue,
  adjustForTimePeriod,
  formatUsd,
} from "~/data/countries";
import { Skeleton } from "~/components/ui/skeleton";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

type SortDir = "asc" | "desc" | null;

interface DataTableProps {
  countries: CountryData[];
  indicators: IndicatorSelection[];
  highlightedCodes?: Set<string>;
  loading?: boolean;
}

export function DataTable({
  countries,
  indicators,
  highlightedCodes,
  loading = false,
}: DataTableProps) {
  const [sortCol, setSortCol] = useState<string>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function toggleSort(col: string) {
    if (sortCol === col) {
      // Toggle between asc and desc
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      // New column: name defaults to asc, everything else desc
      setSortCol(col);
      setSortDir(col === "name" ? "asc" : "desc");
    }
  }

  const sorted = useMemo(() => {
    if (!sortDir) return countries;

    return [...countries].sort((a, b) => {
      let cmp: number;
      if (sortCol === "name") {
        cmp = a.name.localeCompare(b.name);
      } else if (sortCol === "region") {
        cmp = a.region.localeCompare(b.region);
      } else if (sortCol === "population") {
        cmp = a.population - b.population;
      } else if (sortCol === "hdi") {
        cmp = (a.hdi ?? -1) - (b.hdi ?? -1);
      } else if (sortCol === "minimumWageEur") {
        cmp = (a.minimumWageEur ?? -1) - (b.minimumWageEur ?? -1);
      } else if (sortCol === "costOfLivingIndex") {
        cmp = (a.costOfLivingIndex ?? -1) - (b.costOfLivingIndex ?? -1);
      } else if (sortCol === "internetPenetration") {
        cmp = (a.internetPenetration ?? -1) - (b.internetPenetration ?? -1);
      } else if (sortCol === "unemploymentRate") {
        cmp = (a.unemploymentRate ?? -1) - (b.unemploymentRate ?? -1);
      } else if (sortCol === "obesityRate") {
        cmp = (a.obesityRate ?? -1) - (b.obesityRate ?? -1);
      } else if (sortCol === "smokingRate") {
        cmp = (a.smokingRate ?? -1) - (b.smokingRate ?? -1);
      } else if (sortCol.startsWith("indicator_")) {
        const idx = parseInt(sortCol.split("_")[1]);
        const ind = indicators[idx];
        if (!ind) return 0;
        const va = getIndicatorValue(a, ind);
        const vb = getIndicatorValue(b, ind);
        cmp = va - vb;
      } else {
        cmp = 0;
      }
      return sortDir === "desc" ? -cmp : cmp;
    });
  }, [countries, sortCol, sortDir, indicators]);

  function SortIcon({ col }: { col: string }) {
    if (sortCol !== col)
      return <ArrowUpDown className="h-3 w-3 text-muted-foreground/50" />;
    return sortDir === "asc" ? (
      <ArrowUp className="h-3 w-3" />
    ) : (
      <ArrowDown className="h-3 w-3" />
    );
  }

  function formatValue(val: number, ind: IndicatorSelection): string {
    const adjusted = adjustForTimePeriod(val, ind.timePeriod);
    if (ind.indicator === "wealth") {
      if (adjusted >= 1000000) return `$${(adjusted / 1000000).toFixed(1)}M`;
      if (adjusted >= 1000) return `$${(adjusted / 1000).toFixed(0)}k`;
      return `$${adjusted}`;
    }
    return formatUsd(adjusted);
  }

  function getIndicatorColumnLabel(ind: IndicatorSelection): string {
    const parts: string[] = [];
    if (ind.percentileGroup === "threshold" && ind.threshold) {
      parts.push(`P${ind.threshold}`);
    } else if (ind.percentileGroup === "custom" && ind.customRange) {
      parts.push(`P${ind.customRange[0]}-${ind.customRange[1]}`);
    } else if (ind.percentileGroup === "bottom50") {
      parts.push("Bottom 50%");
    } else if (ind.percentileGroup === "middle40") {
      parts.push("Middle 40%");
    } else if (ind.percentileGroup === "top10") {
      parts.push("Top 10%");
    } else if (ind.percentileGroup === "top1") {
      parts.push("Top 1%");
    }

    const shortIndicator: Record<string, string> = {
      pretax_national: "Pre-tax",
      posttax_national: "Post-tax",
      consumption: "Consumption",
      wealth: "Wealth",
      labor_income: "Wages",
    };
    parts.push(shortIndicator[ind.indicator] || ind.indicator);

    return parts.join(" · ");
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10 bg-card">
          <tr className="border-b border-border">
            <th className="w-8 p-3 text-left">#</th>
            <th className="p-3 text-left">
              <button
                onClick={() => toggleSort("name")}
                className="inline-flex items-center gap-1 font-semibold hover:text-foreground"
              >
                Country <SortIcon col="name" />
              </button>
            </th>
            <th className="hidden p-3 text-left sm:table-cell">
              <button
                onClick={() => toggleSort("region")}
                className="inline-flex items-center gap-1 font-semibold hover:text-foreground"
              >
                Region <SortIcon col="region" />
              </button>
            </th>
            <th className="hidden p-3 text-right md:table-cell">
              <button
                onClick={() => toggleSort("population")}
                className="inline-flex items-center gap-1 font-semibold hover:text-foreground"
              >
                Population <SortIcon col="population" />
              </button>
            </th>
            <th className="hidden p-3 text-right lg:table-cell">
              <button
                onClick={() => toggleSort("hdi")}
                className="inline-flex items-center gap-1 font-semibold hover:text-foreground"
              >
                HDI <SortIcon col="hdi" />
              </button>
            </th>
            <th className="hidden p-3 text-right xl:table-cell">
              <button
                onClick={() => toggleSort("minimumWageEur")}
                className="inline-flex items-center gap-1 font-semibold hover:text-foreground"
              >
                Min Wage <SortIcon col="minimumWageEur" />
              </button>
            </th>
            <th className="hidden p-3 text-right xl:table-cell">
              <button
                onClick={() => toggleSort("costOfLivingIndex")}
                className="inline-flex items-center gap-1 font-semibold hover:text-foreground"
              >
                Cost of Living <SortIcon col="costOfLivingIndex" />
              </button>
            </th>
            <th className="hidden p-3 text-right xl:table-cell">
              <button
                onClick={() => toggleSort("internetPenetration")}
                className="inline-flex items-center gap-1 font-semibold hover:text-foreground"
              >
                Internet % <SortIcon col="internetPenetration" />
              </button>
            </th>
            <th className="hidden p-3 text-right xl:table-cell">
              <button
                onClick={() => toggleSort("unemploymentRate")}
                className="inline-flex items-center gap-1 font-semibold hover:text-foreground"
              >
                Unemploy. % <SortIcon col="unemploymentRate" />
              </button>
            </th>
            <th className="hidden p-3 text-right xl:table-cell">
              <button
                onClick={() => toggleSort("obesityRate")}
                className="inline-flex items-center gap-1 font-semibold hover:text-foreground"
              >
                Obesity % <SortIcon col="obesityRate" />
              </button>
            </th>
            <th className="hidden p-3 text-right xl:table-cell">
              <button
                onClick={() => toggleSort("smokingRate")}
                className="inline-flex items-center gap-1 font-semibold hover:text-foreground"
              >
                Smoking % <SortIcon col="smokingRate" />
              </button>
            </th>
            {indicators.map((ind, i) => (
              <th key={ind.id} className="p-3 text-right">
                <button
                  onClick={() => toggleSort(`indicator_${i}`)}
                  className="inline-flex items-center gap-1 font-semibold hover:text-foreground"
                >
                  {getIndicatorColumnLabel(ind)}
                  <SortIcon col={`indicator_${i}`} />
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((country, idx) => {
            const isHighlighted = highlightedCodes?.has(country.code);
            return (
              <tr
                key={country.code}
                className={`border-b border-border/50 transition-colors hover:bg-secondary/50 ${
                  isHighlighted ? "bg-primary/5" : idx % 2 === 1 ? "bg-muted/20" : ""
                }`}
              >
                <td className="p-3 text-muted-foreground tabular-nums">
                  {idx + 1}
                </td>
                <td className="p-3">
                  <Link
                    to={`/country/${country.code}`}
                    className="inline-flex items-center gap-2 font-medium hover:text-primary hover:underline"
                  >
                    <span className="text-base">{country.flag}</span>
                    <span>{country.name}</span>
                  </Link>
                </td>
                <td className="hidden p-3 text-muted-foreground sm:table-cell">
                  {country.region}
                </td>
                <td className="hidden p-3 text-right tabular-nums text-muted-foreground md:table-cell">
                  {country.population
                    ? country.population >= 1_000_000
                      ? `${(country.population / 1_000_000).toFixed(1)}M`
                      : `${(country.population / 1_000).toFixed(0)}k`
                    : "—"}
                </td>
                <td className="hidden p-3 text-right tabular-nums lg:table-cell">
                  {country.hdi != null ? country.hdi.toFixed(2) : "—"}
                </td>
                <td className="hidden p-3 text-right tabular-nums xl:table-cell">
                  {country.minimumWageEur != null ? `€${country.minimumWageEur.toLocaleString()}` : "—"}
                </td>
                <td className="hidden p-3 text-right tabular-nums xl:table-cell">
                  {country.costOfLivingIndex != null ? country.costOfLivingIndex : "—"}
                </td>
                <td className="hidden p-3 text-right tabular-nums xl:table-cell">
                  {country.internetPenetration != null ? `${country.internetPenetration}%` : "—"}
                </td>
                <td className="hidden p-3 text-right tabular-nums xl:table-cell">
                  {country.unemploymentRate != null ? `${country.unemploymentRate}%` : "—"}
                </td>
                <td className="hidden p-3 text-right tabular-nums xl:table-cell">
                  {country.obesityRate != null ? `${country.obesityRate}%` : "—"}
                </td>
                <td className="hidden p-3 text-right tabular-nums xl:table-cell">
                  {country.smokingRate != null ? `${country.smokingRate}%` : "—"}
                </td>
                {indicators.map((ind) => {
                  const val = getIndicatorValue(country, ind);
                  return (
                    <td
                      key={ind.id}
                      className="p-3 text-right font-medium tabular-nums"
                    >
                      {formatValue(val, ind)}
                      <span className="text-xs text-muted-foreground">
                        /{ind.timePeriod === "annual" ? "yr" : "mo"}
                      </span>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {sorted.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          No countries match your filters
        </div>
      )}
    </div>
  );
}
