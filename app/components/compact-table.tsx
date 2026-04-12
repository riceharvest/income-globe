import { useState, useMemo } from "react";
import { Link } from "react-router";
import {
  type CountryData,
  type IndicatorSelection,
  getIndicatorValue,
  adjustForTimePeriod,
  formatUsd,
} from "~/data/countries";
import { cn } from "~/lib/utils";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

type SortDir = "asc" | "desc" | null;
type FilterGroup = "country" | "economic" | "health" | "gender";

interface ColumnDef {
  id: string;
  label: string;
  group: FilterGroup;
  align: "left" | "right" | "center";
  format: (c: CountryData) => string | null;
  bar?: boolean;
  barMax?: number;
  barValue?: (c: CountryData) => number;
  sortFn?: (a: CountryData, b: CountryData) => number;
}

const COLUMNS: ColumnDef[] = [
  // ── Country ────────────────────────────────────────────────────────────────
  {
    id: "name",
    label: "Country",
    group: "country",
    align: "left",
    format: (c) => c.name,
    sortFn: (a, b) => a.name.localeCompare(b.name),
  },
  {
    id: "flag",
    label: "",
    group: "country",
    align: "center",
    format: (c) => c.flag,
  },
  {
    id: "region",
    label: "Region",
    group: "country",
    align: "left",
    format: (c) => c.region,
    sortFn: (a, b) => a.region.localeCompare(b.region),
  },
  // ── Economic ──────────────────────────────────────────────────────────────
  {
    id: "population",
    label: "Population",
    group: "economic",
    align: "right",
    format: (c) =>
      c.population == null
        ? null
        : c.population >= 1_000_000
          ? `${(c.population / 1_000_000).toFixed(1)}M`
          : `${(c.population / 1_000).toFixed(0)}k`,
    bar: true,
    barMax: 1_400_000_000,
    barValue: (c) => c.population ?? 0,
    sortFn: (a, b) => (a.population ?? -1) - (b.population ?? -1),
  },
  {
    id: "minimumWageEur",
    label: "Min Wage",
    group: "economic",
    align: "right",
    format: (c) =>
      c.minimumWageEur == null ? null : `€${c.minimumWageEur.toLocaleString()}`,
    bar: true,
    barMax: 3000,
    barValue: (c) => c.minimumWageEur ?? 0,
    sortFn: (a, b) => (a.minimumWageEur ?? -1) - (b.minimumWageEur ?? -1),
  },
  {
    id: "costOfLivingIndex",
    label: "Cost of Living",
    group: "economic",
    align: "right",
    format: (c) => (c.costOfLivingIndex == null ? null : String(c.costOfLivingIndex)),
    bar: true,
    barMax: 150,
    barValue: (c) => c.costOfLivingIndex ?? 0,
    sortFn: (a, b) => (a.costOfLivingIndex ?? -1) - (b.costOfLivingIndex ?? -1),
  },
  {
    id: "internetPenetration",
    label: "Internet %",
    group: "economic",
    align: "right",
    format: (c) => (c.internetPenetration == null ? null : `${c.internetPenetration}%`),
    bar: true,
    barMax: 100,
    barValue: (c) => c.internetPenetration ?? 0,
    sortFn: (a, b) => (a.internetPenetration ?? -1) - (b.internetPenetration ?? -1),
  },
  {
    id: "unemploymentRate",
    label: "Unemploy. %",
    group: "economic",
    align: "right",
    format: (c) => (c.unemploymentRate == null ? null : `${c.unemploymentRate}%`),
    bar: true,
    barMax: 30,
    barValue: (c) => c.unemploymentRate ?? 0,
    sortFn: (a, b) => (a.unemploymentRate ?? -1) - (b.unemploymentRate ?? -1),
  },
  {
    id: "englishSpeakingPercent",
    label: "English %",
    group: "economic",
    align: "right",
    format: (c) =>
      c.englishSpeakingPercent == null ? null : `${c.englishSpeakingPercent}%`,
    bar: true,
    barMax: 100,
    barValue: (c) => c.englishSpeakingPercent ?? 0,
    sortFn: (a, b) =>
      (a.englishSpeakingPercent ?? -1) - (b.englishSpeakingPercent ?? -1),
  },
  // ── Health ─────────────────────────────────────────────────────────────────
  {
    id: "obesityRate",
    label: "Obesity %",
    group: "health",
    align: "right",
    format: (c) => (c.obesityRate == null ? null : `${c.obesityRate}%`),
    bar: true,
    barMax: 60,
    barValue: (c) => c.obesityRate ?? 0,
    sortFn: (a, b) => (a.obesityRate ?? -1) - (b.obesityRate ?? -1),
  },
  {
    id: "smokingRate",
    label: "Smoking %",
    group: "health",
    align: "right",
    format: (c) => (c.smokingRate == null ? null : `${c.smokingRate}%`),
    bar: true,
    barMax: 40,
    barValue: (c) => c.smokingRate ?? 0,
    sortFn: (a, b) => (a.smokingRate ?? -1) - (b.smokingRate ?? -1),
  },
  {
    id: "femaleHeightCm",
    label: "Avg Height (F)",
    group: "health",
    align: "right",
    format: (c) => (c.femaleHeightCm == null ? null : `${c.femaleHeightCm}cm`),
    bar: true,
    barMax: 170,
    barValue: (c) => c.femaleHeightCm ?? 0,
    sortFn: (a, b) => (a.femaleHeightCm ?? -1) - (b.femaleHeightCm ?? -1),
  },
  {
    id: "femaleBmi",
    label: "Avg BMI (F)",
    group: "health",
    align: "right",
    format: (c) => (c.femaleBmi == null ? null : String(c.femaleBmi)),
    bar: true,
    barMax: 35,
    barValue: (c) => c.femaleBmi ?? 0,
    sortFn: (a, b) => (a.femaleBmi ?? -1) - (b.femaleBmi ?? -1),
  },
  // ── Gender ─────────────────────────────────────────────────────────────────
  {
    id: "adolescentBirthRate",
    label: "Adolescent Birth Rate",
    group: "gender",
    align: "right",
    format: (c) =>
      c.gender.adolescentBirthRate == null
        ? null
        : String(c.gender.adolescentBirthRate),
    bar: true,
    barMax: 200,
    barValue: (c) => c.gender.adolescentBirthRate ?? 0,
    sortFn: (a, b) =>
      (a.gender.adolescentBirthRate ?? -1) - (b.gender.adolescentBirthRate ?? -1),
  },
  {
    id: "childMarriagePercent",
    label: "Child Marriage %",
    group: "gender",
    align: "right",
    format: (c) =>
      c.gender.childMarriagePercent == null
        ? null
        : `${c.gender.childMarriagePercent}%`,
    bar: true,
    barMax: 60,
    barValue: (c) => c.gender.childMarriagePercent ?? 0,
    sortFn: (a, b) =>
      (a.gender.childMarriagePercent ?? -1) - (b.gender.childMarriagePercent ?? -1),
  },
  {
    id: "laborForceGap",
    label: "Labor Force Gap",
    group: "gender",
    align: "right",
    format: (c) =>
      c.gender.laborForceGap == null ? null : `${c.gender.laborForceGap}%`,
    bar: true,
    barMax: 80,
    barValue: (c) => Math.abs(c.gender.laborForceGap ?? 0),
    sortFn: (a, b) =>
      (a.gender.laborForceGap ?? -1) - (b.gender.laborForceGap ?? -1),
  },
  {
    id: "contraceptiveUse",
    label: "Contraceptive %",
    group: "gender",
    align: "right",
    format: (c) =>
      c.gender.contraceptiveUse == null
        ? null
        : `${c.gender.contraceptiveUse}%`,
    bar: true,
    barMax: 100,
    barValue: (c) => c.gender.contraceptiveUse ?? 0,
    sortFn: (a, b) =>
      (a.gender.contraceptiveUse ?? -1) - (b.gender.contraceptiveUse ?? -1),
  },
];

