// src/services/locationService.js

/**
 * Gets the current location using the browser's Geolocation API
 * Optimized for Android mobile browsers
 * @returns {Promise<{latitude: number, longitude: number}>} A promise that resolves to the current location
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    // Handle Android-specific issues with timeouts
    const locationTimeout = setTimeout(() => {
      reject(new Error("Location request timed out. This may happen on some Android devices if location permissions are not set to 'Allow all the time'"));
    }, 15000); // Longer timeout for Android

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(locationTimeout);
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        });
      },
      (error) => {
        clearTimeout(locationTimeout);
        
        let errorMessage;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. On Android, please check your browser settings and ensure location permission is enabled";
            // Try fallback to IP-based location
            getLocationFromIP()
              .then(location => {
                console.log("Using IP-based location as fallback");
                resolve({
                  ...location,
                  accuracy: 10000, // Low accuracy for IP-based location
                  isIPBased: true
                });
              })
              .catch(ipError => {
                reject(new Error(errorMessage));
              });
            return;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable. Please check if location services are enabled in your Android settings";
            break;
          case error.TIMEOUT:
            errorMessage = "The request to get location timed out. This is common on some Android browsers";
            break;
          default:
            errorMessage = "An unknown error occurred getting location on your device";
        }
        
        reject(new Error(errorMessage));
      },
      { 
        enableHighAccuracy: true, 
        timeout: 12000, // Increased timeout for Android browsers
        maximumAge: 0
      }
    );
  });
};

/**
 * Gets location from IP address (fallback method)
 * @returns {Promise<{latitude: number, longitude: number}>} A promise that resolves to the location
 */
export const getLocationFromIP = async () => {
  try {
    // Try multiple IP geolocation services for better reliability on mobile
    try {
      const response = await fetch("https://ipapi.co/json/", {
        // Important for mobile connections that might be slow
        signal: AbortSignal.timeout(5000)
      });
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
    } catch (e) {
      console.log("First IP service failed, trying backup");
    }
    
    // Backup service if the first one fails
    const backupResponse = await fetch("https://ipinfo.io/json", {
      signal: AbortSignal.timeout(5000)
    });
    const backupData = await backupResponse.json();
    
    if (backupData.loc) {
      const [latitude, longitude] = backupData.loc.split(',').map(Number);
      return {
        latitude,
        longitude,
        city: backupData.city,
        country: backupData.country,
        isIPBased: true
      };
    }
    
    throw new Error("Could not get location from IP");
  } catch (error) {
    console.error("Error getting location from IP:", error);
    throw error;
  }
};

/**
 * Gets a human-readable location name from coordinates using Google Maps Geocoding API
 * Optimized for mobile connections
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
    
    // Setting a controller with timeout specifically for mobile networks
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // Extended timeout for mobile
    
    // Add a timestamp parameter to prevent caching issues on some Android browsers
    const cacheBuster = new Date().getTime();
    
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&_=${cacheBuster}`,
      { 
        signal: controller.signal,
        // Ensuring compatibility with older Android WebView/Browsers
        headers: {
          'Accept': 'application/json'
        }
      }
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
      // For Android mobile, prioritize results that are more user-friendly for small screens
      // Often formats that are too verbose don't display well on mobile
      
      // Try to find a result with locality (city) first
      const cityResult = data.results.find(result => 
        result.types.includes("locality")
      );
      
      // Then neighborhood for more precise location
      const neighborhoodResult = data.results.find(result => 
        result.types.includes("neighborhood") || 
        result.types.includes("sublocality")
      );
      
      // Fall back to administrative areas if needed
      const adminResult = data.results.find(result => 
        result.types.includes("administrative_area_level_1") || 
        result.types.includes("administrative_area_level_2")
      );
      
      // Use the most appropriate result or fall back to first result
      const preferredResult = cityResult || neighborhoodResult || adminResult || data.results[0];
      
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
 * Gets continuous location updates (useful for navigation)
 * @param {Function} onLocationUpdate - Callback that receives location updates
 * @param {Function} onError - Callback for errors
 * @returns {Function} Function to call to stop watching location
 */
export const watchLocation = (onLocationUpdate, onError) => {
  if (!navigator.geolocation) {
    onError(new Error("Geolocation is not supported by your browser"));
    return () => {};
  }
  
  // Mobile browsers, especially on Android, may have issues with continuous updates
  // Using a more battery-friendly high accuracy setting
  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      onLocationUpdate({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        heading: position.coords.heading,
        speed: position.coords.speed,
        timestamp: position.timestamp
      });
    },
    (error) => {
      let errorMessage;
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Location tracking permission denied";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information unavailable while tracking";
          break;
        case error.TIMEOUT:
          errorMessage = "Location tracking timed out";
          break;
        default:
          errorMessage = "Unknown error during location tracking";
      }
      
      onError(new Error(errorMessage));
    },
    { 
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000 // Allow slightly older positions for better performance on Android
    }
  );
  
  // Return function to stop watching location
  return () => {
    navigator.geolocation.clearWatch(watchId);
  };
};