import { Button } from "@/components/ui/button";
import backgroundImage from "../assets/background2.png";
import loadingGif from "../assets/loading.gif";
import Navbar from "../components/Navbar";
import { useProbabilitySimulation } from "../features/probability";

const Probability = () => {
  const {
    successProbability,
    failProbability,
    trialMode,
    numFlips,
    results,
    isRunning,
    isValidSettings,
    effectiveNumFlips,
    handleSuccessChange,
    handleFailChange,
    handleTrialModeChange,
    setNumFlips,
    runSimulation,
  } = useProbabilitySimulation();

  return (
    <div 
      className="min-h-screen bg-cover bg-no-repeat sm:bg-cover md:bg-cover lg:bg-cover xl:bg-cover 2xl:bg-cover bg-fixed sm:bg-scroll md:bg-fixed lg:bg-fixed xl:bg-fixed 2xl:bg-fixed md:bg-center lg:bg-center xl:bg-center 2xl:bg-center [background-position:90%_center]" 
      style={{ 
        backgroundImage: `url(${backgroundImage})`
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-3 sm:px-5 lg:px-7 xl:px-10 2xl:px-14 py-7 lg:py-10">
        <div className="space-y-5 lg:space-y-7">
          {/* Page Title */}
          <div className="text-center">
            <h1 className="text-lg lg:text-xl font-bold text-orange-600">
              Probability Trial
            </h1>
          </div>

          {/* Settings Section */}
          <div className="bg-white/90 rounded-3xl border-4 border-white p-3 lg:p-5 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
              {/* Success Probability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Success Probability (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={successProbability}
                  onChange={(e) => handleSuccessChange(Number(e.target.value))}
                  className="w-full px-2 py-1 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-sm"
                />
              </div>

              {/* Fail Probability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fail Probability (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={failProbability}
                  onChange={(e) => handleFailChange(Number(e.target.value))}
                  className="w-full px-2 py-1 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-sm"
                />
              </div>

              {/* Trial Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trial Mode
                </label>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => handleTrialModeChange('single')}
                    className={`flex-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                      trialMode === 'single'
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Single
                  </button>
                  <button
                    onClick={() => handleTrialModeChange('multiple')}
                    className={`flex-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                      trialMode === 'multiple'
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Multiple
                  </button>
                </div>
              </div>

              {/* Number of Trials - Shows when Multiple is selected */}
              <div className={`${trialMode === 'single' ? 'invisible' : ''}`}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Trials
                </label>
                <input
                  type="number"
                  min="1"
                  max="100000"
                  value={numFlips}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    // Limit to reasonable maximum to prevent crashes
                    if (value <= 100000) {
                      setNumFlips(value);
                    }
                  }}
                  disabled={trialMode === 'single'}
                  className="w-full px-2 py-1 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                {trialMode === 'multiple' && numFlips > 10000 && (
                  <p className="text-xs text-amber-600 mt-1">
                    ⚠️ Large numbers may take longer to process
                  </p>
                )}
              </div>
            </div>

            {/* Probability Validation */}
            {!isValidSettings && (
              <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-red-600 text-center text-sm">
                  Warning: Probabilities must add up to 100%
                </p>
              </div>
            )}
          </div>

          {/* Main Content Area - Results */}
          <div className="bg-white/90 rounded-3xl border-4 border-white p-7 lg:p-10 h-[420px] lg:h-[520px] shadow-lg overflow-hidden">
            

            {isRunning && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <img 
                    src={loadingGif} 
                    alt="Loading..." 
                    className="h-28 w-28 lg:h-36 lg:w-36 mx-auto mb-5"
                  />
                  <p className="text-lg lg:text-xl text-gray-600">Loading...</p>
                </div>
              </div>
            )}

            {results && !isRunning && (
              <div className="flex flex-col space-y-5 h-full overflow-y-auto">
                {trialMode === 'single' ? (
                  // Single Trial Result
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className={`inline-flex items-center justify-center w-28 h-28 lg:w-36 lg:h-36 rounded-full mb-5 ${
                        results.flips[0]?.isSuccess 
                          ? 'bg-green-100 border-4 border-green-300' 
                          : 'bg-red-100 border-4 border-red-300'
                      }`}>
                        <span className="text-3xl lg:text-4xl">
                          {results.flips[0]?.isSuccess ? '✅' : '❌'}
                        </span>
                      </div>
                      <h2 className={`text-2xl lg:text-3xl font-bold mb-2 ${
                        results.flips[0]?.isSuccess ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {results.flips[0]?.isSuccess ? 'Success!' : 'Failed!'}
                      </h2>
                    
                    </div>
                  </div>
                ) : (
                  // Multiple Trials Results (existing layout)
                  <>
                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-center flex-shrink-0">
                      <div className="bg-green-100 rounded-lg p-3">
                        <h3 className="text-xl font-bold text-green-600">{results.successes}</h3>
                        <p className="text-green-700 text-sm">Successes</p>
                        <p className="text-xs text-green-600">
                          {((results.successes / effectiveNumFlips) * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="bg-red-100 rounded-lg p-3">
                        <h3 className="text-xl font-bold text-red-600">{results.fails}</h3>
                        <p className="text-red-700 text-sm">Fails</p>
                        <p className="text-xs text-red-600">
                          {((results.fails / effectiveNumFlips) * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="bg-blue-100 rounded-lg p-3">
                        <h3 className="text-xl font-bold text-blue-600">{effectiveNumFlips}</h3>
                        <p className="text-blue-700 text-sm">Total Trials</p>
                        <p className="text-xs text-blue-600">100%</p>
                      </div>
                    </div>

                    {/* Detailed Results */}
                    <div className="flex flex-col flex-1 min-h-0">
                      <h3 className="text-lg font-bold text-gray-700 mb-3 flex-shrink-0">Flip Results:</h3>
                      <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-3">
                        <div className="grid grid-cols-10 md:grid-cols-14 lg:grid-cols-18 gap-1">
                          {results.flips.map((flip, index) => (
                            <div
                              key={index}
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                flip.isSuccess ? 'bg-green-500' : 'bg-red-500'
                              }`}
                              title={`Flip ${index + 1}: ${flip.result}`}
                            >
                              {flip.isSuccess ? 'S' : 'F'}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Test Button */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-2">
              <button 
                onClick={runSimulation}
                disabled={isRunning || !isValidSettings}
                className="bg-gradient-to-r from-yellow-100 to-orange-200 rounded-2xl border-3 border-yellow-200 px-5 py-2 shadow-lg hover:from-yellow-200 hover:to-orange-300 hover:scale-105 transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="text-base font-bold text-orange-700 flex items-center gap-2">
                  {isRunning ? '🍳 Running...' : '🐣  Test'}
                </span>
              </button>

              {/* Refresh hint for large simulations */}
              {isRunning && effectiveNumFlips > 5000 && (
                <p className="text-xs text-gray-600 text-center">
                  💡 Tip: Refresh the page to reset if needed
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Probability;
