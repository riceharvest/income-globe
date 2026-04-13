// contraceptive use (% of women 15-49)
// Source: UN Data, WHO, DHS surveys
export const contraceptiveUseByCountry: Record<string, number | null> = {
  // Developed - typically high
  CH: 73, SE: 72, NL: 71, LU: 67, IS: 68, SK: 67,
  AD: 65, MC: 65, SM: 65, // Microstates - estimate
  // Eastern Europe
  HR: 66, BY: 61, 
  // Asia
  TW: 68, HK: 66, JP: 58, KR: 82, SG: 66,
  CN: 80, VN: 76, TH: 73, MY: 53, PH: 66, ID: 61,
  // Middle East
  CY: 67, IL: 71, // Israel/Cyprus
};

export function getContraceptiveUse(countryCode: string): number | null {
  return contraceptiveUseByCountry[countryCode] ?? null;
}