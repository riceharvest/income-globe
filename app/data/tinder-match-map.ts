// Tinder Right-Swipe Match Rate (%) — Hardened 2026 Standard-Tier Funnel Model (v3.1)
//
// Reference Profile:
//   - White Dutch Male (181 cm, Blue Eyes, Dark Hair, Fit BMI ~22.5, English + Dutch speaker)
//   - Standard/Free Tinder tier (no Platinum/Boosts), ~30% swipe selectivity, metro area
//
// Structural Funnel Equation:
//   M_organic(c) = 100 * A_c * [ q_c + (1 - q_c) * D_c * R_c ]
//   M_raw(c)     = M_organic(c) + B_comm(c)
//
// Calibrated Benchmarks (Organic / Raw incl. prepagos, freelancers & bots):
//   - Netherlands (Home Baseline): 1.3% organic (1.4% raw) — ~77 right-swipes per organic match
//   - Western Europe & US (UK, DE, US, FR, ES, IT, SE): 0.9% – 1.1% organic (~91–111 swipes/match)
//   - Latin America & Caribbean (PE 1.6%, DO 1.5%, BR 1.4%, CO 1.4%, MX 1.4%, AR/CL 0.8%):
//     ~63–125 swipes per organic match (raw in CO/DO is 3.3% due to prepago/freelancer inflation)
//   - Sub-Saharan Hubs (KE 1.7% org / 3.4% raw, GH 1.5%, UG 1.5%, ZA 1.3%)
//   - Southeast Asia Peak (PH 3.1% org / 4.8% raw [~32 swipes/match], ID 2.6% [~38 swipes],
//     TH 2.3% org / 4.5% raw [~43 swipes], VN 2.0% [~50 swipes])
//   - East Asia (TW 1.1%, JP 0.7%, KR 0.6% [~143–167 swipes/match])
//   - South Asia & Gulf (IN 0.2% [~500 swipes], PK 0.1%, AE 0.4% org / 2.2% raw)

export interface TinderMatchBreakdown {
  matchRatePct: number;
  rawMatchRatePct: number;
  swipesPerMatch: number;
  activeOrganicShare: number;
  deliveryProb: number;
  conditionalRightSwipeProb: number;
  localPercentile: number;
}

