import type { FlipResult, SimulationResults } from '../types';

export const runCoinFlipSimulation = async (
  successProbability: number,
  numFlips: number
): Promise<SimulationResults> => {
  const flips: FlipResult[] = [];
  let successes = 0;
  let fails = 0;

  // Use small chunks to prevent browser freeze (but allow refresh)
  const chunkSize = Math.min(50, Math.max(10, Math.floor(numFlips / 200)));
  
  for (let i = 0; i < numFlips; i += chunkSize) {
    // Process chunk
    const endIndex = Math.min(i + chunkSize, numFlips);
    
    for (let j = i; j < endIndex; j++) {
      const random = Math.random() * 100;
      const isSuccess = random < successProbability;
      
      flips.push({
        result: isSuccess ? 'Success' : 'Fail',
        isSuccess: isSuccess
      });

      if (isSuccess) {
        successes++;
      } else {
        fails++;
      }
    }

    // Always yield control to keep browser responsive enough for refresh
    await new Promise(resolve => setTimeout(resolve, 2));
  }

  return { successes, fails, flips };
};

export const validateProbabilities = (
  successProbability: number,
  failProbability: number
): boolean => {
  return successProbability + failProbability === 100;
}; 