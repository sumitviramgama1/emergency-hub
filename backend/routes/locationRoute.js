// routes/locationRoute.js
const express = require('express');
const { getCurrentLocation, getLocationName } = require('../controllers/locationController');

const router = express.Router();

// Route to get current location using Google Maps Geolocation API
router.post('/current-location', getCurrentLocation);

// Route to get location name using Google Maps Geocoding API
router.get('/location-name', getLocationName);

module.exports = router;