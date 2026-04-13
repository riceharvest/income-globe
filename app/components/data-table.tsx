import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router";
import {
  type CountryData,
  type IndicatorSelection,
  getIndicatorValue,
  adjustForTimePeriod,
  formatUsd,
} from "~/data/countries";
import { getFemaleObesity } from "~/data/female-obesity-map";
import { getHiv } from "~/data/hiv-map";
import { getOutOfWedlock } from "~/data/outofwedlock-map";
import { getReligion } from "~/data/religion-map";
import { getEducation } from "~/data/education-map";
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
}

// Static columns — visible unless user explicitly hid them
const STATIC_COLUMNS: ColumnDef[] = [
  { id: "row", label: "#" },
  { id: "name", label: "Country" },
  { id: "region", label: "Region" },
  { id: "population", label: "Population" },
  { id: "hdi", label: "HDI" },
  { id: "minimumWageEur", label: "Min Wage" },
  { id: "costOfLivingIndex", label: "Cost of Living" },
  { id: "internetPenetration", label: "Internet %" },
  { id: "unemploymentRate", label: "Unemploy. %" },
  { id: "obesityRate", label: "Obesity %" },
  { id: "smokingRate", label: "Smoking %" },
  { id: "englishSpeakingPercent", label: "English %" },
  { id: "femaleHeightCm", label: "Avg Height (F)" },
  { id: "femaleBmi", label: "Avg BMI (F)" },
  { id: "femaleObesity", label: "Fem. Obesity %" },
  { id: "hiv", label: "HIV %" },
  { id: "adolescentBirthRate", label: "Adolescent Birth" },
  { id: "childMarriagePercent", label: "Child Marriage %" },
  { id: "outOfWedlock", label: "Out Wedlock %" },
  { id: "laborForceGap", label: "Labor Gap %" },
  { id: "contraceptiveUse", label: "Contraceptive %" },
  { id: "religion", label: "Religion" },
  { id: "education", label: "Education %" },
];

// Indicator columns — hidden unless user explicitly enabled them
function makeIndicatorColId(i: number) { return `ind_${i}`; }

const STORAGE_KEY = "income-globe-col-vis-v5";

function loadPersisted(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { const v = JSON.parse(raw); if (v && typeof v === "object" && !Array.isArray(v)) return v as Record<string, boolean>; }
  } catch { /* ok */ }
  return {};
}

function persist(vis: Record<string, boolean>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(vis)); } catch { /* ok */ }
}

