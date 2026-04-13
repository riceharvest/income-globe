// Labor force gender gap (% difference male - female participation)
// Negative = women less participation
export const laborForceGapByCountry: Record<string, number> = {
  SC: 5, TW: -8, AD: 2, XK: 5, LI: 3, MC: 3, SM: 2, UA: -8, // All microstates/low data
};

export function getLaborForceGap(countryCode: string): number | undefined {
  return laborForceGapByCountry[countryCode];
}