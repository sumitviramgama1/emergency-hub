// controllers/locationController.js
const axios = require('axios');

// Get current location using Google Maps Geolocation API
exports.getCurrentLocation = async (req, res) => {
  try {
    const { wifiAccessPoints, cellTowers, considerIp = "true" } = req.body;
    
    // Prepare request body based on available data
    const requestBody = { considerIp };
    
    // Add WiFi access points if provided
    if (wifiAccessPoints && Array.isArray(wifiAccessPoints) && wifiAccessPoints.length > 0) {
      requestBody.wifiAccessPoints = wifiAccessPoints;
    }
    
    // Add cell towers if provided
    if (cellTowers && Array.isArray(cellTowers) && cellTowers.length > 0) {
      requestBody.cellTowers = cellTowers;
    }
    
    // Make request to Google Maps Geolocation API
    const response = await axios.post(
      `https://www.googleapis.com/geolocation/v1/geolocate?key=${process.env.GOOGLE_MAPS_API_KEY}`,
      requestBody
    );
    
    // Extract location data from response
    const { location, accuracy } = response.data;
    return res.status(200).json({
      success: true,
      data: {
        latitude: location.lat,
        longitude: location.lng,
        accuracy
      }
    });
  } catch (error) {
    console.error('Error getting current location:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 403) {
      return res.status(403).json({
        success: false,
        error: 'API key error or quota exceeded',
        details: error.response.data
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'Failed to get current location',
      details: error.response?.data || error.message
    });
  }
};

// Get location name using Google Maps Geocoding API
// Updated getLocationName function in locationController.js
exports.getLocationName = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      });
    }
    
    // Make request to Google Maps Geocoding API
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );
    
    // Check if the response was successful
    if (response.data.status !== 'OK') {
      return res.status(400).json({
        success: false,
        error: `Geocoding API error: ${response.data.status}`
      });
    }
    
    // Check if we have any results
    if (!response.data.results || response.data.results.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No location data found for these coordinates'
      });
    }
    
    // Extract formatted address and address components from the first result
    const result = response.data.results[0];
    const formattedAddress = result.formatted_address;
    const addressComponents = result.address_components;
    
    // Extract city and state from address components
    let city = '';
    let state = '';
    let country = '';
    let neighborhood = '';
    let sublocality = '';
    let village = '';
    
    result.address_components.forEach(component => {
      if (component.types.includes('locality')) {
        city = component.long_name;
      }
      if (component.types.includes('administrative_area_level_1')) {
        state = component.short_name;
      }
      if (component.types.includes('country')) {
        country = component.long_name;
      }
      if (component.types.includes('neighborhood')) {
        neighborhood = component.long_name;
      }
      if (component.types.includes('sublocality')) {
        sublocality = component.long_name;
      }
      if (component.types.includes('village')) {
        village = component.long_name;
      }
    });
    
    // If city is not found, try to use a broader area name
    if (!city) {
      result.address_components.forEach(component => {
        if (component.types.includes('administrative_area_level_2') || 
            component.types.includes('postal_town')) {
          city = component.long_name;
        }
      });
    }
    
    return res.status(200).json({
      success: true,
      data: {
        formattedAddress,
        city,
        state,
        country,
        neighborhood,
        sublocality,
        village,
        addressComponents // Include the full address components array
      }
    });
  } catch (error) {
    console.error('Error getting location name:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to get location name',
      details: error.response?.data || error.message
    });
  }
};