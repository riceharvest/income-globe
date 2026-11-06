// Tinder Right-Swipe Match Rate (%) — Empirically Grounded Funnel Model (v3.2)
//
// Primary Empirical Sources:
//   - SwipeStats.io Dataset (2020–2025): 7,079 GDPR Tinder exports, 294M right swipes,
//     3.14M matches (261.7M male right swipes -> 2.56M matches = 0.98% volume-weighted
//     male match rate; 2.04% user median; R_BAR = 5.26% female right-swipe rate).
//   - Tyson et al. (2016), Queen Mary Univ. of London ("A First Look at User Activity on Tinder"):
//     0.60% baseline free-tier male match rate (1 in 167 swipes).
//   - Tinder Explore 100-City Demographic Audit (ages 21–30, 50km radius):
//     Global mean = 81% male (4.26:1 M:F). Bangkok 54%, Manila 57%, Cape Town 65%,
//     Ukraine/Norway 69%, Denmark 72%, Poland 73%, Czechia/Rio/Medellín 75%,
//     Buenos Aires 77%, Stockholm 79%, US 82.5%, NL 83%, UK/DE/FR/CA 84%, Bogotá 85%,
//     Mexico City 87%, Bucharest 88%, Athens 89%, Italy 90%, Istanbul & India 96%.
//
// Reference Profile:
//   - White Dutch Male (181 cm, Blue Eyes, Dark Hair, Fit BMI ~22.5, English + Dutch speaker)
//   - Standard/Free Tinder tier (no Platinum/Boosts), ~30–35% swipe selectivity, metro area
//
// Structural Funnel Equation:
//   M_organic(c) = 100 * A_c * [ q_c + (1 - q_c) * D_c * R_c ]
//   M_raw(c)     = M_organic(c) + B_comm(c)

export interface TinderMatchBreakdown {
  matchRatePct: number;
  rawMatchRatePct: number;
  swipesPerMatch: number;
  tinderMalePct: number;
  activeOrganicShare: number;
  deliveryProb: number;
  conditionalRightSwipeProb: number;
  localPercentile: number;
}

