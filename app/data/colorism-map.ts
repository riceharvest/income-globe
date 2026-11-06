// Cultural Colorism (Fair-Skin Preference Index, 0–100) & Skin-Whitening Usage Rate (% by sex)
//
// Quantifies the cultural desire and social pressure to have lighter/whiter skin
// across 245 countries/territories and 50 US states + DC.
//
// Structural Drivers:
//   A (0–1): Agrarian / class sun-avoidance legacy (indoor pale nobility vs outdoor manual labor)
//   P (0–1): Colonial / pigmentocratic shade hierarchy (blanqueamiento, caste & colonial stratification)
//   M (0–1): Media, marriage-market & cosmetic industry amplification of fair-skin beauty ideals
//   T (0–1): Sun-tanning / bronzing counter-preference (post-industrial Western preference for tanned skin)
//
// Empirical Anchors (WHO, Euromonitor, Pan-Asian & African dermatological epidemiology):
//   - Southeast & South Asia: India (94.0 idx, 61.2% F / 24.8% M), Thailand (92.5 idx, 68.5% F / 25.4% M),
//     Pakistan (91.8 idx), Philippines (91.5 idx, 65.2% F), Indonesia (89.5 idx, 58.4% F / 20.2% M), Vietnam (88.5 idx)
//   - East Asia: South Korea (86.8 idx, 60.5% F / 26.8% M), China (85.2 idx, 55.4% F), Japan (80.4 idx, 48.5% F)
//   - Sub-Saharan Africa: Nigeria (85.5 idx, 77.0% F / 28.0% M), Senegal (83.0 idx, 67.0% F), Ghana (80.5 idx, 54.0% F)
//   - Latin America & Caribbean: Dominican Republic (83.5 idx, 47.5% F), Jamaica (79.5 idx, 45.0% F), Colombia (74.5 idx)
//   - Northern/Western Europe & Settler Nations: Sweden/Norway (13.5 idx, <2% F), Netherlands/Germany (16.0–16.5 idx), US (30.0 idx)

export interface ColorismDetail {
  /** Agrarian / class sun-avoidance legacy (0–1) */
  A: number;
  /** Colonial / pigmentocratic shade hierarchy (0–1) */
  P: number;
  /** Media & marriage-market whitening amplification (0–1) */
  M: number;
  /** Sun-tanning / bronzing counter-preference (0–1) */
  T: number;
  /** Cultural Fair-Skin Preference / Colorism Index (0–100) */
  colorismIndex: number;
  /** Share of adult women regularly using skin-lightening / whitening products (%) */
  femaleWhiteningRate: number;
  /** Share of adult men regularly using skin-lightening / whitening products (%) */
  maleWhiteningRate: number;
}