// ── Bar ─────────────────────────────────────────────────────────────────────

function Bar({
  value,
  max,
  formatted,
}: {
  value: number;
  max: number;
  formatted: string;
}) {
  const pct = Math.min(1, value / max);
  const filled = Math.round(pct * 10);
  const empty = 10 - filled;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline text-[4px] leading-none font-mono whitespace-pre">
        {"█".repeat(filled)}
        {"░".repeat(empty)}
      </span>
      <span className="text-muted-foreground">{formatted}</span>
    </span>
  );
}

// ── CompactTable ─────────────────────────────────────────────────────────────

interface CompactTableProps {
  countries: CountryData[];
  indicators: IndicatorSelection[];
  visibleGroupColumns: Record<string, boolean>;
  highlightedCodes?: Set<string>;
  loading?: boolean;
  onRowClick?: (code: string) => void;
}

export function CompactTable({
  countries,
  indicators,
  visibleGroupColumns,
  highlightedCodes,
  loading = false,
  onRowClick,
}: CompactTableProps) {
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  // Only show columns whose group is active
  const visibleCols = useMemo(
    () => COLUMNS.filter((col) => visibleGroupColumns[col.id]),
    [visibleGroupColumns]
  );

  function handleSort(col: ColumnDef) {
    if (!col.sortFn) return;
    if (sortCol === col.id) {
      if (sortDir === "asc") setSortDir("desc");
      else if (sortDir === "desc") {
        setSortCol(null);
        setSortDir(null);
      }
    } else {
      setSortCol(col.id);
      setSortDir("asc");
    }
  }

  const sorted = useMemo(() => {
    if (!sortDir || !sortCol) return countries;
    const col = COLUMNS.find((c) => c.id === sortCol);
    if (!col?.sortFn) return countries;
    return [...countries].sort((a, b) => {
      const cmp = col.sortFn!(a, b);
      return sortDir === "desc" ? -cmp : cmp;
    });
  }, [countries, sortCol, sortDir]);

  function SortIcon({ col }: { col: ColumnDef }) {
    if (sortCol !== col.id) return <ArrowUpDown className="h-3 w-3 text-muted-foreground/40 shrink-0" />;
    if (sortDir === "asc") return <ArrowUp className="h-3 w-3 shrink-0" />;
    return <ArrowDown className="h-3 w-3 shrink-0" />;
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-border overflow-hidden">
        {/* Mobile skeletons */}
        <div className="md:hidden divide-y divide-border/50">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-4 py-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-8 w-8 rounded bg-muted animate-pulse" />
                <div className="space-y-1 flex-1">
                  <span className="inline-block h-3 w-24 rounded bg-muted animate-pulse" />
                  <span className="inline-block h-2 w-16 rounded bg-muted animate-pulse" />
                </div>
                <span className="h-4 w-16 rounded bg-muted animate-pulse" />
              </div>
              <div className="grid grid-cols-3 gap-x-3">
                {[1, 2, 3].map((j) => (
                  <span key={j} className="inline-block h-2 w-full rounded bg-muted animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Desktop skeletons */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[640px] text-xs">
            <thead>
              <tr className="bg-card">
                {visibleCols.map((col) => (
                  <th
                    key={col.id}
                    className={cn(
                      "px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                      col.align === "right" && "text-right",
                      col.align === "center" && "text-center",
                      col.id === "name" && "sticky left-0 bg-card z-20 min-w-[120px]"
                    )}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-t border-border/50">
                  {visibleCols.map((col) => (
                    <td
                      key={col.id}
                      className={cn(
                        "px-3 py-2",
                        col.id === "name" && "sticky left-0 bg-card z-10"
                      )}
                    >
                      <span className="inline-block h-3 w-20 rounded bg-muted animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border">
      {/* Mobile: single-column stacked list */}
      <div className="md:hidden divide-y divide-border/50">
        {sorted.map((country, idx) => {
          const highlighted = highlightedCodes?.has(country.code);
          const activeCols = visibleCols.filter((col) => col.id !== "name" && col.id !== "flag");
          return (
            <div
              key={country.code}
              onClick={() => onRowClick?.(country.code)}
              className={cn(
                "px-4 py-3 transition-colors",
                highlighted && "bg-primary/5",
                idx % 2 === 1 && "bg-muted/30",
                onRowClick && "cursor-pointer"
              )}
            >
              {/* Country header */}
              <div className="flex items-center justify-between mb-2">
                <Link
                  to={`/country/${country.code}`}
                  className="flex items-center gap-2 hover:text-primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-2xl">{country.flag}</span>
                  <div>
                    <p className="font-semibold text-sm">{country.name}</p>
                    <p className="text-xs text-muted-foreground">{country.region}</p>
                  </div>
                </Link>
                {/* P50 — hero metric on mobile */}
                {(() => {
                  const p50col = indicators[0];
                  if (!p50col) return null;
                  const val = getIndicatorValue(country, p50col);
                  const adj = adjustForTimePeriod(val, p50col.timePeriod);
                  return (
                    <div className="text-right">
                      <p className="font-semibold text-sm tabular-nums">{formatUsd(adj)}</p>
                      <p className="text-[10px] text-muted-foreground">/{p50col.timePeriod === "annual" ? "yr" : "mo"}</p>
                    </div>
                  );
                })()}
              </div>
              {/* Quick metrics grid */}
              {activeCols.length > 0 && (
                <div className="grid grid-cols-3 gap-x-3 gap-y-1 mt-2">
                  {activeCols.slice(0, 6).map((col) => {
                    const raw = col.format(country);
                    if (raw == null) return null;
                    return (
                      <div key={col.id} className="min-w-0">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide truncate">{col.label}</p>
                        <p className="text-xs font-medium tabular-nums truncate">{raw}</p>
                      </div>
                    );
                  })}
                </div>
              )}
              {/* More columns hint */}
              {visibleCols.length > 7 && (
                <p className="text-[10px] text-muted-foreground mt-2">+{visibleCols.length - 7} more columns → swipe or switch to table view</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop: horizontal table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[640px] text-xs">
          <thead className="sticky top-0 z-10 bg-card">
            <tr className="border-b border-border">
              {visibleCols.map((col) => (
                <th
                  key={col.id}
                  className={cn(
                    "px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                    col.id === "name" && "sticky left-0 bg-card z-20 min-w-[120px] max-w-[180px]"
                  )}
                >
                  {col.sortFn ? (
                    <button
                      onClick={() => handleSort(col)}
                      className={cn(
                        "inline-flex items-center gap-1 font-semibold uppercase tracking-wide hover:text-foreground",
                        col.align === "right" && "flex-row-reverse",
                        col.id === "name" && "text-left"
                      )}
                    >
                      {col.label}
                      <SortIcon col={col} />
                    </button>
                  ) : (
                    <span className={cn(col.id === "name" && "inline-flex items-center")}>
                      {col.label}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((country, idx) => {
              const highlighted = highlightedCodes?.has(country.code);
              return (
                <tr
                  key={country.code}
                  onClick={() => onRowClick?.(country.code)}
                  className={cn(
                    "border-t border-border/50 transition-colors hover:bg-muted/60",
                    highlighted && "bg-primary/5",
                    idx % 2 === 1 && "bg-muted/30",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {visibleCols.map((col) => {
                    const raw = col.format(country);
                    if (col.id === "name") {
                      return (
                        <td
                          key={col.id}
                          className="px-3 py-2 sticky left-0 bg-card z-10 min-w-[120px] max-w-[180px]"
                        >
                          <Link
                            to={`/country/${country.code}`}
                            className="inline-flex items-center gap-1 font-medium hover:text-primary hover:underline truncate"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>{country.flag}</span>
                            <span className="truncate">{country.name}</span>
                          </Link>
                        </td>
                      );
                    }
                    return (
                      <td
                        key={col.id}
                        className={cn(
                          "px-3 py-2 text-muted-foreground",
                          col.align === "right" && "text-right tabular-nums",
                          col.align === "center" && "text-center"
                        )}
                      >
                        {raw == null ? (
                          <span className="text-muted-foreground/40">—</span>
                        ) : col.bar && col.barValue ? (
                          <Bar
                            value={col.barValue(country)}
                            max={col.barMax ?? 100}
                            formatted={raw}
                          />
                        ) : (
                          raw
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
