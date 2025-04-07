// src/services/locationService.js

/**
 * Gets the current location using the browser's Geolocation API
 * @returns {Promise<{latitude: number, longitude: number}>} A promise that resolves to the current location
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        });
      },
      (error) => {
        let errorMessage;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "The request to get location timed out";
            break;
          default:
            errorMessage = "An unknown error occurred getting location";
        }
        
        reject(new Error(errorMessage));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
};

/**
 * Gets a human-readable location name from coordinates using Google Maps Geocoding API
 * @param {number} latitude - The latitude coordinate
 * @param {number} longitude - The longitude coordinate
 * @returns {Promise<string>} A promise that resolves to the location name
 */
export const getLocationName = async (latitude, longitude) => {
  if (!latitude || !longitude) {
    console.error("Invalid coordinates provided to getLocationName");
    return "Location name unavailable";
  }
  
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.error("Google Maps API key is missing");
      return "Location service configuration error";
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`,
      { signal: controller.signal }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();

    // Check for API errors
    if (data.error_message) {
      console.error("Google Maps API Error:", data.error_message);
      throw new Error(data.error_message);
    }

    if (data.status === "OK" && data.results.length > 0) {
      // Try to find a more human-friendly formatted address
      // Often the first result is the most detailed, but not always the most readable
      const preferredResult = data.results.find(result => 
        result.types.includes("locality") || 
        result.types.includes("political") ||
        result.types.includes("neighborhood")
      ) || data.results[0];
      
      return preferredResult.formatted_address;
    } else {
      console.error("No address found or status not OK:", data.status);
      return "Location not found";
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error("Request timed out getting location name");
      return "Location name request timed out";
    }
    
    console.error("Error getting location name:", error);
    return "Location name unavailable";
  }
};

/**
 * Gets location from IP address (fallback method)
 * @returns {Promise<{latitude: number, longitude: number}>} A promise that resolves to the location
 */
export const getLocationFromIP = async () => {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    
    if (data.latitude && data.longitude) {
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        country: data.country_name,
        isIPBased: true
      };
    }
    throw new Error("Could not get location from IP");
  } catch (error) {
    console.error("Error getting location from IP:", error);
    throw error;
  }
};