export const tinderMatchRateByCountry: Record<string, number> = {
  AF: 0.1, // Afghanistan (Raw: 0.1%, ~1 organic match per 1000 right-swipes)
  AX: 0.9, // Åland Islands (Raw: 1.1%, ~1 organic match per 111 right-swipes)
  AL: 0.9, // Albania (Raw: 1.1%, ~1 organic match per 111 right-swipes)
  DZ: 0.3, // Algeria (Raw: 0.6%, ~1 organic match per 333 right-swipes)
  AS: 0.7, // American Samoa (Raw: 1%, ~1 organic match per 143 right-swipes)
  AD: 1, // Andorra (Raw: 1.2%, ~1 organic match per 100 right-swipes)
  AO: 0.6, // Angola (Raw: 1.4%, ~1 organic match per 167 right-swipes)
  AI: 0.9, // Anguilla (Raw: 1.7%, ~1 organic match per 111 right-swipes)
  AG: 0.5, // Antigua and Barbuda (Raw: 1.3%, ~1 organic match per 200 right-swipes)
  AR: 0.8, // Argentina (Raw: 1.1%, ~1 organic match per 125 right-swipes)
  AM: 0.7, // Armenia (Raw: 0.9%, ~1 organic match per 143 right-swipes)
  AW: 0.7, // Aruba (Raw: 1.5%, ~1 organic match per 143 right-swipes)
  AU: 0.8, // Australia (Raw: 1.1%, ~1 organic match per 125 right-swipes)
  AT: 1.1, // Austria (Raw: 1.3%, ~1 organic match per 91 right-swipes)
  AZ: 0.7, // Azerbaijan (Raw: 0.9%, ~1 organic match per 143 right-swipes)
  BS: 0.9, // Bahamas (Raw: 1.7%, ~1 organic match per 111 right-swipes)
  BH: 0.4, // Bahrain (Raw: 0.7%, ~1 organic match per 250 right-swipes)
  BD: 0.2, // Bangladesh (Raw: 0.4%, ~1 organic match per 500 right-swipes)
  BB: 0.7, // Barbados (Raw: 1.5%, ~1 organic match per 143 right-swipes)
  BY: 0.1, // Belarus (Raw: 0.2%, ~1 organic match per 1000 right-swipes)
  BE: 1.2, // Belgium (Raw: 1.4%, ~1 organic match per 83 right-swipes)
  BZ: 0.7, // Belize (Raw: 1.5%, ~1 organic match per 143 right-swipes)
  BJ: 0.4, // Benin (Raw: 1.2%, ~1 organic match per 250 right-swipes)
  BM: 1.3, // Bermuda (Raw: 1.5%, ~1 organic match per 77 right-swipes)
  BT: 0.7, // Bhutan (Raw: 0.9%, ~1 organic match per 143 right-swipes)
  BO: 0.7, // Bolivia (Raw: 1.5%, ~1 organic match per 143 right-swipes)
  BA: 0.8, // Bosnia and Herzegovina (Raw: 1%, ~1 organic match per 125 right-swipes)
  BW: 0.7, // Botswana (Raw: 1.5%, ~1 organic match per 143 right-swipes)
  BR: 1.4, // Brazil (Raw: 2.2%, ~1 organic match per 71 right-swipes)
  IO: 0.7, // British Indian Ocean Territory (Raw: 1.5%, ~1 organic match per 143 right-swipes)
  VG: 0.7, // British Virgin Islands (Raw: 1.5%, ~1 organic match per 143 right-swipes)
  BN: 0.6, // Brunei (Raw: 0.8%, ~1 organic match per 167 right-swipes)
  BG: 0.9, // Bulgaria (Raw: 1.1%, ~1 organic match per 111 right-swipes)
  BF: 0.2, // Burkina Faso (Raw: 1%, ~1 organic match per 500 right-swipes)
  BI: 0.2, // Burundi (Raw: 1%, ~1 organic match per 500 right-swipes)
  KH: 1.9, // Cambodia (Raw: 3.2%, ~1 organic match per 53 right-swipes)
  CM: 0.5, // Cameroon (Raw: 1.3%, ~1 organic match per 200 right-swipes)
  CA: 1.2, // Canada (Raw: 1.4%, ~1 organic match per 83 right-swipes)
  CV: 0.7, // Cape Verde (Raw: 1.5%, ~1 organic match per 143 right-swipes)
  BQ: 0.8, // Caribbean Netherlands (Raw: 1.6%, ~1 organic match per 125 right-swipes)
  KY: 0.9, // Cayman Islands (Raw: 1.7%, ~1 organic match per 111 right-swipes)
  CF: 0.2, // Central African Republic (Raw: 1%, ~1 organic match per 500 right-swipes)
  TD: 0.2, // Chad (Raw: 1%, ~1 organic match per 500 right-swipes)
  CL: 0.8, // Chile (Raw: 1.1%, ~1 organic match per 125 right-swipes)
  CN: 0.1, // China (Raw: 0.6%, ~1 organic match per 1000 right-swipes)
  CX: 0.8, // Christmas Island (Raw: 1.1%, ~1 organic match per 125 right-swipes)
  CC: 0.8, // Cocos (Keeling) Islands (Raw: 1.1%, ~1 organic match per 125 right-swipes)
  CO: 1.4, // Colombia (Raw: 3.3%, ~1 organic match per 71 right-swipes)
  KM: 0.2, // Comoros (Raw: 1%, ~1 organic match per 500 right-swipes)
  CG: 0.5, // Congo (Raw: 1.3%, ~1 organic match per 200 right-swipes)
  CK: 0.7, // Cook Islands (Raw: 1%, ~1 organic match per 143 right-swipes)
  CR: 1.1, // Costa Rica (Raw: 2.1%, ~1 organic match per 91 right-swipes)
  HR: 0.9, // Croatia (Raw: 1.1%, ~1 organic match per 111 right-swipes)
  CU: 0.7, // Cuba (Raw: 1.5%, ~1 organic match per 143 right-swipes)
  CW: 0.9, // Curaçao (Raw: 1.7%, ~1 organic match per 111 right-swipes)
  CY: 1, // Cyprus (Raw: 1.2%, ~1 organic match per 100 right-swipes)
  CZ: 1, // Czechia (Raw: 1.2%, ~1 organic match per 100 right-swipes)
  DK: 1.1, // Denmark (Raw: 1.3%, ~1 organic match per 91 right-swipes)
  DJ: 0.4, // Djibouti (Raw: 1.2%, ~1 organic match per 250 right-swipes)
  DM: 0.9, // Dominica (Raw: 1.7%, ~1 organic match per 111 right-swipes)
  DO: 1.7, // Dominican Republic (Raw: 3.5%, ~1 organic match per 59 right-swipes)
  CD: 0.4, // DR Congo (Raw: 1.2%, ~1 organic match per 250 right-swipes)
  EC: 1.4, // Ecuador (Raw: 2.2%, ~1 organic match per 71 right-swipes)
  EG: 0.2, // Egypt (Raw: 0.5%, ~1 organic match per 500 right-swipes)
  SV: 1, // El Salvador (Raw: 1.8%, ~1 organic match per 100 right-swipes)
  GQ: 0.7, // Equatorial Guinea (Raw: 1.5%, ~1 organic match per 143 right-swipes)
  ER: 0.2, // Eritrea (Raw: 1%, ~1 organic match per 500 right-swipes)
  EE: 1, // Estonia (Raw: 1.2%, ~1 organic match per 100 right-swipes)
  SZ: 0.5, // Eswatini (Raw: 1.3%, ~1 organic match per 200 right-swipes)
  ET: 0.9, // Ethiopia (Raw: 1.7%, ~1 organic match per 111 right-swipes)
  FK: 0.7, // Falkland Islands (Raw: 1.5%, ~1 organic match per 143 right-swipes)
  FO: 0.7, // Faroe Islands (Raw: 0.9%, ~1 organic match per 143 right-swipes)
  FJ: 0.6, // Fiji (Raw: 0.9%, ~1 organic match per 167 right-swipes)
  FI: 1.1, // Finland (Raw: 1.3%, ~1 organic match per 91 right-swipes)
  FR: 1, // France (Raw: 1.2%, ~1 organic match per 100 right-swipes)
  GF: 0.6, // French Guiana (Raw: 1.4%, ~1 organic match per 167 right-swipes)
  PF: 0.6, // French Polynesia (Raw: 0.9%, ~1 organic match per 167 right-swipes)
  GA: 0.8, // Gabon (Raw: 1.6%, ~1 organic match per 125 right-swipes)
  GM: 0.6, // Gambia (Raw: 1.4%, ~1 organic match per 167 right-swipes)
  GE: 0.3, // Georgia (Raw: 0.6%, ~1 organic match per 333 right-swipes)
  DE: 1.2, // Germany (Raw: 1.4%, ~1 organic match per 83 right-swipes)
  GH: 1.5, // Ghana (Raw: 2.8%, ~1 organic match per 67 right-swipes)
  GI: 1.2, // Gibraltar (Raw: 1.4%, ~1 organic match per 83 right-swipes)
  GR: 1, // Greece (Raw: 1.2%, ~1 organic match per 100 right-swipes)
  GL: 1, // Greenland (Raw: 1.2%, ~1 organic match per 100 right-swipes)
  GD: 0.6, // Grenada (Raw: 1.4%, ~1 organic match per 167 right-swipes)
  GP: 0.6, // Guadeloupe (Raw: 1.4%, ~1 organic match per 167 right-swipes)
  GU: 0.8, // Guam (Raw: 1.1%, ~1 organic match per 125 right-swipes)
  GT: 0.7, // Guatemala (Raw: 1.5%, ~1 organic match per 143 right-swipes)
  GG: 1, // Guernsey (Raw: 1.2%, ~1 organic match per 100 right-swipes)
  GN: 0.2, // Guinea (Raw: 1%, ~1 organic match per 500 right-swipes)
  GW: 0.2, // Guinea-Bissau (Raw: 1%, ~1 organic match per 500 right-swipes)
  GY: 0.6, // Guyana (Raw: 1.4%, ~1 organic match per 167 right-swipes)
  HT: 0.2, // Haiti (Raw: 1%, ~1 organic match per 500 right-swipes)
  HN: 0.8, // Honduras (Raw: 1.6%, ~1 organic match per 125 right-swipes)
  HK: 1.1, // Hong Kong (Raw: 1.7%, ~1 organic match per 91 right-swipes)
  HU: 1, // Hungary (Raw: 1.2%, ~1 organic match per 100 right-swipes)
  IS: 1.1, // Iceland (Raw: 1.3%, ~1 organic match per 91 right-swipes)
  IN: 0.2, // India (Raw: 0.5%, ~1 organic match per 500 right-swipes)
  ID: 2.6, // Indonesia (Raw: 3.8%, ~1 organic match per 38 right-swipes)
  IR: 0.1, // Iran (Raw: 0.2%, ~1 organic match per 1000 right-swipes)
  IQ: 0.1, // Iraq (Raw: 0.4%, ~1 organic match per 1000 right-swipes)
  IE: 1.1, // Ireland (Raw: 1.3%, ~1 organic match per 91 right-swipes)
  IM: 1.1, // Isle of Man (Raw: 1.3%, ~1 organic match per 91 right-swipes)
  IL: 0.3, // Israel (Raw: 0.6%, ~1 organic match per 333 right-swipes)
  IT: 1, // Italy (Raw: 1.2%, ~1 organic match per 100 right-swipes)
  CI: 0.5, // Ivory Coast (Raw: 1.3%, ~1 organic match per 200 right-swipes)
  JM: 1, // Jamaica (Raw: 1.8%, ~1 organic match per 100 right-swipes)
  JP: 0.8, // Japan (Raw: 1.2%, ~1 organic match per 125 right-swipes)
  JE: 0.9, // Jersey (Raw: 1.1%, ~1 organic match per 111 right-swipes)
  JO: 0.4, // Jordan (Raw: 0.7%, ~1 organic match per 250 right-swipes)
  KZ: 0.3, // Kazakhstan (Raw: 0.6%, ~1 organic match per 333 right-swipes)
  KE: 1.6, // Kenya (Raw: 3.3%, ~1 organic match per 63 right-swipes)
  KI: 0.5, // Kiribati (Raw: 0.8%, ~1 organic match per 200 right-swipes)
  XK: 0.8, // Kosovo (Raw: 1%, ~1 organic match per 125 right-swipes)
  KW: 0.4, // Kuwait (Raw: 0.7%, ~1 organic match per 250 right-swipes)
  KG: 0.2, // Kyrgyzstan (Raw: 0.5%, ~1 organic match per 500 right-swipes)
  LA: 1.5, // Laos (Raw: 2.4%, ~1 organic match per 67 right-swipes)
  LV: 0.9, // Latvia (Raw: 1.1%, ~1 organic match per 111 right-swipes)
  LB: 0.5, // Lebanon (Raw: 0.8%, ~1 organic match per 200 right-swipes)
  LS: 0.5, // Lesotho (Raw: 1.3%, ~1 organic match per 200 right-swipes)
  LR: 0.4, // Liberia (Raw: 1.2%, ~1 organic match per 250 right-swipes)
  LY: 0.2, // Libya (Raw: 0.5%, ~1 organic match per 500 right-swipes)
  LI: 0.7, // Liechtenstein (Raw: 0.9%, ~1 organic match per 143 right-swipes)
  LT: 0.9, // Lithuania (Raw: 1.1%, ~1 organic match per 111 right-swipes)
  LU: 1.1, // Luxembourg (Raw: 1.3%, ~1 organic match per 91 right-swipes)
  MO: 1, // Macau (Raw: 1.2%, ~1 organic match per 100 right-swipes)
  MG: 0.4, // Madagascar (Raw: 1.2%, ~1 organic match per 250 right-swipes)
  MW: 0.4, // Malawi (Raw: 1.2%, ~1 organic match per 250 right-swipes)
  MY: 1.3, // Malaysia (Raw: 1.9%, ~1 organic match per 77 right-swipes)
  MV: 0.4, // Maldives (Raw: 0.6%, ~1 organic match per 250 right-swipes)
  ML: 0.2, // Mali (Raw: 1%, ~1 organic match per 500 right-swipes)
  MT: 1.1, // Malta (Raw: 1.3%, ~1 organic match per 91 right-swipes)
  MH: 0.6, // Marshall Islands (Raw: 0.9%, ~1 organic match per 167 right-swipes)
  MQ: 0.6, // Martinique (Raw: 1.4%, ~1 organic match per 167 right-swipes)
  MR: 0.2, // Mauritania (Raw: 1%, ~1 organic match per 500 right-swipes)
  MU: 0.6, // Mauritius (Raw: 1.4%, ~1 organic match per 167 right-swipes)
  YT: 0.4, // Mayotte (Raw: 1.2%, ~1 organic match per 250 right-swipes)
  MX: 1.4, // Mexico (Raw: 2.2%, ~1 organic match per 71 right-swipes)
  FM: 0.3, // Micronesia (Raw: 0.6%, ~1 organic match per 333 right-swipes)
  MD: 0.7, // Moldova (Raw: 0.9%, ~1 organic match per 143 right-swipes)
  MC: 1, // Monaco (Raw: 1.2%, ~1 organic match per 100 right-swipes)
  MN: 0.9, // Mongolia (Raw: 1.1%, ~1 organic match per 111 right-swipes)
  ME: 0.9, // Montenegro (Raw: 1.1%, ~1 organic match per 111 right-swipes)
  MS: 0.4, // Montserrat (Raw: 1.2%, ~1 organic match per 250 right-swipes)
  MA: 0.4, // Morocco (Raw: 0.9%, ~1 organic match per 250 right-swipes)
  MZ: 0.4, // Mozambique (Raw: 1.2%, ~1 organic match per 250 right-swipes)
  MM: 0.7, // Myanmar (Raw: 1.2%, ~1 organic match per 143 right-swipes)
  NA: 0.6, // Namibia (Raw: 1.4%, ~1 organic match per 167 right-swipes)
  NR: 0.8, // Nauru (Raw: 1.1%, ~1 organic match per 125 right-swipes)
  NP: 0.5, // Nepal (Raw: 0.8%, ~1 organic match per 200 right-swipes)
  NL: 1.3, // Netherlands (Raw: 1.4%, ~1 organic match per 77 right-swipes)
  NC: 0.6, // New Caledonia (Raw: 0.9%, ~1 organic match per 167 right-swipes)
  NZ: 0.8, // New Zealand (Raw: 1.1%, ~1 organic match per 125 right-swipes)
  NI: 0.8, // Nicaragua (Raw: 1.6%, ~1 organic match per 125 right-swipes)
  NE: 0.2, // Niger (Raw: 1%, ~1 organic match per 500 right-swipes)
  NG: 0.9, // Nigeria (Raw: 2.6%, ~1 organic match per 111 right-swipes)
  NU: 0.7, // Niue (Raw: 1%, ~1 organic match per 143 right-swipes)
  NF: 0.4, // Norfolk Island (Raw: 0.7%, ~1 organic match per 250 right-swipes)
  KP: 0.1, // North Korea (Raw: 0.1%, ~1 organic match per 1000 right-swipes)
  MK: 1, // North Macedonia (Raw: 1.2%, ~1 organic match per 100 right-swipes)
  MP: 0.7, // Northern Mariana Islands (Raw: 1%, ~1 organic match per 143 right-swipes)
  NO: 1.1, // Norway (Raw: 1.3%, ~1 organic match per 91 right-swipes)
  OM: 0.4, // Oman (Raw: 0.7%, ~1 organic match per 250 right-swipes)
  PK: 0.2, // Pakistan (Raw: 0.3%, ~1 organic match per 500 right-swipes)
  PW: 0.7, // Palau (Raw: 1%, ~1 organic match per 143 right-swipes)
  PS: 0.2, // Palestine (Raw: 0.5%, ~1 organic match per 500 right-swipes)
  PA: 1.3, // Panama (Raw: 2.3%, ~1 organic match per 77 right-swipes)
  PG: 0.3, // Papua New Guinea (Raw: 0.6%, ~1 organic match per 333 right-swipes)
  PY: 1, // Paraguay (Raw: 1.8%, ~1 organic match per 100 right-swipes)
  PE: 1.7, // Peru (Raw: 2.5%, ~1 organic match per 59 right-swipes)
  PH: 3.2, // Philippines (Raw: 4.9%, ~1 organic match per 31 right-swipes)
  PN: 0.4, // Pitcairn Islands (Raw: 0.7%, ~1 organic match per 250 right-swipes)
  PL: 0.9, // Poland (Raw: 1.1%, ~1 organic match per 111 right-swipes)
  PT: 1, // Portugal (Raw: 1.2%, ~1 organic match per 100 right-swipes)
  PR: 0.7, // Puerto Rico (Raw: 1.5%, ~1 organic match per 143 right-swipes)
  QA: 0.4, // Qatar (Raw: 0.7%, ~1 organic match per 250 right-swipes)
  RE: 0.6, // Réunion (Raw: 1.4%, ~1 organic match per 167 right-swipes)
  RO: 1, // Romania (Raw: 1.2%, ~1 organic match per 100 right-swipes)
  RU: 0.1, // Russia (Raw: 0.2%, ~1 organic match per 1000 right-swipes)
  RW: 1.2, // Rwanda (Raw: 1.9%, ~1 organic match per 83 right-swipes)
  BL: 0.7, // Saint Barthélemy (Raw: 1.5%, ~1 organic match per 143 right-swipes)
  SH: 0.3, // Saint Helena, Ascension and Tristan da Cunha (Raw: 1.1%, ~1 organic match per 333 right-swipes)
  KN: 0.6, // Saint Kitts and Nevis (Raw: 1.4%, ~1 organic match per 167 right-swipes)
  LC: 0.6, // Saint Lucia (Raw: 1.4%, ~1 organic match per 167 right-swipes)
  MF: 0.7, // Saint Martin (Raw: 1.5%, ~1 organic match per 143 right-swipes)
  PM: 1.1, // Saint Pierre and Miquelon (Raw: 1.3%, ~1 organic match per 91 right-swipes)
  VC: 0.7, // Saint Vincent and the Grenadines (Raw: 1.5%, ~1 organic match per 143 right-swipes)
  WS: 0.4, // Samoa (Raw: 0.7%, ~1 organic match per 250 right-swipes)
  SM: 1, // San Marino (Raw: 1.2%, ~1 organic match per 100 right-swipes)
  ST: 0.6, // São Tomé and Príncipe (Raw: 1.4%, ~1 organic match per 167 right-swipes)
  SA: 0.2, // Saudi Arabia (Raw: 0.4%, ~1 organic match per 500 right-swipes)
  SN: 0.4, // Senegal (Raw: 1.2%, ~1 organic match per 250 right-swipes)
  RS: 0.9, // Serbia (Raw: 1.1%, ~1 organic match per 111 right-swipes)
  SC: 0.7, // Seychelles (Raw: 1.5%, ~1 organic match per 143 right-swipes)
  SL: 0.4, // Sierra Leone (Raw: 1.2%, ~1 organic match per 250 right-swipes)
  SG: 1.2, // Singapore (Raw: 1.6%, ~1 organic match per 83 right-swipes)
  SX: 0.9, // Sint Maarten (Raw: 1.7%, ~1 organic match per 111 right-swipes)
  SK: 0.8, // Slovakia (Raw: 1%, ~1 organic match per 125 right-swipes)
  SI: 0.9, // Slovenia (Raw: 1.1%, ~1 organic match per 111 right-swipes)
  SB: 0.3, // Solomon Islands (Raw: 0.6%, ~1 organic match per 333 right-swipes)
  SO: 0.1, // Somalia (Raw: 0.9%, ~1 organic match per 1000 right-swipes)
  ZA: 1.3, // South Africa (Raw: 2.1%, ~1 organic match per 77 right-swipes)
  KR: 0.7, // South Korea (Raw: 1%, ~1 organic match per 143 right-swipes)
  SS: 0.2, // South Sudan (Raw: 1%, ~1 organic match per 500 right-swipes)
  ES: 1, // Spain (Raw: 1.2%, ~1 organic match per 100 right-swipes)
  LK: 0.4, // Sri Lanka (Raw: 0.7%, ~1 organic match per 250 right-swipes)
  SD: 0.1, // Sudan (Raw: 0.4%, ~1 organic match per 1000 right-swipes)
  SR: 0.8, // Suriname (Raw: 1.6%, ~1 organic match per 125 right-swipes)
  SJ: 1.1, // Svalbard and Jan Mayen (Raw: 1.3%, ~1 organic match per 91 right-swipes)
  SE: 1.1, // Sweden (Raw: 1.3%, ~1 organic match per 91 right-swipes)
  CH: 1.1, // Switzerland (Raw: 1.3%, ~1 organic match per 91 right-swipes)
  SY: 0.1, // Syria (Raw: 0.1%, ~1 organic match per 1000 right-swipes)
  TW: 1, // Taiwan (Raw: 1.4%, ~1 organic match per 100 right-swipes)
  TJ: 0.2, // Tajikistan (Raw: 0.5%, ~1 organic match per 500 right-swipes)
  TZ: 1.3, // Tanzania (Raw: 2.7%, ~1 organic match per 77 right-swipes)
  TH: 2.3, // Thailand (Raw: 4.5%, ~1 organic match per 43 right-swipes)
  TL: 0.5, // Timor-Leste (Raw: 0.7%, ~1 organic match per 200 right-swipes)
  TG: 0.4, // Togo (Raw: 1.2%, ~1 organic match per 250 right-swipes)
  TK: 0.3, // Tokelau (Raw: 0.6%, ~1 organic match per 333 right-swipes)
  TO: 0.4, // Tonga (Raw: 0.7%, ~1 organic match per 250 right-swipes)
  TT: 0.7, // Trinidad and Tobago (Raw: 1.5%, ~1 organic match per 143 right-swipes)
  TN: 0.3, // Tunisia (Raw: 0.6%, ~1 organic match per 333 right-swipes)
  TR: 0.6, // Türkiye (Raw: 1%, ~1 organic match per 167 right-swipes)
  TM: 0.2, // Turkmenistan (Raw: 0.5%, ~1 organic match per 500 right-swipes)
  TC: 0.9, // Turks and Caicos Islands (Raw: 1.7%, ~1 organic match per 111 right-swipes)
  TV: 0.6, // Tuvalu (Raw: 0.9%, ~1 organic match per 167 right-swipes)
  UG: 1.3, // Uganda (Raw: 2.7%, ~1 organic match per 77 right-swipes)
  UA: 0.9, // Ukraine (Raw: 1.1%, ~1 organic match per 111 right-swipes)
  AE: 0.4, // United Arab Emirates (Raw: 2.2%, ~1 organic match per 250 right-swipes)
  GB: 1.2, // United Kingdom (Raw: 1.4%, ~1 organic match per 83 right-swipes)
  US: 1.2, // United States (Raw: 1.4%, ~1 organic match per 83 right-swipes)
  UM: 1.3, // United States Minor Outlying Islands (Raw: 1.5%, ~1 organic match per 77 right-swipes)
  VI: 0.9, // United States Virgin Islands (Raw: 1.7%, ~1 organic match per 111 right-swipes)
  UY: 0.7, // Uruguay (Raw: 0.9%, ~1 organic match per 143 right-swipes)
  UZ: 0.3, // Uzbekistan (Raw: 0.6%, ~1 organic match per 333 right-swipes)
  VU: 0.3, // Vanuatu (Raw: 0.6%, ~1 organic match per 333 right-swipes)
  VA: 0.9, // Vatican City (Raw: 1.1%, ~1 organic match per 111 right-swipes)
  VE: 0.9, // Venezuela (Raw: 2%, ~1 organic match per 111 right-swipes)
  VN: 2, // Vietnam (Raw: 3.1%, ~1 organic match per 50 right-swipes)
  WF: 0.3, // Wallis and Futuna (Raw: 0.6%, ~1 organic match per 333 right-swipes)
  EH: 0.3, // Western Sahara (Raw: 0.6%, ~1 organic match per 333 right-swipes)
  YE: 0.1, // Yemen (Raw: 0.1%, ~1 organic match per 1000 right-swipes)
  ZM: 0.4, // Zambia (Raw: 1.2%, ~1 organic match per 250 right-swipes)
  ZW: 0.5, // Zimbabwe (Raw: 1.3%, ~1 organic match per 200 right-swipes)
};

