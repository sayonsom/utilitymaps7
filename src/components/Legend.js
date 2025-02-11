'use client';

const Legend = ({ statusCounts }) => {
  // Define status colors - matching the map colors
  const statusColors = {
    'Real-Time(<6hours)': '#00ff00',
    'Real-Time(<3days)': '#90EE90',
    'EstimatedMonthly': '#ffff00',
    'EstimatedAnnually': '#ffd700',
    'EstimatedHistorically': '#ffa500',
    'Not Available': '#ffffff'
  };

  return (
    <div className="absolute top-20 left-4 bg-white p-4 rounded-lg shadow-lg z-10 w-64">
      <h3 className="font-bold mb-2 text-sm text-gray-800">Zone Status</h3>
      <div className="space-y-2">
        {Object.entries(statusCounts)
          .filter(([_, count]) => count > 0) // Only show statuses with count > 0
          .map(([status, count]) => (
          <div key={status} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded border border-gray-300"
              style={{ backgroundColor: statusColors[status] }}
            />
            <span className="text-xs text-gray-700">
              {status}: {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend; 