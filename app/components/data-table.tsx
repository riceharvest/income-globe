import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router";
import {
  type CountryData,
  type IndicatorSelection,
  getIndicatorValue,
  adjustForTimePeriod,
  formatUsd,
} from "~/data/countries";
import { Skeleton } from "~/components/ui/skeleton";
import { ArrowUp, ArrowDown, ArrowUpDown, Columns3 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type SortDir = "asc" | "desc" | null;

interface DataTableProps {
  countries: CountryData[];
  indicators: IndicatorSelection[];
  highlightedCodes?: Set<string>;
  loading?: boolean;
}

interface ColumnDef {
  id: string;
  label: string;
  defaultVisible: boolean;
}

const STATIC_COLUMNS: ColumnDef[] = [
  { id: "row", label: "#", defaultVisible: false },
  { id: "name", label: "Country", defaultVisible: false },
  { id: "region", label: "Region", defaultVisible: false },
  { id: "population", label: "Population", defaultVisible: false },
  { id: "hdi", label: "HDI", defaultVisible: false },
  { id: "minimumWageEur", label: "Min Wage", defaultVisible: false },
  { id: "costOfLivingIndex", label: "Cost of Living", defaultVisible: false },
  { id: "internetPenetration", label: "Internet %", defaultVisible: false },
  { id: "unemploymentRate", label: "Unemploy. %", defaultVisible: false },
  { id: "obesityRate", label: "Obesity %", defaultVisible: false },
  { id: "smokingRate", label: "Smoking %", defaultVisible: false },
  { id: "englishSpeakingPercent", label: "English %", defaultVisible: false },
  { id: "femaleHeightCm", label: "Avg Height (F)", defaultVisible: false },
  { id: "femaleBmi", label: "Avg BMI (F)", defaultVisible: false },
  { id: "adolescentBirthRate", label: "Adolescent Birth Rate", defaultVisible: false },
  { id: "childMarriagePercent", label: "Child Marriage %", defaultVisible: false },
  { id: "laborForceGap", label: "Labor Force Gap", defaultVisible: false },
  { id: "contraceptiveUse", label: "Contraceptive Use %", defaultVisible: false },
];

const STORAGE_KEY = "income-globe-column-visibility-v2";

function loadVisibility(_indicatorCount: number): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, boolean>;
      }
    }
  } catch {
    // ignore
  }
  return {};
}

function saveVisibility(visibility: Record<string, boolean>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visibility));
  } catch {
    // ignore
  }
}

