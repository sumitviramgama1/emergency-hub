// services/locationService.js
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
        });
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
};

export const getLocationName = async (latitude, longitude) => {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // Use Vite's environment variable
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
    );
    const data = await response.json();

    // Check for errors first
    if (data.error_message) {
      console.error("API Error:", data.error_message);
      throw new Error(data.error_message);
    }

    if (data.status === "OK" && data.results.length > 0) {
      return data.results[0].formatted_address;
    } else {
      console.error("No address found or status not OK:", data.status);
      return "Location not found";
    }
  } catch (error) {
    console.error("Error getting location name:", error);
    return "Location name unavailable";
  }
};