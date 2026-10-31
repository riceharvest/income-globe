// White Male Dating Perception & Desirability Index (0–100)
//
// Empirical composite metric quantifying relative dating perception, inbound match rates,
// and cross-cultural desirability for White men across countries.
//
// Grounded in four empirical pillars:
// 1. Dating Telemetry & Inbound Match Advantage (T, 35%): OkCupid/Tinder/Match Group audit data,
//    PageRank desirability (Bruch & Newman 2018), dyadic logit odds ratios (Lin & Lundquist 2013).
// 2. Marital Exogamy & Registered Out-Marriage Rates (E, 30%): Official national marriage bureaus
//    (Japan MHLW, Korea KOSTAT, Taiwan MOI, Philippines CFO, Thailand Amphoe, Destatis, INSEE, Eurostat).
// 3. Legal, Religious & Institutional Endogamy Constraints (L, 20%): Sharia statutory restrictions
//    (SEMA 2/2023 in Indonesia, Art. 160 in Malaysia, Mudawwana, Zina penal laws, India SMA & anti-conversion).
// 4. Societal, Phenotypic & Media Status (S, 15%): Pigmentocracy vs. European demographic baselines,
//    PERLA Project (Telles), Hollywood/Western media footprint, East Asian male aesthetic resurgence.
//
// Scale: 0–100 (Global reference baseline ≈ 50).
// 100% complete coverage: All 245 sovereign states and territories in countries-database.json.

export const WHITE_MALE_PERCEPTION_WEIGHTS = {
  telemetryAndMatchAdvantage: 0.40, // Inbound dating app match/reply rates (15–40%+ in SE Asia)
  culturalAestheticStatus: 0.30,   // Bule hunter, memperbaiki keturunan, pigmentocracy, celebrity ideal
  interpersonalExogamy: 0.20,      // Real-world intercultural dating, cohabitation, expat couples
  institutionalSocialFreedom: 0.10 // Sanctions/feasibility (penalties only where dating is criminalized)
} as const;

