export interface FlipResult {
  result: string;
  isSuccess: boolean;
}

export interface SimulationResults {
  successes: number;
  fails: number;
  flips: FlipResult[];
}

export interface ProbabilitySettings {
  successProbability: number;
  failProbability: number;
  numFlips: number;
} 