export const tinderRawMatchRateByCountry: Record<string, number> = {
  AF: 0.1, // Afghanistan (Organic: 0.1%)
  AX: 1.1, // Åland Islands (Organic: 0.9%)
  AL: 1.1, // Albania (Organic: 0.9%)
  DZ: 0.6, // Algeria (Organic: 0.3%)
  AS: 1, // American Samoa (Organic: 0.7%)
  AD: 1.2, // Andorra (Organic: 1%)
  AO: 1.4, // Angola (Organic: 0.6%)
  AI: 1.7, // Anguilla (Organic: 0.9%)
  AG: 1.3, // Antigua and Barbuda (Organic: 0.5%)
  AR: 1.1, // Argentina (Organic: 0.8%)
  AM: 0.9, // Armenia (Organic: 0.7%)
  AW: 1.5, // Aruba (Organic: 0.7%)
  AU: 1.1, // Australia (Organic: 0.8%)
  AT: 1.3, // Austria (Organic: 1.1%)
  AZ: 0.9, // Azerbaijan (Organic: 0.7%)
  BS: 1.7, // Bahamas (Organic: 0.9%)
  BH: 0.7, // Bahrain (Organic: 0.4%)
  BD: 0.4, // Bangladesh (Organic: 0.2%)
  BB: 1.5, // Barbados (Organic: 0.7%)
  BY: 0.2, // Belarus (Organic: 0.1%)
  BE: 1.4, // Belgium (Organic: 1.2%)
  BZ: 1.5, // Belize (Organic: 0.7%)
  BJ: 1.2, // Benin (Organic: 0.4%)
  BM: 1.5, // Bermuda (Organic: 1.3%)
  BT: 0.9, // Bhutan (Organic: 0.7%)
  BO: 1.5, // Bolivia (Organic: 0.7%)
  BA: 1, // Bosnia and Herzegovina (Organic: 0.8%)
  BW: 1.5, // Botswana (Organic: 0.7%)
  BR: 2.2, // Brazil (Organic: 1.4%)
  IO: 1.5, // British Indian Ocean Territory (Organic: 0.7%)
  VG: 1.5, // British Virgin Islands (Organic: 0.7%)
  BN: 0.8, // Brunei (Organic: 0.6%)
  BG: 1.1, // Bulgaria (Organic: 0.9%)
  BF: 1, // Burkina Faso (Organic: 0.2%)
  BI: 1, // Burundi (Organic: 0.2%)
  KH: 3.2, // Cambodia (Organic: 1.9%)
  CM: 1.3, // Cameroon (Organic: 0.5%)
  CA: 1.4, // Canada (Organic: 1.2%)
  CV: 1.5, // Cape Verde (Organic: 0.7%)
  BQ: 1.6, // Caribbean Netherlands (Organic: 0.8%)
  KY: 1.7, // Cayman Islands (Organic: 0.9%)
  CF: 1, // Central African Republic (Organic: 0.2%)
  TD: 1, // Chad (Organic: 0.2%)
  CL: 1.1, // Chile (Organic: 0.8%)
  CN: 0.6, // China (Organic: 0.1%)
  CX: 1.1, // Christmas Island (Organic: 0.8%)
  CC: 1.1, // Cocos (Keeling) Islands (Organic: 0.8%)
  CO: 3.3, // Colombia (Organic: 1.4%)
  KM: 1, // Comoros (Organic: 0.2%)
  CG: 1.3, // Congo (Organic: 0.5%)
  CK: 1, // Cook Islands (Organic: 0.7%)
  CR: 2.1, // Costa Rica (Organic: 1.1%)
  HR: 1.1, // Croatia (Organic: 0.9%)
  CU: 1.5, // Cuba (Organic: 0.7%)
  CW: 1.7, // Curaçao (Organic: 0.9%)
  CY: 1.2, // Cyprus (Organic: 1%)
  CZ: 1.2, // Czechia (Organic: 1%)
  DK: 1.3, // Denmark (Organic: 1.1%)
  DJ: 1.2, // Djibouti (Organic: 0.4%)
  DM: 1.7, // Dominica (Organic: 0.9%)
  DO: 3.5, // Dominican Republic (Organic: 1.7%)
  CD: 1.2, // DR Congo (Organic: 0.4%)
  EC: 2.2, // Ecuador (Organic: 1.4%)
  EG: 0.5, // Egypt (Organic: 0.2%)
  SV: 1.8, // El Salvador (Organic: 1%)
  GQ: 1.5, // Equatorial Guinea (Organic: 0.7%)
  ER: 1, // Eritrea (Organic: 0.2%)
  EE: 1.2, // Estonia (Organic: 1%)
  SZ: 1.3, // Eswatini (Organic: 0.5%)
  ET: 1.7, // Ethiopia (Organic: 0.9%)
  FK: 1.5, // Falkland Islands (Organic: 0.7%)
  FO: 0.9, // Faroe Islands (Organic: 0.7%)
  FJ: 0.9, // Fiji (Organic: 0.6%)
  FI: 1.3, // Finland (Organic: 1.1%)
  FR: 1.2, // France (Organic: 1%)
  GF: 1.4, // French Guiana (Organic: 0.6%)
  PF: 0.9, // French Polynesia (Organic: 0.6%)
  GA: 1.6, // Gabon (Organic: 0.8%)
  GM: 1.4, // Gambia (Organic: 0.6%)
  GE: 0.6, // Georgia (Organic: 0.3%)
  DE: 1.4, // Germany (Organic: 1.2%)
  GH: 2.8, // Ghana (Organic: 1.5%)
  GI: 1.4, // Gibraltar (Organic: 1.2%)
  GR: 1.2, // Greece (Organic: 1%)
  GL: 1.2, // Greenland (Organic: 1%)
  GD: 1.4, // Grenada (Organic: 0.6%)
  GP: 1.4, // Guadeloupe (Organic: 0.6%)
  GU: 1.1, // Guam (Organic: 0.8%)
  GT: 1.5, // Guatemala (Organic: 0.7%)
  GG: 1.2, // Guernsey (Organic: 1%)
  GN: 1, // Guinea (Organic: 0.2%)
  GW: 1, // Guinea-Bissau (Organic: 0.2%)
  GY: 1.4, // Guyana (Organic: 0.6%)
  HT: 1, // Haiti (Organic: 0.2%)
  HN: 1.6, // Honduras (Organic: 0.8%)
  HK: 1.7, // Hong Kong (Organic: 1.1%)
  HU: 1.2, // Hungary (Organic: 1%)
  IS: 1.3, // Iceland (Organic: 1.1%)
  IN: 0.5, // India (Organic: 0.2%)
  ID: 3.8, // Indonesia (Organic: 2.6%)
  IR: 0.2, // Iran (Organic: 0.1%)
  IQ: 0.4, // Iraq (Organic: 0.1%)
  IE: 1.3, // Ireland (Organic: 1.1%)
  IM: 1.3, // Isle of Man (Organic: 1.1%)
  IL: 0.6, // Israel (Organic: 0.3%)
  IT: 1.2, // Italy (Organic: 1%)
  CI: 1.3, // Ivory Coast (Organic: 0.5%)
  JM: 1.8, // Jamaica (Organic: 1%)
  JP: 1.2, // Japan (Organic: 0.8%)
  JE: 1.1, // Jersey (Organic: 0.9%)
  JO: 0.7, // Jordan (Organic: 0.4%)
  KZ: 0.6, // Kazakhstan (Organic: 0.3%)
  KE: 3.3, // Kenya (Organic: 1.6%)
  KI: 0.8, // Kiribati (Organic: 0.5%)
  XK: 1, // Kosovo (Organic: 0.8%)
  KW: 0.7, // Kuwait (Organic: 0.4%)
  KG: 0.5, // Kyrgyzstan (Organic: 0.2%)
  LA: 2.4, // Laos (Organic: 1.5%)
  LV: 1.1, // Latvia (Organic: 0.9%)
  LB: 0.8, // Lebanon (Organic: 0.5%)
  LS: 1.3, // Lesotho (Organic: 0.5%)
  LR: 1.2, // Liberia (Organic: 0.4%)
  LY: 0.5, // Libya (Organic: 0.2%)
  LI: 0.9, // Liechtenstein (Organic: 0.7%)
  LT: 1.1, // Lithuania (Organic: 0.9%)
  LU: 1.3, // Luxembourg (Organic: 1.1%)
  MO: 1.2, // Macau (Organic: 1%)
  MG: 1.2, // Madagascar (Organic: 0.4%)
  MW: 1.2, // Malawi (Organic: 0.4%)
  MY: 1.9, // Malaysia (Organic: 1.3%)
  MV: 0.6, // Maldives (Organic: 0.4%)
  ML: 1, // Mali (Organic: 0.2%)
  MT: 1.3, // Malta (Organic: 1.1%)
  MH: 0.9, // Marshall Islands (Organic: 0.6%)
  MQ: 1.4, // Martinique (Organic: 0.6%)
  MR: 1, // Mauritania (Organic: 0.2%)
  MU: 1.4, // Mauritius (Organic: 0.6%)
  YT: 1.2, // Mayotte (Organic: 0.4%)
  MX: 2.2, // Mexico (Organic: 1.4%)
  FM: 0.6, // Micronesia (Organic: 0.3%)
  MD: 0.9, // Moldova (Organic: 0.7%)
  MC: 1.2, // Monaco (Organic: 1%)
  MN: 1.1, // Mongolia (Organic: 0.9%)
  ME: 1.1, // Montenegro (Organic: 0.9%)
  MS: 1.2, // Montserrat (Organic: 0.4%)
  MA: 0.9, // Morocco (Organic: 0.4%)
  MZ: 1.2, // Mozambique (Organic: 0.4%)
  MM: 1.2, // Myanmar (Organic: 0.7%)
  NA: 1.4, // Namibia (Organic: 0.6%)
  NR: 1.1, // Nauru (Organic: 0.8%)
  NP: 0.8, // Nepal (Organic: 0.5%)
  NL: 1.4, // Netherlands (Organic: 1.3%)
  NC: 0.9, // New Caledonia (Organic: 0.6%)
  NZ: 1.1, // New Zealand (Organic: 0.8%)
  NI: 1.6, // Nicaragua (Organic: 0.8%)
  NE: 1, // Niger (Organic: 0.2%)
  NG: 2.6, // Nigeria (Organic: 0.9%)
  NU: 1, // Niue (Organic: 0.7%)
  NF: 0.7, // Norfolk Island (Organic: 0.4%)
  KP: 0.1, // North Korea (Organic: 0.1%)
  MK: 1.2, // North Macedonia (Organic: 1%)
  MP: 1, // Northern Mariana Islands (Organic: 0.7%)
  NO: 1.3, // Norway (Organic: 1.1%)
  OM: 0.7, // Oman (Organic: 0.4%)
  PK: 0.3, // Pakistan (Organic: 0.2%)
  PW: 1, // Palau (Organic: 0.7%)
  PS: 0.5, // Palestine (Organic: 0.2%)
  PA: 2.3, // Panama (Organic: 1.3%)
  PG: 0.6, // Papua New Guinea (Organic: 0.3%)
  PY: 1.8, // Paraguay (Organic: 1%)
  PE: 2.5, // Peru (Organic: 1.7%)
  PH: 4.9, // Philippines (Organic: 3.2%)
  PN: 0.7, // Pitcairn Islands (Organic: 0.4%)
  PL: 1.1, // Poland (Organic: 0.9%)
  PT: 1.2, // Portugal (Organic: 1%)
  PR: 1.5, // Puerto Rico (Organic: 0.7%)
  QA: 0.7, // Qatar (Organic: 0.4%)
  RE: 1.4, // Réunion (Organic: 0.6%)
  RO: 1.2, // Romania (Organic: 1%)
  RU: 0.2, // Russia (Organic: 0.1%)
  RW: 1.9, // Rwanda (Organic: 1.2%)
  BL: 1.5, // Saint Barthélemy (Organic: 0.7%)
  SH: 1.1, // Saint Helena, Ascension and Tristan da Cunha (Organic: 0.3%)
  KN: 1.4, // Saint Kitts and Nevis (Organic: 0.6%)
  LC: 1.4, // Saint Lucia (Organic: 0.6%)
  MF: 1.5, // Saint Martin (Organic: 0.7%)
  PM: 1.3, // Saint Pierre and Miquelon (Organic: 1.1%)
  VC: 1.5, // Saint Vincent and the Grenadines (Organic: 0.7%)
  WS: 0.7, // Samoa (Organic: 0.4%)
  SM: 1.2, // San Marino (Organic: 1%)
  ST: 1.4, // São Tomé and Príncipe (Organic: 0.6%)
  SA: 0.4, // Saudi Arabia (Organic: 0.2%)
  SN: 1.2, // Senegal (Organic: 0.4%)
  RS: 1.1, // Serbia (Organic: 0.9%)
  SC: 1.5, // Seychelles (Organic: 0.7%)
  SL: 1.2, // Sierra Leone (Organic: 0.4%)
  SG: 1.6, // Singapore (Organic: 1.2%)
  SX: 1.7, // Sint Maarten (Organic: 0.9%)
  SK: 1, // Slovakia (Organic: 0.8%)
  SI: 1.1, // Slovenia (Organic: 0.9%)
  SB: 0.6, // Solomon Islands (Organic: 0.3%)
  SO: 0.9, // Somalia (Organic: 0.1%)
  ZA: 2.1, // South Africa (Organic: 1.3%)
  KR: 1, // South Korea (Organic: 0.7%)
  SS: 1, // South Sudan (Organic: 0.2%)
  ES: 1.2, // Spain (Organic: 1%)
  LK: 0.7, // Sri Lanka (Organic: 0.4%)
  SD: 0.4, // Sudan (Organic: 0.1%)
  SR: 1.6, // Suriname (Organic: 0.8%)
  SJ: 1.3, // Svalbard and Jan Mayen (Organic: 1.1%)
  SE: 1.3, // Sweden (Organic: 1.1%)
  CH: 1.3, // Switzerland (Organic: 1.1%)
  SY: 0.1, // Syria (Organic: 0.1%)
  TW: 1.4, // Taiwan (Organic: 1%)
  TJ: 0.5, // Tajikistan (Organic: 0.2%)
  TZ: 2.7, // Tanzania (Organic: 1.3%)
  TH: 4.5, // Thailand (Organic: 2.3%)
  TL: 0.7, // Timor-Leste (Organic: 0.5%)
  TG: 1.2, // Togo (Organic: 0.4%)
  TK: 0.6, // Tokelau (Organic: 0.3%)
  TO: 0.7, // Tonga (Organic: 0.4%)
  TT: 1.5, // Trinidad and Tobago (Organic: 0.7%)
  TN: 0.6, // Tunisia (Organic: 0.3%)
  TR: 1, // Türkiye (Organic: 0.6%)
  TM: 0.5, // Turkmenistan (Organic: 0.2%)
  TC: 1.7, // Turks and Caicos Islands (Organic: 0.9%)
  TV: 0.9, // Tuvalu (Organic: 0.6%)
  UG: 2.7, // Uganda (Organic: 1.3%)
  UA: 1.1, // Ukraine (Organic: 0.9%)
  AE: 2.2, // United Arab Emirates (Organic: 0.4%)
  GB: 1.4, // United Kingdom (Organic: 1.2%)
  US: 1.4, // United States (Organic: 1.2%)
  UM: 1.5, // United States Minor Outlying Islands (Organic: 1.3%)
  VI: 1.7, // United States Virgin Islands (Organic: 0.9%)
  UY: 0.9, // Uruguay (Organic: 0.7%)
  UZ: 0.6, // Uzbekistan (Organic: 0.3%)
  VU: 0.6, // Vanuatu (Organic: 0.3%)
  VA: 1.1, // Vatican City (Organic: 0.9%)
  VE: 2, // Venezuela (Organic: 0.9%)
  VN: 3.1, // Vietnam (Organic: 2%)
  WF: 0.6, // Wallis and Futuna (Organic: 0.3%)
  EH: 0.6, // Western Sahara (Organic: 0.3%)
  YE: 0.1, // Yemen (Organic: 0.1%)
  ZM: 1.2, // Zambia (Organic: 0.4%)
  ZW: 1.3, // Zimbabwe (Organic: 0.5%)
};

