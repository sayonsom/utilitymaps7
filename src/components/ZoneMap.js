'use client';
import React, { useEffect, useState, useRef } from 'react';
import ReactMapGL, { Source, Layer, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Papa from 'papaparse';
import { useMap } from '@/context/MapContext';
import ZoneDetails from './ZoneDetails';
import DeploymentStageSelector from './DeploymentStageSelector';

// Function to generate random colors for zones
const generateRandomColor = () => {
  // Define color palette ranges similar to the world map image
  const colorPalettes = [
    ['#4ECDC4', '#45B7D1', '#96CEB4', '#A1CBFF'], // Greens and blues
    ['#FFEEAD', '#FFD700', '#FFFF00', '#FFC107'], // Yellows
    ['#FF6B6B', '#D4A5A5', '#FFA07A', '#FF7F50'], // Reds and oranges
    ['#E0E0E0', '#D3D3D3', '#C0C0C0', '#A9A9A9']  // Grays
  ];
  
  // Pick a random palette
  const palette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
  // Pick a random color from the palette
  return palette[Math.floor(Math.random() * palette.length)];
};

const ZoneMap = () => {
  const [zoneData, setZoneData] = useState(null);
  const [statusData, setStatusData] = useState({});
  const [hoveredZone, setHoveredZone] = useState(null);
  const [selectedStage, setSelectedStage] = useState('Development');
  const [viewport, setViewport] = useState({
    latitude: 20, // Center more on the equator to see more countries
    longitude: 0,  // Center on prime meridian
    zoom: 2,       // Zoom out to see more of the world
    width: '100%',
    height: '100%'
  });
  const { selectedZone } = useMap();
  const mapRef = useRef();
  const [selectedZoneDetails, setSelectedZoneDetails] = useState(null);
  const [hoveredZoneId, setHoveredZoneId] = useState(null);
  const [popupInfo, setPopupInfo] = useState(null);
  const [apiBaseUrl, setApiBaseUrl] = useState('https://carbonaggr-ap04sapnortheast1-ext-674624425.ap-northeast-1.elb.amazonaws.com');
  const [carbonIntensityData, setCarbonIntensityData] = useState({});
  const [powerBreakdownData, setPowerBreakdownData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [zoneColors, setZoneColors] = useState({});

  const BEARER_TOKEN = 'f0f29188-c004-43a0-8cb3-c31e8195ddd5';
  
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
  
  // Layer style for the zones - now using random colors
  const zoneLayer = {
    id: 'zone-layer',
    type: 'fill',
    paint: {
      'fill-color': [
        'match',
        ['get', 'zoneName'],
        ...Object.entries(zoneColors).flatMap(([zoneName, color]) => [zoneName, color]),
        '#CCCCCC' // default color for any zones not in our color map
      ],
      'fill-opacity': 0.8,
      'fill-outline-color': '#000000'
    }
  };

  // Add this helper function to calculate bounds from coordinates
  const calculateBounds = (coordinates) => {
    return coordinates.reduce(
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
        [coordinates[0][0], coordinates[0][1]],
        [coordinates[0][0], coordinates[0][1]]
      ]
    );
  };

  // Replace the existing handleZoneClick with this updated version
  const handleZoneClick = (e) => {
    if (e.features.length > 0) {
      const feature = e.features[0];
      const coordinates = feature.geometry.coordinates[0];
      
      setPopupInfo({
        properties: feature.properties,
        longitude: e.lngLat.lng,
        latitude: e.lngLat.lat,
        coordinates: coordinates // Store coordinates in popupInfo
      });
    }
  };

  // Update the popup button click handler
  const handleShowDetails = (popupInfo) => {
    setSelectedZoneDetails(popupInfo.properties);
    setPopupInfo(null);

    // Zoom to the zone
    if (popupInfo.coordinates) {
      const bounds = calculateBounds(popupInfo.coordinates);
      mapRef.current?.fitBounds(bounds, {
        padding: 50,
        duration: 1000
      });
    }
  };

  // Generate random colors for zones when zone data is loaded
  useEffect(() => {
    if (zoneData && zoneData.features && zoneData.features.length > 0) {
      const colors = {};
      zoneData.features.forEach(feature => {
        const zoneName = feature.properties.zoneName;
        colors[zoneName] = generateRandomColor();
      });
      setZoneColors(colors);
    }
  }, [zoneData]);

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
      features: zoneData.features.map(feature => ({
        ...feature,
        properties: {
          ...feature.properties,
          status: statusData[feature.properties.zoneName]?.Status || 'Not Available',
          owner: statusData[feature.properties.zoneName]?.Owner || 'Not assigned'
        }
      }))
    };
  };

  const fetchCarbonIntensityData = async (zone) => {
    if (!zone) return;
    
    setIsLoading(true);
    try {
      const encodedBaseUrl = encodeURIComponent(apiBaseUrl);
      console.log(`Fetching carbon intensity data for zone: ${zone}`);
      
      const response = await fetch(`/api/carbon-intensity?zone=${zone}&baseUrl=${encodedBaseUrl}`);
      const status = response.status;
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${status}`);
      }
      
      const data = await response.json();
      console.log('Carbon intensity API response:', data);
      
      // Store both data and API details
      setCarbonIntensityData(prev => ({
        ...prev,
        [zone]: {
          ...data,
          _apiDetails: {
            url: `${apiBaseUrl}/v1/carbon-intensity/latest?zone=${zone}`,
            status: status
          }
        }
      }));
    } catch (error) {
      console.error('Error fetching carbon intensity data:', error);
      setCarbonIntensityData(prev => ({
        ...prev,
        [zone]: {
          error: error.message,
          _apiDetails: {
            url: `${apiBaseUrl}/v1/carbon-intensity/latest?zone=${zone}`,
            status: error.status || 500
          }
        }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPowerBreakdownData = async (zone) => {
    if (!zone) return;
    
    setIsLoading(true);
    try {
      const encodedBaseUrl = encodeURIComponent(apiBaseUrl);
      console.log(`Fetching power breakdown data for zone: ${zone}`);
      
      const response = await fetch(`/api/power-breakdown?zone=${zone}&baseUrl=${encodedBaseUrl}`);
      const status = response.status;
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${status}`);
      }
      
      const data = await response.json();
      console.log('Power breakdown API response:', data);
      
      // Store both data and API details
      setPowerBreakdownData(prev => ({
        ...prev,
        [zone]: {
          ...data,
          _apiDetails: {
            url: `${apiBaseUrl}/v1/power-breakdown/latest?zone=${zone}`,
            status: status
          }
        }
      }));
    } catch (error) {
      console.error('Error fetching power breakdown data:', error);
      setPowerBreakdownData(prev => ({
        ...prev,
        [zone]: {
          error: error.message,
          _apiDetails: {
            url: `${apiBaseUrl}/v1/power-breakdown/latest?zone=${zone}`,
            status: error.status || 500
          }
        }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedZoneDetails && selectedZoneDetails.zoneName) {
      console.log('Selected zone details:', selectedZoneDetails);
      fetchCarbonIntensityData(selectedZoneDetails.zoneName);
      fetchPowerBreakdownData(selectedZoneDetails.zoneName);
    }
  }, [selectedZoneDetails, apiBaseUrl]);

  // Add a debug effect to log when data changes
  useEffect(() => {
    if (selectedZoneDetails && selectedZoneDetails.zoneName) {
      const zoneName = selectedZoneDetails.zoneName;
      console.log('Current data state for zone:', zoneName);
      console.log('Carbon intensity data:', carbonIntensityData[zoneName]);
      console.log('Power breakdown data:', powerBreakdownData[zoneName]);
    }
  }, [carbonIntensityData, powerBreakdownData, selectedZoneDetails]);

  // Add handleStageChange function
  const handleStageChange = (stage) => {
    const stageKey = stage.toLowerCase();
    setSelectedStage(stage);
    if (STAGES[stageKey]) {
      setApiBaseUrl(STAGES[stageKey].url);
      console.log(`Switching to ${stage} environment with URL: ${STAGES[stageKey].url}`);
    } else {
      console.warn(`Unknown stage: ${stage}, falling back to development URL`);
      setApiBaseUrl(STAGES.development.url);
    }
  };

  return (
    <div className="fixed top-[64px] left-0 right-0 bottom-0">
      <div className="absolute left-4 top-4 z-10">
        <DeploymentStageSelector 
          selectedStage={selectedStage} 
          onStageChange={handleStageChange}
        />
      </div>

      <ReactMapGL
        {...viewport}
        ref={mapRef}
        onMove={evt => setViewport(evt.viewport)}
        mapStyle="mapbox://styles/mapbox/dark-v10"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        interactiveLayerIds={['zone-layer']}
        onClick={handleZoneClick}
        cursor={hoveredZone ? 'pointer' : 'grab'}
      >
        {zoneData && Object.keys(zoneColors).length > 0 && (
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
              <p className="mb-1">Owner: {statusData[popupInfo.properties.zoneName]?.Owner || 'Not assigned'}</p>
              <p className="mb-3">Last Update: {statusData[popupInfo.properties.zoneName]?.LastUpdate || 'N/A'}</p>
              <button
                onClick={() => handleShowDetails(popupInfo)}
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
            onClose={() => {
              setSelectedZoneDetails(null);
              // Reset the map view when closing details
              setViewport(prev => ({
                ...prev,
                latitude: 20,
                longitude: 0,
                zoom: 2
              }));
            }}
            carbonIntensityData={carbonIntensityData[selectedZoneDetails.zoneName]}
            powerBreakdownData={powerBreakdownData[selectedZoneDetails.zoneName]}
            isLoading={isLoading}
          />
        )}
      </ReactMapGL>
    </div>
  );
};

export default ZoneMap;