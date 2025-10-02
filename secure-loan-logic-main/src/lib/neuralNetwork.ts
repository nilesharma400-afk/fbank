// AIML - NEURAL NETWORK IMPLEMENTATION (33% contribution)

interface NetworkWeights {
  inputToHidden: number[][];
  hiddenToOutput: number[];
  hiddenBias: number[];
  outputBias: number;
}

// Pre-trained neural network weights (simulated training on loan data)
const trainedWeights: NetworkWeights = {
  // 5 inputs x 4 hidden neurons
  inputToHidden: [
    [0.8, -0.5, 0.3, 0.6],   // CIBIL weights
    [-0.6, 0.7, -0.4, 0.5],  // DTI weights
    [0.4, 0.3, 0.8, -0.2],   // Employment years weights
    [-0.5, 0.6, -0.3, 0.7],  // Loan to income weights
    [0.3, -0.4, 0.5, 0.4]    // Income weights
  ],
  // 4 hidden neurons to 1 output
  hiddenToOutput: [0.7, 0.8, -0.6, 0.9],
  hiddenBias: [0.1, -0.2, 0.15, -0.1],
  outputBias: 0.2
};

// Sigmoid activation function
function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

// ReLU activation function
function relu(x: number): number {
  return Math.max(0, x);
}

// Normalize inputs to 0-1 range
function normalizeInputs(
  cibilScore: number,
  dtiRatio: number,
  employmentYears: number,
  loanToIncomeRatio: number,
  income: number
): number[] {
  return [
    (cibilScore - 300) / 600,        // CIBIL: 300-900 → 0-1
    Math.min(dtiRatio / 100, 1),     // DTI: 0-100% → 0-1
    Math.min(employmentYears / 10, 1), // Employment: 0-10 years → 0-1
    Math.min(loanToIncomeRatio / 10, 1), // Loan/Income: 0-10x → 0-1
    Math.min(income / 200000, 1)     // Income: 0-200k → 0-1
  ];
}

export function neuralNetworkPrediction(
  cibilScore: number,
  dtiRatio: number,
  employmentYears: number,
  loanToIncomeRatio: number,
  income: number
) {
  // Normalize inputs
  const inputs = normalizeInputs(cibilScore, dtiRatio, employmentYears, loanToIncomeRatio, income);
  
  // Forward propagation - Input to Hidden Layer
  const hiddenLayer: number[] = [];
  const hiddenActivations: number[] = [];
  
  for (let h = 0; h < 4; h++) {
    let sum = trainedWeights.hiddenBias[h];
    for (let i = 0; i < 5; i++) {
      sum += inputs[i] * trainedWeights.inputToHidden[i][h];
    }
    hiddenLayer.push(sum);
    hiddenActivations.push(relu(sum)); // ReLU activation
  }
  
  // Forward propagation - Hidden to Output Layer
  let outputSum = trainedWeights.outputBias;
  for (let h = 0; h < 4; h++) {
    outputSum += hiddenActivations[h] * trainedWeights.hiddenToOutput[h];
  }
  
  const outputActivation = sigmoid(outputSum); // Sigmoid for 0-1 output
  const neuralScore = outputActivation * 100; // Convert to 0-100 scale
  
  return {
    score: neuralScore,
    confidence: outputActivation,
    hiddenLayerValues: hiddenActivations,
    normalizedInputs: inputs,
    architecture: "5 inputs → 4 hidden neurons (ReLU) → 1 output (Sigmoid)",
    weights: {
      totalWeights: 5 * 4 + 4 + 4 + 1, // 29 trainable parameters
      inputToHidden: trainedWeights.inputToHidden,
      hiddenToOutput: trainedWeights.hiddenToOutput
    }
  };
}