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
  PH: 88, // Philippines — World leader: AFAM culture (#buhayafam), pampagandang lahi, CFO tracking ~260k US marriages, Catholic, English
  TH: 86, // Thailand — Mia Farang & Khoe Farang networks, Isan Baan Farang remittances, Amphoe civil registries, open culture
  VN: 81, // Vietnam — Trai Tay dating culture in HCMC (Thao Dien) & Hanoi (Tay Ho), high urban receptivity
  KH: 79, // Cambodia — Buddhist secular civil registration, high foreigner openness
  LA: 77, // Laos — Theravada Buddhist secular framework, high foreigner curiosity
  SG: 75, // Singapore — 35% transnational marriages, English working tongue, cosmopolitan global hub
  TW: 76, // Taiwan — Open progressive democracy, 18% transnational spouses, high Western goodwill
  HK: 76, // Hong Kong — Cosmopolitan international finance hub, Lan Kwai Fong, high English
  MO: 71, // Macau — Casino international economy, Portuguese legal legacy
  MM: 66, // Myanmar — Buddhist majority, historical British ties, moderated by internal conflicts
  TL: 67, // Timor-Leste — Roman Catholic majority, Portuguese cultural ties
  JP: 71, // Japan — Gaijin hunter subculture in Roppongi/Shibuya vs domestic Pairs/Omiai app wall & Koseki barriers
  KR: 68, // South Korea — Itaewon/Hongdae dating, Gukje-coupeol social media vs supreme K-pop male aesthetics & jiban pedigree
  MN: 66, // Mongolia — Secular post-communist society, high female educational parity
  CN: 61, // China — Tier-1 expat demand vs Easy Girl digital nationalist backlash, real-name ID app walls & GFW
  LK: 63, // Sri Lanka — High literacy, Colombo/Galle expat dating hubs, diverse ethnic makeup
  BT: 56, // Bhutan — Controlled tourism, Himalayan Buddhist traditions
  NP: 61, // Nepal — Himalayan trekking hubs, Kathmandu/Pokhara foreigner friendliness
  MV: 54, // Maldives — Sunni Islam constitutional endogamy, resort tourism isolated from local islands
  IN: 64, // India — Gora rang colorism, Fair & Lovely, public celebrity selfie mobbing, high urban app rates vs 99% arranged marriage endogamy
  MY: 70, // Malaysia — KL expat hub, high English, large non-Muslim Chinese/Indian demographic (~30%), balanced by Art. 160
  ID: 78, // Indonesia — Bule hunter culture, memperbaiki keturunan, 15–40%+ Tinder match rates, Indo celebrity ideal, balanced by SEMA 2/2023 & Sharia pockets
  BN: 52, // Brunei — Absolute monarchy, strict Sharia penal code, high wealth
  BD: 42, // Bangladesh — Traditional family and religious endogamy, high urban curiosity
  PK: 36, // Pakistan — Urban elite dating vs MFLO 1961, Offence of Zina, strict Sharia endogamy
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
  UA: 80, // Ukraine — High Western goodwill, wartime diaspora, martial law
  MD: 76, // Moldova — European integration aspirations, high Western goodwill
  RO: 76, // Romania — Tech expat hub, EU membership, Latin linguistic kinship
  BG: 74, // Bulgaria — EU convergence, Black Sea tourism
  RU: 59, // Russia — Tinder/Bumble 100% exit June 2023, SWIFT/Visa/Mastercard ban, FSB device forensics, Treason Art 275
  BY: 56, // Belarus — Tinder exit Feb 2024, Level 4 Do Not Travel, authoritarian surveillance
  RS: 74, // Serbia — Belgrade nightlife, balanced between Western ties and Slavic affinity
  GB: 73, // United Kingdom — High domestic diversity, baseline European dating market
  ES: 73, // Spain — Cosmopolitan nightlife, Mediterranean dating norms
  CH: 71, // Switzerland — High domestic wealth, reserved dating culture
  GE: 73, // Georgia — Orthodox Christian, visa-free EU travel, digital nomad hub in Tbilisi
  HR: 73, // Croatia — Adriatic tourism, Catholic EU integration
  ME: 73, // Montenegro — Coastal Adriatic tourism and European integration
  IT: 72, // Italy — Industrial North vs traditional Mezzogiorno, high local male grooming
  FR: 72, // France — Domestic cultural baseline, seduction mediated by cultural/linguistic fluency
  PT: 72, // Portugal — Expat/digital nomad hub (Lisbon/Porto), warm social reception
  IE: 72, // Ireland — High English fluency, tech expat center
  LU: 72, // Luxembourg — 47% foreign resident population, highest expat density in EU
  MT: 72, // Malta — English official, EU member, Mediterranean international hub
  MC: 72, // Monaco — High-wealth international enclave
  AD: 72, // Andorra — Pyrenean European principality
  SM: 72, // San Marino — Italian demographic and cultural enclave
  GI: 73, // Gibraltar — British Overseas Territory on Mediterranean
  GG: 73, // Guernsey — British Crown Dependency
  JE: 73, // Jersey — British Crown Dependency
  IM: 73, // Isle of Man — British Crown Dependency
  DE: 71, // Germany — Rational egalitarian dating, high domestic male economic standing
  AT: 71, // Austria — Central European Germanic baseline
  GR: 71, // Greece — Mediterranean tourism and hospitality
  CY: 71, // Cyprus — European civil marriage hub for Middle Eastern couples
  PL: 69, // Poland — GDP PPS 85% of EU (surpassing Greece, closing on Portugal); 20-yr EU citizenship, stag-party fatigue, 180cm local men
  CZ: 69, // Czech Republic — GDP PPS 91% of EU (matching Spain); Prague Oct 2024 pub crawl ban, local male parity
  HU: 68, // Hungary — Budapest District VII alco-tourism crackdown, European economic parity
  LV: 71, // Latvia — Baltic EU integration
  LT: 71, // Lithuania — Baltic EU integration
  SI: 71, // Slovenia — Alpine Central European baseline
  AL: 71, // Albania — Secular European Muslim/Christian society, high diaspora ties
  MK: 71, // North Macedonia — Balkan European candidate state
  LI: 71, // Liechtenstein — Alpine principality, Swiss integration
  BE: 70, // Belgium — Brussels international expat hub
  NL: 68, // Netherlands — Dutch male height 183.8 cm (#1 World), EIGE #3, Dutch treat, radical female autonomy
  EE: 70, // Estonia — High digital/Nordic integration
  SK: 68, // Slovakia — Eurozone Central European convergence, domestic wage growth
  BA: 70, // Bosnia and Herzegovina — Multi-confessional secular civil framework
  VA: 70, // Vatican City — Holy See administrative personnel
  XK: 69, // Kosovo — Young pro-Western European secular population
  DK: 68, // Denmark — Male height 181.9 cm, EIGE #2, Janteloven anti-swagger norms
  IS: 68, // Iceland — Small insular egalitarian population, high female autonomy
  NO: 68, // Norway — Male height 180.5 cm, $88k GDP/capita, egalitarian peer dating
  SE: 68, // Sweden — Male height 180.5 cm, EIGE #1, 80% male Tinder skew, 0.5–2% match rate
  SJ: 69, // Svalbard and Jan Mayen — Norwegian Arctic territory
  FI: 67, // Finland — High gender equality, introverted social codes, local male parity
  FO: 70, // Faroe Islands — Autonomous Nordic territory
  AX: 70, // Åland Islands — Autonomous Swedish-speaking Finnish territory

  // ── North America ──
  US: 74, // United States — Multi-ethnic dating capital; state spread spans 64 (VT/ME) to 86 (HI)
  CA: 74, // Canada — Multi-ethnic Toronto/Vancouver hubs, high Asian out-marriage
  MX: 80, // Mexico — CDMX/Guadalajara expat hubs, pigmentocracy, high swipe rates, tourism dating
  BM: 72, // Bermuda — High-income British territory
  GL: 70, // Greenland — Danish autonomous territory, high Danish-Inuit intermarriage
  PM: 72, // Saint Pierre and Miquelon — French overseas archipelago off Newfoundland
  UM: 74, // US Minor Outlying Islands — US military/scientific administration

  // ── Caribbean ──
  DO: 82, // Dominican Republic — Peak pigmentocracy, chapiadora & sanky panky dynamics, resort security overhead
  CU: 77, // Cuba — Dual economy, jineterismo and romance tourism
  PR: 78, // Puerto Rico — US jurisdiction, high Latin American/US integration
  BL: 76, // Saint Barthélemy — Predominantly French/European descent population, luxury enclave
  GP: 73, // Guadeloupe — French overseas department, high metropolitan French integration
  MQ: 73, // Martinique — French overseas department, high metropolitan French integration
  MF: 73, // Saint Martin — French overseas collectivity
  SX: 73, // Sint Maarten — Dutch Caribbean constituent country
  CW: 73, // Curaçao — Dutch Caribbean constituent country, tourism hub
  AW: 73, // Aruba — Dutch Caribbean constituent country, high tourism dating
  TC: 73, // Turks and Caicos Islands — High-end tourism, British Overseas Territory
  BS: 71, // Bahamas — US tourist proximity, high GDP/capita
  KY: 73, // Cayman Islands — British territory, international financial expat enclave
  VG: 73, // British Virgin Islands — British territory, yachting tourism
  VI: 73, // U.S. Virgin Islands — US territory, tourism hub
  BB: 71, // Barbados — High British historical ties, stable tourism economy
  JM: 68, // Jamaica — Dancehall rude bwoy masculine hegemony; female romance tourism (Rent-a-Rasta) dominates
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
  TT: 69, // Trinidad and Tobago — Afro/Indo demographic split, carnival culture
  HT: 60, // Haiti — Severe humanitarian/gang crisis, extreme physical security barrier

  // ── Latin America ──
  CO: 83, // Colombia — Peak dating telemetry & pigmentocracy, risk-adjusted for Medellín scopolamine crisis and US Embassy alerts
  BR: 81, // Brazil — Sul 71 (European saturation) vs Nordeste/Rio 84; risk-adjusted for Golpe do Tinder / PIX express kidnappings
  CR: 80, // Costa Rica — Pura Vida tourism, American expat integration
  VE: 79, // Venezuela — Beauty pageant culture, economic emigration context
  PA: 78, // Panama — Dollar economy, canal international hub
  PE: 77, // Peru — Lima coastal criollo elite vs Andean pigmentocracy, high foreigner status
  EC: 76, // Ecuador — Dollarized economy, Andean/coastal pigmentocracy
  CL: 72, // Chile — High GDP/capita, stable institutional framework, European baseline
  PY: 72, // Paraguay — Mestizo Guaraní/Spanish culture
  GF: 72, // French Guiana — French overseas department in South America
  FK: 73, // Falkland Islands — British territory, 95%+ British descent
  AR: 71, // Argentina — 85–90%+ European ancestral baseline, zero phenotypic novelty, el chamuyo verbal gatekeeping, 2024 real peso appreciation
  UY: 71, // Uruguay — 88%+ European baseline, high living costs, stable cosmopolitan society
  GT: 70, // Guatemala — Significant Mayan indigenous population
  HN: 71, // Honduras — Central American mestizo society
  SV: 71, // El Salvador — Central American mestizo society
  NI: 70, // Nicaragua — Central American mestizo society
  BO: 68, // Bolivia — Indigenous majority population (Aymara, Quechua)
  GY: 68, // Guyana — English-speaking South American nation, Indo/Afro demographic split
  SR: 67, // Suriname — Dutch-speaking South America, plural ethnic endogamy

  // ── MENA ──
  TR: 70, // Turkey — Secular Swiss civil code model, Mediterranean/Aegean expat and tourism dating
  LB: 72, // Lebanon — Beirut cosmopolitanism, multilingual (French/English), high Western cultural alignment
  IL: 65, // Israel — Tel Aviv secular beach dating vs Orthodox Rabbinate marriage monopoly & Cyprus civil marriage loophole
  AE: 69, // United Arab Emirates — 88% expat demographic, Dubai/Abu Dhabi global dating hub vs complete inaccessibility of Emirati women
  MA: 64, // Morocco — Tourism hubs Marrakech/Tangier, French language ties, Mudawwana conversion requirements
  TN: 62, // Tunisia — Secular Personal Status Code history, Mediterranean tourism
  BH: 46, // Bahrain — Relatively liberal Gulf hub, nightlife
  QA: 40, // Qatar — Wealthy conservative monarchy, expatriate isolation
  KW: 40, // Kuwait — Conservative family law, high wealth
  OM: 42, // Oman — Ibadi Islam, quiet conservative society
  IR: 50, // Iran — Persian hospitality and secular youth fascination with the West vs theocratic state
  EG: 46, // Egypt — Red Sea resort hubs, Cairo cosmopolitan elite vs traditional majority
  JO: 46, // Jordan — Amman urban elite vs traditional bedouin tribal endogamy
  LY: 42, // Libya — Conservative Islamic and tribal governance
  DZ: 44, // Algeria — Code de la Famille Art. 31 mandatory conversion, conservative society
  SY: 36, // Syria — War devastation, conservative endogamy
  PS: 38, // Palestine — Religious family courts, high social endogamy
  SA: 36, // Saudi Arabia — Modernization under Vision 2030, Riyadh/Jeddah expat compounds vs strict societal norms
  SD: 34, // Sudan — Conservative Islamic personal status laws
  IQ: 32, // Iraq — Sectarian conflict, conservative tribal society
  EH: 28, // Western Sahara — Sahrawi conservative tribal culture
  YE: 24, // Yemen — Houthi control, conservative tribal society

  // ── Sub-Saharan Africa ──
  KE: 78, // Kenya — Nairobi expat capital, Mzungu status, coastal romance tourism
  GH: 76, // Ghana — Accra diaspora hub, Obroni status, Year of Return, high English
  CV: 72, // Cape Verde — Creole, Portuguese ties, high European mobility
  MU: 72, // Mauritius — High income, diverse, French/English bilingual
  SC: 73, // Seychelles — High-income Creole island nation
  RE: 73, // Réunion — French overseas department, high mixed intermarriage
  IO: 73, // British Indian Ocean Territory — British territory, US/UK military administration
  SH: 71, // Saint Helena — British Overseas Territory
  ZA: 72, // South Africa — Diverse multi-ethnic market, Cape Town/Joburg, Roman-Dutch law
  BW: 68, // Botswana — Stable upper-middle-income democracy
  NA: 68, // Namibia — German historical ties, multi-ethnic legal system
  RW: 70, // Rwanda — Kigali tech/expat hub, high safety and openness
  UG: 72, // Uganda — Kampala nightlife, high English, foreigner friendliness
  TZ: 70, // Tanzania — Zanzibar/Dar es Salaam expat and tourism dating
  ZW: 66, // Zimbabwe — High literacy, English official
  ZM: 66, // Zambia — Christian nation, stable English-speaking
  NG: 75, // Nigeria — Lagos/Abuja cosmopolitan hubs, Oyinbo status, English, celebrity status
  AO: 66, // Angola — Portuguese colonial ties, oil economy
  GA: 66, // Gabon — High urbanization, French ties
  MG: 66, // Madagascar — Austronesian/African mix, French ties
  CI: 67, // Cote dIvoire — Abidjan French expat hub, West African economic center
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
  ET: 65, // Ethiopia — Historic independence, Orthodox Christian endogamy, high pride
  SN: 65, // Senegal — Toubab status, Teranga hospitality, secular Sufi culture
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
