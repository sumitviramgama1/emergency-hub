// src/hooks/useLocation.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useLocation = (skipFetch = false) => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [locationName, setLocationName] = useState("");
  const [loading, setLoading] = useState(!skipFetch);
  const [locationError, setLocationError] = useState(null);
  const [watchId, setWatchId] = useState(null);

  // Helper function to collect WiFi access point data if available
  const collectWifiData = async () => {
    // Browsers don't generally provide WiFi AP data directly
    return [];
  };

  // Helper function to collect cell tower data if available
  const collectCellData = async () => {
    // Browsers don't generally provide cell tower data directly
    return [];
  };

  // Fetch location name from coordinates using backend API
  const fetchLocationName = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/location/location-name?latitude=${latitude}&longitude=${longitude}`
      );

      if (response.data.success) {
        const { formattedAddress, city, state, country, addressComponents } =
          response.data.data;

        // If we have the full formatted address, use it directly
        if (formattedAddress) {
          setLocationName(formattedAddress);
        } else {
          // Otherwise, build a detailed location string from available components
          let locationParts = [];

          // Add neighborhood, sublocality, or village if available
          const locality = addressComponents?.find(
            (comp) =>
              comp.types.includes("neighborhood") ||
              comp.types.includes("sublocality") ||
              comp.types.includes("village") ||
              comp.types.includes("postal_town")
          );

          if (locality) {
            locationParts.push(locality.long_name);
          }

          // Add city if available and different from locality
          if (city && (!locality || locality.long_name !== city)) {
            locationParts.push(city);
          }

          // Add state if available
          if (state) {
            locationParts.push(state);
          }

          // Add country if available
          if (country) {
            locationParts.push(country);
          }

          // Join all parts with commas
          if (locationParts.length > 0) {
            setLocationName(locationParts.join(", "));
          } else {
            setLocationName("Unknown location");
          }
        }
      } else {
        setLocationName("Location name unavailable");
      }
    } catch (error) {
      console.error("Error fetching location name:", error);
      setLocationName("Location name unavailable");
    }
  };

  // Fetch location using backend API (fallback method)
  const fetchLocationFromBackend = async () => {
    try {
      const wifiData = await collectWifiData();
      const cellData = await collectCellData();

      const response = await axios.post(
        "http://localhost:5000/api/location/current-location",
        {
          considerIp: "true",
          wifiAccessPoints: wifiData,
          cellTowers: cellData,
        }
      );

      if (response.data.success) {
        const { latitude, longitude } = response.data.data;
        setLocation({ latitude, longitude });
        fetchLocationName(latitude, longitude);
        setLocationError(null);
      } else {
        throw new Error("Backend geolocation failed");
      }
    } catch (error) {
      console.error("Error fetching location from backend:", error);
      setLocationError(
        "Unable to determine your location. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  // Get current location using browser's geolocation API or backend API
  useEffect(() => {
    // Skip fetching if requested (for when location is already known)
    if (skipFetch) {
      return;
    }

    setLoading(true);

    // Primary method: Browser's Geolocation API
    if ("geolocation" in navigator) {
      // Set up initial position
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          fetchLocationName(latitude, longitude);
          setLoading(false);

          // Set up continuous position watching
          const id = navigator.geolocation.watchPosition(
            (updatedPosition) => {
              const { latitude, longitude } = updatedPosition.coords;
              setLocation({ latitude, longitude });
            },
            (error) => {
              console.error("Error watching position:", error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
          );

          setWatchId(id);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          setLocationError(
            "Unable to access your location. Trying alternative methods..."
          );
          // Fallback to backend API for geolocation
          fetchLocationFromBackend();
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      setLocationError(
        "Geolocation is not supported by your browser. Using alternative methods..."
      );
      // Fallback to backend API for geolocation
      fetchLocationFromBackend();
    }

    // Cleanup function to stop watching position
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [skipFetch]);

  const retryLocation = () => {
    setLoading(true);
    setLocationError(null);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          fetchLocationName(latitude, longitude);
          setLoading(false);
        },
        (error) => {
          console.error("Error getting geolocation on retry:", error);
          fetchLocationFromBackend();
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    } else {
      fetchLocationFromBackend();
    }
  };

  return {
    location,
    locationName,
    loading,
    locationError,
    retryLocation,
    watchId
  };
};