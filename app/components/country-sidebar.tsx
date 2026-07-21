import { useState, useMemo } from "react";
import { Link } from "react-router";
import {
  Search,
  Globe,
  Award,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Heart,
  Briefcase,
  BarChart3,
  ExternalLink,
  X,
  ChevronRight,
  Shuffle,
  Check,
  Flame,
  Scale,
  Ruler,
  Percent,
  Wine,
  Cigarette,
  HeartPulse,
  Clock,
  Footprints,
  Sparkles,
  Eye,
  Palette,
  Volume2,
  Hand,
  Dumbbell,
  Dna,
  Building2,
  BookOpen,
  Info,
  HelpCircle,
} from "lucide-react";

export interface MetricHelpInfo {
  title: string;
  definition: string;
  howToRead: string;
  unitOrScale?: string;
}

export const METRIC_HELP_MAP: Record<string, MetricHelpInfo> = {
  // Income
  p10: {
    title: "P10 (Bottom 10% Income)",
    definition: "The maximum income boundary of the lowest-earning 10% of the country's population.",
    howToRead: "Measures the floor of economic earnings for low-income workers. Higher values mean higher working-poor living standards.",
    unitOrScale: "USD PPP or Local Currency per month / year",
  },
  p25: {
    title: "P25 (Lower 25% Income)",
    definition: "The income cutoff level for the 25th percentile of earner distribution.",
    howToRead: "Reflects working-class and entry-level salary standards in the country.",
    unitOrScale: "USD PPP or Local Currency per month / year",
  },
  p50: {
    title: "P50 (Median Income)",
    definition: "The exact national middle income where 50% of people earn more and 50% earn less.",
    howToRead: "The most representative snapshot of typical earnings, unskewed by billionaire outliers.",
    unitOrScale: "USD PPP or Local Currency per month / year",
  },
  p75: {
    title: "P75 (Upper 75% Income)",
    definition: "The income cutoff reached by the top 25% highest earners.",
    howToRead: "Reflects upper-middle-class income and skilled professional salary levels.",
    unitOrScale: "USD PPP or Local Currency per month / year",
  },
  p90: {
    title: "P90 (Top 10% Income)",
    definition: "The income threshold required to enter the top 10% wealthiest earner bracket.",
    howToRead: "Measures executive compensation, specialized professions, and high-earning potential.",
    unitOrScale: "USD PPP or Local Currency per month / year",
  },
  income: {
    title: "Median Income (P50)",
    definition: "The median income earned by a typical resident in this nation.",
    howToRead: "Higher numbers indicate stronger overall purchasing power.",
    unitOrScale: "USD PPP or Local Currency",
  },

  // Height & Weight
  femaleHeightCm: {
    title: "Female Average Height",
    definition: "Mean standing height for adult women (aged 18-49).",
    howToRead: "Global average is ~162 cm (5'4\"). Values > 168 cm are tall (Netherlands/Nordic), < 155 cm are shorter.",
    unitOrScale: "Centimeters (cm)",
  },
  maleHeightCm: {
    title: "Male Average Height",
    definition: "Mean standing height for adult men (aged 18-49).",
    howToRead: "Global average is ~174 cm (5'8.5\"). Values > 180 cm are tall (Dinaric Alps/Scandinavia), < 165 cm are shorter.",
    unitOrScale: "Centimeters (cm)",
  },
  heightCm: {
    title: "Average National Height",
    definition: "Combined adult mean standing height.",
    howToRead: "Reflects childhood nutrition standards, healthcare quality, and genetic lineages.",
    unitOrScale: "Centimeters (cm)",
  },
  maleWeightKg: {
    title: "Male Average Weight",
    definition: "Mean body weight for adult males.",
    howToRead: "Global male average is ~75 kg. Higher values correlate with larger skeletal frames or higher BMI.",
    unitOrScale: "Kilograms (kg)",
  },
  femaleWeightKg: {
    title: "Female Average Weight",
    definition: "Mean body weight for adult females.",
    howToRead: "Global female average is ~64 kg.",
    unitOrScale: "Kilograms (kg)",
  },
  weightKg: {
    title: "Average Body Weight",
    definition: "Mean adult body weight.",
    howToRead: "Must be compared alongside height and muscle mass.",
    unitOrScale: "Kilograms (kg)",
  },

  // BMI & Body Fat
  maleBmi: {
    title: "Male Average BMI",
    definition: "Body Mass Index (weight / height²) for adult males.",
    howToRead: "18.5–24.9 is Healthy Weight; 25.0–29.9 is Overweight; ≥30.0 is Obese.",
    unitOrScale: "kg/m²",
  },
  femaleBmi: {
    title: "Female Average BMI",
    definition: "Body Mass Index (weight / height²) for adult females.",
    howToRead: "18.5–24.9 is Healthy Weight; 25.0–29.9 is Overweight; ≥30.0 is Obese.",
    unitOrScale: "kg/m²",
  },
  bmi: {
    title: "Body Mass Index (BMI)",
    definition: "WHO standard weight-to-height ratio for assessing metabolic health risks.",
    howToRead: "Higher average BMI indicates elevated cardiovascular risk across the population.",
    unitOrScale: "kg/m²",
  },
  maleBodyFatPercent: {
    title: "Male Body Fat Percentage",
    definition: "Proportion of total male body mass made of adipose fat tissue.",
    howToRead: "Athletic: 8–14%; Normal: 15–20%; Elevated: >22%.",
    unitOrScale: "Percentage (%)",
  },
  femaleBodyFatPercent: {
    title: "Female Body Fat Percentage",
    definition: "Proportion of total female body mass made of adipose fat tissue.",
    howToRead: "Athletic: 16–22%; Normal: 22–28%; Elevated: >30%.",
    unitOrScale: "Percentage (%)",
  },
  bodyFatPercent: {
    title: "Body Fat Percentage",
    definition: "Essential and storage body fat proportion relative to total weight.",
    howToRead: "Lower fat with high muscle indicates athletic body composition.",
    unitOrScale: "Percentage (%)",
  },

  // Waist & Shoes
  maleWaistCm: {
    title: "Male Waist Circumference",
    definition: "Abdominal circumference measured at umbilical level.",
    howToRead: "Clinical risk threshold for visceral fat in men is >102 cm (40 inches).",
    unitOrScale: "Centimeters (cm)",
  },
  femaleWaistCm: {
    title: "Female Waist Circumference",
    definition: "Abdominal circumference measured at midpoint of waist.",
    howToRead: "Clinical risk threshold for visceral fat in women is >88 cm (35 inches).",
    unitOrScale: "Centimeters (cm)",
  },
  waistCm: {
    title: "Waist Circumference",
    definition: "Abdominal girth measuring abdominal fat accumulation.",
    howToRead: "Key indicator for metabolic syndrome risk.",
    unitOrScale: "Centimeters (cm)",
  },
  maleShoeSizeEu: {
    title: "Male Average Shoe Size",
    definition: "Mean adult male foot size in European sizing units.",
    howToRead: "Directly correlates with male standing height. European male average is EU 42–44.",
    unitOrScale: "EU Size Scale",
  },
  femaleShoeSizeEu: {
    title: "Female Average Shoe Size",
    definition: "Mean adult female foot size in European sizing units.",
    howToRead: "Correlates with female height. European female average is EU 37–39.",
    unitOrScale: "EU Size Scale",
  },
  shoeSizeEu: {
    title: "Average Shoe Size",
    definition: "Mean national shoe size.",
    howToRead: "Reflects overall foot length and bone structure.",
    unitOrScale: "EU Size Scale",
  },

  // Calories & Health
  maleCaloricIntakeKcal: {
    title: "Male Daily Caloric Intake",
    definition: "Average daily food energy consumed by adult males.",
    howToRead: "Recommended baseline is 2,200–2,800 kcal depending on activity level.",
    unitOrScale: "kcal / day",
  },
  femaleCaloricIntakeKcal: {
    title: "Female Daily Caloric Intake",
    definition: "Average daily food energy consumed by adult females.",
    howToRead: "Recommended baseline is 1,800–2,200 kcal depending on activity level.",
    unitOrScale: "kcal / day",
  },
  caloricIntakeKcal: {
    title: "Daily Caloric Intake",
    definition: "Per capita food energy availability per day.",
    howToRead: "Values > 3,200 kcal indicate high surplus energy availability.",
    unitOrScale: "kcal / day",
  },
  maleObesityRate: {
    title: "Male Obesity Rate",
    definition: "Percentage of adult males with BMI ≥ 30.0 kg/m².",
    howToRead: "Higher rates highlight male metabolic health challenges.",
    unitOrScale: "Percentage (%)",
  },
  femaleObesityRate: {
    title: "Female Obesity Rate",
    definition: "Percentage of adult females with BMI ≥ 30.0 kg/m².",
    howToRead: "Higher rates highlight female metabolic health challenges.",
    unitOrScale: "Percentage (%)",
  },
  obesityRate: {
    title: "Obesity Prevalence",
    definition: "Percentage of overall adult population with BMI ≥ 30.0 kg/m².",
    howToRead: "Higher percentages mean greater population risk of diabetes and heart disease.",
    unitOrScale: "Percentage (%)",
  },
  maleInactivityRate: {
    title: "Male Physical Inactivity",
    definition: "Percentage of men failing WHO exercise recommendations (150 min/week).",
    howToRead: "Higher values reflect sedentary lifestyle prevalence among men.",
    unitOrScale: "Percentage (%)",
  },
  femaleInactivityRate: {
    title: "Female Physical Inactivity",
    definition: "Percentage of women failing WHO exercise recommendations (150 min/week).",
    howToRead: "Higher values reflect sedentary lifestyle prevalence among women.",
    unitOrScale: "Percentage (%)",
  },
  inactivityRate: {
    title: "Physical Inactivity Rate",
    definition: "Proportion of adults engaged in insufficient physical activity.",
    howToRead: "Measures sedentary work and lifestyle patterns.",
    unitOrScale: "Percentage (%)",
  },
  maleDiabetesRate: {
    title: "Male Diabetes Prevalence",
    definition: "Percentage of men with diagnosed or unmanaged type 2 diabetes.",
    howToRead: "Values > 10% indicate high dietary and metabolic stress.",
    unitOrScale: "Percentage (%)",
  },
  femaleDiabetesRate: {
    title: "Female Diabetes Prevalence",
    definition: "Percentage of women with diagnosed or unmanaged type 2 diabetes.",
    howToRead: "Values > 10% indicate high dietary and metabolic stress.",
    unitOrScale: "Percentage (%)",
  },
  diabetesRate: {
    title: "Diabetes Rate",
    definition: "National prevalence of diabetes mellitus among adults (20-79).",
    howToRead: "Key indicator of metabolic health burden.",
    unitOrScale: "Percentage (%)",
  },
  maleHypertensionRate: {
    title: "Male Hypertension Rate",
    definition: "Percentage of men with high blood pressure (systolic ≥ 140 or diastolic ≥ 90).",
    howToRead: "Major contributor to cardiovascular mortality in men.",
    unitOrScale: "Percentage (%)",
  },
  femaleHypertensionRate: {
    title: "Female Hypertension Rate",
    definition: "Percentage of women with high blood pressure.",
    howToRead: "Major contributor to cardiovascular mortality in women.",
    unitOrScale: "Percentage (%)",
  },
  hypertensionRate: {
    title: "Hypertension Prevalence",
    definition: "Percentage of adults with elevated arterial blood pressure.",
    howToRead: "Higher rates increase stroke and heart attack incidence.",
    unitOrScale: "Percentage (%)",
  },
  maleAlcoholLiters: {
    title: "Male Alcohol Consumption",
    definition: "Annual pure ethanol consumption per adult male (15+).",
    howToRead: "Global average is ~9.5 L/yr for men. High rates exceed 15 L/yr.",
    unitOrScale: "Liters pure ethanol / year",
  },
  femaleAlcoholLiters: {
    title: "Female Alcohol Consumption",
    definition: "Annual pure ethanol consumption per adult female (15+).",
    howToRead: "Global average is ~2.5 L/yr for women.",
    unitOrScale: "Liters pure ethanol / year",
  },
  alcoholLiters: {
    title: "Alcohol Consumption per Capita",
    definition: "Annual pure ethanol intake per person.",
    howToRead: "Measures social drinking habits and alcohol-related health burdens.",
    unitOrScale: "Liters pure ethanol / year",
  },
  maleSmokingRate: {
    title: "Male Smoking Rate",
    definition: "Percentage of adult males who smoke tobacco daily.",
    howToRead: "Can reach 40–50%+ in parts of Eastern Europe and East Asia.",
    unitOrScale: "Percentage (%)",
  },
  femaleSmokingRate: {
    title: "Female Smoking Rate",
    definition: "Percentage of adult females who smoke tobacco daily.",
    howToRead: "Averages 5–20% globally.",
    unitOrScale: "Percentage (%)",
  },
  smokingRate: {
    title: "Smoking Prevalence",
    definition: "Percentage of overall adult population using smoked tobacco.",
    howToRead: "Direct driver of lung cancer and COPD rates.",
    unitOrScale: "Percentage (%)",
  },
  maleLifeExpectancy: {
    title: "Male Life Expectancy",
    definition: "Average life span expected at birth for males.",
    howToRead: "Global male average is ~70.5 years. Values > 80 yrs indicate top healthcare (Japan, Iceland).",
    unitOrScale: "Years",
  },
  femaleLifeExpectancy: {
    title: "Female Life Expectancy",
    definition: "Average life span expected at birth for females.",
    howToRead: "Global female average is ~75.5 years. Females typically outlive males by 4–6 years globally.",
    unitOrScale: "Years",
  },
  lifeExpectancy: {
    title: "Life Expectancy at Birth",
    definition: "Composite average life span for all newborns under current mortality rates.",
    howToRead: "The gold standard metric for healthcare quality and living conditions.",
    unitOrScale: "Years",
  },

  // Phenotypic Metrics
  hairColor: {
    title: "Hair Color Distribution",
    definition: "Percentage breakdown of natural hair pigmentation (Black, Brown, Blonde, Red).",
    howToRead: "Black/Brown dominates worldwide (90%+). Blonde peaks in Scandinavia (30-80%). Red peaks in Scotland/Ireland (10-13%).",
    unitOrScale: "Percentage (%) breakdown",
  },
  hairColorBlonde: {
    title: "Blonde Hair Frequency",
    definition: "Proportion of population with natural golden/blonde hair.",
    howToRead: "Highest around Northern and Baltic Europe.",
    unitOrScale: "Percentage (%)",
  },
  hairColorRed: {
    title: "Red Hair Frequency",
    definition: "Proportion carrying the MC1R gene variant causing reddish hair.",
    howToRead: "Highest in the British Isles and Northwest Europe.",
    unitOrScale: "Percentage (%)",
  },
  hairColorBrown: {
    title: "Brown Hair Frequency",
    definition: "Proportion with chestnut or dark brown hair pigmentation.",
    howToRead: "Prevalent across Central, Southern Europe, and Central/West Asia.",
    unitOrScale: "Percentage (%)",
  },
  hairColorBlack: {
    title: "Black Hair Frequency",
    definition: "Proportion with high-eumelanin natural black hair.",
    howToRead: "The most common natural hair color worldwide.",
    unitOrScale: "Percentage (%)",
  },

  hairTexture: {
    title: "Hair Texture Breakdown",
    definition: "Follicle shape frequencies producing Straight, Wavy, Curly, or Coily hair.",
    howToRead: "Straight hair dominates in East Asia; Wavy in Europe/North Africa; Coily in Sub-Saharan Africa.",
    unitOrScale: "Percentage (%) breakdown",
  },
  hairTextureStraight: {
    title: "Straight Hair Frequency",
    definition: "Percentage with round follicle cross-sections producing straight hair.",
    howToRead: "Highest in East Asian and Indigenous American populations.",
    unitOrScale: "Percentage (%)",
  },
  hairTextureWavy: {
    title: "Wavy Hair Frequency",
    definition: "Percentage with oval follicles creating gentle S-pattern waves.",
    howToRead: "Common in European, North African, and South Asian populations.",
    unitOrScale: "Percentage (%)",
  },
  hairTextureCurly: {
    title: "Curly Hair Frequency",
    definition: "Percentage with elliptical follicles producing spiral ringlets.",
    howToRead: "Common in Mediterranean, Middle Eastern, and mixed populations.",
    unitOrScale: "Percentage (%)",
  },
  hairTextureCoily: {
    title: "Coily Hair Frequency",
    definition: "Percentage with flat elliptical follicles producing tight Z/O coils.",
    howToRead: "Highest in Sub-Saharan African populations.",
    unitOrScale: "Percentage (%)",
  },

  eyeColor: {
    title: "Eye Color Frequency",
    definition: "Iris pigmentation frequency (Brown, Blue, Green, Hazel).",
    howToRead: "Brown eyes are global majority (79%). Blue eyes peak around the Baltic Sea (70-80%). Green/Hazel are rare (2-5%).",
    unitOrScale: "Percentage (%) breakdown",
  },
  eyeColorBlue: {
    title: "Blue Eye Frequency",
    definition: "Proportion of iris with low melanin causing blue light scattering.",
    howToRead: "Highest in Northern and Eastern European countries.",
    unitOrScale: "Percentage (%)",
  },

  skinPigmentation: {
    title: "Skin Tone / ITA° Melanin Scale",
    definition: "Individual Typology Angle ($ITA^\circ$) measuring skin tone spectrophotometry.",
    howToRead: "ITA° > +55° = Very Fair (Type I); +28° to +55° = Intermediate (Type III-IV); < -30° = Dark (Type V-VI).",
    unitOrScale: "ITA° Degrees",
  },

  // Anthropometrics
  maleLegLengthPercent: {
    title: "Male Relative Leg Length",
    definition: "Male leg length divided by standing height.",
    howToRead: "Higher percentages (>48%) mean longer leg proportions relative to torso.",
    unitOrScale: "% of standing height",
  },
  femaleLegLengthPercent: {
    title: "Female Relative Leg Length",
    definition: "Female leg length divided by standing height.",
    howToRead: "Higher percentages (>48%) mean longer leg proportions relative to torso.",
    unitOrScale: "% of standing height",
  },
  legLengthPercent: {
    title: "Relative Leg Length",
    definition: "Leg length relative to total standing height.",
    howToRead: "Higher numbers indicate linear body frames.",
    unitOrScale: "% of standing height",
  },
  maleLeanMuscleMassKg: {
    title: "Male Lean Muscle Mass",
    definition: "Total skeletal muscle weight in adult males excluding fat mass.",
    howToRead: "Higher muscle mass indicates higher athletic strength and metabolic throughput.",
    unitOrScale: "Kilograms (kg)",
  },
  femaleLeanMuscleMassKg: {
    title: "Female Lean Muscle Mass",
    definition: "Total skeletal muscle weight in adult females excluding fat mass.",
    howToRead: "Higher muscle mass indicates higher athletic strength and metabolic throughput.",
    unitOrScale: "Kilograms (kg)",
  },
  leanMuscleMassKg: {
    title: "Lean Muscle Mass",
    definition: "Total weight of skeletal muscle mass.",
    howToRead: "Measures muscularity independently of body fat.",
    unitOrScale: "Kilograms (kg)",
  },
  maleDigitRatio: {
    title: "Male 2D:4D Digit Ratio",
    definition: "Index finger length divided by ring finger length in men.",
    howToRead: "Values < 0.95 indicate higher prenatal testosterone exposure during fetal development.",
    unitOrScale: "2D:4D Ratio",
  },
  femaleDigitRatio: {
    title: "Female 2D:4D Digit Ratio",
    definition: "Index finger length divided by ring finger length in women.",
    howToRead: "Values ~0.98 are average for females.",
    unitOrScale: "2D:4D Ratio",
  },
  digitRatio: {
    title: "2D:4D Digit Ratio",
    definition: "Ratio between index (2D) and ring (4D) finger lengths.",
    howToRead: "Key biomarker for fetal hormone exposure.",
    unitOrScale: "2D:4D Ratio",
  },
  maleShoulderToWaistRatio: {
    title: "Male Shoulder-to-Waist Ratio",
    definition: "Biacromial shoulder width divided by waist girth in men.",
    howToRead: "Values > 1.40 represent a classic V-taper masculine frame.",
    unitOrScale: "Ratio",
  },
  femaleShoulderToWaistRatio: {
    title: "Female Shoulder-to-Waist Ratio",
    definition: "Shoulder width divided by waist girth in women.",
    howToRead: "Higher ratios reflect pronounced hourglass proportions.",
    unitOrScale: "Ratio",
  },
  shoulderToWaistRatio: {
    title: "Shoulder-to-Waist Ratio",
    definition: "Upper torso width divided by waist circumference.",
    howToRead: "Measures body shape and V-taper / hourglass proportions.",
    unitOrScale: "Ratio",
  },
  maleHandLengthCm: {
    title: "Male Hand Length",
    definition: "Length from wrist crease to middle finger tip in men.",
    howToRead: "Male average is 18.5–20.5 cm.",
    unitOrScale: "Centimeters (cm)",
  },
  femaleHandLengthCm: {
    title: "Female Hand Length",
    definition: "Length from wrist crease to middle finger tip in women.",
    howToRead: "Female average is 16.5–18.5 cm.",
    unitOrScale: "Centimeters (cm)",
  },
  handLengthCm: {
    title: "Hand Length",
    definition: "Distance from mid-wrist crease to tip of middle finger.",
    howToRead: "Directly correlates with skeletal stature.",
    unitOrScale: "Centimeters (cm)",
  },
  maleVocalPitchHz: {
    title: "Male Vocal Pitch",
    definition: "Fundamental speaking frequency (F0) of male voice.",
    howToRead: "Male voices average 110–135 Hz. Lower Hz means deeper voice.",
    unitOrScale: "Hertz (Hz)",
  },
  femaleVocalPitchHz: {
    title: "Female Vocal Pitch",
    definition: "Fundamental speaking frequency (F0) of female voice.",
    howToRead: "Female voices average 195–225 Hz. Higher Hz means higher pitch.",
    unitOrScale: "Hertz (Hz)",
  },
  vocalPitchHz: {
    title: "Fundamental Vocal Pitch",
    definition: "Mean vocal fold vibration frequency during speech.",
    howToRead: "Determined by vocal fold length, mass, and testosterone levels.",
    unitOrScale: "Hertz (Hz)",
  },

  // Macroeconomics
  minimumWageEur: {
    title: "Minimum Wage",
    definition: "Statutory minimum monthly compensation mandated by law.",
    howToRead: "Toggle between USD PPP and Local currency to compare purchasing power.",
    unitOrScale: "Currency / Month",
  },
  unemploymentRate: {
    title: "Unemployment Rate",
    definition: "Percentage of active labor force actively looking for work.",
    howToRead: "< 4% is tight employment; > 10% indicates job scarcity.",
    unitOrScale: "Percentage (%)",
  },
  costOfLivingIndex: {
    title: "Cost of Living Index",
    definition: "Price level relative to New York City baseline (100).",
    howToRead: "120 means 20% more expensive than NYC; 40 means 60% cheaper.",
    unitOrScale: "Index (NYC = 100)",
  },
  internetPenetration: {
    title: "Internet Penetration Rate",
    definition: "Percentage of population with active internet access.",
    howToRead: "> 90% reflects modern digital infrastructure.",
    unitOrScale: "Percentage (%)",
  },
  population: {
    title: "National Population",
    definition: "Total resident population count.",
    howToRead: "Expressed in Millions.",
    unitOrScale: "Millions",
  },
  exchangeRate: {
    title: "Exchange Rate",
    definition: "Local currency conversion value relative to 1 EUR / USD.",
    howToRead: "Used to convert local earnings into international figures.",
    unitOrScale: "Local Currency Units per EUR",
  },

  // Social & Demographics
  hdi: {
    title: "Human Development Index (HDI)",
    definition: "UN score combining life expectancy, education years, and GNI.",
    howToRead: "0.0 to 1.0. > 0.800 is Very High Human Development.",
    unitOrScale: "Index (0–1.0)",
  },
  englishSpeakingPercent: {
    title: "English Proficiency Rate",
    definition: "Percentage of residents capable of holding an English conversation.",
    howToRead: "Measures business connectivity and tourism ease.",
    unitOrScale: "Percentage (%)",
  },
  mainIndustry: {
    title: "Primary Industry",
    definition: "The nation's largest economic sector by GDP contribution.",
    howToRead: "Indicates whether economy is Service, Tech, Industrial, or Agriculture driven.",
    unitOrScale: "Sector Name",
  },

  // Gender
  adolescentBirthRate: {
    title: "Adolescent Birth Rate",
    definition: "Births per 1,000 women aged 15-19.",
    howToRead: "Lower numbers reflect higher education and family planning access.",
    unitOrScale: "Births per 1,000 women (15-19)",
  },
  childMarriagePercent: {
    title: "Child Marriage Rate",
    definition: "Percentage of women married before age 18.",
    howToRead: "Measures social protection and gender rights.",
    unitOrScale: "Percentage (%)",
  },
  laborForceGap: {
    title: "Gender Labor Participation Gap",
    definition: "Male minus female labor participation rate (%).",
    howToRead: "0% is total employment parity; 30% means men participate 30 points more.",
    unitOrScale: "Percentage Points Gap",
  },
  contraceptiveUse: {
    title: "Contraceptive Prevalence Rate",
    definition: "Percentage of women using modern family planning methods.",
    howToRead: "Higher rates indicate reproductive healthcare access.",
    unitOrScale: "Percentage (%)",
  },
};