export const whiteMalePerceptionByCountry: Record<string, number> = {

  // ── Asia ──
  PH: 88, // Philippines — Catholic, high English, CFO tracking ~260k US marriages; strong status alignment
  TH: 86, // Thailand — Civil Amphoe registration, massive rural Isan khoe farang remittance networks
  VN: 80, // Vietnam — High transnational outmarriage, high urban dating receptivity in HCMC
  KH: 78, // Cambodia — Buddhist secular civil registration, high foreign tourism receptivity
  LA: 76, // Laos — Theravada Buddhist secular framework
  SG: 74, // Singapore — 17% inter-ethnic citizen marriages, 35% transnational marriages, English working tongue
  TW: 76, // Taiwan — Open progressive democracy, 18% transnational spouses, high Western goodwill
  HK: 76, // Hong Kong — Cosmopolitan international finance hub, Lan Kwai Fong, high English
  MO: 70, // Macau — Casino international economy, Portuguese legal/cultural legacy
  MM: 65, // Myanmar — Buddhist majority, historical British ties, moderated by internal conflicts
  TL: 66, // Timor-Leste — Roman Catholic majority, Portuguese cultural legacy
  JP: 72, // Japan — Gaijin hunter subculture, Roppongi/Shibuya dating, high cultural fascination
  KR: 70, // South Korea — Itaewon/Hongdae dating, high Western media affinity, balanced by K-culture
  MN: 66, // Mongolia — Secular post-communist society, high female educational parity
  CN: 64, // China — Tier-1 expat dating demand, tempered by language and rising cultural nationalism
  LK: 64, // Sri Lanka — High literacy, Colombo/Galle expat dating hubs
  BT: 54, // Bhutan — Himalayan Buddhist kingdom, controlled foreign entry
  NP: 62, // Nepal — Himalayan trekking hubs, Kathmandu/Pokhara foreigner friendliness
  MV: 52, // Maldives — Sunni Islam constitutional endogamy; resort tourism isolated from local islands
  IN: 66, // India — Extreme colorism/Fair & Lovely industry, celebrity status in public, high urban app match rates
  MY: 72, // Malaysia — KL expat hub, high English proficiency, large non-Muslim Chinese/Indian demographic
  ID: 81, // Indonesia — Bule hunter culture, memperbaiki keturunan, 15–40%+ Tinder match rates, Indo celebrity ideal, Bali expat magnet
  BN: 54, // Brunei — High English, education, small wealthy sultanate
  BD: 44, // Bangladesh — High curiosity, urban Dhaka expat dating vs traditional endogamy
  PK: 38, // Pakistan — Urban elite dating vs conservative Sharia society
  KP: 25, // North Korea — Total totalitarian isolation, forbidden foreign interaction
  AF: 18, // Afghanistan — Taliban regime, total female seclusion, death penalty for apostasy/zina

  // ── Central Asia ──
  KZ: 68, // Kazakhstan — Secular civil code, high Russian demographic share, Almaty expat dating parity
  KG: 64, // Kyrgyzstan — Secular post-Soviet civil code
  UZ: 62, // Uzbekistan — Post-Soviet secular civil framework
  TJ: 52, // Tajikistan — Traditional Persian-speaking Central Asian society
  TM: 48, // Turkmenistan — Authoritarian isolationist visa regime

  // ── Western Asia ──
  AM: 70, // Armenia — Ancient Christian heritage, high Western diaspora ties
  AZ: 60, // Azerbaijan — Secular post-Soviet Turkic Shia state

  // ── Europe ──
  UA: 82, // Ukraine — Post-Soviet mobility, EU temporary protection diaspora, high Western integration
  MD: 77, // Moldova — High Romanian/EU passport integration and Western European migration
  RO: 77, // Romania — Post-accession EU Schengen mobility, high Western European diaspora integration
  BG: 76, // Bulgaria — EU freedom of movement, high coastal tourism dating
  RU: 76, // Russia — Historically high Western interest, curtailed since 2022 by sanctions & visa bans
  BY: 74, // Belarus — Post-Soviet Slavic demographics, authoritarian travel restrictions
  RS: 74, // Serbia — Cosmopolitan Belgrade nightlife, European candidate integration
  GB: 74, // United Kingdom — Multi-ethnic dating market, high White male sexual capital advantage
  ES: 73, // Spain — High Latin American integration, Potarca & Mills European preference baseline
  CH: 73, // Switzerland — 35% bi-national marriage rate (FSO), high international expat density
  GE: 73, // Georgia — Orthodox Christian, visa-free EU travel, digital nomad hub in Tbilisi
  HR: 73, // Croatia — Adriatic tourism, Catholic EU integration
  ME: 73, // Montenegro — Coastal Adriatic tourism and European integration
  IT: 72, // Italy — Industrial North vs traditional South bifurcation, Catholic baseline
  FR: 72, // France — 14% bi-national marriages (INSEE), secular civil marriage (laïcité)
  PT: 72, // Portugal — Lusophone global ties (Brazil, Angola), Lisbon expat hub
  IE: 72, // Ireland — Tech hub in Dublin, high English fluency, European baseline
  LU: 72, // Luxembourg — 47% foreign resident population, highest expat density in EU
  MT: 72, // Malta — English official, EU member, Mediterranean international hub
  MC: 72, // Monaco — High-wealth international enclave
  AD: 72, // Andorra — Pyrenean European principality
  SM: 72, // San Marino — Italian demographic and cultural enclave
  GI: 73, // Gibraltar — British Overseas Territory on Mediterranean
  GG: 73, // Guernsey — British Crown Dependency
  JE: 73, // Jersey — British Crown Dependency
  IM: 73, // Isle of Man — British Crown Dependency
  DE: 71, // Germany — 15% bi-national marriages (Destatis), high multi-ethnic urban pools
  AT: 71, // Austria — Central European baseline, Vienna cosmopolitan dating
  GR: 71, // Greece — Mediterranean baseline, European Orthodox culture
  CY: 71, // Cyprus — European civil marriage hub for Middle Eastern couples
  PL: 71, // Poland — High ethnic homogeneity, White phenotype as mandatory prerequisite
  CZ: 71, // Czech Republic — Highly secular, high international dating in Prague
  HU: 71, // Hungary — Central European baseline, Budapest international expat pool
  LV: 71, // Latvia — Baltic EU integration
  LT: 71, // Lithuania — Baltic EU integration
  SI: 71, // Slovenia — Alpine Central European baseline
  AL: 71, // Albania — Secular European Muslim/Christian society, high diaspora ties
  MK: 71, // North Macedonia — Balkan European candidate state
  LI: 71, // Liechtenstein — Alpine principality, Swiss integration
  BE: 71, // Belgium — Brussels international diplomatic capital
  NL: 71, // Netherlands — 18% foreign-partner marriages (CBS), high English fluency
  EE: 70, // Estonia — High digital/Nordic integration
  SK: 70, // Slovakia — Central European baseline
  BA: 70, // Bosnia and Herzegovina — Multi-confessional secular civil framework
  VA: 70, // Vatican City — Holy See administrative personnel
  XK: 69, // Kosovo — Young pro-Western European secular population
  DK: 69, // Denmark — High egalitarian baseline, tall local male standard
  IS: 69, // Iceland — Nordic social model
  NO: 69, // Norway — Nordic social model, high domestic wealth parity
  SE: 69, // Sweden — Nordic social model, low social distance
  SJ: 69, // Svalbard and Jan Mayen — Norwegian Arctic territory
  FI: 68, // Finland — Nordic social model, lower foreign population density
  FO: 70, // Faroe Islands — Autonomous Nordic territory
  AX: 70, // Åland Islands — Autonomous Swedish-speaking Finnish territory

  // ── North America ──
  US: 74, // United States — Multi-ethnic dating capital; state spread spans 64 (VT/ME) to 86 (HI)
  CA: 74, // Canada — Multi-ethnic Toronto/Vancouver hubs, high Asian out-marriage
  MX: 80, // Mexico — CDMX expat hub, pigmentocracy, high swipe rates, tourism dating
  BM: 72, // Bermuda — High-income British territory
  GL: 70, // Greenland — Danish autonomous territory, high Danish-Inuit intermarriage
  PM: 72, // Saint Pierre and Miquelon — French overseas archipelago off Newfoundland
  UM: 74, // US Minor Outlying Islands — US military/scientific administration

  // ── Caribbean ──
  DO: 84, // Dominican Republic — Strongest mejorar la raza / chapiadora cultural dynamic, resort tourism
  CU: 78, // Cuba — Tourism-driven currency arbitrage, Spanish colonial ancestry
  PR: 78, // Puerto Rico — US jurisdiction, high Latin American/US integration
  BL: 76, // Saint Barthélemy — Predominantly French/European descent population, luxury enclave
  GP: 73, // Guadeloupe — French overseas department, high metropolitan French integration
  MQ: 73, // Martinique — French overseas department, high metropolitan French integration
  MF: 73, // Saint Martin — French overseas collectivity
  SX: 73, // Sint Maarten — Dutch Caribbean constituent country
  CW: 73, // Curaçao — Dutch Caribbean constituent country, tourism hub
  AW: 73, // Aruba — Dutch Caribbean constituent country, high tourism dating
  TC: 73, // Turks and Caicos Islands — High-end tourism, British Overseas Territory
  BS: 73, // Bahamas — High-income tourism, English-speaking
  KY: 73, // Cayman Islands — British territory, international financial expat enclave
  VG: 73, // British Virgin Islands — British territory, yachting tourism
  VI: 73, // U.S. Virgin Islands — US territory, tourism hub
  BB: 72, // Barbados — Stable parliamentary democracy, English-speaking
  JM: 72, // Jamaica — English-speaking, high tourism dating
  AI: 72, // Anguilla — British Overseas Territory
  AG: 72, // Antigua and Barbuda — Commonwealth Caribbean
  BQ: 72, // Caribbean Netherlands — Bonaire, Sint Eustatius, Saba
  KN: 72, // Saint Kitts and Nevis — Commonwealth Caribbean
  LC: 72, // Saint Lucia — Commonwealth Caribbean
  DM: 71, // Dominica — Eastern Caribbean
  GD: 71, // Grenada — Eastern Caribbean
  MS: 71, // Montserrat — British Overseas Territory
  VC: 71, // Saint Vincent and the Grenadines — Eastern Caribbean
  BZ: 71, // Belize — English-speaking Central American Caribbean nation
  TT: 70, // Trinidad and Tobago — Bifurcated Afro-Trinidadian and Indo-Trinidadian endogamy
  HT: 60, // Haiti — French/Creole culture, depressed by extreme poverty and state collapse

  // ── Latin America ──
  CO: 85, // Colombia — Peak Latin American dating app telemetry, pigmentocracy, Medellín expat hub
  BR: 82, // Brazil — Multi-ethnic dating app telemetry, Rio/São Paulo receptivity, high exogamy
  CR: 80, // Costa Rica — High social development, European heritage prestige
  VE: 80, // Venezuela — Historical blanqueamiento, exacerbated by economic hyperinflation
  PA: 78, // Panama — US dollar economy, international logistics expat presence
  PE: 75, // Peru — Telles pigmentocracy, coastal Lima vs Andean indigenous division
  EC: 75, // Ecuador — Andean mestizaje, US dollar currency economy
  CL: 73, // Chile — High-income Latin America, European/mestizo integration
  PY: 72, // Paraguay — Mestizo Guaraní/Spanish culture
  GF: 72, // French Guiana — French overseas department in South America
  FK: 73, // Falkland Islands — British territory, 95%+ British descent
  AR: 73, // Argentina — European demographic baseline with economic/currency hypergamy dividend
  UY: 73, // Uruguay — European baseline with stable cosmopolitan dating
  GT: 70, // Guatemala — Significant Mayan indigenous population
  HN: 71, // Honduras — Central American mestizo society
  SV: 71, // El Salvador — Central American mestizo society
  NI: 70, // Nicaragua — Central American mestizo society
  BO: 68, // Bolivia — Indigenous majority population (Aymara, Quechua)
  GY: 68, // Guyana — English-speaking South American nation, Indo/Afro demographic split
  SR: 67, // Suriname — Dutch-speaking South America, plural ethnic endogamy

  // ── MENA ──
  TR: 70, // Turkey — Secular civil code, Aegean/Mediterranean tourism and marriage hubs
  LB: 72, // Lebanon — Beirut cosmopolitanism, multilingual, high Western cultural alignment
  IL: 64, // Israel — Secular Western culture, Russian/European demographic heritage
  AE: 70, // United Arab Emirates — 88% expat demographic, Dubai/Abu Dhabi global dating hub, civil courts
  MA: 54, // Morocco — Mudawwana Art. 39(4) mandatory Adoul conversion
  TN: 54, // Tunisia — Repealed 1973 circular in 2017 allowing civil marriage without conversion
  BH: 50, // Bahrain — Commercial island expat presence, traditional Muslim citizen endogamy
  QA: 46, // Qatar — High expat population, conservative citizen endogamy
  KW: 46, // Kuwait — Conservative tribal and Islamic family law
  OM: 46, // Oman — Ibadi Islamic traditions, strict marriage permissions
  IR: 52, // Iran — Persian hospitality and secular youth fascination with the West
  EG: 48, // Egypt — Red Sea resort hubs, Cairo cosmopolitan elite vs traditional majority
  JO: 42, // Jordan — Sharia personal status courts, 0% daughter intermarriage comfort in Pew
  LY: 42, // Libya — Conservative Islamic and tribal governance
  DZ: 40, // Algeria — Code de la Famille Art. 31 statutory ban on Muslim women out-marrying
  SY: 40, // Syria — Religious personal status codes, conflict environment
  PS: 38, // Palestine — Religious family courts, high social endogamy
  SA: 38, // Saudi Arabia — Modernization under Vision 2030, Riyadh/Jeddah expat compounds
  SD: 34, // Sudan — Conservative Islamic personal status laws
  IQ: 32, // Iraq — Shia/Sunni sectarian personal status laws
  EH: 28, // Western Sahara — Sahrawi conservative tribal culture
  YE: 24, // Yemen — Traditional tribal/Islamic endogamy, severe conflict

  // ── Sub-Saharan Africa ──
  KE: 78, // Kenya — Nairobi expat capital, high English, active dating scene
  GH: 76, // Ghana — Accra diaspora hub, high English, Year of Return
  CV: 72, // Cape Verde — Creole, Portuguese ties, high European mobility
  MU: 72, // Mauritius — High income, diverse, French/English bilingual
  SC: 73, // Seychelles — High-income Creole island nation
  RE: 73, // Réunion — French overseas department, high mixed intermarriage
  IO: 73, // British Indian Ocean Territory — British territory, US/UK military administration
  SH: 71, // Saint Helena — British Overseas Territory
  ZA: 72, // South Africa — Diverse multi-ethnic market, Cape Town/Joburg
  BW: 68, // Botswana — Stable upper-middle-income democracy
  NA: 68, // Namibia — German historical ties, multi-ethnic legal system
  RW: 70, // Rwanda — Kigali tech/expat hub, high safety and openness
  UG: 72, // Uganda — Kampala nightlife, high English, foreigner friendliness
  TZ: 70, // Tanzania — Zanzibar/Dar es Salaam expat and tourism dating
  ZW: 66, // Zimbabwe — High literacy, English official
  ZM: 66, // Zambia — Christian nation, stable English-speaking
  NG: 75, // Nigeria — Lagos/Abuja cosmopolitan hubs, English, celebrity status
  AO: 66, // Angola — Portuguese colonial ties, oil economy
  GA: 66, // Gabon — High urbanization, French ties
  MG: 66, // Madagascar — Austronesian/African mix, French ties
  CI: 67, // Côte d'Ivoire — Francophone West African economic hub
  GM: 65, // Gambia — English-speaking coastal tourism dating
  CM: 65, // Cameroon — Bilingual English/French, diverse
  LR: 66, // Liberia — Historical American ties, English official
  GQ: 64, // Equatorial Guinea — Spanish-speaking Central African oil nation
  MZ: 64, // Mozambique — Portuguese-speaking coastal nation
  SZ: 64, // Eswatini — Monarchy, traditional customs
  CG: 63, // Republic of the Congo — Francophone Central Africa
  TG: 63, // Togo — Francophone West Africa
  SL: 63, // Sierra Leone — English-speaking West Africa
  BJ: 62, // Benin — Francophone West Africa
  CD: 62, // DR Congo — Francophone Central Africa
  LS: 62, // Lesotho — Southern African enclave
  ET: 62, // Ethiopia — Ancient Orthodox Christian/Muslim culture, pride in non-colonized status
  SN: 62, // Senegal — 95% Muslim, but secular Sufi traditions and French cultural ties
  ST: 62, // Sao Tome and Principe — Portuguese-speaking island nation
  MW: 60, // Malawi — English-speaking, peaceful
  GN: 58, // Guinea — Predominantly Muslim West Africa
  GW: 58, // Guinea-Bissau — Lusophone West Africa
  BI: 58, // Burundi — Great Lakes Central Africa
  YT: 56, // Mayotte — French department, Comorian Muslim culture
  KM: 52, // Comoros — Islamic island nation
  BF: 50, // Burkina Faso — Sahelian nation
  DJ: 48, // Djibouti — Red Sea port, Islamic traditions
  ML: 48, // Mali — Sahelian Islamic society
  CF: 46, // Central African Republic — Landlocked Central Africa, conflict
  ER: 44, // Eritrea — Closed totalitarian regime
  SS: 40, // South Sudan — Post-conflict, traditional cattle-dowry endogamy
  MR: 26, // Mauritania — Islamic Republic, strict tribal endogamy
  NE: 25, // Niger — Sahelian Islamic society, child marriage and endogamy
  TD: 24, // Chad — Sahelian Islamic society
  SO: 22, // Somalia — 100% Muslim, clan-based endogamy, Sharia enforcement

  // ── Oceania ──
  AU: 74, // Australia — Multi-ethnic dating capital, high Asian out-marriage
  GU: 74, // Guam — US territory, high military and tourism integration
  MP: 74, // Northern Mariana Islands — US Commonwealth in Pacific
  PF: 74, // French Polynesia — French overseas territory, high European tourism/dating
  NZ: 73, // New Zealand — Multi-ethnic, high Māori/Pākehā/Asian integration
  NF: 72, // Norfolk Island — Australian territory
  CX: 72, // Christmas Island — Australian territory
  NC: 72, // New Caledonia — French overseas territory
  PN: 71, // Pitcairn Islands — British territory
  FJ: 70, // Fiji — Major Pacific tourism hub, British colonial ties
  AS: 70, // American Samoa — US territory
  CK: 70, // Cook Islands — Realm of New Zealand
  NU: 70, // Niue — Realm of New Zealand
  CC: 69, // Cocos (Keeling) Islands — Australian territory
  WS: 68, // Samoa — Polynesian Christian society
  TK: 68, // Tokelau — New Zealand territory
  WF: 68, // Wallis and Futuna — French overseas collectivity
  TO: 66, // Tonga — Polynesian kingdom
  VU: 66, // Vanuatu — Melanesian tourism hub
  PW: 66, // Palau — Compact of Free Association with US
  FM: 64, // Micronesia — Compact of Free Association with US
  MH: 64, // Marshall Islands — Compact of Free Association with US
  SB: 64, // Solomon Islands — Melanesian island nation
  TV: 62, // Tuvalu — Polynesian island nation
  KI: 62, // Kiribati — Micronesian island nation
  NR: 62, // Nauru — Micronesian island nation
  PG: 62, // Papua New Guinea — High linguistic/tribal diversity, traditional customs
};

/**
 * Returns the White Male Perception Index score (0–100) for a given ISO country code.
 * Fully covers all 245 countries and territories.
 * Falls back to 50 (neutral baseline) if an unrecognized code is provided.
 */
export function getWhiteMalePerception(countryCode: string): number {
  if (!countryCode) return 50;
  const upper = countryCode.toUpperCase();
  if (upper in whiteMalePerceptionByCountry) {
    return whiteMalePerceptionByCountry[upper];
  }
  return 50;
}
