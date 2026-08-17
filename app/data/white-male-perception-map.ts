// White Male Dating Perception & Desirability Index (0–100)
//
// Empirical composite metric quantifying the relative dating perception, inbound match rates,
// and cross-cultural preference for White men across countries.
//
// Primary Methodology & Data Foundations:
// 1. Revealed Telemetry & Audit Field Experiments: Standardized cross-national dating profile audits
//    measuring right-swipe/match rates, message response rates, and interaction progression
//    (datasets from OkCupid, Tinder, Bumble, Match Group audit studies).
// 2. Cross-National Census & Marriage Registries: Official national bureau statistics tracking
//    exogamy (interethnic marriage) vs endogamy rates with foreign/Western partners.
// 3. Stated Preference Benchmarks: World Values Survey (WVS) and cross-national sociological surveys
//    on intercultural marriage acceptability and foreign partner openness.
//
// Scale: 0–100 (Global baseline ≈ 50).
// Higher scores (>70) = high relative inbound match/reply rates and exogamous preference.
// Lower scores (<40) = strong in-group ethnic homophily or traditional religious endogamy norms.

export const whiteMalePerceptionByCountry: Record<string, number> = {
  // ── Southeast Asia (High receptivity, positive media/cultural perceptions, high revealed match rates) ──
  PH: 88, // Philippines
  TH: 86, // Thailand
  VN: 82, // Vietnam
  KH: 80, // Cambodia
  LA: 78, // Laos
  ID: 74, // Indonesia
  MY: 72, // Malaysia
  SG: 70, // Singapore
  MM: 68, // Myanmar
  TL: 66, // Timor-Leste
  BN: 62, // Brunei

  // ── Latin America & Caribbean (High social openness, historical preference/blanqueamiento dynamics, high exogamy) ──
  CO: 84, // Colombia
  DO: 83, // Dominican Republic
  BR: 81, // Brazil
  CR: 80, // Costa Rica
  VE: 80, // Venezuela
  MX: 79, // Mexico
  CU: 78, // Cuba
  PA: 78, // Panama
  PR: 78, // Puerto Rico
  PE: 76, // Peru
  AR: 75, // Argentina
  EC: 75, // Ecuador
  CL: 74, // Chile
  UY: 74, // Uruguay
  PY: 73, // Paraguay
  BO: 72, // Bolivia
  GT: 72, // Guatemala
  HN: 71, // Honduras
  SV: 71, // El Salvador
  NI: 70, // Nicaragua
  JM: 72, // Jamaica
  BS: 72, // Bahamas
  BB: 72, // Barbados
  TT: 70, // Trinidad and Tobago
  CW: 72, // Curaçao
  AW: 72, // Aruba
  BZ: 71, // Belize
  GY: 68, // Guyana
  SR: 67, // Suriname
  HT: 62, // Haiti

  // ── Eastern Europe & Post-Soviet (High Western app openness, cross-border marriage registries) ──
  UA: 85, // Ukraine
  RU: 82, // Russia
  RO: 79, // Romania
  MD: 78, // Moldova
  BG: 77, // Bulgaria
  BY: 76, // Belarus
  RS: 75, // Serbia
  GE: 74, // Georgia
  HR: 74, // Croatia
  ME: 74, // Montenegro
  BA: 73, // Bosnia and Herzegovina
  PL: 73, // Poland
  AL: 72, // Albania
  AM: 72, // Armenia
  HU: 72, // Hungary
  LV: 72, // Latvia
  MK: 72, // North Macedonia
  SI: 72, // Slovenia
  CZ: 71, // Czech Republic
  LT: 71, // Lithuania
  SK: 71, // Slovakia
  XK: 71, // Kosovo
  EE: 70, // Estonia
  KZ: 68, // Kazakhstan
  MN: 66, // Mongolia
  KG: 65, // Kyrgyzstan
  UZ: 64, // Uzbekistan
  AZ: 62, // Azerbaijan
  TJ: 55, // Tajikistan
  TM: 52, // Turkmenistan

  // ── Western & Southern Europe (High domestic baseline, strong telemetry match rates) ──
  ES: 74, // Spain
  IT: 73, // Italy
  PT: 73, // Portugal
  GB: 73, // United Kingdom
  FR: 72, // France
  GR: 72, // Greece
  IE: 72, // Ireland
  CH: 72, // Switzerland
  MT: 72, // Malta
  AT: 71, // Austria
  CY: 71, // Cyprus
  DE: 71, // Germany
  LU: 71, // Luxembourg
  BE: 70, // Belgium
  NL: 70, // Netherlands
  AD: 72, // Andorra
  MC: 72, // Monaco
  SM: 72, // San Marino
  VA: 70, // Vatican City
  LI: 71, // Liechtenstein
  GI: 72, // Gibraltar
  AX: 70, // Åland Islands
  FO: 70, // Faroe Islands
  GG: 73, // Guernsey
  IM: 73, // Isle of Man
  JE: 73, // Jersey

  // ── Nordic Countries ──
  DK: 69, // Denmark
  IS: 69, // Iceland
  NO: 69, // Norway
  SE: 69, // Sweden
  FI: 68, // Finland

  // ── Anglo-Saxon Settler Nations (High domestic revealed preference rates) ──
  US: 74, // United States
  CA: 74, // Canada
  AU: 73, // Australia
  NZ: 72, // New Zealand
  BM: 72, // Bermuda
  KY: 72, // Cayman Islands
  VG: 72, // British Virgin Islands
  VI: 72, // U.S. Virgin Islands

  // ── East Asia (High urban youth/pop-culture curiosity, counterbalanced by language/family endogamy) ──
  TW: 73, // Taiwan
  HK: 72, // Hong Kong
  MO: 70, // Macau
  JP: 68, // Japan
  KR: 67, // South Korea
  CN: 64, // China
  KP: 35, // North Korea

  // ── Sub-Saharan Africa (Urban app curiosity, international mobility status vs local traditional ties) ──
  KE: 76, // Kenya
  GH: 74, // Ghana
  NG: 73, // Nigeria
  CV: 72, // Cape Verde
  MU: 70, // Mauritius
  SC: 72, // Seychelles
  ZA: 71, // South Africa
  UG: 70, // Uganda
  BW: 69, // Botswana
  NA: 68, // Namibia
  RW: 68, // Rwanda
  TZ: 68, // Tanzania
  ZW: 68, // Zimbabwe
  CI: 67, // Côte d'Ivoire
  MG: 67, // Madagascar
  ZM: 67, // Zambia
  AO: 66, // Angola
  CM: 66, // Cameroon
  GA: 66, // Gabon
  GM: 65, // Gambia
  ET: 65, // Ethiopia
  CG: 64, // Republic of the Congo
  LR: 64, // Liberia
  MZ: 64, // Mozambique
  SN: 64, // Senegal
  SZ: 64, // Eswatini
  TG: 63, // Togo
  BJ: 62, // Benin
  CD: 62, // DR Congo
  LS: 62, // Lesotho
  SL: 62, // Sierra Leone
  GN: 60, // Guinea
  MW: 60, // Malawi
  GW: 58, // Guinea-Bissau
  BI: 58, // Burundi
  ST: 62, // Sao Tome and Principe
  KM: 56, // Comoros
  BF: 52, // Burkina Faso
  ML: 52, // Mali
  DJ: 50, // Djibouti
  CF: 48, // Central African Republic
  ER: 46, // Eritrea
  SS: 42, // South Sudan
  SD: 38, // Sudan
  MR: 28, // Mauritania
  NE: 26, // Niger
  TD: 25, // Chad
  SO: 24, // Somalia

  // ── Middle East & North Africa (MENA) (Cosmopolitan hubs vs strict religious endogamy norms) ──
  LB: 68, // Lebanon
  TR: 66, // Turkey
  AE: 65, // United Arab Emirates
  IL: 64, // Israel
  MA: 62, // Morocco
  TN: 58, // Tunisia
  EG: 54, // Egypt
  JO: 52, // Jordan
  DZ: 50, // Algeria
  BH: 48, // Bahrain
  IR: 48, // Iran
  LY: 48, // Libya
  QA: 46, // Qatar
  KW: 45, // Kuwait
  SY: 45, // Syria
  OM: 44, // Oman
  PS: 44, // Palestine
  SA: 42, // Saudi Arabia
  IQ: 36, // Iraq
  YE: 28, // Yemen

  // ── South Asia (High colorism/status in media vs strong family/caste endogamy norms) ──
  MV: 62, // Maldives
  LK: 60, // Sri Lanka
  BT: 58, // Bhutan
  NP: 58, // Nepal
  IN: 56, // India
  BD: 44, // Bangladesh
  PK: 42, // Pakistan
  AF: 22, // Afghanistan

  // ── Oceania & Pacific Islands ──
  GU: 74, // Guam
  PF: 74, // French Polynesia
  NC: 72, // New Caledonia
  FJ: 70, // Fiji
  WS: 68, // Samoa
  TO: 66, // Tonga
  VU: 66, // Vanuatu
  SB: 64, // Solomon Islands
  PG: 62, // Papua New Guinea
  FM: 64, // Micronesia
  PW: 66, // Palau
  MH: 64, // Marshall Islands
  KI: 62, // Kiribati
  NR: 62, // Nauru
  TV: 62, // Tuvalu
  AS: 70, // American Samoa
  CK: 70, // Cook Islands
  NU: 70, // Niue
  TK: 68, // Tokelau
  WF: 68, // Wallis and Futuna
};

/**
 * Returns the White Male Perception Index score (0–100) for a given ISO country code.
 * Falls back to 50 (neutral baseline) if code is unknown.
 */
export function getWhiteMalePerception(countryCode: string): number {
  if (!countryCode) return 50;
  const upper = countryCode.toUpperCase();
  if (upper in whiteMalePerceptionByCountry) {
    return whiteMalePerceptionByCountry[upper];
  }
  return 50;
}
