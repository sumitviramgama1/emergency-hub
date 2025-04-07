// routes/locationRoute.js
const express = require('express');
const { getCurrentLocation, getLocationName } = require('../controllers/locationController');
const cors = require("cors");



const router = express.Router();
const corsOptions = {
  origin: ["https://emergency-hub-kxyn.vercel.app", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};
// Route to get current location using Google Maps Geolocation API
router.post('/current-location',cors(corsOptions), getCurrentLocation);

// Route to get location name using Google Maps Geocoding API
router.get('/location-name',cors(corsOptions), getLocationName);

module.exports = router;