export function DataTable({
  countries,
  indicators,
  highlightedCodes,
  loading = false,
}: DataTableProps) {
  // visibleCols: map of colId → true (visible) or false (hidden)
  // Only explicitly toggled columns are stored; everything else derives from type
  const [visibleCols, setVisibleCols] = useState<Record<string, boolean>>(() => loadPersisted());
  const [sortCol, setSortCol] = useState<string>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Helper: is a column visible? Checks explicit user toggle first, then defaults by type.
  function colVisible(colId: string, isStatic: boolean): boolean {
    if (colId in visibleCols) return visibleCols[colId];
    return isStatic; // static=on, indicator=off by default
  }

  function toggleCol(colId: string) {
    setVisibleCols((prev) => {
      const next = { ...prev, [colId]: !prev[colId] };
      persist(next);
      return next;
    });
  }

  // Close menu on outside click
  useEffect(() => {
    if (!showMenu) return;
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  const sorted = useMemo(() => {
    if (!sortDir) return countries;
    return [...countries].sort((a, b) => {
      let cmp = 0;
      if (sortCol === "name") cmp = a.name.localeCompare(b.name);
      else if (sortCol === "region") cmp = a.region.localeCompare(b.region);
      else if (sortCol === "population") cmp = (a.population ?? -1) - (b.population ?? -1);
      else if (sortCol === "hdi") cmp = (a.hdi ?? -1) - (b.hdi ?? -1);
      else if (sortCol === "minimumWageEur") cmp = (a.minimumWageEur ?? -1) - (b.minimumWageEur ?? -1);
      else if (sortCol === "costOfLivingIndex") cmp = (a.costOfLivingIndex ?? -1) - (b.costOfLivingIndex ?? -1);
      else if (sortCol === "internetPenetration") cmp = (a.internetPenetration ?? -1) - (b.internetPenetration ?? -1);
      else if (sortCol === "unemploymentRate") cmp = (a.unemploymentRate ?? -1) - (b.unemploymentRate ?? -1);
      else if (sortCol === "obesityRate") cmp = (a.obesityRate ?? -1) - (b.obesityRate ?? -1);
      else if (sortCol === "smokingRate") cmp = (a.smokingRate ?? -1) - (b.smokingRate ?? -1);
      else if (sortCol === "englishSpeakingPercent") cmp = (a.englishSpeakingPercent ?? -1) - (b.englishSpeakingPercent ?? -1);
      else if (sortCol === "femaleHeightCm") cmp = (a.femaleHeightCm ?? -1) - (b.femaleHeightCm ?? -1);
      else if (sortCol === "femaleBmi") cmp = (a.femaleBmi ?? -1) - (b.femaleBmi ?? -1);
      else if (sortCol === "adolescentBirthRate") cmp = (a.gender.adolescentBirthRate ?? -1) - (b.gender.adolescentBirthRate ?? -1);
      else if (sortCol === "childMarriagePercent") cmp = (a.gender.childMarriagePercent ?? -1) - (b.gender.childMarriagePercent ?? -1);
      else if (sortCol === "laborForceGap") cmp = (a.gender.laborForceGap ?? -1) - (b.gender.laborForceGap ?? -1);
      else if (sortCol === "contraceptiveUse") cmp = (a.gender.contraceptiveUse ?? -1) - (b.gender.contraceptiveUse ?? -1);
      else if (sortCol === "femaleObesity") cmp = (getFemaleObesity(a.code) ?? -1) - (getFemaleObesity(b.code) ?? -1);
      else if (sortCol === "hiv") cmp = (getHiv(a.code) ?? -1) - (getHiv(b.code) ?? -1);
      else if (sortCol === "outOfWedlock") cmp = (getOutOfWedlock(a.code) ?? -1) - (getOutOfWedlock(b.code) ?? -1);
      else if (sortCol === "religion") cmp = (getReligion(a.code)?.pct ?? -1) - (getReligion(b.code)?.pct ?? -1);
      else if (sortCol === "education") cmp = (getEducation(a.code) ?? -1) - (getEducation(b.code) ?? -1);
      else if (sortCol.startsWith("ind_")) {
        const idx = parseInt(sortCol.split("_")[1]);
        const ind = indicators[idx];
        if (ind) cmp = getIndicatorValue(a, ind) - getIndicatorValue(b, ind);
      }
      return sortDir === "desc" ? -cmp : cmp;
    });
  }, [countries, sortCol, sortDir, indicators]);

  function SortIcon({ col }: { col: string }) {
    if (sortCol !== col) return <ArrowUpDown className="h-3 w-3 text-muted-foreground/50" />;
    return sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  }

  function formatValue(val: number, ind: IndicatorSelection): string {
    const adj = adjustForTimePeriod(val, ind.timePeriod);
    if (ind.indicator === "wealth") {
      if (adj >= 1_000_000) return `$${(adj / 1_000_000).toFixed(1)}M`;
      if (adj >= 1_000) return `$${(adj / 1_000).toFixed(0)}k`;
      return `$${adj}`;
    }
    return formatUsd(adj);
  }

  function getIndLabel(ind: IndicatorSelection): string {
    const parts: string[] = [];
    if (ind.percentileGroup === "threshold" && ind.threshold) parts.push(`P${ind.threshold}`);
    else if (ind.percentileGroup === "custom" && ind.customRange) parts.push(`P${ind.customRange[0]}-${ind.customRange[1]}`);
    else if (ind.percentileGroup === "bottom50") parts.push("Bottom 50%");
    else if (ind.percentileGroup === "middle40") parts.push("Middle 40%");
    else if (ind.percentileGroup === "top10") parts.push("Top 10%");
    else if (ind.percentileGroup === "top1") parts.push("Top 1%");
    const short: Record<string, string> = { pretax_national: "Pre-tax", posttax_national: "Post-tax", consumption: "Consumption", wealth: "Wealth", labor_income: "Wages" };
    parts.push(short[ind.indicator] || ind.indicator);
    return parts.join(" · ");
  }

  // Build menu column list
  const menuCols = [
    ...STATIC_COLUMNS.map((c) => ({ id: c.id, label: c.label })),
    ...indicators.map((_, i) => ({ id: makeIndicatorColId(i), label: getIndLabel(indicators[i]) })),
  ];

  function toggleSort(col: string) {
    if (sortCol === col) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir(col === "name" ? "asc" : "desc"); }
  }

  if (loading) {
    return <div className="space-y-2">{Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}</div>;
  }

  return (
    <div className="space-y-2">
      {/* Header toolbar */}
      <div className="flex items-center justify-end">
        <div className="relative" ref={menuRef}>
          <Button variant="outline" size="sm" onClick={() => setShowMenu((v) => !v)} className="gap-1.5">
            <Columns3 className="h-3.5 w-3.5" /> Columns
          </Button>
          {showMenu && (
            <div className="absolute right-0 top-full z-50 mt-1.5 min-w-[12rem] rounded-lg border border-border bg-popover p-2 text-sm shadow-md ring-1 ring-foreground/10">
              <div className="mb-1.5 px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Toggle Columns</div>
              <div className="flex flex-col gap-0.5">
                {menuCols.map((col) => (
                  <label key={col.id} className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 hover:bg-muted">
                    <input type="checkbox" checked={colVisible(col.id, STATIC_COLUMNS.some((c) => c.id === col.id))} onChange={() => toggleCol(col.id)} className="accent-primary" />
                    <span className="text-sm">{col.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-max text-sm">
          <thead className="sticky top-0 z-10 bg-card">
            <tr className="border-b border-border">
              <th className={cn("w-10 min-w-10 p-2 text-left align-middle text-xs font-semibold", !colVisible("row", true) && "hidden")}>#</th>
              <th className="min-w-[120px] max-w-[200px] p-2 text-left align-middle text-xs font-semibold sticky left-0 bg-card z-10">
                <button onClick={() => toggleSort("name")} className="inline-flex items-center gap-1 font-semibold hover:text-foreground truncate w-full">Country <SortIcon col="name" /></button>
              </th>
              <th className={cn("hidden p-2 text-left align-middle text-xs", !colVisible("region", true) && "hidden")}>
                <button onClick={() => toggleSort("region")} className="inline-flex items-center gap-1 font-semibold hover:text-foreground">Region <SortIcon col="region" /></button>
              </th>
              <th className="p-2 text-right align-middle text-xs">
                <button onClick={() => toggleSort("population")} className="inline-flex items-center gap-1 font-semibold hover:text-foreground">Population <SortIcon col="population" /></button>
              </th>
              <th className={cn("hidden p-2 text-right align-middle text-xs", !colVisible("hdi", true) && "hidden")}>
                <button onClick={() => toggleSort("hdi")} className="inline-flex items-center gap-1 font-semibold hover:text-foreground">HDI <SortIcon col="hdi" /></button>
              </th>
              <th className={cn("hidden p-2 text-right align-middle text-xs", !colVisible("minimumWageEur", true) && "hidden")}>
                <button onClick={() => toggleSort("minimumWageEur")} className="inline-flex items-center gap-1 font-semibold hover:text-foreground">Min Wage <SortIcon col="minimumWageEur" /></button>
              </th>
              <th className={cn("hidden p-2 text-right align-middle text-xs", !colVisible("costOfLivingIndex", true) && "hidden")}>
                <button onClick={() => toggleSort("costOfLivingIndex")} className="inline-flex items-center gap-1 font-semibold hover:text-foreground">Cost of Living <SortIcon col="costOfLivingIndex" /></button>
              </th>
              <th className={cn("hidden p-2 text-right align-middle text-xs", !colVisible("internetPenetration", true) && "hidden")}>
                <button onClick={() => toggleSort("internetPenetration")} className="inline-flex items-center gap-1 font-semibold hover:text-foreground">Internet % <SortIcon col="internetPenetration" /></button>
              </th>
              <th className={cn("hidden p-2 text-right align-middle text-xs", !colVisible("unemploymentRate", true) && "hidden")}>
                <button onClick={() => toggleSort("unemploymentRate")} className="inline-flex items-center gap-1 font-semibold hover:text-foreground">Unemploy. % <SortIcon col="unemploymentRate" /></button>
              </th>
              <th className={cn("hidden p-2 text-right align-middle text-xs", !colVisible("obesityRate", true) && "hidden")}>
                <button onClick={() => toggleSort("obesityRate")} className="inline-flex items-center gap-1 font-semibold hover:text-foreground">Obesity % <SortIcon col="obesityRate" /></button>
              </th>
              <th className={cn("hidden p-2 text-right align-middle text-xs", !colVisible("smokingRate", true) && "hidden")}>
                <button onClick={() => toggleSort("smokingRate")} className="inline-flex items-center gap-1 font-semibold hover:text-foreground">Smoking % <SortIcon col="smokingRate" /></button>
              </th>
              <th className={cn("hidden p-2 text-right align-middle text-xs", !colVisible("englishSpeakingPercent", true) && "hidden")}>
                <button onClick={() => toggleSort("englishSpeakingPercent")} className="inline-flex items-center gap-1 font-semibold hover:text-foreground">English % <SortIcon col="englishSpeakingPercent" /></button>
              </th>
              <th className={cn("hidden p-2 text-right align-middle text-xs", !colVisible("femaleHeightCm", true) && "hidden")}>
                <button onClick={() => toggleSort("femaleHeightCm")} className="inline-flex items-center gap-1 font-semibold hover:text-foreground">Avg Height <SortIcon col="femaleHeightCm" /></button>
              </th>
              <th className={cn("hidden p-2 text-right align-middle text-xs", !colVisible("femaleBmi", true) && "hidden")}>
                <button onClick={() => toggleSort("femaleBmi")} className="inline-flex items-center gap-1 font-semibold hover:text-foreground">Avg BMI <SortIcon col="femaleBmi" /></button>
              </th>
              <th className={cn("hidden p-2 text-right align-middle text-xs", !colVisible("adolescentBirthRate", true) && "hidden")}>
                <button onClick={() => toggleSort("adolescentBirthRate")} className="inline-flex items-center gap-1 font-semibold hover:text-foreground">Birth Rate (15-19) <SortIcon col="adolescentBirthRate" /></button>
              </th>
              <th className={cn("hidden p-2 text-right align-middle text-xs", !colVisible("childMarriagePercent", true) && "hidden")}>
                <button onClick={() => toggleSort("childMarriagePercent")} className="inline-flex items-center gap-1 font-semibold hover:text-foreground">Child Marriage % <SortIcon col="childMarriagePercent" /></button>
              </th>
              <th className={cn("hidden p-2 text-right align-middle text-xs", !colVisible("laborForceGap", true) && "hidden")}>
                <button onClick={() => toggleSort("laborForceGap")} className="inline-flex items-center gap-1 font-semibold hover:text-foreground">LFP Gap <SortIcon col="laborForceGap" /></button>
              </th>
              <th className={cn("hidden p-2 text-right align-middle text-xs", !colVisible("contraceptiveUse", true) && "hidden")}>
                <button onClick={() => toggleSort("contraceptiveUse")} className="inline-flex items-center gap-1 font-semibold hover:text-foreground">Contraceptive % <SortIcon col="contraceptiveUse" /></button>
              </th>
              <th className={cn("hidden p-2 text-right align-middle text-xs", !colVisible("femaleObesity", true) && "hidden")}>
                <button onClick={() => toggleSort("femaleObesity")} className="inline-flex items-center gap-1 font-semibold hover:text-foreground">Fem. Obesity % <SortIcon col="femaleObesity" /></button>
              </th>
              <th className={cn("hidden p-2 text-right align-middle text-xs", !colVisible("hiv", true) && "hidden")}>
                <button onClick={() => toggleSort("hiv")} className="inline-flex items-center gap-1 font-semibold hover:text-foreground">HIV % <SortIcon col="hiv" /></button>
              </th>
              <th className={cn("hidden p-2 text-right align-middle text-xs", !colVisible("outOfWedlock", true) && "hidden")}>
                <button onClick={() => toggleSort("outOfWedlock")} className="inline-flex items-center gap-1 font-semibold hover:text-foreground">Out Wedlock % <SortIcon col="outOfWedlock" /></button>
              </th>
              <th className={cn("hidden p-2 text-right align-middle text-xs", !colVisible("religion", true) && "hidden")}>
                <button onClick={() => toggleSort("religion")} className="inline-flex items-center gap-1 font-semibold hover:text-foreground">Religion <SortIcon col="religion" /></button>
              </th>
              <th className={cn("hidden p-2 text-right align-middle text-xs", !colVisible("education", true) && "hidden")}>
                <button onClick={() => toggleSort("education")} className="inline-flex items-center gap-1 font-semibold hover:text-foreground">Education % <SortIcon col="education" /></button>
              </th>
              {indicators.map((ind, i) => {
                const colId = makeIndicatorColId(i);
                return (
                  <th key={ind.id} className={cn("p-2 text-right align-middle text-xs font-medium whitespace-nowrap", !colVisible(colId, false) && "hidden")} style={{ minWidth: "140px" }}>
                    <button onClick={() => toggleSort(colId)} className="inline-flex items-center gap-1 font-semibold hover:text-foreground">{getIndLabel(ind)} <SortIcon col={colId} /></button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map((country, idx) => {
              const highlighted = highlightedCodes?.has(country.code);
              return (
                <tr key={country.code} className={`border-b border-border/50 transition-colors hover:bg-secondary/50 ${highlighted ? "bg-primary/5" : idx % 2 === 1 ? "bg-muted/20" : ""}`}>
                  <td className={cn("p-2 text-muted-foreground tabular-nums align-middle text-xs", !colVisible("row", true) && "hidden")}>{idx + 1}</td>
                  <td className="p-2 align-middle text-xs sticky left-0 bg-card min-w-[120px] max-w-[200px]">
                    <Link to={`/country/${country.code}`} className="inline-flex items-center gap-1 font-medium hover:text-primary hover:underline truncate">
                      <span>{country.flag}</span>
                      <span className="truncate">{country.name}</span>
                    </Link>
                  </td>
                  <td className={cn("hidden p-2 text-muted-foreground align-middle text-xs", !colVisible("region", true) && "hidden")}>{country.region}</td>
                  <td className="p-2 text-muted-foreground text-right tabular-nums align-middle text-xs">
                    {country.population ? country.population >= 1_000_000 ? `${(country.population / 1_000_000).toFixed(1)}M` : `${(country.population / 1_000).toFixed(0)}k` : "—"}
                  </td>
                  <td className={cn("hidden p-2 text-muted-foreground text-right tabular-nums align-middle text-xs", !colVisible("hdi", true) && "hidden")}>{country.hdi != null ? country.hdi.toFixed(2) : "—"}</td>
                  <td className={cn("hidden p-2 text-muted-foreground text-right tabular-nums align-middle text-xs", !colVisible("minimumWageEur", true) && "hidden")}>
                    {country.minimumWageEur != null ? `€${country.minimumWageEur.toLocaleString()}` : "—"}
                  </td>
                  <td className={cn("hidden p-2 text-muted-foreground text-right tabular-nums align-middle text-xs", !colVisible("costOfLivingIndex", true) && "hidden")}>{country.costOfLivingIndex ?? "—"}</td>
                  <td className={cn("hidden p-2 text-muted-foreground text-right tabular-nums align-middle text-xs", !colVisible("internetPenetration", true) && "hidden")}>
                    {country.internetPenetration != null ? `${country.internetPenetration}%` : "—"}
                  </td>
                  <td className={cn("hidden p-2 text-muted-foreground text-right tabular-nums align-middle text-xs", !colVisible("unemploymentRate", true) && "hidden")}>
                    {country.unemploymentRate != null ? `${country.unemploymentRate}%` : "—"}
                  </td>
                  <td className={cn("hidden p-2 text-muted-foreground text-right tabular-nums align-middle text-xs", !colVisible("obesityRate", true) && "hidden")}>{country.obesityRate != null ? `${country.obesityRate}%` : "—"}</td>
                  <td className={cn("hidden p-2 text-muted-foreground text-right tabular-nums align-middle text-xs", !colVisible("smokingRate", true) && "hidden")}>{country.smokingRate != null ? `${country.smokingRate}%` : "—"}</td>
                  <td className={cn("hidden p-2 text-muted-foreground text-right tabular-nums align-middle text-xs", !colVisible("englishSpeakingPercent", true) && "hidden")}>
                    {country.englishSpeakingPercent != null ? `${country.englishSpeakingPercent}%` : "—"}
                  </td>
                  <td className={cn("hidden p-2 text-muted-foreground text-right tabular-nums align-middle text-xs", !colVisible("femaleHeightCm", true) && "hidden")}>{country.femaleHeightCm != null ? `${country.femaleHeightCm}cm` : "—"}</td>
                  <td className={cn("hidden p-2 text-muted-foreground text-right tabular-nums align-middle text-xs", !colVisible("femaleBmi", true) && "hidden")}>{country.femaleBmi ?? "—"}</td>
                  <td className={cn("hidden p-2 text-muted-foreground text-right tabular-nums align-middle text-xs", !colVisible("adolescentBirthRate", true) && "hidden")}>
                    {country.gender.adolescentBirthRate ?? "—"}
                  </td>
                  <td className={cn("hidden p-2 text-muted-foreground text-right tabular-nums align-middle text-xs", !colVisible("childMarriagePercent", true) && "hidden")}>
                    {country.gender.childMarriagePercent != null ? `${country.gender.childMarriagePercent}%` : "—"}
                  </td>
                  <td className={cn("hidden p-2 text-muted-foreground text-right tabular-nums align-middle text-xs", !colVisible("laborForceGap", true) && "hidden")}>
                    {country.gender.laborForceGap != null ? `${country.gender.laborForceGap}%` : "—"}
                  </td>
                  <td className={cn("hidden p-2 text-muted-foreground text-right tabular-nums align-middle text-xs", !colVisible("contraceptiveUse", true) && "hidden")}>
                    {country.gender.contraceptiveUse != null ? `${country.gender.contraceptiveUse}%` : "—"}
                  </td>
                  <td className={cn("hidden p-2 text-muted-foreground text-right tabular-nums align-middle text-xs", !colVisible("femaleObesity", true) && "hidden")}>
                    {getFemaleObesity(country.code) != null ? `${getFemaleObesity(country.code)}%` : "—"}
                  </td>
                  <td className={cn("hidden p-2 text-muted-foreground text-right tabular-nums align-middle text-xs", !colVisible("hiv", true) && "hidden")}>
                    {getHiv(country.code) != null ? `${getHiv(country.code)}%` : "—"}
                  </td>
                  <td className={cn("hidden p-2 text-muted-foreground text-right tabular-nums align-middle text-xs", !colVisible("outOfWedlock", true) && "hidden")}>
                    {getOutOfWedlock(country.code) != null ? `${getOutOfWedlock(country.code)}%` : "—"}
                  </td>
                  <td className={cn("hidden p-2 text-muted-foreground text-right tabular-nums align-middle text-xs", !colVisible("religion", true) && "hidden")}>
                    {(() => { const r = getReligion(country.code); return r ? `${r.main} ${r.pct}%` : "—"; })()}
                  </td>
                  <td className={cn("hidden p-2 text-muted-foreground text-right tabular-nums align-middle text-xs", !colVisible("education", true) && "hidden")}>
                    {getEducation(country.code) != null ? `${getEducation(country.code)}%` : "—"}
                  </td>
                  {indicators.map((ind, i) => {
                    const colId = makeIndicatorColId(i);
                    return (
                      <td key={ind.id} className={cn("p-2 text-right font-medium tabular-nums align-middle text-xs whitespace-nowrap", !colVisible(colId, false) && "hidden")} style={{ minWidth: "140px" }}>
                        {formatValue(getIndicatorValue(country, ind), ind)}
                        <span className="ml-1 text-xs text-muted-foreground">/{ind.timePeriod === "annual" ? "yr" : "mo"}</span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        {sorted.length === 0 && <div className="p-8 text-center text-muted-foreground">No countries match your filters</div>}
      </div>
    </div>
  );
}