export const tinderMatchRateByCountry: Record<string, number> = {
  AF: 0.1, // Afghanistan (Raw: 0.1%, ~1 organic match per 1000 right-swipes, 97% male on Tinder)
  AX: 0.9, // Åland Islands (Raw: 1.1%, ~1 organic match per 111 right-swipes, 83% male on Tinder)
  AL: 0.9, // Albania (Raw: 1.1%, ~1 organic match per 111 right-swipes, 83% male on Tinder)
  DZ: 0.3, // Algeria (Raw: 0.6%, ~1 organic match per 333 right-swipes, 91% male on Tinder)
  AS: 0.7, // American Samoa (Raw: 1%, ~1 organic match per 143 right-swipes, 81% male on Tinder)
  AD: 1, // Andorra (Raw: 1.2%, ~1 organic match per 100 right-swipes, 83% male on Tinder)
  AO: 0.6, // Angola (Raw: 1.4%, ~1 organic match per 167 right-swipes, 75% male on Tinder)
  AI: 1, // Anguilla (Raw: 1.8%, ~1 organic match per 100 right-swipes, 80% male on Tinder)
  AG: 0.6, // Antigua and Barbuda (Raw: 1.4%, ~1 organic match per 167 right-swipes, 80% male on Tinder)
  AR: 0.8, // Argentina (Raw: 1.1%, ~1 organic match per 125 right-swipes, 77% male on Tinder)
  AM: 0.7, // Armenia (Raw: 0.9%, ~1 organic match per 143 right-swipes, 83% male on Tinder)
  AW: 0.7, // Aruba (Raw: 1.5%, ~1 organic match per 143 right-swipes, 80% male on Tinder)
  AU: 1.2, // Australia (Raw: 1.4%, ~1 organic match per 83 right-swipes, 82.5% male on Tinder)
  AT: 1.1, // Austria (Raw: 1.2%, ~1 organic match per 91 right-swipes, 83.5% male on Tinder)
  AZ: 0.7, // Azerbaijan (Raw: 0.9%, ~1 organic match per 143 right-swipes, 83% male on Tinder)
  BS: 0.9, // Bahamas (Raw: 1.7%, ~1 organic match per 111 right-swipes, 80% male on Tinder)
  BH: 0.4, // Bahrain (Raw: 0.7%, ~1 organic match per 250 right-swipes, 91% male on Tinder)
  BD: 0.2, // Bangladesh (Raw: 0.4%, ~1 organic match per 500 right-swipes, 95% male on Tinder)
  BB: 0.8, // Barbados (Raw: 1.6%, ~1 organic match per 125 right-swipes, 80% male on Tinder)
  BY: 0.1, // Belarus (Raw: 0.2%, ~1 organic match per 1000 right-swipes, 75% male on Tinder)
  BE: 1.2, // Belgium (Raw: 1.3%, ~1 organic match per 83 right-swipes, 83.5% male on Tinder)
  BZ: 0.7, // Belize (Raw: 1.5%, ~1 organic match per 143 right-swipes, 80% male on Tinder)
  BJ: 0.5, // Benin (Raw: 1.3%, ~1 organic match per 200 right-swipes, 75% male on Tinder)
  BM: 1.3, // Bermuda (Raw: 1.5%, ~1 organic match per 77 right-swipes, 83% male on Tinder)
  BT: 0.7, // Bhutan (Raw: 0.9%, ~1 organic match per 143 right-swipes, 83% male on Tinder)
  BO: 0.8, // Bolivia (Raw: 1.6%, ~1 organic match per 125 right-swipes, 80% male on Tinder)
  BA: 0.8, // Bosnia and Herzegovina (Raw: 1%, ~1 organic match per 125 right-swipes, 83% male on Tinder)
  BW: 0.7, // Botswana (Raw: 1.5%, ~1 organic match per 143 right-swipes, 75% male on Tinder)
  BR: 1.4, // Brazil (Raw: 2.2%, ~1 organic match per 71 right-swipes, 75.5% male on Tinder)
  IO: 0.7, // British Indian Ocean Territory (Raw: 1.5%, ~1 organic match per 143 right-swipes, 75% male on Tinder)
  VG: 0.7, // British Virgin Islands (Raw: 1.5%, ~1 organic match per 143 right-swipes, 80% male on Tinder)
  BN: 0.6, // Brunei (Raw: 0.8%, ~1 organic match per 167 right-swipes, 83% male on Tinder)
  BG: 0.9, // Bulgaria (Raw: 1.1%, ~1 organic match per 111 right-swipes, 83% male on Tinder)
  BF: 0.2, // Burkina Faso (Raw: 1%, ~1 organic match per 500 right-swipes, 75% male on Tinder)
  BI: 0.2, // Burundi (Raw: 1%, ~1 organic match per 500 right-swipes, 75% male on Tinder)
  KH: 2, // Cambodia (Raw: 3.3%, ~1 organic match per 50 right-swipes, 65% male on Tinder)
  CM: 0.5, // Cameroon (Raw: 1.3%, ~1 organic match per 200 right-swipes, 75% male on Tinder)
  CA: 1.2, // Canada (Raw: 1.4%, ~1 organic match per 83 right-swipes, 83.5% male on Tinder)
  CV: 0.8, // Cape Verde (Raw: 1.6%, ~1 organic match per 125 right-swipes, 75% male on Tinder)
  BQ: 0.8, // Caribbean Netherlands (Raw: 1.6%, ~1 organic match per 125 right-swipes, 80% male on Tinder)
  KY: 0.9, // Cayman Islands (Raw: 1.7%, ~1 organic match per 111 right-swipes, 80% male on Tinder)
  CF: 0.2, // Central African Republic (Raw: 1%, ~1 organic match per 500 right-swipes, 75% male on Tinder)
  TD: 0.2, // Chad (Raw: 1%, ~1 organic match per 500 right-swipes, 75% male on Tinder)
  CL: 0.8, // Chile (Raw: 1.1%, ~1 organic match per 125 right-swipes, 81% male on Tinder)
  CN: 0.1, // China (Raw: 0.6%, ~1 organic match per 1000 right-swipes, 82% male on Tinder)
  CX: 0.9, // Christmas Island (Raw: 1.2%, ~1 organic match per 111 right-swipes, 81% male on Tinder)
  CC: 0.9, // Cocos (Keeling) Islands (Raw: 1.2%, ~1 organic match per 111 right-swipes, 81% male on Tinder)
  CO: 1.4, // Colombia (Raw: 3.3%, ~1 organic match per 71 right-swipes, 80% male on Tinder)
  KM: 0.2, // Comoros (Raw: 1%, ~1 organic match per 500 right-swipes, 75% male on Tinder)
  CG: 0.6, // Congo (Raw: 1.4%, ~1 organic match per 167 right-swipes, 75% male on Tinder)
  CK: 0.7, // Cook Islands (Raw: 1%, ~1 organic match per 143 right-swipes, 81% male on Tinder)
  CR: 1.1, // Costa Rica (Raw: 2.1%, ~1 organic match per 91 right-swipes, 80% male on Tinder)
  HR: 1, // Croatia (Raw: 1.2%, ~1 organic match per 100 right-swipes, 78% male on Tinder)
  CU: 0.8, // Cuba (Raw: 1.6%, ~1 organic match per 125 right-swipes, 78% male on Tinder)
  CW: 0.9, // Curaçao (Raw: 1.7%, ~1 organic match per 111 right-swipes, 80% male on Tinder)
  CY: 1, // Cyprus (Raw: 1.2%, ~1 organic match per 100 right-swipes, 83% male on Tinder)
  CZ: 1.1, // Czechia (Raw: 1.3%, ~1 organic match per 91 right-swipes, 75% male on Tinder)
  DK: 1.2, // Denmark (Raw: 1.3%, ~1 organic match per 83 right-swipes, 72% male on Tinder)
  DJ: 0.4, // Djibouti (Raw: 1.2%, ~1 organic match per 250 right-swipes, 75% male on Tinder)
  DM: 0.9, // Dominica (Raw: 1.7%, ~1 organic match per 111 right-swipes, 80% male on Tinder)
  DO: 1.8, // Dominican Republic (Raw: 3.6%, ~1 organic match per 56 right-swipes, 76% male on Tinder)
  CD: 0.4, // DR Congo (Raw: 1.2%, ~1 organic match per 250 right-swipes, 75% male on Tinder)
  EC: 1.5, // Ecuador (Raw: 2.3%, ~1 organic match per 67 right-swipes, 80% male on Tinder)
  EG: 0.2, // Egypt (Raw: 0.5%, ~1 organic match per 500 right-swipes, 93% male on Tinder)
  SV: 1, // El Salvador (Raw: 1.8%, ~1 organic match per 100 right-swipes, 80% male on Tinder)
  GQ: 0.7, // Equatorial Guinea (Raw: 1.5%, ~1 organic match per 143 right-swipes, 75% male on Tinder)
  ER: 0.2, // Eritrea (Raw: 1%, ~1 organic match per 500 right-swipes, 75% male on Tinder)
  EE: 1, // Estonia (Raw: 1.2%, ~1 organic match per 100 right-swipes, 83% male on Tinder)
  SZ: 0.5, // Eswatini (Raw: 1.3%, ~1 organic match per 200 right-swipes, 75% male on Tinder)
  ET: 1, // Ethiopia (Raw: 1.8%, ~1 organic match per 100 right-swipes, 76% male on Tinder)
  FK: 0.7, // Falkland Islands (Raw: 1.5%, ~1 organic match per 143 right-swipes, 80% male on Tinder)
  FO: 0.7, // Faroe Islands (Raw: 0.9%, ~1 organic match per 143 right-swipes, 83% male on Tinder)
  FJ: 0.7, // Fiji (Raw: 1%, ~1 organic match per 143 right-swipes, 81% male on Tinder)
  FI: 1.2, // Finland (Raw: 1.3%, ~1 organic match per 83 right-swipes, 76% male on Tinder)
  FR: 1, // France (Raw: 1.2%, ~1 organic match per 100 right-swipes, 84% male on Tinder)
  GF: 0.6, // French Guiana (Raw: 1.4%, ~1 organic match per 167 right-swipes, 80% male on Tinder)
  PF: 0.6, // French Polynesia (Raw: 0.9%, ~1 organic match per 167 right-swipes, 81% male on Tinder)
  GA: 0.8, // Gabon (Raw: 1.6%, ~1 organic match per 125 right-swipes, 75% male on Tinder)
  GM: 0.6, // Gambia (Raw: 1.4%, ~1 organic match per 167 right-swipes, 75% male on Tinder)
  GE: 0.3, // Georgia (Raw: 0.6%, ~1 organic match per 333 right-swipes, 91% male on Tinder)
  DE: 1.2, // Germany (Raw: 1.3%, ~1 organic match per 83 right-swipes, 84% male on Tinder)
  GH: 1.6, // Ghana (Raw: 2.9%, ~1 organic match per 63 right-swipes, 73% male on Tinder)
  GI: 1.2, // Gibraltar (Raw: 1.4%, ~1 organic match per 83 right-swipes, 83% male on Tinder)
  GR: 0.9, // Greece (Raw: 1.1%, ~1 organic match per 111 right-swipes, 89% male on Tinder)
  GL: 1, // Greenland (Raw: 1.2%, ~1 organic match per 100 right-swipes, 83% male on Tinder)
  GD: 0.6, // Grenada (Raw: 1.4%, ~1 organic match per 167 right-swipes, 80% male on Tinder)
  GP: 0.7, // Guadeloupe (Raw: 1.5%, ~1 organic match per 143 right-swipes, 80% male on Tinder)
  GU: 0.8, // Guam (Raw: 1.1%, ~1 organic match per 125 right-swipes, 81% male on Tinder)
  GT: 0.8, // Guatemala (Raw: 1.6%, ~1 organic match per 125 right-swipes, 80% male on Tinder)
  GG: 1, // Guernsey (Raw: 1.2%, ~1 organic match per 100 right-swipes, 83% male on Tinder)
  GN: 0.2, // Guinea (Raw: 1%, ~1 organic match per 500 right-swipes, 75% male on Tinder)
  GW: 0.2, // Guinea-Bissau (Raw: 1%, ~1 organic match per 500 right-swipes, 75% male on Tinder)
  GY: 0.7, // Guyana (Raw: 1.5%, ~1 organic match per 143 right-swipes, 80% male on Tinder)
  HT: 0.2, // Haiti (Raw: 1%, ~1 organic match per 500 right-swipes, 80% male on Tinder)
  HN: 0.8, // Honduras (Raw: 1.6%, ~1 organic match per 125 right-swipes, 80% male on Tinder)
  HK: 1.1, // Hong Kong (Raw: 1.7%, ~1 organic match per 91 right-swipes, 75% male on Tinder)
  HU: 0.9, // Hungary (Raw: 1.1%, ~1 organic match per 111 right-swipes, 83% male on Tinder)
  IS: 1.1, // Iceland (Raw: 1.3%, ~1 organic match per 91 right-swipes, 83% male on Tinder)
  IN: 0.2, // India (Raw: 0.5%, ~1 organic match per 500 right-swipes, 96% male on Tinder)
  ID: 2.7, // Indonesia (Raw: 3.9%, ~1 organic match per 37 right-swipes, 64% male on Tinder)
  IR: 0.1, // Iran (Raw: 0.2%, ~1 organic match per 1000 right-swipes, 92% male on Tinder)
  IQ: 0.1, // Iraq (Raw: 0.4%, ~1 organic match per 1000 right-swipes, 91% male on Tinder)
  IE: 1.2, // Ireland (Raw: 1.3%, ~1 organic match per 83 right-swipes, 82% male on Tinder)
  IM: 1.1, // Isle of Man (Raw: 1.3%, ~1 organic match per 91 right-swipes, 83% male on Tinder)
  IL: 0.3, // Israel (Raw: 0.6%, ~1 organic match per 333 right-swipes, 91% male on Tinder)
  IT: 0.8, // Italy (Raw: 1%, ~1 organic match per 125 right-swipes, 90% male on Tinder)
  CI: 0.5, // Ivory Coast (Raw: 1.3%, ~1 organic match per 200 right-swipes, 75% male on Tinder)
  JM: 1, // Jamaica (Raw: 1.8%, ~1 organic match per 100 right-swipes, 80% male on Tinder)
  JP: 0.8, // Japan (Raw: 1.2%, ~1 organic match per 125 right-swipes, 78% male on Tinder)
  JE: 0.9, // Jersey (Raw: 1.1%, ~1 organic match per 111 right-swipes, 83% male on Tinder)
  JO: 0.4, // Jordan (Raw: 0.7%, ~1 organic match per 250 right-swipes, 91% male on Tinder)
  KZ: 0.3, // Kazakhstan (Raw: 0.6%, ~1 organic match per 333 right-swipes, 91% male on Tinder)
  KE: 1.7, // Kenya (Raw: 3.4%, ~1 organic match per 59 right-swipes, 70% male on Tinder)
  KI: 0.5, // Kiribati (Raw: 0.8%, ~1 organic match per 200 right-swipes, 81% male on Tinder)
  XK: 0.8, // Kosovo (Raw: 1%, ~1 organic match per 125 right-swipes, 83% male on Tinder)
  KW: 0.4, // Kuwait (Raw: 0.7%, ~1 organic match per 250 right-swipes, 91% male on Tinder)
  KG: 0.2, // Kyrgyzstan (Raw: 0.5%, ~1 organic match per 500 right-swipes, 91% male on Tinder)
  LA: 1.6, // Laos (Raw: 2.5%, ~1 organic match per 63 right-swipes, 68% male on Tinder)
  LV: 0.9, // Latvia (Raw: 1.1%, ~1 organic match per 111 right-swipes, 83% male on Tinder)
  LB: 0.5, // Lebanon (Raw: 0.8%, ~1 organic match per 200 right-swipes, 91% male on Tinder)
  LS: 0.5, // Lesotho (Raw: 1.3%, ~1 organic match per 200 right-swipes, 75% male on Tinder)
  LR: 0.5, // Liberia (Raw: 1.3%, ~1 organic match per 200 right-swipes, 75% male on Tinder)
  LY: 0.2, // Libya (Raw: 0.5%, ~1 organic match per 500 right-swipes, 91% male on Tinder)
  LI: 0.7, // Liechtenstein (Raw: 0.9%, ~1 organic match per 143 right-swipes, 83% male on Tinder)
  LT: 0.9, // Lithuania (Raw: 1.1%, ~1 organic match per 111 right-swipes, 83% male on Tinder)
  LU: 1.1, // Luxembourg (Raw: 1.3%, ~1 organic match per 91 right-swipes, 83% male on Tinder)
  MO: 1, // Macau (Raw: 1.2%, ~1 organic match per 100 right-swipes, 83% male on Tinder)
  MG: 0.4, // Madagascar (Raw: 1.2%, ~1 organic match per 250 right-swipes, 75% male on Tinder)
  MW: 0.4, // Malawi (Raw: 1.2%, ~1 organic match per 250 right-swipes, 75% male on Tinder)
  MY: 1.3, // Malaysia (Raw: 1.9%, ~1 organic match per 77 right-swipes, 74% male on Tinder)
  MV: 0.4, // Maldives (Raw: 0.6%, ~1 organic match per 250 right-swipes, 83% male on Tinder)
  ML: 0.2, // Mali (Raw: 1%, ~1 organic match per 500 right-swipes, 75% male on Tinder)
  MT: 1.1, // Malta (Raw: 1.3%, ~1 organic match per 91 right-swipes, 83% male on Tinder)
  MH: 0.7, // Marshall Islands (Raw: 1%, ~1 organic match per 143 right-swipes, 81% male on Tinder)
  MQ: 0.6, // Martinique (Raw: 1.4%, ~1 organic match per 167 right-swipes, 80% male on Tinder)
  MR: 0.2, // Mauritania (Raw: 1%, ~1 organic match per 500 right-swipes, 75% male on Tinder)
  MU: 0.6, // Mauritius (Raw: 1.4%, ~1 organic match per 167 right-swipes, 75% male on Tinder)
  YT: 0.4, // Mayotte (Raw: 1.2%, ~1 organic match per 250 right-swipes, 75% male on Tinder)
  MX: 1.5, // Mexico (Raw: 2.3%, ~1 organic match per 67 right-swipes, 87% male on Tinder)
  FM: 0.3, // Micronesia (Raw: 0.6%, ~1 organic match per 333 right-swipes, 81% male on Tinder)
  MD: 0.7, // Moldova (Raw: 0.9%, ~1 organic match per 143 right-swipes, 83% male on Tinder)
  MC: 1, // Monaco (Raw: 1.2%, ~1 organic match per 100 right-swipes, 83% male on Tinder)
  MN: 0.9, // Mongolia (Raw: 1.1%, ~1 organic match per 111 right-swipes, 83% male on Tinder)
  ME: 0.9, // Montenegro (Raw: 1.1%, ~1 organic match per 111 right-swipes, 83% male on Tinder)
  MS: 0.4, // Montserrat (Raw: 1.2%, ~1 organic match per 250 right-swipes, 80% male on Tinder)
  MA: 0.4, // Morocco (Raw: 0.9%, ~1 organic match per 250 right-swipes, 89% male on Tinder)
  MZ: 0.4, // Mozambique (Raw: 1.2%, ~1 organic match per 250 right-swipes, 75% male on Tinder)
  MM: 0.7, // Myanmar (Raw: 1.2%, ~1 organic match per 143 right-swipes, 78% male on Tinder)
  NA: 0.7, // Namibia (Raw: 1.5%, ~1 organic match per 143 right-swipes, 75% male on Tinder)
  NR: 0.8, // Nauru (Raw: 1.1%, ~1 organic match per 125 right-swipes, 81% male on Tinder)
  NP: 0.5, // Nepal (Raw: 0.8%, ~1 organic match per 200 right-swipes, 90% male on Tinder)
  NL: 1.3, // Netherlands (Raw: 1.4%, ~1 organic match per 77 right-swipes, 83% male on Tinder)
  NC: 0.6, // New Caledonia (Raw: 0.9%, ~1 organic match per 167 right-swipes, 81% male on Tinder)
  NZ: 1.2, // New Zealand (Raw: 1.4%, ~1 organic match per 83 right-swipes, 81.5% male on Tinder)
  NI: 0.8, // Nicaragua (Raw: 1.6%, ~1 organic match per 125 right-swipes, 80% male on Tinder)
  NE: 0.2, // Niger (Raw: 1%, ~1 organic match per 500 right-swipes, 75% male on Tinder)
  NG: 1, // Nigeria (Raw: 2.7%, ~1 organic match per 100 right-swipes, 78% male on Tinder)
  NU: 0.7, // Niue (Raw: 1%, ~1 organic match per 143 right-swipes, 81% male on Tinder)
  NF: 0.4, // Norfolk Island (Raw: 0.7%, ~1 organic match per 250 right-swipes, 81% male on Tinder)
  KP: 0.1, // North Korea (Raw: 0.1%, ~1 organic match per 1000 right-swipes, 85% male on Tinder)
  MK: 1, // North Macedonia (Raw: 1.2%, ~1 organic match per 100 right-swipes, 83% male on Tinder)
  MP: 0.7, // Northern Mariana Islands (Raw: 1%, ~1 organic match per 143 right-swipes, 81% male on Tinder)
  NO: 1.2, // Norway (Raw: 1.3%, ~1 organic match per 83 right-swipes, 69% male on Tinder)
  OM: 0.4, // Oman (Raw: 0.7%, ~1 organic match per 250 right-swipes, 91% male on Tinder)
  PK: 0.2, // Pakistan (Raw: 0.3%, ~1 organic match per 500 right-swipes, 96% male on Tinder)
  PW: 0.8, // Palau (Raw: 1.1%, ~1 organic match per 125 right-swipes, 81% male on Tinder)
  PS: 0.2, // Palestine (Raw: 0.5%, ~1 organic match per 500 right-swipes, 91% male on Tinder)
  PA: 1.3, // Panama (Raw: 2.3%, ~1 organic match per 77 right-swipes, 80% male on Tinder)
  PG: 0.3, // Papua New Guinea (Raw: 0.6%, ~1 organic match per 333 right-swipes, 81% male on Tinder)
  PY: 1, // Paraguay (Raw: 1.8%, ~1 organic match per 100 right-swipes, 80% male on Tinder)
  PE: 1.8, // Peru (Raw: 2.6%, ~1 organic match per 56 right-swipes, 79% male on Tinder)
  PH: 3.3, // Philippines (Raw: 5%, ~1 organic match per 30 right-swipes, 57% male on Tinder)
  PN: 0.4, // Pitcairn Islands (Raw: 0.7%, ~1 organic match per 250 right-swipes, 81% male on Tinder)
  PL: 1.1, // Poland (Raw: 1.3%, ~1 organic match per 91 right-swipes, 73% male on Tinder)
  PT: 1, // Portugal (Raw: 1.2%, ~1 organic match per 100 right-swipes, 87% male on Tinder)
  PR: 0.7, // Puerto Rico (Raw: 1.5%, ~1 organic match per 143 right-swipes, 80% male on Tinder)
  QA: 0.4, // Qatar (Raw: 0.7%, ~1 organic match per 250 right-swipes, 91% male on Tinder)
  RE: 0.6, // Réunion (Raw: 1.4%, ~1 organic match per 167 right-swipes, 75% male on Tinder)
  RO: 0.9, // Romania (Raw: 1.2%, ~1 organic match per 111 right-swipes, 88% male on Tinder)
  RU: 0.1, // Russia (Raw: 0.2%, ~1 organic match per 1000 right-swipes, 74% male on Tinder)
  RW: 1.3, // Rwanda (Raw: 2%, ~1 organic match per 77 right-swipes, 74% male on Tinder)
  BL: 0.7, // Saint Barthélemy (Raw: 1.5%, ~1 organic match per 143 right-swipes, 80% male on Tinder)
  SH: 0.3, // Saint Helena, Ascension and Tristan da Cunha (Raw: 1.1%, ~1 organic match per 333 right-swipes, 75% male on Tinder)
  KN: 0.6, // Saint Kitts and Nevis (Raw: 1.4%, ~1 organic match per 167 right-swipes, 80% male on Tinder)
  LC: 0.6, // Saint Lucia (Raw: 1.4%, ~1 organic match per 167 right-swipes, 80% male on Tinder)
  MF: 0.8, // Saint Martin (Raw: 1.6%, ~1 organic match per 125 right-swipes, 80% male on Tinder)
  PM: 1.1, // Saint Pierre and Miquelon (Raw: 1.3%, ~1 organic match per 91 right-swipes, 83% male on Tinder)
  VC: 0.7, // Saint Vincent and the Grenadines (Raw: 1.5%, ~1 organic match per 143 right-swipes, 80% male on Tinder)
  WS: 0.4, // Samoa (Raw: 0.7%, ~1 organic match per 250 right-swipes, 81% male on Tinder)
  SM: 1, // San Marino (Raw: 1.2%, ~1 organic match per 100 right-swipes, 83% male on Tinder)
  ST: 0.7, // São Tomé and Príncipe (Raw: 1.5%, ~1 organic match per 143 right-swipes, 75% male on Tinder)
  SA: 0.2, // Saudi Arabia (Raw: 0.4%, ~1 organic match per 500 right-swipes, 93% male on Tinder)
  SN: 0.4, // Senegal (Raw: 1.2%, ~1 organic match per 250 right-swipes, 75% male on Tinder)
  RS: 0.9, // Serbia (Raw: 1.1%, ~1 organic match per 111 right-swipes, 83% male on Tinder)
  SC: 0.7, // Seychelles (Raw: 1.5%, ~1 organic match per 143 right-swipes, 75% male on Tinder)
  SL: 0.4, // Sierra Leone (Raw: 1.2%, ~1 organic match per 250 right-swipes, 75% male on Tinder)
  SG: 1.2, // Singapore (Raw: 1.6%, ~1 organic match per 83 right-swipes, 76% male on Tinder)
  SX: 0.9, // Sint Maarten (Raw: 1.7%, ~1 organic match per 111 right-swipes, 80% male on Tinder)
  SK: 0.8, // Slovakia (Raw: 1%, ~1 organic match per 125 right-swipes, 83% male on Tinder)
  SI: 0.9, // Slovenia (Raw: 1.1%, ~1 organic match per 111 right-swipes, 83% male on Tinder)
  SB: 0.3, // Solomon Islands (Raw: 0.6%, ~1 organic match per 333 right-swipes, 81% male on Tinder)
  SO: 0.1, // Somalia (Raw: 0.9%, ~1 organic match per 1000 right-swipes, 75% male on Tinder)
  ZA: 1.3, // South Africa (Raw: 2.1%, ~1 organic match per 77 right-swipes, 65% male on Tinder)
  KR: 0.7, // South Korea (Raw: 1%, ~1 organic match per 143 right-swipes, 79% male on Tinder)
  SS: 0.2, // South Sudan (Raw: 1%, ~1 organic match per 500 right-swipes, 75% male on Tinder)
  ES: 0.9, // Spain (Raw: 1.1%, ~1 organic match per 111 right-swipes, 88% male on Tinder)
  LK: 0.5, // Sri Lanka (Raw: 0.8%, ~1 organic match per 200 right-swipes, 91% male on Tinder)
  SD: 0.1, // Sudan (Raw: 0.4%, ~1 organic match per 1000 right-swipes, 91% male on Tinder)
  SR: 0.8, // Suriname (Raw: 1.6%, ~1 organic match per 125 right-swipes, 80% male on Tinder)
  SJ: 1.1, // Svalbard and Jan Mayen (Raw: 1.3%, ~1 organic match per 91 right-swipes, 83% male on Tinder)
  SE: 1.1, // Sweden (Raw: 1.2%, ~1 organic match per 91 right-swipes, 79% male on Tinder)
  CH: 1.1, // Switzerland (Raw: 1.2%, ~1 organic match per 91 right-swipes, 83.5% male on Tinder)
  SY: 0.1, // Syria (Raw: 0.1%, ~1 organic match per 1000 right-swipes, 93% male on Tinder)
  TW: 1, // Taiwan (Raw: 1.4%, ~1 organic match per 100 right-swipes, 76% male on Tinder)
  TJ: 0.2, // Tajikistan (Raw: 0.5%, ~1 organic match per 500 right-swipes, 91% male on Tinder)
  TZ: 1.3, // Tanzania (Raw: 2.7%, ~1 organic match per 77 right-swipes, 72% male on Tinder)
  TH: 2.4, // Thailand (Raw: 4.6%, ~1 organic match per 42 right-swipes, 54% male on Tinder)
  TL: 0.5, // Timor-Leste (Raw: 0.7%, ~1 organic match per 200 right-swipes, 83% male on Tinder)
  TG: 0.5, // Togo (Raw: 1.3%, ~1 organic match per 200 right-swipes, 75% male on Tinder)
  TK: 0.3, // Tokelau (Raw: 0.6%, ~1 organic match per 333 right-swipes, 81% male on Tinder)
  TO: 0.4, // Tonga (Raw: 0.7%, ~1 organic match per 250 right-swipes, 81% male on Tinder)
  TT: 0.8, // Trinidad and Tobago (Raw: 1.6%, ~1 organic match per 125 right-swipes, 80% male on Tinder)
  TN: 0.4, // Tunisia (Raw: 0.7%, ~1 organic match per 250 right-swipes, 91% male on Tinder)
  TR: 0.6, // Türkiye (Raw: 1%, ~1 organic match per 167 right-swipes, 95.5% male on Tinder)
  TM: 0.2, // Turkmenistan (Raw: 0.5%, ~1 organic match per 500 right-swipes, 91% male on Tinder)
  TC: 1, // Turks and Caicos Islands (Raw: 1.8%, ~1 organic match per 100 right-swipes, 80% male on Tinder)
  TV: 0.7, // Tuvalu (Raw: 1%, ~1 organic match per 143 right-swipes, 81% male on Tinder)
  UG: 1.3, // Uganda (Raw: 2.7%, ~1 organic match per 77 right-swipes, 72% male on Tinder)
  UA: 0.9, // Ukraine (Raw: 1.3%, ~1 organic match per 111 right-swipes, 69% male on Tinder)
  AE: 0.4, // United Arab Emirates (Raw: 2.2%, ~1 organic match per 250 right-swipes, 91% male on Tinder)
  GB: 1.2, // United Kingdom (Raw: 1.4%, ~1 organic match per 83 right-swipes, 84% male on Tinder)
  US: 1.2, // United States (Raw: 1.5%, ~1 organic match per 83 right-swipes, 82.5% male on Tinder)
  UM: 1.3, // United States Minor Outlying Islands (Raw: 1.5%, ~1 organic match per 77 right-swipes, 83% male on Tinder)
  VI: 1, // United States Virgin Islands (Raw: 1.8%, ~1 organic match per 100 right-swipes, 80% male on Tinder)
  UY: 0.7, // Uruguay (Raw: 0.9%, ~1 organic match per 143 right-swipes, 78% male on Tinder)
  UZ: 0.3, // Uzbekistan (Raw: 0.6%, ~1 organic match per 333 right-swipes, 91% male on Tinder)
  VU: 0.3, // Vanuatu (Raw: 0.6%, ~1 organic match per 333 right-swipes, 81% male on Tinder)
  VA: 0.9, // Vatican City (Raw: 1.1%, ~1 organic match per 111 right-swipes, 83% male on Tinder)
  VE: 0.9, // Venezuela (Raw: 2%, ~1 organic match per 111 right-swipes, 78% male on Tinder)
  VN: 2.1, // Vietnam (Raw: 3.2%, ~1 organic match per 48 right-swipes, 66% male on Tinder)
  WF: 0.3, // Wallis and Futuna (Raw: 0.6%, ~1 organic match per 333 right-swipes, 81% male on Tinder)
  EH: 0.3, // Western Sahara (Raw: 0.6%, ~1 organic match per 333 right-swipes, 91% male on Tinder)
  YE: 0.1, // Yemen (Raw: 0.1%, ~1 organic match per 1000 right-swipes, 95% male on Tinder)
  ZM: 0.4, // Zambia (Raw: 1.2%, ~1 organic match per 250 right-swipes, 75% male on Tinder)
  ZW: 0.5, // Zimbabwe (Raw: 1.3%, ~1 organic match per 200 right-swipes, 75% male on Tinder)
};