/**
 * Little clickable (i) Info Button component
 */
export function InfoButton({
  metricKey,
  onOpenHelp,
  className,
}: {
  metricKey: string;
  onOpenHelp: (key: string) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onOpenHelp(metricKey);
      }}
      title="Click for explanation and how to read the numbers"
      className={cn(
        "p-1 rounded-full text-muted-foreground/60 hover:text-cyan-400 hover:bg-cyan-500/15 transition-all cursor-pointer flex-shrink-0",
        className
      )}
    >
      <Info className="h-3.5 w-3.5" />
    </button>
  );
}

/**
 * Metric Explanation & How-to-Read Modal
 */
export function MetricHelpModal({
  metricKey,
  onClose,
  onSelectMetric,
}: {
  metricKey: string | null;
  onClose: () => void;
  onSelectMetric?: (key: string) => void;
}) {
  if (!metricKey) return null;
  const help = METRIC_HELP_MAP[metricKey] ?? {
    title: metricKey,
    definition: "Detailed country statistic collected from authoritative international datasets.",
    howToRead: "Compare values across countries to observe geographic distributions and global trends.",
    unitOrScale: "Standard metric units",
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-card/95 border border-emerald-500/40 rounded-2xl shadow-2xl p-5 space-y-4 text-foreground relative animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border/40 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Info className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-foreground">{help.title}</h3>
              {help.unitOrScale && (
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                  Unit: {help.unitOrScale}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs leading-relaxed">
          <div className="p-3 rounded-xl bg-secondary/40 border border-border/30 space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
              <HelpCircle className="h-3.5 w-3.5 text-cyan-400" />
              <span>What it means exactly</span>
            </span>
            <p className="text-foreground font-medium">{help.definition}</p>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>How to read the numbers</span>
            </span>
            <p className="text-emerald-200/90 font-medium">{help.howToRead}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/30">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onSelectMetric?.(metricKey);
              onClose();
            }}
            className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>Color Map & Sort by Metric</span>
          </button>
        </div>
      </div>
    </div>
  );
}
import {
  uniqueCountriesData,
  type CountryData,
  type IncomeIndicatorType,
  indicatorLabels,
  incomeIndicatorTypes,
  formatUsd,
  formatLocalCurrency,
  getPhysicalStats,
  getCountryRank,
  getRegionalAverageMetric,
  getGlobalMedianMetric,
  adjustForTimePeriod,
} from "~/data/countries";
import { cn } from "~/lib/utils";

