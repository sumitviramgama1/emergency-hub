// src/contexts/LocationContext.jsx
import { createContext, useState, useContext } from 'react';
import { useLocation as useLocationHook } from '../hooks';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [locationInitialized, setLocationInitialized] = useState(false);
  const locationData = useLocationHook(locationInitialized);

  // Mark as initialized after first load
  if (!locationInitialized && locationData.location.latitude) {
    setLocationInitialized(true);
  }

  return (
    <LocationContext.Provider value={locationData}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => useContext(LocationContext);