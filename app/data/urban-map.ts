// Urban population % (2024)
export const urbanByCountry: Record<string, number> = {
  NO: 85, SE: 88, FI: 85, DK: 88, IS: 94, NL: 90, BE: 98, DE: 76,
  FR: 80, AT: 59, CH: 74, IE: 64, UK: 84, IT: 71, ES: 81, PT: 67,
  PL: 60, CZ: 74, HU: 72, RO: 54, UA: 70, RU: 75, US: 83, CA: 82,
  AU: 86, NZ: 87, JP: 92, KR: 81, TW: 81, HK: 100, SG: 100, CN: 65,
  IN: 36, PK: 38, BD: 35, ID: 58, PH: 47, TH: 53, VN: 38, MY: 78,
  MX: 81, BR: 88, AR: 92, CO: 78, PE: 82, CL: 88, NG: 52, KE: 29,
  ET: 27, TZ: 38, UG: 20, ZA: 68, GH: 59, EG: 43, MA: 60, DZ: 75,
  SA: 85, AE: 87, IL: 93, TR: 93, SA: 84,
};

export function getUrban(countryCode: string): number | undefined {
  return urbanByCountry[countryCode];
}