export const tinderRawMatchRateByCountry: Record<string, number> = {
  AF: 0.1, // Afghanistan (Organic: 0.1%)
  AX: 1.1, // Åland Islands (Organic: 0.9%)
  AL: 1.1, // Albania (Organic: 0.9%)
  DZ: 0.6, // Algeria (Organic: 0.3%)
  AS: 1, // American Samoa (Organic: 0.7%)
  AD: 1.2, // Andorra (Organic: 1%)
  AO: 1.4, // Angola (Organic: 0.6%)
  AI: 1.8, // Anguilla (Organic: 1%)
  AG: 1.4, // Antigua and Barbuda (Organic: 0.6%)
  AR: 1.1, // Argentina (Organic: 0.8%)
  AM: 0.9, // Armenia (Organic: 0.7%)
  AW: 1.5, // Aruba (Organic: 0.7%)
  AU: 1.4, // Australia (Organic: 1.2%)
  AT: 1.2, // Austria (Organic: 1.1%)
  AZ: 0.9, // Azerbaijan (Organic: 0.7%)
  BS: 1.7, // Bahamas (Organic: 0.9%)
  BH: 0.7, // Bahrain (Organic: 0.4%)
  BD: 0.4, // Bangladesh (Organic: 0.2%)
  BB: 1.6, // Barbados (Organic: 0.8%)
  BY: 0.2, // Belarus (Organic: 0.1%)
  BE: 1.3, // Belgium (Organic: 1.2%)
  BZ: 1.5, // Belize (Organic: 0.7%)
  BJ: 1.3, // Benin (Organic: 0.5%)
  BM: 1.5, // Bermuda (Organic: 1.3%)
  BT: 0.9, // Bhutan (Organic: 0.7%)
  BO: 1.6, // Bolivia (Organic: 0.8%)
  BA: 1, // Bosnia and Herzegovina (Organic: 0.8%)
  BW: 1.5, // Botswana (Organic: 0.7%)
  BR: 2.2, // Brazil (Organic: 1.4%)
  IO: 1.5, // British Indian Ocean Territory (Organic: 0.7%)
  VG: 1.5, // British Virgin Islands (Organic: 0.7%)
  BN: 0.8, // Brunei (Organic: 0.6%)
  BG: 1.1, // Bulgaria (Organic: 0.9%)
  BF: 1, // Burkina Faso (Organic: 0.2%)
  BI: 1, // Burundi (Organic: 0.2%)
  KH: 3.3, // Cambodia (Organic: 2%)
  CM: 1.3, // Cameroon (Organic: 0.5%)
  CA: 1.4, // Canada (Organic: 1.2%)
  CV: 1.6, // Cape Verde (Organic: 0.8%)
  BQ: 1.6, // Caribbean Netherlands (Organic: 0.8%)
  KY: 1.7, // Cayman Islands (Organic: 0.9%)
  CF: 1, // Central African Republic (Organic: 0.2%)
  TD: 1, // Chad (Organic: 0.2%)
  CL: 1.1, // Chile (Organic: 0.8%)
  CN: 0.6, // China (Organic: 0.1%)
  CX: 1.2, // Christmas Island (Organic: 0.9%)
  CC: 1.2, // Cocos (Keeling) Islands (Organic: 0.9%)
  CO: 3.3, // Colombia (Organic: 1.4%)
  KM: 1, // Comoros (Organic: 0.2%)
  CG: 1.4, // Congo (Organic: 0.6%)
  CK: 1, // Cook Islands (Organic: 0.7%)
  CR: 2.1, // Costa Rica (Organic: 1.1%)
  HR: 1.2, // Croatia (Organic: 1%)
  CU: 1.6, // Cuba (Organic: 0.8%)
  CW: 1.7, // Curaçao (Organic: 0.9%)
  CY: 1.2, // Cyprus (Organic: 1%)
  CZ: 1.3, // Czechia (Organic: 1.1%)
  DK: 1.3, // Denmark (Organic: 1.2%)
  DJ: 1.2, // Djibouti (Organic: 0.4%)
  DM: 1.7, // Dominica (Organic: 0.9%)
  DO: 3.6, // Dominican Republic (Organic: 1.8%)
  CD: 1.2, // DR Congo (Organic: 0.4%)
  EC: 2.3, // Ecuador (Organic: 1.5%)
  EG: 0.5, // Egypt (Organic: 0.2%)
  SV: 1.8, // El Salvador (Organic: 1%)
  GQ: 1.5, // Equatorial Guinea (Organic: 0.7%)
  ER: 1, // Eritrea (Organic: 0.2%)
  EE: 1.2, // Estonia (Organic: 1%)
  SZ: 1.3, // Eswatini (Organic: 0.5%)
  ET: 1.8, // Ethiopia (Organic: 1%)
  FK: 1.5, // Falkland Islands (Organic: 0.7%)
  FO: 0.9, // Faroe Islands (Organic: 0.7%)
  FJ: 1, // Fiji (Organic: 0.7%)
  FI: 1.3, // Finland (Organic: 1.2%)
  FR: 1.2, // France (Organic: 1%)
  GF: 1.4, // French Guiana (Organic: 0.6%)
  PF: 0.9, // French Polynesia (Organic: 0.6%)
  GA: 1.6, // Gabon (Organic: 0.8%)
  GM: 1.4, // Gambia (Organic: 0.6%)
  GE: 0.6, // Georgia (Organic: 0.3%)
  DE: 1.3, // Germany (Organic: 1.2%)
  GH: 2.9, // Ghana (Organic: 1.6%)
  GI: 1.4, // Gibraltar (Organic: 1.2%)
  GR: 1.1, // Greece (Organic: 0.9%)
  GL: 1.2, // Greenland (Organic: 1%)
  GD: 1.4, // Grenada (Organic: 0.6%)
  GP: 1.5, // Guadeloupe (Organic: 0.7%)
  GU: 1.1, // Guam (Organic: 0.8%)
  GT: 1.6, // Guatemala (Organic: 0.8%)
  GG: 1.2, // Guernsey (Organic: 1%)
  GN: 1, // Guinea (Organic: 0.2%)
  GW: 1, // Guinea-Bissau (Organic: 0.2%)
  GY: 1.5, // Guyana (Organic: 0.7%)
  HT: 1, // Haiti (Organic: 0.2%)
  HN: 1.6, // Honduras (Organic: 0.8%)
  HK: 1.7, // Hong Kong (Organic: 1.1%)
  HU: 1.1, // Hungary (Organic: 0.9%)
  IS: 1.3, // Iceland (Organic: 1.1%)
  IN: 0.5, // India (Organic: 0.2%)
  ID: 3.9, // Indonesia (Organic: 2.7%)
  IR: 0.2, // Iran (Organic: 0.1%)
  IQ: 0.4, // Iraq (Organic: 0.1%)
  IE: 1.3, // Ireland (Organic: 1.2%)
  IM: 1.3, // Isle of Man (Organic: 1.1%)
  IL: 0.6, // Israel (Organic: 0.3%)
  IT: 1, // Italy (Organic: 0.8%)
  CI: 1.3, // Ivory Coast (Organic: 0.5%)
  JM: 1.8, // Jamaica (Organic: 1%)
  JP: 1.2, // Japan (Organic: 0.8%)
  JE: 1.1, // Jersey (Organic: 0.9%)
  JO: 0.7, // Jordan (Organic: 0.4%)
  KZ: 0.6, // Kazakhstan (Organic: 0.3%)
  KE: 3.4, // Kenya (Organic: 1.7%)
  KI: 0.8, // Kiribati (Organic: 0.5%)
  XK: 1, // Kosovo (Organic: 0.8%)
  KW: 0.7, // Kuwait (Organic: 0.4%)
  KG: 0.5, // Kyrgyzstan (Organic: 0.2%)
  LA: 2.5, // Laos (Organic: 1.6%)
  LV: 1.1, // Latvia (Organic: 0.9%)
  LB: 0.8, // Lebanon (Organic: 0.5%)
  LS: 1.3, // Lesotho (Organic: 0.5%)
  LR: 1.3, // Liberia (Organic: 0.5%)
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
  MH: 1, // Marshall Islands (Organic: 0.7%)
  MQ: 1.4, // Martinique (Organic: 0.6%)
  MR: 1, // Mauritania (Organic: 0.2%)
  MU: 1.4, // Mauritius (Organic: 0.6%)
  YT: 1.2, // Mayotte (Organic: 0.4%)
  MX: 2.3, // Mexico (Organic: 1.5%)
  FM: 0.6, // Micronesia (Organic: 0.3%)
  MD: 0.9, // Moldova (Organic: 0.7%)
  MC: 1.2, // Monaco (Organic: 1%)
  MN: 1.1, // Mongolia (Organic: 0.9%)
  ME: 1.1, // Montenegro (Organic: 0.9%)
  MS: 1.2, // Montserrat (Organic: 0.4%)
  MA: 0.9, // Morocco (Organic: 0.4%)
  MZ: 1.2, // Mozambique (Organic: 0.4%)
  MM: 1.2, // Myanmar (Organic: 0.7%)
  NA: 1.5, // Namibia (Organic: 0.7%)
  NR: 1.1, // Nauru (Organic: 0.8%)
  NP: 0.8, // Nepal (Organic: 0.5%)
  NL: 1.4, // Netherlands (Organic: 1.3%)
  NC: 0.9, // New Caledonia (Organic: 0.6%)
  NZ: 1.4, // New Zealand (Organic: 1.2%)
  NI: 1.6, // Nicaragua (Organic: 0.8%)
  NE: 1, // Niger (Organic: 0.2%)
  NG: 2.7, // Nigeria (Organic: 1%)
  NU: 1, // Niue (Organic: 0.7%)
  NF: 0.7, // Norfolk Island (Organic: 0.4%)
  KP: 0.1, // North Korea (Organic: 0.1%)
  MK: 1.2, // North Macedonia (Organic: 1%)
  MP: 1, // Northern Mariana Islands (Organic: 0.7%)
  NO: 1.3, // Norway (Organic: 1.2%)
  OM: 0.7, // Oman (Organic: 0.4%)
  PK: 0.3, // Pakistan (Organic: 0.2%)
  PW: 1.1, // Palau (Organic: 0.8%)
  PS: 0.5, // Palestine (Organic: 0.2%)
  PA: 2.3, // Panama (Organic: 1.3%)
  PG: 0.6, // Papua New Guinea (Organic: 0.3%)
  PY: 1.8, // Paraguay (Organic: 1%)
  PE: 2.6, // Peru (Organic: 1.8%)
  PH: 5, // Philippines (Organic: 3.3%)
  PN: 0.7, // Pitcairn Islands (Organic: 0.4%)
  PL: 1.3, // Poland (Organic: 1.1%)
  PT: 1.2, // Portugal (Organic: 1%)
  PR: 1.5, // Puerto Rico (Organic: 0.7%)
  QA: 0.7, // Qatar (Organic: 0.4%)
  RE: 1.4, // Réunion (Organic: 0.6%)
  RO: 1.2, // Romania (Organic: 0.9%)
  RU: 0.2, // Russia (Organic: 0.1%)
  RW: 2, // Rwanda (Organic: 1.3%)
  BL: 1.5, // Saint Barthélemy (Organic: 0.7%)
  SH: 1.1, // Saint Helena, Ascension and Tristan da Cunha (Organic: 0.3%)
  KN: 1.4, // Saint Kitts and Nevis (Organic: 0.6%)
  LC: 1.4, // Saint Lucia (Organic: 0.6%)
  MF: 1.6, // Saint Martin (Organic: 0.8%)
  PM: 1.3, // Saint Pierre and Miquelon (Organic: 1.1%)
  VC: 1.5, // Saint Vincent and the Grenadines (Organic: 0.7%)
  WS: 0.7, // Samoa (Organic: 0.4%)
  SM: 1.2, // San Marino (Organic: 1%)
  ST: 1.5, // São Tomé and Príncipe (Organic: 0.7%)
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
  ES: 1.1, // Spain (Organic: 0.9%)
  LK: 0.8, // Sri Lanka (Organic: 0.5%)
  SD: 0.4, // Sudan (Organic: 0.1%)
  SR: 1.6, // Suriname (Organic: 0.8%)
  SJ: 1.3, // Svalbard and Jan Mayen (Organic: 1.1%)
  SE: 1.2, // Sweden (Organic: 1.1%)
  CH: 1.2, // Switzerland (Organic: 1.1%)
  SY: 0.1, // Syria (Organic: 0.1%)
  TW: 1.4, // Taiwan (Organic: 1%)
  TJ: 0.5, // Tajikistan (Organic: 0.2%)
  TZ: 2.7, // Tanzania (Organic: 1.3%)
  TH: 4.6, // Thailand (Organic: 2.4%)
  TL: 0.7, // Timor-Leste (Organic: 0.5%)
  TG: 1.3, // Togo (Organic: 0.5%)
  TK: 0.6, // Tokelau (Organic: 0.3%)
  TO: 0.7, // Tonga (Organic: 0.4%)
  TT: 1.6, // Trinidad and Tobago (Organic: 0.8%)
  TN: 0.7, // Tunisia (Organic: 0.4%)
  TR: 1, // Türkiye (Organic: 0.6%)
  TM: 0.5, // Turkmenistan (Organic: 0.2%)
  TC: 1.8, // Turks and Caicos Islands (Organic: 1%)
  TV: 1, // Tuvalu (Organic: 0.7%)
  UG: 2.7, // Uganda (Organic: 1.3%)
  UA: 1.3, // Ukraine (Organic: 0.9%)
  AE: 2.2, // United Arab Emirates (Organic: 0.4%)
  GB: 1.4, // United Kingdom (Organic: 1.2%)
  US: 1.5, // United States (Organic: 1.2%)
  UM: 1.5, // United States Minor Outlying Islands (Organic: 1.3%)
  VI: 1.8, // United States Virgin Islands (Organic: 1%)
  UY: 0.9, // Uruguay (Organic: 0.7%)
  UZ: 0.6, // Uzbekistan (Organic: 0.3%)
  VU: 0.6, // Vanuatu (Organic: 0.3%)
  VA: 1.1, // Vatican City (Organic: 0.9%)
  VE: 2, // Venezuela (Organic: 0.9%)
  VN: 3.2, // Vietnam (Organic: 2.1%)
  WF: 0.6, // Wallis and Futuna (Organic: 0.3%)
  EH: 0.6, // Western Sahara (Organic: 0.3%)
  YE: 0.1, // Yemen (Organic: 0.1%)
  ZM: 1.2, // Zambia (Organic: 0.4%)
  ZW: 1.3, // Zimbabwe (Organic: 0.5%)
};

