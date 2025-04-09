'use client';
import { useEffect, useState } from 'react';
import { XCircle, ArrowRight, Server } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const STAGES = {
  development: {
    name: 'Development',
    url: 'https://carbonaggr-ap04dapnortheast1-ext-1098454081.ap-northeast-1.elb.amazonaws.com'
  },
  staging: {
    name: 'Staging',
    url: 'https://carbonaggr-ap04sapnortheast1-ext-674624425.ap-northeast-1.elb.amazonaws.com'
  },
  acceptance: {
    name: 'Acceptance',
    url: 'https://carbonaggr-ap04aapnortheast1-ext-1272304221.ap-northeast-1.elb.amazonaws.com'
  }
};

const ZoneCheckModal = ({ isOpen, onClose, progress, currentZone, results, isChecking, onStartCheck }) => {
  const [sortedHistogram, setSortedHistogram] = useState([]);
  const [maxCount, setMaxCount] = useState(0);
  const [step, setStep] = useState('environment'); // 'environment', 'checking', 'results'
  const [selectedStage, setSelectedStage] = useState('staging');

  useEffect(() => {
    if (isChecking) {
      setStep('checking');
    } else if (results) {
      setStep('results');
    }
  }, [isChecking, results]);

  useEffect(() => {
    if (results?.histogram) {
      const sortedEntries = Object.entries(results.histogram)
        .sort(([bucketA], [bucketB]) => parseInt(bucketA) - parseInt(bucketB))
        .map(([bucket, count]) => ({ 
          bucket: parseInt(bucket), 
          count,
          label: `${bucket}-${parseInt(bucket) + 49}`
        }));
      
      setSortedHistogram(sortedEntries);
      
      const maxValue = Math.max(...sortedEntries.map(entry => entry.count));
      setMaxCount(maxValue);
    }
  }, [results]);

  const handleStartTest = () => {
    onStartCheck(selectedStage);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? 'visible' : 'invisible'}`}>
      <div className="fixed inset-0 bg-black/50" onClick={!isChecking && step !== 'environment' ? onClose : undefined} />
      
      <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">All Zone Check</h2>
          {step !== 'checking' && (
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <XCircle className="w-6 h-6" />
            </button>
          )}
        </div>
        
        {step === 'environment' && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-blue-700">
                You are about to check carbon intensity data for all zones. This will make API calls to each zone sequentially.
                Please select which environment you want to test against.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium text-gray-700 flex items-center gap-2">
                <Server className="h-4 w-4" /> Select Environment
              </h3>
              
              <div className="grid grid-cols-1 gap-3 mt-2">
                {Object.entries(STAGES).map(([key, stage]) => (
                  <div 
                    key={key}
                    onClick={() => setSelectedStage(key)}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer ${
                      selectedStage === key 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{stage.name}</h4>
                      <p className="text-xs text-gray-500 break-all mt-1">{stage.url}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full ${
                      selectedStage === key ? 'bg-blue-500' : 'border border-gray-300'
                    }`}></div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button 
                onClick={handleStartTest}
                className="flex items-center gap-2"
              >
                Start Test <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        {step === 'checking' && (
          <div className="space-y-4">
            <p className="font-medium">Checking zone: {currentZone}</p>
            <Progress value={progress} className="h-2 w-full" />
            <p className="text-sm text-gray-500">{progress}% complete</p>
            <p className="text-xs text-gray-500">Using environment: {STAGES[selectedStage].name}</p>
          </div>
        )}
        
        {step === 'results' && results && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-3 rounded text-sm text-gray-500 mb-2">
              Test completed using environment: <span className="font-medium">{STAGES[selectedStage].name}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-600 mb-2">API Errors</h3>
                <p className="text-2xl font-bold">{results.errors.length}</p>
                <p className="text-sm text-gray-500">zones</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-600 mb-2">Zero Values</h3>
                <p className="text-2xl font-bold">{results.zeroes.length}</p>
                <p className="text-sm text-gray-500">zones</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-600 mb-2">Valid Data</h3>
                <p className="text-2xl font-bold">{results.values.length}</p>
                <p className="text-sm text-gray-500">zones</p>
              </div>
            </div>
            
            {/* Histogram */}
            {sortedHistogram.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-3">CO2 Intensity Distribution (gCO2eq/kWh)</h3>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-end space-x-2 h-40">
                    {sortedHistogram.map((entry) => (
                      <div 
                        key={entry.bucket} 
                        className="flex flex-col items-center"
                        style={{ width: `${100 / sortedHistogram.length}%` }}
                      >
                        <div 
                          className="w-full bg-blue-500 rounded-t" 
                          style={{ 
                            height: `${(entry.count / maxCount) * 100}%`, 
                            minHeight: '4px'
                          }}
                        />
                        <div className="text-xs mt-1 text-center">{entry.label}</div>
                        <div className="text-xs font-semibold">{entry.count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Error Details */}
            {results.errors.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Error Details</h3>
                <div className="max-h-40 overflow-y-auto border rounded">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {results.errors.map((error, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">{error.zone}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-red-500">{error.error}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Values */}
            {results.values.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Carbon Intensity Values</h3>
                <div className="max-h-40 overflow-y-auto border rounded">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carbon Intensity (gCO2eq/kWh)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {results.values
                        .sort((a, b) => b.intensity - a.intensity)
                        .map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">{item.zone}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{item.intensity}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ZoneCheckModal; 