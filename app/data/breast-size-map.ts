// Average breast size by country (bra cup size, US standard)
// Scale: 1=AA, 2=A, 3=B, 4=C, 5=D, 6=DD
// Sources: worlddata.info, worldpopulationreview.com (2024-2025)

export const breastSizeByCountry: Record<string, number> = {
  // Largest: C-D to D (Nordic)
  NO: 6, FI: 5, SE: 6, RU: 5, IS: 5, LU: 5,
  // Large: C
  US: 4, GB: 4, CO: 4, VE: 4, NL: 4, CA: 4, PL: 4, DK: 4, DE: 4, AT: 5, CH: 5, BG: 4,
  // Medium: B
  AU: 3, NZ: 3, FR: 3, ES: 3, PT: 3, TR: 3, GE: 3, HU: 3, IE: 4, IT: 3, GR: 3, BE: 3,
  CL: 3, AR: 3, BR: 3, MX: 3, CZ: 4, SK: 4, RO: 4, UA: 4, RS: 4, MD: 3, HR: 3,
  SI: 3, BA: 3, ME: 3, AL: 3, MK: 3, LT: 3, LV: 3, EE: 3, MT: 3, CY: 3,
  // Medium-Small: A-B
  JP: 2, CN: 2, KR: 2, TH: 2, VN: 1, IN: 2, ID: 2, MY: 2, SG: 2, PH: 2, FJ: 2,
  // Small: A
  EG: 2, SA: 2, IQ: 2, IR: 2, PK: 2, ZA: 2, MA: 2, DZ: 2, TN: 2, LY: 2, SY: 2,
  LB: 2, JO: 2, KW: 2, QA: 2, AE: 2, BH: 2, BD: 1, NP: 1, MM: 1, KH: 1, LA: 1,
  // Africa
  ET: 2, NG: 2, GH: 2, KE: 2, TZ: 2, MG: 2, CM: 2, CI: 2, SN: 2, UG: 2, ZW: 2,
  ZM: 2, MW: 2, AO: 2, CD: 2, CG: 2, BW: 2, NA: 2, SZ: 2, LS: 2,
  // Pacific
  WS: 1, TO: 1, VU: 1, PG: 2, SB: 2,
  // Americas
  CU: 2, DO: 2, JM: 2, HT: 2, GT: 2, HN: 2, SV: 2, NI: 2, CR: 2, PA: 2, EC: 2,
  PE: 2, BO: 2, PY: 2, UY: 3,
  // Central Asia
  KZ: 4, UZ: 3, TM: 3, KG: 3, TJ: 3,
  // South Asia
  BT: 2, LK: 2, MV: 2,
  // East Asia
  MN: 3, TW: 2, HK: 2,
  // Oceania
};

export function getBreastSize(countryCode: string): number | undefined {
  return breastSizeByCountry[countryCode];
}

export function cupSizeToLetter(size: number): string {
  const letters = ["", "AA", "A", "B", "C", "D", "DD"];
  return letters[size] ?? "?";
}