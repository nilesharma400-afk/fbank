// SOFT COMPUTING - FUZZY LOGIC SYSTEM (33% contribution)

interface FuzzySet {
  label: string;
  membership: (value: number) => number;
}

// Fuzzy membership functions for CIBIL Score
const cibilFuzzySets: FuzzySet[] = [
  {
    label: "Poor",
    membership: (score) => {
      if (score <= 550) return 1;
      if (score <= 650) return (650 - score) / 100;
      return 0;
    }
  },
  {
    label: "Fair",
    membership: (score) => {
      if (score <= 550) return 0;
      if (score <= 650) return (score - 550) / 100;
      if (score <= 700) return 1;
      if (score <= 750) return (750 - score) / 50;
      return 0;
    }
  },
  {
    label: "Good",
    membership: (score) => {
      if (score <= 700) return 0;
      if (score <= 750) return (score - 700) / 50;
      if (score <= 800) return 1;
      if (score <= 850) return (850 - score) / 50;
      return 0;
    }
  },
  {
    label: "Excellent",
    membership: (score) => {
      if (score <= 800) return 0;
      if (score <= 900) return (score - 800) / 100;
      return 1;
    }
  }
];

// Fuzzy membership functions for Debt-to-Income Ratio
const dtiRatioFuzzySets: FuzzySet[] = [
  {
    label: "Low",
    membership: (ratio) => {
      if (ratio <= 30) return 1;
      if (ratio <= 40) return (40 - ratio) / 10;
      return 0;
    }
  },
  {
    label: "Medium",
    membership: (ratio) => {
      if (ratio <= 30) return 0;
      if (ratio <= 40) return (ratio - 30) / 10;
      if (ratio <= 50) return 1;
      if (ratio <= 60) return (60 - ratio) / 10;
      return 0;
    }
  },
  {
    label: "High",
    membership: (ratio) => {
      if (ratio <= 50) return 0;
      if (ratio <= 60) return (ratio - 50) / 10;
      return 1;
    }
  }
];

// Fuzzy rules for loan approval
function applyFuzzyRules(cibilLabel: string, dtiLabel: string): number {
  const rules: { [key: string]: number } = {
    "Excellent-Low": 95,
    "Excellent-Medium": 80,
    "Excellent-High": 60,
    "Good-Low": 85,
    "Good-Medium": 70,
    "Good-High": 45,
    "Fair-Low": 60,
    "Fair-Medium": 40,
    "Fair-High": 20,
    "Poor-Low": 30,
    "Poor-Medium": 15,
    "Poor-High": 5
  };
  
  return rules[`${cibilLabel}-${dtiLabel}`] || 0;
}

export function fuzzyLogicEvaluation(cibilScore: number, dtiRatio: number) {
  // Calculate membership degrees for CIBIL score
  const cibilMemberships = cibilFuzzySets.map(set => ({
    label: set.label,
    degree: set.membership(cibilScore)
  }));
  
  // Calculate membership degrees for DTI ratio
  const dtiMemberships = dtiRatioFuzzySets.map(set => ({
    label: set.label,
    degree: set.membership(dtiRatio)
  }));
  
  // Find dominant fuzzy sets
  const dominantCibil = cibilMemberships.reduce((max, curr) => 
    curr.degree > max.degree ? curr : max
  );
  
  const dominantDTI = dtiMemberships.reduce((max, curr) => 
    curr.degree > max.degree ? curr : max
  );
  
  // Apply fuzzy rules
  const fuzzyScore = applyFuzzyRules(dominantCibil.label, dominantDTI.label);
  
  return {
    score: fuzzyScore,
    cibilFuzzySet: dominantCibil.label,
    dtiFuzzySet: dominantDTI.label,
    cibilMemberships,
    dtiMemberships,
    explanation: `CIBIL classified as "${dominantCibil.label}" (${(dominantCibil.degree * 100).toFixed(1)}% membership), DTI as "${dominantDTI.label}" (${(dominantDTI.degree * 100).toFixed(1)}% membership)`
  };
}