// Out-of-wedlock births % (2024)
// Source: OECD Family Database, Our World in Data
export const outOfWedlockByCountry: Record<string, number> = {
  // High (Latin America + Nordic)
  CO: 87, CL: 78, CR: 74, MX: 74, IS: 69, NO: 61, SE: 58, DK: 55,
  BG: 60, PT: 60, FR: 59, SI: 57, EE: 54, BE: 52, GB: 51, NZ: 49,
  CZ: 49, ES: 48, FI: 46, LU: 42, AT: 41, SK: 41, US: 41, LV: 40,
  IE: 38, AU: 37, IT: 34, DE: 33, CA: 33, RO: 33, HU: 30, CH: 28,
  LT: 27, PL: 26, MT: 26, HR: 23, CY: 21, GR: 14, IL: 8,
  // Very low (East Asia + Muslim)
  KR: 3, TR: 3, JP: 2, CN: 5, IN: 15, PK: 10, ID: 20, BD: 20,
  PH: 30, TH: 35, VN: 30, MY: 25, SG: 25,
  // Africa
  NG: 20, GH: 25, KE: 40, TZ: 35, ZA: 55, ET: 30, EG: 5, MA: 15,
  TN: 10, DZ: 5, ZW: 55, RW: 40, UG: 30,
  // Middle East
  SA: 2, AE: 10, KW: 5, QA: 5, BH: 10, OM: 10, YE: 15, IQ: 15,
  IR: 5, LB: 10, SY: 15, JO: 30,
  // Eastern Europe
  RU: 35, UA: 30, BY: 25, MD: 25, RS: 30, BA: 30, AL: 25, MK: 20, XK: 30,
};

export function getOutOfWedlock(countryCode: string): number | undefined {
  return outOfWedlockByCountry[countryCode];
}