export const tinderMatchDetailsByCountry: Record<string, TinderMatchBreakdown> = {
  AF: {"matchRatePct":0.1,"rawMatchRatePct":0.1,"swipesPerMatch":1000,"tinderMalePct":97,"activeOrganicShare":0.2,"deliveryProb":0.002,"conditionalRightSwipeProb":0.009,"localPercentile":5.7},
  AX: {"matchRatePct":0.9,"rawMatchRatePct":1.1,"swipesPerMatch":111,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.11,"conditionalRightSwipeProb":0.1,"localPercentile":72.1},
  AL: {"matchRatePct":0.9,"rawMatchRatePct":1.1,"swipesPerMatch":111,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.113,"conditionalRightSwipeProb":0.103,"localPercentile":73},
  DZ: {"matchRatePct":0.3,"rawMatchRatePct":0.6,"swipesPerMatch":333,"tinderMalePct":91,"activeOrganicShare":0.48,"deliveryProb":0.072,"conditionalRightSwipeProb":0.065,"localPercentile":57.7},
  AS: {"matchRatePct":0.7,"rawMatchRatePct":1,"swipesPerMatch":143,"tinderMalePct":81,"activeOrganicShare":0.52,"deliveryProb":0.098,"conditionalRightSwipeProb":0.105,"localPercentile":73.8},
  AD: {"matchRatePct":1,"rawMatchRatePct":1.2,"swipesPerMatch":100,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.132,"conditionalRightSwipeProb":0.091,"localPercentile":69.1},
  AO: {"matchRatePct":0.6,"rawMatchRatePct":1.4,"swipesPerMatch":167,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.069,"conditionalRightSwipeProb":0.168,"localPercentile":86.3},
  AI: {"matchRatePct":1,"rawMatchRatePct":1.8,"swipesPerMatch":100,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.122,"conditionalRightSwipeProb":0.131,"localPercentile":80.1},
  AG: {"matchRatePct":0.6,"rawMatchRatePct":1.4,"swipesPerMatch":167,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.07,"conditionalRightSwipeProb":0.131,"localPercentile":80.1},
  AR: {"matchRatePct":0.8,"rawMatchRatePct":1.1,"swipesPerMatch":125,"tinderMalePct":77,"activeOrganicShare":0.6,"deliveryProb":0.13,"conditionalRightSwipeProb":0.078,"localPercentile":63.9},
  AM: {"matchRatePct":0.7,"rawMatchRatePct":0.9,"swipesPerMatch":143,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.116,"conditionalRightSwipeProb":0.072,"localPercentile":61.3},
  AW: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.099,"conditionalRightSwipeProb":0.119,"localPercentile":77.5},
  AU: {"matchRatePct":1.2,"rawMatchRatePct":1.4,"swipesPerMatch":83,"tinderMalePct":82.5,"activeOrganicShare":0.62,"deliveryProb":0.13,"conditionalRightSwipeProb":0.115,"localPercentile":76.4},
  AT: {"matchRatePct":1.1,"rawMatchRatePct":1.2,"swipesPerMatch":91,"tinderMalePct":83.5,"activeOrganicShare":0.62,"deliveryProb":0.127,"conditionalRightSwipeProb":0.112,"localPercentile":75.7},
  AZ: {"matchRatePct":0.7,"rawMatchRatePct":0.9,"swipesPerMatch":143,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.118,"conditionalRightSwipeProb":0.07,"localPercentile":60.2},
  BS: {"matchRatePct":0.9,"rawMatchRatePct":1.7,"swipesPerMatch":111,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.122,"conditionalRightSwipeProb":0.125,"localPercentile":78.8},
  BH: {"matchRatePct":0.4,"rawMatchRatePct":0.7,"swipesPerMatch":250,"tinderMalePct":91,"activeOrganicShare":0.48,"deliveryProb":0.079,"conditionalRightSwipeProb":0.068,"localPercentile":59.4},
  BD: {"matchRatePct":0.2,"rawMatchRatePct":0.4,"swipesPerMatch":500,"tinderMalePct":95,"activeOrganicShare":0.45,"deliveryProb":0.049,"conditionalRightSwipeProb":0.067,"localPercentile":58.7},
  BB: {"matchRatePct":0.8,"rawMatchRatePct":1.6,"swipesPerMatch":125,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.094,"conditionalRightSwipeProb":0.133,"localPercentile":80.6},
  BY: {"matchRatePct":0.1,"rawMatchRatePct":0.2,"swipesPerMatch":1000,"tinderMalePct":75,"activeOrganicShare":0.4,"deliveryProb":0.015,"conditionalRightSwipeProb":0.049,"localPercentile":47.6},
  BE: {"matchRatePct":1.2,"rawMatchRatePct":1.3,"swipesPerMatch":83,"tinderMalePct":83.5,"activeOrganicShare":0.63,"deliveryProb":0.13,"conditionalRightSwipeProb":0.113,"localPercentile":76},
  BZ: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.088,"conditionalRightSwipeProb":0.139,"localPercentile":81.7},
  BJ: {"matchRatePct":0.5,"rawMatchRatePct":1.3,"swipesPerMatch":200,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.054,"conditionalRightSwipeProb":0.152,"localPercentile":84},
  BM: {"matchRatePct":1.3,"rawMatchRatePct":1.5,"swipesPerMatch":77,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.132,"conditionalRightSwipeProb":0.13,"localPercentile":80},
  BT: {"matchRatePct":0.7,"rawMatchRatePct":0.9,"swipesPerMatch":143,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.105,"conditionalRightSwipeProb":0.079,"localPercentile":64.6},
  BO: {"matchRatePct":0.8,"rawMatchRatePct":1.6,"swipesPerMatch":125,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.109,"conditionalRightSwipeProb":0.112,"localPercentile":75.7},
  BA: {"matchRatePct":0.8,"rawMatchRatePct":1,"swipesPerMatch":125,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.108,"conditionalRightSwipeProb":0.098,"localPercentile":71.5},
  BW: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.078,"conditionalRightSwipeProb":0.175,"localPercentile":87.2},
  BR: {"matchRatePct":1.4,"rawMatchRatePct":2.2,"swipesPerMatch":71,"tinderMalePct":75.5,"activeOrganicShare":0.56,"deliveryProb":0.13,"conditionalRightSwipeProb":0.153,"localPercentile":84.2},
  IO: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.105,"conditionalRightSwipeProb":0.119,"localPercentile":77.6},
  VG: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.094,"conditionalRightSwipeProb":0.127,"localPercentile":79.4},
  BN: {"matchRatePct":0.6,"rawMatchRatePct":0.8,"swipesPerMatch":167,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.132,"conditionalRightSwipeProb":0.049,"localPercentile":47.5},
  BG: {"matchRatePct":0.9,"rawMatchRatePct":1.1,"swipesPerMatch":111,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.123,"conditionalRightSwipeProb":0.093,"localPercentile":69.9},
  BF: {"matchRatePct":0.2,"rawMatchRatePct":1,"swipesPerMatch":500,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.045,"conditionalRightSwipeProb":0.073,"localPercentile":61.8},
  BI: {"matchRatePct":0.2,"rawMatchRatePct":1,"swipesPerMatch":500,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.045,"conditionalRightSwipeProb":0.074,"localPercentile":62},
  KH: {"matchRatePct":2,"rawMatchRatePct":3.3,"swipesPerMatch":50,"tinderMalePct":65,"activeOrganicShare":0.52,"deliveryProb":0.148,"conditionalRightSwipeProb":0.213,"localPercentile":91},
  CM: {"matchRatePct":0.5,"rawMatchRatePct":1.3,"swipesPerMatch":200,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.064,"conditionalRightSwipeProb":0.153,"localPercentile":84.2},
  CA: {"matchRatePct":1.2,"rawMatchRatePct":1.4,"swipesPerMatch":83,"tinderMalePct":83.5,"activeOrganicShare":0.61,"deliveryProb":0.127,"conditionalRightSwipeProb":0.115,"localPercentile":76.5},
  CV: {"matchRatePct":0.8,"rawMatchRatePct":1.6,"swipesPerMatch":125,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.094,"conditionalRightSwipeProb":0.146,"localPercentile":82.9},
  BQ: {"matchRatePct":0.8,"rawMatchRatePct":1.6,"swipesPerMatch":125,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.108,"conditionalRightSwipeProb":0.121,"localPercentile":77.9},
  KY: {"matchRatePct":0.9,"rawMatchRatePct":1.7,"swipesPerMatch":111,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.122,"conditionalRightSwipeProb":0.126,"localPercentile":79},
  CF: {"matchRatePct":0.2,"rawMatchRatePct":1,"swipesPerMatch":500,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.045,"conditionalRightSwipeProb":0.073,"localPercentile":61.8},
  TD: {"matchRatePct":0.2,"rawMatchRatePct":1,"swipesPerMatch":500,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.045,"conditionalRightSwipeProb":0.074,"localPercentile":62},
  CL: {"matchRatePct":0.8,"rawMatchRatePct":1.1,"swipesPerMatch":125,"tinderMalePct":81,"activeOrganicShare":0.6,"deliveryProb":0.128,"conditionalRightSwipeProb":0.076,"localPercentile":63.2},
  CN: {"matchRatePct":0.1,"rawMatchRatePct":0.6,"swipesPerMatch":1000,"tinderMalePct":82,"activeOrganicShare":0.42,"deliveryProb":0.034,"conditionalRightSwipeProb":0.075,"localPercentile":62.5},
  CX: {"matchRatePct":0.9,"rawMatchRatePct":1.2,"swipesPerMatch":111,"tinderMalePct":81,"activeOrganicShare":0.52,"deliveryProb":0.117,"conditionalRightSwipeProb":0.115,"localPercentile":76.5},
  CC: {"matchRatePct":0.9,"rawMatchRatePct":1.2,"swipesPerMatch":111,"tinderMalePct":81,"activeOrganicShare":0.52,"deliveryProb":0.117,"conditionalRightSwipeProb":0.115,"localPercentile":76.5},
  CO: {"matchRatePct":1.4,"rawMatchRatePct":3.3,"swipesPerMatch":71,"tinderMalePct":80,"activeOrganicShare":0.46,"deliveryProb":0.121,"conditionalRightSwipeProb":0.208,"localPercentile":90.6},
  KM: {"matchRatePct":0.2,"rawMatchRatePct":1,"swipesPerMatch":500,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.045,"conditionalRightSwipeProb":0.074,"localPercentile":62.3},
  CG: {"matchRatePct":0.6,"rawMatchRatePct":1.4,"swipesPerMatch":167,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.07,"conditionalRightSwipeProb":0.147,"localPercentile":83.2},
  CK: {"matchRatePct":0.7,"rawMatchRatePct":1,"swipesPerMatch":143,"tinderMalePct":81,"activeOrganicShare":0.52,"deliveryProb":0.104,"conditionalRightSwipeProb":0.104,"localPercentile":73.3},
  CR: {"matchRatePct":1.1,"rawMatchRatePct":2.1,"swipesPerMatch":91,"tinderMalePct":80,"activeOrganicShare":0.52,"deliveryProb":0.121,"conditionalRightSwipeProb":0.143,"localPercentile":82.5},
  HR: {"matchRatePct":1,"rawMatchRatePct":1.2,"swipesPerMatch":100,"tinderMalePct":78,"activeOrganicShare":0.58,"deliveryProb":0.131,"conditionalRightSwipeProb":0.101,"localPercentile":72.4},
  CU: {"matchRatePct":0.8,"rawMatchRatePct":1.6,"swipesPerMatch":125,"tinderMalePct":78,"activeOrganicShare":0.44,"deliveryProb":0.076,"conditionalRightSwipeProb":0.187,"localPercentile":88.5},
  CW: {"matchRatePct":0.9,"rawMatchRatePct":1.7,"swipesPerMatch":111,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.119,"conditionalRightSwipeProb":0.123,"localPercentile":78.3},
  CY: {"matchRatePct":1,"rawMatchRatePct":1.2,"swipesPerMatch":100,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.123,"conditionalRightSwipeProb":0.1,"localPercentile":72.3},
  CZ: {"matchRatePct":1.1,"rawMatchRatePct":1.3,"swipesPerMatch":91,"tinderMalePct":75,"activeOrganicShare":0.6,"deliveryProb":0.134,"conditionalRightSwipeProb":0.1,"localPercentile":72.2},
  DK: {"matchRatePct":1.2,"rawMatchRatePct":1.3,"swipesPerMatch":83,"tinderMalePct":72,"activeOrganicShare":0.62,"deliveryProb":0.139,"conditionalRightSwipeProb":0.104,"localPercentile":73.4},
  DJ: {"matchRatePct":0.4,"rawMatchRatePct":1.2,"swipesPerMatch":250,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.087,"conditionalRightSwipeProb":0.083,"localPercentile":66.2},
  DM: {"matchRatePct":0.9,"rawMatchRatePct":1.7,"swipesPerMatch":111,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.112,"conditionalRightSwipeProb":0.134,"localPercentile":80.7},
  DO: {"matchRatePct":1.8,"rawMatchRatePct":3.6,"swipesPerMatch":56,"tinderMalePct":76,"activeOrganicShare":0.47,"deliveryProb":0.126,"conditionalRightSwipeProb":0.246,"localPercentile":93.3},
  CD: {"matchRatePct":0.4,"rawMatchRatePct":1.2,"swipesPerMatch":250,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.045,"conditionalRightSwipeProb":0.157,"localPercentile":84.8},
  EC: {"matchRatePct":1.5,"rawMatchRatePct":2.3,"swipesPerMatch":67,"tinderMalePct":80,"activeOrganicShare":0.52,"deliveryProb":0.127,"conditionalRightSwipeProb":0.181,"localPercentile":87.9},
  EG: {"matchRatePct":0.2,"rawMatchRatePct":0.5,"swipesPerMatch":500,"tinderMalePct":93,"activeOrganicShare":0.46,"deliveryProb":0.06,"conditionalRightSwipeProb":0.065,"localPercentile":57.4},
  SV: {"matchRatePct":1,"rawMatchRatePct":1.8,"swipesPerMatch":100,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.102,"conditionalRightSwipeProb":0.164,"localPercentile":85.7},
  GQ: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.084,"conditionalRightSwipeProb":0.151,"localPercentile":83.8},
  ER: {"matchRatePct":0.2,"rawMatchRatePct":1,"swipesPerMatch":500,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.045,"conditionalRightSwipeProb":0.074,"localPercentile":62},
  EE: {"matchRatePct":1,"rawMatchRatePct":1.2,"swipesPerMatch":100,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.128,"conditionalRightSwipeProb":0.095,"localPercentile":70.4},
  SZ: {"matchRatePct":0.5,"rawMatchRatePct":1.3,"swipesPerMatch":200,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.056,"conditionalRightSwipeProb":0.171,"localPercentile":86.7},
  ET: {"matchRatePct":1,"rawMatchRatePct":1.8,"swipesPerMatch":100,"tinderMalePct":76,"activeOrganicShare":0.48,"deliveryProb":0.117,"conditionalRightSwipeProb":0.134,"localPercentile":80.8},
  FK: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.111,"conditionalRightSwipeProb":0.108,"localPercentile":74.6},
  FO: {"matchRatePct":0.7,"rawMatchRatePct":0.9,"swipesPerMatch":143,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.09,"conditionalRightSwipeProb":0.104,"localPercentile":73.4},
  FJ: {"matchRatePct":0.7,"rawMatchRatePct":1,"swipesPerMatch":143,"tinderMalePct":81,"activeOrganicShare":0.52,"deliveryProb":0.093,"conditionalRightSwipeProb":0.106,"localPercentile":74.1},
  FI: {"matchRatePct":1.2,"rawMatchRatePct":1.3,"swipesPerMatch":83,"tinderMalePct":76,"activeOrganicShare":0.62,"deliveryProb":0.135,"conditionalRightSwipeProb":0.106,"localPercentile":74},
  FR: {"matchRatePct":1,"rawMatchRatePct":1.2,"swipesPerMatch":100,"tinderMalePct":84,"activeOrganicShare":0.6,"deliveryProb":0.126,"conditionalRightSwipeProb":0.101,"localPercentile":72.4},
  GF: {"matchRatePct":0.6,"rawMatchRatePct":1.4,"swipesPerMatch":167,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.116,"conditionalRightSwipeProb":0.085,"localPercentile":66.8},
  PF: {"matchRatePct":0.6,"rawMatchRatePct":0.9,"swipesPerMatch":167,"tinderMalePct":81,"activeOrganicShare":0.52,"deliveryProb":0.095,"conditionalRightSwipeProb":0.097,"localPercentile":71.3},
  GA: {"matchRatePct":0.8,"rawMatchRatePct":1.6,"swipesPerMatch":125,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.101,"conditionalRightSwipeProb":0.145,"localPercentile":82.8},
  GM: {"matchRatePct":0.6,"rawMatchRatePct":1.4,"swipesPerMatch":167,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.071,"conditionalRightSwipeProb":0.147,"localPercentile":83.1},
  GE: {"matchRatePct":0.3,"rawMatchRatePct":0.6,"swipesPerMatch":333,"tinderMalePct":91,"activeOrganicShare":0.48,"deliveryProb":0.068,"conditionalRightSwipeProb":0.064,"localPercentile":57.1},
  DE: {"matchRatePct":1.2,"rawMatchRatePct":1.3,"swipesPerMatch":83,"tinderMalePct":84,"activeOrganicShare":0.62,"deliveryProb":0.129,"conditionalRightSwipeProb":0.112,"localPercentile":75.7},
  GH: {"matchRatePct":1.6,"rawMatchRatePct":2.9,"swipesPerMatch":63,"tinderMalePct":73,"activeOrganicShare":0.48,"deliveryProb":0.133,"conditionalRightSwipeProb":0.199,"localPercentile":89.8},
  GI: {"matchRatePct":1.2,"rawMatchRatePct":1.4,"swipesPerMatch":83,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.132,"conditionalRightSwipeProb":0.122,"localPercentile":78.2},
  GR: {"matchRatePct":0.9,"rawMatchRatePct":1.1,"swipesPerMatch":111,"tinderMalePct":89,"activeOrganicShare":0.56,"deliveryProb":0.115,"conditionalRightSwipeProb":0.102,"localPercentile":72.9},
  GL: {"matchRatePct":1,"rawMatchRatePct":1.2,"swipesPerMatch":100,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.128,"conditionalRightSwipeProb":0.099,"localPercentile":72},
  GD: {"matchRatePct":0.6,"rawMatchRatePct":1.4,"swipesPerMatch":167,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.077,"conditionalRightSwipeProb":0.133,"localPercentile":80.6},
  GP: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.122,"conditionalRightSwipeProb":0.083,"localPercentile":66.2},
  GU: {"matchRatePct":0.8,"rawMatchRatePct":1.1,"swipesPerMatch":125,"tinderMalePct":81,"activeOrganicShare":0.52,"deliveryProb":0.117,"conditionalRightSwipeProb":0.102,"localPercentile":72.7},
  GT: {"matchRatePct":0.8,"rawMatchRatePct":1.6,"swipesPerMatch":125,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.084,"conditionalRightSwipeProb":0.153,"localPercentile":84.1},
  GG: {"matchRatePct":1,"rawMatchRatePct":1.2,"swipesPerMatch":100,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.101,"conditionalRightSwipeProb":0.124,"localPercentile":78.6},
  GN: {"matchRatePct":0.2,"rawMatchRatePct":1,"swipesPerMatch":500,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.045,"conditionalRightSwipeProb":0.076,"localPercentile":63},
  GW: {"matchRatePct":0.2,"rawMatchRatePct":1,"swipesPerMatch":500,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.047,"conditionalRightSwipeProb":0.074,"localPercentile":62.3},
  GY: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.079,"conditionalRightSwipeProb":0.139,"localPercentile":81.7},
  HT: {"matchRatePct":0.2,"rawMatchRatePct":1,"swipesPerMatch":500,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.074,"conditionalRightSwipeProb":0.045,"localPercentile":44.3},
  HN: {"matchRatePct":0.8,"rawMatchRatePct":1.6,"swipesPerMatch":125,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.085,"conditionalRightSwipeProb":0.161,"localPercentile":85.4},
  HK: {"matchRatePct":1.1,"rawMatchRatePct":1.7,"swipesPerMatch":91,"tinderMalePct":75,"activeOrganicShare":0.6,"deliveryProb":0.131,"conditionalRightSwipeProb":0.11,"localPercentile":75},
  HU: {"matchRatePct":0.9,"rawMatchRatePct":1.1,"swipesPerMatch":111,"tinderMalePct":83,"activeOrganicShare":0.58,"deliveryProb":0.118,"conditionalRightSwipeProb":0.101,"localPercentile":72.4},
  IS: {"matchRatePct":1.1,"rawMatchRatePct":1.3,"swipesPerMatch":91,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.132,"conditionalRightSwipeProb":0.106,"localPercentile":74},
  IN: {"matchRatePct":0.2,"rawMatchRatePct":0.5,"swipesPerMatch":500,"tinderMalePct":96,"activeOrganicShare":0.48,"deliveryProb":0.055,"conditionalRightSwipeProb":0.066,"localPercentile":58.1},
  ID: {"matchRatePct":2.7,"rawMatchRatePct":3.9,"swipesPerMatch":37,"tinderMalePct":64,"activeOrganicShare":0.57,"deliveryProb":0.164,"conditionalRightSwipeProb":0.245,"localPercentile":93.3},
  IR: {"matchRatePct":0.1,"rawMatchRatePct":0.2,"swipesPerMatch":1000,"tinderMalePct":92,"activeOrganicShare":0.32,"deliveryProb":0.009,"conditionalRightSwipeProb":0.065,"localPercentile":57.8},
  IQ: {"matchRatePct":0.1,"rawMatchRatePct":0.4,"swipesPerMatch":1000,"tinderMalePct":91,"activeOrganicShare":0.48,"deliveryProb":0.071,"conditionalRightSwipeProb":0.018,"localPercentile":17.3},
  IE: {"matchRatePct":1.2,"rawMatchRatePct":1.3,"swipesPerMatch":83,"tinderMalePct":82,"activeOrganicShare":0.62,"deliveryProb":0.13,"conditionalRightSwipeProb":0.113,"localPercentile":75.9},
  IM: {"matchRatePct":1.1,"rawMatchRatePct":1.3,"swipesPerMatch":91,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.118,"conditionalRightSwipeProb":0.124,"localPercentile":78.6},
  IL: {"matchRatePct":0.3,"rawMatchRatePct":0.6,"swipesPerMatch":333,"tinderMalePct":91,"activeOrganicShare":0.48,"deliveryProb":0.079,"conditionalRightSwipeProb":0.067,"localPercentile":58.4},
  IT: {"matchRatePct":0.8,"rawMatchRatePct":1,"swipesPerMatch":125,"tinderMalePct":90,"activeOrganicShare":0.56,"deliveryProb":0.114,"conditionalRightSwipeProb":0.1,"localPercentile":72.1},
  CI: {"matchRatePct":0.5,"rawMatchRatePct":1.3,"swipesPerMatch":200,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.059,"conditionalRightSwipeProb":0.152,"localPercentile":84},
  JM: {"matchRatePct":1,"rawMatchRatePct":1.8,"swipesPerMatch":100,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.107,"conditionalRightSwipeProb":0.157,"localPercentile":84.8},
  JP: {"matchRatePct":0.8,"rawMatchRatePct":1.2,"swipesPerMatch":125,"tinderMalePct":78,"activeOrganicShare":0.58,"deliveryProb":0.114,"conditionalRightSwipeProb":0.09,"localPercentile":68.9},
  JE: {"matchRatePct":0.9,"rawMatchRatePct":1.1,"swipesPerMatch":111,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.098,"conditionalRightSwipeProb":0.124,"localPercentile":78.6},
  JO: {"matchRatePct":0.4,"rawMatchRatePct":0.7,"swipesPerMatch":250,"tinderMalePct":91,"activeOrganicShare":0.48,"deliveryProb":0.079,"conditionalRightSwipeProb":0.071,"localPercentile":60.5},
  KZ: {"matchRatePct":0.3,"rawMatchRatePct":0.6,"swipesPerMatch":333,"tinderMalePct":91,"activeOrganicShare":0.48,"deliveryProb":0.073,"conditionalRightSwipeProb":0.068,"localPercentile":58.9},
  KE: {"matchRatePct":1.7,"rawMatchRatePct":3.4,"swipesPerMatch":59,"tinderMalePct":70,"activeOrganicShare":0.48,"deliveryProb":0.14,"conditionalRightSwipeProb":0.207,"localPercentile":90.5},
  KI: {"matchRatePct":0.5,"rawMatchRatePct":0.8,"swipesPerMatch":200,"tinderMalePct":81,"activeOrganicShare":0.52,"deliveryProb":0.08,"conditionalRightSwipeProb":0.097,"localPercentile":71.1},
  XK: {"matchRatePct":0.8,"rawMatchRatePct":1,"swipesPerMatch":125,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.108,"conditionalRightSwipeProb":0.089,"localPercentile":68.5},
  KW: {"matchRatePct":0.4,"rawMatchRatePct":0.7,"swipesPerMatch":250,"tinderMalePct":91,"activeOrganicShare":0.48,"deliveryProb":0.079,"conditionalRightSwipeProb":0.07,"localPercentile":60.1},
  KG: {"matchRatePct":0.2,"rawMatchRatePct":0.5,"swipesPerMatch":500,"tinderMalePct":91,"activeOrganicShare":0.48,"deliveryProb":0.06,"conditionalRightSwipeProb":0.062,"localPercentile":56.1},
  LA: {"matchRatePct":1.6,"rawMatchRatePct":2.5,"swipesPerMatch":63,"tinderMalePct":68,"activeOrganicShare":0.5,"deliveryProb":0.136,"conditionalRightSwipeProb":0.194,"localPercentile":89.3},
  LV: {"matchRatePct":0.9,"rawMatchRatePct":1.1,"swipesPerMatch":111,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.127,"conditionalRightSwipeProb":0.085,"localPercentile":67},
  LB: {"matchRatePct":0.5,"rawMatchRatePct":0.8,"swipesPerMatch":200,"tinderMalePct":91,"activeOrganicShare":0.48,"deliveryProb":0.079,"conditionalRightSwipeProb":0.096,"localPercentile":70.8},
  LS: {"matchRatePct":0.5,"rawMatchRatePct":1.3,"swipesPerMatch":200,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.059,"conditionalRightSwipeProb":0.151,"localPercentile":83.8},
  LR: {"matchRatePct":0.5,"rawMatchRatePct":1.3,"swipesPerMatch":200,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.055,"conditionalRightSwipeProb":0.154,"localPercentile":84.2},
  LY: {"matchRatePct":0.2,"rawMatchRatePct":0.5,"swipesPerMatch":500,"tinderMalePct":91,"activeOrganicShare":0.48,"deliveryProb":0.079,"conditionalRightSwipeProb":0.035,"localPercentile":36.1},
  LI: {"matchRatePct":0.7,"rawMatchRatePct":0.9,"swipesPerMatch":143,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.089,"conditionalRightSwipeProb":0.105,"localPercentile":73.6},
  LT: {"matchRatePct":0.9,"rawMatchRatePct":1.1,"swipesPerMatch":111,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.124,"conditionalRightSwipeProb":0.093,"localPercentile":69.9},
  LU: {"matchRatePct":1.1,"rawMatchRatePct":1.3,"swipesPerMatch":91,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.132,"conditionalRightSwipeProb":0.111,"localPercentile":75.3},
  MO: {"matchRatePct":1,"rawMatchRatePct":1.2,"swipesPerMatch":100,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.132,"conditionalRightSwipeProb":0.096,"localPercentile":70.8},
  MG: {"matchRatePct":0.4,"rawMatchRatePct":1.2,"swipesPerMatch":250,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.045,"conditionalRightSwipeProb":0.149,"localPercentile":83.4},
  MW: {"matchRatePct":0.4,"rawMatchRatePct":1.2,"swipesPerMatch":250,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.045,"conditionalRightSwipeProb":0.167,"localPercentile":86.1},
  MY: {"matchRatePct":1.3,"rawMatchRatePct":1.9,"swipesPerMatch":77,"tinderMalePct":74,"activeOrganicShare":0.58,"deliveryProb":0.139,"conditionalRightSwipeProb":0.13,"localPercentile":80},
  MV: {"matchRatePct":0.4,"rawMatchRatePct":0.6,"swipesPerMatch":250,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.1,"conditionalRightSwipeProb":0.05,"localPercentile":48.2},
  ML: {"matchRatePct":0.2,"rawMatchRatePct":1,"swipesPerMatch":500,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.045,"conditionalRightSwipeProb":0.077,"localPercentile":63.6},
  MT: {"matchRatePct":1.1,"rawMatchRatePct":1.3,"swipesPerMatch":91,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.132,"conditionalRightSwipeProb":0.103,"localPercentile":73.2},
  MH: {"matchRatePct":0.7,"rawMatchRatePct":1,"swipesPerMatch":143,"tinderMalePct":81,"activeOrganicShare":0.52,"deliveryProb":0.1,"conditionalRightSwipeProb":0.098,"localPercentile":71.5},
  MQ: {"matchRatePct":0.6,"rawMatchRatePct":1.4,"swipesPerMatch":167,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.119,"conditionalRightSwipeProb":0.083,"localPercentile":66.2},
  MR: {"matchRatePct":0.2,"rawMatchRatePct":1,"swipesPerMatch":500,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.066,"conditionalRightSwipeProb":0.046,"localPercentile":44.9},
  MU: {"matchRatePct":0.6,"rawMatchRatePct":1.4,"swipesPerMatch":167,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.07,"conditionalRightSwipeProb":0.164,"localPercentile":85.7},
  YT: {"matchRatePct":0.4,"rawMatchRatePct":1.2,"swipesPerMatch":250,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.067,"conditionalRightSwipeProb":0.095,"localPercentile":70.4},
  MX: {"matchRatePct":1.5,"rawMatchRatePct":2.3,"swipesPerMatch":67,"tinderMalePct":87,"activeOrganicShare":0.55,"deliveryProb":0.123,"conditionalRightSwipeProb":0.172,"localPercentile":86.8},
  FM: {"matchRatePct":0.3,"rawMatchRatePct":0.6,"swipesPerMatch":333,"tinderMalePct":81,"activeOrganicShare":0.52,"deliveryProb":0.05,"conditionalRightSwipeProb":0.102,"localPercentile":72.8},
  MD: {"matchRatePct":0.7,"rawMatchRatePct":0.9,"swipesPerMatch":143,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.095,"conditionalRightSwipeProb":0.095,"localPercentile":70.4},
  MC: {"matchRatePct":1,"rawMatchRatePct":1.2,"swipesPerMatch":100,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.132,"conditionalRightSwipeProb":0.092,"localPercentile":69.6},
  MN: {"matchRatePct":0.9,"rawMatchRatePct":1.1,"swipesPerMatch":111,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.122,"conditionalRightSwipeProb":0.087,"localPercentile":67.6},
  ME: {"matchRatePct":0.9,"rawMatchRatePct":1.1,"swipesPerMatch":111,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.122,"conditionalRightSwipeProb":0.097,"localPercentile":71.1},
  MS: {"matchRatePct":0.4,"rawMatchRatePct":1.2,"swipesPerMatch":250,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.052,"conditionalRightSwipeProb":0.133,"localPercentile":80.6},
  MA: {"matchRatePct":0.4,"rawMatchRatePct":0.9,"swipesPerMatch":250,"tinderMalePct":89,"activeOrganicShare":0.5,"deliveryProb":0.08,"conditionalRightSwipeProb":0.072,"localPercentile":61.2},
  MZ: {"matchRatePct":0.4,"rawMatchRatePct":1.2,"swipesPerMatch":250,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.045,"conditionalRightSwipeProb":0.158,"localPercentile":85},
  MM: {"matchRatePct":0.7,"rawMatchRatePct":1.2,"swipesPerMatch":143,"tinderMalePct":78,"activeOrganicShare":0.45,"deliveryProb":0.099,"conditionalRightSwipeProb":0.131,"localPercentile":80},
  NA: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.072,"conditionalRightSwipeProb":0.17,"localPercentile":86.6},
  NR: {"matchRatePct":0.8,"rawMatchRatePct":1.1,"swipesPerMatch":125,"tinderMalePct":81,"activeOrganicShare":0.52,"deliveryProb":0.117,"conditionalRightSwipeProb":0.104,"localPercentile":73.4},
  NP: {"matchRatePct":0.5,"rawMatchRatePct":0.8,"swipesPerMatch":200,"tinderMalePct":90,"activeOrganicShare":0.52,"deliveryProb":0.075,"conditionalRightSwipeProb":0.107,"localPercentile":74.3},
  NL: {"matchRatePct":1.3,"rawMatchRatePct":1.4,"swipesPerMatch":77,"tinderMalePct":83,"activeOrganicShare":0.65,"deliveryProb":0.134,"conditionalRightSwipeProb":0.117,"localPercentile":77},
  NC: {"matchRatePct":0.6,"rawMatchRatePct":0.9,"swipesPerMatch":167,"tinderMalePct":81,"activeOrganicShare":0.52,"deliveryProb":0.099,"conditionalRightSwipeProb":0.095,"localPercentile":70.6},
  NZ: {"matchRatePct":1.2,"rawMatchRatePct":1.4,"swipesPerMatch":83,"tinderMalePct":81.5,"activeOrganicShare":0.62,"deliveryProb":0.131,"conditionalRightSwipeProb":0.112,"localPercentile":75.5},
  NI: {"matchRatePct":0.8,"rawMatchRatePct":1.6,"swipesPerMatch":125,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.087,"conditionalRightSwipeProb":0.153,"localPercentile":84.2},
  NE: {"matchRatePct":0.2,"rawMatchRatePct":1,"swipesPerMatch":500,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.045,"conditionalRightSwipeProb":0.073,"localPercentile":61.8},
  NG: {"matchRatePct":1,"rawMatchRatePct":2.7,"swipesPerMatch":100,"tinderMalePct":78,"activeOrganicShare":0.42,"deliveryProb":0.119,"conditionalRightSwipeProb":0.157,"localPercentile":84.8},
  NU: {"matchRatePct":0.7,"rawMatchRatePct":1,"swipesPerMatch":143,"tinderMalePct":81,"activeOrganicShare":0.52,"deliveryProb":0.101,"conditionalRightSwipeProb":0.103,"localPercentile":73.1},
  NF: {"matchRatePct":0.4,"rawMatchRatePct":0.7,"swipesPerMatch":250,"tinderMalePct":81,"activeOrganicShare":0.52,"deliveryProb":0.05,"conditionalRightSwipeProb":0.122,"localPercentile":78.1},
  KP: {"matchRatePct":0.1,"rawMatchRatePct":0.1,"swipesPerMatch":1000,"tinderMalePct":85,"activeOrganicShare":0.1,"deliveryProb":0.001,"conditionalRightSwipeProb":0.004,"localPercentile":1},
  MK: {"matchRatePct":1,"rawMatchRatePct":1.2,"swipesPerMatch":100,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.122,"conditionalRightSwipeProb":0.1,"localPercentile":72.2},
  MP: {"matchRatePct":0.7,"rawMatchRatePct":1,"swipesPerMatch":143,"tinderMalePct":81,"activeOrganicShare":0.52,"deliveryProb":0.105,"conditionalRightSwipeProb":0.102,"localPercentile":72.7},
  NO: {"matchRatePct":1.2,"rawMatchRatePct":1.3,"swipesPerMatch":83,"tinderMalePct":69,"activeOrganicShare":0.62,"deliveryProb":0.141,"conditionalRightSwipeProb":0.105,"localPercentile":73.8},
  OM: {"matchRatePct":0.4,"rawMatchRatePct":0.7,"swipesPerMatch":250,"tinderMalePct":91,"activeOrganicShare":0.48,"deliveryProb":0.079,"conditionalRightSwipeProb":0.069,"localPercentile":59.8},
  PK: {"matchRatePct":0.2,"rawMatchRatePct":0.3,"swipesPerMatch":500,"tinderMalePct":96,"activeOrganicShare":0.42,"deliveryProb":0.043,"conditionalRightSwipeProb":0.074,"localPercentile":62},
  PW: {"matchRatePct":0.8,"rawMatchRatePct":1.1,"swipesPerMatch":125,"tinderMalePct":81,"activeOrganicShare":0.52,"deliveryProb":0.113,"conditionalRightSwipeProb":0.103,"localPercentile":73.1},
  PS: {"matchRatePct":0.2,"rawMatchRatePct":0.5,"swipesPerMatch":500,"tinderMalePct":91,"activeOrganicShare":0.48,"deliveryProb":0.079,"conditionalRightSwipeProb":0.033,"localPercentile":33.6},
  PA: {"matchRatePct":1.3,"rawMatchRatePct":2.3,"swipesPerMatch":77,"tinderMalePct":80,"activeOrganicShare":0.52,"deliveryProb":0.121,"conditionalRightSwipeProb":0.172,"localPercentile":86.8},
  PG: {"matchRatePct":0.3,"rawMatchRatePct":0.6,"swipesPerMatch":333,"tinderMalePct":81,"activeOrganicShare":0.52,"deliveryProb":0.05,"conditionalRightSwipeProb":0.08,"localPercentile":64.9},
  PY: {"matchRatePct":1,"rawMatchRatePct":1.8,"swipesPerMatch":100,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.109,"conditionalRightSwipeProb":0.151,"localPercentile":83.8},
  PE: {"matchRatePct":1.8,"rawMatchRatePct":2.6,"swipesPerMatch":56,"tinderMalePct":79,"activeOrganicShare":0.55,"deliveryProb":0.135,"conditionalRightSwipeProb":0.195,"localPercentile":89.4},
  PH: {"matchRatePct":3.3,"rawMatchRatePct":5,"swipesPerMatch":30,"tinderMalePct":57,"activeOrganicShare":0.56,"deliveryProb":0.169,"conditionalRightSwipeProb":0.298,"localPercentile":95.8},
  PN: {"matchRatePct":0.4,"rawMatchRatePct":0.7,"swipesPerMatch":250,"tinderMalePct":81,"activeOrganicShare":0.52,"deliveryProb":0.052,"conditionalRightSwipeProb":0.118,"localPercentile":77.3},
  PL: {"matchRatePct":1.1,"rawMatchRatePct":1.3,"swipesPerMatch":91,"tinderMalePct":73,"activeOrganicShare":0.6,"deliveryProb":0.138,"conditionalRightSwipeProb":0.098,"localPercentile":71.6},
  PT: {"matchRatePct":1,"rawMatchRatePct":1.2,"swipesPerMatch":100,"tinderMalePct":87,"activeOrganicShare":0.58,"deliveryProb":0.121,"conditionalRightSwipeProb":0.114,"localPercentile":76.1},
  PR: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.122,"conditionalRightSwipeProb":0.09,"localPercentile":68.6},
  QA: {"matchRatePct":0.4,"rawMatchRatePct":0.7,"swipesPerMatch":250,"tinderMalePct":91,"activeOrganicShare":0.48,"deliveryProb":0.079,"conditionalRightSwipeProb":0.07,"localPercentile":60},
  RE: {"matchRatePct":0.6,"rawMatchRatePct":1.4,"swipesPerMatch":167,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.105,"conditionalRightSwipeProb":0.096,"localPercentile":70.9},
  RO: {"matchRatePct":0.9,"rawMatchRatePct":1.2,"swipesPerMatch":111,"tinderMalePct":88,"activeOrganicShare":0.56,"deliveryProb":0.116,"conditionalRightSwipeProb":0.108,"localPercentile":74.6},
  RU: {"matchRatePct":0.1,"rawMatchRatePct":0.2,"swipesPerMatch":1000,"tinderMalePct":74,"activeOrganicShare":0.38,"deliveryProb":0.012,"conditionalRightSwipeProb":0.05,"localPercentile":48},
  RW: {"matchRatePct":1.3,"rawMatchRatePct":2,"swipesPerMatch":77,"tinderMalePct":74,"activeOrganicShare":0.52,"deliveryProb":0.126,"conditionalRightSwipeProb":0.156,"localPercentile":84.5},
  BL: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.122,"conditionalRightSwipeProb":0.089,"localPercentile":68.3},
  SH: {"matchRatePct":0.3,"rawMatchRatePct":1.1,"swipesPerMatch":333,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.049,"conditionalRightSwipeProb":0.119,"localPercentile":77.6},
  KN: {"matchRatePct":0.6,"rawMatchRatePct":1.4,"swipesPerMatch":167,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.079,"conditionalRightSwipeProb":0.131,"localPercentile":80.1},
  LC: {"matchRatePct":0.6,"rawMatchRatePct":1.4,"swipesPerMatch":167,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.07,"conditionalRightSwipeProb":0.132,"localPercentile":80.3},
  MF: {"matchRatePct":0.8,"rawMatchRatePct":1.6,"swipesPerMatch":125,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.122,"conditionalRightSwipeProb":0.099,"localPercentile":71.8},
  PM: {"matchRatePct":1.1,"rawMatchRatePct":1.3,"swipesPerMatch":91,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.132,"conditionalRightSwipeProb":0.111,"localPercentile":75.4},
  VC: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.09,"conditionalRightSwipeProb":0.134,"localPercentile":80.7},
  WS: {"matchRatePct":0.4,"rawMatchRatePct":0.7,"swipesPerMatch":250,"tinderMalePct":81,"activeOrganicShare":0.52,"deliveryProb":0.064,"conditionalRightSwipeProb":0.093,"localPercentile":69.7},
  SM: {"matchRatePct":1,"rawMatchRatePct":1.2,"swipesPerMatch":100,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.132,"conditionalRightSwipeProb":0.095,"localPercentile":70.6},
  ST: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.08,"conditionalRightSwipeProb":0.147,"localPercentile":83.1},
  SA: {"matchRatePct":0.2,"rawMatchRatePct":0.4,"swipesPerMatch":500,"tinderMalePct":93,"activeOrganicShare":0.42,"deliveryProb":0.052,"conditionalRightSwipeProb":0.071,"localPercentile":60.8},
  SN: {"matchRatePct":0.4,"rawMatchRatePct":1.2,"swipesPerMatch":250,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.072,"conditionalRightSwipeProb":0.1,"localPercentile":72.3},
  RS: {"matchRatePct":0.9,"rawMatchRatePct":1.1,"swipesPerMatch":111,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.118,"conditionalRightSwipeProb":0.092,"localPercentile":69.6},
  SC: {"matchRatePct":0.7,"rawMatchRatePct":1.5,"swipesPerMatch":143,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.083,"conditionalRightSwipeProb":0.159,"localPercentile":85},
  SL: {"matchRatePct":0.4,"rawMatchRatePct":1.2,"swipesPerMatch":250,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.045,"conditionalRightSwipeProb":0.164,"localPercentile":85.7},
  SG: {"matchRatePct":1.2,"rawMatchRatePct":1.6,"swipesPerMatch":83,"tinderMalePct":76,"activeOrganicShare":0.64,"deliveryProb":0.135,"conditionalRightSwipeProb":0.111,"localPercentile":75.5},
  SX: {"matchRatePct":0.9,"rawMatchRatePct":1.7,"swipesPerMatch":111,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.122,"conditionalRightSwipeProb":0.123,"localPercentile":78.5},
  SK: {"matchRatePct":0.8,"rawMatchRatePct":1,"swipesPerMatch":125,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.113,"conditionalRightSwipeProb":0.088,"localPercentile":68.2},
  SI: {"matchRatePct":0.9,"rawMatchRatePct":1.1,"swipesPerMatch":111,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.115,"conditionalRightSwipeProb":0.099,"localPercentile":71.8},
  SB: {"matchRatePct":0.3,"rawMatchRatePct":0.6,"swipesPerMatch":333,"tinderMalePct":81,"activeOrganicShare":0.52,"deliveryProb":0.05,"conditionalRightSwipeProb":0.093,"localPercentile":69.7},
  SO: {"matchRatePct":0.1,"rawMatchRatePct":0.9,"swipesPerMatch":1000,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.051,"conditionalRightSwipeProb":0.013,"localPercentile":11.7},
  ZA: {"matchRatePct":1.3,"rawMatchRatePct":2.1,"swipesPerMatch":77,"tinderMalePct":65,"activeOrganicShare":0.54,"deliveryProb":0.131,"conditionalRightSwipeProb":0.145,"localPercentile":82.9},
  KR: {"matchRatePct":0.7,"rawMatchRatePct":1,"swipesPerMatch":143,"tinderMalePct":79,"activeOrganicShare":0.58,"deliveryProb":0.108,"conditionalRightSwipeProb":0.08,"localPercentile":65},
  SS: {"matchRatePct":0.2,"rawMatchRatePct":1,"swipesPerMatch":500,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.045,"conditionalRightSwipeProb":0.073,"localPercentile":61.8},
  ES: {"matchRatePct":0.9,"rawMatchRatePct":1.1,"swipesPerMatch":111,"tinderMalePct":88,"activeOrganicShare":0.58,"deliveryProb":0.121,"conditionalRightSwipeProb":0.095,"localPercentile":70.7},
  LK: {"matchRatePct":0.5,"rawMatchRatePct":0.8,"swipesPerMatch":200,"tinderMalePct":91,"activeOrganicShare":0.5,"deliveryProb":0.072,"conditionalRightSwipeProb":0.101,"localPercentile":72.6},
  SD: {"matchRatePct":0.1,"rawMatchRatePct":0.4,"swipesPerMatch":1000,"tinderMalePct":91,"activeOrganicShare":0.48,"deliveryProb":0.034,"conditionalRightSwipeProb":0.037,"localPercentile":37.5},
  SR: {"matchRatePct":0.8,"rawMatchRatePct":1.6,"swipesPerMatch":125,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.111,"conditionalRightSwipeProb":0.114,"localPercentile":76.1},
  SJ: {"matchRatePct":1.1,"rawMatchRatePct":1.3,"swipesPerMatch":91,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.132,"conditionalRightSwipeProb":0.107,"localPercentile":74.3},
  SE: {"matchRatePct":1.1,"rawMatchRatePct":1.2,"swipesPerMatch":91,"tinderMalePct":79,"activeOrganicShare":0.62,"deliveryProb":0.132,"conditionalRightSwipeProb":0.105,"localPercentile":73.7},
  CH: {"matchRatePct":1.1,"rawMatchRatePct":1.2,"swipesPerMatch":91,"tinderMalePct":83.5,"activeOrganicShare":0.62,"deliveryProb":0.127,"conditionalRightSwipeProb":0.111,"localPercentile":75.3},
  SY: {"matchRatePct":0.1,"rawMatchRatePct":0.1,"swipesPerMatch":1000,"tinderMalePct":93,"activeOrganicShare":0.28,"deliveryProb":0.005,"conditionalRightSwipeProb":0.014,"localPercentile":11.8},
  TW: {"matchRatePct":1,"rawMatchRatePct":1.4,"swipesPerMatch":100,"tinderMalePct":76,"activeOrganicShare":0.62,"deliveryProb":0.129,"conditionalRightSwipeProb":0.099,"localPercentile":71.7},
  TJ: {"matchRatePct":0.2,"rawMatchRatePct":0.5,"swipesPerMatch":500,"tinderMalePct":91,"activeOrganicShare":0.48,"deliveryProb":0.039,"conditionalRightSwipeProb":0.062,"localPercentile":55.6},
  TZ: {"matchRatePct":1.3,"rawMatchRatePct":2.7,"swipesPerMatch":77,"tinderMalePct":72,"activeOrganicShare":0.46,"deliveryProb":0.131,"conditionalRightSwipeProb":0.179,"localPercentile":87.7},
  TH: {"matchRatePct":2.4,"rawMatchRatePct":4.6,"swipesPerMatch":42,"tinderMalePct":54,"activeOrganicShare":0.5,"deliveryProb":0.151,"conditionalRightSwipeProb":0.268,"localPercentile":94.5},
  TL: {"matchRatePct":0.5,"rawMatchRatePct":0.7,"swipesPerMatch":200,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.057,"conditionalRightSwipeProb":0.108,"localPercentile":74.6},
  TG: {"matchRatePct":0.5,"rawMatchRatePct":1.3,"swipesPerMatch":200,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.052,"conditionalRightSwipeProb":0.158,"localPercentile":84.9},
  TK: {"matchRatePct":0.3,"rawMatchRatePct":0.6,"swipesPerMatch":333,"tinderMalePct":81,"activeOrganicShare":0.52,"deliveryProb":0.052,"conditionalRightSwipeProb":0.098,"localPercentile":71.4},
  TO: {"matchRatePct":0.4,"rawMatchRatePct":0.7,"swipesPerMatch":250,"tinderMalePct":81,"activeOrganicShare":0.52,"deliveryProb":0.061,"conditionalRightSwipeProb":0.093,"localPercentile":69.7},
  TT: {"matchRatePct":0.8,"rawMatchRatePct":1.6,"swipesPerMatch":125,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.099,"conditionalRightSwipeProb":0.127,"localPercentile":79.2},
  TN: {"matchRatePct":0.4,"rawMatchRatePct":0.7,"swipesPerMatch":250,"tinderMalePct":91,"activeOrganicShare":0.48,"deliveryProb":0.069,"conditionalRightSwipeProb":0.079,"localPercentile":64.3},
  TR: {"matchRatePct":0.6,"rawMatchRatePct":1,"swipesPerMatch":167,"tinderMalePct":95.5,"activeOrganicShare":0.55,"deliveryProb":0.101,"conditionalRightSwipeProb":0.078,"localPercentile":64},
  TM: {"matchRatePct":0.2,"rawMatchRatePct":0.5,"swipesPerMatch":500,"tinderMalePct":91,"activeOrganicShare":0.48,"deliveryProb":0.04,"conditionalRightSwipeProb":0.07,"localPercentile":60.2},
  TC: {"matchRatePct":1,"rawMatchRatePct":1.8,"swipesPerMatch":100,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.122,"conditionalRightSwipeProb":0.131,"localPercentile":80.1},
  TV: {"matchRatePct":0.7,"rawMatchRatePct":1,"swipesPerMatch":143,"tinderMalePct":81,"activeOrganicShare":0.52,"deliveryProb":0.096,"conditionalRightSwipeProb":0.101,"localPercentile":72.6},
  UG: {"matchRatePct":1.3,"rawMatchRatePct":2.7,"swipesPerMatch":77,"tinderMalePct":72,"activeOrganicShare":0.46,"deliveryProb":0.133,"conditionalRightSwipeProb":0.178,"localPercentile":87.6},
  UA: {"matchRatePct":0.9,"rawMatchRatePct":1.3,"swipesPerMatch":111,"tinderMalePct":69,"activeOrganicShare":0.54,"deliveryProb":0.125,"conditionalRightSwipeProb":0.097,"localPercentile":71.2},
  AE: {"matchRatePct":0.4,"rawMatchRatePct":2.2,"swipesPerMatch":250,"tinderMalePct":91,"activeOrganicShare":0.42,"deliveryProb":0.08,"conditionalRightSwipeProb":0.088,"localPercentile":68},
  GB: {"matchRatePct":1.2,"rawMatchRatePct":1.4,"swipesPerMatch":83,"tinderMalePct":84,"activeOrganicShare":0.62,"deliveryProb":0.126,"conditionalRightSwipeProb":0.116,"localPercentile":76.6},
  US: {"matchRatePct":1.2,"rawMatchRatePct":1.5,"swipesPerMatch":83,"tinderMalePct":82.5,"activeOrganicShare":0.6,"deliveryProb":0.128,"conditionalRightSwipeProb":0.121,"localPercentile":77.8},
  UM: {"matchRatePct":1.3,"rawMatchRatePct":1.5,"swipesPerMatch":77,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.132,"conditionalRightSwipeProb":0.128,"localPercentile":79.5},
  VI: {"matchRatePct":1,"rawMatchRatePct":1.8,"swipesPerMatch":100,"tinderMalePct":80,"activeOrganicShare":0.48,"deliveryProb":0.122,"conditionalRightSwipeProb":0.128,"localPercentile":79.5},
  UY: {"matchRatePct":0.7,"rawMatchRatePct":0.9,"swipesPerMatch":143,"tinderMalePct":78,"activeOrganicShare":0.6,"deliveryProb":0.128,"conditionalRightSwipeProb":0.067,"localPercentile":58.6},
  UZ: {"matchRatePct":0.3,"rawMatchRatePct":0.6,"swipesPerMatch":333,"tinderMalePct":91,"activeOrganicShare":0.48,"deliveryProb":0.066,"conditionalRightSwipeProb":0.062,"localPercentile":55.9},
  VU: {"matchRatePct":0.3,"rawMatchRatePct":0.6,"swipesPerMatch":333,"tinderMalePct":81,"activeOrganicShare":0.52,"deliveryProb":0.05,"conditionalRightSwipeProb":0.093,"localPercentile":69.7},
  VA: {"matchRatePct":0.9,"rawMatchRatePct":1.1,"swipesPerMatch":111,"tinderMalePct":83,"activeOrganicShare":0.6,"deliveryProb":0.132,"conditionalRightSwipeProb":0.088,"localPercentile":68.1},
  VE: {"matchRatePct":0.9,"rawMatchRatePct":2,"swipesPerMatch":111,"tinderMalePct":78,"activeOrganicShare":0.45,"deliveryProb":0.105,"conditionalRightSwipeProb":0.15,"localPercentile":83.7},
  VN: {"matchRatePct":2.1,"rawMatchRatePct":3.2,"swipesPerMatch":48,"tinderMalePct":66,"activeOrganicShare":0.55,"deliveryProb":0.15,"conditionalRightSwipeProb":0.208,"localPercentile":90.6},
  WF: {"matchRatePct":0.3,"rawMatchRatePct":0.6,"swipesPerMatch":333,"tinderMalePct":81,"activeOrganicShare":0.52,"deliveryProb":0.05,"conditionalRightSwipeProb":0.092,"localPercentile":69.3},
  EH: {"matchRatePct":0.3,"rawMatchRatePct":0.6,"swipesPerMatch":333,"tinderMalePct":91,"activeOrganicShare":0.48,"deliveryProb":0.073,"conditionalRightSwipeProb":0.062,"localPercentile":55.9},
  YE: {"matchRatePct":0.1,"rawMatchRatePct":0.1,"swipesPerMatch":1000,"tinderMalePct":95,"activeOrganicShare":0.25,"deliveryProb":0.004,"conditionalRightSwipeProb":0.009,"localPercentile":6},
  ZM: {"matchRatePct":0.4,"rawMatchRatePct":1.2,"swipesPerMatch":250,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.045,"conditionalRightSwipeProb":0.177,"localPercentile":87.5},
  ZW: {"matchRatePct":0.5,"rawMatchRatePct":1.3,"swipesPerMatch":200,"tinderMalePct":75,"activeOrganicShare":0.44,"deliveryProb":0.051,"conditionalRightSwipeProb":0.177,"localPercentile":87.5},
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
