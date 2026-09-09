export interface StateCannabisLaw {
  tier: number; // 4 = Recreational, 3 = Medical, 2 = CBD/Low-THC, 1 = Prohibited
  status: "recreational" | "medical" | "cbd_low_thc" | "prohibited";
  statusLabel: string;
  homeCultivation: boolean;
  decriminalized: boolean;
  summary: string;
}

export interface StateGunLaw {
  score: number; // Giffords 0-100 score
  grade: "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "C-" | "D+" | "D" | "D-" | "F";
  rank: number;
  carryLaw: "Constitutional Carry" | "Shall-Issue";
  backgroundChecks: boolean;
  redFlagLaw: boolean;
  firearmMortalityRate: number; // CDC firearm mortality rate per 100k
  summary: string;
}

export const usStateLaws: Record<string, { cannabis: StateCannabisLaw; gun: StateGunLaw }> = {
  AL: {
    cannabis: {
      tier: 3,
      status: "medical",
      statusLabel: "Medical Only",
      homeCultivation: false,
      decriminalized: false,
      summary: "Medical cannabis authorized under Darren Wesley Ato Hall Compassion Act (2021). Recreational use and home grow prohibited."
    },
    gun: {
      score: 8.5,
      grade: "F",
      rank: 41,
      carryLaw: "Constitutional Carry",
      backgroundChecks: false,
      redFlagLaw: false,
      firearmMortalityRate: 25.5,
      summary: "Permitless concealed carry enacted in 2023. No universal background checks or red flag laws."
    }
  },
  AK: {
    cannabis: {
      tier: 4,
      status: "recreational",
      statusLabel: "Recreational & Medical Legal",
      homeCultivation: true,
      decriminalized: true,
      summary: "Adult-use legalized via Measure 2 (2014). Adults 21+ may possess up to 1 oz and grow up to 6 plants (3 mature)."
    },
    gun: {
      score: 9.5,
      grade: "F",
      rank: 39,
      carryLaw: "Constitutional Carry",
      backgroundChecks: false,
      redFlagLaw: false,
      firearmMortalityRate: 24.5,
      summary: "First state to adopt constitutional permitless carry in 2003. No state background checks or waiting periods."
    }
  },
  AZ: {
    cannabis: {
      tier: 4,
      status: "recreational",
      statusLabel: "Recreational & Medical Legal",
      homeCultivation: true,
      decriminalized: true,
      summary: "Legalized via Proposition 207 (2020). Adults may possess up to 1 oz and cultivate up to 6 plants at home."
    },
    gun: {
      score: 13.5,
      grade: "F",
      rank: 31,
      carryLaw: "Constitutional Carry",
      backgroundChecks: false,
      redFlagLaw: false,
      firearmMortalityRate: 18.3,
      summary: "Constitutional permitless carry since 2010. Minimal state firearm restrictions and no red flag laws."
    }
  },
  AR: {
    cannabis: {
      tier: 3,
      status: "medical",
      statusLabel: "Medical Only",
      homeCultivation: false,
      decriminalized: false,
      summary: "Medical cannabis legalized via Issue 6 (2016). Recreational ballot initiatives rejected; home cultivation prohibited."
    },
    gun: {
      score: 4.0,
      grade: "F",
      rank: 50,
      carryLaw: "Constitutional Carry",
      backgroundChecks: false,
      redFlagLaw: false,
      firearmMortalityRate: 22.1,
      summary: "Permitless carry allowed; ranked lowest on Giffords Gun Law Scorecard with virtually no firearm regulations."
    }
  },
  CA: {
    cannabis: {
      tier: 4,
      status: "recreational",
      statusLabel: "Recreational & Medical Legal",
      homeCultivation: true,
      decriminalized: true,
      summary: "Pioneered medical (Prop 215, 1996) and adult-use (Prop 64, 2016). Possession up to 1 oz and home grow up to 6 plants."
    },
    gun: {
      score: 89.5,
      grade: "A",
      rank: 1,
      carryLaw: "Shall-Issue",
      backgroundChecks: true,
      redFlagLaw: true,
      firearmMortalityRate: 8.7,
      summary: "Strictest gun laws in the nation (Giffords #1). Universal background checks, assault weapons ban, and red flag restraining orders."
    }
  },
  CO: {
    cannabis: {
      tier: 4,
      status: "recreational",
      statusLabel: "Recreational & Medical Legal",
      homeCultivation: true,
      decriminalized: true,
      summary: "First state with retail sales under Amendment 64 (2012). Adults 21+ may possess up to 2 oz and cultivate up to 6 plants."
    },
    gun: {
      score: 65.0,
      grade: "B+",
      rank: 11,
      carryLaw: "Shall-Issue",
      backgroundChecks: true,
      redFlagLaw: true,
      firearmMortalityRate: 17.4,
      summary: "Universal background checks, large-capacity magazine limits, red flag extreme risk protection orders, and waiting periods."
    }
  },
  CT: {
    cannabis: {
      tier: 4,
      status: "recreational",
      statusLabel: "Recreational & Medical Legal",
      homeCultivation: true,
      decriminalized: true,
      summary: "Adult-use legalized in 2021 (SB 1201). Possession up to 1.5 oz on person / 5 oz locked, home cultivation up to 6 plants."
    },
    gun: {
      score: 83.0,
      grade: "A",
      rank: 3,
      carryLaw: "Shall-Issue",
      backgroundChecks: true,
      redFlagLaw: true,
      firearmMortalityRate: 6.7,
      summary: "Pioneered nation's first red flag law (1999). Universal background checks, permit-to-purchase, and strict assault weapon restrictions."
    }
  },
  DE: {
    cannabis: {
      tier: 4,
      status: "recreational",
      statusLabel: "Recreational & Medical Legal",
      homeCultivation: false,
      decriminalized: true,
      summary: "Adult-use legalized in 2023 via HB 1 and HB 2. Possession up to 1 oz legal; regulated retail market launching; home grow not allowed."
    },
    gun: {
      score: 61.0,
      grade: "B",
      rank: 13,
      carryLaw: "Shall-Issue",
      backgroundChecks: true,
      redFlagLaw: true,
      firearmMortalityRate: 12.3,
      summary: "Universal background checks required; red flag law and handgun permit requirements in place."
    }
  },
  DC: {
    cannabis: {
      tier: 4,
      status: "recreational",
      statusLabel: "Recreational & Medical Legal",
      homeCultivation: true,
      decriminalized: true,
      summary: "Legalized via Initiative 71 (2014). Possession up to 2 oz and home cultivation up to 6 plants allowed (commercial retail hindered by congressional rider)."
    },
    gun: {
      score: 88.0,
      grade: "A",
      rank: 2,
      carryLaw: "Shall-Issue",
      backgroundChecks: true,
      redFlagLaw: true,
      firearmMortalityRate: 23.9,
      summary: "Comprehensive gun safety laws including registration, universal background checks, red flag laws, and assault weapon prohibitions."
    }
  },
  FL: {
    cannabis: {
      tier: 3,
      status: "medical",
      statusLabel: "Medical Only",
      homeCultivation: false,
      decriminalized: false,
      summary: "Comprehensive medical program approved under Amendment 2 (2016). 2024 recreational amendment received 56% vote, falling short of 60% supermajority threshold."
    },
    gun: {
      score: 19.0,
      grade: "F",
      rank: 26,
      carryLaw: "Constitutional Carry",
      backgroundChecks: false,
      redFlagLaw: true,
      firearmMortalityRate: 14.1,
      summary: "Enacted permitless concealed carry in 2023. Retains post-Parkland Red Flag Risk Protection Orders and minimum purchase age of 21."
    }
  },
  GA: {
    cannabis: {
      tier: 2,
      status: "cbd_low_thc",
      statusLabel: "CBD / Low-THC Only",
      homeCultivation: false,
      decriminalized: false,
      summary: "Haleigh's Hope Act permits registered patients to possess low-THC cannabis oil (up to 5% THC). Recreational use is prohibited."
    },
    gun: {
      score: 13.0,
      grade: "F",
      rank: 32,
      carryLaw: "Constitutional Carry",
      backgroundChecks: false,
      redFlagLaw: false,
      firearmMortalityRate: 17.7,
      summary: "Enacted constitutional permitless carry in 2022. No universal background checks or red flag laws."
    }
  },
  HI: {
    cannabis: {
      tier: 3,
      status: "medical",
      statusLabel: "Medical Only",
      homeCultivation: true,
      decriminalized: true,
      summary: "Medical cannabis legal since 2000; registered patients may cultivate up to 10 plants. Possession up to 3g decriminalized."
    },
    gun: {
      score: 80.0,
      grade: "A",
      rank: 5,
      carryLaw: "Shall-Issue",
      backgroundChecks: true,
      redFlagLaw: true,
      firearmMortalityRate: 4.5,
      summary: "Among the lowest firearm mortality rates in the country. Mandatory registration, permit-to-acquire, and strict storage laws."
    }
  },
  ID: {
    cannabis: {
      tier: 1,
      status: "prohibited",
      statusLabel: "Fully Prohibited",
      homeCultivation: false,
      decriminalized: false,
      summary: "Strict prohibition with zero-tolerance policy for all THC content. No medical or recreational allowance."
    },
    gun: {
      score: 5.0,
      grade: "F",
      rank: 48,
      carryLaw: "Constitutional Carry",
      backgroundChecks: false,
      redFlagLaw: false,
      firearmMortalityRate: 16.3,
      summary: "Permitless carry allowed for residents and non-residents 18+. Virtually no state firearm restrictions."
    }
  },
  IL: {
    cannabis: {
      tier: 4,
      status: "recreational",
      statusLabel: "Recreational & Medical Legal",
      homeCultivation: false,
      decriminalized: true,
      summary: "First state to legalize adult-use sales through legislature (2019). Possession up to 30g legal; home cultivation limited to medical patients (5 plants)."
    },
    gun: {
      score: 76.0,
      grade: "A-",
      rank: 7,
      carryLaw: "Shall-Issue",
      backgroundChecks: true,
      redFlagLaw: true,
      firearmMortalityRate: 14.9,
      summary: "Universal background checks via FOID card system, red flag laws, and Protect Illinois Communities Act assault weapon restrictions."
    }
  },
  IN: {
    cannabis: {
      tier: 2,
      status: "cbd_low_thc",
      statusLabel: "CBD Only",
      homeCultivation: false,
      decriminalized: false,
      summary: "Hemp-derived CBD oil with <0.3% THC is legal. All other forms of medical or recreational cannabis remain illegal."
    },
    gun: {
      score: 17.5,
      grade: "F",
      rank: 27,
      carryLaw: "Constitutional Carry",
      backgroundChecks: false,
      redFlagLaw: true,
      firearmMortalityRate: 17.8,
      summary: "Permitless handgun carry enacted in 2022. Retains Jake Laird Red Flag Law for firearm seizure from dangerous individuals."
    }
  },
  IA: {
    cannabis: {
      tier: 2,
      status: "cbd_low_thc",
      statusLabel: "CBD / Low-THC Medical Only",
      homeCultivation: false,
      decriminalized: false,
      summary: "Medical Cannabidiol program allows low-THC products (up to 4.5g THC per 90 days for qualifying conditions). Recreational use prohibited."
    },
    gun: {
      score: 12.0,
      grade: "F",
      rank: 34,
      carryLaw: "Constitutional Carry",
      backgroundChecks: false,
      redFlagLaw: false,
      firearmMortalityRate: 11.2,
      summary: "Repealed permit-to-purchase and concealed carry permit mandates in 2021; no universal background checks."
    }
  },
  KS: {
    cannabis: {
      tier: 1,
      status: "prohibited",
      statusLabel: "Fully Prohibited",
      homeCultivation: false,
      decriminalized: false,
      summary: "One of only a few states without any medical cannabis program. Only zero-THC CBD is permitted."
    },
    gun: {
      score: 11.0,
      grade: "F",
      rank: 36,
      carryLaw: "Constitutional Carry",
      backgroundChecks: false,
      redFlagLaw: false,
      firearmMortalityRate: 17.3,
      summary: "Constitutional carry enacted in 2015; campus carry allowed; second amendment preemption laws in place."
    }
  },
  KY: {
    cannabis: {
      tier: 3,
      status: "medical",
      statusLabel: "Medical Legal (2025)",
      homeCultivation: false,
      decriminalized: false,
      summary: "Passed SB 47 in 2023 establishing comprehensive medical cannabis licensing and patient access taking full effect in 2025. Recreational illegal."
    },
    gun: {
      score: 9.0,
      grade: "F",
      rank: 40,
      carryLaw: "Constitutional Carry",
      backgroundChecks: false,
      redFlagLaw: false,
      firearmMortalityRate: 19.6,
      summary: "Permitless concealed carry enacted in 2019. No background checks on private transfers or extreme risk laws."
    }
  },
  LA: {
    cannabis: {
      tier: 3,
      status: "medical",
      statusLabel: "Medical Only",
      homeCultivation: false,
      decriminalized: true,
      summary: "Comprehensive medical cannabis available through state pharmacies. Possession of up to 14g decriminalized to a $100 fine."
    },
    gun: {
      score: 7.0,
      grade: "F",
      rank: 44,
      carryLaw: "Constitutional Carry",
      backgroundChecks: false,
      redFlagLaw: false,
      firearmMortalityRate: 28.2,
      summary: "Enacted constitutional permitless carry in 2024 (SB 1). Second highest firearm mortality rate in the nation."
    }
  },
  ME: {
    cannabis: {
      tier: 4,
      status: "recreational",
      statusLabel: "Recreational & Medical Legal",
      homeCultivation: true,
      decriminalized: true,
      summary: "Legalized via Question 1 (2016). Adults 21+ may possess up to 2.5 oz and cultivate up to 3 mature plants."
    },
    gun: {
      score: 27.0,
      grade: "D",
      rank: 22,
      carryLaw: "Constitutional Carry",
      backgroundChecks: false,
      redFlagLaw: false,
      firearmMortalityRate: 12.6,
      summary: "Constitutional permitless carry state with yellow-flag law requiring medical assessment before firearm removal."
    }
  },
  MD: {
    cannabis: {
      tier: 4,
      status: "recreational",
      statusLabel: "Recreational & Medical Legal",
      homeCultivation: true,
      decriminalized: true,
      summary: "Voters approved Question 4 (2022); adult-use sales launched July 2023. Possession up to 1.5 oz and home grow up to 2 plants."
    },
    gun: {
      score: 75.0,
      grade: "A-",
      rank: 8,
      carryLaw: "Shall-Issue",
      backgroundChecks: true,
      redFlagLaw: true,
      firearmMortalityRate: 13.5,
      summary: "Universal background checks, Handgun Qualification License, red flag laws, and Firearm Safety Act restrictions."
    }
  },
  MA: {
    cannabis: {
      tier: 4,
      status: "recreational",
      statusLabel: "Recreational & Medical Legal",
      homeCultivation: true,
      decriminalized: true,
      summary: "Legalized via Question 4 (2016). Adults 21+ may possess up to 1 oz outside / 10 oz at home and cultivate up to 6 plants."
    },
    gun: {
      score: 81.5,
      grade: "A",
      rank: 4,
      carryLaw: "Shall-Issue",
      backgroundChecks: true,
      redFlagLaw: true,
      firearmMortalityRate: 3.7,
      summary: "Lowest firearm mortality rate in the continental US (3.7 per 100k). Stringent licensing, safe storage, and red flag laws."
    }
  },
  MI: {
    cannabis: {
      tier: 4,
      status: "recreational",
      statusLabel: "Recreational & Medical Legal",
      homeCultivation: true,
      decriminalized: true,
      summary: "Legalized via Proposal 1 (2018). Adults may possess up to 2.5 oz and cultivate up to 12 plants at home (one of highest home limits)."
    },
    gun: {
      score: 54.0,
      grade: "B-",
      rank: 15,
      carryLaw: "Shall-Issue",
      backgroundChecks: true,
      redFlagLaw: true,
      firearmMortalityRate: 14.6,
      summary: "Substantially upgraded gun laws in 2023: enacted universal background checks, safe storage laws, and extreme risk protection orders."
    }
  },
  MN: {
    cannabis: {
      tier: 4,
      status: "recreational",
      statusLabel: "Recreational & Medical Legal",
      homeCultivation: true,
      decriminalized: true,
      summary: "HF 100 signed in 2023. Adults may possess up to 2 oz in public / 2 lbs at home and cultivate up to 8 plants (4 mature)."
    },
    gun: {
      score: 47.0,
      grade: "C+",
      rank: 17,
      carryLaw: "Shall-Issue",
      backgroundChecks: true,
      redFlagLaw: true,
      firearmMortalityRate: 9.9,
      summary: "Passed comprehensive gun safety package in 2023 adding universal background checks on private transfers and red flag protection orders."
    }
  },
  MS: {
    cannabis: {
      tier: 3,
      status: "medical",
      statusLabel: "Medical Only",
      homeCultivation: false,
      decriminalized: true,
      summary: "Mississippi Medical Cannabis Act enacted in 2022. First-offense possession up to 30g decriminalized to a fine; recreational sales prohibited."
    },
    gun: {
      score: 5.5,
      grade: "F",
      rank: 47,
      carryLaw: "Constitutional Carry",
      backgroundChecks: false,
      redFlagLaw: false,
      firearmMortalityRate: 29.6,
      summary: "Highest firearm mortality rate in the nation (29.6 per 100k). Constitutional permitless carry and minimal state regulations."
    }
  },
  MO: {
    cannabis: {
      tier: 4,
      status: "recreational",
      statusLabel: "Recreational & Medical Legal",
      homeCultivation: true,
      decriminalized: true,
      summary: "Amendment 3 passed in 2022. Adults may possess up to 3 oz and cultivate up to 6 mature plants with consumer personal registration."
    },
    gun: {
      score: 6.5,
      grade: "F",
      rank: 45,
      carryLaw: "Constitutional Carry",
      backgroundChecks: false,
      redFlagLaw: false,
      firearmMortalityRate: 24.2,
      summary: "Permitless carry since 2017; enacted Second Amendment Preservation Act attempting to nullify federal gun laws."
    }
  },
  MT: {
    cannabis: {
      tier: 4,
      status: "recreational",
      statusLabel: "Recreational & Medical Legal",
      homeCultivation: true,
      decriminalized: true,
      summary: "Initiative 190 passed in 2020. Adults 21+ may possess up to 1 oz and cultivate up to 2 mature plants and 2 seedlings."
    },
    gun: {
      score: 6.0,
      grade: "F",
      rank: 46,
      carryLaw: "Constitutional Carry",
      backgroundChecks: false,
      redFlagLaw: false,
      firearmMortalityRate: 25.1,
      summary: "Constitutional permitless carry and broad campus carry protections with no state background checks on private sales."
    }
  },
  NE: {
    cannabis: {
      tier: 2,
      status: "cbd_low_thc",
      statusLabel: "Decriminalized / Medical Pending",
      homeCultivation: false,
      decriminalized: true,
      summary: "Possession up to 1 oz decriminalized (first offense $300 fine). 2024 medical initiatives 437/438 approved by voters, subject to court appeals."
    },
    gun: {
      score: 25.0,
      grade: "D",
      rank: 23,
      carryLaw: "Constitutional Carry",
      backgroundChecks: false,
      redFlagLaw: false,
      firearmMortalityRate: 11.3,
      summary: "Enacted constitutional permitless carry in 2023 (LB 77), eliminating concealed carry permit requirement."
    }
  },
  NV: {
    cannabis: {
      tier: 4,
      status: "recreational",
      statusLabel: "Recreational & Medical Legal",
      homeCultivation: true,
      decriminalized: true,
      summary: "Question 2 approved in 2016; limits expanded in 2024 to 2.5 oz possession. Home grow permitted if living >25 miles from a dispensary."
    },
    gun: {
      score: 36.0,
      grade: "C-",
      rank: 20,
      carryLaw: "Shall-Issue",
      backgroundChecks: true,
      redFlagLaw: true,
      firearmMortalityRate: 19.5,
      summary: "Requires universal background checks on all firearm transfers and enforces Extreme Risk Protection Orders."
    }
  },
  NH: {
    cannabis: {
      tier: 3,
      status: "medical",
      statusLabel: "Medical Only",
      homeCultivation: false,
      decriminalized: true,
      summary: "Comprehensive medical program legal since 2013. Possession of up to 3/4 oz decriminalized to a civil forfeiture."
    },
    gun: {
      score: 16.5,
      grade: "F",
      rank: 28,
      carryLaw: "Constitutional Carry",
      backgroundChecks: false,
      redFlagLaw: false,
      firearmMortalityRate: 8.9,
      summary: "Constitutional permitless carry enacted in 2017. Low violent crime and low gun mortality despite permissive laws."
    }
  },
  NJ: {
    cannabis: {
      tier: 4,
      status: "recreational",
      statusLabel: "Recreational & Medical Legal",
      homeCultivation: false,
      decriminalized: true,
      summary: "Legalized via 2020 ballot question and CREAMMA (2021). Adults may possess up to 6 oz; home cultivation is prohibited."
    },
    gun: {
      score: 84.5,
      grade: "A",
      rank: 2,
      carryLaw: "Shall-Issue",
      backgroundChecks: true,
      redFlagLaw: true,
      firearmMortalityRate: 4.7,
      summary: "Ranked #2 on Giffords Gun Law Scorecard. Universal background checks, permit-to-purchase, extreme risk orders, and magazine limits."
    }
  },
  NM: {
    cannabis: {
      tier: 4,
      status: "recreational",
      statusLabel: "Recreational & Medical Legal",
      homeCultivation: true,
      decriminalized: true,
      summary: "Cannabis Regulation Act signed in 2021. Adults may possess up to 2 oz and grow up to 6 mature plants (12 per household)."
    },
    gun: {
      score: 39.0,
      grade: "C",
      rank: 19,
      carryLaw: "Shall-Issue",
      backgroundChecks: true,
      redFlagLaw: true,
      firearmMortalityRate: 27.3,
      summary: "Requires background checks on private sales and enforces Extreme Risk Firearm Orders, but has high gun mortality (27.3 per 100k)."
    }
  },
  NY: {
    cannabis: {
      tier: 4,
      status: "recreational",
      statusLabel: "Recreational & Medical Legal",
      homeCultivation: true,
      decriminalized: true,
      summary: "MRTA signed in 2021. Adults 21+ may possess up to 3 oz on person / 5 lbs at home and cultivate up to 6 plants (3 mature)."
    },
    gun: {
      score: 79.5,
      grade: "A",
      rank: 6,
      carryLaw: "Shall-Issue",
      backgroundChecks: true,
      redFlagLaw: true,
      firearmMortalityRate: 5.4,
      summary: "SAFE Act and Concealed Carry Improvement Act mandate background checks for firearms and ammunition, red flag orders, and licensing."
    }
  },
  NC: {
    cannabis: {
      tier: 2,
      status: "cbd_low_thc",
      statusLabel: "CBD / Low-THC & Decrim",
      homeCultivation: false,
      decriminalized: true,
      summary: "Possession of up to 0.5 oz decriminalized (class 3 misdemeanor, no jail). Epilepsy Low-THC extract permitted; broad medical pending."
    },
    gun: {
      score: 24.0,
      grade: "D",
      rank: 24,
      carryLaw: "Shall-Issue",
      backgroundChecks: false,
      redFlagLaw: false,
      firearmMortalityRate: 16.9,
      summary: "State legislature overrode governor veto in 2023 to repeal the historic pistol purchase permit background check requirement."
    }
  },
  ND: {
    cannabis: {
      tier: 3,
      status: "medical",
      statusLabel: "Medical Only",
      homeCultivation: false,
      decriminalized: true,
      summary: "Medical cannabis approved via Measure 5 (2016). Possession up to 0.5 oz decriminalized to an infraction; 2024 recreational initiative rejected."
    },
    gun: {
      score: 12.5,
      grade: "F",
      rank: 33,
      carryLaw: "Constitutional Carry",
      backgroundChecks: false,
      redFlagLaw: false,
      firearmMortalityRate: 15.8,
      summary: "Constitutional carry for residents and non-residents; no background check on private sales."
    }
  },
  OH: {
    cannabis: {
      tier: 4,
      status: "recreational",
      statusLabel: "Recreational & Medical Legal",
      homeCultivation: true,
      decriminalized: true,
      summary: "Issue 2 passed November 2023. Adults may possess up to 2.5 oz and cultivate up to 6 plants (12 per household); retail sales launched 2024."
    },
    gun: {
      score: 21.0,
      grade: "D-",
      rank: 25,
      carryLaw: "Constitutional Carry",
      backgroundChecks: false,
      redFlagLaw: false,
      firearmMortalityRate: 15.8,
      summary: "Enacted permitless concealed carry in 2022; repealed duty to inform police immediately upon stop."
    }
  },
  OK: {
    cannabis: {
      tier: 3,
      status: "medical",
      statusLabel: "Medical Only",
      homeCultivation: true,
      decriminalized: false,
      summary: "SQ 788 approved in 2018 establishing one of the highest per-capita medical cannabis markets. Home grow allowed for patients (6 mature). Recreational rejected."
    },
    gun: {
      score: 7.5,
      grade: "F",
      rank: 43,
      carryLaw: "Constitutional Carry",
      backgroundChecks: false,
      redFlagLaw: false,
      firearmMortalityRate: 21.2,
      summary: "First state to enact an anti-red flag preemption statute prohibiting local extreme risk firearm seizure laws. Permitless carry legal."
    }
  },
  OR: {
    cannabis: {
      tier: 4,
      status: "recreational",
      statusLabel: "Recreational & Medical Legal",
      homeCultivation: true,
      decriminalized: true,
      summary: "Measure 91 approved in 2014. Adults 21+ may possess up to 2 oz in public / 8 oz at home and cultivate up to 4 plants."
    },
    gun: {
      score: 63.0,
      grade: "B",
      rank: 12,
      carryLaw: "Shall-Issue",
      backgroundChecks: true,
      redFlagLaw: true,
      firearmMortalityRate: 14.9,
      summary: "Universal background checks required; red flag laws active; Measure 114 permit-to-purchase subject to state court litigation."
    }
  },
  PA: {
    cannabis: {
      tier: 3,
      status: "medical",
      statusLabel: "Medical Only",
      homeCultivation: false,
      decriminalized: false,
      summary: "Act 16 enacted in 2016 establishing medical marijuana program. Several major cities (Philadelphia, Pittsburgh) decriminalized; recreational pending."
    },
    gun: {
      score: 41.0,
      grade: "C",
      rank: 18,
      carryLaw: "Shall-Issue",
      backgroundChecks: true,
      redFlagLaw: false,
      firearmMortalityRate: 13.9,
      summary: "Universal background checks required for handgun purchases; shall-issue concealed carry permits; no statewide red flag law."
    }
  },
  RI: {
    cannabis: {
      tier: 4,
      status: "recreational",
      statusLabel: "Recreational & Medical Legal",
      homeCultivation: true,
      decriminalized: true,
      summary: "Rhode Island Cannabis Act signed in 2022. Adults may possess up to 1 oz in public / 10 oz at home and cultivate up to 3 mature plants."
    },
    gun: {
      score: 68.0,
      grade: "B+",
      rank: 10,
      carryLaw: "Shall-Issue",
      backgroundChecks: true,
      redFlagLaw: true,
      firearmMortalityRate: 4.6,
      summary: "7-day waiting period, red flag laws, universal background checks, and prohibition on high-capacity feeding devices."
    }
  },
  SC: {
    cannabis: {
      tier: 2,
      status: "cbd_low_thc",
      statusLabel: "CBD / Low-THC Only",
      homeCultivation: false,
      decriminalized: false,
      summary: "Julian's Law allows registered severe epilepsy patients access to low-THC CBD oil. Recreational and broad medical prohibited."
    },
    gun: {
      score: 15.5,
      grade: "F",
      rank: 29,
      carryLaw: "Constitutional Carry",
      backgroundChecks: false,
      redFlagLaw: false,
      firearmMortalityRate: 22.4,
      summary: "Enacted constitutional permitless carry in March 2024 (H 3594). No background checks on private firearm sales."
    }
  },
  SD: {
    cannabis: {
      tier: 3,
      status: "medical",
      statusLabel: "Medical Only",
      homeCultivation: true,
      decriminalized: false,
      summary: "Medical cannabis approved via IM 26 in 2020 (registered patients may cultivate 2 plants). Recreational ballot initiatives rejected in 2022 and 2024."
    },
    gun: {
      score: 8.0,
      grade: "F",
      rank: 42,
      carryLaw: "Constitutional Carry",
      backgroundChecks: false,
      redFlagLaw: false,
      firearmMortalityRate: 14.3,
      summary: "Constitutional permitless carry enacted in 2019; no permit or background check required for concealed carry."
    }
  },
  TN: {
    cannabis: {
      tier: 2,
      status: "cbd_low_thc",
      statusLabel: "CBD / Low-THC Only",
      homeCultivation: false,
      decriminalized: false,
      summary: "Allows low-THC oil (<0.9% THC) for certain severe intractable medical conditions. All other cannabis prohibited."
    },
    gun: {
      score: 10.0,
      grade: "F",
      rank: 38,
      carryLaw: "Constitutional Carry",
      backgroundChecks: false,
      redFlagLaw: false,
      firearmMortalityRate: 20.9,
      summary: "Enacted permitless handgun carry in 2021 for adults 21+. No background checks for private transfers."
    }
  },
  TX: {
    cannabis: {
      tier: 2,
      status: "cbd_low_thc",
      statusLabel: "CBD / Low-THC Only",
      homeCultivation: false,
      decriminalized: false,
      summary: "Compassionate Use Program allows low-THC cannabis (up to 1% THC by weight) for specific qualifying conditions. Recreational prohibited."
    },
    gun: {
      score: 10.5,
      grade: "F",
      rank: 37,
      carryLaw: "Constitutional Carry",
      backgroundChecks: false,
      redFlagLaw: false,
      firearmMortalityRate: 15.6,
      summary: "Enacted constitutional permitless carry in 2021 (HB 1927). Broad firearms protection and preemption of local ordinances."
    }
  },
  UT: {
    cannabis: {
      tier: 3,
      status: "medical",
      statusLabel: "Medical Only",
      homeCultivation: false,
      decriminalized: false,
      summary: "Proposition 2 approved in 2018 creating state medical cannabis pharmacy network. Recreational use and home cultivation prohibited."
    },
    gun: {
      score: 14.5,
      grade: "F",
      rank: 30,
      carryLaw: "Constitutional Carry",
      backgroundChecks: false,
      redFlagLaw: false,
      firearmMortalityRate: 13.8,
      summary: "Constitutional permitless carry enacted in 2021. Concealed carry permits remain available for reciprocity."
    }
  },
  VT: {
    cannabis: {
      tier: 4,
      status: "recreational",
      statusLabel: "Recreational & Medical Legal",
      homeCultivation: true,
      decriminalized: true,
      summary: "First state to legalize adult-use possession via legislature (2018); retail sales launched 2022. Adults may cultivate up to 2 mature / 4 immature plants."
    },
    gun: {
      score: 56.0,
      grade: "B-",
      rank: 14,
      carryLaw: "Constitutional Carry",
      backgroundChecks: true,
      redFlagLaw: true,
      firearmMortalityRate: 11.9,
      summary: "Historical home of permitless carry, but enacted universal background checks on private sales, red flag laws, and magazine capacity limits in 2018."
    }
  },
  VA: {
    cannabis: {
      tier: 4,
      status: "recreational",
      statusLabel: "Recreational & Medical Legal",
      homeCultivation: true,
      decriminalized: true,
      summary: "Adult-use possession and home cultivation (up to 4 plants) legalized in 2021 (SB 1406). Commercial retail dispensary framework pending."
    },
    gun: {
      score: 52.0,
      grade: "B-",
      rank: 16,
      carryLaw: "Shall-Issue",
      backgroundChecks: true,
      redFlagLaw: true,
      firearmMortalityRate: 13.8,
      summary: "Enacted universal background checks, one-handgun-a-month purchase limit, and Extreme Risk Protective Orders in 2020."
    }
  },
  WA: {
    cannabis: {
      tier: 4,
      status: "recreational",
      statusLabel: "Recreational & Medical Legal",
      homeCultivation: false,
      decriminalized: true,
      summary: "Pioneered adult-use with I-502 (2012). Adults 21+ may purchase up to 1 oz; home grow reserved for registered medical patients."
    },
    gun: {
      score: 74.0,
      grade: "A-",
      rank: 9,
      carryLaw: "Shall-Issue",
      backgroundChecks: true,
      redFlagLaw: true,
      firearmMortalityRate: 11.2,
      summary: "Universal background checks, red flag laws, 10-day waiting periods, and enacted comprehensive assault weapon sales ban in 2023."
    }
  },
  WV: {
    cannabis: {
      tier: 3,
      status: "medical",
      statusLabel: "Medical Only",
      homeCultivation: false,
      decriminalized: false,
      summary: "Medical Cannabis Act enacted in 2017 (pills, oils, tinctures, flower). Recreational use and home cultivation remain prohibited."
    },
    gun: {
      score: 11.5,
      grade: "F",
      rank: 35,
      carryLaw: "Constitutional Carry",
      backgroundChecks: false,
      redFlagLaw: false,
      firearmMortalityRate: 17.3,
      summary: "Permitless concealed carry enacted in 2016. No state background check requirements for private transactions."
    }
  },
  WI: {
    cannabis: {
      tier: 2,
      status: "cbd_low_thc",
      statusLabel: "CBD Only",
      homeCultivation: false,
      decriminalized: false,
      summary: "Lydia's Law allows CBD oil possession for seizure disorders. Recreational and comprehensive medical cannabis remain prohibited."
    },
    gun: {
      score: 31.0,
      grade: "D+",
      rank: 21,
      carryLaw: "Shall-Issue",
      backgroundChecks: false,
      redFlagLaw: false,
      firearmMortalityRate: 13.5,
      summary: "Requires 48-hour handgun waiting period repealed in 2015; shall-issue concealed carry permits; no universal background checks."
    }
  },
  WY: {
    cannabis: {
      tier: 2,
      status: "cbd_low_thc",
      statusLabel: "CBD Only",
      homeCultivation: false,
      decriminalized: false,
      summary: "Enacted hemp and low-THC CBD extract exemptions. Penalties remain strict for flower and other THC cannabis forms."
    },
    gun: {
      score: 4.5,
      grade: "F",
      rank: 49,
      carryLaw: "Constitutional Carry",
      backgroundChecks: false,
      redFlagLaw: false,
      firearmMortalityRate: 26.1,
      summary: "Constitutional permitless carry for residents and non-residents. Minimal restrictions and high firearm ownership / suicide mortality."
    }
  }
};
