import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { 
  Factory, 
  Wind, 
  Droplets, 
  Sun, 
  Leaf, 
  Atom, 
  Zap, 
  Battery, 
  AlertCircle,
  Thermometer
} from 'lucide-react';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const ZoneDetails = ({ zone, onClose, carbonIntensityData, powerBreakdownData, isLoading, apiDetails }) => {
  const powerSourceLabels = {
    gas: 'Natural Gas',
    oil: 'Oil',
    coal: 'Coal',
    wind: 'Wind',
    hydro: 'Hydro',
    solar: 'Solar',
    biomass: 'Biomass',
    nuclear: 'Nuclear',
    unknown: 'Unknown',
    geothermal: 'Geothermal',
    'hydro discharge': 'Hydro Discharge',
    'battery discharge': 'Battery Discharge'
  };

  const powerSourceIcons = {
    gas: <Factory className="w-5 h-5" />,
    oil: <Factory className="w-5 h-5" />,
    coal: <Factory className="w-5 h-5" />,
    wind: <Wind className="w-5 h-5" />,
    hydro: <Droplets className="w-5 h-5" />,
    solar: <Sun className="w-5 h-5" />,
    biomass: <Leaf className="w-5 h-5" />,
    nuclear: <Atom className="w-5 h-5" />,
    unknown: <AlertCircle className="w-5 h-5" />,
    geothermal: <Thermometer className="w-5 h-5" />,
    'hydro discharge': <Droplets className="w-5 h-5" />,
    'battery discharge': <Battery className="w-5 h-5" />
  };

  const powerSourceColors = {
    gas: '#FF6B6B',
    oil: '#FF8E53',
    coal: '#4A4A4A',
    wind: '#4ECDC4',
    hydro: '#45B7D1',
    solar: '#FFD93D',
    biomass: '#96CEB4',
    nuclear: '#FF9AA2',
    unknown: '#D3D3D3',
    geothermal: '#FFB347',
    'hydro discharge': '#45B7D1',
    'battery discharge': '#A8E6CF'
  };

  const getChartData = () => {
    if (!powerBreakdownData?.powerConsumptionBreakdown) return null;

    const breakdown = powerBreakdownData.powerConsumptionBreakdown;
    const total = Object.values(breakdown).reduce((sum, value) => sum + (value || 0), 0);
    
    // Sort by value to ensure consistent ordering
    const sortedEntries = Object.entries(breakdown)
      .filter(([_, value]) => value !== undefined && value !== null && value > 0)
      .sort((a, b) => b[1] - a[1]);
    
    return {
      labels: sortedEntries.map(([key]) => powerSourceLabels[key] || key),
      datasets: [{
        data: sortedEntries.map(([_, value]) => value),
        backgroundColor: sortedEntries.map(([key]) => powerSourceColors[key]),
        borderWidth: 1,
        borderColor: '#ffffff',
      }],
      total: total.toFixed(2)
    };
  };

  const chartData = getChartData();

  // Debug logs
  console.log('ZoneDetails rendered with:', { zone, carbonIntensityData, powerBreakdownData, isLoading });

  return (
    <>
      {/* Side Panel - adjusted positioning and height */}
      <div className="fixed right-0 top-[64px] bottom-0 w-1/3 bg-white shadow-xl overflow-y-auto z-50 transform transition-transform">
        <div className="sticky top-0 bg-white border-b z-10">
          <div className="flex justify-between items-center p-4">
            <h2 className="text-2xl font-bold">{zone.zoneName}</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-6">
            {/* Basic Information Skeleton */}
            <section className="bg-gray-50 p-4 rounded-lg">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </section>
            
            {/* Carbon Intensity Skeleton */}
            <section className="bg-gray-50 p-4 rounded-lg">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            </section>
            
            {/* Energy Mix Skeleton */}
            <section className="bg-gray-50 p-4 rounded-lg">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="flex items-center justify-center h-64">
                <div className="h-52 w-52 rounded-full bg-gray-200 animate-pulse"></div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded animate-pulse">
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <section className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Zone:</span> {zone.zoneName}</p>
                  <p>
                    <span className="font-medium">Last Updated:</span>{' '}
                    {powerBreakdownData?.updatedAt ? new Date(powerBreakdownData.updatedAt).toLocaleString() : 'N/A'}
                  </p>
                  <p>
                    <span className="font-medium">Data Time:</span>{' '}
                    {powerBreakdownData?.datetime ? new Date(powerBreakdownData.datetime).toLocaleString() : 'N/A'}
                  </p>
                  <p>
                    <span className="font-medium">Is Estimated:</span>{' '}
                    {powerBreakdownData?.isEstimated !== undefined ? (powerBreakdownData.isEstimated ? 'Yes' : 'No') : 'N/A'}
                  </p>
                </div>
              </section>

              {/* Carbon Intensity */}
              <section className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-500" />
                  Carbon Intensity
                </h3>
                <div className="space-y-2">
                  {carbonIntensityData ? (
                    <p className="text-xl">
                      {carbonIntensityData.carbonIntensity !== undefined ? 
                        `${carbonIntensityData.carbonIntensity} gCO2eq/kWh` : 
                        'N/A'}
                    </p>
                  ) : (
                    <p className="text-gray-500 italic">Carbon intensity data not available</p>
                  )}
                </div>
              </section>

              {/* Energy Mix Breakdown */}
              <section className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Energy Mix Breakdown
                </h3>
                {chartData ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-[55%]">
                        <Pie 
                          data={chartData}
                          options={{
                            maintainAspectRatio: true,
                            plugins: {
                              legend: {
                                display: false
                              },
                              tooltip: {
                                callbacks: {
                                  label: (context) => {
                                    const value = context.raw;
                                    const total = parseFloat(chartData.total);
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return `${context.label}: ${value.toFixed(2)} MW (${percentage}%)`;
                                  }
                                }
                              }
                            },
                            cutout: '65%',
                          }}
                        />
                      </div>
                      <div className="w-[40%] text-center bg-gray-100 p-3 rounded-lg">
                        <div className="text-3xl font-bold">{chartData.total}</div>
                        <div className="text-lg font-semibold text-gray-700">MW</div>
                        <div className="text-sm text-gray-500">Total Power</div>
                      </div>
                    </div>
                    
                    {/* Custom Legend */}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {chartData.labels.map((label, index) => {
                        const powerSource = Object.keys(powerSourceLabels).find(
                          key => powerSourceLabels[key] === label
                        );
                        return (
                          <div 
                            key={index} 
                            className="flex items-center gap-2 text-sm"
                          >
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
                            ></div>
                            <span>{label}</span>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Detailed breakdown */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {Object.entries(powerBreakdownData.powerConsumptionBreakdown)
                        .filter(([_, value]) => value !== undefined && value !== null && value > 0)
                        .sort((a, b) => b[1] - a[1])
                        .map(([key, value]) => (
                          <div 
                            key={key} 
                            className="flex justify-between items-center bg-white p-2 rounded"
                            style={{ borderLeft: `4px solid ${powerSourceColors[key]}` }}
                          >
                            <div className="flex items-center gap-2">
                              {powerSourceIcons[key]}
                              <span className="font-medium">{powerSourceLabels[key] || key}</span>
                            </div>
                            <span>{typeof value === 'number' ? `${value.toFixed(2)} MW` : 'N/A'}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Power breakdown data not available</p>
                )}
              </section>

              {/* API Call Response (only in development) */}
              {process.env.NODE_ENV === 'development' && (
                <section className="bg-gray-50 p-4 rounded-lg border-t-2 border-orange-400">
                  <h3 className="text-lg font-semibold mb-3 text-orange-600">API Call Response</h3>
                  <div className="space-y-4 text-xs font-mono">
                    {/* Carbon Intensity API Details */}
                    <div className="space-y-2 bg-gray-100 p-2 rounded">
                      <p className="font-bold text-orange-600">Carbon Intensity API:</p>
                      {carbonIntensityData?._apiDetails ? (
                        <>
                          <p className="font-semibold">GET Request URL:</p>
                          <p className="break-all bg-gray-200 p-1 rounded">{carbonIntensityData._apiDetails.url}</p>
                          <p>
                            <span className="font-semibold">Status: </span>
                            <span className={carbonIntensityData._apiDetails.status === 200 ? 'text-green-600' : 'text-red-600'}>
                              {carbonIntensityData._apiDetails.status}
                            </span>
                          </p>
                          <p className="font-semibold mt-2">Response Data:</p>
                          <pre className="overflow-auto max-h-40 bg-gray-200 p-1 rounded">
                            {JSON.stringify(carbonIntensityData, (key, value) => key === '_apiDetails' ? undefined : value, 2)}
                          </pre>
                        </>
                      ) : (
                        <p className="italic text-gray-500">No API details available</p>
                      )}
                    </div>

                    {/* Power Breakdown API Details */}
                    <div className="space-y-2 bg-gray-100 p-2 rounded">
                      <p className="font-bold text-orange-600">Power Breakdown API:</p>
                      {powerBreakdownData?._apiDetails ? (
                        <>
                          <p className="font-semibold">GET Request URL:</p>
                          <p className="break-all bg-gray-200 p-1 rounded">{powerBreakdownData._apiDetails.url}</p>
                          <p>
                            <span className="font-semibold">Status: </span>
                            <span className={powerBreakdownData._apiDetails.status === 200 ? 'text-green-600' : 'text-red-600'}>
                              {powerBreakdownData._apiDetails.status}
                            </span>
                          </p>
                          <p className="font-semibold mt-2">Response Data:</p>
                          <pre className="overflow-auto max-h-40 bg-gray-200 p-1 rounded">
                            {JSON.stringify(powerBreakdownData, (key, value) => key === '_apiDetails' ? undefined : value, 2)}
                          </pre>
                        </>
                      ) : (
                        <p className="italic text-gray-500">No API details available</p>
                      )}
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ZoneDetails; 