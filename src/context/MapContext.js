'use client';
import { createContext, useContext, useState } from 'react';

const MapContext = createContext();

export function MapProvider({ children }) {
  const [selectedZone, setSelectedZone] = useState(null);

  return (
    <MapContext.Provider value={{ selectedZone, setSelectedZone }}>
      {children}
    </MapContext.Provider>
  );
}

export function useMap() {
  return useContext(MapContext);
} 