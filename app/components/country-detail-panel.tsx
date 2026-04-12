import { useMemo } from "react";
import { X, Globe, TrendingUp, TrendingDown, Link2 } from "lucide-react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";
import {
  type CountryData,
  type IndicatorSelection,
  getIndicatorValue,
  adjustForTimePeriod,
  formatUsd,
} from "~/data/countries";

interface CountryDetailPanelProps {
  countryCode: string | null;
  onClose: () => void;
  countries: CountryData[];
  indicators: IndicatorSelection[];
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <div className="bg-secondary/40 rounded-lg p-4 space-y-3">{children}</div>
    </div>
  );
}

interface StatRowProps {
  label: string;
  value: string;
  barFill?: number; // 0-100
  barColor?: string;
  delta?: { value: string; positive: boolean };
}

function StatRow({ label, value, barFill, barColor = "bg-primary", delta }: StatRowProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="flex items-center gap-2">
          {delta && (
            <span
              className={cn(
                "flex items-center gap-0.5 text-xs font-medium",
                delta.positive ? "text-green-500" : "text-red-500"
              )}
            >
              {delta.positive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {delta.value}
            </span>
          )}
          <span className="text-sm font-medium tabular-nums">{value}</span>
        </div>
      </div>
      {barFill != null && (
        <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", barColor)}
            style={{ width: `${Math.min(100, Math.max(0, barFill))}%` }}
          />
        </div>
      )}
    </div>
  );
}

function getRegionAvg(
  countries: CountryData[],
  region: string,
  key: string
): number | null {
  const inRegion = countries.filter((c) => c.region === region && (c as any)[key] != null);
  if (!inRegion.length) return null;
  const vals = inRegion.map((c) => (c as any)[key]).filter((v) => v != null);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
}

function globalMinMax(countries: CountryData[], key: string): [number, number] {
  const vals = countries
    .map((c) => (c as any)[key])
    .filter((v) => v != null) as number[];
  return [Math.min(...vals), Math.max(...vals)];
}

