import React from "react";
import { Award, Globe, Users, ArrowUpDown } from "lucide-react";
import { type CountryData, getPhysicalStats, getCountryRank, getSortValue } from "~/data/countries";
import { cn } from "~/lib/utils";

interface CountryTableProps {
  countries: CountryData[];
  sortKey: string;
  onSortChange: (key: string) => void;
  selectedCountryCode: string | null;
  onSelectCountry: (code: string) => void;
}

export function CountryTable({
  countries,
  sortKey,
  onSortChange,
  selectedCountryCode,
  onSelectCountry,
}: CountryTableProps) {
  const columns: Array<{ key: string; label: string; align?: "left" | "right" | "center" }> = [
    { key: "name", label: "Country", align: "left" },
    { key: "region", label: "Region", align: "left" },
    { key: "income", label: "P50 Income (€)", align: "right" },
    { key: "bmi", label: "BMI", align: "right" },
    { key: "femaleHeightCm", label: "Height F (cm)", align: "right" },
    { key: "maleHeightCm", label: "Height M (cm)", align: "right" },
    { key: "obesityRate", label: "Obesity %", align: "right" },
    { key: "minimumWageEur", label: "Min Wage (€)", align: "right" },
    { key: "hdi", label: "HDI", align: "right" },
    { key: "population", label: "Population", align: "right" },
  ];

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-secondary/60 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold border-b border-border/50 sticky top-0 backdrop-blur-md z-10 select-none">
          <tr>
            <th className="py-3 px-4 w-12 text-center">#</th>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => onSortChange(col.key)}
                className={cn(
                  "py-3 px-4 cursor-pointer hover:text-foreground transition-colors",
                  col.align === "right" && "text-right",
                  col.align === "center" && "text-center",
                  sortKey === col.key && "text-emerald-400 font-bold"
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-1.5",
                    col.align === "right" && "justify-end",
                    col.align === "center" && "justify-center"
                  )}
                >
                  <span>{col.label}</span>
                  <ArrowUpDown className="h-3 w-3 opacity-60" />
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-border/30 font-sans">
          {countries.map((c, idx) => {
            const isSelected = selectedCountryCode?.toUpperCase() === c.code.toUpperCase();
            const phys = getPhysicalStats(c);

            return (
              <tr
                key={c.code}
                onClick={() => onSelectCountry(c.code)}
                className={cn(
                  "hover:bg-emerald-500/10 cursor-pointer transition-colors duration-150",
                  isSelected && "bg-emerald-500/15 font-semibold"
                )}
              >
                <td className="py-2.5 px-4 text-center font-mono text-muted-foreground text-[11px]">
                  {idx + 1}
                </td>

                {/* Country Name & Flag */}
                <td className="py-2.5 px-4 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{c.flag}</span>
                    <span className="font-bold text-foreground hover:text-emerald-400">
                      {c.name}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                      {c.code}
                    </span>
                  </div>
                </td>

                {/* Region */}
                <td className="py-2.5 px-4 text-muted-foreground">{c.region}</td>

                {/* P50 Income */}
                <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-400">
                  €{Math.round(c.income?.p50 ?? 0).toLocaleString()}
                </td>

                {/* BMI */}
                <td className="py-2.5 px-4 text-right font-mono text-cyan-400">
                  {phys.bmi.female}
                </td>

                {/* Height F */}
                <td className="py-2.5 px-4 text-right font-mono text-pink-400">
                  {phys.heightCm.female} cm
                </td>

                {/* Height M */}
                <td className="py-2.5 px-4 text-right font-mono text-blue-400">
                  {phys.heightCm.male} cm
                </td>

                {/* Obesity */}
                <td className="py-2.5 px-4 text-right font-mono text-amber-400">
                  {c.obesityRate != null ? `${c.obesityRate}%` : "N/A"}
                </td>

                {/* Min Wage */}
                <td className="py-2.5 px-4 text-right font-mono text-emerald-300">
                  {c.minimumWageEur != null ? `€${Math.round(c.minimumWageEur)}` : "N/A"}
                </td>

                {/* HDI */}
                <td className="py-2.5 px-4 text-right font-mono text-sky-400">
                  {c.hdi != null ? c.hdi.toFixed(3) : "N/A"}
                </td>

                {/* Population */}
                <td className="py-2.5 px-4 text-right font-mono text-muted-foreground">
                  {(c.population / 1_000_000).toFixed(1)}M
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
