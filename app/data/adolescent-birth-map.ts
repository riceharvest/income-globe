// Adolescent birth rate (births per 1,000 women aged 15-19)
// Source: UN SDG indicators, Taiwan gender indicators 2023
export const adolescentBirthRateByCountry: Record<string, number> = {
  TW: 3, // Taiwan 2023
  VA: 0, // Vatican (very small, no data)
};

// Get rate
export function getAdolescentBirthRate(countryCode: string): number | undefined {
  return adolescentBirthRateByCountry[countryCode];
}