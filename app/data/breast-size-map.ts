// Average breast size by country (cup only, not band)
// Scale: 1=AA, 2=A, 3=B, 4=C, 5=D, 6=DD
// Sources: gitnux.org, bedbible.com, worlddata.info (2024-2025) - more conservative estimates

export const breastSizeByCountry: Record<string, number> = {
  // Largest: D (Nordic + Russia)
  NO: 5, // Norway D
  SE: 5, // Sweden D  
  FI: 5, // Finland D
  RU: 5, // Russia D
  IS: 4, // Iceland C
  LU: 4, // Luxembourg C

  // Large: C
  US: 4, // USA C (some say DD but that's band+cup)
  GB: 4, // UK C
  CO: 4, // Colombia C
  VE: 4, // Venezuela C
  NL: 4, // Netherlands C
  CA: 4, // Canada C
  DE: 4, // Germany C
  DK: 4, // Denmark C
  CH: 5, // Switzerland D
  AT: 5, // Austria D

  // Medium: C
  PL: 4, // Poland C
  BG: 4, // Bulgaria C
  IE: 4, // Ireland C
  CZ: 4, // Czech C

  // Medium: B-C
  AU: 3, // Australia B-C
  NZ: 3, // NZ B-C
  FR: 3, // France B-C
  ES: 3, // Spain B-C
  IT: 3, // Italy B-C
  GR: 3, // Greece B
  HU: 3, // Hungary B

  // Medium: B
  BE: 3, // Belgium B
  PT: 3, // Portugal B
  TR: 3, // Turkey B
  GE: 3, // Georgia B

  // Smaller: B
  BR: 3, // Brazil B
  MX: 3, // Mexico B
  AR: 3, // Argentina B
  CL: 3, // Chile B

  // Small: A-B
  JP: 2, // Japan A-B
  CN: 2, // China A
  KR: 2, // Korea A
  TH: 2, // Thailand A
  VN: 1, // Vietnam AA-A
  IN: 2, // India A
  ID: 2, // Indonesia A
  MY: 2, // Malaysia A
  PH: 2, // Philippines A
  BD: 1, // Bangladesh AA
  NP: 1, // Nepal AA
  MM: 1, // Myanmar AA

  // Small: A
  EG: 2, // Egypt A
  SA: 2, // Saudi A
  IQ: 2, // Iraq A
  IR: 2, // Iran A
  PK: 2, // Pakistan A
  MA: 2, // Morocco A
  DZ: 2, // Algeria A
  TN: 2, // Tunisia A
  LY: 2, // Libya A
  SY: 2, // Syria A
  LB: 2, // Lebanon A

  // Africa - mixed, medical studies show higher volumes than surveys suggest
  ET: 2, NG: 3, GH: 3, KE: 3, TZ: 2, MG: 2, CM: 2,  // NG/GH/KE: studies show B
  CI: 2, SN: 2, UG: 2, ZW: 2, ZM: 2, MW: 2, AO: 2,
  CD: 2, CG: 2, BW: 2, NA: 2, RW: 2, BJ: 2, TG: 2,
  ML: 2, BF: 2, NE: 2, LR: 2, SL: 2, GM: 2, GW: 2, GN: 2,
  ZA: 3,  // South Africa B
  
  // Pacific  
  FJ: 2, PG: 2, WS: 1, TO: 1, VU: 1,

  // Americas
  CU: 2, DO: 2, JM: 2, HT: 2, GT: 2, HN: 2, SV: 2, NI: 2,
  CR: 2, PA: 2, EC: 2, PE: 2, BO: 2, PY: 2, UY: 3,

  // Europe - more
  SK: 4, RO: 4, UA: 4, RS: 4, MD: 3, HR: 3, SI: 3,
  BA: 3, ME: 3, AL: 3, MK: 3, LT: 3, LV: 3, EE: 3,

  // Central Asia  
  KZ: 4, UZ: 3, TM: 3, KG: 3, TJ: 3,
};

export function getBreastSize(countryCode: string): number | undefined {
  return breastSizeByCountry[countryCode];
}

export function cupSizeToLetter(size: number): string {
  const letters = ["", "AA", "A", "B", "C", "D", "DD"];
  return letters[size] ?? "?";
}