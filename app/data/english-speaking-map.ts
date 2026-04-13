// English speaking percent by country
export const englishSpeakingByCountry: Record<string, number> = {
  KP: 0, // North Korea - almost none
};

export function getEnglishSpeaking(countryCode: string): number | undefined {
  return englishSpeakingByCountry[countryCode];
}