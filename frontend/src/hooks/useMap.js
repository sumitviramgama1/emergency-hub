// src/hooks/useMap.js
import { useState, useEffect, useCallback } from 'react';

export const useMap = (location) => {
  const [map, setMap] = useState(null);
  const [advancedMarker, setAdvancedMarker] = useState(null);
  const [destinationMarker, setDestinationMarker] = useState(null);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Default map center (New York City)
  const defaultCenter = { lat: 40.7128, lng: -74.006 };
  
  // Map container style
  const mapContainerStyle = {
    width: "100%",
    height: "300px",
  };

  // Get map center coordinates based on current location
  const getMapCenter = useCallback(() => {
    if (location?.latitude && location?.longitude) {
      return { lat: location.latitude, lng: location.longitude };
    }
    return defaultCenter;
  }, [location, defaultCenter]);

  // Create marker element
  const createMarkerElement = () => {
    const pinElement = document.createElement("div");
    pinElement.innerHTML = `
      <div style="
        background-color: #4285F4;
        border-radius: 50%;
        border: 4px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,.3);
        height: 24px;
        width: 24px;
        position: relative;
        cursor: pointer;
        transform: scale(1);
        transition: transform 0.2s ease-in-out;
      "></div>
    `;

    // Add pulse animation effect
    const pulse = document.createElement("div");
    pulse.innerHTML = `
      <div style="
        background-color: rgba(66, 133, 244, 0.2);
        border-radius: 50%;
        height: 40px;
        width: 40px;
        position: absolute;
        top: -12px;
        left: -12px;
        animation: pulse 1.5s infinite;
      "></div>
    `;

    // Check if the animation already exists
    if (!document.getElementById('map-marker-pulse-animation')) {
      // Add animation keyframes
      const style = document.createElement("style");
      style.id = 'map-marker-pulse-animation';
      style.innerHTML = `
        @keyframes pulse {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          70% {
            transform: scale(1.5);
            opacity: 0;
          }
          100% {
            transform: scale(0.8);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    pinElement.appendChild(pulse);
    
    return pinElement;
  };

  // Handler for when the map loads
  const handleMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
    setMapLoaded(true);
  }, []);

  // Create user location marker
  useEffect(() => {
    if (!map || !location?.latitude || !location?.longitude || !window.google) {
      return;
    }
    
    try {
      // Remove existing marker if there is one
      if (advancedMarker) {
        advancedMarker.map = null;
      }

      const pinElement = createMarkerElement();
      
      // Create new advanced marker
      const AdvancedMarkerElement = window.google.maps.marker.AdvancedMarkerElement;
      if (!AdvancedMarkerElement) {
        console.error("AdvancedMarkerElement not available");
        return;
      }
      
      const newMarker = new AdvancedMarkerElement({
        map,
        position: { lat: location.latitude, lng: location.longitude },
        title: "Your location",
        content: pinElement,
      });

      setAdvancedMarker(newMarker);

      // Add hover effect
      pinElement.addEventListener("mouseover", () => {
        pinElement.firstChild.style.transform = "scale(1.2)";
      });

      pinElement.addEventListener("mouseout", () => {
        pinElement.firstChild.style.transform = "scale(1)";
      });

      // Add click event for marker
      newMarker.addListener("gmp-click", () => {
        alert(`Your current location`);
      });
    } catch (error) {
      console.error("Error creating advanced marker:", error);
    }
    
    // Clean up function
    return () => {
      if (advancedMarker) {
        advancedMarker.map = null;
      }
    };
  }, [map, location?.latitude, location?.longitude]);

  // Update marker position when location changes
  useEffect(() => {
    if (advancedMarker && location?.latitude && location?.longitude) {
      advancedMarker.position = { lat: location.latitude, lng: location.longitude };
    }
  }, [location, advancedMarker]);

  // Clean up route and destination marker when component unmounts
  useEffect(() => {
    return () => {
      if (currentRoute) {
        currentRoute.setMap(null);
      }
      if (destinationMarker) {
        destinationMarker.map = null;
      }
      if (advancedMarker) {
        advancedMarker.map = null;
      }
    };
  }, []);

  // Create a route between current location and destination
  const createRoute = useCallback((destination) => {
    if (!map || !location?.latitude || !location?.longitude || !window.google) {
      return;
    }
    
    // Clear existing route
    if (currentRoute) {
      currentRoute.setMap(null);
    }
    
    // Clear existing destination marker
    if (destinationMarker) {
      destinationMarker.map = null;
    }
    
    try {
      // Create destination marker
      const AdvancedMarkerElement = window.google.maps.marker.AdvancedMarkerElement;
      const newDestMarker = new AdvancedMarkerElement({
        map,
        position: destination,
        title: "Destination",
      });
      
      setDestinationMarker(newDestMarker);
      
      // Create route
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map,
        suppressMarkers: true, // We're using our own markers
      });
      
      directionsService.route({
        origin: { lat: location.latitude, lng: location.longitude },
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      }, (response, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(response);
          setCurrentRoute(directionsRenderer);
        } else {
          console.error('Directions request failed due to ' + status);
        }
      });
    } catch (error) {
      console.error("Error creating route:", error);
    }
  }, [map, location, currentRoute, destinationMarker]);

  return {
    map,
    setMap,
    advancedMarker,
    setAdvancedMarker,
    destinationMarker,
    setDestinationMarker,
    currentRoute,
    setCurrentRoute,
    defaultCenter,
    mapContainerStyle,
    getMapCenter,
    handleMapLoad,
    createRoute,
    mapLoaded
  };
};