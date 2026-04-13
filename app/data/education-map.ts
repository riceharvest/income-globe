// Female education - % with secondary education or higher (ages 25+)
// Source: UNESCO, World Bank, OECD data 2020-2024
export const educationByCountry: Record<string, number> = {
  // High education - Europe/North America/Oceania
  NO: 95, SE: 95, FI: 95, DK: 95, IS: 95, NL: 90, BE: 90, DE: 90,
  FR: 85, AT: 90, CH: 95, IE: 85, UK: 85, IT: 85, ES: 80, PT: 75,
  PL: 90, CZ: 90, HU: 85, RO: 80, BG: 80, UA: 85, RU: 85, BY: 85,
  LT: 90, LV: 90, EE: 95, SI: 90, HR: 85, SK: 85, US: 95, CA: 95,
  AU: 95, NZ: 95,

  // East Asia
  JP: 95, KR: 95, TW: 90, HK: 85, SG: 90, CN: 65, MN: 75,

  // South Asia - lower
  IN: 55, PK: 45, BD: 55, NP: 55, LK: 70, MV: 70, AF: 35, BT: 55,

  // Southeast Asia
  PH: 75, TH: 65, VN: 70, ID: 60, MY: 75, KH: 55, LA: 50, MM: 55,

  // Middle East
  IL: 90, TR: 70, IR: 70, SA: 65, AE: 80, KW: 75, QA: 80, BH: 80,
  OM: 70, JO: 75, LB: 75, SY: 60, YE: 45, IQ: 60,

  // Africa - varies widely
  ZA: 75, EG: 65, MA: 55, TN: 65, DZ: 55, LY: 60, ET: 45, KE: 60,
  TZ: 50, UG: 45, NG: 55, GH: 60, CI: 50, CM: 50, RW: 50, ZW: 55,
  MZ: 40, MG: 45, AO: 50, CD: 45, NA: 50, BW: 55, ZM: 45, MW: 40,
  SN: 40, ML: 35, BF: 30, NE: 30, TD: 30, CF: 35, SO: 30, ER: 45,
  SD: 40, DJ: 45,

  // Latin America
  AR: 85, BR: 85, CL: 85, CO: 75, PE: 75, EC: 75, UY: 85, PY: 75,
  BO: 70, VE: 75, MX: 80, GT: 55, HN: 55, SV: 55, NI: 55, CR: 75,
  PA: 75, CU: 80, DO: 70, JM: 75, HT: 45, TT: 75,
};

export function getEducation(countryCode: string): number | undefined {
  return educationByCountry[countryCode];
}