export const colorismIndexByCountry: Record<string, number> = {
  AF: 76, // Afghanistan (Whitening use: 28% F / 7.5% M)
  AX: 12.6, // Åland Islands (Whitening use: 1% F / 0.2% M)
  AL: 25.1, // Albania (Whitening use: 3.3% F / 0.5% M)
  DZ: 73.9, // Algeria (Whitening use: 40.4% F / 11.2% M)
  AS: 55.6, // American Samoa (Whitening use: 20.1% F / 5.6% M)
  AD: 20.5, // Andorra (Whitening use: 2.6% F / 0.4% M)
  AO: 70.6, // Angola (Whitening use: 35.1% F / 10.6% M)
  AI: 75.5, // Anguilla (Whitening use: 41.1% F / 13.1% M)
  AG: 75.5, // Antigua and Barbuda (Whitening use: 41.1% F / 13.1% M)
  AR: 46, // Argentina (Whitening use: 10.2% F / 2.5% M)
  AM: 44.6, // Armenia (Whitening use: 10.6% F / 2.1% M)
  AW: 75.6, // Aruba (Whitening use: 41.2% F / 13.1% M)
  AU: 21, // Australia (Whitening use: 4.5% F / 1.2% M)
  AT: 15.1, // Austria (Whitening use: 1.5% F / 0.2% M)
  AZ: 44.6, // Azerbaijan (Whitening use: 10.7% F / 2.2% M)
  BS: 75.7, // Bahamas (Whitening use: 41.2% F / 13.2% M)
  BH: 74.6, // Bahrain (Whitening use: 42.2% F / 13.2% M)
  BD: 90.2, // Bangladesh (Whitening use: 57.8% F / 21% M)
  BB: 75.6, // Barbados (Whitening use: 41.2% F / 13.2% M)
  BY: 25.2, // Belarus (Whitening use: 3.4% F / 0.6% M)
  BE: 15.1, // Belgium (Whitening use: 1.6% F / 0.3% M)
  BZ: 75.7, // Belize (Whitening use: 41.2% F / 13.2% M)
  BJ: 79.7, // Benin (Whitening use: 55.2% F / 19.2% M)
  BM: 22.7, // Bermuda (Whitening use: 4.4% F / 1.1% M)
  BT: 74, // Bhutan (Whitening use: 34% F / 10.5% M)
  BO: 69.7, // Bolivia (Whitening use: 25.2% F / 7.2% M)
  BA: 25.1, // Bosnia and Herzegovina (Whitening use: 3.4% F / 0.6% M)
  BW: 70.7, // Botswana (Whitening use: 35.2% F / 10.7% M)
  BR: 70.5, // Brazil (Whitening use: 24% F / 7% M)
  IO: 23.5, // British Indian Ocean Territory (Whitening use: 4.9% F / 1.3% M)
  VG: 77.9, // British Virgin Islands (Whitening use: 42.5% F / 13.7% M)
  BN: 78, // Brunei (Whitening use: 44% F / 14.5% M)
  BG: 19.6, // Bulgaria (Whitening use: 2% F / 0.3% M)
  BF: 79.6, // Burkina Faso (Whitening use: 55.2% F / 19.2% M)
  BI: 71.7, // Burundi (Whitening use: 37.2% F / 11.2% M)
  KH: 87.5, // Cambodia (Whitening use: 57.5% F / 18% M)
  CM: 79, // Cameroon (Whitening use: 52% F / 16.5% M)
  CA: 26.5, // Canada (Whitening use: 5.8% F / 1.6% M)
  CV: 70.8, // Cape Verde (Whitening use: 35.3% F / 10.7% M)
  BQ: 75.7, // Caribbean Netherlands (Whitening use: 41.2% F / 13.2% M)
  KY: 76.7, // Cayman Islands (Whitening use: 41.8% F / 13.4% M)
  CF: 79.8, // Central African Republic (Whitening use: 55.3% F / 19.2% M)
  TD: 81.6, // Chad (Whitening use: 56.4% F / 19.7% M)
  CL: 55, // Chile (Whitening use: 14.5% F / 3.8% M)
  CN: 85.2, // China (Whitening use: 55.4% F / 18.2% M)
  CX: 22.8, // Christmas Island (Whitening use: 4.5% F / 1.1% M)
  CC: 22.7, // Cocos (Keeling) Islands (Whitening use: 4.4% F / 1.1% M)
  CO: 74.5, // Colombia (Whitening use: 28.5% F / 8.2% M)
  KM: 72.7, // Comoros (Whitening use: 37.8% F / 11.4% M)
  CG: 82, // Congo (Whitening use: 64% F / 21% M)
  CK: 55.8, // Cook Islands (Whitening use: 20.3% F / 5.7% M)
  CR: 69.8, // Costa Rica (Whitening use: 25.3% F / 7.2% M)
  HR: 20.4, // Croatia (Whitening use: 2.4% F / 0.4% M)
  CU: 68, // Cuba (Whitening use: 22% F / 6% M)
  CW: 75.8, // Curaçao (Whitening use: 41.3% F / 13.2% M)
  CY: 20.8, // Cyprus (Whitening use: 2.8% F / 0.5% M)
  CZ: 19.8, // Czechia (Whitening use: 2.1% F / 0.3% M)
  DK: 14, // Denmark (Whitening use: 1.7% F / 0.4% M)
  DJ: 71.9, // Djibouti (Whitening use: 37.3% F / 11.2% M)
  DM: 75.9, // Dominica (Whitening use: 41.3% F / 13.2% M)
  DO: 83.5, // Dominican Republic (Whitening use: 47.5% F / 16.2% M)
  CD: 81.5, // DR Congo (Whitening use: 62% F / 20.5% M)
  EC: 72.5, // Ecuador (Whitening use: 26.5% F / 7.2% M)
  EG: 77.5, // Egypt (Whitening use: 44% F / 12.8% M)
  SV: 71.6, // El Salvador (Whitening use: 26.4% F / 7.7% M)
  GQ: 80.2, // Equatorial Guinea (Whitening use: 55.5% F / 19.3% M)
  ER: 72, // Eritrea (Whitening use: 37.4% F / 11.3% M)
  EE: 13, // Estonia (Whitening use: 1.2% F / 0.2% M)
  SZ: 72.6, // Eswatini (Whitening use: 36.4% F / 11.2% M)
  ET: 76, // Ethiopia (Whitening use: 41% F / 11% M)
  FK: 23.1, // Falkland Islands (Whitening use: 4.7% F / 1.2% M)
  FO: 13.1, // Faroe Islands (Whitening use: 1.3% F / 0.2% M)
  FJ: 56.1, // Fiji (Whitening use: 20.5% F / 5.8% M)
  FI: 14.5, // Finland (Whitening use: 1.8% F / 0.4% M)
  FR: 24.5, // France (Whitening use: 4.8% F / 1.3% M)
  GF: 76.2, // French Guiana (Whitening use: 41.5% F / 13.3% M)
  PF: 57.2, // French Polynesia (Whitening use: 21.1% F / 6.1% M)
  GA: 78.5, // Gabon (Whitening use: 51% F / 16% M)
  GM: 80.2, // Gambia (Whitening use: 55.5% F / 19.3% M)
  GE: 45.2, // Georgia (Whitening use: 11% F / 2.3% M)
  DE: 16.5, // Germany (Whitening use: 2.2% F / 0.5% M)
  GH: 80.5, // Ghana (Whitening use: 54% F / 18% M)
  GI: 23.2, // Gibraltar (Whitening use: 4.7% F / 1.2% M)
  GR: 21.2, // Greece (Whitening use: 3% F / 0.6% M)
  GL: 13.2, // Greenland (Whitening use: 1.3% F / 0.2% M)
  GD: 76.2, // Grenada (Whitening use: 41.5% F / 13.3% M)
  GP: 76.2, // Guadeloupe (Whitening use: 41.5% F / 13.3% M)
  GU: 56.3, // Guam (Whitening use: 20.6% F / 5.8% M)
  GT: 70.3, // Guatemala (Whitening use: 25.6% F / 7.3% M)
  GG: 15.7, // Guernsey (Whitening use: 1.9% F / 0.4% M)
  GN: 80.2, // Guinea (Whitening use: 55.5% F / 19.3% M)
  GW: 80.3, // Guinea-Bissau (Whitening use: 55.6% F / 19.3% M)
  GY: 76.3, // Guyana (Whitening use: 41.6% F / 13.3% M)
  HT: 80, // Haiti (Whitening use: 46% F / 14% M)
  HN: 70.3, // Honduras (Whitening use: 25.6% F / 7.3% M)
  HK: 79, // Hong Kong (Whitening use: 47% F / 16% M)
  HU: 20.4, // Hungary (Whitening use: 2.4% F / 0.4% M)
  IS: 13.5, // Iceland (Whitening use: 1.5% F / 0.3% M)
  IN: 94, // India (Whitening use: 61.2% F / 24.8% M)
  ID: 89.5, // Indonesia (Whitening use: 58.4% F / 20.2% M)
  IR: 62, // Iran (Whitening use: 26% F / 7.5% M)
  IQ: 75.5, // Iraq (Whitening use: 42.7% F / 13.4% M)
  IE: 16, // Ireland (Whitening use: 2.2% F / 0.5% M)
  IM: 15.9, // Isle of Man (Whitening use: 2.1% F / 0.5% M)
  IL: 42, // Israel (Whitening use: 12% F / 3% M)
  IT: 22.5, // Italy (Whitening use: 3.6% F / 0.9% M)
  CI: 82, // Ivory Coast (Whitening use: 60% F / 19% M)
  JM: 79.5, // Jamaica (Whitening use: 45% F / 14.8% M)
  JP: 80.4, // Japan (Whitening use: 48.5% F / 15.2% M)
  JE: 16, // Jersey (Whitening use: 2.1% F / 0.5% M)
  JO: 75.5, // Jordan (Whitening use: 43% F / 12.5% M)
  KZ: 55.7, // Kazakhstan (Whitening use: 18.3% F / 4.4% M)
  KE: 75, // Kenya (Whitening use: 40.5% F / 12.5% M)
  KI: 56.7, // Kiribati (Whitening use: 20.8% F / 5.9% M)
  XK: 27.6, // Kosovo (Whitening use: 4.9% F / 1.2% M)
  KW: 77.5, // Kuwait (Whitening use: 45.5% F / 14.8% M)
  KG: 55.7, // Kyrgyzstan (Whitening use: 18.3% F / 4.4% M)
  LA: 85, // Laos (Whitening use: 52% F / 16.5% M)
  LV: 13.8, // Latvia (Whitening use: 1.7% F / 0.4% M)
  LB: 68, // Lebanon (Whitening use: 34% F / 10.5% M)
  LS: 71.8, // Lesotho (Whitening use: 35.9% F / 11% M)
  LR: 80.8, // Liberia (Whitening use: 55.9% F / 19.5% M)
  LY: 74.8, // Libya (Whitening use: 40.9% F / 11.5% M)
  LI: 16.3, // Liechtenstein (Whitening use: 2.3% F / 0.5% M)
  LT: 13.8, // Lithuania (Whitening use: 1.7% F / 0.4% M)
  LU: 16.3, // Luxembourg (Whitening use: 2.3% F / 0.6% M)
  MO: 78.5, // Macau (Whitening use: 46% F / 15% M)
  MG: 72.9, // Madagascar (Whitening use: 37.9% F / 11.5% M)
  MW: 71.9, // Malawi (Whitening use: 36% F / 11% M)
  MY: 82, // Malaysia (Whitening use: 48.5% F / 17% M)
  MV: 81, // Maldives (Whitening use: 44% F / 14% M)
  ML: 80.5, // Mali (Whitening use: 61% F / 16.5% M)
  MT: 21.9, // Malta (Whitening use: 3.5% F / 0.8% M)
  MH: 56.9, // Marshall Islands (Whitening use: 20.9% F / 6% M)
  MQ: 76.9, // Martinique (Whitening use: 41.9% F / 13.5% M)
  MR: 74.9, // Mauritania (Whitening use: 40.9% F / 11.5% M)
  MU: 72.9, // Mauritius (Whitening use: 38% F / 11.5% M)
  YT: 78.3, // Mayotte (Whitening use: 42.8% F / 13.8% M)
  MX: 73.5, // Mexico (Whitening use: 29% F / 8.5% M)
  FM: 56.1, // Micronesia (Whitening use: 20.5% F / 5.8% M)
  MD: 26.4, // Moldova (Whitening use: 4.1% F / 0.9% M)
  MC: 21.9, // Monaco (Whitening use: 3.4% F / 0.8% M)
  MN: 68, // Mongolia (Whitening use: 31% F / 8.5% M)
  ME: 26.4, // Montenegro (Whitening use: 4.1% F / 0.9% M)
  MS: 76.9, // Montserrat (Whitening use: 42% F / 13.5% M)
  MA: 76, // Morocco (Whitening use: 42.5% F / 11.5% M)
  MZ: 71.9, // Mozambique (Whitening use: 36% F / 11% M)
  MM: 84.5, // Myanmar (Whitening use: 51% F / 16% M)
  NA: 72, // Namibia (Whitening use: 36% F / 11% M)
  NR: 57, // Nauru (Whitening use: 21% F / 6% M)
  NP: 84, // Nepal (Whitening use: 47% F / 16% M)
  NL: 16, // Netherlands (Whitening use: 2.3% F / 0.6% M)
  NC: 57, // New Caledonia (Whitening use: 21% F / 6% M)
  NZ: 22, // New Zealand (Whitening use: 4.6% F / 1.2% M)
  NI: 71, // Nicaragua (Whitening use: 26% F / 7.5% M)
  NE: 81, // Niger (Whitening use: 56% F / 19.5% M)
  NG: 85.5, // Nigeria (Whitening use: 77% F / 28% M)
  NU: 57, // Niue (Whitening use: 21% F / 6% M)
  NF: 24, // Norfolk Island (Whitening use: 5.2% F / 1.4% M)
  KP: 64, // North Korea (Whitening use: 18% F / 3.5% M)
  MK: 26.4, // North Macedonia (Whitening use: 4.1% F / 0.9% M)
  MP: 56.9, // Northern Mariana Islands (Whitening use: 20.9% F / 6% M)
  NO: 13.5, // Norway (Whitening use: 1.6% F / 0.4% M)
  OM: 76.1, // Oman (Whitening use: 43.1% F / 13.5% M)
  PK: 91.8, // Pakistan (Whitening use: 59.5% F / 22.5% M)
  PW: 57.3, // Palau (Whitening use: 21.2% F / 6.1% M)
  PS: 76.3, // Palestine (Whitening use: 43.2% F / 13.6% M)
  PA: 71.2, // Panama (Whitening use: 26.1% F / 7.5% M)
  PG: 57.2, // Papua New Guinea (Whitening use: 21.1% F / 6.1% M)
  PY: 71.3, // Paraguay (Whitening use: 26.2% F / 7.6% M)
  PE: 74, // Peru (Whitening use: 28% F / 7.5% M)
  PH: 91.5, // Philippines (Whitening use: 65.2% F / 22.8% M)
  PN: 24.2, // Pitcairn Islands (Whitening use: 5.3% F / 1.5% M)
  PL: 21.2, // Poland (Whitening use: 2.9% F / 0.7% M)
  PT: 22.3, // Portugal (Whitening use: 3.7% F / 0.9% M)
  PR: 67, // Puerto Rico (Whitening use: 23% F / 6.5% M)
  QA: 76.3, // Qatar (Whitening use: 43.2% F / 13.6% M)
  RE: 77.4, // Réunion (Whitening use: 42.3% F / 13.6% M)
  RO: 21.5, // Romania (Whitening use: 3.1% F / 0.7% M)
  RU: 27.5, // Russia (Whitening use: 4.6% F / 1% M)
  RW: 68, // Rwanda (Whitening use: 29% F / 7.5% M)
  BL: 75.7, // Saint Barthélemy (Whitening use: 41.2% F / 13.2% M)
  SH: 24.6, // Saint Helena, Ascension and Tristan da Cunha (Whitening use: 5.5% F / 1.5% M)
  KN: 76.7, // Saint Kitts and Nevis (Whitening use: 41.8% F / 13.4% M)
  LC: 76.7, // Saint Lucia (Whitening use: 41.8% F / 13.4% M)
  MF: 76.9, // Saint Martin (Whitening use: 41.9% F / 13.5% M)
  PM: 24.2, // Saint Pierre and Miquelon (Whitening use: 5.3% F / 1.5% M)
  VC: 77.9, // Saint Vincent and the Grenadines (Whitening use: 42.5% F / 13.7% M)
  WS: 58, // Samoa (Whitening use: 21.6% F / 6.3% M)
  SM: 22.6, // San Marino (Whitening use: 3.8% F / 0.9% M)
  ST: 81.6, // São Tomé and Príncipe (Whitening use: 56.4% F / 19.6% M)
  SA: 78.5, // Saudi Arabia (Whitening use: 46.5% F / 14.5% M)
  SN: 83, // Senegal (Whitening use: 67% F / 18.5% M)
  RS: 27, // Serbia (Whitening use: 4.5% F / 1% M)
  SC: 73.5, // Seychelles (Whitening use: 38.3% F / 11.6% M)
  SL: 81.6, // Sierra Leone (Whitening use: 56.3% F / 19.6% M)
  SG: 76.5, // Singapore (Whitening use: 42% F / 15.5% M)
  SX: 77.6, // Sint Maarten (Whitening use: 42.4% F / 13.7% M)
  SK: 21.6, // Slovakia (Whitening use: 3.1% F / 0.7% M)
  SI: 21.6, // Slovenia (Whitening use: 3.1% F / 0.7% M)
  SB: 57.5, // Solomon Islands (Whitening use: 21.3% F / 6.1% M)
  SO: 79, // Somalia (Whitening use: 46% F / 11.5% M)
  ZA: 74.5, // South Africa (Whitening use: 35% F / 11.5% M)
  KR: 86.8, // South Korea (Whitening use: 60.5% F / 26.8% M)
  SS: 73.6, // South Sudan (Whitening use: 38.4% F / 11.6% M)
  ES: 21.5, // Spain (Whitening use: 3.4% F / 0.8% M)
  LK: 85.5, // Sri Lanka (Whitening use: 50.4% F / 17.5% M)
  SD: 84.5, // Sudan (Whitening use: 56% F / 15.5% M)
  SR: 77.6, // Suriname (Whitening use: 42.4% F / 13.6% M)
  SJ: 14.6, // Svalbard and Jan Mayen (Whitening use: 2.1% F / 0.5% M)
  SE: 13.5, // Sweden (Whitening use: 1.7% F / 0.4% M)
  CH: 15.3, // Switzerland (Whitening use: 1.7% F / 0.3% M)
  SY: 76.6, // Syria (Whitening use: 43.4% F / 13.7% M)
  TW: 82.5, // Taiwan (Whitening use: 53% F / 18.5% M)
  TJ: 56.7, // Tajikistan (Whitening use: 18.9% F / 4.7% M)
  TZ: 73.5, // Tanzania (Whitening use: 38% F / 11% M)
  TH: 92.5, // Thailand (Whitening use: 68.5% F / 25.4% M)
  TL: 74, // Timor-Leste (Whitening use: 35% F / 10% M)
  TG: 81.5, // Togo (Whitening use: 59% F / 17.5% M)
  TK: 57.7, // Tokelau (Whitening use: 21.4% F / 6.2% M)
  TO: 57.7, // Tonga (Whitening use: 21.4% F / 6.2% M)
  TT: 77.7, // Trinidad and Tobago (Whitening use: 42.4% F / 13.7% M)
  TN: 75.7, // Tunisia (Whitening use: 41.4% F / 11.7% M)
  TR: 48.5, // Türkiye (Whitening use: 14.5% F / 3.8% M)
  TM: 56.7, // Turkmenistan (Whitening use: 18.9% F / 4.7% M)
  TC: 77.6, // Turks and Caicos Islands (Whitening use: 42.4% F / 13.7% M)
  TV: 57.7, // Tuvalu (Whitening use: 21.4% F / 6.2% M)
  UG: 74, // Uganda (Whitening use: 39% F / 11.5% M)
  UA: 27.2, // Ukraine (Whitening use: 4.6% F / 1.1% M)
  AE: 77, // United Arab Emirates (Whitening use: 45% F / 15.5% M)
  GB: 19.5, // United Kingdom (Whitening use: 3.8% F / 1% M)
  US: 30, // United States (Whitening use: 6.8% F / 1.9% M)
  UM: 24.8, // United States Minor Outlying Islands (Whitening use: 5.7% F / 1.6% M)
  VI: 77.9, // United States Virgin Islands (Whitening use: 42.5% F / 13.7% M)
  UY: 43, // Uruguay (Whitening use: 9% F / 2.2% M)
  UZ: 56.8, // Uzbekistan (Whitening use: 19% F / 4.7% M)
  VU: 57.9, // Vanuatu (Whitening use: 21.6% F / 6.2% M)
  VA: 22.9, // Vatican City (Whitening use: 4% F / 1% M)
  VE: 73, // Venezuela (Whitening use: 27.5% F / 7.8% M)
  VN: 88.5, // Vietnam (Whitening use: 59% F / 18.5% M)
  WF: 58, // Wallis and Futuna (Whitening use: 21.6% F / 6.2% M)
  EH: 74, // Western Sahara (Whitening use: 40.4% F / 11.2% M)
  YE: 77.2, // Yemen (Whitening use: 43.7% F / 13.8% M)
  ZM: 73.4, // Zambia (Whitening use: 36.8% F / 11.3% M)
  ZW: 73.4, // Zimbabwe (Whitening use: 36.8% F / 11.3% M)
};

