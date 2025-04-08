import { useState } from 'react';
import axios from 'axios';

export const useRouting = (location, map, setCurrentRoute, setDestinationMarker) => {
  // Get route to a service
  const API_URL = import.meta.env.VITE_BACKEND_URL; // Use environment variable for API URL
  const getRouteToService = async (service) => {
    if (!location.latitude || !location.longitude || !service.geometry) {
      return null;
    }

    try {
      const response = await axios.get(
        `${API_URL}/api/roadside-services/route`,
        {
          params: {
            origin: `${location.latitude},${location.longitude}`,
            destination: `${service.geometry.location.lat},${service.geometry.location.lng}`,
          },
        }
      );

      if (response.data && response.data.success) {
        return response.data;
      }
      return null;
    }catch (error) {
      console.error("Error calculating route:", error);
      return null;
    }
  };

  // Display route on map
  // Display route on map
  const displayRouteOnMap = async (service,currentRoute,destinationMarker) => {
    if (!map || !service) return;

    // Clear any existing route
    if (currentRoute) {
        currentRoute.setMap(null);
        setCurrentRoute(null);
    }

    // Clear any existing destination marker
    if (destinationMarker) {
        destinationMarker.setMap(null);
        setDestinationMarker(null);
    }

    // Get route data
    const routeData = await getRouteToService(service);

    if (routeData && routeData.polyline) {
        // Decode the polyline
        const path = window.google.maps.geometry.encoding.decodePath(routeData.polyline);

        // Create a new polyline
        const routePolyline = new window.google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor: "#4285F4",
            strokeOpacity: 1.0,
            strokeWeight: 5,
        });

        // Add the polyline to the map
        routePolyline.setMap(map);

        // Store the polyline for later removal
        setCurrentRoute(routePolyline);

        // Create a new destination marker
        const destinationPosition = {
            lat: service.geometry.location.lat,
            lng: service.geometry.location.lng,
        };
        const newDestinationMarker = new window.google.maps.Marker({
            position: destinationPosition,
            map: map,
            title: service.name,
            icon: {
                url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                scaledSize: new window.google.maps.Size(40, 40),
            },
        });

        setDestinationMarker(newDestinationMarker);

        // Adjust map bounds
        const bounds = new window.google.maps.LatLngBounds();
        path.forEach((point) => bounds.extend(point));
        map.fitBounds(bounds);

        return routeData;
    } else {
        alert("Unable to calculate route at this time.");
        return null;
    }
};

  


  // Update route when location changes
  const updateRouteForNewPosition = async (service) => {
    if (!service || !map) return;

    try {
      // Get updated route data using current location
      const routeData = await getRouteToService(service);

      if (routeData && routeData.polyline) {
        // Try to get the current route from the map
        let currentRoute = null;
        try {
          // Get the current route value by calling the getter function
          const routeElements = document.querySelectorAll('polyline');
          routeElements.forEach(element => {
            if (element.__gm_polyline) {
              currentRoute = element.__gm_polyline;
            }
          });
        } catch (err) {
          console.error("Error accessing current route:", err);
        }

        // Remove old route
        if (currentRoute) {
          currentRoute.setMap(null);
        }

        // Decode the new polyline
        const path = window.google.maps.geometry.encoding.decodePath(routeData.polyline);

        // Create a new polyline with updated path
        const routePolyline = new window.google.maps.Polyline({
          path: path,
          geodesic: true,
          strokeColor: "#4285F4",
          strokeOpacity: 1.0,
          strokeWeight: 5,
        });

        // Add the polyline to the map
        routePolyline.setMap(map);

        // Store the polyline for later removal
        setCurrentRoute(routePolyline);

        return routeData;
      }
    } catch (error) {
      console.error("Error updating route:", error);
      return null;
    }
  };

  return {
    getRouteToService,
    displayRouteOnMap,
    updateRouteForNewPosition
  };
};