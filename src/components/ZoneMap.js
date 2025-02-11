'use client';
import React, { useEffect, useState, useRef } from 'react';
import ReactMapGL, { Source, Layer, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Papa from 'papaparse';
import Legend from './Legend';
import { useMap } from '@/context/MapContext';
import ZoneDetails from './ZoneDetails';
import FilterPanel from './FilterPanel';

const ZoneMap = () => {
  const [zoneData, setZoneData] = useState(null);
  const [statusData, setStatusData] = useState({});
  const [hoveredZone, setHoveredZone] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: 57,
    longitude: 14,
    zoom: 5,
    width: '100%',
    height: '100%'
  });
  const [statusCounts, setStatusCounts] = useState({});
  const { selectedZone } = useMap();
  const mapRef = useRef();
  const [selectedZoneDetails, setSelectedZoneDetails] = useState(null);
  const [filters, setFilters] = useState({
    status: [],
    risk: [],
    impact: []
  });
  const [hoveredZoneId, setHoveredZoneId] = useState(null);
  const [popupInfo, setPopupInfo] = useState(null);

  // Layer style for the zones
  const zoneLayer = {
    id: 'zone-layer',
    type: 'fill',
    paint: {
      'fill-color': [
        'match',
        ['get', 'status'],
        'Real-Time(<6hours)', '#00ff00',
        'Real-Time(<3days)', '#90EE90',
        'EstimatedMonthly', '#ffff00',
        'EstimatedAnnually', '#ffd700',
        'EstimatedHistorically', '#ffa500',
        'Not Available', '#ffffff',
        '#ffffff' // default color
      ],
      'fill-opacity': 0.7,
      'fill-outline-color': '#000000'
    }
  };

  // Replace interactiveLayerProps with click handler
  const handleZoneClick = (e) => {
    if (e.features.length > 0) {
      const feature = e.features[0];
      setPopupInfo({
        properties: feature.properties,
        longitude: e.lngLat.lng,
        latitude: e.lngLat.lat
      });
    }
  };

  useEffect(() => {
    // Load GeoJSON data
    const loadGeoJSON = async () => {
      try {
        const response = await fetch('/api/zones');
        const data = await response.json();
        
        // Validate GeoJSON structure
        if (!data.type || data.type !== 'FeatureCollection' || !Array.isArray(data.features)) {
          console.error('Invalid GeoJSON structure:', data);
          return;
        }
        
        setZoneData(data);
      } catch (error) {
        console.error('Error loading GeoJSON:', error);
      }
    };

    // Load CSV status data
    const loadStatusData = async () => {
      try {
        const response = await fetch('/api/status');
        const text = await response.text();
        
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const statusMap = {};
            results.data.forEach(row => {
              if (row.zoneName) {
                // Trim whitespace from zoneName and Status
                const zoneName = row.zoneName.trim();
                statusMap[zoneName] = {
                  ...row,
                  Status: row.Status?.trim() || 'Not Available'
                };
              }
            });
            console.log('Total status entries:', Object.keys(statusMap).length);
            setStatusData(statusMap);
          }
        });
      } catch (error) {
        console.error('Error loading status data:', error);
      }
    };

    loadGeoJSON();
    loadStatusData();
  }, []);

  useEffect(() => {
    if (zoneData && Object.keys(statusData).length) {
      const counts = {
        'Real-Time(<6hours)': 0,
        'Real-Time(<3days)': 0,
        'EstimatedMonthly': 0,
        'EstimatedAnnually': 0,
        'EstimatedHistorically': 0,
        'Not Available': 0
      };

      // First count total zones for verification
      const totalZones = zoneData.features.length;
      console.log('Total zones in GeoJSON:', totalZones);

      // Count each zone's status
      zoneData.features.forEach(feature => {
        const zoneName = feature.properties.zoneName?.trim();
        const zoneStatus = statusData[zoneName];
        
        if (zoneStatus && zoneStatus.Status) {
          // Normalize the status string to match our expected format
          const status = zoneStatus.Status.trim();
          if (counts.hasOwnProperty(status)) {
            counts[status] += 1;
          } else {
            console.warn(`Unknown status found: "${status}" for zone: ${zoneName}`);
            counts['Not Available'] += 1;
          }
        } else {
          counts['Not Available'] += 1;
        }
      });

      const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
      console.log('Total zones counted:', total);
      console.log('Status counts:', counts);

      if (total !== totalZones) {
        console.error(`Count mismatch: counted ${total} zones but have ${totalZones} zones in data`);
      }

      setStatusCounts(counts);
    }
  }, [zoneData, statusData]);

  useEffect(() => {
    if (selectedZone && selectedZone.coordinates) {
      // Calculate bounds of the zone
      const bounds = selectedZone.coordinates.reduce(
        (bounds, coord) => {
          return [
            [
              Math.min(bounds[0][0], coord[0]),
              Math.min(bounds[0][1], coord[1])
            ],
            [
              Math.max(bounds[1][0], coord[0]),
              Math.max(bounds[1][1], coord[1])
            ]
          ];
        },
        [
          [selectedZone.coordinates[0][0], selectedZone.coordinates[0][1]],
          [selectedZone.coordinates[0][0], selectedZone.coordinates[0][1]]
        ]
      );

      // Fit map to zone bounds
      mapRef.current?.fitBounds(bounds, {
        padding: 100,
        duration: 1000
      });

      // Show popup for selected zone
      const center = [
        (bounds[0][0] + bounds[1][0]) / 2,
        (bounds[0][1] + bounds[1][1]) / 2
      ];
      
      setPopupInfo({
        properties: {
          zoneName: selectedZone.zoneName,
          status: statusData[selectedZone.zoneName]?.Status || 'Not Available'
        },
        longitude: center[0],
        latitude: center[1]
      });
    }
  }, [selectedZone]);

  // Update GeoJSON with status data
  const getUpdatedGeoJSON = () => {
    if (!zoneData || !Object.keys(statusData).length) return null;

    return {
      ...zoneData,
      features: zoneData.features.filter(feature => {
        const zoneStatus = statusData[feature.properties.zoneName];
        
        // If no filters are active, show all features
        if (!filters.status.length && !filters.risk.length && !filters.impact.length) {
          return true;
        }

        // Apply filters
        const matchesStatus = filters.status.length === 0 || 
          filters.status.includes(zoneStatus?.Status);
        const matchesRisk = filters.risk.length === 0 || 
          filters.risk.includes(zoneStatus?.Risk);
        const matchesImpact = filters.impact.length === 0 || 
          filters.impact.includes(zoneStatus?.Impact);

        return matchesStatus && matchesRisk && matchesImpact;
      }).map(feature => ({
        ...feature,
        properties: {
          ...feature.properties,
          status: statusData[feature.properties.zoneName]?.Status || 'Not Available'
        }
      }))
    };
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className="relative w-full h-screen">
      <FilterPanel 
        onFilterChange={handleFilterChange}
        filters={filters}
      />
      <Legend statusCounts={statusCounts} />
      <ReactMapGL
        {...viewport}
        ref={mapRef}
        onMove={evt => setViewport(evt.viewport)}
        mapStyle="mapbox://styles/mapbox/light-v10"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        interactiveLayerIds={['zone-layer']}
        onClick={handleZoneClick}
        cursor={hoveredZone ? 'pointer' : 'grab'}
      >
        {zoneData && (
          <Source type="geojson" data={getUpdatedGeoJSON()}>
            <Layer {...zoneLayer} />
          </Source>
        )}
        
        {popupInfo && (
          <Popup
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            closeButton={true}
            closeOnClick={false}
            anchor="bottom"
            offset={[0, -10]}
            className="zone-popup"
            onClose={() => setPopupInfo(null)}
          >
            <div className="p-3 min-w-[200px]">
              <h3 className="font-bold text-lg mb-2">{popupInfo.properties.zoneName}</h3>
              <p className="mb-1">Status: {popupInfo.properties.status}</p>
              <p className="mb-3">Last Update: {statusData[popupInfo.properties.zoneName]?.LastUpdate || 'N/A'}</p>
              <button
                onClick={() => {
                  setSelectedZoneDetails(popupInfo.properties);
                  setPopupInfo(null);
                }}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 
                          transition-colors duration-200 text-sm font-medium"
              >
                Show Details
              </button>
            </div>
          </Popup>
        )}

        {selectedZoneDetails && (
          <ZoneDetails
            zone={selectedZoneDetails}
            onClose={() => setSelectedZoneDetails(null)}
          />
        )}
      </ReactMapGL>
    </div>
  );
};

export default ZoneMap;