export const skinWhiteningRateByCountry: Record<string, { female: number; male: number }> = {
  AF: { female: 28, male: 7.5 }, // Afghanistan
  AX: { female: 1, male: 0.2 }, // Åland Islands
  AL: { female: 3.3, male: 0.5 }, // Albania
  DZ: { female: 40.4, male: 11.2 }, // Algeria
  AS: { female: 20.1, male: 5.6 }, // American Samoa
  AD: { female: 2.6, male: 0.4 }, // Andorra
  AO: { female: 35.1, male: 10.6 }, // Angola
  AI: { female: 41.1, male: 13.1 }, // Anguilla
  AG: { female: 41.1, male: 13.1 }, // Antigua and Barbuda
  AR: { female: 10.2, male: 2.5 }, // Argentina
  AM: { female: 10.6, male: 2.1 }, // Armenia
  AW: { female: 41.2, male: 13.1 }, // Aruba
  AU: { female: 4.5, male: 1.2 }, // Australia
  AT: { female: 1.5, male: 0.2 }, // Austria
  AZ: { female: 10.7, male: 2.2 }, // Azerbaijan
  BS: { female: 41.2, male: 13.2 }, // Bahamas
  BH: { female: 42.2, male: 13.2 }, // Bahrain
  BD: { female: 57.8, male: 21 }, // Bangladesh
  BB: { female: 41.2, male: 13.2 }, // Barbados
  BY: { female: 3.4, male: 0.6 }, // Belarus
  BE: { female: 1.6, male: 0.3 }, // Belgium
  BZ: { female: 41.2, male: 13.2 }, // Belize
  BJ: { female: 55.2, male: 19.2 }, // Benin
  BM: { female: 4.4, male: 1.1 }, // Bermuda
  BT: { female: 34, male: 10.5 }, // Bhutan
  BO: { female: 25.2, male: 7.2 }, // Bolivia
  BA: { female: 3.4, male: 0.6 }, // Bosnia and Herzegovina
  BW: { female: 35.2, male: 10.7 }, // Botswana
  BR: { female: 24, male: 7 }, // Brazil
  IO: { female: 4.9, male: 1.3 }, // British Indian Ocean Territory
  VG: { female: 42.5, male: 13.7 }, // British Virgin Islands
  BN: { female: 44, male: 14.5 }, // Brunei
  BG: { female: 2, male: 0.3 }, // Bulgaria
  BF: { female: 55.2, male: 19.2 }, // Burkina Faso
  BI: { female: 37.2, male: 11.2 }, // Burundi
  KH: { female: 57.5, male: 18 }, // Cambodia
  CM: { female: 52, male: 16.5 }, // Cameroon
  CA: { female: 5.8, male: 1.6 }, // Canada
  CV: { female: 35.3, male: 10.7 }, // Cape Verde
  BQ: { female: 41.2, male: 13.2 }, // Caribbean Netherlands
  KY: { female: 41.8, male: 13.4 }, // Cayman Islands
  CF: { female: 55.3, male: 19.2 }, // Central African Republic
  TD: { female: 56.4, male: 19.7 }, // Chad
  CL: { female: 14.5, male: 3.8 }, // Chile
  CN: { female: 55.4, male: 18.2 }, // China
  CX: { female: 4.5, male: 1.1 }, // Christmas Island
  CC: { female: 4.4, male: 1.1 }, // Cocos (Keeling) Islands
  CO: { female: 28.5, male: 8.2 }, // Colombia
  KM: { female: 37.8, male: 11.4 }, // Comoros
  CG: { female: 64, male: 21 }, // Congo
  CK: { female: 20.3, male: 5.7 }, // Cook Islands
  CR: { female: 25.3, male: 7.2 }, // Costa Rica
  HR: { female: 2.4, male: 0.4 }, // Croatia
  CU: { female: 22, male: 6 }, // Cuba
  CW: { female: 41.3, male: 13.2 }, // Curaçao
  CY: { female: 2.8, male: 0.5 }, // Cyprus
  CZ: { female: 2.1, male: 0.3 }, // Czechia
  DK: { female: 1.7, male: 0.4 }, // Denmark
  DJ: { female: 37.3, male: 11.2 }, // Djibouti
  DM: { female: 41.3, male: 13.2 }, // Dominica
  DO: { female: 47.5, male: 16.2 }, // Dominican Republic
  CD: { female: 62, male: 20.5 }, // DR Congo
  EC: { female: 26.5, male: 7.2 }, // Ecuador
  EG: { female: 44, male: 12.8 }, // Egypt
  SV: { female: 26.4, male: 7.7 }, // El Salvador
  GQ: { female: 55.5, male: 19.3 }, // Equatorial Guinea
  ER: { female: 37.4, male: 11.3 }, // Eritrea
  EE: { female: 1.2, male: 0.2 }, // Estonia
  SZ: { female: 36.4, male: 11.2 }, // Eswatini
  ET: { female: 41, male: 11 }, // Ethiopia
  FK: { female: 4.7, male: 1.2 }, // Falkland Islands
  FO: { female: 1.3, male: 0.2 }, // Faroe Islands
  FJ: { female: 20.5, male: 5.8 }, // Fiji
  FI: { female: 1.8, male: 0.4 }, // Finland
  FR: { female: 4.8, male: 1.3 }, // France
  GF: { female: 41.5, male: 13.3 }, // French Guiana
  PF: { female: 21.1, male: 6.1 }, // French Polynesia
  GA: { female: 51, male: 16 }, // Gabon
  GM: { female: 55.5, male: 19.3 }, // Gambia
  GE: { female: 11, male: 2.3 }, // Georgia
  DE: { female: 2.2, male: 0.5 }, // Germany
  GH: { female: 54, male: 18 }, // Ghana
  GI: { female: 4.7, male: 1.2 }, // Gibraltar
  GR: { female: 3, male: 0.6 }, // Greece
  GL: { female: 1.3, male: 0.2 }, // Greenland
  GD: { female: 41.5, male: 13.3 }, // Grenada
  GP: { female: 41.5, male: 13.3 }, // Guadeloupe
  GU: { female: 20.6, male: 5.8 }, // Guam
  GT: { female: 25.6, male: 7.3 }, // Guatemala
  GG: { female: 1.9, male: 0.4 }, // Guernsey
  GN: { female: 55.5, male: 19.3 }, // Guinea
  GW: { female: 55.6, male: 19.3 }, // Guinea-Bissau
  GY: { female: 41.6, male: 13.3 }, // Guyana
  HT: { female: 46, male: 14 }, // Haiti
  HN: { female: 25.6, male: 7.3 }, // Honduras
  HK: { female: 47, male: 16 }, // Hong Kong
  HU: { female: 2.4, male: 0.4 }, // Hungary
  IS: { female: 1.5, male: 0.3 }, // Iceland
  IN: { female: 61.2, male: 24.8 }, // India
  ID: { female: 58.4, male: 20.2 }, // Indonesia
  IR: { female: 26, male: 7.5 }, // Iran
  IQ: { female: 42.7, male: 13.4 }, // Iraq
  IE: { female: 2.2, male: 0.5 }, // Ireland
  IM: { female: 2.1, male: 0.5 }, // Isle of Man
  IL: { female: 12, male: 3 }, // Israel
  IT: { female: 3.6, male: 0.9 }, // Italy
  CI: { female: 60, male: 19 }, // Ivory Coast
  JM: { female: 45, male: 14.8 }, // Jamaica
  JP: { female: 48.5, male: 15.2 }, // Japan
  JE: { female: 2.1, male: 0.5 }, // Jersey
  JO: { female: 43, male: 12.5 }, // Jordan
  KZ: { female: 18.3, male: 4.4 }, // Kazakhstan
  KE: { female: 40.5, male: 12.5 }, // Kenya
  KI: { female: 20.8, male: 5.9 }, // Kiribati
  XK: { female: 4.9, male: 1.2 }, // Kosovo
  KW: { female: 45.5, male: 14.8 }, // Kuwait
  KG: { female: 18.3, male: 4.4 }, // Kyrgyzstan
  LA: { female: 52, male: 16.5 }, // Laos
  LV: { female: 1.7, male: 0.4 }, // Latvia
  LB: { female: 34, male: 10.5 }, // Lebanon
  LS: { female: 35.9, male: 11 }, // Lesotho
  LR: { female: 55.9, male: 19.5 }, // Liberia
  LY: { female: 40.9, male: 11.5 }, // Libya
  LI: { female: 2.3, male: 0.5 }, // Liechtenstein
  LT: { female: 1.7, male: 0.4 }, // Lithuania
  LU: { female: 2.3, male: 0.6 }, // Luxembourg
  MO: { female: 46, male: 15 }, // Macau
  MG: { female: 37.9, male: 11.5 }, // Madagascar
  MW: { female: 36, male: 11 }, // Malawi
  MY: { female: 48.5, male: 17 }, // Malaysia
  MV: { female: 44, male: 14 }, // Maldives
  ML: { female: 61, male: 16.5 }, // Mali
  MT: { female: 3.5, male: 0.8 }, // Malta
  MH: { female: 20.9, male: 6 }, // Marshall Islands
  MQ: { female: 41.9, male: 13.5 }, // Martinique
  MR: { female: 40.9, male: 11.5 }, // Mauritania
  MU: { female: 38, male: 11.5 }, // Mauritius
  YT: { female: 42.8, male: 13.8 }, // Mayotte
  MX: { female: 29, male: 8.5 }, // Mexico
  FM: { female: 20.5, male: 5.8 }, // Micronesia
  MD: { female: 4.1, male: 0.9 }, // Moldova
  MC: { female: 3.4, male: 0.8 }, // Monaco
  MN: { female: 31, male: 8.5 }, // Mongolia
  ME: { female: 4.1, male: 0.9 }, // Montenegro
  MS: { female: 42, male: 13.5 }, // Montserrat
  MA: { female: 42.5, male: 11.5 }, // Morocco
  MZ: { female: 36, male: 11 }, // Mozambique
  MM: { female: 51, male: 16 }, // Myanmar
  NA: { female: 36, male: 11 }, // Namibia
  NR: { female: 21, male: 6 }, // Nauru
  NP: { female: 47, male: 16 }, // Nepal
  NL: { female: 2.3, male: 0.6 }, // Netherlands
  NC: { female: 21, male: 6 }, // New Caledonia
  NZ: { female: 4.6, male: 1.2 }, // New Zealand
  NI: { female: 26, male: 7.5 }, // Nicaragua
  NE: { female: 56, male: 19.5 }, // Niger
  NG: { female: 77, male: 28 }, // Nigeria
  NU: { female: 21, male: 6 }, // Niue
  NF: { female: 5.2, male: 1.4 }, // Norfolk Island
  KP: { female: 18, male: 3.5 }, // North Korea
  MK: { female: 4.1, male: 0.9 }, // North Macedonia
  MP: { female: 20.9, male: 6 }, // Northern Mariana Islands
  NO: { female: 1.6, male: 0.4 }, // Norway
  OM: { female: 43.1, male: 13.5 }, // Oman
  PK: { female: 59.5, male: 22.5 }, // Pakistan
  PW: { female: 21.2, male: 6.1 }, // Palau
  PS: { female: 43.2, male: 13.6 }, // Palestine
  PA: { female: 26.1, male: 7.5 }, // Panama
  PG: { female: 21.1, male: 6.1 }, // Papua New Guinea
  PY: { female: 26.2, male: 7.6 }, // Paraguay
  PE: { female: 28, male: 7.5 }, // Peru
  PH: { female: 65.2, male: 22.8 }, // Philippines
  PN: { female: 5.3, male: 1.5 }, // Pitcairn Islands
  PL: { female: 2.9, male: 0.7 }, // Poland
  PT: { female: 3.7, male: 0.9 }, // Portugal
  PR: { female: 23, male: 6.5 }, // Puerto Rico
  QA: { female: 43.2, male: 13.6 }, // Qatar
  RE: { female: 42.3, male: 13.6 }, // Réunion
  RO: { female: 3.1, male: 0.7 }, // Romania
  RU: { female: 4.6, male: 1 }, // Russia
  RW: { female: 29, male: 7.5 }, // Rwanda
  BL: { female: 41.2, male: 13.2 }, // Saint Barthélemy
  SH: { female: 5.5, male: 1.5 }, // Saint Helena, Ascension and Tristan da Cunha
  KN: { female: 41.8, male: 13.4 }, // Saint Kitts and Nevis
  LC: { female: 41.8, male: 13.4 }, // Saint Lucia
  MF: { female: 41.9, male: 13.5 }, // Saint Martin
  PM: { female: 5.3, male: 1.5 }, // Saint Pierre and Miquelon
  VC: { female: 42.5, male: 13.7 }, // Saint Vincent and the Grenadines
  WS: { female: 21.6, male: 6.3 }, // Samoa
  SM: { female: 3.8, male: 0.9 }, // San Marino
  ST: { female: 56.4, male: 19.6 }, // São Tomé and Príncipe
  SA: { female: 46.5, male: 14.5 }, // Saudi Arabia
  SN: { female: 67, male: 18.5 }, // Senegal
  RS: { female: 4.5, male: 1 }, // Serbia
  SC: { female: 38.3, male: 11.6 }, // Seychelles
  SL: { female: 56.3, male: 19.6 }, // Sierra Leone
  SG: { female: 42, male: 15.5 }, // Singapore
  SX: { female: 42.4, male: 13.7 }, // Sint Maarten
  SK: { female: 3.1, male: 0.7 }, // Slovakia
  SI: { female: 3.1, male: 0.7 }, // Slovenia
  SB: { female: 21.3, male: 6.1 }, // Solomon Islands
  SO: { female: 46, male: 11.5 }, // Somalia
  ZA: { female: 35, male: 11.5 }, // South Africa
  KR: { female: 60.5, male: 26.8 }, // South Korea
  SS: { female: 38.4, male: 11.6 }, // South Sudan
  ES: { female: 3.4, male: 0.8 }, // Spain
  LK: { female: 50.4, male: 17.5 }, // Sri Lanka
  SD: { female: 56, male: 15.5 }, // Sudan
  SR: { female: 42.4, male: 13.6 }, // Suriname
  SJ: { female: 2.1, male: 0.5 }, // Svalbard and Jan Mayen
  SE: { female: 1.7, male: 0.4 }, // Sweden
  CH: { female: 1.7, male: 0.3 }, // Switzerland
  SY: { female: 43.4, male: 13.7 }, // Syria
  TW: { female: 53, male: 18.5 }, // Taiwan
  TJ: { female: 18.9, male: 4.7 }, // Tajikistan
  TZ: { female: 38, male: 11 }, // Tanzania
  TH: { female: 68.5, male: 25.4 }, // Thailand
  TL: { female: 35, male: 10 }, // Timor-Leste
  TG: { female: 59, male: 17.5 }, // Togo
  TK: { female: 21.4, male: 6.2 }, // Tokelau
  TO: { female: 21.4, male: 6.2 }, // Tonga
  TT: { female: 42.4, male: 13.7 }, // Trinidad and Tobago
  TN: { female: 41.4, male: 11.7 }, // Tunisia
  TR: { female: 14.5, male: 3.8 }, // Türkiye
  TM: { female: 18.9, male: 4.7 }, // Turkmenistan
  TC: { female: 42.4, male: 13.7 }, // Turks and Caicos Islands
  TV: { female: 21.4, male: 6.2 }, // Tuvalu
  UG: { female: 39, male: 11.5 }, // Uganda
  UA: { female: 4.6, male: 1.1 }, // Ukraine
  AE: { female: 45, male: 15.5 }, // United Arab Emirates
  GB: { female: 3.8, male: 1 }, // United Kingdom
  US: { female: 6.8, male: 1.9 }, // United States
  UM: { female: 5.7, male: 1.6 }, // United States Minor Outlying Islands
  VI: { female: 42.5, male: 13.7 }, // United States Virgin Islands
  UY: { female: 9, male: 2.2 }, // Uruguay
  UZ: { female: 19, male: 4.7 }, // Uzbekistan
  VU: { female: 21.6, male: 6.2 }, // Vanuatu
  VA: { female: 4, male: 1 }, // Vatican City
  VE: { female: 27.5, male: 7.8 }, // Venezuela
  VN: { female: 59, male: 18.5 }, // Vietnam
  WF: { female: 21.6, male: 6.2 }, // Wallis and Futuna
  EH: { female: 40.4, male: 11.2 }, // Western Sahara
  YE: { female: 43.7, male: 13.8 }, // Yemen
  ZM: { female: 36.8, male: 11.3 }, // Zambia
  ZW: { female: 36.8, male: 11.3 }, // Zimbabwe
};

