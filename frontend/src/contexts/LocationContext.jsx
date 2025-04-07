// src/contexts/LocationContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import { getCurrentLocation, getLocationName } from "../services/locationService";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLocation = async () => {
    try {
      setLoading(true);
      setError(null);
      const currentLocation = await getCurrentLocation();
      setLocation(currentLocation);

      const name = await getLocationName(
        currentLocation.latitude,
        currentLocation.longitude
      );
      setLocationName(name);
    } catch (err) {
      console.error("Error fetching location:", err);
      setError(err.message || "Failed to get location");
    } finally {
      setLoading(false);
    }
  };

  // Function to manually update location
  const updateLocation = (newLocation) => {
    setLocation(newLocation);
    
    if (newLocation && newLocation.latitude && newLocation.longitude) {
      getLocationName(newLocation.latitude, newLocation.longitude)
        .then(name => setLocationName(name))
        .catch(err => console.error("Error updating location name:", err));
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <LocationContext.Provider
      value={{ 
        location, 
        locationName, 
        loading, 
        error, 
        refreshLocation: fetchLocation,
        updateLocation
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocationContext must be used within a LocationProvider");
  }
  return context;
};