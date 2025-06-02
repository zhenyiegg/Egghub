import { useState } from 'react';
import type { SimulationResults } from '../types';
import { runCoinFlipSimulation, validateProbabilities } from '../utils/simulation';

export const useProbabilitySimulation = () => {
  const [successProbability, setSuccessProbability] = useState(50);
  const [failProbability, setFailProbability] = useState(50);
  const [trialMode, setTrialMode] = useState<'single' | 'multiple'>('single');
  const [numFlips, setNumFlips] = useState(100);
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  // Update fail probability when success probability changes
  const handleSuccessChange = (value: number) => {
    if (value >= 0 && value <= 100) {
      setSuccessProbability(value);
      setFailProbability(100 - value);
    }
  };

  // Update success probability when fail probability changes
  const handleFailChange = (value: number) => {
    if (value >= 0 && value <= 100) {
      setFailProbability(value);
      setSuccessProbability(100 - value);
    }
  };

  // Handle trial mode toggle
  const handleTrialModeChange = (mode: 'single' | 'multiple') => {
    setTrialMode(mode);
    // Reset results when changing mode
    setResults(null);
  };

  // Get effective number of flips based on mode
  const getEffectiveNumFlips = () => {
    return trialMode === 'single' ? 1 : numFlips;
  };

  // Run the simulation
  const runSimulation = async () => {
    if (!validateProbabilities(successProbability, failProbability)) {
      return;
    }

    const effectiveFlips = getEffectiveNumFlips();
    
    // Warn user about very large simulations
    if (effectiveFlips > 50000) {
      const proceed = confirm(`Running ${effectiveFlips.toLocaleString()} trials may take a while. You can refresh the page to reset if needed. Continue?`);
      if (!proceed) return;
    }

    setIsRunning(true);
    
    try {
      // Give the UI time to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const simulationResults = await runCoinFlipSimulation(
        successProbability, 
        effectiveFlips
      );
      
      setResults(simulationResults);
    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  // Check if settings are valid
  const isValidSettings = validateProbabilities(successProbability, failProbability);

  return {
    // State
    successProbability,
    failProbability,
    trialMode,
    numFlips,
    results,
    isRunning,
    isValidSettings,
    
    // Computed
    effectiveNumFlips: getEffectiveNumFlips(),
    
    // Actions
    handleSuccessChange,
    handleFailChange,
    handleTrialModeChange,
    setNumFlips,
    runSimulation,
  };
}; 