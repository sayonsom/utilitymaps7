'use client';

const FilterPanel = ({ onFilterChange, filters }) => {
  const riskOptions = ['Low', 'Medium', 'High'];
  const impactOptions = ['Low', 'Medium', 'High'];
  const ownerOptions = ['Neelaksh', 'Sayonsom', 'Hari', 'Prathmesh', 'Riktesh', 'Rahul', 'Not assigned'];
  const statusOptions = [
    'Real-Time(<6hours)',
    'Real-Time(<3days)',
    'EstimatedMonthly',
    'EstimatedAnnually',
    'EstimatedHistorically',
    'Not Available'
  ];

  return (
    <div className="absolute bottom-8 left-4 bg-white p-4 rounded-lg shadow-lg z-10 w-64">
      <div className="space-y-6">
        {/* Status Filter */}
        <div>
          <h3 className="font-bold mb-2 text-sm text-gray-800">Filter by Status</h3>
          <div className="space-y-2">
            {statusOptions.map(status => (
              <label key={status} className="flex items-center text-xs  space-x-2">
                <input
                  type="checkbox"
                  checked={filters.status.includes(status)}
                  onChange={(e) => {
                    const newStatus = e.target.checked
                      ? [...filters.status, status]
                      : filters.status.filter(s => s !== status);
                    onFilterChange('status', newStatus);
                  }}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 text-xs">{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Risk Filter */}
        <div>
          <h3 className="font-bold mb-2 text-sm text-gray-800">Filter by Risk</h3>
          <div className="space-y-2">
            {riskOptions.map(risk => (
              <label key={risk} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.risk.includes(risk)}
                  onChange={(e) => {
                    const newRisk = e.target.checked
                      ? [...filters.risk, risk]
                      : filters.risk.filter(r => r !== risk);
                    onFilterChange('risk', newRisk);
                  }}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 text-xs">{risk}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Impact Filter */}
        <div>
          <h3 className="font-bold mb-2 text-sm text-gray-800">Filter by Impact</h3>
          <div className="space-y-2">
            {impactOptions.map(impact => (
              <label key={impact} className="flex items-center text-xs space-x-2">
                <input
                  type="checkbox"
                  checked={filters.impact.includes(impact)}
                  onChange={(e) => {
                    const newImpact = e.target.checked
                      ? [...filters.impact, impact]
                      : filters.impact.filter(i => i !== impact);
                    onFilterChange('impact', newImpact);
                  }}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 text-xs">{impact}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Owner Filter */}
        <div>
          <h3 className="font-bold mb-2 text-sm text-gray-800">Filter by Owner</h3>
          <div className="space-y-2">
            {ownerOptions.map(owner => (
              <label key={owner} className="flex items-center text-xs space-x-2">
                <input
                  type="checkbox"
                  checked={filters.owner.includes(owner)}
                  onChange={(e) => {
                    const newOwner = e.target.checked
                      ? [...filters.owner, owner]
                      : filters.owner.filter(o => o !== owner);
                    onFilterChange('owner', newOwner);
                  }}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 text-xs">{owner}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            onFilterChange('status', []);
            onFilterChange('risk', []);
            onFilterChange('impact', []);
            onFilterChange('owner', []);
          }}
          className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel; 