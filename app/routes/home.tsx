import { useCallback, useMemo, useState } from "react";
import type { Route } from "./+types/home";
import { getCountryByCode, type CountryData } from "~/data/countries";
import {
  defaultStatId,
  statsById,
  valueExtent,
  type Sex,
  type StatDef,
} from "~/lib/stats";
import { WorldMap } from "~/components/WorldMap";
import { StatSidebar } from "~/components/StatSidebar";
import { RankingsPanel } from "~/components/RankingsPanel";
import { CountryDrawer } from "~/components/CountryDrawer";
import { SexToggle } from "~/components/SexToggle";

export function meta(_: Route.MetaArgs) {
  return [{ title: "income·globe — world statistics by sex" }];
}

export default function Home() {
  const [statId, setStatId] = useState(defaultStatId);
  const [sex, setSex] = useState<Sex>("female");
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  const stat = statsById.get(statId) ?? statsById.get(defaultStatId)!;
  const effectiveSex: Sex = stat.fixedSex ?? sex;

  const extent = useMemo(
    () => valueExtent(stat, effectiveSex),
    [stat, effectiveSex],
  );

  const selectStat = useCallback((s: StatDef) => {
    setStatId(s.id);
  }, []);

  const selectCountry = useCallback((c: CountryData) => {
    setSelectedCode((prev) => (prev === c.code ? null : c.code));
  }, []);

  const selected = selectedCode ? getCountryByCode(selectedCode) ?? null : null;

  const formatTick = useCallback(
    (v: number) =>
      Math.abs(v) >= 1000
        ? v.toLocaleString("en-US", { maximumFractionDigits: 0 })
        : v.toFixed(stat.decimals),
    [stat],
  );

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-zinc-950 text-zinc-200">
      <StatSidebar
        activeStat={stat}
        onSelect={selectStat}
        extent={extent}
        formatTick={formatTick}
      />

      <main className="relative flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-zinc-800/80 px-4 py-2.5">
          <div className="min-w-0">
            <h1 className="truncate text-sm font-medium text-zinc-100">
              {stat.label}
            </h1>
            <p className="text-[11px] text-zinc-500">
              {stat.group}
              {stat.unit ? ` · ${stat.unit}` : ""} ·{" "}
              {stat.sexed
                ? `colored by ${effectiveSex} values`
                : stat.fixedSex
                  ? `${stat.fixedSex} only`
                  : "all adults"}
            </p>
          </div>
          <SexToggle
            sex={effectiveSex}
            onChange={setSex}
            disabled={!stat.sexed}
            lockedLabel={
              stat.fixedSex
                ? `${stat.fixedSex === "female" ? "Female" : "Male"} only`
                : "No sex split"
            }
          />
        </header>

        <div className="relative min-h-0 flex-1">
          <WorldMap
            stat={stat}
            sex={effectiveSex}
            selectedCode={selectedCode}
            onSelect={selectCountry}
          />
          <CountryDrawer
            country={selected}
            activeStat={stat}
            sex={effectiveSex}
            onClose={() => setSelectedCode(null)}
            onSelectStat={selectStat}
          />
        </div>
      </main>

      <RankingsPanel
        stat={stat}
        sex={effectiveSex}
        selectedCode={selectedCode}
        onSelect={selectCountry}
      />
    </div>
  );
}