export function DataTable({
  countries,
  indicators,
  highlightedCodes,
  loading = false,
}: DataTableProps) {
  const [sortCol, setSortCol] = useState<string>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [showColMenu, setShowColMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Build full column list including dynamic indicator columns
  const allColumns = useMemo<ColumnDef[]>(() => {
    return [
      ...STATIC_COLUMNS,
      ...indicators.map((ind, i) => ({
        id: `indicator_${i}`,
        label: getIndicatorColumnLabel(ind),
        defaultVisible: true,
      })),
    ];
  }, [indicators]);

  // Visibility state: starts from defaults, merges persisted overrides
  const [visibility, setVisibility] = useState<Record<string, boolean>>(() => {
    const persisted = loadVisibility(indicators.length);
    const initial: Record<string, boolean> = {};
    for (const col of allColumns) {
      initial[col.id] = col.id in persisted ? persisted[col.id] : col.defaultVisible;
    }
    return initial;
  });

  // When indicator count changes (different selection), reconcile visibility
  useEffect(() => {
    setVisibility((prev) => {
      const next: Record<string, boolean> = {};
      for (const col of allColumns) {
        if (col.id in prev) {
          next[col.id] = prev[col.id];
        } else {
          next[col.id] = col.id in persisted ? persisted[col.id] : col.defaultVisible;
        }
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indicators.length]);

  const persisted = useMemo(() => loadVisibility(indicators.length), [indicators.length]);

  function toggleCol(colId: string) {
    setVisibility((prev) => {
      const next = { ...prev, [colId]: !prev[colId] };
      saveVisibility(next);
      return next;
    });
  }

  // Close menu when clicking outside
  useEffect(() => {
    if (!showColMenu) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowColMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showColMenu]);

  function toggleSort(col: string) {
    if (sortCol === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
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
      } else if (sortCol === "englishSpeakingPercent") {
        cmp = (a.englishSpeakingPercent ?? -1) - (b.englishSpeakingPercent ?? -1);
      } else if (sortCol === "femaleHeightCm") {
        cmp = (a.femaleHeightCm ?? -1) - (b.femaleHeightCm ?? -1);
      } else if (sortCol === "femaleBmi") {
        cmp = (a.femaleBmi ?? -1) - (b.femaleBmi ?? -1);
      } else if (sortCol === "adolescentBirthRate") {
        cmp = (a.gender.adolescentBirthRate ?? -1) - (b.gender.adolescentBirthRate ?? -1);
      } else if (sortCol === "childMarriagePercent") {
        cmp = (a.gender.childMarriagePercent ?? -1) - (b.gender.childMarriagePercent ?? -1);
      } else if (sortCol === "laborForceGap") {
        cmp = (a.gender.laborForceGap ?? -1) - (b.gender.laborForceGap ?? -1);
      } else if (sortCol === "contraceptiveUse") {
        cmp = (a.gender.contraceptiveUse ?? -1) - (b.gender.contraceptiveUse ?? -1);
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

  // Columns that show a sort button (all except row index)
  const sortableCols = new Set(
    STATIC_COLUMNS.filter((c) => c.id !== "row").map((c) => c.id)
  );

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
    <div className="space-y-2">
      {/* Table header row with column visibility control */}
      <div className="flex items-center justify-end">
        <div className="relative" ref={menuRef}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowColMenu((v) => !v)}
            aria-expanded={showColMenu}
            className="gap-1.5"
          >
            <Columns3 className="h-3.5 w-3.5" />
            Columns
          </Button>

          {showColMenu && (
            <div
              ref={menuRef}
              className="absolute right-0 top-full z-50 mt-1.5 min-w-[11rem] rounded-lg border border-border bg-popover p-2 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10"
            >
              <div className="mb-1.5 px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Toggle Columns
              </div>
              <div className="flex flex-col gap-0.5">
                {allColumns.map((col) => (
                  <label
                    key={col.id}
                    className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 hover:bg-muted"
                  >
                    <input
                      type="checkbox"
                      checked={visibility[col.id] ?? col.defaultVisible}
                      onChange={() => toggleCol(col.id)}
                      className="accent-primary"
                    />
                    <span className="text-sm">{col.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-card">
            <tr className="border-b border-border">
              {/* # column */}
              <th
                className={cn(
                  "w-8 p-3 text-left align-middle",
                  !visibility["row"] && "hidden"
                )}
              >
                <span className="font-semibold">#</span>
              </th>

              {/* Country column */}
              <th
                className={cn(
                  "p-3 text-left align-middle",
                  !visibility["name"] && "hidden"
                )}
              >
                <button
                  onClick={() => toggleSort("name")}
                  className="inline-flex items-center gap-1 font-semibold hover:text-foreground"
                >
                  Country <SortIcon col="name" />
                </button>
              </th>

              {/* Region */}
              <th
                className={cn(
                  "hidden p-3 text-left align-middle sm:table-cell",
                  !visibility["region"] && "hidden"
                )}
              >
                <button
                  onClick={() => toggleSort("region")}
                  className="inline-flex items-center gap-1 font-semibold hover:text-foreground"
                >
                  Region <SortIcon col="region" />
                </button>
              </th>

              {/* Population */}
              <th
                className={cn(
                  "hidden p-3 text-right align-middle md:table-cell",
                  !visibility["population"] && "hidden"
                )}
              >
                <button
                  onClick={() => toggleSort("population")}
                  className="inline-flex items-center gap-1 font-semibold hover:text-foreground"
                >
                  Population <SortIcon col="population" />
                </button>
              </th>

              {/* HDI */}
              <th
                className={cn(
                  "hidden p-3 text-right align-middle lg:table-cell",
                  !visibility["hdi"] && "hidden"
                )}
              >
                <button
                  onClick={() => toggleSort("hdi")}
                  className="inline-flex items-center gap-1 font-semibold hover:text-foreground"
                >
                  HDI <SortIcon col="hdi" />
                </button>
              </th>

              {/* Min Wage */}
              <th
                className={cn(
                  "hidden p-3 text-right align-middle xl:table-cell",
                  !visibility["minimumWageEur"] && "hidden"
                )}
              >
                <button
                  onClick={() => toggleSort("minimumWageEur")}
                  className="inline-flex items-center gap-1 font-semibold hover:text-foreground"
                >
                  Min Wage <SortIcon col="minimumWageEur" />
                </button>
              </th>

              {/* Cost of Living */}
              <th
                className={cn(
                  "hidden p-3 text-right align-middle xl:table-cell",
                  !visibility["costOfLivingIndex"] && "hidden"
                )}
              >
                <button
                  onClick={() => toggleSort("costOfLivingIndex")}
                  className="inline-flex items-center gap-1 font-semibold hover:text-foreground"
                >
                  Cost of Living <SortIcon col="costOfLivingIndex" />
                </button>
              </th>

              {/* Internet % */}
              <th
                className={cn(
                  "hidden p-3 text-right align-middle xl:table-cell",
                  !visibility["internetPenetration"] && "hidden"
                )}
              >
                <button
                  onClick={() => toggleSort("internetPenetration")}
                  className="inline-flex items-center gap-1 font-semibold hover:text-foreground"
                >
                  Internet % <SortIcon col="internetPenetration" />
                </button>
              </th>

              {/* Unemployment % */}
              <th
                className={cn(
                  "hidden p-3 text-right align-middle xl:table-cell",
                  !visibility["unemploymentRate"] && "hidden"
                )}
              >
                <button
                  onClick={() => toggleSort("unemploymentRate")}
                  className="inline-flex items-center gap-1 font-semibold hover:text-foreground"
                >
                  Unemploy. % <SortIcon col="unemploymentRate" />
                </button>
              </th>

              {/* Obesity % */}
              <th
                className={cn(
                  "hidden p-3 text-right align-middle xl:table-cell",
                  !visibility["obesityRate"] && "hidden"
                )}
              >
                <button
                  onClick={() => toggleSort("obesityRate")}
                  className="inline-flex items-center gap-1 font-semibold hover:text-foreground"
                >
                  Obesity % <SortIcon col="obesityRate" />
                </button>
              </th>

              {/* Smoking % */}
              <th
                className={cn(
                  "hidden p-3 text-right align-middle xl:table-cell",
                  !visibility["smokingRate"] && "hidden"
                )}
              >
                <button
                  onClick={() => toggleSort("smokingRate")}
                  className="inline-flex items-center gap-1 font-semibold hover:text-foreground"
                >
                  Smoking % <SortIcon col="smokingRate" />
                </button>
              </th>

              {/* English % */}
              <th
                className={cn(
                  "hidden p-3 text-right align-middle xl:table-cell",
                  !visibility["englishSpeakingPercent"] && "hidden"
                )}
              >
                <button
                  onClick={() => toggleSort("englishSpeakingPercent")}
                  className="inline-flex items-center gap-1 font-semibold hover:text-foreground"
                >
                  English % <SortIcon col="englishSpeakingPercent" />
                </button>
              </th>

              {/* Avg Height */}
              <th
                className={cn(
                  "hidden p-3 text-right align-middle xl:table-cell",
                  !visibility["femaleHeightCm"] && "hidden"
                )}
              >
                <button
                  onClick={() => toggleSort("femaleHeightCm")}
                  className="inline-flex items-center gap-1 font-semibold hover:text-foreground"
                >
                  Avg Height <SortIcon col="femaleHeightCm" />
                </button>
              </th>

              {/* Avg BMI */}
              <th
                className={cn(
                  "hidden p-3 text-right align-middle xl:table-cell",
                  !visibility["femaleBmi"] && "hidden"
                )}
              >
                <button
                  onClick={() => toggleSort("femaleBmi")}
                  className="inline-flex items-center gap-1 font-semibold hover:text-foreground"
                >
                  Avg BMI <SortIcon col="femaleBmi" />
                </button>
              </th>

              {/* Adolescent Birth Rate */}
              <th
                className={cn(
                  "hidden p-3 text-right align-middle xl:table-cell",
                  !visibility["adolescentBirthRate"] && "hidden"
                )}
              >
                <button
                  onClick={() => toggleSort("adolescentBirthRate")}
                  className="inline-flex items-center gap-1 font-semibold hover:text-foreground"
                >
                  Birth Rate (15-19) <SortIcon col="adolescentBirthRate" />
                </button>
              </th>

              {/* Child Marriage % */}
              <th
                className={cn(
                  "hidden p-3 text-right align-middle xl:table-cell",
                  !visibility["childMarriagePercent"] && "hidden"
                )}
              >
                <button
                  onClick={() => toggleSort("childMarriagePercent")}
                  className="inline-flex items-center gap-1 font-semibold hover:text-foreground"
                >
                  Child Marriage % <SortIcon col="childMarriagePercent" />
                </button>
              </th>

              {/* Labor Force Gap */}
              <th
                className={cn(
                  "hidden p-3 text-right align-middle xl:table-cell",
                  !visibility["laborForceGap"] && "hidden"
                )}
              >
                <button
                  onClick={() => toggleSort("laborForceGap")}
                  className="inline-flex items-center gap-1 font-semibold hover:text-foreground"
                >
                  LFP Gap <SortIcon col="laborForceGap" />
                </button>
              </th>

              {/* Contraceptive Use */}
              <th
                className={cn(
                  "hidden p-3 text-right align-middle xl:table-cell",
                  !visibility["contraceptiveUse"] && "hidden"
                )}
              >
                <button
                  onClick={() => toggleSort("contraceptiveUse")}
                  className="inline-flex items-center gap-1 font-semibold hover:text-foreground"
                >
                  Contraceptive % <SortIcon col="contraceptiveUse" />
                </button>
              </th>

              {/* Indicator columns */}
              {indicators.map((ind, i) => {
                const colId = `indicator_${i}`;
                return (
                  <th
                    key={ind.id}
                    className={cn(
                      "p-3 text-right align-middle",
                      !visibility[colId] && "hidden"
                    )}
                  >
                    <button
                      onClick={() => toggleSort(colId)}
                      className="inline-flex items-center gap-1 font-semibold hover:text-foreground"
                    >
                      {getIndicatorColumnLabel(ind)}
                      <SortIcon col={colId} />
                    </button>
                  </th>
                );
              })}
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
                  {/* # */}
                  <td
                    className={cn(
                      "p-3 text-muted-foreground tabular-nums align-middle",
                      !visibility["row"] && "hidden"
                    )}
                  >
                    {idx + 1}
                  </td>

                  {/* Country */}
                  <td
                    className={cn(
                      "p-3 align-middle",
                      !visibility["name"] && "hidden"
                    )}
                  >
                    <Link
                      to={`/country/${country.code}`}
                      className="inline-flex items-center gap-2 font-medium hover:text-primary hover:underline"
                    >
                      <span className="text-base">{country.flag}</span>
                      <span>{country.name}</span>
                    </Link>
                  </td>

                  {/* Region */}
                  <td
                    className={cn(
                      "hidden p-3 text-muted-foreground sm:table-cell align-middle",
                      !visibility["region"] && "hidden"
                    )}
                  >
                    {country.region}
                  </td>

                  {/* Population */}
                  <td
                    className={cn(
                      "hidden p-3 text-right tabular-nums text-muted-foreground md:table-cell align-middle",
                      !visibility["population"] && "hidden"
                    )}
                  >
                    {country.population
                      ? country.population >= 1_000_000
                        ? `${(country.population / 1_000_000).toFixed(1)}M`
                        : `${(country.population / 1_000).toFixed(0)}k`
                      : "—"}
                  </td>

                  {/* HDI */}
                  <td
                    className={cn(
                      "hidden p-3 text-right tabular-nums lg:table-cell align-middle",
                      !visibility["hdi"] && "hidden"
                    )}
                  >
                    {country.hdi != null ? country.hdi.toFixed(2) : "—"}
                  </td>

                  {/* Min Wage */}
                  <td
                    className={cn(
                      "hidden p-3 text-right tabular-nums xl:table-cell align-middle",
                      !visibility["minimumWageEur"] && "hidden"
                    )}
                  >
                    {country.minimumWageEur != null
                      ? `€${country.minimumWageEur.toLocaleString()}`
                      : "—"}
                  </td>

                  {/* Cost of Living */}
                  <td
                    className={cn(
                      "hidden p-3 text-right tabular-nums xl:table-cell align-middle",
                      !visibility["costOfLivingIndex"] && "hidden"
                    )}
                  >
                    {country.costOfLivingIndex != null ? country.costOfLivingIndex : "—"}
                  </td>

                  {/* Internet % */}
                  <td
                    className={cn(
                      "hidden p-3 text-right tabular-nums xl:table-cell align-middle",
                      !visibility["internetPenetration"] && "hidden"
                    )}
                  >
                    {country.internetPenetration != null
                      ? `${country.internetPenetration}%`
                      : "—"}
                  </td>

                  {/* Unemployment % */}
                  <td
                    className={cn(
                      "hidden p-3 text-right tabular-nums xl:table-cell align-middle",
                      !visibility["unemploymentRate"] && "hidden"
                    )}
                  >
                    {country.unemploymentRate != null
                      ? `${country.unemploymentRate}%`
                      : "—"}
                  </td>

                  {/* Obesity % */}
                  <td
                    className={cn(
                      "hidden p-3 text-right tabular-nums xl:table-cell align-middle",
                      !visibility["obesityRate"] && "hidden"
                    )}
                  >
                    {country.obesityRate != null ? `${country.obesityRate}%` : "—"}
                  </td>

                  {/* Smoking % */}
                  <td
                    className={cn(
                      "hidden p-3 text-right tabular-nums xl:table-cell align-middle",
                      !visibility["smokingRate"] && "hidden"
                    )}
                  >
                    {country.smokingRate != null ? `${country.smokingRate}%` : "—"}
                  </td>

                  {/* English % */}
                  <td
                    className={cn(
                      "hidden p-3 text-right tabular-nums xl:table-cell align-middle",
                      !visibility["englishSpeakingPercent"] && "hidden"
                    )}
                  >
                    {country.englishSpeakingPercent != null
                      ? `${country.englishSpeakingPercent}%`
                      : "—"}
                  </td>

                  {/* Avg Height */}
                  <td
                    className={cn(
                      "hidden p-3 text-right tabular-nums xl:table-cell align-middle",
                      !visibility["femaleHeightCm"] && "hidden"
                    )}
                  >
                    {country.femaleHeightCm != null ? `${country.femaleHeightCm}cm` : "—"}
                  </td>

                  {/* Avg BMI */}
                  <td
                    className={cn(
                      "hidden p-3 text-right tabular-nums xl:table-cell align-middle",
                      !visibility["femaleBmi"] && "hidden"
                    )}
                  >
                    {country.femaleBmi != null ? country.femaleBmi : "—"}
                  </td>

                  {/* Adolescent Birth Rate */}
                  <td
                    className={cn(
                      "hidden p-3 text-right tabular-nums xl:table-cell align-middle",
                      !visibility["adolescentBirthRate"] && "hidden"
                    )}
                  >
                    {country.gender.adolescentBirthRate != null
                      ? `${country.gender.adolescentBirthRate}`
                      : "—"}
                  </td>

                  {/* Child Marriage % */}
                  <td
                    className={cn(
                      "hidden p-3 text-right tabular-nums xl:table-cell align-middle",
                      !visibility["childMarriagePercent"] && "hidden"
                    )}
                  >
                    {country.gender.childMarriagePercent != null
                      ? `${country.gender.childMarriagePercent}%`
                      : "—"}
                  </td>

                  {/* Labor Force Gap */}
                  <td
                    className={cn(
                      "hidden p-3 text-right tabular-nums xl:table-cell align-middle",
                      !visibility["laborForceGap"] && "hidden"
                    )}
                  >
                    {country.gender.laborForceGap != null
                      ? `${country.gender.laborForceGap}%`
                      : "—"}
                  </td>

                  {/* Contraceptive Use */}
                  <td
                    className={cn(
                      "hidden p-3 text-right tabular-nums xl:table-cell align-middle",
                      !visibility["contraceptiveUse"] && "hidden"
                    )}
                  >
                    {country.gender.contraceptiveUse != null
                      ? `${country.gender.contraceptiveUse}%`
                      : "—"}
                  </td>

                  {/* Indicator cells */}
                  {indicators.map((ind, i) => {
                    const colId = `indicator_${i}`;
                    const val = getIndicatorValue(country, ind);
                    return (
                      <td
                        key={ind.id}
                        className={cn(
                          "p-3 text-right font-medium tabular-nums align-middle",
                          !visibility[colId] && "hidden"
                        )}
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
    </div>
  );
}
