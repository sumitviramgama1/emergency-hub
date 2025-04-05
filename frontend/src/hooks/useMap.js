import { useState, useEffect } from 'react';

export const useMap = (location) => {
  const [map, setMap] = useState(null);
  const [advancedMarker, setAdvancedMarker] = useState(null);
  const [destinationMarker, setDestinationMarker] = useState(null);
  const [currentRoute, setCurrentRoute] = useState(null);

  // Default map center (New York City)
  const defaultCenter = { lat: 40.7128, lng: -74.006 };
  
  // Map container style
  const mapContainerStyle = {
    width: "100%",
    height: "300px",
  };

  // Get map center coordinates based on current location
  const getMapCenter = () => {
    if (location.latitude && location.longitude) {
      return { lat: location.latitude, lng: location.longitude };
    }
    return defaultCenter;
  };

  // Handler for when the map loads
  const handleMapLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  // Create user location marker
  useEffect(() => {
    if (map && location.latitude && location.longitude && window.google) {
      // Remove existing marker if there is one
      if (advancedMarker) {
        advancedMarker.map = null;
      }

      // Create a pin element for the marker
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

      // Add animation keyframes
      const style = document.createElement("style");
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

      pinElement.appendChild(pulse);

      // Create new advanced marker
      const AdvancedMarkerElement = window.google.maps.marker.AdvancedMarkerElement;
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
    }
    
    // Clean up function to remove marker when component unmounts
    return () => {
      if (advancedMarker) {
        advancedMarker.map = null;
      }
    };
  }, [map, location.latitude, location.longitude]);

  // Update marker position when location changes
  useEffect(() => {
    if (advancedMarker && location.latitude && location.longitude) {
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
        destinationMarker.setMap(null);
      }
    };
  }, []);

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
    handleMapLoad
  };
};