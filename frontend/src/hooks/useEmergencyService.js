import { useState } from 'react';
import axios from 'axios';

export const useEmergencyService = (location) => {
  const [emergencyStatus, setEmergencyStatus] = useState(null);
  const [emergencyLoading, setEmergencyLoading] = useState(false);

  const handleSOS = async () => {
    if (!location.latitude || !location.longitude) {
      alert("Cannot send SOS without location data. Please enable location services.");
      return;
    }

    try {
      setEmergencyLoading(true);
      // In a real app, this would send an emergency request to a service
      // For now, we'll simulate it with a timeout
      
      // Simulated API call
      /*
      const response = await axios.post(
        'http://localhost:5000/api/emergency/sos',
        {
          location: {
            latitude: location.latitude,
            longitude: location.longitude
          },
          user: {
            // User details would go here
          }
        }
      );
      */
      
      // Simulate API response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setEmergencyStatus({
        status: 'dispatched',
        message: 'SOS Emergency request sent! Help is being dispatched to your location immediately.',
        eta: '15 minutes'
      });
      
      window.location.href = "tel:112";
    } catch (error) {
      console.error("Error sending SOS:", error);
      setEmergencyStatus({
        status: 'failed',
        message: 'Failed to send emergency request. Please try again or call emergency services directly.'
      });
      alert("Failed to send emergency request. Please try again or call emergency services directly.");
    } finally {
      setEmergencyLoading(false);
    }
  };

  return {
    emergencyStatus,
    emergencyLoading,
    handleSOS
  };
};