export interface CountrySidebarProps {
  selectedCountryCode: string | null;
  onSelectCountry: (code: string) => void;
  activeSortKey?: string;
  onSelectMetric?: (metricKey: string) => void;
  className?: string;
  onCloseMobile?: () => void;
}

export type SidebarTab =
  | "income"
  | "physical"
  | "economic"
  | "demographics"
  | "gender"
  | "comparison";

/**
 * Helper to check if a target metric key matches the currently active sort/map metric
 */
function isMetricActive(targetKey: string, activeKey?: string): boolean {
  if (!activeKey) return false;
  if (targetKey === activeKey) return true;

  const aliases: Record<string, string[]> = {
    income: ["income", "p50"],
    p50: ["income", "p50"],
    p10: ["p10"],
    p25: ["p25"],
    p75: ["p75"],
    p90: ["p90"],
    femaleHeightCm: ["femaleHeightCm", "heightCm", "maleHeightCm", "height"],
    heightCm: ["femaleHeightCm", "heightCm", "maleHeightCm", "height"],
    femaleWeightKg: ["femaleWeightKg", "weightKg", "maleWeightKg", "weight"],
    weightKg: ["femaleWeightKg", "weightKg", "maleWeightKg", "weight"],
    femaleBmi: ["femaleBmi", "bmi", "maleBmi"],
    bmi: ["femaleBmi", "bmi", "maleBmi"],
    obesityRate: ["obesityRate", "femaleObesityRate", "maleObesityRate"],
    femaleObesityRate: ["obesityRate", "femaleObesityRate", "maleObesityRate"],
    smokingRate: ["smokingRate", "femaleSmokingRate", "maleSmokingRate"],
    femaleSmokingRate: ["smokingRate", "femaleSmokingRate", "maleSmokingRate"],
    femaleLifeExpectancy: [
      "femaleLifeExpectancy",
      "lifeExpectancy",
      "maleLifeExpectancy",
    ],
    lifeExpectancy: [
      "femaleLifeExpectancy",
      "lifeExpectancy",
      "maleLifeExpectancy",
    ],
    minimumWageEur: ["minimumWageEur", "minimumWage"],
    unemploymentRate: ["unemploymentRate"],
    costOfLivingIndex: ["costOfLivingIndex"],
    internetPenetration: ["internetPenetration"],
    hdi: ["hdi"],
    population: ["population"],
    exchangeRate: ["exchangeRate"],
    englishSpeakingPercent: ["englishSpeakingPercent"],
    adolescentBirthRate: ["adolescentBirthRate"],
    childMarriagePercent: ["childMarriagePercent"],
    laborForceGap: ["laborForceGap"],
    contraceptiveUse: ["contraceptiveUse"],
    bodyFatPercent: ["bodyFatPercent"],
    waistCm: ["waistCm"],
    shoeSizeEu: ["shoeSizeEu"],
    caloricIntakeKcal: ["caloricIntakeKcal"],
    diabetesRate: ["diabetesRate"],
    hypertensionRate: ["hypertensionRate"],
    alcoholLiters: ["alcoholLiters"],
    hairColor: ["hairColor", "hairColorBlonde", "hairColorRed", "hairColorBrown", "hairColorBlack"],
    hairColorBlonde: ["hairColorBlonde", "hairColor"],
    hairColorRed: ["hairColorRed", "hairColor"],
    hairColorBrown: ["hairColorBrown", "hairColor"],
    hairColorBlack: ["hairColorBlack", "hairColor"],
    hairTexture: ["hairTexture", "hairTextureStraight", "hairTextureWavy", "hairTextureCurly", "hairTextureCoily"],
    hairTextureStraight: ["hairTextureStraight", "hairTexture"],
    hairTextureWavy: ["hairTextureWavy", "hairTexture"],
    hairTextureCurly: ["hairTextureCurly", "hairTexture"],
    hairTextureCoily: ["hairTextureCoily", "hairTexture"],
    eyeColor: ["eyeColor", "eyeColorBlue", "eyeColorBrown", "eyeColorGreen", "eyeColorHazel"],
    eyeColorBlue: ["eyeColorBlue", "eyeColor"],
    eyeColorBrown: ["eyeColorBrown", "eyeColor"],
    eyeColorGreen: ["eyeColorGreen", "eyeColor"],
    eyeColorHazel: ["eyeColorHazel", "eyeColor"],
    skinPigmentation: ["skinPigmentation", "itaAngle"],
    itaAngle: ["skinPigmentation", "itaAngle"],
    legLengthPercent: ["legLengthPercent", "femaleLegLengthPercent", "maleLegLengthPercent"],
    femaleLegLengthPercent: ["legLengthPercent", "femaleLegLengthPercent", "maleLegLengthPercent"],
    maleLegLengthPercent: ["legLengthPercent", "femaleLegLengthPercent", "maleLegLengthPercent"],
    leanMuscleMassKg: ["leanMuscleMassKg", "femaleLeanMuscleMassKg", "maleLeanMuscleMassKg", "leanMusclePercent", "femaleLeanMusclePercent", "maleLeanMusclePercent"],
    femaleLeanMuscleMassKg: ["leanMuscleMassKg", "femaleLeanMuscleMassKg", "maleLeanMuscleMassKg"],
    maleLeanMuscleMassKg: ["leanMuscleMassKg", "femaleLeanMuscleMassKg", "maleLeanMuscleMassKg"],
    leanMusclePercent: ["leanMuscleMassKg", "femaleLeanMuscleMassKg", "maleLeanMuscleMassKg", "leanMusclePercent"],
    digitRatio: ["digitRatio", "femaleDigitRatio", "maleDigitRatio"],
    femaleDigitRatio: ["digitRatio", "femaleDigitRatio", "maleDigitRatio"],
    maleDigitRatio: ["digitRatio", "femaleDigitRatio", "maleDigitRatio"],
    shoulderToWaistRatio: ["shoulderToWaistRatio", "femaleShoulderToWaistRatio", "maleShoulderToWaistRatio"],
    femaleShoulderToWaistRatio: ["shoulderToWaistRatio", "femaleShoulderToWaistRatio", "maleShoulderToWaistRatio"],
    maleShoulderToWaistRatio: ["shoulderToWaistRatio", "femaleShoulderToWaistRatio", "maleShoulderToWaistRatio"],
    handLengthCm: ["handLengthCm", "handSize", "femaleHandLengthCm", "maleHandLengthCm"],
    femaleHandLengthCm: ["handLengthCm", "handSize", "femaleHandLengthCm", "maleHandLengthCm"],
    maleHandLengthCm: ["handLengthCm", "handSize", "femaleHandLengthCm", "maleHandLengthCm"],
    vocalPitchHz: ["vocalPitchHz", "vocalPitch", "femaleVocalPitchHz", "maleVocalPitchHz"],
    femaleVocalPitchHz: ["vocalPitchHz", "vocalPitch", "femaleVocalPitchHz", "maleVocalPitchHz"],
    maleVocalPitchHz: ["vocalPitchHz", "vocalPitch", "femaleVocalPitchHz", "maleVocalPitchHz"],
  };

  const equivalentList = aliases[targetKey];
  if (equivalentList && equivalentList.includes(activeKey)) {
    return true;
  }

  return false;
}

