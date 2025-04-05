import React, { useEffect } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

const googleMapsLibraries = ["marker", "geometry"];

const GoogleMapComponent = ({
  location,
  mapContainerStyle,
  map,
  handleMapLoad,
  children,
}) => {
  // Default map center (if location not available)
  const getMapCenter = () => {
    if (location?.latitude && location?.longitude) {
      return { lat: location.latitude, lng: location.longitude };
    }
    return { lat: 40.7128, lng: -74.006 }; // Default to NYC
  };

  // Use provided mapContainerStyle or default
  const defaultMapContainerStyle = {
    width: "100%",
    height: "300px",
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  return (
    <div className="w-full h-full flex justify-center items-center bg-gray-200 rounded-lg overflow-hidden">
      <LoadScript googleMapsApiKey={apiKey} libraries={googleMapsLibraries}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle || defaultMapContainerStyle}
          zoom={15}
          center={getMapCenter()}
          onLoad={handleMapLoad}
          options={{ mapId: "f6811b41ce35d169" }}
        >
          {children}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default GoogleMapComponent;