export const tinderMatchDetailsByCountry: Record<string, TinderMatchBreakdown> = {
  AF: {"matchRatePct":0.1,"rawMatchRatePct":0.1,"swipesPerMatch":1000,"activeOrganicShare":0.2,"deliveryProb":0.003,"conditionalRightSwipeProb":0.009,"localPercentile":5.2},
  AX: {"matchRatePct":0.9,"rawMatchRatePct":1.1,"swipesPerMatch":111,"activeOrganicShare":0.6,"deliveryProb":0.107,"conditionalRightSwipeProb":0.104,"localPercentile":70.8},
  AL: {"matchRatePct":0.9,"rawMatchRatePct":1.1,"swipesPerMatch":111,"activeOrganicShare":0.6,"deliveryProb":0.11,"conditionalRightSwipeProb":0.106,"localPercentile":71.6},
  DZ: {"matchRatePct":0.3,"rawMatchRatePct":0.6,"swipesPerMatch":333,"activeOrganicShare":0.48,"deliveryProb":0.068,"conditionalRightSwipeProb":0.068,"localPercentile":56.1},
  AS: {"matchRatePct":0.7,"rawMatchRatePct":1,"swipesPerMatch":143,"activeOrganicShare":0.52,"deliveryProb":0.09,"conditionalRightSwipeProb":0.109,"localPercentile":72.4},
  AD: {"matchRatePct":1,"rawMatchRatePct":1.2,"swipesPerMatch":100,"activeOrganicShare":0.6,"deliveryProb":0.128,"conditionalRightSwipeProb":0.094,"localPercentile":67.7},
  AO: {"matchRatePct":0.6,"rawMatchRatePct":1.4,"swipesPerMatch":167,"activeOrganicShare":0.44,"deliveryProb":0.065,"conditionalRightSwipeProb":0.171,"localPercentile":85.4},
  AI: {"matchRatePct":0.9,"rawMatchRatePct":1.7,"swipesPerMatch":111,"activeOrganicShare":0.48,"deliveryProb":0.115,"conditionalRightSwipeProb":0.134,"localPercentile":78.9},
  AG: {"matchRatePct":0.5,"rawMatchRatePct":1.3,"swipesPerMatch":200,"activeOrganicShare":0.48,"deliveryProb":0.066,"conditionalRightSwipeProb":0.135,"localPercentile":79},
  AR: {"matchRatePct":0.8,"rawMatchRatePct":1.1,"swipesPerMatch":125,"activeOrganicShare":0.6,"deliveryProb":0.122,"conditionalRightSwipeProb":0.081,"localPercentile":62.4},
  AM: {"matchRatePct":0.7,"rawMatchRatePct":0.9,"swipesPerMatch":143,"activeOrganicShare":0.6,"deliveryProb":0.112,"conditionalRightSwipeProb":0.076,"localPercentile":59.7},
  AW: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"activeOrganicShare":0.48,"deliveryProb":0.093,"conditionalRightSwipeProb":0.123,"localPercentile":76.3},
  AU: {"matchRatePct":0.8,"rawMatchRatePct":1.1,"swipesPerMatch":125,"activeOrganicShare":0.52,"deliveryProb":0.106,"conditionalRightSwipeProb":0.118,"localPercentile":75.1},
  AT: {"matchRatePct":1.1,"rawMatchRatePct":1.3,"swipesPerMatch":91,"activeOrganicShare":0.6,"deliveryProb":0.125,"conditionalRightSwipeProb":0.116,"localPercentile":74.5},
  AZ: {"matchRatePct":0.7,"rawMatchRatePct":0.9,"swipesPerMatch":143,"activeOrganicShare":0.6,"deliveryProb":0.114,"conditionalRightSwipeProb":0.073,"localPercentile":58.6},
  BS: {"matchRatePct":0.9,"rawMatchRatePct":1.7,"swipesPerMatch":111,"activeOrganicShare":0.48,"deliveryProb":0.115,"conditionalRightSwipeProb":0.128,"localPercentile":77.6},
  BH: {"matchRatePct":0.4,"rawMatchRatePct":0.7,"swipesPerMatch":250,"activeOrganicShare":0.48,"deliveryProb":0.075,"conditionalRightSwipeProb":0.072,"localPercentile":57.8},
  BD: {"matchRatePct":0.2,"rawMatchRatePct":0.4,"swipesPerMatch":500,"activeOrganicShare":0.45,"deliveryProb":0.042,"conditionalRightSwipeProb":0.07,"localPercentile":57.2},
  BB: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"activeOrganicShare":0.48,"deliveryProb":0.089,"conditionalRightSwipeProb":0.137,"localPercentile":79.4},
  BY: {"matchRatePct":0.1,"rawMatchRatePct":0.2,"swipesPerMatch":1000,"activeOrganicShare":0.4,"deliveryProb":0.013,"conditionalRightSwipeProb":0.052,"localPercentile":46},
  BE: {"matchRatePct":1.2,"rawMatchRatePct":1.4,"swipesPerMatch":83,"activeOrganicShare":0.6,"deliveryProb":0.128,"conditionalRightSwipeProb":0.117,"localPercentile":74.7},
  BZ: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"activeOrganicShare":0.48,"deliveryProb":0.083,"conditionalRightSwipeProb":0.143,"localPercentile":80.7},
  BJ: {"matchRatePct":0.4,"rawMatchRatePct":1.2,"swipesPerMatch":250,"activeOrganicShare":0.44,"deliveryProb":0.05,"conditionalRightSwipeProb":0.156,"localPercentile":83.1},
  BM: {"matchRatePct":1.3,"rawMatchRatePct":1.5,"swipesPerMatch":77,"activeOrganicShare":0.6,"deliveryProb":0.128,"conditionalRightSwipeProb":0.134,"localPercentile":78.9},
  BT: {"matchRatePct":0.7,"rawMatchRatePct":0.9,"swipesPerMatch":143,"activeOrganicShare":0.6,"deliveryProb":0.102,"conditionalRightSwipeProb":0.083,"localPercentile":63.1},
  BO: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"activeOrganicShare":0.48,"deliveryProb":0.103,"conditionalRightSwipeProb":0.116,"localPercentile":74.4},
  BA: {"matchRatePct":0.8,"rawMatchRatePct":1,"swipesPerMatch":125,"activeOrganicShare":0.6,"deliveryProb":0.105,"conditionalRightSwipeProb":0.102,"localPercentile":70.1},
  BW: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"activeOrganicShare":0.44,"deliveryProb":0.073,"conditionalRightSwipeProb":0.178,"localPercentile":86.3},
  BR: {"matchRatePct":1.4,"rawMatchRatePct":2.2,"swipesPerMatch":71,"activeOrganicShare":0.56,"deliveryProb":0.124,"conditionalRightSwipeProb":0.157,"localPercentile":83.2},
  IO: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"activeOrganicShare":0.44,"deliveryProb":0.098,"conditionalRightSwipeProb":0.123,"localPercentile":76.3},
  VG: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"activeOrganicShare":0.48,"deliveryProb":0.089,"conditionalRightSwipeProb":0.131,"localPercentile":78.2},
  BN: {"matchRatePct":0.6,"rawMatchRatePct":0.8,"swipesPerMatch":167,"activeOrganicShare":0.6,"deliveryProb":0.128,"conditionalRightSwipeProb":0.052,"localPercentile":45.9},
  BG: {"matchRatePct":0.9,"rawMatchRatePct":1.1,"swipesPerMatch":111,"activeOrganicShare":0.6,"deliveryProb":0.119,"conditionalRightSwipeProb":0.097,"localPercentile":68.5},
  BF: {"matchRatePct":0.2,"rawMatchRatePct":1,"swipesPerMatch":500,"activeOrganicShare":0.44,"deliveryProb":0.042,"conditionalRightSwipeProb":0.077,"localPercentile":60.3},
  BI: {"matchRatePct":0.2,"rawMatchRatePct":1,"swipesPerMatch":500,"activeOrganicShare":0.44,"deliveryProb":0.042,"conditionalRightSwipeProb":0.077,"localPercentile":60.5},
  KH: {"matchRatePct":1.9,"rawMatchRatePct":3.2,"swipesPerMatch":53,"activeOrganicShare":0.52,"deliveryProb":0.137,"conditionalRightSwipeProb":0.216,"localPercentile":90.4},
  CM: {"matchRatePct":0.5,"rawMatchRatePct":1.3,"swipesPerMatch":200,"activeOrganicShare":0.44,"deliveryProb":0.059,"conditionalRightSwipeProb":0.157,"localPercentile":83.2},
  CA: {"matchRatePct":1.2,"rawMatchRatePct":1.4,"swipesPerMatch":83,"activeOrganicShare":0.6,"deliveryProb":0.128,"conditionalRightSwipeProb":0.119,"localPercentile":75.3},
  CV: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"activeOrganicShare":0.44,"deliveryProb":0.088,"conditionalRightSwipeProb":0.149,"localPercentile":81.9},
  BQ: {"matchRatePct":0.8,"rawMatchRatePct":1.6,"swipesPerMatch":125,"activeOrganicShare":0.48,"deliveryProb":0.102,"conditionalRightSwipeProb":0.125,"localPercentile":76.7},
  KY: {"matchRatePct":0.9,"rawMatchRatePct":1.7,"swipesPerMatch":111,"activeOrganicShare":0.48,"deliveryProb":0.115,"conditionalRightSwipeProb":0.129,"localPercentile":77.8},
  CF: {"matchRatePct":0.2,"rawMatchRatePct":1,"swipesPerMatch":500,"activeOrganicShare":0.44,"deliveryProb":0.042,"conditionalRightSwipeProb":0.077,"localPercentile":60.3},
  TD: {"matchRatePct":0.2,"rawMatchRatePct":1,"swipesPerMatch":500,"activeOrganicShare":0.44,"deliveryProb":0.042,"conditionalRightSwipeProb":0.077,"localPercentile":60.5},
  CL: {"matchRatePct":0.8,"rawMatchRatePct":1.1,"swipesPerMatch":125,"activeOrganicShare":0.6,"deliveryProb":0.122,"conditionalRightSwipeProb":0.08,"localPercentile":61.7},
  CN: {"matchRatePct":0.1,"rawMatchRatePct":0.6,"swipesPerMatch":1000,"activeOrganicShare":0.42,"deliveryProb":0.033,"conditionalRightSwipeProb":0.078,"localPercentile":61},
  CX: {"matchRatePct":0.8,"rawMatchRatePct":1.1,"swipesPerMatch":125,"activeOrganicShare":0.52,"deliveryProb":0.106,"conditionalRightSwipeProb":0.119,"localPercentile":75.2},
  CC: {"matchRatePct":0.8,"rawMatchRatePct":1.1,"swipesPerMatch":125,"activeOrganicShare":0.52,"deliveryProb":0.106,"conditionalRightSwipeProb":0.119,"localPercentile":75.2},
  CO: {"matchRatePct":1.4,"rawMatchRatePct":3.3,"swipesPerMatch":71,"activeOrganicShare":0.46,"deliveryProb":0.117,"conditionalRightSwipeProb":0.211,"localPercentile":90},
  KM: {"matchRatePct":0.2,"rawMatchRatePct":1,"swipesPerMatch":500,"activeOrganicShare":0.44,"deliveryProb":0.042,"conditionalRightSwipeProb":0.078,"localPercentile":60.8},
  CG: {"matchRatePct":0.5,"rawMatchRatePct":1.3,"swipesPerMatch":200,"activeOrganicShare":0.44,"deliveryProb":0.065,"conditionalRightSwipeProb":0.151,"localPercentile":82.1},
  CK: {"matchRatePct":0.7,"rawMatchRatePct":1,"swipesPerMatch":143,"activeOrganicShare":0.52,"deliveryProb":0.095,"conditionalRightSwipeProb":0.107,"localPercentile":72},
  CR: {"matchRatePct":1.1,"rawMatchRatePct":2.1,"swipesPerMatch":91,"activeOrganicShare":0.52,"deliveryProb":0.114,"conditionalRightSwipeProb":0.147,"localPercentile":81.5},
  HR: {"matchRatePct":0.9,"rawMatchRatePct":1.1,"swipesPerMatch":111,"activeOrganicShare":0.6,"deliveryProb":0.108,"conditionalRightSwipeProb":0.104,"localPercentile":71.1},
  CU: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"activeOrganicShare":0.44,"deliveryProb":0.072,"conditionalRightSwipeProb":0.19,"localPercentile":87.7},
  CW: {"matchRatePct":0.9,"rawMatchRatePct":1.7,"swipesPerMatch":111,"activeOrganicShare":0.48,"deliveryProb":0.112,"conditionalRightSwipeProb":0.126,"localPercentile":77.1},
  CY: {"matchRatePct":1,"rawMatchRatePct":1.2,"swipesPerMatch":100,"activeOrganicShare":0.6,"deliveryProb":0.119,"conditionalRightSwipeProb":0.104,"localPercentile":70.9},
  CZ: {"matchRatePct":1,"rawMatchRatePct":1.2,"swipesPerMatch":100,"activeOrganicShare":0.6,"deliveryProb":0.123,"conditionalRightSwipeProb":0.104,"localPercentile":70.8},
  DK: {"matchRatePct":1.1,"rawMatchRatePct":1.3,"swipesPerMatch":91,"activeOrganicShare":0.6,"deliveryProb":0.128,"conditionalRightSwipeProb":0.108,"localPercentile":72},
  DJ: {"matchRatePct":0.4,"rawMatchRatePct":1.2,"swipesPerMatch":250,"activeOrganicShare":0.44,"deliveryProb":0.081,"conditionalRightSwipeProb":0.087,"localPercentile":64.7},
  DM: {"matchRatePct":0.9,"rawMatchRatePct":1.7,"swipesPerMatch":111,"activeOrganicShare":0.48,"deliveryProb":0.106,"conditionalRightSwipeProb":0.137,"localPercentile":79.5},
  DO: {"matchRatePct":1.7,"rawMatchRatePct":3.5,"swipesPerMatch":59,"activeOrganicShare":0.47,"deliveryProb":0.12,"conditionalRightSwipeProb":0.248,"localPercentile":92.8},
  CD: {"matchRatePct":0.4,"rawMatchRatePct":1.2,"swipesPerMatch":250,"activeOrganicShare":0.44,"deliveryProb":0.042,"conditionalRightSwipeProb":0.161,"localPercentile":83.8},
  EC: {"matchRatePct":1.4,"rawMatchRatePct":2.2,"swipesPerMatch":71,"activeOrganicShare":0.52,"deliveryProb":0.12,"conditionalRightSwipeProb":0.185,"localPercentile":87.1},
  EG: {"matchRatePct":0.2,"rawMatchRatePct":0.5,"swipesPerMatch":500,"activeOrganicShare":0.46,"deliveryProb":0.052,"conditionalRightSwipeProb":0.068,"localPercentile":55.9},
  SV: {"matchRatePct":1,"rawMatchRatePct":1.8,"swipesPerMatch":100,"activeOrganicShare":0.48,"deliveryProb":0.096,"conditionalRightSwipeProb":0.167,"localPercentile":84.8},
  GQ: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"activeOrganicShare":0.44,"deliveryProb":0.079,"conditionalRightSwipeProb":0.154,"localPercentile":82.8},
  ER: {"matchRatePct":0.2,"rawMatchRatePct":1,"swipesPerMatch":500,"activeOrganicShare":0.44,"deliveryProb":0.042,"conditionalRightSwipeProb":0.077,"localPercentile":60.5},
  EE: {"matchRatePct":1,"rawMatchRatePct":1.2,"swipesPerMatch":100,"activeOrganicShare":0.6,"deliveryProb":0.124,"conditionalRightSwipeProb":0.098,"localPercentile":69},
  SZ: {"matchRatePct":0.5,"rawMatchRatePct":1.3,"swipesPerMatch":200,"activeOrganicShare":0.44,"deliveryProb":0.052,"conditionalRightSwipeProb":0.175,"localPercentile":85.8},
  ET: {"matchRatePct":0.9,"rawMatchRatePct":1.7,"swipesPerMatch":111,"activeOrganicShare":0.48,"deliveryProb":0.112,"conditionalRightSwipeProb":0.138,"localPercentile":79.6},
  FK: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"activeOrganicShare":0.48,"deliveryProb":0.104,"conditionalRightSwipeProb":0.112,"localPercentile":73.3},
  FO: {"matchRatePct":0.7,"rawMatchRatePct":0.9,"swipesPerMatch":143,"activeOrganicShare":0.6,"deliveryProb":0.087,"conditionalRightSwipeProb":0.108,"localPercentile":72.1},
  FJ: {"matchRatePct":0.6,"rawMatchRatePct":0.9,"swipesPerMatch":167,"activeOrganicShare":0.52,"deliveryProb":0.084,"conditionalRightSwipeProb":0.11,"localPercentile":72.8},
  FI: {"matchRatePct":1.1,"rawMatchRatePct":1.3,"swipesPerMatch":91,"activeOrganicShare":0.6,"deliveryProb":0.128,"conditionalRightSwipeProb":0.11,"localPercentile":72.7},
  FR: {"matchRatePct":1,"rawMatchRatePct":1.2,"swipesPerMatch":100,"activeOrganicShare":0.6,"deliveryProb":0.128,"conditionalRightSwipeProb":0.104,"localPercentile":71},
  GF: {"matchRatePct":0.6,"rawMatchRatePct":1.4,"swipesPerMatch":167,"activeOrganicShare":0.48,"deliveryProb":0.11,"conditionalRightSwipeProb":0.088,"localPercentile":65.4},
  PF: {"matchRatePct":0.6,"rawMatchRatePct":0.9,"swipesPerMatch":167,"activeOrganicShare":0.52,"deliveryProb":0.087,"conditionalRightSwipeProb":0.101,"localPercentile":69.9},
  GA: {"matchRatePct":0.8,"rawMatchRatePct":1.6,"swipesPerMatch":125,"activeOrganicShare":0.44,"deliveryProb":0.094,"conditionalRightSwipeProb":0.149,"localPercentile":81.8},
  GM: {"matchRatePct":0.6,"rawMatchRatePct":1.4,"swipesPerMatch":167,"activeOrganicShare":0.44,"deliveryProb":0.066,"conditionalRightSwipeProb":0.151,"localPercentile":82.1},
  GE: {"matchRatePct":0.3,"rawMatchRatePct":0.6,"swipesPerMatch":333,"activeOrganicShare":0.48,"deliveryProb":0.065,"conditionalRightSwipeProb":0.067,"localPercentile":55.5},
  DE: {"matchRatePct":1.2,"rawMatchRatePct":1.4,"swipesPerMatch":83,"activeOrganicShare":0.6,"deliveryProb":0.128,"conditionalRightSwipeProb":0.116,"localPercentile":74.5},
  GH: {"matchRatePct":1.5,"rawMatchRatePct":2.8,"swipesPerMatch":67,"activeOrganicShare":0.48,"deliveryProb":0.125,"conditionalRightSwipeProb":0.202,"localPercentile":89},
  GI: {"matchRatePct":1.2,"rawMatchRatePct":1.4,"swipesPerMatch":83,"activeOrganicShare":0.6,"deliveryProb":0.128,"conditionalRightSwipeProb":0.126,"localPercentile":77},
  GR: {"matchRatePct":1,"rawMatchRatePct":1.2,"swipesPerMatch":100,"activeOrganicShare":0.6,"deliveryProb":0.126,"conditionalRightSwipeProb":0.106,"localPercentile":71.6},
  GL: {"matchRatePct":1,"rawMatchRatePct":1.2,"swipesPerMatch":100,"activeOrganicShare":0.6,"deliveryProb":0.125,"conditionalRightSwipeProb":0.103,"localPercentile":70.6},
  GD: {"matchRatePct":0.6,"rawMatchRatePct":1.4,"swipesPerMatch":167,"activeOrganicShare":0.48,"deliveryProb":0.073,"conditionalRightSwipeProb":0.137,"localPercentile":79.5},
  GP: {"matchRatePct":0.6,"rawMatchRatePct":1.4,"swipesPerMatch":167,"activeOrganicShare":0.48,"deliveryProb":0.115,"conditionalRightSwipeProb":0.087,"localPercentile":64.8},
  GU: {"matchRatePct":0.8,"rawMatchRatePct":1.1,"swipesPerMatch":125,"activeOrganicShare":0.52,"deliveryProb":0.106,"conditionalRightSwipeProb":0.105,"localPercentile":71.4},
  GT: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"activeOrganicShare":0.48,"deliveryProb":0.079,"conditionalRightSwipeProb":0.156,"localPercentile":83.1},
  GG: {"matchRatePct":1,"rawMatchRatePct":1.2,"swipesPerMatch":100,"activeOrganicShare":0.6,"deliveryProb":0.098,"conditionalRightSwipeProb":0.128,"localPercentile":77.5},
  GN: {"matchRatePct":0.2,"rawMatchRatePct":1,"swipesPerMatch":500,"activeOrganicShare":0.44,"deliveryProb":0.042,"conditionalRightSwipeProb":0.079,"localPercentile":61.4},
  GW: {"matchRatePct":0.2,"rawMatchRatePct":1,"swipesPerMatch":500,"activeOrganicShare":0.44,"deliveryProb":0.044,"conditionalRightSwipeProb":0.078,"localPercentile":60.8},
  GY: {"matchRatePct":0.6,"rawMatchRatePct":1.4,"swipesPerMatch":167,"activeOrganicShare":0.48,"deliveryProb":0.075,"conditionalRightSwipeProb":0.143,"localPercentile":80.6},
  HT: {"matchRatePct":0.2,"rawMatchRatePct":1,"swipesPerMatch":500,"activeOrganicShare":0.48,"deliveryProb":0.07,"conditionalRightSwipeProb":0.047,"localPercentile":42.7},
  HN: {"matchRatePct":0.8,"rawMatchRatePct":1.6,"swipesPerMatch":125,"activeOrganicShare":0.48,"deliveryProb":0.08,"conditionalRightSwipeProb":0.165,"localPercentile":84.4},
  HK: {"matchRatePct":1.1,"rawMatchRatePct":1.7,"swipesPerMatch":91,"activeOrganicShare":0.6,"deliveryProb":0.122,"conditionalRightSwipeProb":0.113,"localPercentile":73.7},
  HU: {"matchRatePct":1,"rawMatchRatePct":1.2,"swipesPerMatch":100,"activeOrganicShare":0.6,"deliveryProb":0.125,"conditionalRightSwipeProb":0.104,"localPercentile":71.1},
  IS: {"matchRatePct":1.1,"rawMatchRatePct":1.3,"swipesPerMatch":91,"activeOrganicShare":0.6,"deliveryProb":0.128,"conditionalRightSwipeProb":0.11,"localPercentile":72.6},
  IN: {"matchRatePct":0.2,"rawMatchRatePct":0.5,"swipesPerMatch":500,"activeOrganicShare":0.48,"deliveryProb":0.049,"conditionalRightSwipeProb":0.069,"localPercentile":56.6},
  ID: {"matchRatePct":2.6,"rawMatchRatePct":3.8,"swipesPerMatch":38,"activeOrganicShare":0.57,"deliveryProb":0.153,"conditionalRightSwipeProb":0.248,"localPercentile":92.7},
  IR: {"matchRatePct":0.1,"rawMatchRatePct":0.2,"swipesPerMatch":1000,"activeOrganicShare":0.32,"deliveryProb":0.008,"conditionalRightSwipeProb":0.069,"localPercentile":56.3},
  IQ: {"matchRatePct":0.1,"rawMatchRatePct":0.4,"swipesPerMatch":1000,"activeOrganicShare":0.48,"deliveryProb":0.068,"conditionalRightSwipeProb":0.02,"localPercentile":16.3},
  IE: {"matchRatePct":1.1,"rawMatchRatePct":1.3,"swipesPerMatch":91,"activeOrganicShare":0.6,"deliveryProb":0.123,"conditionalRightSwipeProb":0.117,"localPercentile":74.7},
  IM: {"matchRatePct":1.1,"rawMatchRatePct":1.3,"swipesPerMatch":91,"activeOrganicShare":0.6,"deliveryProb":0.115,"conditionalRightSwipeProb":0.128,"localPercentile":77.5},
  IL: {"matchRatePct":0.3,"rawMatchRatePct":0.6,"swipesPerMatch":333,"activeOrganicShare":0.48,"deliveryProb":0.075,"conditionalRightSwipeProb":0.07,"localPercentile":56.9},
  IT: {"matchRatePct":1,"rawMatchRatePct":1.2,"swipesPerMatch":100,"activeOrganicShare":0.6,"deliveryProb":0.121,"conditionalRightSwipeProb":0.103,"localPercentile":70.7},
  CI: {"matchRatePct":0.5,"rawMatchRatePct":1.3,"swipesPerMatch":200,"activeOrganicShare":0.44,"deliveryProb":0.055,"conditionalRightSwipeProb":0.156,"localPercentile":83},
  JM: {"matchRatePct":1,"rawMatchRatePct":1.8,"swipesPerMatch":100,"activeOrganicShare":0.48,"deliveryProb":0.101,"conditionalRightSwipeProb":0.161,"localPercentile":83.8},
  JP: {"matchRatePct":0.8,"rawMatchRatePct":1.2,"swipesPerMatch":125,"activeOrganicShare":0.58,"deliveryProb":0.107,"conditionalRightSwipeProb":0.094,"localPercentile":67.5},
  JE: {"matchRatePct":0.9,"rawMatchRatePct":1.1,"swipesPerMatch":111,"activeOrganicShare":0.6,"deliveryProb":0.095,"conditionalRightSwipeProb":0.128,"localPercentile":77.5},
  JO: {"matchRatePct":0.4,"rawMatchRatePct":0.7,"swipesPerMatch":250,"activeOrganicShare":0.48,"deliveryProb":0.075,"conditionalRightSwipeProb":0.074,"localPercentile":59},
  KZ: {"matchRatePct":0.3,"rawMatchRatePct":0.6,"swipesPerMatch":333,"activeOrganicShare":0.48,"deliveryProb":0.069,"conditionalRightSwipeProb":0.071,"localPercentile":57.4},
  KE: {"matchRatePct":1.6,"rawMatchRatePct":3.3,"swipesPerMatch":63,"activeOrganicShare":0.48,"deliveryProb":0.133,"conditionalRightSwipeProb":0.21,"localPercentile":89.8},
  KI: {"matchRatePct":0.5,"rawMatchRatePct":0.8,"swipesPerMatch":200,"activeOrganicShare":0.52,"deliveryProb":0.073,"conditionalRightSwipeProb":0.1,"localPercentile":69.7},
  XK: {"matchRatePct":0.8,"rawMatchRatePct":1,"swipesPerMatch":125,"activeOrganicShare":0.6,"deliveryProb":0.105,"conditionalRightSwipeProb":0.093,"localPercentile":67.1},
  KW: {"matchRatePct":0.4,"rawMatchRatePct":0.7,"swipesPerMatch":250,"activeOrganicShare":0.48,"deliveryProb":0.075,"conditionalRightSwipeProb":0.073,"localPercentile":58.6},
  KG: {"matchRatePct":0.2,"rawMatchRatePct":0.5,"swipesPerMatch":500,"activeOrganicShare":0.48,"deliveryProb":0.057,"conditionalRightSwipeProb":0.066,"localPercentile":54.6},
  LA: {"matchRatePct":1.5,"rawMatchRatePct":2.4,"swipesPerMatch":67,"activeOrganicShare":0.5,"deliveryProb":0.125,"conditionalRightSwipeProb":0.197,"localPercentile":88.5},
  LV: {"matchRatePct":0.9,"rawMatchRatePct":1.1,"swipesPerMatch":111,"activeOrganicShare":0.6,"deliveryProb":0.123,"conditionalRightSwipeProb":0.089,"localPercentile":65.6},
  LB: {"matchRatePct":0.5,"rawMatchRatePct":0.8,"swipesPerMatch":200,"activeOrganicShare":0.48,"deliveryProb":0.075,"conditionalRightSwipeProb":0.099,"localPercentile":69.4},
  LS: {"matchRatePct":0.5,"rawMatchRatePct":1.3,"swipesPerMatch":200,"activeOrganicShare":0.44,"deliveryProb":0.055,"conditionalRightSwipeProb":0.154,"localPercentile":82.8},
  LR: {"matchRatePct":0.4,"rawMatchRatePct":1.2,"swipesPerMatch":250,"activeOrganicShare":0.44,"deliveryProb":0.051,"conditionalRightSwipeProb":0.157,"localPercentile":83.3},
  LY: {"matchRatePct":0.2,"rawMatchRatePct":0.5,"swipesPerMatch":500,"activeOrganicShare":0.48,"deliveryProb":0.075,"conditionalRightSwipeProb":0.038,"localPercentile":34.6},
  LI: {"matchRatePct":0.7,"rawMatchRatePct":0.9,"swipesPerMatch":143,"activeOrganicShare":0.6,"deliveryProb":0.086,"conditionalRightSwipeProb":0.109,"localPercentile":72.3},
  LT: {"matchRatePct":0.9,"rawMatchRatePct":1.1,"swipesPerMatch":111,"activeOrganicShare":0.6,"deliveryProb":0.121,"conditionalRightSwipeProb":0.097,"localPercentile":68.5},
  LU: {"matchRatePct":1.1,"rawMatchRatePct":1.3,"swipesPerMatch":91,"activeOrganicShare":0.6,"deliveryProb":0.128,"conditionalRightSwipeProb":0.114,"localPercentile":74},
  MO: {"matchRatePct":1,"rawMatchRatePct":1.2,"swipesPerMatch":100,"activeOrganicShare":0.6,"deliveryProb":0.128,"conditionalRightSwipeProb":0.1,"localPercentile":69.4},
  MG: {"matchRatePct":0.4,"rawMatchRatePct":1.2,"swipesPerMatch":250,"activeOrganicShare":0.44,"deliveryProb":0.042,"conditionalRightSwipeProb":0.152,"localPercentile":82.4},
  MW: {"matchRatePct":0.4,"rawMatchRatePct":1.2,"swipesPerMatch":250,"activeOrganicShare":0.44,"deliveryProb":0.042,"conditionalRightSwipeProb":0.17,"localPercentile":85.2},
  MY: {"matchRatePct":1.3,"rawMatchRatePct":1.9,"swipesPerMatch":77,"activeOrganicShare":0.58,"deliveryProb":0.127,"conditionalRightSwipeProb":0.134,"localPercentile":78.8},
  MV: {"matchRatePct":0.4,"rawMatchRatePct":0.6,"swipesPerMatch":250,"activeOrganicShare":0.6,"deliveryProb":0.097,"conditionalRightSwipeProb":0.053,"localPercentile":46.6},
  ML: {"matchRatePct":0.2,"rawMatchRatePct":1,"swipesPerMatch":500,"activeOrganicShare":0.44,"deliveryProb":0.042,"conditionalRightSwipeProb":0.081,"localPercentile":62.1},
  MT: {"matchRatePct":1.1,"rawMatchRatePct":1.3,"swipesPerMatch":91,"activeOrganicShare":0.6,"deliveryProb":0.128,"conditionalRightSwipeProb":0.107,"localPercentile":71.9},
  MH: {"matchRatePct":0.6,"rawMatchRatePct":0.9,"swipesPerMatch":167,"activeOrganicShare":0.52,"deliveryProb":0.091,"conditionalRightSwipeProb":0.102,"localPercentile":70.1},
  MQ: {"matchRatePct":0.6,"rawMatchRatePct":1.4,"swipesPerMatch":167,"activeOrganicShare":0.48,"deliveryProb":0.112,"conditionalRightSwipeProb":0.087,"localPercentile":64.7},
  MR: {"matchRatePct":0.2,"rawMatchRatePct":1,"swipesPerMatch":500,"activeOrganicShare":0.44,"deliveryProb":0.062,"conditionalRightSwipeProb":0.048,"localPercentile":43.3},
  MU: {"matchRatePct":0.6,"rawMatchRatePct":1.4,"swipesPerMatch":167,"activeOrganicShare":0.44,"deliveryProb":0.066,"conditionalRightSwipeProb":0.167,"localPercentile":84.8},
  YT: {"matchRatePct":0.4,"rawMatchRatePct":1.2,"swipesPerMatch":250,"activeOrganicShare":0.44,"deliveryProb":0.062,"conditionalRightSwipeProb":0.098,"localPercentile":69},
  MX: {"matchRatePct":1.4,"rawMatchRatePct":2.2,"swipesPerMatch":71,"activeOrganicShare":0.55,"deliveryProb":0.12,"conditionalRightSwipeProb":0.176,"localPercentile":86},
  FM: {"matchRatePct":0.3,"rawMatchRatePct":0.6,"swipesPerMatch":333,"activeOrganicShare":0.52,"deliveryProb":0.046,"conditionalRightSwipeProb":0.106,"localPercentile":71.5},
  MD: {"matchRatePct":0.7,"rawMatchRatePct":0.9,"swipesPerMatch":143,"activeOrganicShare":0.6,"deliveryProb":0.092,"conditionalRightSwipeProb":0.098,"localPercentile":69},
  MC: {"matchRatePct":1,"rawMatchRatePct":1.2,"swipesPerMatch":100,"activeOrganicShare":0.6,"deliveryProb":0.128,"conditionalRightSwipeProb":0.096,"localPercentile":68.2},
  MN: {"matchRatePct":0.9,"rawMatchRatePct":1.1,"swipesPerMatch":111,"activeOrganicShare":0.6,"deliveryProb":0.119,"conditionalRightSwipeProb":0.091,"localPercentile":66.2},
  ME: {"matchRatePct":0.9,"rawMatchRatePct":1.1,"swipesPerMatch":111,"activeOrganicShare":0.6,"deliveryProb":0.118,"conditionalRightSwipeProb":0.1,"localPercentile":69.7},
  MS: {"matchRatePct":0.4,"rawMatchRatePct":1.2,"swipesPerMatch":250,"activeOrganicShare":0.48,"deliveryProb":0.049,"conditionalRightSwipeProb":0.137,"localPercentile":79.5},
  MA: {"matchRatePct":0.4,"rawMatchRatePct":0.9,"swipesPerMatch":250,"activeOrganicShare":0.5,"deliveryProb":0.072,"conditionalRightSwipeProb":0.075,"localPercentile":59.7},
  MZ: {"matchRatePct":0.4,"rawMatchRatePct":1.2,"swipesPerMatch":250,"activeOrganicShare":0.44,"deliveryProb":0.042,"conditionalRightSwipeProb":0.162,"localPercentile":84},
  MM: {"matchRatePct":0.7,"rawMatchRatePct":1.2,"swipesPerMatch":143,"activeOrganicShare":0.45,"deliveryProb":0.094,"conditionalRightSwipeProb":0.134,"localPercentile":78.9},
  NA: {"matchRatePct":0.6,"rawMatchRatePct":1.4,"swipesPerMatch":167,"activeOrganicShare":0.44,"deliveryProb":0.067,"conditionalRightSwipeProb":0.173,"localPercentile":85.7},
  NR: {"matchRatePct":0.8,"rawMatchRatePct":1.1,"swipesPerMatch":125,"activeOrganicShare":0.52,"deliveryProb":0.106,"conditionalRightSwipeProb":0.108,"localPercentile":72},
  NP: {"matchRatePct":0.5,"rawMatchRatePct":0.8,"swipesPerMatch":200,"activeOrganicShare":0.52,"deliveryProb":0.068,"conditionalRightSwipeProb":0.111,"localPercentile":73},
  NL: {"matchRatePct":1.3,"rawMatchRatePct":1.4,"swipesPerMatch":77,"activeOrganicShare":0.65,"deliveryProb":0.13,"conditionalRightSwipeProb":0.121,"localPercentile":75.8},
  NC: {"matchRatePct":0.6,"rawMatchRatePct":0.9,"swipesPerMatch":167,"activeOrganicShare":0.52,"deliveryProb":0.09,"conditionalRightSwipeProb":0.099,"localPercentile":69.2},
  NZ: {"matchRatePct":0.8,"rawMatchRatePct":1.1,"swipesPerMatch":125,"activeOrganicShare":0.52,"deliveryProb":0.106,"conditionalRightSwipeProb":0.115,"localPercentile":74.3},
  NI: {"matchRatePct":0.8,"rawMatchRatePct":1.6,"swipesPerMatch":125,"activeOrganicShare":0.48,"deliveryProb":0.082,"conditionalRightSwipeProb":0.157,"localPercentile":83.2},
  NE: {"matchRatePct":0.2,"rawMatchRatePct":1,"swipesPerMatch":500,"activeOrganicShare":0.44,"deliveryProb":0.042,"conditionalRightSwipeProb":0.077,"localPercentile":60.3},
  NG: {"matchRatePct":0.9,"rawMatchRatePct":2.6,"swipesPerMatch":111,"activeOrganicShare":0.42,"deliveryProb":0.112,"conditionalRightSwipeProb":0.161,"localPercentile":83.8},
  NU: {"matchRatePct":0.7,"rawMatchRatePct":1,"swipesPerMatch":143,"activeOrganicShare":0.52,"deliveryProb":0.092,"conditionalRightSwipeProb":0.107,"localPercentile":71.7},
  NF: {"matchRatePct":0.4,"rawMatchRatePct":0.7,"swipesPerMatch":250,"activeOrganicShare":0.52,"deliveryProb":0.046,"conditionalRightSwipeProb":0.126,"localPercentile":76.9},
  KP: {"matchRatePct":0.1,"rawMatchRatePct":0.1,"swipesPerMatch":1000,"activeOrganicShare":0.1,"deliveryProb":0.001,"conditionalRightSwipeProb":0.004,"localPercentile":1},
  MK: {"matchRatePct":1,"rawMatchRatePct":1.2,"swipesPerMatch":100,"activeOrganicShare":0.6,"deliveryProb":0.119,"conditionalRightSwipeProb":0.104,"localPercentile":70.8},
  MP: {"matchRatePct":0.7,"rawMatchRatePct":1,"swipesPerMatch":143,"activeOrganicShare":0.52,"deliveryProb":0.096,"conditionalRightSwipeProb":0.105,"localPercentile":71.3},
  NO: {"matchRatePct":1.1,"rawMatchRatePct":1.3,"swipesPerMatch":91,"activeOrganicShare":0.6,"deliveryProb":0.128,"conditionalRightSwipeProb":0.109,"localPercentile":72.5},
  OM: {"matchRatePct":0.4,"rawMatchRatePct":0.7,"swipesPerMatch":250,"activeOrganicShare":0.48,"deliveryProb":0.075,"conditionalRightSwipeProb":0.073,"localPercentile":58.2},
  PK: {"matchRatePct":0.2,"rawMatchRatePct":0.3,"swipesPerMatch":500,"activeOrganicShare":0.42,"deliveryProb":0.036,"conditionalRightSwipeProb":0.077,"localPercentile":60.5},
  PW: {"matchRatePct":0.7,"rawMatchRatePct":1,"swipesPerMatch":143,"activeOrganicShare":0.52,"deliveryProb":0.103,"conditionalRightSwipeProb":0.107,"localPercentile":71.7},
  PS: {"matchRatePct":0.2,"rawMatchRatePct":0.5,"swipesPerMatch":500,"activeOrganicShare":0.48,"deliveryProb":0.075,"conditionalRightSwipeProb":0.035,"localPercentile":32.2},
  PA: {"matchRatePct":1.3,"rawMatchRatePct":2.3,"swipesPerMatch":77,"activeOrganicShare":0.52,"deliveryProb":0.114,"conditionalRightSwipeProb":0.175,"localPercentile":85.9},
  PG: {"matchRatePct":0.3,"rawMatchRatePct":0.6,"swipesPerMatch":333,"activeOrganicShare":0.52,"deliveryProb":0.046,"conditionalRightSwipeProb":0.084,"localPercentile":63.4},
  PY: {"matchRatePct":1,"rawMatchRatePct":1.8,"swipesPerMatch":100,"activeOrganicShare":0.48,"deliveryProb":0.103,"conditionalRightSwipeProb":0.154,"localPercentile":82.8},
  PE: {"matchRatePct":1.7,"rawMatchRatePct":2.5,"swipesPerMatch":59,"activeOrganicShare":0.55,"deliveryProb":0.127,"conditionalRightSwipeProb":0.198,"localPercentile":88.7},
  PH: {"matchRatePct":3.2,"rawMatchRatePct":4.9,"swipesPerMatch":31,"activeOrganicShare":0.56,"deliveryProb":0.163,"conditionalRightSwipeProb":0.299,"localPercentile":95.4},
  PN: {"matchRatePct":0.4,"rawMatchRatePct":0.7,"swipesPerMatch":250,"activeOrganicShare":0.52,"deliveryProb":0.048,"conditionalRightSwipeProb":0.122,"localPercentile":76.1},
  PL: {"matchRatePct":0.9,"rawMatchRatePct":1.1,"swipesPerMatch":111,"activeOrganicShare":0.6,"deliveryProb":0.113,"conditionalRightSwipeProb":0.102,"localPercentile":70.2},
  PT: {"matchRatePct":1,"rawMatchRatePct":1.2,"swipesPerMatch":100,"activeOrganicShare":0.6,"deliveryProb":0.114,"conditionalRightSwipeProb":0.117,"localPercentile":74.8},
  PR: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"activeOrganicShare":0.48,"deliveryProb":0.115,"conditionalRightSwipeProb":0.093,"localPercentile":67.2},
  QA: {"matchRatePct":0.4,"rawMatchRatePct":0.7,"swipesPerMatch":250,"activeOrganicShare":0.48,"deliveryProb":0.075,"conditionalRightSwipeProb":0.073,"localPercentile":58.4},
  RE: {"matchRatePct":0.6,"rawMatchRatePct":1.4,"swipesPerMatch":167,"activeOrganicShare":0.44,"deliveryProb":0.098,"conditionalRightSwipeProb":0.1,"localPercentile":69.5},
  RO: {"matchRatePct":1,"rawMatchRatePct":1.2,"swipesPerMatch":100,"activeOrganicShare":0.6,"deliveryProb":0.11,"conditionalRightSwipeProb":0.112,"localPercentile":73.3},
  RU: {"matchRatePct":0.1,"rawMatchRatePct":0.2,"swipesPerMatch":1000,"activeOrganicShare":0.38,"deliveryProb":0.01,"conditionalRightSwipeProb":0.053,"localPercentile":46.4},
  RW: {"matchRatePct":1.2,"rawMatchRatePct":1.9,"swipesPerMatch":83,"activeOrganicShare":0.52,"deliveryProb":0.12,"conditionalRightSwipeProb":0.159,"localPercentile":83.6},
  BL: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"activeOrganicShare":0.48,"deliveryProb":0.115,"conditionalRightSwipeProb":0.092,"localPercentile":66.8},
  SH: {"matchRatePct":0.3,"rawMatchRatePct":1.1,"swipesPerMatch":333,"activeOrganicShare":0.44,"deliveryProb":0.045,"conditionalRightSwipeProb":0.123,"localPercentile":76.3},
  KN: {"matchRatePct":0.6,"rawMatchRatePct":1.4,"swipesPerMatch":167,"activeOrganicShare":0.48,"deliveryProb":0.074,"conditionalRightSwipeProb":0.135,"localPercentile":79},
  LC: {"matchRatePct":0.6,"rawMatchRatePct":1.4,"swipesPerMatch":167,"activeOrganicShare":0.48,"deliveryProb":0.066,"conditionalRightSwipeProb":0.135,"localPercentile":79.1},
  MF: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"activeOrganicShare":0.48,"deliveryProb":0.115,"conditionalRightSwipeProb":0.102,"localPercentile":70.4},
  PM: {"matchRatePct":1.1,"rawMatchRatePct":1.3,"swipesPerMatch":91,"activeOrganicShare":0.6,"deliveryProb":0.128,"conditionalRightSwipeProb":0.115,"localPercentile":74.1},
  VC: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"activeOrganicShare":0.48,"deliveryProb":0.085,"conditionalRightSwipeProb":0.137,"localPercentile":79.5},
  WS: {"matchRatePct":0.4,"rawMatchRatePct":0.7,"swipesPerMatch":250,"activeOrganicShare":0.52,"deliveryProb":0.059,"conditionalRightSwipeProb":0.096,"localPercentile":68.3},
  SM: {"matchRatePct":1,"rawMatchRatePct":1.2,"swipesPerMatch":100,"activeOrganicShare":0.6,"deliveryProb":0.128,"conditionalRightSwipeProb":0.099,"localPercentile":69.3},
  ST: {"matchRatePct":0.6,"rawMatchRatePct":1.4,"swipesPerMatch":167,"activeOrganicShare":0.44,"deliveryProb":0.075,"conditionalRightSwipeProb":0.15,"localPercentile":82.1},
  SA: {"matchRatePct":0.2,"rawMatchRatePct":0.4,"swipesPerMatch":500,"activeOrganicShare":0.42,"deliveryProb":0.044,"conditionalRightSwipeProb":0.075,"localPercentile":59.2},
  SN: {"matchRatePct":0.4,"rawMatchRatePct":1.2,"swipesPerMatch":250,"activeOrganicShare":0.44,"deliveryProb":0.067,"conditionalRightSwipeProb":0.104,"localPercentile":71},
  RS: {"matchRatePct":0.9,"rawMatchRatePct":1.1,"swipesPerMatch":111,"activeOrganicShare":0.6,"deliveryProb":0.114,"conditionalRightSwipeProb":0.096,"localPercentile":68.2},
  SC: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"activeOrganicShare":0.44,"deliveryProb":0.078,"conditionalRightSwipeProb":0.162,"localPercentile":84},
  SL: {"matchRatePct":0.4,"rawMatchRatePct":1.2,"swipesPerMatch":250,"activeOrganicShare":0.44,"deliveryProb":0.042,"conditionalRightSwipeProb":0.167,"localPercentile":84.8},
  SG: {"matchRatePct":1.2,"rawMatchRatePct":1.6,"swipesPerMatch":83,"activeOrganicShare":0.64,"deliveryProb":0.125,"conditionalRightSwipeProb":0.115,"localPercentile":74.2},
  SX: {"matchRatePct":0.9,"rawMatchRatePct":1.7,"swipesPerMatch":111,"activeOrganicShare":0.48,"deliveryProb":0.115,"conditionalRightSwipeProb":0.127,"localPercentile":77.3},
  SK: {"matchRatePct":0.8,"rawMatchRatePct":1,"swipesPerMatch":125,"activeOrganicShare":0.6,"deliveryProb":0.109,"conditionalRightSwipeProb":0.092,"localPercentile":66.8},
  SI: {"matchRatePct":0.9,"rawMatchRatePct":1.1,"swipesPerMatch":111,"activeOrganicShare":0.6,"deliveryProb":0.112,"conditionalRightSwipeProb":0.103,"localPercentile":70.5},
  SB: {"matchRatePct":0.3,"rawMatchRatePct":0.6,"swipesPerMatch":333,"activeOrganicShare":0.52,"deliveryProb":0.046,"conditionalRightSwipeProb":0.096,"localPercentile":68.3},
  SO: {"matchRatePct":0.1,"rawMatchRatePct":0.9,"swipesPerMatch":1000,"activeOrganicShare":0.44,"deliveryProb":0.048,"conditionalRightSwipeProb":0.015,"localPercentile":11},
  ZA: {"matchRatePct":1.3,"rawMatchRatePct":2.1,"swipesPerMatch":77,"activeOrganicShare":0.54,"deliveryProb":0.125,"conditionalRightSwipeProb":0.149,"localPercentile":81.8},
  KR: {"matchRatePct":0.7,"rawMatchRatePct":1,"swipesPerMatch":143,"activeOrganicShare":0.58,"deliveryProb":0.101,"conditionalRightSwipeProb":0.084,"localPercentile":63.5},
  SS: {"matchRatePct":0.2,"rawMatchRatePct":1,"swipesPerMatch":500,"activeOrganicShare":0.44,"deliveryProb":0.042,"conditionalRightSwipeProb":0.077,"localPercentile":60.3},
  ES: {"matchRatePct":1,"rawMatchRatePct":1.2,"swipesPerMatch":100,"activeOrganicShare":0.6,"deliveryProb":0.128,"conditionalRightSwipeProb":0.099,"localPercentile":69.3},
  LK: {"matchRatePct":0.4,"rawMatchRatePct":0.7,"swipesPerMatch":250,"activeOrganicShare":0.5,"deliveryProb":0.065,"conditionalRightSwipeProb":0.105,"localPercentile":71.3},
  SD: {"matchRatePct":0.1,"rawMatchRatePct":0.4,"swipesPerMatch":1000,"activeOrganicShare":0.48,"deliveryProb":0.032,"conditionalRightSwipeProb":0.039,"localPercentile":36},
  SR: {"matchRatePct":0.8,"rawMatchRatePct":1.6,"swipesPerMatch":125,"activeOrganicShare":0.48,"deliveryProb":0.105,"conditionalRightSwipeProb":0.117,"localPercentile":74.8},
  SJ: {"matchRatePct":1.1,"rawMatchRatePct":1.3,"swipesPerMatch":91,"activeOrganicShare":0.6,"deliveryProb":0.128,"conditionalRightSwipeProb":0.111,"localPercentile":73},
  SE: {"matchRatePct":1.1,"rawMatchRatePct":1.3,"swipesPerMatch":91,"activeOrganicShare":0.6,"deliveryProb":0.128,"conditionalRightSwipeProb":0.109,"localPercentile":72.4},
  CH: {"matchRatePct":1.1,"rawMatchRatePct":1.3,"swipesPerMatch":91,"activeOrganicShare":0.6,"deliveryProb":0.128,"conditionalRightSwipeProb":0.114,"localPercentile":74},
  SY: {"matchRatePct":0.1,"rawMatchRatePct":0.1,"swipesPerMatch":1000,"activeOrganicShare":0.28,"deliveryProb":0.005,"conditionalRightSwipeProb":0.015,"localPercentile":11},
  TW: {"matchRatePct":1,"rawMatchRatePct":1.4,"swipesPerMatch":100,"activeOrganicShare":0.62,"deliveryProb":0.122,"conditionalRightSwipeProb":0.102,"localPercentile":70.4},
  TJ: {"matchRatePct":0.2,"rawMatchRatePct":0.5,"swipesPerMatch":500,"activeOrganicShare":0.48,"deliveryProb":0.037,"conditionalRightSwipeProb":0.065,"localPercentile":54.1},
  TZ: {"matchRatePct":1.3,"rawMatchRatePct":2.7,"swipesPerMatch":77,"activeOrganicShare":0.46,"deliveryProb":0.122,"conditionalRightSwipeProb":0.182,"localPercentile":86.9},
  TH: {"matchRatePct":2.3,"rawMatchRatePct":4.5,"swipesPerMatch":43,"activeOrganicShare":0.5,"deliveryProb":0.146,"conditionalRightSwipeProb":0.27,"localPercentile":94},
  TL: {"matchRatePct":0.5,"rawMatchRatePct":0.7,"swipesPerMatch":200,"activeOrganicShare":0.6,"deliveryProb":0.055,"conditionalRightSwipeProb":0.112,"localPercentile":73.3},
  TG: {"matchRatePct":0.4,"rawMatchRatePct":1.2,"swipesPerMatch":250,"activeOrganicShare":0.44,"deliveryProb":0.048,"conditionalRightSwipeProb":0.162,"localPercentile":84},
  TK: {"matchRatePct":0.3,"rawMatchRatePct":0.6,"swipesPerMatch":333,"activeOrganicShare":0.52,"deliveryProb":0.048,"conditionalRightSwipeProb":0.101,"localPercentile":70.1},
  TO: {"matchRatePct":0.4,"rawMatchRatePct":0.7,"swipesPerMatch":250,"activeOrganicShare":0.52,"deliveryProb":0.056,"conditionalRightSwipeProb":0.096,"localPercentile":68.3},
  TT: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"activeOrganicShare":0.48,"deliveryProb":0.093,"conditionalRightSwipeProb":0.131,"localPercentile":78.1},
  TN: {"matchRatePct":0.3,"rawMatchRatePct":0.6,"swipesPerMatch":333,"activeOrganicShare":0.48,"deliveryProb":0.065,"conditionalRightSwipeProb":0.082,"localPercentile":62.8},
  TR: {"matchRatePct":0.6,"rawMatchRatePct":1,"swipesPerMatch":167,"activeOrganicShare":0.55,"deliveryProb":0.094,"conditionalRightSwipeProb":0.082,"localPercentile":62.5},
  TM: {"matchRatePct":0.2,"rawMatchRatePct":0.5,"swipesPerMatch":500,"activeOrganicShare":0.48,"deliveryProb":0.038,"conditionalRightSwipeProb":0.073,"localPercentile":58.7},
  TC: {"matchRatePct":0.9,"rawMatchRatePct":1.7,"swipesPerMatch":111,"activeOrganicShare":0.48,"deliveryProb":0.115,"conditionalRightSwipeProb":0.134,"localPercentile":78.9},
  TV: {"matchRatePct":0.6,"rawMatchRatePct":0.9,"swipesPerMatch":167,"activeOrganicShare":0.52,"deliveryProb":0.088,"conditionalRightSwipeProb":0.105,"localPercentile":71.2},
  UG: {"matchRatePct":1.3,"rawMatchRatePct":2.7,"swipesPerMatch":77,"activeOrganicShare":0.46,"deliveryProb":0.125,"conditionalRightSwipeProb":0.182,"localPercentile":86.7},
  UA: {"matchRatePct":0.9,"rawMatchRatePct":1.1,"swipesPerMatch":111,"activeOrganicShare":0.6,"deliveryProb":0.116,"conditionalRightSwipeProb":0.101,"localPercentile":69.9},
  AE: {"matchRatePct":0.4,"rawMatchRatePct":2.2,"swipesPerMatch":250,"activeOrganicShare":0.42,"deliveryProb":0.072,"conditionalRightSwipeProb":0.091,"localPercentile":66.6},
  GB: {"matchRatePct":1.2,"rawMatchRatePct":1.4,"swipesPerMatch":83,"activeOrganicShare":0.6,"deliveryProb":0.128,"conditionalRightSwipeProb":0.119,"localPercentile":75.4},
  US: {"matchRatePct":1.2,"rawMatchRatePct":1.4,"swipesPerMatch":83,"activeOrganicShare":0.6,"deliveryProb":0.128,"conditionalRightSwipeProb":0.124,"localPercentile":76.6},
  UM: {"matchRatePct":1.3,"rawMatchRatePct":1.5,"swipesPerMatch":77,"activeOrganicShare":0.6,"deliveryProb":0.128,"conditionalRightSwipeProb":0.132,"localPercentile":78.3},
  VI: {"matchRatePct":0.9,"rawMatchRatePct":1.7,"swipesPerMatch":111,"activeOrganicShare":0.48,"deliveryProb":0.115,"conditionalRightSwipeProb":0.131,"localPercentile":78.3},
  UY: {"matchRatePct":0.7,"rawMatchRatePct":0.9,"swipesPerMatch":143,"activeOrganicShare":0.6,"deliveryProb":0.12,"conditionalRightSwipeProb":0.07,"localPercentile":57.1},
  UZ: {"matchRatePct":0.3,"rawMatchRatePct":0.6,"swipesPerMatch":333,"activeOrganicShare":0.48,"deliveryProb":0.063,"conditionalRightSwipeProb":0.065,"localPercentile":54.3},
  VU: {"matchRatePct":0.3,"rawMatchRatePct":0.6,"swipesPerMatch":333,"activeOrganicShare":0.52,"deliveryProb":0.046,"conditionalRightSwipeProb":0.096,"localPercentile":68.3},
  VA: {"matchRatePct":0.9,"rawMatchRatePct":1.1,"swipesPerMatch":111,"activeOrganicShare":0.6,"deliveryProb":0.128,"conditionalRightSwipeProb":0.092,"localPercentile":66.7},
  VE: {"matchRatePct":0.9,"rawMatchRatePct":2,"swipesPerMatch":111,"activeOrganicShare":0.45,"deliveryProb":0.099,"conditionalRightSwipeProb":0.154,"localPercentile":82.7},
  VN: {"matchRatePct":2,"rawMatchRatePct":3.1,"swipesPerMatch":50,"activeOrganicShare":0.55,"deliveryProb":0.14,"conditionalRightSwipeProb":0.211,"localPercentile":89.9},
  WF: {"matchRatePct":0.3,"rawMatchRatePct":0.6,"swipesPerMatch":333,"activeOrganicShare":0.52,"deliveryProb":0.046,"conditionalRightSwipeProb":0.095,"localPercentile":67.9},
  EH: {"matchRatePct":0.3,"rawMatchRatePct":0.6,"swipesPerMatch":333,"activeOrganicShare":0.48,"deliveryProb":0.069,"conditionalRightSwipeProb":0.065,"localPercentile":54.3},
  YE: {"matchRatePct":0.1,"rawMatchRatePct":0.1,"swipesPerMatch":1000,"activeOrganicShare":0.25,"deliveryProb":0.004,"conditionalRightSwipeProb":0.01,"localPercentile":5.6},
  ZM: {"matchRatePct":0.4,"rawMatchRatePct":1.2,"swipesPerMatch":250,"activeOrganicShare":0.44,"deliveryProb":0.042,"conditionalRightSwipeProb":0.18,"localPercentile":86.6},
  ZW: {"matchRatePct":0.5,"rawMatchRatePct":1.3,"swipesPerMatch":200,"activeOrganicShare":0.44,"deliveryProb":0.047,"conditionalRightSwipeProb":0.18,"localPercentile":86.6},
};

