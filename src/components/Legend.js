'use client';
import { useState } from 'react';

const Legend = ({ statusCounts, onColorModeChange }) => {
  const [colorMode, setColorMode] = useState('status'); // 'status' or 'owner'

  // Define status colors - matching the map colors
  const statusColors = {
    'Real-Time(<6hours)': '#00ff00',
    'Real-Time(<3days)': '#90EE90',
    'EstimatedMonthly': '#ffff00',
    'EstimatedAnnually': '#ffd700',
    'EstimatedHistorically': '#ffa500',
    'Not Available': '#ffffff'
  };

  const ownerColors = {
    'Neelaksh': '#FF6B6B',
    'Sayonsom': '#4ECDC4',
    'Hari': '#45B7D1',
    'Prathmesh': '#96CEB4',
    'Riktesh': '#FFEEAD',
    'Rahul': '#D4A5A5',
    'Not assigned': '#E0E0E0'
  };

  const handleModeChange = (mode) => {
    setColorMode(mode);
    onColorModeChange(mode);
  };

  return (
    <div className="absolute bottom-32 left-1/3 bg-white p-4 rounded-lg shadow-lg z-10 w-64">
      {/* Color Mode Toggle */}
      <div className="mb-4">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            className={`flex-1 px-3 py-1 text-xs rounded-md transition-colors ${
              colorMode === 'status' 
                ? 'bg-white shadow-sm' 
                : 'hover:bg-gray-200'
            }`}
            onClick={() => handleModeChange('status')}
          >
            Color by Status
          </button>
          <button
            className={`flex-1 px-3 py-1 text-xs rounded-md transition-colors ${
              colorMode === 'owner' 
                ? 'bg-white shadow-sm' 
                : 'hover:bg-gray-200'
            }`}
            onClick={() => handleModeChange('owner')}
          >
            Color by Owner
          </button>
        </div>
      </div>

      {/* Status Legend */}
      {colorMode === 'status' && (
        <>
          <h3 className="font-bold mb-2 text-sm text-gray-800">Zone Status</h3>
          <div className="space-y-2">
            {Object.entries(statusCounts)
              .filter(([_, count]) => count > 0)
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
        </>
      )}

      {/* Owner Legend */}
      {colorMode === 'owner' && (
        <>
          <h3 className="font-bold mb-2 text-sm text-gray-800">Zone Owners</h3>
          <div className="space-y-2">
            {Object.entries(ownerColors).map(([owner, color]) => (
              <div key={owner} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded border border-gray-300"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-gray-700">{owner}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Legend; 