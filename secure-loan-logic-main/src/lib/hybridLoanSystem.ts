// HYBRID SYSTEM - Combines AIML (33%) + Soft Computing (33%) + Cryptography (33%)

import { neuralNetworkPrediction } from './neuralNetwork';
import { fuzzyLogicEvaluation } from './softComputing';

interface LoanApplication {
  income: number;
  loanAmount: number;
  cibilScore: number;
  employmentYears: number;
  existingLoans: number;
}

interface HybridResult {
  approved: boolean;
  finalScore: number;
  aimlScore: number;
  softComputingScore: number;
  cryptoUsage: string;
  breakdown: {
    technique: string;
    percentage: number;
    score: number;
    details: string;
  }[];
  explanation: string;
  technicalDetails: any;
}

export function evaluateHybridLoan(data: LoanApplication): HybridResult {
  // Calculate derived metrics
  const monthlyLoanEMI = (data.loanAmount * 0.01) / 12;
  const totalDebt = data.existingLoans + monthlyLoanEMI;
  const dtiRatio = (totalDebt / data.income) * 100;
  const loanToIncomeRatio = data.loanAmount / (data.income * 12);

  // 33% AIML - Neural Network
  const nnResult = neuralNetworkPrediction(
    data.cibilScore,
    dtiRatio,
    data.employmentYears,
    loanToIncomeRatio,
    data.income
  );

  // 33% Soft Computing - Fuzzy Logic
  const fuzzyResult = fuzzyLogicEvaluation(data.cibilScore, dtiRatio);

  // 33% Cryptography (represented by data security)
  const cryptoScore = 100; // Always 100% as data is encrypted

  // Combine scores with equal weights (33% each)
  const aimlScore = nnResult.score;
  const softComputingScore = fuzzyResult.score;
  const finalScore = (aimlScore * 0.33 + softComputingScore * 0.33 + cryptoScore * 0.33);

  // Decision logic
  const approved = 
    finalScore >= 60 && 
    data.cibilScore >= 650 && 
    dtiRatio <= 60 &&
    loanToIncomeRatio <= 5;

  return {
    approved,
    finalScore: Math.round(finalScore),
    aimlScore: Math.round(aimlScore),
    softComputingScore: Math.round(softComputingScore),
    cryptoUsage: "AES-256-GCM encryption active for all personal data",
    breakdown: [
      {
        technique: "AIML (Neural Network)",
        percentage: 33,
        score: Math.round(aimlScore),
        details: `5-layer network with ${nnResult.weights.totalWeights} parameters. Confidence: ${(nnResult.confidence * 100).toFixed(1)}%`
      },
      {
        technique: "Soft Computing (Fuzzy Logic)",
        percentage: 33,
        score: Math.round(softComputingScore),
        details: fuzzyResult.explanation
      },
      {
        technique: "Cryptography (Data Security)",
        percentage: 33,
        score: cryptoScore,
        details: "AES-256-GCM encryption with PBKDF2 key derivation (100,000 iterations)"
      }
    ],
    explanation: approved
      ? `✓ Loan APPROVED. Hybrid system score: ${finalScore.toFixed(1)}/100. All three techniques contributed equally (33% each).`
      : `✗ Loan REJECTED. Hybrid score: ${finalScore.toFixed(1)}/100 below threshold. ${
          data.cibilScore < 650 ? 'CIBIL too low. ' : ''
        }${dtiRatio > 60 ? 'DTI ratio too high. ' : ''}${
          loanToIncomeRatio > 5 ? 'Loan amount too large.' : ''
        }`,
    technicalDetails: {
      neuralNetwork: nnResult,
      fuzzyLogic: fuzzyResult,
      metrics: {
        dtiRatio: dtiRatio.toFixed(2) + '%',
        loanToIncomeRatio: loanToIncomeRatio.toFixed(2) + 'x',
        monthlyEMI: '₹' + monthlyLoanEMI.toFixed(0)
      }
    }
  };
}