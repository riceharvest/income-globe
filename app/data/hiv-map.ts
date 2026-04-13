// HIV prevalence % (adults 15-49)
// Source: UNAIDS, World Bank 2024
export const hivByCountry: Record<string, number> = {
  // Highest - Sub-Saharan Africa
  SZ: 27, ZA: 19, LS: 22, ZW: 21, MZ: 21, BW: 19, NA: 19, UG: 17,
  TZ: 16, KE: 14, MW: 13, ZM: 12, RW: 11, CM: 9, NG: 9, CD: 9, GH: 6,
  CI: 6, ET: 5, SN: 4, ML: 3, BF: 3, TG: 6, BJ: 4, CG: 6, GA: 7,
  // Other regions - very low
  US: 0.5, CA: 0.3, GB: 0.3, DE: 0.2, FR: 0.3, ES: 0.3, IT: 0.2,
  NL: 0.2, BE: 0.2, SE: 0.1, NO: 0.1, DK: 0.1, FI: 0.1, IE: 0.2,
  RU: 0.5, UA: 0.3, RO: 0.1, PL: 0.1, HU: 0.1, CZ: 0.1,
  JP: 0.1, KR: 0.1, CN: 0.1, TH: 1, PH: 0.3, ID: 0.2, MY: 0.3, VN: 0.3,
  IN: 0.2, PK: 0.1, BD: 0.1, NP: 0.1, LK: 0.1,
  EG: 0.1, MA: 0.1, TN: 0.1, DZ: 0.1, LY: 0.1, SD: 0.3,
  BR: 0.5, CO: 0.5, AR: 0.5, PE: 0.4, CL: 0.5, VE: 0.5, MX: 0.4,
  AU: 0.2, NZ: 0.2,
};

export function getHiv(countryCode: string): number | undefined {
  return hivByCountry[countryCode];
}