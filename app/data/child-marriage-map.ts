// Child marriage % (women 20-24 married before 18)
export const childMarriageByCountry: Record<string, number | null> = {
  NE: 76, TD: 61, CF: 61, ML: 54, MZ: 53, BF: 51, SS: 52, GN: 47, SO: 45,
  ER: 41, ET: 40, MG: 39, MW: 38, MR: 37, SN: 36, CM: 31, NG: 30, AO: 30,
  CD: 37, CG: 33, TG: 25, SL: 39, LR: 28, UG: 34, KE: 23, RW: 21, GH: 19,
  TZ: 22, ZM: 29, ZW: 34, GA: 22, GM: 22, BJ: 26, CI: 27,
  BD: 51, NP: 35, AF: 28, PK: 21, IN: 23,
  EG: 17, MA: 16, DZ: 3, TN: 2, LY: 10, SD: 34, IQ: 8, IR: 6, SA: 5,
  YE: 32, JO: 8, LB: 6,
  GT: 30, HN: 34, NI: 35, SV: 25, DO: 32, HT: 21, CU: 26, JM: 18,
  CO: 23, EC: 22, PY: 23, PE: 18, BO: 27, CL: 18, BR: 26, AR: 21,
  MX: 23, PA: 22,
  KH: 18, LA: 27, MM: 15, TH: 11, VN: 6, PH: 16, ID: 9, MY: 5,
  PG: 13, FJ: 21, WS: 17, TO: 13, VU: 15,
  TR: 12, AL: 25, XK: 16, RS: 14, ME: 16, BA: 12, UA: 15,
  UZ: 9, TJ: 6, KG: 7, KZ: 5, TM: 5,
  NO: 2, SE: 3, FI: 2, DK: 2, IS: 2, NL: 5, BE: 3, FR: 5, DE: 3,
  AT: 4, CH: 2, IT: 5, ES: 8, PT: 10, GR: 14, PL: 11, CZ: 9, HU: 9,
  RO: 15, BG: 15, HR: 12, SI: 4, SK: 10, LT: 9, LV: 10, EE: 9,
  IE: 6, UK: 6, MT: 5, CY: 5, RU: 4, BY: 5, MD: 11,
  AD: 2, LI: 2, MC: 2, SM: 2, VA: 2, LU: 3,
  CR: 21, UY: 25, VE: 22, SB: 5,
  BW: 22, BI: 19, CV: 14, GQ: 25, SZ: 32, GW: 15, LS: 30, NA: 25, ST: 22, ZA: 25,
  BT: 26, CN: 3, JP: 2, KW: 7, MV: 7, MN: 3, QA: 6, SG: 4, LK: 10, TW: 3,
  TL: 12, AE: 5, BH: 4, IL: 5, KR: 2, OM: 3, PS: 18, SY: 12, YE: 32,
  GE: 17, HK: 5, KP: 5,
};

export function getChildMarriage(countryCode: string): number | null {
  return childMarriageByCountry[countryCode] ?? null;
}