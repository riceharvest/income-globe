import { uniqueCountriesData, type CountryData } from "~/data/countries";
import { Card, CardContent } from "~/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

type StatCard = {
  label: string;
  value: string;
  country: string;
  flag: string;
  subtitle: string;
};

function computeStat(
  label: string,
  subtitle: string,
  getValue: (c: CountryData) => number | undefined,
  format: (c: CountryData, v: number) => string,
  direction: "asc" | "desc" = "desc"
): StatCard | null {
  const withData = uniqueCountriesData.filter((c) => getValue(c) !== undefined);
  if (withData.length === 0) return null;
  const best = [...withData].sort((a, b) => {
    const va = getValue(a)!;
    const vb = getValue(b)!;
    return direction === "desc" ? vb - va : va - vb;
  })[0];
  return {
    label,
    value: format(best, getValue(best)!),
    country: best.name,
    flag: best.flag,
    subtitle,
  };
}

const STAT_CARDS: (StatCard | null)[] = [
  computeStat("Highest HDI", "Human Development Index", (c) => c.hdi, (c, v) => v.toFixed(2)),
  computeStat("Highest Min Wage", "Monthly in EUR", (c) => c.minimumWageEur, (_, v) => `€${v.toLocaleString()}`),
  computeStat("Most English", "% of population", (c) => c.englishSpeakingPercent, (_, v) => `${v}%`),
  computeStat("Most Obese", "Adult obesity rate", (c) => c.obesityRate, (_, v) => `${v}%`),
  computeStat("Best Internet", "Penetration rate", (c) => c.internetPenetration, (_, v) => `${v}%`),
  computeStat("Lowest Cost of Living", "Index (NYC = 100)", (c) => c.costOfLivingIndex, (_, v) => String(v)),
  computeStat("Highest Unemployment", "Labor force %", (c) => c.unemploymentRate, (_, v) => `${v}%`),
  computeStat("Most Smoking", "Adult smoking rate", (c) => c.smokingRate, (_, v) => `${v}%`),
];

const ACCENT_COLORS = [
  "border-emerald-500/30 bg-emerald-950/20",
  "border-blue-500/30 bg-blue-950/20",
  "border-purple-500/30 bg-purple-950/20",
  "border-amber-500/30 bg-amber-950/20",
  "border-cyan-500/30 bg-cyan-950/20",
  "border-pink-500/30 bg-pink-950/20",
  "border-orange-500/30 bg-orange-950/20",
  "border-teal-500/30 bg-teal-950/20",
];

export function StatsOverview() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {STAT_CARDS.map((card, i) => {
        if (!card) return null;
        const accentClass = ACCENT_COLORS[i % ACCENT_COLORS.length];
        return (
          <Card
            key={card.label}
            className={`border ${accentClass} py-3`}
          >
            <CardContent className="flex flex-col gap-1.5 px-4">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {card.label}
              </div>
              <div className="text-2xl font-bold tabular-nums">{card.value}</div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="text-base">{card.flag}</span>
                <span className="truncate">{card.country}</span>
                <span className="ml-auto shrink-0 text-muted-foreground/60">{card.subtitle}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}