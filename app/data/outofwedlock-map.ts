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

  // Africa - Sub-Saharan
  LY: 3, SD: 5, AO: 25, BJ: 15, BW: 30, BF: 12, BI: 15, CV: 20, CM: 25, CF: 10,
  TD: 5, KM: 5, CG: 20, CD: 10, CI: 20, DJ: 5, GQ: 20, ER: 5, SZ: 15, GA: 18,
  GM: 10, GN: 15, GW: 20, LS: 20, LR: 25, MG: 20, MW: 15, ML: 10, MR: 8,
  MU: 25, MZ: 30, NA: 30, NE: 5, ST: 20, SN: 15, SC: 30, SL: 15, SO: 5,
  SS: 5, TG: 15, ZM: 15, AF: 2, AM: 5, AZ: 5, BT: 5, BN: 8, KH: 15, GE: 15,
  HK: 25, KZ: 10, KG: 5, LA: 15, MV: 10, MN: 5, MM: 15, NP: 10, KP: 2,
  PS: 5, LK: 20, TJ: 5, TW: 25, TL: 15, TM: 5, UZ: 5, AD: 30, LI: 20, MC: 30,
  ME: 20, NL: 50, SM: 30, VA: 5, AR: 65, BO: 65, BR: 65, CU: 40, DO: 60,
  EC: 70, SV: 65, GT: 65, HN: 65, NI: 55, PA: 55, PY: 65, PE: 65, UY: 55,
  VE: 55, FJ: 25, PG: 5, SB: 5, VU: 10, WS: 20, TO: 25,
};

export function getOutOfWedlock(countryCode: string): number | undefined {
  return outOfWedlockByCountry[countryCode];
}