/**
 * Reusable interactive Metric Card wrapper providing glowing emerald border,
 * hover animations, keyboard accessibility, active state badge, and click callback.
 */
interface MetricCardProps {
  label: string;
  metricKey: string;
  activeSortKey?: string;
  onSelectMetric?: (metricKey: string) => void;
  onOpenHelp?: (metricKey: string) => void;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
}

function MetricCard({
  label,
  metricKey,
  activeSortKey,
  onSelectMetric,
  onOpenHelp,
  icon: Icon,
  children,
  className,
}: MetricCardProps) {
  const active = isMetricActive(metricKey, activeSortKey);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelectMetric?.(metricKey)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelectMetric?.(metricKey);
        }
      }}
      className={cn(
        "p-3 rounded-xl border transition-all duration-200 cursor-pointer group text-left relative overflow-hidden select-none",
        active
          ? "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/40 shadow-lg shadow-emerald-500/10"
          : "bg-secondary/30 border-border/40 hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:scale-[1.01]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {Icon && (
            <Icon
              className={cn(
                "h-3.5 w-3.5 flex-shrink-0 transition-colors",
                active
                  ? "text-emerald-400"
                  : "text-muted-foreground group-hover:text-emerald-400"
              )}
            />
          )}
          <span
            className={cn(
              "text-xs font-semibold truncate transition-colors",
              active
                ? "text-emerald-300 font-bold"
                : "text-foreground group-hover:text-emerald-400"
            )}
          >
            {label}
          </span>

          {onOpenHelp && (
            <InfoButton metricKey={metricKey} onOpenHelp={onOpenHelp} />
          )}
        </div>

        {active && (
          <span className="flex-shrink-0 flex items-center gap-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full shadow-sm animate-in fade-in zoom-in-95">
            <Check className="h-3 w-3 stroke-[3]" />
            <span>Map & Sort Active ✓</span>
          </span>
        )}
      </div>

      {children}
    </div>
  );
}

