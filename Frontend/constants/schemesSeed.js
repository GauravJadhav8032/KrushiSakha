export const SCHEMES_SEED = [
  {
    _id: "seed-1",
    name: "PM Kisan Samman Nidhi",
    description: "Income support scheme for eligible farmer families.",
    type: "central",
    state: "",
    category: "Subsidy",
    benefits: [
      "₹6,000 per year in 3 equal installments",
      "Direct benefit transfer to bank account",
    ],
    eligibility: [
      "Small and marginal farmer families",
      "Valid landholding records as per state/UT",
    ],
    documents: ["Aadhaar Card", "Land records", "Bank account details"],
    applicationProcess: [
      "Visit official PM-Kisan portal or CSC center",
      "Complete registration with Aadhaar and land details",
      "Track status online",
    ],
    applyLink: "https://pmkisan.gov.in/",
    tags: ["Income Support", "DBT", "Farmers"],
  },
  {
    _id: "seed-2",
    name: "Pradhan Mantri Fasal Bima Yojana",
    description: "Crop insurance scheme to protect farmers against crop loss.",
    type: "central",
    state: "",
    category: "Crop Insurance",
    benefits: [
      "Low premium rates",
      "Coverage for prevented sowing and post-harvest losses (as applicable)",
    ],
    eligibility: [
      "Farmers growing notified crops in notified areas",
      "Loanee and non-loanee farmers (rules vary by state/season)",
    ],
    documents: ["Aadhaar Card", "Bank passbook", "Land records (as required)"],
    applicationProcess: [
      "Apply through bank/insurance portal/CSC (as per state)",
      "Select season, crop, and plot details",
      "Pay premium and keep acknowledgment",
    ],
    applyLink: "https://pmfby.gov.in/",
    tags: ["Insurance", "Crop Loss", "Risk Management"],
  },
  {
    _id: "seed-3",
    name: "Soil Health Card Scheme",
    description: "Soil testing and recommendations for nutrient management.",
    type: "central",
    state: "",
    category: "Equipment",
    benefits: [
      "Soil test-based fertilizer recommendations",
      "Improved soil health & productivity",
    ],
    eligibility: ["Farmers interested in soil testing"],
    documents: ["Basic farmer details (as required)"],
    applicationProcess: [
      "Contact local agriculture office/Soil testing lab",
      "Submit soil sample",
      "Receive Soil Health Card report",
    ],
    applyLink: "https://soilhealth.dac.gov.in/",
    tags: ["Soil", "Fertilizer", "Productivity"],
  },
  {
    _id: "seed-4",
    name: "Pradhan Mantri Krishi Sinchai Yojana",
    description:
      "Improves irrigation coverage and water-use efficiency in agriculture.",
    type: "central",
    state: "",
    category: "Irrigation",
    benefits: [
      "Subsidy for drip and sprinkler irrigation",
      "Improves water efficiency for crops",
    ],
    eligibility: [
      "Farmers with cultivable land",
      "Eligible for micro-irrigation subsidy through state agriculture departments",
    ],
    documents: ["Aadhaar Card", "Land ownership documents"],
    applicationProcess: [
      "Apply through state agriculture department portal",
      "Submit land details and irrigation plan",
      "Subsidy credited after installation verification",
    ],
    applyLink: "https://pmksy.gov.in/",
    tags: ["Irrigation", "Water Management"],
  },

  {
    _id: "seed-5",
    name: "Kisan Credit Card Scheme",
    description:
      "Provides short-term credit support to farmers for crop production.",
    type: "central",
    state: "",
    category: "Loans",
    benefits: [
      "Credit up to ₹3 lakh for agricultural needs",
      "Interest subsidy for timely repayment",
    ],
    eligibility: [
      "Farmers, sharecroppers, tenant farmers",
      "Self Help Groups engaged in agriculture",
    ],
    documents: ["Aadhaar Card", "Land records", "Bank account details"],
    applicationProcess: [
      "Apply through bank branch or online banking portal",
      "Submit land and crop details",
      "Credit card issued after approval",
    ],
    applyLink: "https://pmkisan.gov.in/",
    tags: ["Credit", "Agriculture Loan"],
  },

  {
    _id: "seed-6",
    name: "Pradhan Mantri Kisan Maan-Dhan Yojana",
    description: "Pension scheme for small and marginal farmers.",
    type: "central",
    state: "",
    category: "Subsidy",
    benefits: [
      "₹3000 monthly pension after age 60",
      "Government contributes equal share to pension fund",
    ],
    eligibility: ["Farmers aged 18–40", "Landholding up to 2 hectares"],
    documents: ["Aadhaar Card", "Bank details", "Land record"],
    applicationProcess: [
      "Register through CSC centers",
      "Submit Aadhaar and bank details",
      "Monthly contribution auto-debited",
    ],
    applyLink: "https://pmkmy.gov.in/",
    tags: ["Pension", "Social Security"],
  },

  {
    _id: "seed-7",
    name: "Agriculture Infrastructure Fund",
    description:
      "Provides financing support for agriculture infrastructure projects.",
    type: "central",
    state: "",
    category: "Loans",
    benefits: [
      "Interest subsidy on loans",
      "Supports warehouses, cold storage, and supply chains",
    ],
    eligibility: [
      "Farmers, FPOs, agri-entrepreneurs",
      "Cooperatives and startups in agriculture",
    ],
    documents: ["Project proposal", "Identity proof"],
    applicationProcess: [
      "Apply through AIF portal",
      "Submit project and financial details",
      "Loan approved through banks",
    ],
    applyLink: "https://agriinfra.dac.gov.in/",
    tags: ["Infrastructure", "Storage"],
  },

  {
    _id: "seed-8",
    name: "Paramparagat Krishi Vikas Yojana",
    description: "Promotes organic farming through cluster-based approach.",
    type: "central",
    state: "",
    category: "Subsidy",
    benefits: [
      "Financial assistance for organic farming",
      "Encourages sustainable agriculture",
    ],
    eligibility: [
      "Farmers willing to adopt organic farming",
      "Cluster-based farming groups",
    ],
    documents: ["Identity proof", "Land records"],
    applicationProcess: [
      "Register through agriculture department",
      "Join organic farming cluster",
      "Receive assistance for inputs and certification",
    ],
    applyLink: "https://pgsindia-ncof.gov.in/",
    tags: ["Organic Farming"],
  },

  {
    _id: "seed-9",
    name: "National Food Security Mission",
    description:
      "Improves production of rice, wheat, pulses, and coarse cereals.",
    type: "central",
    state: "",
    category: "Subsidy",
    benefits: [
      "Improved seeds distribution",
      "Financial assistance for farming equipment",
    ],
    eligibility: [
      "Farmers growing target crops",
      "Priority districts selected by government",
    ],
    documents: ["Aadhaar", "Land documents"],
    applicationProcess: [
      "Apply through district agriculture office",
      "Receive seeds and subsidy benefits",
    ],
    applyLink: "https://nfsm.gov.in/",
    tags: ["Crop Production"],
  },

  {
    _id: "seed-10",
    name: "Sub Mission on Agricultural Mechanization",
    description: "Promotes farm mechanization to increase productivity.",
    type: "central",
    state: "",
    category: "Equipment",
    benefits: ["Subsidy on farm machinery", "Access to custom hiring centers"],
    eligibility: ["Farmers and farmer groups", "Agricultural entrepreneurs"],
    documents: ["Aadhaar", "Land records"],
    applicationProcess: [
      "Apply through agriculture department portal",
      "Choose eligible machinery",
      "Receive subsidy after purchase",
    ],
    applyLink: "https://agrimachinery.nic.in/",
    tags: ["Farm Machinery"],
  },

  {
    _id: "seed-11",
    name: "National Mission on Natural Farming",
    description: "Promotes chemical-free natural farming methods.",
    type: "central",
    state: "",
    category: "Subsidy",
    benefits: [
      "Support for natural farming practices",
      "Training and awareness programs",
    ],
    eligibility: ["Farmers adopting natural farming techniques"],
    documents: ["Identity proof"],
    applicationProcess: [
      "Register with agriculture department",
      "Attend training sessions",
      "Receive assistance and certification",
    ],
    applyLink: "https://naturalfarming.dac.gov.in/",
    tags: ["Natural Farming"],
  },

  {
    _id: "seed-12",
    name: "National Beekeeping and Honey Mission",
    description:
      "Promotes beekeeping as an additional income source for farmers.",
    type: "central",
    state: "",
    category: "Subsidy",
    benefits: [
      "Financial support for beekeeping equipment",
      "Training programs for honey production",
    ],
    eligibility: [
      "Farmers interested in beekeeping",
      "Self-help groups and entrepreneurs",
    ],
    documents: ["Identity proof"],
    applicationProcess: [
      "Apply through agriculture department",
      "Attend training programs",
      "Receive equipment subsidy",
    ],
    applyLink: "https://nbhm.gov.in/",
    tags: ["Beekeeping", "Honey"],
  },

  {
    _id: "seed-13",
    name: "Formation of Farmer Producer Organizations",
    description:
      "Supports formation of farmer producer organizations to improve market access.",
    type: "central",
    state: "",
    category: "Subsidy",
    benefits: [
      "Financial assistance for FPO formation",
      "Better market access and collective selling",
    ],
    eligibility: ["Groups of farmers forming producer organizations"],
    documents: ["Group registration documents"],
    applicationProcess: [
      "Register FPO through government portal",
      "Submit business plan",
      "Receive financial assistance",
    ],
    applyLink: "https://sfacindia.com/",
    tags: ["FPO", "Farmer Groups"],
  },

  {
    _id: "seed-14",
    name: "Digital Agriculture Mission",
    description:
      "Uses digital technologies like AI, data, and mobile apps to support farmers.",
    type: "central",
    state: "",
    category: "Equipment",
    benefits: [
      "Digital crop monitoring",
      "Better market connections and advisory services",
    ],
    eligibility: ["Farmers registered on agriculture digital platforms"],
    documents: ["Identity proof"],
    applicationProcess: [
      "Register on government agriculture digital platforms",
    ],
    applyLink: "https://agriwelfare.gov.in/",
    tags: ["Digital Agriculture"],
  },
  {
    _id: "seed-15",
    name: "Mukhyamantri Krushi Pump Yojana",
    description:
      "Subsidy scheme for farmers to install solar agricultural pumps in Maharashtra.",
    type: "state",
    state: "maharashtra",
    category: "Equipment",
    benefits: [
      "Up to 90% subsidy on solar pump installation",
      "Reduces electricity cost for irrigation",
    ],
    eligibility: ["Farmers in Maharashtra", "Land ownership required"],
    documents: ["Aadhaar Card", "Land records", "Bank details"],
    applicationProcess: [
      "Apply through Mahadiscom portal",
      "Upload required documents",
      "Subsidy provided after installation verification",
    ],
    applyLink: "https://www.mahadiscom.in/",
    tags: ["Solar Pump", "Irrigation"],
  },

  {
    _id: "seed-16",
    name: "Mahatma Jyotirao Phule Shetkari Karj Mukti Yojana",
    description: "Loan waiver scheme for eligible farmers in Maharashtra.",
    type: "state",
    state: "maharashtra",
    category: "Loans",
    benefits: [
      "Loan waiver for eligible farmers",
      "Financial relief for small farmers",
    ],
    eligibility: [
      "Farmers with crop loans from eligible banks",
      "Residents of Maharashtra",
    ],
    documents: ["Aadhaar Card", "Loan documents", "Bank passbook"],
    applicationProcess: [
      "Apply through Maharashtra government portal",
      "Verify loan details",
      "Loan waiver processed by government",
    ],
    applyLink: "https://mahadbt.maharashtra.gov.in/",
    tags: ["Loan Waiver"],
  },

  {
    _id: "seed-17",
    name: "Drip Irrigation Subsidy Scheme (Maharashtra)",
    description:
      "Subsidy for drip irrigation systems to improve water efficiency.",
    type: "state",
    state: "maharashtra",
    category: "Irrigation",
    benefits: ["Subsidy for drip irrigation systems", "Helps conserve water"],
    eligibility: ["Farmers in Maharashtra", "Must own agricultural land"],
    documents: ["Aadhaar Card", "Land ownership documents"],
    applicationProcess: [
      "Apply through MahaDBT portal",
      "Submit irrigation system proposal",
      "Subsidy granted after installation",
    ],
    applyLink: "https://mahadbt.maharashtra.gov.in/",
    tags: ["Drip Irrigation", "Water Saving"],
  },

  {
    _id: "seed-18",
    name: "Baliraja Jal Sanjeevani Yojana",
    description:
      "Water conservation scheme for farmers in drought-prone regions of Maharashtra.",
    type: "state",
    state: "maharashtra",
    category: "Irrigation",
    benefits: [
      "Support for water conservation projects",
      "Improves irrigation availability",
    ],
    eligibility: ["Farmers in drought-prone areas of Maharashtra"],
    documents: ["Identity proof", "Land documents"],
    applicationProcess: [
      "Apply through local agriculture department",
      "Water conservation structures installed",
    ],
    applyLink: "https://agri.maharashtra.gov.in/",
    tags: ["Water Conservation"],
  },

  {
    _id: "seed-19",
    name: "Rajya Krushi Yantrikikaran Yojana",
    description: "Subsidy scheme for purchasing farm machinery in Maharashtra.",
    type: "state",
    state: "maharashtra",
    category: "Equipment",
    benefits: [
      "Subsidy on tractors and agricultural machinery",
      "Improves farm productivity",
    ],
    eligibility: ["Farmers in Maharashtra"],
    documents: ["Aadhaar Card", "Land documents"],
    applicationProcess: [
      "Apply through MahaDBT portal",
      "Select eligible machinery",
      "Receive subsidy after purchase",
    ],
    applyLink: "https://mahadbt.maharashtra.gov.in/",
    tags: ["Farm Machinery"],
  },

  {
    _id: "seed-20",
    name: "Pandit Dindayal Upadhyay Krishi Sanjeevani Yojana",
    description:
      "Climate-resilient agriculture scheme for farmers in Maharashtra.",
    type: "state",
    state: "maharashtra",
    category: "Subsidy",
    benefits: [
      "Support for climate-resilient farming practices",
      "Financial assistance for sustainable agriculture",
    ],
    eligibility: ["Farmers in selected districts of Maharashtra"],
    documents: ["Aadhaar", "Land records"],
    applicationProcess: [
      "Register with agriculture department",
      "Participate in climate-resilient farming programs",
    ],
    applyLink: "https://agri.maharashtra.gov.in/",
    tags: ["Climate Agriculture"],
  },

  {
    _id: "seed-21",
    name: "Maharashtra Beekeeping Promotion Scheme",
    description: "Encourages beekeeping as an additional income source.",
    type: "state",
    state: "maharashtra",
    category: "Subsidy",
    benefits: [
      "Financial support for beekeeping equipment",
      "Training programs",
    ],
    eligibility: ["Farmers interested in beekeeping"],
    documents: ["Identity proof"],
    applicationProcess: [
      "Apply through agriculture department",
      "Attend training programs",
    ],
    applyLink: "https://agri.maharashtra.gov.in/",
    tags: ["Beekeeping"],
  },

  {
    _id: "seed-22",
    name: "Maharashtra Crop Assistance Scheme",
    description: "Provides financial support to farmers affected by crop loss.",
    type: "state",
    state: "maharashtra",
    category: "Crop Insurance",
    benefits: ["Compensation for crop loss due to natural disasters"],
    eligibility: ["Farmers affected by crop damage"],
    documents: ["Aadhaar", "Land records"],
    applicationProcess: [
      "Report crop damage to local agriculture office",
      "Verification by authorities",
      "Compensation credited to bank account",
    ],
    applyLink: "https://mahadbt.maharashtra.gov.in/",
    tags: ["Crop Loss", "Compensation"],
  },
];
