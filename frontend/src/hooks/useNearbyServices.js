import { useState, useEffect } from 'react';
import axios from 'axios';

export const useNearbyServices = (location,EmergencyType) => {
  const [nearbyServices, setNearbyServices] = useState([]);
  const [servicesWithDistances, setServicesWithDistances] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceDetails, setServiceDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Fetch nearby services based on location
  useEffect(() => {
    if (location.latitude && location.longitude) {
      const fetchNearbyServices = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/roadside-services/nearby?latitude=${location.latitude}&longitude=${location.longitude}&EmergencyType=${EmergencyType}`
          );

          if (response.data.results) {
            setNearbyServices(response.data.results);
          } else {
            throw new Error("Failed to fetch nearby services");
          }
        } catch (error) {
          console.error("Error fetching nearby services:", error);
          setNearbyServices([]);
        }
      };
      fetchNearbyServices();
    }
  }, [location]);

  // Get distance and duration to a service
  const getDistanceDuration = async (service) => {
    if (!location.latitude || !location.longitude || !service.geometry) {
      return null;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/roadside-services/distance-duration`,
        {
          params: {
            origins: `${location.latitude},${location.longitude}`,
            destinations: `${service.geometry.location.lat},${service.geometry.location.lng}`,
          },
        }
      );

      if (response.data && response.data.results && response.data.results.success) {
        return {
          distance: response.data.results.distance,
          duration: response.data.results.duration,
          status: response.data.results.status,
        };
      }

      return null;
    } catch (error) {
      console.error("Error calculating distance and duration:", error);
      return null;
    }
  };

  // Add distance and duration information to services
  useEffect(() => {
    const addDistanceInfo = async () => {
      if (nearbyServices.length > 0 && location.latitude && location.longitude) {
        const updatedServices = await Promise.all(
          nearbyServices.map(async (service) => {
            const distanceInfo = await getDistanceDuration(service);
            return {
              ...service,
              distanceInfo,
            };
          })
        );
        setServicesWithDistances(updatedServices);
      }
    };

    addDistanceInfo();
  }, [nearbyServices, location]);

  // Fetch service details
  const fetchServiceDetailsWithDistance = async (service) => {
    if (!location.latitude || !location.longitude) return;

    setLoadingDetails(true);
    try {
      const origin = `${location.latitude},${location.longitude}`;
      const response = await axios.get(
        `http://localhost:5000/api/roadside-services/service-details-with-distance`,
        {
          params: {
            placeId: service.place_id,
            origin: origin,
          },
        }
      );
      if (response.data && response.data.success) {
        setServiceDetails(response.data);
        // setSelectedService(service);
      } else {
        throw new Error("Failed to fetch service details");
      }
    } catch (error) {
      console.error("Error fetching service details:", error);
      alert("Unable to fetch service details at this time.");
    } finally {
      setLoadingDetails(false);
    }
  };

  return {
    nearbyServices,
    servicesWithDistances,
    selectedService,
    setSelectedService,
    serviceDetails,
    setServiceDetails,
    loadingDetails,
    getDistanceDuration,
    fetchServiceDetailsWithDistance
  };
};