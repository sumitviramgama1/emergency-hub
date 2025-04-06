// src/contexts/LocationContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import { getCurrentLocation, getLocationName } from "../services/locationService";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setLoading(true);
        const currentLocation = await getCurrentLocation();
        setLocation(currentLocation);

        const name = await getLocationName(
          currentLocation.latitude,
          currentLocation.longitude
        );
        setLocationName(name);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  return (
    <LocationContext.Provider
      value={{ location, locationName, loading, error }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => useContext(LocationContext);