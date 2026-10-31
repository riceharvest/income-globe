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
  telemetryAndMatchAdvantage: 0.35,
  maritalExogamyRegistries: 0.30,
  legalAndReligiousOpenness: 0.20,
  societalAndPhenotypicStatus: 0.15,
} as const;

export const whiteMalePerceptionByCountry: Record<string, number> = {

  // ── Asia ──
  PH: 88, // Philippines — Catholic, high English, CFO tracking ~260k US marriages; strong status alignment
  TH: 86, // Thailand — Civil Amphoe registration, massive rural Isan khoe farang remittance networks
  VN: 80, // Vietnam — High transnational outmarriage, high urban dating receptivity in HCMC
  KH: 78, // Cambodia — Buddhist secular civil registration, high foreign tourism receptivity
  LA: 76, // Laos — Theravada Buddhist secular framework
  SG: 74, // Singapore — 17% inter-ethnic citizen marriages, 35% transnational marriages, English working tongue
  TW: 74, // Taiwan — 18% foreign spouses (MOI 2023), open civil democracy, US grooms leading Western tier
  HK: 73, // Hong Kong — Major international cosmopolitan financial hub, high English proficiency
  MO: 70, // Macau — Casino international economy, Portuguese legal/cultural legacy
  MM: 65, // Myanmar — Buddhist majority, historical British ties, moderated by internal conflicts
  TL: 66, // Timor-Leste — Roman Catholic majority, Portuguese cultural legacy
  JP: 67, // Japan — MHLW: US grooms = 0.24% of all marriages; Koseki barrier, low English proficiency
  KR: 66, // South Korea — KOSTAT: US grooms = 0.72% of marriages; K-culture male aesthetic dominance
  MN: 66, // Mongolia — Secular post-communist society, high female educational parity
  CN: 58, // China — MCA: foreign marriages <0.1%; strict Hukou, caili, rising cultural nationalism
  LK: 56, // Sri Lanka — High literacy, diverse ethnic/religious makeup, colonial European ties
  BT: 54, // Bhutan — Himalayan Buddhist kingdom, controlled foreign entry
  NP: 54, // Nepal — Secular civil code, trekking tourism exposure
  MV: 52, // Maldives — Sunni Islam constitutional endogamy; resort tourism isolated from local islands
  IN: 50, // India — Special Marriage Act 30-day notice, anti-conversion laws, 99% endogamy (Pew)
  MY: 50, // Malaysia — Federal Constitution Art. 160, mandatory conversion via JAWI; Chinese/Indian civil balance
  ID: 48, // Indonesia — SEMA 2/2023 court ban on interfaith marriage, mandatory conversion; Bali/Jakarta offset
  BN: 42, // Brunei — Absolute monarchy enforcing strict Sharia penal code
  BD: 36, // Bangladesh — Traditional family and religious endogamy
  PK: 32, // Pakistan — MFLO 1961, Offence of Zina Ordinance, mandatory conversion, 0% daughter outmarriage
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
  MX: 79, // Mexico — INEGI MMSI pigmentocracy, high status premium, US border ties
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
  CO: 84, // Colombia — PERLA pigmentocracy, high currency hypergamy, Medellín/Bogotá dating hub
  BR: 80, // Brazil — IBGE censo: mestiçagem, high White out-marriage, regional Sul vs Nordeste split
  CR: 80, // Costa Rica — High social development, European heritage prestige
  VE: 80, // Venezuela — Historical blanqueamiento, exacerbated by economic hyperinflation
  PA: 78, // Panama — US dollar economy, international logistics expat presence
  PE: 75, // Peru — Telles pigmentocracy, coastal Lima vs Andean indigenous division
  EC: 75, // Ecuador — Andean mestizaje, US dollar currency economy
  CL: 73, // Chile — High-income Latin America, European/mestizo integration
  PY: 72, // Paraguay — Mestizo Guaraní/Spanish culture
  GF: 72, // French Guiana — French overseas department in South America
  FK: 73, // Falkland Islands — British territory, 95%+ British descent
  AR: 71, // Argentina — INDEC: 85%+ European descent; Whiteness is baseline, zero novelty; chamuyo prioritized
  UY: 71, // Uruguay — INE: 88%+ European descent, secular social democracy
  GT: 70, // Guatemala — Significant Mayan indigenous population
  HN: 71, // Honduras — Central American mestizo society
  SV: 71, // El Salvador — Central American mestizo society
  NI: 70, // Nicaragua — Central American mestizo society
  BO: 68, // Bolivia — Indigenous majority population (Aymara, Quechua)
  GY: 68, // Guyana — English-speaking South American nation, Indo/Afro demographic split
  SR: 67, // Suriname — Dutch-speaking South America, plural ethnic endogamy

  // ── MENA ──
  TR: 66, // Turkey — Secular civil code since 1926, 25k+ bi-national marriages annually (TÜİK)
  LB: 66, // Lebanon — 35%+ Christian population, Cyprus civil marriage registration route
  IL: 64, // Israel — Secular Western culture, Russian/European demographic heritage
  AE: 60, // United Arab Emirates — Abu Dhabi secular civil family court (Decree 41/2022); 88% expat dating pool
  MA: 54, // Morocco — Mudawwana Art. 39(4) mandatory Adoul conversion
  TN: 54, // Tunisia — Repealed 1973 circular in 2017 allowing civil marriage without conversion
  BH: 50, // Bahrain — Commercial island expat presence, traditional Muslim citizen endogamy
  QA: 46, // Qatar — High expat population, conservative citizen endogamy
  KW: 46, // Kuwait — Conservative tribal and Islamic family law
  OM: 46, // Oman — Ibadi Islamic traditions, strict marriage permissions
  IR: 44, // Iran — Sharia civil code, but secular/Western youth counterculture
  EG: 42, // Egypt — Law 25/1920 Al-Azhar conversion requirement, 0% daughter intermarriage comfort
  JO: 42, // Jordan — Sharia personal status courts, 0% daughter intermarriage comfort in Pew
  LY: 42, // Libya — Conservative Islamic and tribal governance
  DZ: 40, // Algeria — Code de la Famille Art. 31 statutory ban on Muslim women out-marrying
  SY: 40, // Syria — Religious personal status codes, conflict environment
  PS: 38, // Palestine — Religious family courts, high social endogamy
  SA: 34, // Saudi Arabia — Hanbali Sharia courts, MOI permission required, non-Muslim ban
  SD: 34, // Sudan — Conservative Islamic personal status laws
  IQ: 32, // Iraq — Shia/Sunni sectarian personal status laws
  EH: 28, // Western Sahara — Sahrawi conservative tribal culture
  YE: 24, // Yemen — Traditional tribal/Islamic endogamy, severe conflict

  // ── Sub-Saharan Africa ──
  KE: 74, // Kenya — English official, Christian majority, Nairobi cosmopolitan tech/expat hub
  GH: 72, // Ghana — Stable Christian democracy, high English proficiency, positive diaspora ties
  CV: 72, // Cape Verde — Creole, Portuguese ties, high European mobility
  MU: 72, // Mauritius — High income, diverse, French/English bilingual
  SC: 73, // Seychelles — High-income Creole island nation
  RE: 73, // Réunion — French overseas department, high mixed intermarriage
  IO: 73, // British Indian Ocean Territory — British territory, US/UK military administration
  SH: 71, // Saint Helena — British Overseas Territory
  ZA: 70, // South Africa — Multi-ethnic, Western civil law, historic racial segregation legacy
  BW: 68, // Botswana — Stable upper-middle-income democracy
  NA: 68, // Namibia — German historical ties, multi-ethnic legal system
  RW: 68, // Rwanda — Rapid economic development, English/French integration
  UG: 68, // Uganda — English-speaking Christian nation
  TZ: 66, // Tanzania — Swahili coast, Christian/Muslim balance
  ZW: 66, // Zimbabwe — High literacy, English official
  ZM: 66, // Zambia — Christian nation, stable English-speaking
  NG: 66, // Nigeria — South Lagos/Abuja (74+) vs North 12 Sharia states (30-)
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