function fmt(val: number): string {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}k`;
  return String(val);
}

export function CountryDetailPanel({
  countryCode,
  onClose,
  countries,
  indicators,
}: CountryDetailPanelProps) {
  const country = useMemo(
    () => countries.find((c) => c.code === countryCode) ?? null,
    [countries, countryCode]
  );

  const isOpen = countryCode !== null;

  if (!isOpen || !country) return null;

  const regionAvg = (key: string) => {
    const avg = getRegionAvg(countries, country.region, key);
    if (avg == null) return undefined;
    const val = (country as any)[key] as number;
    if (val == null) return undefined;
    const pct = ((val - avg) / avg) * 100;
    return {
      value: `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%`,
      positive: pct >= 0,
    };
  };

  // Global min/max for bar scaling
  const popRange = globalMinMax(countries, "population");
  const hdiRange = globalMinMax(countries, "hdi");
  const minWageRange = globalMinMax(countries, "minimumWageEur");

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 w-[480px] max-w-full bg-card border-l border-border z-50",
          "transform transition-transform duration-200 ease-out",
          "flex flex-col"
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border px-5 py-4 flex-shrink-0">
          <span className="text-3xl">{country.flag}</span>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-base truncate">{country.name}</h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {country.region}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1.5 rounded-md hover:bg-secondary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Overview */}
          <Section title="Overview">
            <StatRow
              label="Population"
              value={country.population ? fmt(country.population) : "—"}
              barFill={
                country.population
                  ? ((country.population - popRange[0]) / (popRange[1] - popRange[0])) * 100
                  : undefined
              }
            />
            <StatRow
              label="HDI"
              value={country.hdi != null ? country.hdi.toFixed(3) : "—"}
              barFill={
                country.hdi != null
                  ? ((country.hdi - hdiRange[0]) / (hdiRange[1] - hdiRange[0])) * 100
                  : undefined
              }
            />
            <StatRow
              label="Cost of Living Index"
              value={country.costOfLivingIndex?.toString() ?? "—"}
              delta={regionAvg("costOfLivingIndex")}
            />
          </Section>

          {/* Economic */}
          <Section title="Economic">
            <StatRow
              label="Minimum Wage"
              value={country.minimumWageEur != null ? `€${country.minimumWageEur.toLocaleString()}/mo` : "—"}
              barFill={
                country.minimumWageEur
                  ? ((country.minimumWageEur - minWageRange[0]) / (minWageRange[1] - minWageRange[0])) * 100
                  : undefined
              }
              delta={regionAvg("minimumWageEur")}
            />
            <StatRow
              label="Internet Penetration"
              value={country.internetPenetration != null ? `${country.internetPenetration}%` : "—"}
              barFill={country.internetPenetration ?? undefined}
              barColor="bg-blue-500"
              delta={regionAvg("internetPenetration")}
            />
            <StatRow
              label="Unemployment Rate"
              value={country.unemploymentRate != null ? `${country.unemploymentRate}%` : "—"}
              barFill={country.unemploymentRate ?? undefined}
              barColor="bg-orange-500"
              delta={regionAvg("unemploymentRate")}
            />
            <StatRow
              label="English Speaking"
              value={country.englishSpeakingPercent != null ? `${country.englishSpeakingPercent}%` : "—"}
              barFill={country.englishSpeakingPercent ?? undefined}
              barColor="bg-teal-500"
              delta={regionAvg("englishSpeakingPercent")}
            />
          </Section>

          {/* Health */}
          <Section title="Health">
            <StatRow
              label="Obesity Rate"
              value={country.obesityRate != null ? `${country.obesityRate}%` : "—"}
              barFill={country.obesityRate ?? undefined}
              barColor="bg-red-500"
              delta={regionAvg("obesityRate")}
            />
            <StatRow
              label="Smoking Rate"
              value={country.smokingRate != null ? `${country.smokingRate}%` : "—"}
              barFill={country.smokingRate ?? undefined}
              barColor="bg-red-400"
              delta={regionAvg("smokingRate")}
            />
            <StatRow
              label="Female Avg Height"
              value={country.femaleHeightCm != null ? `${country.femaleHeightCm} cm` : "—"}
              delta={regionAvg("femaleHeightCm")}
            />
            <StatRow
              label="Female Avg BMI"
              value={country.femaleBmi?.toString() ?? "—"}
              delta={regionAvg("femaleBmi")}
            />
          </Section>

          {/* Gender */}
          <Section title="Gender">
            <StatRow
              label="Adolescent Birth Rate"
              value={String(country.gender.adolescentBirthRate ?? "—")}
              barFill={country.gender.adolescentBirthRate ?? undefined}
              barColor="bg-purple-500"
              delta={regionAvg("adolescentBirthRate")}
            />
            <StatRow
              label="Child Marriage"
              value={country.gender.childMarriagePercent != null ? `${country.gender.childMarriagePercent}%` : "—"}
              barFill={country.gender.childMarriagePercent ?? undefined}
              barColor="bg-pink-500"
              delta={regionAvg("childMarriagePercent")}
            />
            <StatRow
              label="Labor Force Gap"
              value={country.gender.laborForceGap != null ? `${country.gender.laborForceGap}%` : "—"}
              barFill={country.gender.laborForceGap ?? undefined}
              barColor="bg-yellow-500"
              delta={regionAvg("laborForceGap")}
            />
            <StatRow
              label="Contraceptive Use"
              value={country.gender.contraceptiveUse != null ? `${country.gender.contraceptiveUse}%` : "—"}
              barFill={country.gender.contraceptiveUse ?? undefined}
              barColor="bg-green-500"
              delta={regionAvg("contraceptiveUse")}
            />
          </Section>

          {/* Income Indicators */}
          {indicators.length > 0 && (
            <Section title="Income Distribution">
              {indicators.map((ind) => {
                const val = getIndicatorValue(country, ind);
                const adj = adjustForTimePeriod(val, ind.timePeriod);
                const formatted = formatUsd(adj);
                const regionDelta = (() => {
                  // Show region comparison using p50 for now (simplified)
                  const avg = getRegionAvg(countries, country.region, "income.p50");
                  if (avg == null || country.income.p50 == null) return undefined;
                  const pct = ((country.income.p50 - avg) / avg) * 100;
                  return { value: `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%`, positive: pct >= 0 };
                })();
                return (
                  <StatRow
                    key={ind.id}
                    label={ind.indicator.replace(/_/g, " ")}
                    value={formatted}
                    barFill={
                      country.income.p50
                        ? (country.income.p50 / 120000) * 100
                        : undefined
                    }
                    barColor="from-cyan-500 to-pink-500"
                    delta={regionDelta}
                  />
                );
              })}
            </Section>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Link
              to={`/compare?countries=${country.code}`}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary hover:bg-secondary/80 text-sm font-medium py-2.5 transition-colors"
            >
              <Link2 className="h-4 w-4" />
              Compare
            </Link>
            <Link
              to={`/country/${country.code}`}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-2.5 transition-colors"
            >
              Full Profile
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
