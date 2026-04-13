// Child marriage percentage by country (% of women 20-24 married before age 18)
// Sources: UNICEF, Statista, Girls Not Brides, World Bank (2020-2024)

export const childMarriageByCountry: Record<string, number | null> = {
  // Sub-Saharan Africa - highest rates
  NE: 76, // Niger
  TD: 61, // Chad
  CF: 61, // Central African Republic
  ML: 54, // Mali
  MZ: 53, // Mozambique
  BF: 51, // Burkina Faso
  SS: 52, // South Sudan
  GN: 47, // Guinea
  SO: 45, // Somalia
  ER: 41, // Eritrea
  ET: 40, // Ethiopia
  MG: 39, // Madagascar
  MW: 38, // Malawi
  MR: 37, // Mauritania
  SN: 36, // Senegal
  CM: 31, // Cameroon
  NG: 30, // Nigeria
  AO: 30, // Angola
  CD: 37, // DR Congo
  CG: 33, // Congo
  TG: 25, // Togo
  SL: 39, // Sierra Leone
  LR: 28, // Liberia
  UG: 34, // Uganda
  KE: 23, // Kenya
  RW: 21, // Rwanda
  GH: 19, // Ghana
  TZ: 22, // Tanzania
  ZM: 29, // Zambia
  ZW: 34, // Zimbabwe
  GA: 22, // Gabon
  GM: 22, // Gambia
  BJ: 26, // Benin
  CI: 27, // Ivory Coast

  // South Asia
  BD: 51, // Bangladesh
  NP: 35, // Nepal
  AF: 28, // Afghanistan
  PK: 21, // Pakistan
  IN: 23, // India

  // North Africa & Middle East
  EG: 17, // Egypt
  MA: 16, // Morocco
  DZ: 3, // Algeria
  TN: 2, // Tunisia
  LY: 10, // Libya
  SD: 34, // Sudan
  IQ: 8, // Iraq
  IR: 6, // Iran
  SA: 5, // Saudi Arabia
  YE: 32, // Yemen
  JO: 8, // Jordan
  LB: 6, // Lebanon

  // Latin America & Caribbean
  GT: 30, // Guatemala
  HN: 34, // Honduras
  NI: 35, // Nicaragua
  SV: 25, // El Salvador
  DO: 32, // Dominican Republic
  HT: 21, // Haiti
  CU: 26, // Cuba
  JM: 18, // Jamaica
  CO: 23, // Colombia
  EC: 22, // Ecuador
  PY: 23, // Paraguay
  PE: 18, // Peru
  BO: 27, // Bolivia
  CL: 18, // Chile
  BR: 26, // Brazil
  AR: 21, // Argentina
  MX: 23, // Mexico
  PA: 22, // Panama

  // East Asia & Pacific
  KH: 18, // Cambodia
  LA: 27, // Laos
  MM: 15, // Myanmar
  TH: 11, // Thailand
  VN: 6, // Vietnam
  PH: 16, // Philippines
  ID: 9, // Indonesia
  MY: 5, // Malaysia
  PG: 13, // Papua New Guinea
  FJ: 21, // Fiji
  WS: 17, // Samoa
  TO: 13, // Tonga
  VU: 15, // Vanuatu

  // Europe
  TR: 12, // Turkey
  AL: 25, // Albania
  GE: 17, // Georgia
  HK: 5, // Hong Kong (very low)

  // Asia
  KP: 5, // North Korea (very low)
  XK: 16, // Kosovo
  RS: 14, // Serbia
  ME: 16, // Montenegro
  BA: 12, // Bosnia
  UA: 15, // Ukraine

  // Central Asia
  UZ: 9,
  TJ: 6,
  KG: 7,
  KZ: 5,
  TM: 5,

  // Europe - low rates
  NO: 2,
  SE: 3,
  FI: 2,
  DK: 2,
  IS: 2,
  NL: 5,
  BE: 3,
  FR: 5,
  DE: 3,
  AT: 4,
  CH: 2,
  IT: 5,
  ES: 8,
  PT: 10,
  GR: 14,
  PL: 11,
  CZ: 9,
  HU: 9,
  RO: 15,
  BG: 15,
  HR: 12,
  SI: 4,
  SK: 10,
  LT: 9,
  LV: 10,
  EE: 9,
  IE: 6,
  UK: 6,
  MT: 5, // Malta
  CY: 5, // Cyprus

  // Oceania
  AU: 3,
  NZ: 4,

  // North America
  US: 3,
  CA: 2,
};

export function getChildMarriage(countryCode: string): number | null {
  return childMarriageByCountry[countryCode] ?? null;
}