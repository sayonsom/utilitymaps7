const ZoneDetails = ({ zone, onClose }) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40"
        onClick={onClose}
      />
      
      {/* Side Panel */}
      <div className="fixed right-0 top-0 h-screen w-1/3 bg-white shadow-xl overflow-y-auto z-50 transform transition-transform">
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

        <div className="p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <section className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Full Name:</span> {zone.fullName || 'N/A'}</p>
                <p><span className="font-medium">Data Availability:</span> {zone.status}</p>
                <p><span className="font-medium">Last Updated:</span> {zone.lastUpdate}</p>
              </div>
            </section>

            {/* Energy Mix */}
            <section className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Energy Mix</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Carbon Intensity:</span> {zone.carbon_intensity || 'N/A'} gCO2eq/kWh</p>
                <p><span className="font-medium">Renewable:</span> {zone.renewable_percentage || 'N/A'}%</p>
                <p><span className="font-medium">Low Carbon:</span> {zone.low_carbon_percentage || 'N/A'}%</p>
                <p><span className="font-medium">Fossil Fuel:</span> {zone.fossil_fuel_percentage || 'N/A'}%</p>
              </div>
            </section>

            {/* Generation Fuel Mix */}
            <section className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Energy Generation Fuel Mix</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Battery', key: 'BAT' },
                  { label: 'Coal', key: 'COL' },
                  { label: 'Geothermal', key: 'GEO' },
                  { label: 'Natural Gas', key: 'NG' },
                  { label: 'Nuclear', key: 'NUC' },
                  { label: 'Ocean Energy', key: 'OES' },
                  { label: 'Oil', key: 'OIL' },
                  { label: 'Other', key: 'OTH' },
                  { label: 'Pumped Storage', key: 'PS' },
                  { label: 'Biofuel', key: 'SNB' },
                  { label: 'Solar', key: 'SUN' },
                  { label: 'Unknown', key: 'UES' },
                  { label: 'Hydro', key: 'WAT' },
                  { label: 'Wind', key: 'WND' }
                ].map(({ label, key }) => (
                  <div key={key} className="flex justify-between items-center bg-white p-2 rounded">
                    <span className="font-medium">{label}:</span>
                    <span>{zone[key] || 'N/A'} MW</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default ZoneDetails; 