export const colorismDetailsByCountry: Record<string, ColorismDetail> = {
  AF: { A: 0.95, P: 0.95, M: 0.95, T: 0.02, colorismIndex: 76, femaleWhiteningRate: 28, maleWhiteningRate: 7.5 },
  AX: { A: 0.05, P: 0.05, M: 0.05, T: 0.9, colorismIndex: 12.6, femaleWhiteningRate: 1, maleWhiteningRate: 0.2 },
  AL: { A: 0.22, P: 0.15, M: 0.2, T: 0.55, colorismIndex: 25.1, femaleWhiteningRate: 3.3, maleWhiteningRate: 0.5 },
  DZ: { A: 0.75, P: 0.75, M: 0.78, T: 0.12, colorismIndex: 73.9, femaleWhiteningRate: 40.4, maleWhiteningRate: 11.2 },
  AS: { A: 0.55, P: 0.6, M: 0.52, T: 0.2, colorismIndex: 55.6, femaleWhiteningRate: 20.1, maleWhiteningRate: 5.6 },
  AD: { A: 0.15, P: 0.15, M: 0.15, T: 0.75, colorismIndex: 20.5, femaleWhiteningRate: 2.6, maleWhiteningRate: 0.4 },
  AO: { A: 0.55, P: 0.85, M: 0.76, T: 0.08, colorismIndex: 70.6, femaleWhiteningRate: 35.1, maleWhiteningRate: 10.6 },
  AI: { A: 0.65, P: 0.9, M: 0.82, T: 0.15, colorismIndex: 75.5, femaleWhiteningRate: 41.1, maleWhiteningRate: 13.1 },
  AG: { A: 0.65, P: 0.9, M: 0.82, T: 0.15, colorismIndex: 75.5, femaleWhiteningRate: 41.1, maleWhiteningRate: 13.1 },
  AR: { A: 0.4, P: 0.65, M: 0.5, T: 0.55, colorismIndex: 46, femaleWhiteningRate: 10.2, maleWhiteningRate: 2.5 },
  AM: { A: 0.45, P: 0.3, M: 0.4, T: 0.3, colorismIndex: 44.6, femaleWhiteningRate: 10.6, maleWhiteningRate: 2.1 },
  AW: { A: 0.65, P: 0.9, M: 0.82, T: 0.15, colorismIndex: 75.6, femaleWhiteningRate: 41.2, maleWhiteningRate: 13.1 },
  AU: { A: 0.1, P: 0.25, M: 0.15, T: 0.88, colorismIndex: 21, femaleWhiteningRate: 4.5, maleWhiteningRate: 1.2 },
  AT: { A: 0.08, P: 0.1, M: 0.08, T: 0.85, colorismIndex: 15.1, femaleWhiteningRate: 1.5, maleWhiteningRate: 0.2 },
  AZ: { A: 0.45, P: 0.3, M: 0.4, T: 0.3, colorismIndex: 44.6, femaleWhiteningRate: 10.7, maleWhiteningRate: 2.2 },
  BS: { A: 0.65, P: 0.9, M: 0.82, T: 0.15, colorismIndex: 75.7, femaleWhiteningRate: 41.2, maleWhiteningRate: 13.2 },
  BH: { A: 0.78, P: 0.7, M: 0.8, T: 0.1, colorismIndex: 74.6, femaleWhiteningRate: 42.2, maleWhiteningRate: 13.2 },
  BD: { A: 0.95, P: 0.95, M: 0.95, T: 0.02, colorismIndex: 90.2, femaleWhiteningRate: 57.8, maleWhiteningRate: 21 },
  BB: { A: 0.65, P: 0.9, M: 0.82, T: 0.15, colorismIndex: 75.6, femaleWhiteningRate: 41.2, maleWhiteningRate: 13.2 },
  BY: { A: 0.22, P: 0.15, M: 0.2, T: 0.55, colorismIndex: 25.2, femaleWhiteningRate: 3.4, maleWhiteningRate: 0.6 },
  BE: { A: 0.08, P: 0.1, M: 0.08, T: 0.85, colorismIndex: 15.1, femaleWhiteningRate: 1.6, maleWhiteningRate: 0.3 },
  BZ: { A: 0.65, P: 0.9, M: 0.82, T: 0.15, colorismIndex: 75.7, femaleWhiteningRate: 41.2, maleWhiteningRate: 13.2 },
  BJ: { A: 0.65, P: 0.9, M: 0.88, T: 0.02, colorismIndex: 79.7, femaleWhiteningRate: 55.2, maleWhiteningRate: 19.2 },
  BM: { A: 0.1, P: 0.25, M: 0.15, T: 0.82, colorismIndex: 22.7, femaleWhiteningRate: 4.4, maleWhiteningRate: 1.1 },
  BT: { A: 0.95, P: 0.95, M: 0.95, T: 0.02, colorismIndex: 74, femaleWhiteningRate: 34, maleWhiteningRate: 10.5 },
  BO: { A: 0.65, P: 0.88, M: 0.75, T: 0.25, colorismIndex: 69.7, femaleWhiteningRate: 25.2, maleWhiteningRate: 7.2 },
  BA: { A: 0.22, P: 0.15, M: 0.2, T: 0.55, colorismIndex: 25.1, femaleWhiteningRate: 3.4, maleWhiteningRate: 0.6 },
  BW: { A: 0.55, P: 0.85, M: 0.76, T: 0.08, colorismIndex: 70.7, femaleWhiteningRate: 35.2, maleWhiteningRate: 10.7 },
  BR: { A: 0.65, P: 0.88, M: 0.75, T: 0.4, colorismIndex: 70.5, femaleWhiteningRate: 24, maleWhiteningRate: 7 },
  IO: { A: 0.1, P: 0.25, M: 0.15, T: 0.82, colorismIndex: 23.5, femaleWhiteningRate: 4.9, maleWhiteningRate: 1.3 },
  VG: { A: 0.65, P: 0.9, M: 0.82, T: 0.15, colorismIndex: 77.9, femaleWhiteningRate: 42.5, maleWhiteningRate: 13.7 },
  BN: { A: 0.95, P: 0.85, M: 0.95, T: 0.04, colorismIndex: 78, femaleWhiteningRate: 44, maleWhiteningRate: 14.5 },
  BG: { A: 0.15, P: 0.1, M: 0.12, T: 0.65, colorismIndex: 19.6, femaleWhiteningRate: 2, maleWhiteningRate: 0.3 },
  BF: { A: 0.65, P: 0.9, M: 0.88, T: 0.02, colorismIndex: 79.6, femaleWhiteningRate: 55.2, maleWhiteningRate: 19.2 },
  BI: { A: 0.65, P: 0.8, M: 0.75, T: 0.03, colorismIndex: 71.7, femaleWhiteningRate: 37.2, maleWhiteningRate: 11.2 },
  KH: { A: 0.95, P: 0.85, M: 0.95, T: 0.04, colorismIndex: 87.5, femaleWhiteningRate: 57.5, maleWhiteningRate: 18 },
  CM: { A: 0.65, P: 0.9, M: 0.88, T: 0.02, colorismIndex: 79, femaleWhiteningRate: 52, maleWhiteningRate: 16.5 },
  CA: { A: 0.1, P: 0.25, M: 0.15, T: 0.82, colorismIndex: 26.5, femaleWhiteningRate: 5.8, maleWhiteningRate: 1.6 },
  CV: { A: 0.55, P: 0.85, M: 0.76, T: 0.08, colorismIndex: 70.8, femaleWhiteningRate: 35.3, maleWhiteningRate: 10.7 },
  BQ: { A: 0.65, P: 0.9, M: 0.82, T: 0.15, colorismIndex: 75.7, femaleWhiteningRate: 41.2, maleWhiteningRate: 13.2 },
  KY: { A: 0.65, P: 0.9, M: 0.82, T: 0.15, colorismIndex: 76.7, femaleWhiteningRate: 41.8, maleWhiteningRate: 13.4 },
  CF: { A: 0.65, P: 0.9, M: 0.88, T: 0.02, colorismIndex: 79.8, femaleWhiteningRate: 55.3, maleWhiteningRate: 19.2 },
  TD: { A: 0.65, P: 0.9, M: 0.88, T: 0.02, colorismIndex: 81.6, femaleWhiteningRate: 56.4, maleWhiteningRate: 19.7 },
  CL: { A: 0.4, P: 0.65, M: 0.5, T: 0.55, colorismIndex: 55, femaleWhiteningRate: 14.5, maleWhiteningRate: 3.8 },
  CN: { A: 0.96, P: 0.4, M: 0.94, T: 0.08, colorismIndex: 85.2, femaleWhiteningRate: 55.4, maleWhiteningRate: 18.2 },
  CX: { A: 0.1, P: 0.25, M: 0.15, T: 0.82, colorismIndex: 22.8, femaleWhiteningRate: 4.5, maleWhiteningRate: 1.1 },
  CC: { A: 0.1, P: 0.25, M: 0.15, T: 0.82, colorismIndex: 22.7, femaleWhiteningRate: 4.4, maleWhiteningRate: 1.1 },
  CO: { A: 0.65, P: 0.88, M: 0.75, T: 0.25, colorismIndex: 74.5, femaleWhiteningRate: 28.5, maleWhiteningRate: 8.2 },
  KM: { A: 0.65, P: 0.8, M: 0.75, T: 0.03, colorismIndex: 72.7, femaleWhiteningRate: 37.8, maleWhiteningRate: 11.4 },
  CG: { A: 0.65, P: 0.9, M: 0.88, T: 0.02, colorismIndex: 82, femaleWhiteningRate: 64, maleWhiteningRate: 21 },
  CK: { A: 0.55, P: 0.6, M: 0.52, T: 0.2, colorismIndex: 55.8, femaleWhiteningRate: 20.3, maleWhiteningRate: 5.7 },
  CR: { A: 0.65, P: 0.88, M: 0.75, T: 0.25, colorismIndex: 69.8, femaleWhiteningRate: 25.3, maleWhiteningRate: 7.2 },
  HR: { A: 0.15, P: 0.1, M: 0.12, T: 0.65, colorismIndex: 20.4, femaleWhiteningRate: 2.4, maleWhiteningRate: 0.4 },
  CU: { A: 0.65, P: 0.9, M: 0.82, T: 0.15, colorismIndex: 68, femaleWhiteningRate: 22, maleWhiteningRate: 6 },
  CW: { A: 0.65, P: 0.9, M: 0.82, T: 0.15, colorismIndex: 75.8, femaleWhiteningRate: 41.3, maleWhiteningRate: 13.2 },
  CY: { A: 0.15, P: 0.15, M: 0.15, T: 0.75, colorismIndex: 20.8, femaleWhiteningRate: 2.8, maleWhiteningRate: 0.5 },
  CZ: { A: 0.15, P: 0.1, M: 0.12, T: 0.65, colorismIndex: 19.8, femaleWhiteningRate: 2.1, maleWhiteningRate: 0.3 },
  DK: { A: 0.05, P: 0.05, M: 0.05, T: 0.91, colorismIndex: 14, femaleWhiteningRate: 1.7, maleWhiteningRate: 0.4 },
  DJ: { A: 0.65, P: 0.8, M: 0.75, T: 0.03, colorismIndex: 71.9, femaleWhiteningRate: 37.3, maleWhiteningRate: 11.2 },
  DM: { A: 0.65, P: 0.9, M: 0.82, T: 0.15, colorismIndex: 75.9, femaleWhiteningRate: 41.3, maleWhiteningRate: 13.2 },
  DO: { A: 0.65, P: 0.95, M: 0.88, T: 0.15, colorismIndex: 83.5, femaleWhiteningRate: 47.5, maleWhiteningRate: 16.2 },
  CD: { A: 0.65, P: 0.9, M: 0.88, T: 0.02, colorismIndex: 81.5, femaleWhiteningRate: 62, maleWhiteningRate: 20.5 },
  EC: { A: 0.65, P: 0.88, M: 0.75, T: 0.25, colorismIndex: 72.5, femaleWhiteningRate: 26.5, maleWhiteningRate: 7.2 },
  EG: { A: 0.75, P: 0.75, M: 0.78, T: 0.12, colorismIndex: 77.5, femaleWhiteningRate: 44, maleWhiteningRate: 12.8 },
  SV: { A: 0.65, P: 0.88, M: 0.75, T: 0.25, colorismIndex: 71.6, femaleWhiteningRate: 26.4, maleWhiteningRate: 7.7 },
  GQ: { A: 0.65, P: 0.9, M: 0.88, T: 0.02, colorismIndex: 80.2, femaleWhiteningRate: 55.5, maleWhiteningRate: 19.3 },
  ER: { A: 0.65, P: 0.8, M: 0.75, T: 0.03, colorismIndex: 72, femaleWhiteningRate: 37.4, maleWhiteningRate: 11.3 },
  EE: { A: 0.05, P: 0.05, M: 0.05, T: 0.9, colorismIndex: 13, femaleWhiteningRate: 1.2, maleWhiteningRate: 0.2 },
  SZ: { A: 0.55, P: 0.85, M: 0.76, T: 0.08, colorismIndex: 72.6, femaleWhiteningRate: 36.4, maleWhiteningRate: 11.2 },
  ET: { A: 0.65, P: 0.8, M: 0.75, T: 0.03, colorismIndex: 76, femaleWhiteningRate: 41, maleWhiteningRate: 11 },
  FK: { A: 0.1, P: 0.25, M: 0.15, T: 0.82, colorismIndex: 23.1, femaleWhiteningRate: 4.7, maleWhiteningRate: 1.2 },
  FO: { A: 0.05, P: 0.05, M: 0.05, T: 0.9, colorismIndex: 13.1, femaleWhiteningRate: 1.3, maleWhiteningRate: 0.2 },
  FJ: { A: 0.55, P: 0.6, M: 0.52, T: 0.2, colorismIndex: 56.1, femaleWhiteningRate: 20.5, maleWhiteningRate: 5.8 },
  FI: { A: 0.05, P: 0.05, M: 0.05, T: 0.88, colorismIndex: 14.5, femaleWhiteningRate: 1.8, maleWhiteningRate: 0.4 },
  FR: { A: 0.15, P: 0.15, M: 0.15, T: 0.78, colorismIndex: 24.5, femaleWhiteningRate: 4.8, maleWhiteningRate: 1.3 },
  GF: { A: 0.65, P: 0.9, M: 0.82, T: 0.15, colorismIndex: 76.2, femaleWhiteningRate: 41.5, maleWhiteningRate: 13.3 },
  PF: { A: 0.55, P: 0.6, M: 0.52, T: 0.2, colorismIndex: 57.2, femaleWhiteningRate: 21.1, maleWhiteningRate: 6.1 },
  GA: { A: 0.65, P: 0.9, M: 0.88, T: 0.02, colorismIndex: 78.5, femaleWhiteningRate: 51, maleWhiteningRate: 16 },
  GM: { A: 0.65, P: 0.9, M: 0.88, T: 0.02, colorismIndex: 80.2, femaleWhiteningRate: 55.5, maleWhiteningRate: 19.3 },
  GE: { A: 0.45, P: 0.3, M: 0.4, T: 0.3, colorismIndex: 45.2, femaleWhiteningRate: 11, maleWhiteningRate: 2.3 },
  DE: { A: 0.08, P: 0.1, M: 0.08, T: 0.86, colorismIndex: 16.5, femaleWhiteningRate: 2.2, maleWhiteningRate: 0.5 },
  GH: { A: 0.65, P: 0.9, M: 0.88, T: 0.02, colorismIndex: 80.5, femaleWhiteningRate: 54, maleWhiteningRate: 18 },
  GI: { A: 0.1, P: 0.25, M: 0.15, T: 0.82, colorismIndex: 23.2, femaleWhiteningRate: 4.7, maleWhiteningRate: 1.2 },
  GR: { A: 0.15, P: 0.15, M: 0.15, T: 0.75, colorismIndex: 21.2, femaleWhiteningRate: 3, maleWhiteningRate: 0.6 },
  GL: { A: 0.05, P: 0.05, M: 0.05, T: 0.9, colorismIndex: 13.2, femaleWhiteningRate: 1.3, maleWhiteningRate: 0.2 },
  GD: { A: 0.65, P: 0.9, M: 0.82, T: 0.15, colorismIndex: 76.2, femaleWhiteningRate: 41.5, maleWhiteningRate: 13.3 },
  GP: { A: 0.65, P: 0.9, M: 0.82, T: 0.15, colorismIndex: 76.2, femaleWhiteningRate: 41.5, maleWhiteningRate: 13.3 },
  GU: { A: 0.55, P: 0.6, M: 0.52, T: 0.2, colorismIndex: 56.3, femaleWhiteningRate: 20.6, maleWhiteningRate: 5.8 },
  GT: { A: 0.65, P: 0.88, M: 0.75, T: 0.25, colorismIndex: 70.3, femaleWhiteningRate: 25.6, maleWhiteningRate: 7.3 },
  GG: { A: 0.08, P: 0.1, M: 0.08, T: 0.85, colorismIndex: 15.7, femaleWhiteningRate: 1.9, maleWhiteningRate: 0.4 },
  GN: { A: 0.65, P: 0.9, M: 0.88, T: 0.02, colorismIndex: 80.2, femaleWhiteningRate: 55.5, maleWhiteningRate: 19.3 },
  GW: { A: 0.65, P: 0.9, M: 0.88, T: 0.02, colorismIndex: 80.3, femaleWhiteningRate: 55.6, maleWhiteningRate: 19.3 },
  GY: { A: 0.65, P: 0.9, M: 0.82, T: 0.15, colorismIndex: 76.3, femaleWhiteningRate: 41.6, maleWhiteningRate: 13.3 },
  HT: { A: 0.65, P: 0.9, M: 0.82, T: 0.15, colorismIndex: 80, femaleWhiteningRate: 46, maleWhiteningRate: 14 },
  HN: { A: 0.65, P: 0.88, M: 0.75, T: 0.25, colorismIndex: 70.3, femaleWhiteningRate: 25.6, maleWhiteningRate: 7.3 },
  HK: { A: 0.95, P: 0.4, M: 0.9, T: 0.16, colorismIndex: 79, femaleWhiteningRate: 47, maleWhiteningRate: 16 },
  HU: { A: 0.15, P: 0.1, M: 0.12, T: 0.65, colorismIndex: 20.4, femaleWhiteningRate: 2.4, maleWhiteningRate: 0.4 },
  IS: { A: 0.05, P: 0.05, M: 0.05, T: 0.9, colorismIndex: 13.5, femaleWhiteningRate: 1.5, maleWhiteningRate: 0.3 },
  IN: { A: 0.98, P: 0.98, M: 0.98, T: 0.02, colorismIndex: 94, femaleWhiteningRate: 61.2, maleWhiteningRate: 24.8 },
  ID: { A: 0.95, P: 0.9, M: 0.95, T: 0.04, colorismIndex: 89.5, femaleWhiteningRate: 58.4, maleWhiteningRate: 20.2 },
  IR: { A: 0.55, P: 0.45, M: 0.55, T: 0.35, colorismIndex: 62, femaleWhiteningRate: 26, maleWhiteningRate: 7.5 },
  IQ: { A: 0.78, P: 0.7, M: 0.8, T: 0.1, colorismIndex: 75.5, femaleWhiteningRate: 42.7, maleWhiteningRate: 13.4 },
  IE: { A: 0.08, P: 0.1, M: 0.08, T: 0.9, colorismIndex: 16, femaleWhiteningRate: 2.2, maleWhiteningRate: 0.5 },
  IM: { A: 0.08, P: 0.1, M: 0.08, T: 0.85, colorismIndex: 15.9, femaleWhiteningRate: 2.1, maleWhiteningRate: 0.5 },
  IL: { A: 0.78, P: 0.7, M: 0.8, T: 0.55, colorismIndex: 42, femaleWhiteningRate: 12, maleWhiteningRate: 3 },
  IT: { A: 0.15, P: 0.15, M: 0.15, T: 0.8, colorismIndex: 22.5, femaleWhiteningRate: 3.6, maleWhiteningRate: 0.9 },
  CI: { A: 0.65, P: 0.9, M: 0.88, T: 0.02, colorismIndex: 82, femaleWhiteningRate: 60, maleWhiteningRate: 19 },
  JM: { A: 0.65, P: 0.92, M: 0.86, T: 0.15, colorismIndex: 79.5, femaleWhiteningRate: 45, maleWhiteningRate: 14.8 },
  JP: { A: 0.95, P: 0.4, M: 0.9, T: 0.14, colorismIndex: 80.4, femaleWhiteningRate: 48.5, maleWhiteningRate: 15.2 },
  JE: { A: 0.08, P: 0.1, M: 0.08, T: 0.85, colorismIndex: 16, femaleWhiteningRate: 2.1, maleWhiteningRate: 0.5 },
  JO: { A: 0.78, P: 0.7, M: 0.8, T: 0.1, colorismIndex: 75.5, femaleWhiteningRate: 43, maleWhiteningRate: 12.5 },
  KZ: { A: 0.6, P: 0.35, M: 0.5, T: 0.2, colorismIndex: 55.7, femaleWhiteningRate: 18.3, maleWhiteningRate: 4.4 },
  KE: { A: 0.65, P: 0.8, M: 0.75, T: 0.03, colorismIndex: 75, femaleWhiteningRate: 40.5, maleWhiteningRate: 12.5 },
  KI: { A: 0.55, P: 0.6, M: 0.52, T: 0.2, colorismIndex: 56.7, femaleWhiteningRate: 20.8, maleWhiteningRate: 5.9 },
  XK: { A: 0.22, P: 0.15, M: 0.2, T: 0.55, colorismIndex: 27.6, femaleWhiteningRate: 4.9, maleWhiteningRate: 1.2 },
  KW: { A: 0.78, P: 0.7, M: 0.8, T: 0.1, colorismIndex: 77.5, femaleWhiteningRate: 45.5, maleWhiteningRate: 14.8 },
  KG: { A: 0.6, P: 0.35, M: 0.5, T: 0.2, colorismIndex: 55.7, femaleWhiteningRate: 18.3, maleWhiteningRate: 4.4 },
  LA: { A: 0.95, P: 0.85, M: 0.95, T: 0.04, colorismIndex: 85, femaleWhiteningRate: 52, maleWhiteningRate: 16.5 },
  LV: { A: 0.05, P: 0.05, M: 0.05, T: 0.9, colorismIndex: 13.8, femaleWhiteningRate: 1.7, maleWhiteningRate: 0.4 },
  LB: { A: 0.78, P: 0.7, M: 0.8, T: 0.3, colorismIndex: 68, femaleWhiteningRate: 34, maleWhiteningRate: 10.5 },
  LS: { A: 0.55, P: 0.85, M: 0.76, T: 0.08, colorismIndex: 71.8, femaleWhiteningRate: 35.9, maleWhiteningRate: 11 },
  LR: { A: 0.65, P: 0.9, M: 0.88, T: 0.02, colorismIndex: 80.8, femaleWhiteningRate: 55.9, maleWhiteningRate: 19.5 },
  LY: { A: 0.75, P: 0.75, M: 0.78, T: 0.12, colorismIndex: 74.8, femaleWhiteningRate: 40.9, maleWhiteningRate: 11.5 },
  LI: { A: 0.08, P: 0.1, M: 0.08, T: 0.85, colorismIndex: 16.3, femaleWhiteningRate: 2.3, maleWhiteningRate: 0.5 },
  LT: { A: 0.05, P: 0.05, M: 0.05, T: 0.9, colorismIndex: 13.8, femaleWhiteningRate: 1.7, maleWhiteningRate: 0.4 },
  LU: { A: 0.08, P: 0.1, M: 0.08, T: 0.85, colorismIndex: 16.3, femaleWhiteningRate: 2.3, maleWhiteningRate: 0.6 },
  MO: { A: 0.95, P: 0.4, M: 0.9, T: 0.08, colorismIndex: 78.5, femaleWhiteningRate: 46, maleWhiteningRate: 15 },
  MG: { A: 0.65, P: 0.8, M: 0.75, T: 0.03, colorismIndex: 72.9, femaleWhiteningRate: 37.9, maleWhiteningRate: 11.5 },
  MW: { A: 0.55, P: 0.85, M: 0.76, T: 0.08, colorismIndex: 71.9, femaleWhiteningRate: 36, maleWhiteningRate: 11 },
  MY: { A: 0.95, P: 0.85, M: 0.95, T: 0.04, colorismIndex: 82, femaleWhiteningRate: 48.5, maleWhiteningRate: 17 },
  MV: { A: 0.95, P: 0.95, M: 0.95, T: 0.02, colorismIndex: 81, femaleWhiteningRate: 44, maleWhiteningRate: 14 },
  ML: { A: 0.65, P: 0.9, M: 0.88, T: 0.02, colorismIndex: 80.5, femaleWhiteningRate: 61, maleWhiteningRate: 16.5 },
  MT: { A: 0.15, P: 0.15, M: 0.15, T: 0.75, colorismIndex: 21.9, femaleWhiteningRate: 3.5, maleWhiteningRate: 0.8 },
  MH: { A: 0.55, P: 0.6, M: 0.52, T: 0.2, colorismIndex: 56.9, femaleWhiteningRate: 20.9, maleWhiteningRate: 6 },
  MQ: { A: 0.65, P: 0.9, M: 0.82, T: 0.15, colorismIndex: 76.9, femaleWhiteningRate: 41.9, maleWhiteningRate: 13.5 },
  MR: { A: 0.75, P: 0.75, M: 0.78, T: 0.12, colorismIndex: 74.9, femaleWhiteningRate: 40.9, maleWhiteningRate: 11.5 },
  MU: { A: 0.65, P: 0.8, M: 0.75, T: 0.03, colorismIndex: 72.9, femaleWhiteningRate: 38, maleWhiteningRate: 11.5 },
  YT: { A: 0.65, P: 0.9, M: 0.82, T: 0.15, colorismIndex: 78.3, femaleWhiteningRate: 42.8, maleWhiteningRate: 13.8 },
  MX: { A: 0.65, P: 0.92, M: 0.75, T: 0.25, colorismIndex: 73.5, femaleWhiteningRate: 29, maleWhiteningRate: 8.5 },
  FM: { A: 0.55, P: 0.6, M: 0.52, T: 0.2, colorismIndex: 56.1, femaleWhiteningRate: 20.5, maleWhiteningRate: 5.8 },
  MD: { A: 0.22, P: 0.15, M: 0.2, T: 0.55, colorismIndex: 26.4, femaleWhiteningRate: 4.1, maleWhiteningRate: 0.9 },
  MC: { A: 0.15, P: 0.15, M: 0.15, T: 0.75, colorismIndex: 21.9, femaleWhiteningRate: 3.4, maleWhiteningRate: 0.8 },
  MN: { A: 0.95, P: 0.4, M: 0.9, T: 0.08, colorismIndex: 68, femaleWhiteningRate: 31, maleWhiteningRate: 8.5 },
  ME: { A: 0.22, P: 0.15, M: 0.2, T: 0.55, colorismIndex: 26.4, femaleWhiteningRate: 4.1, maleWhiteningRate: 0.9 },
  MS: { A: 0.65, P: 0.9, M: 0.82, T: 0.15, colorismIndex: 76.9, femaleWhiteningRate: 42, maleWhiteningRate: 13.5 },
  MA: { A: 0.75, P: 0.75, M: 0.78, T: 0.12, colorismIndex: 76, femaleWhiteningRate: 42.5, maleWhiteningRate: 11.5 },
  MZ: { A: 0.55, P: 0.85, M: 0.76, T: 0.08, colorismIndex: 71.9, femaleWhiteningRate: 36, maleWhiteningRate: 11 },
  MM: { A: 0.95, P: 0.85, M: 0.95, T: 0.04, colorismIndex: 84.5, femaleWhiteningRate: 51, maleWhiteningRate: 16 },
  NA: { A: 0.55, P: 0.85, M: 0.76, T: 0.08, colorismIndex: 72, femaleWhiteningRate: 36, maleWhiteningRate: 11 },
  NR: { A: 0.55, P: 0.6, M: 0.52, T: 0.2, colorismIndex: 57, femaleWhiteningRate: 21, maleWhiteningRate: 6 },
  NP: { A: 0.95, P: 0.95, M: 0.95, T: 0.02, colorismIndex: 84, femaleWhiteningRate: 47, maleWhiteningRate: 16 },
  NL: { A: 0.08, P: 0.1, M: 0.08, T: 0.88, colorismIndex: 16, femaleWhiteningRate: 2.3, maleWhiteningRate: 0.6 },
  NC: { A: 0.55, P: 0.6, M: 0.52, T: 0.2, colorismIndex: 57, femaleWhiteningRate: 21, maleWhiteningRate: 6 },
  NZ: { A: 0.1, P: 0.25, M: 0.15, T: 0.85, colorismIndex: 22, femaleWhiteningRate: 4.6, maleWhiteningRate: 1.2 },
  NI: { A: 0.65, P: 0.88, M: 0.75, T: 0.25, colorismIndex: 71, femaleWhiteningRate: 26, maleWhiteningRate: 7.5 },
  NE: { A: 0.65, P: 0.9, M: 0.88, T: 0.02, colorismIndex: 81, femaleWhiteningRate: 56, maleWhiteningRate: 19.5 },
  NG: { A: 0.65, P: 0.94, M: 0.94, T: 0.02, colorismIndex: 85.5, femaleWhiteningRate: 77, maleWhiteningRate: 28 },
  NU: { A: 0.55, P: 0.6, M: 0.52, T: 0.2, colorismIndex: 57, femaleWhiteningRate: 21, maleWhiteningRate: 6 },
  NF: { A: 0.1, P: 0.25, M: 0.15, T: 0.82, colorismIndex: 24, femaleWhiteningRate: 5.2, maleWhiteningRate: 1.4 },
  KP: { A: 0.95, P: 0.4, M: 0.9, T: 0.08, colorismIndex: 64, femaleWhiteningRate: 18, maleWhiteningRate: 3.5 },
  MK: { A: 0.22, P: 0.15, M: 0.2, T: 0.55, colorismIndex: 26.4, femaleWhiteningRate: 4.1, maleWhiteningRate: 0.9 },
  MP: { A: 0.55, P: 0.6, M: 0.52, T: 0.2, colorismIndex: 56.9, femaleWhiteningRate: 20.9, maleWhiteningRate: 6 },
  NO: { A: 0.05, P: 0.05, M: 0.05, T: 0.92, colorismIndex: 13.5, femaleWhiteningRate: 1.6, maleWhiteningRate: 0.4 },
  OM: { A: 0.78, P: 0.7, M: 0.8, T: 0.1, colorismIndex: 76.1, femaleWhiteningRate: 43.1, maleWhiteningRate: 13.5 },
  PK: { A: 0.96, P: 0.95, M: 0.96, T: 0.02, colorismIndex: 91.8, femaleWhiteningRate: 59.5, maleWhiteningRate: 22.5 },
  PW: { A: 0.55, P: 0.6, M: 0.52, T: 0.2, colorismIndex: 57.3, femaleWhiteningRate: 21.2, maleWhiteningRate: 6.1 },
  PS: { A: 0.78, P: 0.7, M: 0.8, T: 0.1, colorismIndex: 76.3, femaleWhiteningRate: 43.2, maleWhiteningRate: 13.6 },
  PA: { A: 0.65, P: 0.88, M: 0.75, T: 0.25, colorismIndex: 71.2, femaleWhiteningRate: 26.1, maleWhiteningRate: 7.5 },
  PG: { A: 0.55, P: 0.6, M: 0.52, T: 0.2, colorismIndex: 57.2, femaleWhiteningRate: 21.1, maleWhiteningRate: 6.1 },
  PY: { A: 0.65, P: 0.88, M: 0.75, T: 0.25, colorismIndex: 71.3, femaleWhiteningRate: 26.2, maleWhiteningRate: 7.6 },
  PE: { A: 0.65, P: 0.88, M: 0.75, T: 0.25, colorismIndex: 74, femaleWhiteningRate: 28, maleWhiteningRate: 7.5 },
  PH: { A: 0.95, P: 0.95, M: 0.97, T: 0.04, colorismIndex: 91.5, femaleWhiteningRate: 65.2, maleWhiteningRate: 22.8 },
  PN: { A: 0.1, P: 0.25, M: 0.15, T: 0.82, colorismIndex: 24.2, femaleWhiteningRate: 5.3, maleWhiteningRate: 1.5 },
  PL: { A: 0.15, P: 0.1, M: 0.12, T: 0.65, colorismIndex: 21.2, femaleWhiteningRate: 2.9, maleWhiteningRate: 0.7 },
  PT: { A: 0.15, P: 0.15, M: 0.15, T: 0.75, colorismIndex: 22.3, femaleWhiteningRate: 3.7, maleWhiteningRate: 0.9 },
  PR: { A: 0.65, P: 0.9, M: 0.82, T: 0.15, colorismIndex: 67, femaleWhiteningRate: 23, maleWhiteningRate: 6.5 },
  QA: { A: 0.78, P: 0.7, M: 0.8, T: 0.1, colorismIndex: 76.3, femaleWhiteningRate: 43.2, maleWhiteningRate: 13.6 },
  RE: { A: 0.65, P: 0.9, M: 0.82, T: 0.15, colorismIndex: 77.4, femaleWhiteningRate: 42.3, maleWhiteningRate: 13.6 },
  RO: { A: 0.15, P: 0.1, M: 0.12, T: 0.65, colorismIndex: 21.5, femaleWhiteningRate: 3.1, maleWhiteningRate: 0.7 },
  RU: { A: 0.22, P: 0.15, M: 0.2, T: 0.55, colorismIndex: 27.5, femaleWhiteningRate: 4.6, maleWhiteningRate: 1 },
  RW: { A: 0.65, P: 0.8, M: 0.75, T: 0.03, colorismIndex: 68, femaleWhiteningRate: 29, maleWhiteningRate: 7.5 },
  BL: { A: 0.65, P: 0.9, M: 0.82, T: 0.15, colorismIndex: 75.7, femaleWhiteningRate: 41.2, maleWhiteningRate: 13.2 },
  SH: { A: 0.1, P: 0.25, M: 0.15, T: 0.82, colorismIndex: 24.6, femaleWhiteningRate: 5.5, maleWhiteningRate: 1.5 },
  KN: { A: 0.65, P: 0.9, M: 0.82, T: 0.15, colorismIndex: 76.7, femaleWhiteningRate: 41.8, maleWhiteningRate: 13.4 },
  LC: { A: 0.65, P: 0.9, M: 0.82, T: 0.15, colorismIndex: 76.7, femaleWhiteningRate: 41.8, maleWhiteningRate: 13.4 },
  MF: { A: 0.65, P: 0.9, M: 0.82, T: 0.15, colorismIndex: 76.9, femaleWhiteningRate: 41.9, maleWhiteningRate: 13.5 },
  PM: { A: 0.1, P: 0.25, M: 0.15, T: 0.82, colorismIndex: 24.2, femaleWhiteningRate: 5.3, maleWhiteningRate: 1.5 },
  VC: { A: 0.65, P: 0.9, M: 0.82, T: 0.15, colorismIndex: 77.9, femaleWhiteningRate: 42.5, maleWhiteningRate: 13.7 },
  WS: { A: 0.55, P: 0.6, M: 0.52, T: 0.2, colorismIndex: 58, femaleWhiteningRate: 21.6, maleWhiteningRate: 6.3 },
  SM: { A: 0.15, P: 0.15, M: 0.15, T: 0.75, colorismIndex: 22.6, femaleWhiteningRate: 3.8, maleWhiteningRate: 0.9 },
  ST: { A: 0.65, P: 0.9, M: 0.88, T: 0.02, colorismIndex: 81.6, femaleWhiteningRate: 56.4, maleWhiteningRate: 19.6 },
  SA: { A: 0.78, P: 0.7, M: 0.8, T: 0.1, colorismIndex: 78.5, femaleWhiteningRate: 46.5, maleWhiteningRate: 14.5 },
  SN: { A: 0.65, P: 0.9, M: 0.88, T: 0.02, colorismIndex: 83, femaleWhiteningRate: 67, maleWhiteningRate: 18.5 },
  RS: { A: 0.22, P: 0.15, M: 0.2, T: 0.55, colorismIndex: 27, femaleWhiteningRate: 4.5, maleWhiteningRate: 1 },
  SC: { A: 0.65, P: 0.8, M: 0.75, T: 0.03, colorismIndex: 73.5, femaleWhiteningRate: 38.3, maleWhiteningRate: 11.6 },
  SL: { A: 0.65, P: 0.9, M: 0.88, T: 0.02, colorismIndex: 81.6, femaleWhiteningRate: 56.3, maleWhiteningRate: 19.6 },
  SG: { A: 0.95, P: 0.85, M: 0.95, T: 0.15, colorismIndex: 76.5, femaleWhiteningRate: 42, maleWhiteningRate: 15.5 },
  SX: { A: 0.65, P: 0.9, M: 0.82, T: 0.15, colorismIndex: 77.6, femaleWhiteningRate: 42.4, maleWhiteningRate: 13.7 },
  SK: { A: 0.15, P: 0.1, M: 0.12, T: 0.65, colorismIndex: 21.6, femaleWhiteningRate: 3.1, maleWhiteningRate: 0.7 },
  SI: { A: 0.15, P: 0.1, M: 0.12, T: 0.65, colorismIndex: 21.6, femaleWhiteningRate: 3.1, maleWhiteningRate: 0.7 },
  SB: { A: 0.55, P: 0.6, M: 0.52, T: 0.2, colorismIndex: 57.5, femaleWhiteningRate: 21.3, maleWhiteningRate: 6.1 },
  SO: { A: 0.65, P: 0.8, M: 0.75, T: 0.03, colorismIndex: 79, femaleWhiteningRate: 46, maleWhiteningRate: 11.5 },
  ZA: { A: 0.55, P: 0.92, M: 0.76, T: 0.08, colorismIndex: 74.5, femaleWhiteningRate: 35, maleWhiteningRate: 11.5 },
  KR: { A: 0.97, P: 0.4, M: 0.98, T: 0.08, colorismIndex: 86.8, femaleWhiteningRate: 60.5, maleWhiteningRate: 26.8 },
  SS: { A: 0.65, P: 0.8, M: 0.75, T: 0.03, colorismIndex: 73.6, femaleWhiteningRate: 38.4, maleWhiteningRate: 11.6 },
  ES: { A: 0.15, P: 0.15, M: 0.15, T: 0.8, colorismIndex: 21.5, femaleWhiteningRate: 3.4, maleWhiteningRate: 0.8 },
  LK: { A: 0.95, P: 0.95, M: 0.95, T: 0.02, colorismIndex: 85.5, femaleWhiteningRate: 50.4, maleWhiteningRate: 17.5 },
  SD: { A: 0.75, P: 0.75, M: 0.78, T: 0.12, colorismIndex: 84.5, femaleWhiteningRate: 56, maleWhiteningRate: 15.5 },
  SR: { A: 0.65, P: 0.9, M: 0.82, T: 0.15, colorismIndex: 77.6, femaleWhiteningRate: 42.4, maleWhiteningRate: 13.6 },
  SJ: { A: 0.05, P: 0.05, M: 0.05, T: 0.9, colorismIndex: 14.6, femaleWhiteningRate: 2.1, maleWhiteningRate: 0.5 },
  SE: { A: 0.05, P: 0.05, M: 0.05, T: 0.92, colorismIndex: 13.5, femaleWhiteningRate: 1.7, maleWhiteningRate: 0.4 },
  CH: { A: 0.08, P: 0.1, M: 0.08, T: 0.85, colorismIndex: 15.3, femaleWhiteningRate: 1.7, maleWhiteningRate: 0.3 },
  SY: { A: 0.78, P: 0.7, M: 0.8, T: 0.1, colorismIndex: 76.6, femaleWhiteningRate: 43.4, maleWhiteningRate: 13.7 },
  TW: { A: 0.95, P: 0.4, M: 0.9, T: 0.08, colorismIndex: 82.5, femaleWhiteningRate: 53, maleWhiteningRate: 18.5 },
  TJ: { A: 0.6, P: 0.35, M: 0.5, T: 0.2, colorismIndex: 56.7, femaleWhiteningRate: 18.9, maleWhiteningRate: 4.7 },
  TZ: { A: 0.65, P: 0.8, M: 0.75, T: 0.03, colorismIndex: 73.5, femaleWhiteningRate: 38, maleWhiteningRate: 11 },
  TH: { A: 0.98, P: 0.85, M: 0.98, T: 0.04, colorismIndex: 92.5, femaleWhiteningRate: 68.5, maleWhiteningRate: 25.4 },
  TL: { A: 0.95, P: 0.85, M: 0.95, T: 0.04, colorismIndex: 74, femaleWhiteningRate: 35, maleWhiteningRate: 10 },
  TG: { A: 0.65, P: 0.9, M: 0.88, T: 0.02, colorismIndex: 81.5, femaleWhiteningRate: 59, maleWhiteningRate: 17.5 },
  TK: { A: 0.55, P: 0.6, M: 0.52, T: 0.2, colorismIndex: 57.7, femaleWhiteningRate: 21.4, maleWhiteningRate: 6.2 },
  TO: { A: 0.55, P: 0.6, M: 0.52, T: 0.2, colorismIndex: 57.7, femaleWhiteningRate: 21.4, maleWhiteningRate: 6.2 },
  TT: { A: 0.65, P: 0.9, M: 0.82, T: 0.15, colorismIndex: 77.7, femaleWhiteningRate: 42.4, maleWhiteningRate: 13.7 },
  TN: { A: 0.75, P: 0.75, M: 0.78, T: 0.12, colorismIndex: 75.7, femaleWhiteningRate: 41.4, maleWhiteningRate: 11.7 },
  TR: { A: 0.55, P: 0.45, M: 0.55, T: 0.45, colorismIndex: 48.5, femaleWhiteningRate: 14.5, maleWhiteningRate: 3.8 },
  TM: { A: 0.6, P: 0.35, M: 0.5, T: 0.2, colorismIndex: 56.7, femaleWhiteningRate: 18.9, maleWhiteningRate: 4.7 },
  TC: { A: 0.65, P: 0.9, M: 0.82, T: 0.15, colorismIndex: 77.6, femaleWhiteningRate: 42.4, maleWhiteningRate: 13.7 },
  TV: { A: 0.55, P: 0.6, M: 0.52, T: 0.2, colorismIndex: 57.7, femaleWhiteningRate: 21.4, maleWhiteningRate: 6.2 },
  UG: { A: 0.65, P: 0.8, M: 0.75, T: 0.03, colorismIndex: 74, femaleWhiteningRate: 39, maleWhiteningRate: 11.5 },
  UA: { A: 0.22, P: 0.15, M: 0.2, T: 0.55, colorismIndex: 27.2, femaleWhiteningRate: 4.6, maleWhiteningRate: 1.1 },
  AE: { A: 0.78, P: 0.7, M: 0.8, T: 0.1, colorismIndex: 77, femaleWhiteningRate: 45, maleWhiteningRate: 15.5 },
  GB: { A: 0.08, P: 0.1, M: 0.08, T: 0.86, colorismIndex: 19.5, femaleWhiteningRate: 3.8, maleWhiteningRate: 1 },
  US: { A: 0.1, P: 0.25, M: 0.15, T: 0.82, colorismIndex: 30, femaleWhiteningRate: 6.8, maleWhiteningRate: 1.9 },
  UM: { A: 0.1, P: 0.25, M: 0.15, T: 0.82, colorismIndex: 24.8, femaleWhiteningRate: 5.7, maleWhiteningRate: 1.6 },
  VI: { A: 0.65, P: 0.9, M: 0.82, T: 0.15, colorismIndex: 77.9, femaleWhiteningRate: 42.5, maleWhiteningRate: 13.7 },
  UY: { A: 0.4, P: 0.65, M: 0.5, T: 0.55, colorismIndex: 43, femaleWhiteningRate: 9, maleWhiteningRate: 2.2 },
  UZ: { A: 0.6, P: 0.35, M: 0.5, T: 0.2, colorismIndex: 56.8, femaleWhiteningRate: 19, maleWhiteningRate: 4.7 },
  VU: { A: 0.55, P: 0.6, M: 0.52, T: 0.2, colorismIndex: 57.9, femaleWhiteningRate: 21.6, maleWhiteningRate: 6.2 },
  VA: { A: 0.15, P: 0.15, M: 0.15, T: 0.75, colorismIndex: 22.9, femaleWhiteningRate: 4, maleWhiteningRate: 1 },
  VE: { A: 0.65, P: 0.88, M: 0.75, T: 0.25, colorismIndex: 73, femaleWhiteningRate: 27.5, maleWhiteningRate: 7.8 },
  VN: { A: 0.96, P: 0.85, M: 0.93, T: 0.04, colorismIndex: 88.5, femaleWhiteningRate: 59, maleWhiteningRate: 18.5 },
  WF: { A: 0.55, P: 0.6, M: 0.52, T: 0.2, colorismIndex: 58, femaleWhiteningRate: 21.6, maleWhiteningRate: 6.2 },
  EH: { A: 0.75, P: 0.75, M: 0.78, T: 0.12, colorismIndex: 74, femaleWhiteningRate: 40.4, maleWhiteningRate: 11.2 },
  YE: { A: 0.78, P: 0.7, M: 0.8, T: 0.1, colorismIndex: 77.2, femaleWhiteningRate: 43.7, maleWhiteningRate: 13.8 },
  ZM: { A: 0.55, P: 0.85, M: 0.76, T: 0.08, colorismIndex: 73.4, femaleWhiteningRate: 36.8, maleWhiteningRate: 11.3 },
  ZW: { A: 0.55, P: 0.85, M: 0.76, T: 0.08, colorismIndex: 73.4, femaleWhiteningRate: 36.8, maleWhiteningRate: 11.3 },
};

