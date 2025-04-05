// src/hooks/useRequests.js
import { useState, useEffect } from 'react';

const useRequests = (serviceProviderId) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {

    // setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/requests?serviceProviderId=${serviceProviderId}`
      );
      const data = await response.json();
      if (response.ok) {
        if (JSON.stringify(data) !== JSON.stringify(requests)) {
          setRequests(data); // Update only if there are changes
        }
      } else {
        setError(data.message || 'Failed to fetch requests');
      }
    } catch (error) {
      setError('Error fetching requests');
    } finally {
      setLoading(false);
    }
  };

  

  const acceptRequest = async (requestId) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/request/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId }),
      });

      const data = await response.json();
      if (response.ok) {
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req._id === requestId ? { ...req, status: 'accepted' } : req
          )
        );
      } else {
        setError(data.message || 'Failed to accept request');
      }
    } catch (error) {
      setError('Error accepting request');
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/request/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId }),
      });

      const data = await response.json();
      if (response.ok) {
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req._id === requestId ? { ...req, status: 'rejected' } : req
          )
        );
      } else {
        setError(data.message || 'Failed to reject request');
      }
    } catch (error) {
      setError('Error rejecting request');
    }
  };

  useEffect(() => {
    if (serviceProviderId) {
      // Fetch requests immediately when the component mounts or serviceProviderId changes
      fetchRequests();

      // Set up an interval to fetch requests every 3 seconds
      const intervalId = setInterval(fetchRequests, 3000);

      // Clear the interval when the component unmounts or serviceProviderId changes
      return () => clearInterval(intervalId);
    }
  }, [serviceProviderId]);

  return { requests, loading, error, acceptRequest, rejectRequest };
};

export default useRequests;