export const tinderMatchRateByUSState: Record<string, number> = {
  AL: 1.2,
  AK: 1.1,
  AZ: 1.2,
  AR: 1.2,
  CA: 1.3,
  CO: 1.2,
  CT: 1.2,
  DE: 1.2,
  DC: 1.3,
  FL: 1.2,
  GA: 1.2,
  HI: 1.4,
  ID: 1.1,
  IL: 1.2,
  IN: 1.2,
  IA: 1.1,
  KS: 1.1,
  KY: 1.2,
  LA: 1.2,
  ME: 1.1,
  MD: 1.2,
  MA: 1.1,
  MI: 1.2,
  MN: 1.1,
  MS: 1.2,
  MO: 1.2,
  MT: 1.1,
  NE: 1.1,
  NV: 1.3,
  NH: 1.1,
  NJ: 1.2,
  NM: 1.3,
  NY: 1.2,
  NC: 1.2,
  ND: 1.1,
  OH: 1.2,
  OK: 1.2,
  OR: 1.2,
  PA: 1.2,
  RI: 1.2,
  SC: 1.2,
  SD: 1.1,
  TN: 1.2,
  TX: 1.2,
  UT: 1.1,
  VT: 1.1,
  VA: 1.2,
  WA: 1.2,
  WV: 1.2,
  WI: 1.1,
  WY: 1.1,
};

