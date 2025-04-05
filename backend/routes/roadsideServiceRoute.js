const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();
const apiKey = process.env.GOOGLE_MAPS_API_KEY;
// Get nearby roadside assistance services
router.get("/nearby", async (req, res) => {
  try {
    const { latitude, longitude, EmergencyType } = req.query;
    let placesUrl;
    if (EmergencyType == "roadside") {
      placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=car_repair|car_wash|tow_truck|bike_repair&key=${apiKey}`;
    } else if (EmergencyType == "medical") {
      placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=pharmacy&key=${apiKey}`;
    } else if (EmergencyType == "fuel") {
      placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=gas_station|petrol_pump|fuel|fuel_station&key=${apiKey}`;
    } else if (EmergencyType == "hospital") {
      placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=hospital&key=${apiKey}`;
    }else if(EmergencyType=="generalservice"){
      placesUrl=`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=restaurant|mall|mart|store&key=${apiKey}`
    }
    const response = await axios.get(placesUrl);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch nearby services" });
  }
});
// Get details for a specific place
router.get("/place-details", async (req, res) => {
  try {
    const { placeId } = req.query;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_phone_number,website,rating,formatted_address,geometry&key=${apiKey}`;

    const response = await axios.get(detailsUrl);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch place details" });
  }
});
router.get("/distance-duration", async (req, res) => {
  try {
    const { origins, destinations } = req.query;

    if (!origins || !destinations) {
      return res.status(400).json({
        error: "Missing required parameters",
        message: "Both origins and destinations are required",
      });
    }

    // Using the Distance Matrix API
    const distanceMatrixUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${apiKey}`;

    const response = await axios.get(distanceMatrixUrl);

    // Check if we have valid results
    if (
      response.data.rows &&
      response.data.rows.length > 0 &&
      response.data.rows[0].elements &&
      response.data.rows[0].elements.length > 0
    ) {
      const element = response.data.rows[0].elements[0];

      // Format the response with the essential data
      const formattedResponse = {
        success: true,
        distance: element.distance ? element.distance.text : "Unknown",
        duration: element.duration ? element.duration.text : "Unknown",
        origins: response.data.origin_addresses,
        destinations: response.data.destination_addresses,
        status: element.status,
      };

      res.json({ results: formattedResponse });
    } else {
      res.status(404).json({
        error: "No distance data found",
        message: "No distance could be calculated between the given points",
      });
    }
  } catch (error) {
    console.error("Distance Matrix API error:", error.message);
    res.status(500).json({
      error: "Failed to fetch distance data",
      message: error.message,
    });
  }
});

router.get("/route", async (req, res) => {
  try {
    const { origin, destination } = req.query;

    if (!origin || !destination) {
      return res.status(400).json({
        error: "Missing required parameters",
        message: "Both origin and destination are required",
      });
    }

    // Using the Directions API
    const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`;

    const response = await axios.get(directionsUrl);
    // Check if we have valid results
    if (response.data.routes && response.data.routes.length > 0) {
      const route = response.data.routes[0];
      const leg = route.legs[0];

      // Format the response with the essential data
      const formattedResponse = {
        success: true,
        distance: leg.distance.text,
        duration: leg.duration.text,
        polyline: route.overview_polyline.points,
        start_address: leg.start_address,
        end_address: leg.end_address,
        steps: leg.steps.map((step) => ({
          distance: step.distance.text,
          duration: step.duration.text,
          instructions: step.html_instructions,
        })),
      };

      res.json(formattedResponse);
    } else {
      res.status(404).json({
        error: "No route found",
        message: "No route could be calculated between the given points",
      });
    }
  } catch (error) {
    console.error("Directions API error:", error.message);
    res.status(500).json({
      error: "Failed to fetch route data",
      message: error.message,
    });
  }
});

// Add this combined route to roadsideServiceRoute.js
router.get("/service-details-with-distance", async (req, res) => {
  try {
    const { placeId, origin } = req.query;

    if (!placeId || !origin) {
      return res.status(400).json({
        error: "Missing required parameters",
        message: "Both placeId and origin are required",
      });
    }

    // Get place details first
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_phone_number,website,rating,formatted_address,geometry,opening_hours&key=${apiKey}`;
    const detailsResponse = await axios.get(detailsUrl);

    if (!detailsResponse.data.result) {
      return res.status(404).json({
        error: "Place not found",
        message: "Could not find details for the specified place ID",
      });
    }

    const placeDetails = detailsResponse.data.result;
    const destination = `${placeDetails.geometry.location.lat},${placeDetails.geometry.location.lng}`;

    // Then get distance and duration
    const distanceMatrixUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;
    const distanceResponse = await axios.get(distanceMatrixUrl);

    let distanceInfo = null;
    if (
      distanceResponse.data.rows &&
      distanceResponse.data.rows.length > 0 &&
      distanceResponse.data.rows[0].elements &&
      distanceResponse.data.rows[0].elements.length > 0
    ) {
      const element = distanceResponse.data.rows[0].elements[0];
      distanceInfo = {
        distance: element.distance ? element.distance.text : "Unknown",
        duration: element.duration ? element.duration.text : "Unknown",
        status: element.status,
      };
    }

    // Combine both results
    const combinedResult = {
      success: true,
      placeDetails: {
        name: placeDetails.name,
        address: placeDetails.formatted_address,
        phone: placeDetails.formatted_phone_number || "Not available",
        website: placeDetails.website || "Not available",
        rating: placeDetails.rating || "Not rated",
        opening_hours: placeDetails.opening_hours || null,
        location: placeDetails.geometry.location,
      },
      distanceInfo: distanceInfo,
    };

    res.json(combinedResult);
  } catch (error) {
    console.error("Service details with distance error:", error.message);
    res.status(500).json({
      error: "Failed to fetch combined service details",
      message: error.message,
    });
  }
});

module.exports = router;
