'use client';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useMap } from '@/context/MapContext';
import Image from 'next/image';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const { setSelectedZone } = useMap();

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = async (value) => {
    setSearchTerm(value);
    if (value.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      // Fetch both status and zone data to get coordinates
      const [statusResponse, zoneResponse] = await Promise.all([
        fetch('/api/status'),
        fetch('/api/zones')
      ]);

      const statusText = await statusResponse.text();
      const zoneData = await zoneResponse.json();

      // Parse status data
      const rows = statusText.split('\n').slice(1);
      const statusMap = {};
      rows.forEach(row => {
        const [zoneName, status, fullName] = row.split(',');
        statusMap[zoneName] = { zoneName, status, fullName };
      });

      // Find matching zones and their coordinates
      const filteredResults = zoneData.features
        .filter(feature => {
          const zoneName = feature.properties.zoneName;
          const fullName = statusMap[zoneName]?.fullName;
          return (
            zoneName?.toLowerCase().includes(value.toLowerCase()) ||
            fullName?.toLowerCase().includes(value.toLowerCase())
          );
        })
        .map(feature => ({
          ...statusMap[feature.properties.zoneName],
          coordinates: feature.geometry.coordinates[0]
        }))
        .slice(0, 5);

      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Search error:', error);
    }
    setIsSearching(false);
  };

  const handleZoneSelect = (zone) => {
    setSelectedZone({
      zoneName: zone.zoneName,
      coordinates: zone.coordinates
    });
    setSearchTerm(zone.zoneName);
    setSearchResults([]);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Logo"
              width={100}
              height={100}
            />
          </div>

          <div className="relative mx-4 flex-1 max-w-md" ref={searchRef}>
            <input
              type="text"
              placeholder="Search by Zone Name or Full Name..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchResults.length > 0 && (
              <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-50">
                {searchResults.map((result, index) => (
                  <div 
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleZoneSelect(result)}
                  >
                    <div className="font-medium">{result.zoneName}</div>
                    {result.fullName && (
                      <div className="text-sm text-gray-600">{result.fullName}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex space-x-8">
            <Link 
              href="/status" 
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
            >
              Status
            </Link>
            <Link 
              href="/documentation" 
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
            >
              Documentation
            </Link>
            <Link 
              href="/methodology" 
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
            >
              Methodology
            </Link>
            <Link 
              href="/query-builder" 
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
            >
              Query Builder
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 