export function CountrySidebar({
  selectedCountryCode,
  onSelectCountry,
  activeSortKey,
  onSelectMetric,
  className,
  onCloseMobile,
}: CountrySidebarProps) {
  // Global search state within sidebar header
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeHelpKey, setActiveHelpKey] = useState<string | null>(null);

  // Sidebar Controls
  const [activeTab, setActiveTab] = useState<SidebarTab>("income");
  const [timePeriod, setTimePeriod] = useState<"monthly" | "annual">("monthly");
  const [currencyMode, setCurrencyMode] = useState<"usd_ppp" | "local">("usd_ppp");
  const [selectedIncomeType, setSelectedIncomeType] =
    useState<IncomeIndicatorType>("posttax_national");

  // Selected Country Data
  const country = useMemo(() => {
    if (!selectedCountryCode) return uniqueCountriesData[0];
    return (
      uniqueCountriesData.find(
        (c) =>
          c.code.toUpperCase() === selectedCountryCode.toUpperCase() ||
          c.alpha2.toUpperCase() === selectedCountryCode.toUpperCase() ||
          c.alpha3.toUpperCase() === selectedCountryCode.toUpperCase()
      ) ?? uniqueCountriesData[0]
    );
  }, [selectedCountryCode]);

  // Global Rank
  const rankInfo = useMemo(() => getCountryRank(country.code, "p50"), [country.code]);

  // Physical stats (Male vs Female)
  const physicalStats = useMemo(() => getPhysicalStats(country), [country]);

  // Instant Fuzzy Search Filter for Dropdown
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return uniqueCountriesData
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.alpha2.toLowerCase().includes(q) ||
          c.alpha3.toLowerCase().includes(q) ||
          c.region.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [searchQuery]);

  // Helper for formatting values based on Currency & Time toggles
  function formatCurrencyValue(valMonthlyUsd: number): string {
    const adjusted = adjustForTimePeriod(valMonthlyUsd, timePeriod);
    if (currencyMode === "local") {
      return formatLocalCurrency(adjusted, country.currencySymbol, country.exchangeRate);
    }
    return formatUsd(adjusted);
  }

  // Pick Random Country
  function pickRandomCountry() {
    const randomIndex = Math.floor(Math.random() * uniqueCountriesData.length);
    onSelectCountry(uniqueCountriesData[randomIndex].code);
  }

  // 20 Physical metrics metadata definition with Male vs Female specific keys
  const physicalMetricsList = [
    {
      label: "Height / Length (cm)",
      metricKey: "heightCm",
      mKey: "maleHeightCm",
      fKey: "femaleHeightCm",
      unit: "cm",
      m: physicalStats.heightCm.male,
      f: physicalStats.heightCm.female,
      max: 200,
      icon: Ruler,
    },
    {
      label: "Average Weight (kg)",
      metricKey: "weightKg",
      mKey: "maleWeightKg",
      fKey: "femaleWeightKg",
      unit: "kg",
      m: physicalStats.weightKg.male,
      f: physicalStats.weightKg.female,
      max: 110,
      icon: Scale,
    },
    {
      label: "Body Mass Index (BMI)",
      metricKey: "bmi",
      mKey: "maleBmi",
      fKey: "femaleBmi",
      unit: "",
      m: physicalStats.bmi.male,
      f: physicalStats.bmi.female,
      max: 35,
      icon: Activity,
    },
    {
      label: "Body Fat Percentage (%)",
      metricKey: "bodyFatPercent",
      mKey: "maleBodyFatPercent",
      fKey: "femaleBodyFatPercent",
      unit: "%",
      m: physicalStats.bodyFatPercent.male,
      f: physicalStats.bodyFatPercent.female,
      max: 45,
      icon: Percent,
    },
    {
      label: "Waist Circumference (cm)",
      metricKey: "waistCm",
      mKey: "maleWaistCm",
      fKey: "femaleWaistCm",
      unit: "cm",
      m: physicalStats.waistCm.male,
      f: physicalStats.waistCm.female,
      max: 120,
      icon: Ruler,
    },
    {
      label: "Average Shoe Size (EU)",
      metricKey: "shoeSizeEu",
      mKey: "maleShoeSizeEu",
      fKey: "femaleShoeSizeEu",
      unit: " EU",
      m: physicalStats.shoeSizeEu.male,
      f: physicalStats.shoeSizeEu.female,
      max: 48,
      icon: Footprints,
    },
    {
      label: "Daily Caloric Intake (kcal)",
      metricKey: "caloricIntakeKcal",
      mKey: "maleCaloricIntakeKcal",
      fKey: "femaleCaloricIntakeKcal",
      unit: " kcal",
      m: physicalStats.caloricIntakeKcal.male,
      f: physicalStats.caloricIntakeKcal.female,
      max: 3800,
      icon: Flame,
    },
    {
      label: "Obesity Rate (%)",
      metricKey: "obesityRate",
      mKey: "maleObesityRate",
      fKey: "femaleObesityRate",
      unit: "%",
      m: physicalStats.obesityRate.male,
      f: physicalStats.obesityRate.female,
      max: 60,
      icon: Activity,
    },
    {
      label: "Physical Inactivity Rate (%)",
      metricKey: "inactivityRate",
      mKey: "maleInactivityRate",
      fKey: "femaleInactivityRate",
      unit: "%",
      m: physicalStats.inactivityRate.male,
      f: physicalStats.inactivityRate.female,
      max: 60,
      icon: Clock,
    },
    {
      label: "Diabetes Prevalence (%)",
      metricKey: "diabetesRate",
      mKey: "maleDiabetesRate",
      fKey: "femaleDiabetesRate",
      unit: "%",
      m: physicalStats.diabetesRate.male,
      f: physicalStats.diabetesRate.female,
      max: 25,
      icon: HeartPulse,
    },
    {
      label: "Hypertension (High BP %)",
      metricKey: "hypertensionRate",
      mKey: "maleHypertensionRate",
      fKey: "femaleHypertensionRate",
      unit: "%",
      m: physicalStats.hypertensionRate.male,
      f: physicalStats.hypertensionRate.female,
      max: 50,
      icon: HeartPulse,
    },
    {
      label: "Alcohol Consumption (L/yr)",
      metricKey: "alcoholLiters",
      mKey: "maleAlcoholLiters",
      fKey: "femaleAlcoholLiters",
      unit: " L/yr",
      m: physicalStats.alcoholLiters.male,
      f: physicalStats.alcoholLiters.female,
      max: 20,
      icon: Wine,
    },
    {
      label: "Smoking Rate (%)",
      metricKey: "smokingRate",
      mKey: "maleSmokingRate",
      fKey: "femaleSmokingRate",
      unit: "%",
      m: physicalStats.smokingRate.male,
      f: physicalStats.smokingRate.female,
      max: 60,
      icon: Cigarette,
    },
    {
      label: "Life Expectancy (years)",
      metricKey: "lifeExpectancy",
      mKey: "maleLifeExpectancy",
      fKey: "femaleLifeExpectancy",
      unit: " yrs",
      m: physicalStats.lifeExpectancy.male,
      f: physicalStats.lifeExpectancy.female,
      max: 95,
      icon: Heart,
    },
    {
      label: "Relative Leg Length (% height)",
      metricKey: "legLengthPercent",
      mKey: "maleLegLengthPercent",
      fKey: "femaleLegLengthPercent",
      unit: "%",
      m: physicalStats.legLengthPercent.male,
      f: physicalStats.legLengthPercent.female,
      max: 55,
      icon: Ruler,
    },
    {
      label: "Lean Muscle Mass (kg)",
      metricKey: "leanMuscleMassKg",
      mKey: "maleLeanMuscleMassKg",
      fKey: "femaleLeanMuscleMassKg",
      unit: " kg",
      m: physicalStats.leanMuscleMassKg.male,
      f: physicalStats.leanMuscleMassKg.female,
      max: 75,
      icon: Activity,
    },
    {
      label: "2D:4D Digit Ratio",
      metricKey: "digitRatio",
      mKey: "maleDigitRatio",
      fKey: "femaleDigitRatio",
      unit: "",
      m: physicalStats.digitRatio.male,
      f: physicalStats.digitRatio.female,
      max: 1.05,
      icon: Percent,
    },
    {
      label: "Shoulder-to-Waist Ratio",
      metricKey: "shoulderToWaistRatio",
      mKey: "maleShoulderToWaistRatio",
      fKey: "femaleShoulderToWaistRatio",
      unit: "",
      m: physicalStats.shoulderToWaistRatio.male,
      f: physicalStats.shoulderToWaistRatio.female,
      max: 1.8,
      icon: Ruler,
    },
    {
      label: "Hand Size (Length cm)",
      metricKey: "handLengthCm",
      mKey: "maleHandLengthCm",
      fKey: "femaleHandLengthCm",
      unit: " cm",
      m: physicalStats.handLengthCm.male,
      f: physicalStats.handLengthCm.female,
      max: 24,
      icon: Ruler,
    },
    {
      label: "Fundamental Vocal Pitch (Hz)",
      metricKey: "vocalPitchHz",
      mKey: "maleVocalPitchHz",
      fKey: "femaleVocalPitchHz",
      unit: " Hz",
      m: physicalStats.vocalPitchHz.male,
      f: physicalStats.vocalPitchHz.female,
      max: 260,
      icon: Activity,
    },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col w-full h-full bg-card/90 backdrop-blur-2xl border-l border-border/60 shadow-2xl overflow-hidden select-none transition-all duration-300",
        className
      )}
    >
      {/* ── 1. Top Search & Action Header ── */}
      <div className="p-3.5 border-b border-border/50 bg-background/50 backdrop-blur-md space-y-2.5 z-30">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Globe className="h-4 w-4" />
            </span>
            <span className="font-bold text-sm text-foreground tracking-tight">
              Country Intelligence
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={pickRandomCountry}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-secondary/70 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors border border-border/40"
              title="Select Random Country"
            >
              <Shuffle className="h-3 w-3 text-emerald-400" />
              <span>Random</span>
            </button>

            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close sidebar"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Global Instant Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search country, code (US/USA), or region..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            className="w-full h-8.5 pl-9 pr-8 bg-secondary/50 focus:bg-background border border-border/60 focus:border-emerald-500/50 rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Instant Search Results Dropdown Overlay */}
          {searchQuery.trim() !== "" && isSearchFocused && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-card/95 backdrop-blur-2xl border border-border/80 rounded-xl shadow-2xl max-h-64 overflow-y-auto z-50 p-1 divide-y divide-border/30 animate-in fade-in slide-in-from-top-2">
              {searchResults.length > 0 ? (
                searchResults.map((res) => (
                  <button
                    key={res.code}
                    onClick={() => {
                      onSelectCountry(res.code);
                      setSearchQuery("");
                      setIsSearchFocused(false);
                    }}
                    className="w-full flex items-center justify-between p-2 hover:bg-emerald-500/10 rounded-lg text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl">{res.flag}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate group-hover:text-emerald-400">
                          {res.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {res.region}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-secondary text-muted-foreground group-hover:bg-emerald-500/20 group-hover:text-emerald-400">
                        {res.code}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  No matching countries found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── 2. Country Flag & Profile Summary Card ── */}
      <div className="p-3.5 border-b border-border/40 bg-gradient-to-br from-card via-secondary/20 to-card space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-4xl drop-shadow-md flex-shrink-0">{country.flag}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-base font-bold text-foreground tracking-tight truncate">
                  {country.name}
                </h2>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  {country.code}
                </span>
                {country.alpha3 && (
                  <span className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.5 rounded bg-secondary/80">
                    {country.alpha3}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                <Globe className="h-3 w-3 text-muted-foreground/70 flex-shrink-0" />
                <span>{country.region}</span>
              </p>
            </div>
          </div>

          {/* Global Rank Badge */}
          <div className="flex flex-col items-end flex-shrink-0">
            <button
              type="button"
              onClick={() => onSelectMetric?.("p50")}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-inner hover:bg-amber-500/20 hover:border-amber-500/40 transition-all cursor-pointer group"
            >
              <Award className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="text-xs font-bold font-mono">
                #{rankInfo.rank} / {rankInfo.total}
              </span>
              <InfoButton metricKey="p50" onOpenHelp={setActiveHelpKey} />
            </button>
            <span className="text-[10px] text-muted-foreground mt-0.5 font-medium">
              Global Rank (P50)
            </span>
          </div>
        </div>

        {/* Population & Currency Strip */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onSelectMetric?.("population")}
            className="flex items-center justify-between p-2 rounded-xl bg-secondary/40 border border-border/30 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all cursor-pointer text-left group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Users className="h-4 w-4 text-cyan-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase font-medium tracking-wide group-hover:text-cyan-300">
                  Population
                </p>
                <p className="text-xs font-bold text-foreground font-mono truncate">
                  {(country.population / 1_000_000).toFixed(1)}M
                </p>
              </div>
            </div>
            <InfoButton metricKey="population" onOpenHelp={setActiveHelpKey} />
          </button>

          <button
            type="button"
            onClick={() => onSelectMetric?.("minimumWageEur")}
            className="flex items-center justify-between p-2 rounded-xl bg-secondary/40 border border-border/30 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all cursor-pointer text-left group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <DollarSign className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase font-medium tracking-wide group-hover:text-emerald-300">
                  Currency
                </p>
                <p
                  className="text-xs font-bold text-foreground font-mono truncate"
                  title={`${country.currency} (${country.currencySymbol})`}
                >
                  {country.currency} ({country.currencySymbol})
                </p>
              </div>
            </div>
            <InfoButton metricKey="minimumWageEur" onOpenHelp={setActiveHelpKey} />
          </button>
        </div>

        {/* Currency & Time Period Display Controls */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/30 text-xs">
          {/* Currency Toggle */}
          <div className="flex items-center gap-0.5 bg-secondary/60 p-0.5 rounded-lg border border-border/40">
            <button
              onClick={() => setCurrencyMode("usd_ppp")}
              className={cn(
                "px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all",
                currencyMode === "usd_ppp"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              USD PPP
            </button>
            <button
              onClick={() => setCurrencyMode("local")}
              className={cn(
                "px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all",
                currencyMode === "local"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Local ({country.currencySymbol})
            </button>
          </div>

          {/* Time Period Toggle */}
          <div className="flex items-center gap-0.5 bg-secondary/60 p-0.5 rounded-lg border border-border/40">
            <button
              onClick={() => setTimePeriod("monthly")}
              className={cn(
                "px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all",
                timePeriod === "monthly"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimePeriod("annual")}
              className={cn(
                "px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all",
                timePeriod === "annual"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Annual
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. Navigation Tabs ── */}
      <div className="flex items-center gap-1 p-2 border-b border-border/50 bg-background/30 overflow-x-auto no-scrollbar text-xs">
        {[
          { id: "income", label: "Income", icon: TrendingUp },
          { id: "physical", label: "Physical (M/F)", icon: Activity },
          { id: "economic", label: "Economic", icon: Briefcase },
          { id: "demographics", label: "Demographics", icon: Users },
          { id: "gender", label: "Gender", icon: Heart },
          { id: "comparison", label: "Compare", icon: BarChart3 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SidebarTab)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md font-bold"
                  : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── 4. Scrollable Tab Content Area ── */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {/* TAB 1: Income Percentiles */}
        {activeTab === "income" && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                <span>Income Distribution</span>
              </span>

              <select
                value={selectedIncomeType}
                onChange={(e) =>
                  setSelectedIncomeType(e.target.value as IncomeIndicatorType)
                }
                className="bg-secondary/80 text-xs font-medium text-foreground px-2 py-1 rounded-lg border border-border/50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {incomeIndicatorTypes.map((t) => (
                  <option key={t} value={t}>
                    {indicatorLabels[t]}
                  </option>
                ))}
              </select>
            </div>

            {/* Income Percentiles Cards */}
            <div className="space-y-2.5">
              {(() => {
                const indicatorData =
                  country.indicators[selectedIncomeType] ?? country.income;
                const maxVal = indicatorData.p90 || 1;
                const percentiles: Array<{
                  key: keyof typeof indicatorData;
                  metricKey: string;
                  label: string;
                  percentileName: string;
                }> = [
                  { key: "p10", metricKey: "p10", label: "P10", percentileName: "Bottom 10%" },
                  { key: "p25", metricKey: "p25", label: "P25", percentileName: "Lower 25%" },
                  { key: "p50", metricKey: "income", label: "P50", percentileName: "Median (50%)" },
                  { key: "p75", metricKey: "p75", label: "P75", percentileName: "Upper 75%" },
                  { key: "p90", metricKey: "p90", label: "P90", percentileName: "Top 10%" },
                ];

                return percentiles.map((p) => {
                  const val = indicatorData[p.key];
                  const fillPct = Math.min(100, Math.max(8, (val / maxVal) * 100));

                  return (
                    <MetricCard
                      key={p.key}
                      label={`${p.label} — ${p.percentileName}`}
                      metricKey={p.metricKey}
                      activeSortKey={activeSortKey}
                      onSelectMetric={onSelectMetric}
                      onOpenHelp={setActiveHelpKey}
                      icon={DollarSign}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground text-[11px]">
                            {timePeriod === "annual" ? "Annual Income" : "Monthly Income"}
                          </span>
                          <span className="font-bold font-mono text-emerald-400 text-sm">
                            {formatCurrencyValue(val)}
                          </span>
                        </div>

                        {/* Visual Bar */}
                        <div className="h-2 w-full rounded-full bg-secondary/80 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-indigo-500 transition-all duration-500"
                            style={{ width: `${fillPct}%` }}
                          />
                        </div>
                      </div>
                    </MetricCard>
                  );
                });
              })()}
            </div>
          </div>
        )}

        {/* TAB 2: Physical & Health Stats (Side-by-Side Male vs Female) */}
        {activeTab === "physical" && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-cyan-400" />
                <span>Physical Characteristics (Male vs Female)</span>
              </span>
            </div>

            {/* Top Male vs Female Overall Physical Summary Cards (Clickable!) */}
            <div className="grid grid-cols-2 gap-2">
              {/* Male Summary Card */}
              <div
                onClick={() => onSelectMetric?.("maleHeightCm")}
                className={cn(
                  "p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-1 text-center shadow-sm cursor-pointer transition-all hover:bg-blue-500/20 hover:scale-[1.02]",
                  isMetricActive("maleHeightCm", activeSortKey) && "ring-2 ring-emerald-400 border-emerald-500 bg-emerald-500/15"
                )}
              >
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">
                  👨 Male Overall Avg
                </span>
                <p className="text-lg font-bold text-foreground font-mono">
                  {physicalStats.heightCm.male} cm
                </p>
                <p className="text-[11px] text-muted-foreground font-medium">
                  {physicalStats.weightKg.male} kg • BMI {physicalStats.bmi.male}
                </p>
              </div>

              {/* Female Summary Card */}
              <div
                onClick={() => onSelectMetric?.("femaleHeightCm")}
                className={cn(
                  "p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 space-y-1 text-center shadow-sm cursor-pointer transition-all hover:bg-pink-500/20 hover:scale-[1.02]",
                  isMetricActive("femaleHeightCm", activeSortKey) && "ring-2 ring-emerald-400 border-emerald-500 bg-emerald-500/15"
                )}
              >
                <span className="text-[11px] font-bold text-pink-400 uppercase tracking-wider block">
                  👩 Female Overall Avg
                </span>
                <p className="text-lg font-bold text-foreground font-mono">
                  {physicalStats.heightCm.female} cm
                </p>
                <p className="text-[11px] text-muted-foreground font-medium">
                  {physicalStats.weightKg.female} kg • BMI {physicalStats.bmi.female}
                </p>
              </div>
            </div>

            {/* Phenotypic & Anthropometric Interactive Metric Cards */}
            <div className="space-y-2.5">
              {/* 1. Hair Color & Texture Breakdown Card */}
              <MetricCard
                label="Hair Color & Texture Breakdown"
                metricKey="hairColor"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                onOpenHelp={setActiveHelpKey}
                icon={Sparkles}
              >
                <div className="space-y-3 pt-0.5">
                  {/* Hair Colors Breakdown */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                      <span>Hair Color (%)</span>
                      <span className="text-[10px] text-muted-foreground/70 font-normal">Click pill to map</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { key: "hairColorBlack", label: "Black", val: physicalStats.hairColor.black, color: "bg-zinc-900/80 text-zinc-200 border-zinc-700" },
                        { key: "hairColorBrown", label: "Brown", val: physicalStats.hairColor.brown, color: "bg-amber-950/60 text-amber-300 border-amber-800/60" },
                        { key: "hairColorBlonde", label: "Blonde", val: physicalStats.hairColor.blonde, color: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
                        { key: "hairColorRed", label: "Red", val: physicalStats.hairColor.red, color: "bg-orange-500/20 text-orange-400 border-orange-500/40" },
                      ].map((c) => {
                        const isPillActive = isMetricActive(c.key, activeSortKey);
                        return (
                          <button
                            key={c.key}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectMetric?.(c.key);
                            }}
                            className={cn(
                              "p-1.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center",
                              c.color,
                              isPillActive && "ring-2 ring-emerald-400 border-emerald-500 shadow-md shadow-emerald-500/20 font-bold"
                            )}
                          >
                            <span className="text-[10px] font-medium opacity-90 truncate w-full">{c.label}</span>
                            <span className="text-xs font-mono font-bold">{c.val}%</span>
                          </button>
                        );
                      })}
                    </div>
                    {/* Segmented Hair Color Bar */}
                    <div className="h-2 w-full bg-secondary/80 rounded-full overflow-hidden flex shadow-inner">
                      <div className="h-full bg-zinc-900 transition-all duration-500" style={{ width: `${physicalStats.hairColor.black}%` }} title={`Black: ${physicalStats.hairColor.black}%`} />
                      <div className="h-full bg-amber-800 transition-all duration-500" style={{ width: `${physicalStats.hairColor.brown}%` }} title={`Brown: ${physicalStats.hairColor.brown}%`} />
                      <div className="h-full bg-amber-300 transition-all duration-500" style={{ width: `${physicalStats.hairColor.blonde}%` }} title={`Blonde: ${physicalStats.hairColor.blonde}%`} />
                      <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${physicalStats.hairColor.red}%` }} title={`Red: ${physicalStats.hairColor.red}%`} />
                    </div>
                  </div>

                  {/* Hair Textures Breakdown */}
                  <div className="space-y-1.5 pt-1.5 border-t border-border/30">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                      <span>Hair Texture (%)</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { key: "hairTextureStraight", label: "Straight", val: physicalStats.hairTexture.straight, color: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
                        { key: "hairTextureWavy", label: "Wavy", val: physicalStats.hairTexture.wavy, color: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" },
                        { key: "hairTextureCurly", label: "Curly", val: physicalStats.hairTexture.curly, color: "bg-purple-500/15 text-purple-300 border-purple-500/30" },
                        { key: "hairTextureCoily", label: "Coily", val: physicalStats.hairTexture.coily, color: "bg-pink-500/15 text-pink-300 border-pink-500/30" },
                      ].map((tItem) => {
                        const isPillActive = isMetricActive(tItem.key, activeSortKey);
                        return (
                          <button
                            key={tItem.key}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectMetric?.(tItem.key);
                            }}
                            className={cn(
                              "p-1.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center",
                              tItem.color,
                              isPillActive && "ring-2 ring-emerald-400 border-emerald-500 shadow-md shadow-emerald-500/20 font-bold"
                            )}
                          >
                            <span className="text-[10px] font-medium opacity-90 truncate w-full">{tItem.label}</span>
                            <span className="text-xs font-mono font-bold">{tItem.val}%</span>
                          </button>
                        );
                      })}
                    </div>
                    {/* Segmented Texture Bar */}
                    <div className="h-2 w-full bg-secondary/80 rounded-full overflow-hidden flex shadow-inner">
                      <div className="h-full bg-sky-400 transition-all duration-500" style={{ width: `${physicalStats.hairTexture.straight}%` }} title={`Straight: ${physicalStats.hairTexture.straight}%`} />
                      <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${physicalStats.hairTexture.wavy}%` }} title={`Wavy: ${physicalStats.hairTexture.wavy}%`} />
                      <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${physicalStats.hairTexture.curly}%` }} title={`Curly: ${physicalStats.hairTexture.curly}%`} />
                      <div className="h-full bg-pink-500 transition-all duration-500" style={{ width: `${physicalStats.hairTexture.coily}%` }} title={`Coily: ${physicalStats.hairTexture.coily}%`} />
                    </div>
                  </div>
                </div>
              </MetricCard>

              {/* 2. Eye Color Breakdown Card */}
              <MetricCard
                label="Eye Color Breakdown"
                metricKey="eyeColor"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                onOpenHelp={setActiveHelpKey}
                icon={Eye}
              >
                <div className="space-y-2 pt-0.5">
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { key: "eyeColorBrown", label: "Brown", val: physicalStats.eyeColor.brown, color: "bg-amber-950/60 text-amber-300 border-amber-800/60" },
                      { key: "eyeColorBlue", label: "Blue", val: physicalStats.eyeColor.blue, color: "bg-sky-500/20 text-sky-300 border-sky-500/40" },
                      { key: "eyeColorGreen", label: "Green", val: physicalStats.eyeColor.green, color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
                      { key: "eyeColorHazel", label: "Hazel", val: physicalStats.eyeColor.hazel, color: "bg-amber-500/20 text-amber-400 border-amber-500/40" },
                    ].map((eItem) => {
                      const isPillActive = isMetricActive(eItem.key, activeSortKey);
                      return (
                        <button
                          key={eItem.key}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectMetric?.(eItem.key);
                          }}
                          className={cn(
                            "p-1.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center",
                            eItem.color,
                            isPillActive && "ring-2 ring-emerald-400 border-emerald-500 shadow-md shadow-emerald-500/20 font-bold"
                          )}
                        >
                          <span className="text-[10px] font-medium opacity-90 truncate w-full">{eItem.label}</span>
                          <span className="text-xs font-mono font-bold">{eItem.val}%</span>
                        </button>
                      );
                    })}
                  </div>
                  {/* Eye Color Segmented Bar */}
                  <div className="h-2.5 w-full bg-secondary/80 rounded-full overflow-hidden flex shadow-inner">
                    <div className="h-full bg-amber-900 transition-all duration-500" style={{ width: `${physicalStats.eyeColor.brown}%` }} title={`Brown: ${physicalStats.eyeColor.brown}%`} />
                    <div className="h-full bg-sky-400 transition-all duration-500" style={{ width: `${physicalStats.eyeColor.blue}%` }} title={`Blue: ${physicalStats.eyeColor.blue}%`} />
                    <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${physicalStats.eyeColor.green}%` }} title={`Green: ${physicalStats.eyeColor.green}%`} />
                    <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${physicalStats.eyeColor.hazel}%` }} title={`Hazel: ${physicalStats.eyeColor.hazel}%`} />
                  </div>
                </div>
              </MetricCard>

              {/* 3. Skin Tone / Melanin Index Card */}
              <MetricCard
                label="Skin Tone / Melanin Index (ITA°)"
                metricKey="skinPigmentation"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                onOpenHelp={setActiveHelpKey}
                icon={Palette}
              >
                <div className="space-y-2 pt-0.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-xs font-semibold text-foreground truncate">
                        {physicalStats.skinPigmentation.label}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                        {physicalStats.skinPigmentation.fitzpatrickType}
                      </span>
                    </div>
                    <span className="text-xs font-bold font-mono text-emerald-400 shrink-0">
                      {physicalStats.skinPigmentation.itaAngle > 0 ? `+${physicalStats.skinPigmentation.itaAngle}°` : `${physicalStats.skinPigmentation.itaAngle}°`} ITA
                    </span>
                  </div>

                  {/* Melanin Spectrum Visual Scale */}
                  <div className="space-y-1">
                    <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-amber-950 via-amber-700 via-amber-400 to-amber-100 overflow-hidden relative border border-border/40 shadow-inner">
                      {/* Cursor Position Marker */}
                      {(() => {
                        const positionPct = Math.max(0, Math.min(100, ((physicalStats.skinPigmentation.itaAngle + 50) / 110) * 100));
                        return (
                          <div
                            className="absolute top-0 bottom-0 w-1.5 bg-emerald-400 border border-white shadow-md shadow-emerald-500/50 rounded-full -translate-x-1/2 transition-all duration-500"
                            style={{ left: `${positionPct}%` }}
                          />
                        );
                      })()}
                    </div>
                    <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
                      <span>Dark (-50°)</span>
                      <span>Olive (28°)</span>
                      <span>Very Fair (+60°)</span>
                    </div>
                  </div>
                </div>
              </MetricCard>

              {/* 4. Relative Leg Length (% of Height) Card */}
              <MetricCard
                label="Relative Leg Length (% of Height)"
                metricKey="legLengthPercent"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                onOpenHelp={setActiveHelpKey}
                icon={Ruler}
              >
                <div className="space-y-2 pt-0.5">
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMetric?.("maleLegLengthPercent");
                      }}
                      className={cn(
                        "p-2 rounded-xl border flex items-center justify-between transition-all cursor-pointer text-left",
                        "bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20",
                        isMetricActive("maleLegLengthPercent", activeSortKey) && "ring-2 ring-emerald-400 border-emerald-500 bg-emerald-500/15 font-bold shadow-md text-emerald-400"
                      )}
                    >
                      <span className="text-[10px] uppercase font-bold flex items-center gap-1">👨 Male</span>
                      <span className="font-mono font-bold text-foreground">{physicalStats.legLengthPercent.male}%</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMetric?.("femaleLegLengthPercent");
                      }}
                      className={cn(
                        "p-2 rounded-xl border flex items-center justify-between transition-all cursor-pointer text-left",
                        "bg-pink-500/10 border-pink-500/30 text-pink-400 hover:bg-pink-500/20",
                        isMetricActive("femaleLegLengthPercent", activeSortKey) && "ring-2 ring-emerald-400 border-emerald-500 bg-emerald-500/15 font-bold shadow-md text-emerald-400"
                      )}
                    >
                      <span className="text-[10px] uppercase font-bold flex items-center gap-1">👩 Female</span>
                      <span className="font-mono font-bold text-foreground">{physicalStats.legLengthPercent.female}%</span>
                    </button>
                  </div>

                  {/* Dual Bar Chart */}
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-secondary/80 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (physicalStats.legLengthPercent.male / 55) * 100)}%` }}
                      />
                    </div>
                    <div className="h-1.5 w-full bg-secondary/80 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-pink-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (physicalStats.legLengthPercent.female / 55) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </MetricCard>

              {/* 5. Lean Muscle Mass Card */}
              <MetricCard
                label="Lean Muscle Mass (kg & %)"
                metricKey="leanMuscleMassKg"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                onOpenHelp={setActiveHelpKey}
                icon={Dumbbell}
              >
                <div className="space-y-2 pt-0.5">
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMetric?.("maleLeanMuscleMassKg");
                      }}
                      className={cn(
                        "p-2 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer text-center",
                        "bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20",
                        isMetricActive("maleLeanMuscleMassKg", activeSortKey) && "ring-2 ring-emerald-400 border-emerald-500 bg-emerald-500/15 font-bold shadow-md text-emerald-400"
                      )}
                    >
                      <span className="text-[10px] uppercase font-bold">👨 Male Lean Mass</span>
                      <span className="text-sm font-bold font-mono text-foreground">{physicalStats.leanMuscleMassKg.male} kg</span>
                      <span className="text-[10px] text-muted-foreground font-mono">({physicalStats.leanMusclePercent.male}%)</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMetric?.("femaleLeanMuscleMassKg");
                      }}
                      className={cn(
                        "p-2 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer text-center",
                        "bg-pink-500/10 border-pink-500/30 text-pink-400 hover:bg-pink-500/20",
                        isMetricActive("femaleLeanMuscleMassKg", activeSortKey) && "ring-2 ring-emerald-400 border-emerald-500 bg-emerald-500/15 font-bold shadow-md text-emerald-400"
                      )}
                    >
                      <span className="text-[10px] uppercase font-bold">👩 Female Lean Mass</span>
                      <span className="text-sm font-bold font-mono text-foreground">{physicalStats.leanMuscleMassKg.female} kg</span>
                      <span className="text-[10px] text-muted-foreground font-mono">({physicalStats.leanMusclePercent.female}%)</span>
                    </button>
                  </div>

                  {/* Dual Bar Chart */}
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-secondary/80 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, physicalStats.leanMusclePercent.male)}%` }}
                      />
                    </div>
                    <div className="h-1.5 w-full bg-secondary/80 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-pink-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, physicalStats.leanMusclePercent.female)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </MetricCard>

              {/* 6. 2D:4D Digit Ratio Card */}
              <MetricCard
                label="2D:4D Digit Ratio (Index / Ring Finger)"
                metricKey="digitRatio"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                onOpenHelp={setActiveHelpKey}
                icon={Hand}
              >
                <div className="space-y-2 pt-0.5">
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMetric?.("maleDigitRatio");
                      }}
                      className={cn(
                        "p-2 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer text-center",
                        "bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20",
                        isMetricActive("maleDigitRatio", activeSortKey) && "ring-2 ring-emerald-400 border-emerald-500 bg-emerald-500/15 font-bold shadow-md text-emerald-400"
                      )}
                    >
                      <span className="text-[10px] uppercase font-bold">👨 Male 2D:4D</span>
                      <span className="text-sm font-bold font-mono text-foreground">{physicalStats.digitRatio.male}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMetric?.("femaleDigitRatio");
                      }}
                      className={cn(
                        "p-2 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer text-center",
                        "bg-pink-500/10 border-pink-500/30 text-pink-400 hover:bg-pink-500/20",
                        isMetricActive("femaleDigitRatio", activeSortKey) && "ring-2 ring-emerald-400 border-emerald-500 bg-emerald-500/15 font-bold shadow-md text-emerald-400"
                      )}
                    >
                      <span className="text-[10px] uppercase font-bold">👩 Female 2D:4D</span>
                      <span className="text-sm font-bold font-mono text-foreground">{physicalStats.digitRatio.female}</span>
                    </button>
                  </div>

                  <div className="text-[10px] text-muted-foreground text-center font-medium">
                    Lower male ratio (&lt;0.96) indicates higher prenatal testosterone exposure
                  </div>
                </div>
              </MetricCard>

              {/* 7. Shoulder-to-Waist Ratio Card */}
              <MetricCard
                label="Shoulder-to-Waist Ratio"
                metricKey="shoulderToWaistRatio"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                onOpenHelp={setActiveHelpKey}
                icon={Activity}
              >
                <div className="space-y-2 pt-0.5">
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMetric?.("maleShoulderToWaistRatio");
                      }}
                      className={cn(
                        "p-2 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer text-center",
                        "bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20",
                        isMetricActive("maleShoulderToWaistRatio", activeSortKey) && "ring-2 ring-emerald-400 border-emerald-500 bg-emerald-500/15 font-bold shadow-md text-emerald-400"
                      )}
                    >
                      <span className="text-[10px] uppercase font-bold">👨 Male V-Taper</span>
                      <span className="text-sm font-bold font-mono text-foreground">{physicalStats.shoulderToWaistRatio.male}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMetric?.("femaleShoulderToWaistRatio");
                      }}
                      className={cn(
                        "p-2 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer text-center",
                        "bg-pink-500/10 border-pink-500/30 text-pink-400 hover:bg-pink-500/20",
                        isMetricActive("femaleShoulderToWaistRatio", activeSortKey) && "ring-2 ring-emerald-400 border-emerald-500 bg-emerald-500/15 font-bold shadow-md text-emerald-400"
                      )}
                    >
                      <span className="text-[10px] uppercase font-bold">👩 Female Hourglass</span>
                      <span className="text-sm font-bold font-mono text-foreground">{physicalStats.shoulderToWaistRatio.female}</span>
                    </button>
                  </div>

                  {/* Dual Bar Chart */}
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-secondary/80 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (physicalStats.shoulderToWaistRatio.male / 1.7) * 100)}%` }}
                      />
                    </div>
                    <div className="h-1.5 w-full bg-secondary/80 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-pink-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (physicalStats.shoulderToWaistRatio.female / 1.7) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </MetricCard>

              {/* 8. Hand Size & Vocal Pitch Dual Cards */}
              <div className="grid grid-cols-2 gap-2">
                {/* Hand Length Card */}
                <MetricCard
                  label="Hand Size (cm)"
                  metricKey="handLengthCm"
                  activeSortKey={activeSortKey}
                  onSelectMetric={onSelectMetric}
                  onOpenHelp={setActiveHelpKey}
                  icon={Hand}
                >
                  <div className="space-y-1.5 pt-0.5 text-xs font-mono">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMetric?.("maleHandLengthCm");
                      }}
                      className={cn(
                        "w-full p-1 rounded-lg border flex justify-between items-center transition-all cursor-pointer",
                        "bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20",
                        isMetricActive("maleHandLengthCm", activeSortKey) && "ring-2 ring-emerald-400 border-emerald-500 bg-emerald-500/15 font-bold"
                      )}
                    >
                      <span className="text-[10px]">👨 Male</span>
                      <span className="font-bold text-foreground">{physicalStats.handLengthCm.male} cm</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMetric?.("femaleHandLengthCm");
                      }}
                      className={cn(
                        "w-full p-1 rounded-lg border flex justify-between items-center transition-all cursor-pointer",
                        "bg-pink-500/10 border-pink-500/30 text-pink-400 hover:bg-pink-500/20",
                        isMetricActive("femaleHandLengthCm", activeSortKey) && "ring-2 ring-emerald-400 border-emerald-500 bg-emerald-500/15 font-bold"
                      )}
                    >
                      <span className="text-[10px]">👩 Female</span>
                      <span className="font-bold text-foreground">{physicalStats.handLengthCm.female} cm</span>
                    </button>
                  </div>
                </MetricCard>

                {/* Vocal Pitch Card */}
                <MetricCard
                  label="Vocal Pitch (Hz)"
                  metricKey="vocalPitchHz"
                  activeSortKey={activeSortKey}
                  onSelectMetric={onSelectMetric}
                  onOpenHelp={setActiveHelpKey}
                  icon={Volume2}
                >
                  <div className="space-y-1.5 pt-0.5 text-xs font-mono">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMetric?.("maleVocalPitchHz");
                      }}
                      className={cn(
                        "w-full p-1 rounded-lg border flex justify-between items-center transition-all cursor-pointer",
                        "bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20",
                        isMetricActive("maleVocalPitchHz", activeSortKey) && "ring-2 ring-emerald-400 border-emerald-500 bg-emerald-500/15 font-bold"
                      )}
                    >
                      <span className="text-[10px]">👨 Male</span>
                      <span className="font-bold text-foreground">{physicalStats.vocalPitchHz.male} Hz</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMetric?.("femaleVocalPitchHz");
                      }}
                      className={cn(
                        "w-full p-1 rounded-lg border flex justify-between items-center transition-all cursor-pointer",
                        "bg-pink-500/10 border-pink-500/30 text-pink-400 hover:bg-pink-500/20",
                        isMetricActive("femaleVocalPitchHz", activeSortKey) && "ring-2 ring-emerald-400 border-emerald-500 bg-emerald-500/15 font-bold"
                      )}
                    >
                      <span className="text-[10px]">👩 Female</span>
                      <span className="font-bold text-foreground">{physicalStats.vocalPitchHz.female} Hz</span>
                    </button>
                  </div>
                </MetricCard>
              </div>
            </div>

            {/* Detailed Physical Metrics List with Side-by-Side Dual-Bar Charts */}
            <div className="space-y-2.5">
              {physicalMetricsList.map((item) => {
                const isMaleActive = isMetricActive(item.mKey, activeSortKey);
                const isFemaleActive = isMetricActive(item.fKey, activeSortKey);

                return (
                  <MetricCard
                    key={item.label}
                    label={item.label}
                    metricKey={item.metricKey}
                    activeSortKey={activeSortKey}
                    onSelectMetric={onSelectMetric}
                    onOpenHelp={setActiveHelpKey}
                    icon={item.icon}
                  >
                    <div className="space-y-2">
                      {/* Interactive Male vs Female Click Buttons */}
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectMetric?.(item.mKey);
                          }}
                          className={cn(
                            "p-2 rounded-xl border flex items-center justify-between transition-all cursor-pointer text-left",
                            "bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:scale-[1.01]",
                            isMaleActive && "ring-2 ring-emerald-400 border-emerald-500 bg-emerald-500/15 font-bold shadow-md shadow-emerald-500/20 text-emerald-400"
                          )}
                        >
                          <span className="text-[10px] uppercase font-bold flex items-center gap-1">
                            👨 Male
                            {isMaleActive && <Check className="h-3 w-3 text-emerald-400" />}
                          </span>
                          <span className="font-mono font-bold text-foreground">{item.m}{item.unit}</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectMetric?.(item.fKey);
                          }}
                          className={cn(
                            "p-2 rounded-xl border flex items-center justify-between transition-all cursor-pointer text-left",
                            "bg-pink-500/10 border-pink-500/30 text-pink-400 hover:bg-pink-500/20 hover:scale-[1.01]",
                            isFemaleActive && "ring-2 ring-emerald-400 border-emerald-500 bg-emerald-500/15 font-bold shadow-md shadow-emerald-500/20 text-emerald-400"
                          )}
                        >
                          <span className="text-[10px] uppercase font-bold flex items-center gap-1">
                            👩 Female
                            {isFemaleActive && <Check className="h-3 w-3 text-emerald-400" />}
                          </span>
                          <span className="font-mono font-bold text-foreground">{item.f}{item.unit}</span>
                        </button>
                      </div>

                      {/* Comparative Dual Bar Chart */}
                      <div className="space-y-1">
                        {/* Male Bar */}
                        <div
                          className="h-1.5 w-full bg-secondary/80 rounded-full overflow-hidden flex"
                          title={`Male ${item.label}: ${item.m}${item.unit}`}
                        >
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (item.m / item.max) * 100)}%` }}
                          />
                        </div>
                        {/* Female Bar */}
                        <div
                          className="h-1.5 w-full bg-secondary/80 rounded-full overflow-hidden flex"
                          title={`Female ${item.label}: ${item.f}${item.unit}`}
                        >
                          <div
                            className="h-full bg-pink-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (item.f / item.max) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </MetricCard>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: Economic Stats */}
        {activeTab === "economic" && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-emerald-400" />
              <span>Macroeconomic Indicators</span>
            </span>

            <div className="space-y-2.5">
              {/* Minimum Wage */}
              <MetricCard
                label="Minimum Wage"
                metricKey="minimumWageEur"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                onOpenHelp={setActiveHelpKey}
                icon={DollarSign}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    {timePeriod === "annual" ? "Annual Minimum Wage" : "Monthly Minimum Wage"}
                  </span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    {country.minimumWageEur != null
                      ? formatCurrencyValue(country.minimumWageEur)
                      : "N/A"}
                  </span>
                </div>
              </MetricCard>

              {/* Unemployment Rate */}
              <MetricCard
                label="Unemployment Rate"
                metricKey="unemploymentRate"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                onOpenHelp={setActiveHelpKey}
                icon={Users}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Labor Force Unemployed</span>
                  <span className="text-sm font-bold text-orange-400 font-mono">
                    {country.unemploymentRate != null ? `${country.unemploymentRate}%` : "N/A"}
                  </span>
                </div>
              </MetricCard>

              {/* Cost of Living Index */}
              <MetricCard
                label="Cost of Living Index"
                metricKey="costOfLivingIndex"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                onOpenHelp={setActiveHelpKey}
                icon={Building2}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Baseline Relative to NYC (100)</span>
                  <span className="text-sm font-bold text-cyan-400 font-mono">
                    {country.costOfLivingIndex ?? "N/A"}
                  </span>
                </div>
              </MetricCard>

              {/* Internet Penetration */}
              <MetricCard
                label="Internet Penetration Rate"
                metricKey="internetPenetration"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                onOpenHelp={setActiveHelpKey}
                icon={Globe}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Population with Internet</span>
                  <span className="text-sm font-bold text-blue-400 font-mono">
                    {country.internetPenetration != null ? `${country.internetPenetration}%` : "N/A"}
                  </span>
                </div>
              </MetricCard>

              {/* Total Population */}
              <MetricCard
                label="Total Population"
                metricKey="population"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                onOpenHelp={setActiveHelpKey}
                icon={Users}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">National Population</span>
                  <span className="text-sm font-bold text-purple-400 font-mono">
                    {(country.population / 1_000_000).toFixed(2)}M
                  </span>
                </div>
              </MetricCard>

              {/* Exchange Rate */}
              <MetricCard
                label="Local Currency Exchange Rate"
                metricKey="exchangeRate"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                onOpenHelp={setActiveHelpKey}
                icon={DollarSign}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">1 EUR / USD Equivalent</span>
                  <span className="text-sm font-bold text-indigo-400 font-mono">
                    {country.exchangeRate} {country.currencySymbol}
                  </span>
                </div>
              </MetricCard>
            </div>
          </div>
        )}

        {/* TAB 4: Demographics & Social */}
        {activeTab === "demographics" && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-cyan-400" />
              <span>Demographics & Social Metrics</span>
            </span>

            <div className="space-y-2.5">
              {/* Human Development Index */}
              <MetricCard
                label="Human Development Index (HDI)"
                metricKey="hdi"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                onOpenHelp={setActiveHelpKey}
                icon={Award}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">UN Composite Index (0 - 1.0)</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    {country.hdi != null ? country.hdi.toFixed(3) : "N/A"}
                  </span>
                </div>
              </MetricCard>

              {/* Population */}
              <MetricCard
                label="Population Size"
                metricKey="population"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                onOpenHelp={setActiveHelpKey}
                icon={Users}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Resident Population</span>
                  <span className="text-sm font-bold text-cyan-400 font-mono">
                    {(country.population / 1_000_000).toFixed(2)} Million
                  </span>
                </div>
              </MetricCard>

              {/* English Speaking % */}
              <MetricCard
                label="English Speaking Population"
                metricKey="englishSpeakingPercent"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                onOpenHelp={setActiveHelpKey}
                icon={BookOpen}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Fluent / Functional English</span>
                  <span className="text-sm font-bold text-blue-400 font-mono">
                    {country.englishSpeakingPercent != null ? `${country.englishSpeakingPercent}%` : "N/A"}
                  </span>
                </div>
              </MetricCard>

              {/* Main Industry */}
              <MetricCard
                label="Main Economic Industry"
                metricKey="mainIndustry"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                onOpenHelp={setActiveHelpKey}
                icon={Building2}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Primary Sector</span>
                  <span className="text-xs font-bold text-foreground truncate max-w-[180px]">
                    {country.mainIndustry ?? "Services & Trade"}
                  </span>
                </div>
              </MetricCard>

              {/* Data Provenance Card */}
              <div className="p-3 rounded-xl bg-secondary/20 border border-border/30 space-y-1 text-xs">
                <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  <span>Data Source & Provenance</span>
                </span>
                <p className="text-foreground font-medium">{country.dataSource}</p>
                <p className="text-[10px] text-muted-foreground">Data Year: {country.dataYear}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Gender Metrics */}
        {activeTab === "gender" && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5 text-pink-400" />
              <span>Gender & Reproductive Health</span>
            </span>

            <div className="space-y-2.5">
              {/* Adolescent Birth Rate */}
              <MetricCard
                label="Adolescent Birth Rate"
                metricKey="adolescentBirthRate"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                onOpenHelp={setActiveHelpKey}
                icon={Heart}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Per 1,000 Women Aged 15-19</span>
                  <span className="text-sm font-bold text-purple-400 font-mono">
                    {country.gender.adolescentBirthRate ?? "N/A"}
                  </span>
                </div>
              </MetricCard>

              {/* Child Marriage Percent */}
              <MetricCard
                label="Child Marriage Percentage"
                metricKey="childMarriagePercent"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                onOpenHelp={setActiveHelpKey}
                icon={HeartPulse}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Married Before Age 18</span>
                  <span className="text-sm font-bold text-pink-400 font-mono">
                    {country.gender.childMarriagePercent != null
                      ? `${country.gender.childMarriagePercent}%`
                      : "N/A"}
                  </span>
                </div>
              </MetricCard>

              {/* Labor Force Gap */}
              <MetricCard
                label="Labor Force Participation Gap"
                metricKey="laborForceGap"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                onOpenHelp={setActiveHelpKey}
                icon={Users}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Male vs Female Participation Gap</span>
                  <span className="text-sm font-bold text-amber-400 font-mono">
                    {country.gender.laborForceGap != null ? `${country.gender.laborForceGap}%` : "N/A"}
                  </span>
                </div>
              </MetricCard>

              {/* Contraceptive Use */}
              <MetricCard
                label="Contraceptive Prevalence"
                metricKey="contraceptiveUse"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                onOpenHelp={setActiveHelpKey}
                icon={Activity}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Women Aged 15-49</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    {country.gender.contraceptiveUse != null ? `${country.gender.contraceptiveUse}%` : "N/A"}
                  </span>
                </div>
              </MetricCard>
            </div>
          </div>
        )}

        {/* TAB 6: Regional & Global Comparison */}
        {activeTab === "comparison" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5 text-indigo-400" />
              <span>{country.name} vs Region & Global Medians</span>
            </span>

            {(() => {
              const regIncome = getRegionalAverageMetric(
                country.region,
                (c: CountryData) => c.income.p50
              );
              const globIncome = getGlobalMedianMetric((c: CountryData) => c.income.p50);

              const regHdi = getRegionalAverageMetric(country.region, (c: CountryData) => c.hdi);
              const globHdi = getGlobalMedianMetric((c: CountryData) => c.hdi);

              const regObesity = getRegionalAverageMetric(
                country.region,
                (c: CountryData) => c.obesityRate
              );
              const globObesity = getGlobalMedianMetric((c: CountryData) => c.obesityRate);

              const regLifeExp = getRegionalAverageMetric(
                country.region,
                (c: CountryData) => c.femaleLifeExpectancy
              );
              const globLifeExp = getGlobalMedianMetric(
                (c: CountryData) => c.femaleLifeExpectancy
              );

              return (
                <div className="space-y-3">
                  {/* Income P50 Comparison */}
                  <MetricCard
                    label="P50 Median Income Comparison"
                    metricKey="income"
                    activeSortKey={activeSortKey}
                    onSelectMetric={onSelectMetric}
                    onOpenHelp={setActiveHelpKey}
                    icon={TrendingUp}
                  >
                    <div className="space-y-2 text-xs">
                      {/* Country */}
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-emerald-400 font-semibold">{country.name}</span>
                          <span className="font-mono font-bold">{formatCurrencyValue(country.income.p50)}</span>
                        </div>
                        <div className="h-2 bg-secondary/80 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 rounded-full"
                            style={{ width: `${Math.min(100, (country.income.p50 / 4000) * 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Region Avg */}
                      {regIncome != null && (
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-cyan-400 font-semibold">{country.region} Avg</span>
                            <span className="font-mono font-bold">{formatCurrencyValue(regIncome)}</span>
                          </div>
                          <div className="h-2 bg-secondary/80 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-cyan-400 rounded-full"
                              style={{ width: `${Math.min(100, (regIncome / 4000) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Global Median */}
                      {globIncome != null && (
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-indigo-400 font-semibold">Global Median</span>
                            <span className="font-mono font-bold">{formatCurrencyValue(globIncome)}</span>
                          </div>
                          <div className="h-2 bg-secondary/80 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-400 rounded-full"
                              style={{ width: `${Math.min(100, (globIncome / 4000) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </MetricCard>

                  {/* HDI Comparison */}
                  <MetricCard
                    label="Human Development Index (HDI)"
                    metricKey="hdi"
                    activeSortKey={activeSortKey}
                    onSelectMetric={onSelectMetric}
                    onOpenHelp={setActiveHelpKey}
                    icon={Award}
                  >
                    <div className="space-y-2 text-xs">
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-emerald-400 font-semibold">{country.name}</span>
                          <span className="font-mono font-bold">{country.hdi?.toFixed(3) ?? "N/A"}</span>
                        </div>
                        <div className="h-2 bg-secondary/80 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 rounded-full"
                            style={{ width: `${Math.min(100, ((country.hdi ?? 0) / 1.0) * 100)}%` }}
                          />
                        </div>
                      </div>

                      {regHdi != null && (
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-cyan-400 font-semibold">{country.region} Avg</span>
                            <span className="font-mono font-bold">{regHdi.toFixed(3)}</span>
                          </div>
                          <div className="h-2 bg-secondary/80 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-cyan-400 rounded-full"
                              style={{ width: `${Math.min(100, (regHdi / 1.0) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {globHdi != null && (
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-indigo-400 font-semibold">Global Median</span>
                            <span className="font-mono font-bold">{globHdi.toFixed(3)}</span>
                          </div>
                          <div className="h-2 bg-secondary/80 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-400 rounded-full"
                              style={{ width: `${Math.min(100, (globHdi / 1.0) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </MetricCard>

                  {/* Obesity Rate Comparison */}
                  <MetricCard
                    label="Obesity Rate Comparison"
                    metricKey="obesityRate"
                    activeSortKey={activeSortKey}
                    onSelectMetric={onSelectMetric}
                    onOpenHelp={setActiveHelpKey}
                    icon={Activity}
                  >
                    <div className="space-y-2 text-xs">
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-emerald-400 font-semibold">{country.name}</span>
                          <span className="font-mono font-bold">
                            {country.obesityRate != null ? `${country.obesityRate}%` : "N/A"}
                          </span>
                        </div>
                        <div className="h-2 bg-secondary/80 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 rounded-full"
                            style={{ width: `${Math.min(100, ((country.obesityRate ?? 0) / 50) * 100)}%` }}
                          />
                        </div>
                      </div>

                      {regObesity != null && (
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-cyan-400 font-semibold">{country.region} Avg</span>
                            <span className="font-mono font-bold">{regObesity}%</span>
                          </div>
                          <div className="h-2 bg-secondary/80 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-cyan-400 rounded-full"
                              style={{ width: `${Math.min(100, (regObesity / 50) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {globObesity != null && (
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-indigo-400 font-semibold">Global Median</span>
                            <span className="font-mono font-bold">{globObesity}%</span>
                          </div>
                          <div className="h-2 bg-secondary/80 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-400 rounded-full"
                              style={{ width: `${Math.min(100, (globObesity / 50) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </MetricCard>

                  {/* Life Expectancy Comparison */}
                  <MetricCard
                    label="Female Life Expectancy Comparison"
                    metricKey="femaleLifeExpectancy"
                    activeSortKey={activeSortKey}
                    onSelectMetric={onSelectMetric}
                    onOpenHelp={setActiveHelpKey}
                    icon={Heart}
                  >
                    <div className="space-y-2 text-xs">
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-emerald-400 font-semibold">{country.name}</span>
                          <span className="font-mono font-bold">
                            {physicalStats.lifeExpectancy.female} yrs
                          </span>
                        </div>
                        <div className="h-2 bg-secondary/80 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                (physicalStats.lifeExpectancy.female / 90) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      {regLifeExp != null && (
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-cyan-400 font-semibold">{country.region} Avg</span>
                            <span className="font-mono font-bold">{regLifeExp} yrs</span>
                          </div>
                          <div className="h-2 bg-secondary/80 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-cyan-400 rounded-full"
                              style={{ width: `${Math.min(100, (regLifeExp / 90) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {globLifeExp != null && (
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-indigo-400 font-semibold">Global Median</span>
                            <span className="font-mono font-bold">{globLifeExp} yrs</span>
                          </div>
                          <div className="h-2 bg-secondary/80 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-400 rounded-full"
                              style={{ width: `${Math.min(100, (globLifeExp / 90) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </MetricCard>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* ── 5. Bottom Quick Actions ── */}
      <div className="p-3.5 border-t border-border/50 bg-background/50 backdrop-blur-md flex items-center gap-2">
        <Link
          to={`/compare?countries=${country.code}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-xs transition-colors border border-border/40"
        >
          <span>Compare</span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        </Link>

        <Link
          to={`/country/${country.code}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-lg transition-colors"
        >
          <span>Full Profile</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Interactive Explanation & How-to-Read Modal */}
      <MetricHelpModal
        metricKey={activeHelpKey}
        onClose={() => setActiveHelpKey(null)}
        onSelectMetric={onSelectMetric}
      />
    </aside>
  );
}