export const tinderRawMatchRateByUSState: Record<string, number> = {
  AL: 1.4,
  AK: 1.3,
  AZ: 1.4,
  AR: 1.4,
  CA: 1.5,
  CO: 1.4,
  CT: 1.4,
  DE: 1.4,
  DC: 1.5,
  FL: 1.4,
  GA: 1.4,
  HI: 1.6,
  ID: 1.3,
  IL: 1.4,
  IN: 1.4,
  IA: 1.3,
  KS: 1.3,
  KY: 1.4,
  LA: 1.4,
  ME: 1.3,
  MD: 1.4,
  MA: 1.3,
  MI: 1.4,
  MN: 1.3,
  MS: 1.4,
  MO: 1.4,
  MT: 1.3,
  NE: 1.3,
  NV: 1.5,
  NH: 1.3,
  NJ: 1.4,
  NM: 1.5,
  NY: 1.4,
  NC: 1.4,
  ND: 1.3,
  OH: 1.4,
  OK: 1.4,
  OR: 1.4,
  PA: 1.4,
  RI: 1.4,
  SC: 1.4,
  SD: 1.3,
  TN: 1.4,
  TX: 1.4,
  UT: 1.3,
  VT: 1.3,
  VA: 1.4,
  WA: 1.4,
  WV: 1.4,
  WI: 1.3,
  WY: 1.3,
};

export function getTinderMatchRate(code: string, isUSState = false): number | null {
  if (!code) return null;
  const upper = code.toUpperCase();
  if (isUSState) {
    return tinderMatchRateByUSState[upper] ?? 1.1;
  }
  return tinderMatchRateByCountry[upper] ?? tinderMatchRateByUSState[upper] ?? null;
}

export function getTinderRawMatchRate(code: string, isUSState = false): number | null {
  if (!code) return null;
  const upper = code.toUpperCase();
  if (isUSState) {
    return tinderRawMatchRateByUSState[upper] ?? 1.3;
  }
  return tinderRawMatchRateByCountry[upper] ?? tinderRawMatchRateByUSState[upper] ?? null;
}

export function getTinderMatchDetails(code: string): TinderMatchBreakdown | undefined {
  if (!code) return undefined;
  return tinderMatchDetailsByCountry[code.toUpperCase()];
}
