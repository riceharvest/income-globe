// Female obesity rate % (BMI >= 30)
// Source: WHO, World Obesity Federation 2024
export const femaleObesityByCountry: Record<string, number> = {
  TO: 52, WS: 47, FJ: 38, VU: 32, PG: 27, SB: 25, US: 41, MX: 33, CL: 31,
  CO: 29, AR: 28, BR: 27, UY: 26, GT: 27, HN: 25, PA: 25, CR: 24, VE: 25,
  EC: 24, DO: 24, EG: 32, SA: 28, AE: 27, KW: 26, QA: 25, BH: 24, OM: 23,
  JO: 23, LB: 22, TR: 23, IQ: 24, MA: 22, TN: 21, DZ: 21, GB: 28, DE: 24,
  FR: 23, ES: 21, IT: 21, PL: 26, RO: 24, HU: 24, CZ: 23, BG: 24, GR: 24,
  HR: 24, NL: 22, BE: 22, SE: 22, NO: 23, DK: 22, FI: 24, IS: 22, IE: 23,
  PT: 22, AT: 22, CH: 21, UA: 25, RU: 26, BY: 26, ZA: 32, NG: 20, KE: 17,
  GH: 18, TZ: 16, ET: 16, ZM: 14, BW: 18, AO: 15, CM: 15, CI: 16, UG: 14,
  MZ: 13, RW: 15, SD: 17, MG: 10, NE: 9, BF: 9, ML: 10, SN: 15, LR: 14,
  SL: 15, GM: 12, GN: 12, GW: 12, BJ: 15, TG: 14, JP: 5, KR: 6, CN: 6,
  TW: 8, HK: 7, SG: 7, MY: 13, TH: 13, PH: 9, VN: 4, ID: 10, BD: 6, NP: 6,
  LK: 8, IN: 7, PK: 8, AU: 29, NZ: 31, PW: 31, NR: 26, MH: 26,
};

export function getFemaleObesity(countryCode: string): number | undefined {
  return femaleObesityByCountry[countryCode];
}