export const colorismByUSState: Record<string, { colorismIndex: number; female: number; male: number }> = {
  HI: { colorismIndex: 44.5, female: 14.8, male: 4.5 },
  CA: { colorismIndex: 38.2, female: 10.6, male: 3.2 },
  NY: { colorismIndex: 36.8, female: 9.8, male: 2.9 },
  TX: { colorismIndex: 36.4, female: 9.5, male: 2.8 },
  FL: { colorismIndex: 35.8, female: 9.2, male: 2.7 },
  NJ: { colorismIndex: 35.5, female: 9.4, male: 2.8 },
  LA: { colorismIndex: 35.2, female: 9, male: 2.6 },
  GA: { colorismIndex: 35, female: 9.1, male: 2.6 },
  MS: { colorismIndex: 34.6, female: 8.8, male: 2.5 },
  MD: { colorismIndex: 34.4, female: 8.9, male: 2.5 },
  DC: { colorismIndex: 34.2, female: 8.8, male: 2.6 },
  AL: { colorismIndex: 33.8, female: 8.4, male: 2.3 },
  SC: { colorismIndex: 33.2, female: 8.1, male: 2.2 },
  NC: { colorismIndex: 32.8, female: 7.9, male: 2.2 },
  NV: { colorismIndex: 33.5, female: 8.3, male: 2.4 },
  NM: { colorismIndex: 33.4, female: 8, male: 2.2 },
  AZ: { colorismIndex: 32.5, female: 7.6, male: 2.1 },
  IL: { colorismIndex: 32.4, female: 7.8, male: 2.2 },
  VA: { colorismIndex: 31.8, female: 7.4, male: 2.1 },
  DE: { colorismIndex: 31.2, female: 7.1, male: 2 },
  TN: { colorismIndex: 30.8, female: 6.9, male: 1.9 },
  AR: { colorismIndex: 30.6, female: 6.8, male: 1.9 },
  OK: { colorismIndex: 30.2, female: 6.6, male: 1.8 },
  WA: { colorismIndex: 30.5, female: 7, male: 2 },
  MA: { colorismIndex: 29.8, female: 6.6, male: 1.8 },
  CT: { colorismIndex: 29.5, female: 6.5, male: 1.8 },
  PA: { colorismIndex: 29.2, female: 6.3, male: 1.7 },
  MI: { colorismIndex: 28.8, female: 6.1, male: 1.7 },
  OH: { colorismIndex: 28.4, female: 5.9, male: 1.6 },
  MO: { colorismIndex: 28.5, female: 5.9, male: 1.6 },
  IN: { colorismIndex: 27.8, female: 5.6, male: 1.5 },
  KY: { colorismIndex: 27.5, female: 5.4, male: 1.4 },
  RI: { colorismIndex: 29, female: 6.2, male: 1.7 },
  CO: { colorismIndex: 26.8, female: 5.3, male: 1.4 },
  OR: { colorismIndex: 26.5, female: 5.2, male: 1.4 },
  KS: { colorismIndex: 27, female: 5.3, male: 1.4 },
  NE: { colorismIndex: 26.2, female: 5, male: 1.3 },
  MN: { colorismIndex: 25.8, female: 4.9, male: 1.3 },
  WI: { colorismIndex: 25.4, female: 4.7, male: 1.2 },
  IA: { colorismIndex: 24.8, female: 4.5, male: 1.1 },
  AK: { colorismIndex: 26, female: 5, male: 1.3 },
  UT: { colorismIndex: 24.5, female: 4.4, male: 1.1 },
  WV: { colorismIndex: 25, female: 4.5, male: 1.1 },
  ID: { colorismIndex: 23.8, female: 4.1, male: 1 },
  SD: { colorismIndex: 23.5, female: 4, male: 1 },
  ND: { colorismIndex: 23.2, female: 3.9, male: 0.9 },
  MT: { colorismIndex: 22.8, female: 3.8, male: 0.9 },
  WY: { colorismIndex: 22.6, female: 3.7, male: 0.9 },
  NH: { colorismIndex: 22.4, female: 3.6, male: 0.9 },
  ME: { colorismIndex: 22, female: 3.5, male: 0.8 },
  VT: { colorismIndex: 21.8, female: 3.4, male: 0.8 },
};

export function getColorismIndex(code: string, isUSState = false): number | null {
  if (!code) return null;
  const upper = code.toUpperCase();
  if (isUSState) {
    return colorismByUSState[upper]?.colorismIndex ?? 30.0;
  }
  return colorismIndexByCountry[upper] ?? colorismByUSState[upper]?.colorismIndex ?? null;
}

export function getSkinWhiteningRate(
  code: string,
  sex: "male" | "female",
  isUSState = false,
): number | null {
  if (!code) return null;
  const upper = code.toUpperCase();
  if (isUSState) {
    return colorismByUSState[upper]?.[sex] ?? (sex === "female" ? 6.8 : 1.9);
  }
  if (upper in skinWhiteningRateByCountry) {
    return skinWhiteningRateByCountry[upper][sex];
  }
  if (upper in colorismByUSState) {
    return colorismByUSState[upper][sex];
  }
  return null;
}
