import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { IncomeBar } from "~/components/income-bar";
import { formatUsd, type CountryData } from "~/data/countries";
import { getSkinColor } from "~/data/skin-color-map";
import { getBreastSize, cupSizeToLetter } from "~/data/breast-size-map";
import { getChildMarriage } from "~/data/child-marriage-map";
import { getAdolescentBirthRate } from "~/data/adolescent-birth-map";
import { getContraceptiveUse } from "~/data/contraceptive-map";
import { getLaborForceGap } from "~/data/labor-force-gap-map";
import { getEnglishSpeaking } from "~/data/english-speaking-map";
import { ChevronRight } from "lucide-react";

// Map von Luschan (1-36) to skin color hex
function getSkinColorHex(vls: number): string {
  // Non-linear curve for more dramatic difference
  const t = ((vls - 1) / 35) ** 0.7;
  // Real skin tones: very light (#ffdbac) to very dark (#2d1a0f)
  const r = Math.round(255 - t * 207);
  const g = Math.round(219 - t * 183);
  const b = Math.round(172 - t * 139);
  return `rgb(${r},${g},${b})`;
}
import { cn } from "~/lib/utils";

export type SortKey =
  | "name"
  | "region"
  | "population"
  | "minimumWageEur"
  | "costOfLivingIndex"
  | "internetPenetration"
  | "unemploymentRate"
  | "englishSpeakingPercent"
  | "obesityRate"
  | "smokingRate"
  | "femaleHeightCm"
  | "femaleBmi"
  | "adolescentBirthRate"
  | "childMarriagePercent"
  | "laborForceGap"
  | "contraceptiveUse"
  | "income";

interface CountryCardProps {
  country: CountryData;
  maxMedian?: number;
  sortKey?: SortKey;
  onSelect?: (code: string) => void;
}

// Labels and colors per sort key
const SORT_FIELD_META: Record<SortKey, { label: string; format: (c: CountryData) => string | null; barValue: (c: CountryData) => number; barMax: number; unit: string; color: string }> = {
  name: { label: "Name", format: (c) => c.name, barValue: () => 0, barMax: 1, unit: "", color: "text-foreground" },
  region: { label: "Region", format: (c) => c.region, barValue: () => 0, barMax: 1, unit: "", color: "text-muted-foreground" },
  income: { label: "Median Income", format: (c) => formatUsd(c.income.p50), barValue: (c) => c.income.p50, barMax: 9000, unit: "/mo", color: "text-foreground" },
  population: { label: "Population", format: (c) => c.population ? `${(c.population / 1_000_000).toFixed(1)}M` : null, barValue: (c) => c.population ?? 0, barMax: 1_400_000_000, unit: "", color: "text-foreground" },
  minimumWageEur: { label: "Min Wage", format: (c) => c.minimumWageEur ? `€${c.minimumWageEur.toLocaleString()}` : null, barValue: (c) => c.minimumWageEur ?? 0, barMax: 3000, unit: "/mo", color: "text-foreground" },
  costOfLivingIndex: { label: "Cost of Living", format: (c) => c.costOfLivingIndex ? String(c.costOfLivingIndex) : null, barValue: (c) => c.costOfLivingIndex ?? 0, barMax: 150, unit: "", color: "text-foreground" },
  internetPenetration: { label: "Internet", format: (c) => c.internetPenetration != null ? `${c.internetPenetration}%` : null, barValue: (c) => c.internetPenetration ?? 0, barMax: 100, unit: "%", color: "text-foreground" },
  unemploymentRate: { label: "Unemployment", format: (c) => c.unemploymentRate != null ? `${c.unemploymentRate}%` : null, barValue: (c) => c.unemploymentRate ?? 0, barMax: 30, unit: "%", color: "text-foreground" },
  englishSpeakingPercent: { label: "English", format: (c) => {
    const val = c.englishSpeakingPercent ?? getEnglishSpeaking(c.code);
    return val != null ? `${val}%` : null;
  }, barValue: (c) => c.englishSpeakingPercent ?? getEnglishSpeaking(c.code) ?? 0, barMax: 100, unit: "%", color: "text-foreground" },
  obesityRate: { label: "Obesity", format: (c) => c.obesityRate != null ? `${c.obesityRate}%` : null, barValue: (c) => c.obesityRate ?? 0, barMax: 60, unit: "%", color: "text-foreground" },
  smokingRate: { label: "Smoking", format: (c) => c.smokingRate != null ? `${c.smokingRate}%` : null, barValue: (c) => c.smokingRate ?? 0, barMax: 40, unit: "%", color: "text-foreground" },
  femaleHeightCm: { label: "Height (F)", format: (c) => c.femaleHeightCm ? `${c.femaleHeightCm}cm` : null, barValue: (c) => c.femaleHeightCm ?? 0, barMax: 170, unit: "cm", color: "text-foreground" },
  femaleBmi: { label: "BMI (F)", format: (c) => c.femaleBmi ? String(c.femaleBmi) : null, barValue: (c) => c.femaleBmi ?? 0, barMax: 35, unit: "", color: "text-foreground" },
  adolescentBirthRate: { label: "Adolescent Birth", format: (c) => {
    const val = c.gender.adolescentBirthRate ?? getAdolescentBirthRate(c.code);
    return val != null ? String(val) : null;
  }, barValue: (c) => c.gender.adolescentBirthRate ?? getAdolescentBirthRate(c.code) ?? 0, barMax: 200, unit: "", color: "text-foreground" },
  childMarriagePercent: { label: "Child Marriage", format: (c) => {
    const val = c.gender.childMarriagePercent ?? getChildMarriage(c.code);
    return val != null ? `${val}%` : null;
  }, barValue: (c) => c.gender.childMarriagePercent ?? getChildMarriage(c.code) ?? 0, barMax: 80, unit: "%", color: "text-foreground" },
  laborForceGap: { label: "Labor Gap", format: (c) => {
    const val = c.gender.laborForceGap ?? getLaborForceGap(c.code);
    return val != null ? `${val}%` : null;
  }, barValue: (c) => Math.abs(c.gender.laborForceGap ?? getLaborForceGap(c.code) ?? 0), barMax: 80, unit: "%", color: "text-foreground" },
  contraceptiveUse: { label: "Contraceptive", format: (c) => {
    const val = c.gender.contraceptiveUse ?? getContraceptiveUse(c.code);
    return val != null ? `${val}%` : null;
  }, barValue: (c) => c.gender.contraceptiveUse ?? getContraceptiveUse(c.code) ?? 0, barMax: 100, unit: "%", color: "text-foreground" },
};

function MiniBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min(1, value / max);
  const filled = Math.round(pct * 10);
  return (
    <span className="inline text-[4px] leading-none font-mono whitespace-pre">
      {"█".repeat(filled)}{"░".repeat(10 - filled)}
    </span>
  );
}

export function CountryCard({ country, maxMedian = 9000, sortKey = "income", onSelect }: CountryCardProps) {
  const meta = SORT_FIELD_META[sortKey] ?? SORT_FIELD_META.income;
  const formatted = meta.format(country);
  const barVal = meta.barValue(country);
  const barPct = Math.min(1, barVal / meta.barMax);
  const isIncome = sortKey === "income";

  return (
    <div
      onClick={() => onSelect?.(country.code)}
      className="group block cursor-pointer"
    >
      <Card className="overflow-hidden border-border/50 transition-all duration-200 hover:border-border hover:shadow-md">
        <CardContent className="p-4">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl" role="img" aria-label={`${country.name} flag`}>
                {country.flag}
              </span>
              <div>
                <h3 className="font-semibold leading-tight group-hover:text-primary transition-colors">
                  {country.name}
                </h3>
                <p className="text-xs text-muted-foreground">{country.region}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <p className={cn("text-lg font-bold tabular-nums", meta.color)}>
                {formatted ?? "—"}
              </p>
              {meta.unit && (
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {meta.unit}
                </p>
              )}
            </div>
          </div>

          {/* Bar — income has its own IncomeBar component, others use mini bar */}
          {isIncome ? (
            <IncomeBar income={country.income} maxValue={maxMedian * 2.5} />
          ) : (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MiniBar value={barVal} max={meta.barMax} />
              <span className="text-[10px] uppercase tracking-wide">{meta.label}</span>
            </div>
          )}

          <div className="mt-2 flex items-center gap-1.5">
            <Badge variant="secondary" className="text-[10px] font-normal">
              {country.dataSource}
            </Badge>
            <Badge variant="secondary" className="text-[10px] font-normal">
              {country.dataYear}
            </Badge>
            {(() => {
              const skin = getSkinColor(country.code);
              if (!skin) return null;
              const avg = Math.round((skin.min + skin.max) / 2);
              return (
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-sm border border-black/50 text-[10px] font-mono font-bold"
                  style={{ backgroundColor: getSkinColorHex(avg), color: avg > 18 ? '#fff' : '#000', textShadow: '0 0 2px rgba(0,0,0,0.5)' }}
                  title={`Skin: ${skin.min}-${skin.max} (von Luschan)`}
                >
                  {avg}
                </div>
              );
            })()}
            {(() => {
              const cup = getBreastSize(country.code);
              if (!cup) return null;
              return (
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-sm border border-black/50 text-[10px] font-bold bg-pink-500 text-white"
                  title={`Breast size: ${cupSizeToLetter(cup)}`}
                >
                  {cupSizeToLetter(cup)}
                </div>
              );
            })()}
            {country.population && (
              <Badge variant="outline" className="text-[10px] font-normal">
                {country.population >= 1_000_000 
                  ? `${(country.population / 1_000_000).toFixed(1)}M` 
                  : `${(country.population / 1_000).toFixed(0)}K`}
              </Badge>
            )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
