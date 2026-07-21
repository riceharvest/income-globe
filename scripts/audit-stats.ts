import { stats, rankCountries } from "../app/lib/stats";
import { countries } from "../app/data/countries";

console.log(`countries: ${countries.length}\n`);
for (const s of stats) {
  const sexes = s.sexed ? (["male", "female"] as const) : ([s.fixedSex ?? "male"] as const);
  const parts = sexes.map((sex) => {
    const n = rankCountries(s, sex).length;
    return `${sex}: ${n}`;
  });
  const total = rankCountries(s, sexes[0]).length;
  const flag = total < 20 ? "  <-- LOW" : "";
  console.log(`${s.id.padEnd(28)} ${parts.join("  ")}${flag}`);
}
