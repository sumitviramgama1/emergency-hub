import { useState } from "react";
import useAuth from "../hooks/useAuth";
import useRequests from "../hooks/useRequests";
import { useLocationContext } from "../contexts/LocationContext";
import { 
  AlertCircle, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle,
  Bell,
  MapPin
} from "lucide-react";

function ServiceProviderDashboard() {
  const { user } = useAuth();
  const { requests, loading, error, acceptRequest, rejectRequest } = useRequests(
    user ? user.userId : null
  );
  
  // For location context
  const { location, locationName } = useLocationContext();
  
  // State for selected request details
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Handle accept request
  const handleAcceptRequest = async (requestId) => {
    try {
      await acceptRequest(requestId);
      // Close the detailed view if it's the same request
      if (selectedRequest && selectedRequest._id === requestId) {
        setSelectedRequest(prev => ({...prev, status: 'accepted'}));
      }
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  // Handle reject request
  const handleRejectRequest = async (requestId) => {
    try {
      await rejectRequest(requestId);
      // Close the detailed view if it's the same request
      if (selectedRequest && selectedRequest._id === requestId) {
        setSelectedRequest(prev => ({...prev, status: 'rejected'}));
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="mt-4 text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  // Count requests by status
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const completedRequests = requests.filter(r => r.status === 'accepted').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-800 dark:text-blue-400 mb-2">
            Service Provider Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome, Service Provider! This is your dedicated dashboard. You can manage your services, view requests, and more.
          </p>
        </div>

        {/* Pending Requests Button */}
        <div className="mb-12 text-center">
          <button
            className="relative inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full text-xl shadow-xl transform transition-all hover:scale-105"
          >
            <Bell size={24} />
            <span>{pendingRequests || 0} PENDING REQUESTS</span>
          </button>
        </div>

        {/* Two column layout for wider screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Provider Info */}
          <div className="lg:col-span-1">
            {/* Provider Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-6">
              <div className="bg-blue-600 dark:bg-blue-800 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <User size={20} />
                  Provider Information
                </h2>
              </div>
              <div className="p-6">
                {!user ? (
                  <div className="flex flex-col items-center py-6 text-gray-500 dark:text-gray-400">
                    <p>Loading profile information...</p>
                    <div className="mt-4 w-10 h-10 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="mr-3 bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
                        <User className="text-blue-600 dark:text-blue-300" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Provider ID
                        </p>
                        <p className="font-medium text-gray-700 dark:text-gray-300">
                          {user.userId || "Not available"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Service Area:
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        {locationName || "Loading location name..."}
                      </p>
                    </div>
                    
                    {/* Statistics */}
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl p-4 text-center">
                        <p className="text-green-600 dark:text-green-400 text-2xl font-bold">
                          {completedRequests || 0}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Completed
                        </p>
                      </div>
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded-xl p-4 text-center">
                        <p className="text-yellow-600 dark:text-yellow-400 text-2xl font-bold">
                          {pendingRequests || 0}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Pending
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-6">
              <div className="bg-blue-600 dark:bg-blue-800 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <AlertCircle size={20} />
                  Quick Actions
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-3">
                  <button className="border border-blue-200 dark:border-blue-700 rounded-xl p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors hover:border-blue-300 dark:hover:border-blue-600 text-left">
                    <h3 className="font-semibold text-blue-700 dark:text-blue-400">
                      Update Availability
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Set your service hours and area coverage
                    </p>
                  </button>
                  <button className="border border-blue-200 dark:border-blue-700 rounded-xl p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors hover:border-blue-300 dark:hover:border-blue-600 text-left">
                    <h3 className="font-semibold text-blue-700 dark:text-blue-400">
                      Update Services
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Manage the types of services you offer
                    </p>
                  </button>
                  <button className="border border-blue-200 dark:border-blue-700 rounded-xl p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors hover:border-blue-300 dark:hover:border-blue-600 text-left">
                    <h3 className="font-semibold text-blue-700 dark:text-blue-400">
                      View Analytics
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Check your performance and earnings
                    </p>
                  </button>
                </div>
              </div>
            </div>

            {/* Selected Request Details */}
            {selectedRequest && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-blue-600 dark:bg-blue-800 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">
                    Request Details
                  </h2>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="bg-blue-500 hover:bg-blue-400 text-white p-2 rounded-full transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 mb-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      Details for request from user: {selectedRequest.userId}
                    </p>
                  </div>
                  <div className="mt-4 space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-700">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                        User ID
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedRequest.userId || "Not specified"}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-700">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                        Created At
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(selectedRequest.createdAt).toLocaleString() || "Not specified"}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-700">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                        Status
                      </h4>
                      <p className={`text-sm font-medium px-3 py-1 rounded-full inline-block ${
                        selectedRequest.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-600' 
                          : selectedRequest.status === 'accepted'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-600'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-600'
                      }`}>
                        {selectedRequest.status || "Unknown"}
                      </p>
                    </div>
                    
                    {/* Action buttons for pending requests */}
                    {selectedRequest.status === 'pending' && (
                      <div className="mt-6 flex justify-end gap-3">
                        <button
                          onClick={() => handleAcceptRequest(selectedRequest._id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          <CheckCircle size={16} />
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectRequest(selectedRequest._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          <XCircle size={16} />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Pending Requests */}
          <div className="lg:col-span-2">
            {/* Pending Requests */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-blue-600 dark:bg-blue-800 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Clock size={20} />
                  Requests
                </h2>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="flex flex-col items-center py-10 text-gray-500 dark:text-gray-400">
                    <p>Loading requests...</p>
                    <div className="mt-4 w-10 h-10 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-6 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800">
                    <p className="text-red-700 dark:text-red-500">{error}</p>
                  </div>
                ) : requests.length === 0 ? (
                  <div className="text-center py-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                    <p className="text-blue-700 dark:text-blue-400 font-medium">
                      No requests found
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      You'll be notified when new requests arrive
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {requests.map((request) => (
                      <div
                        key={request._id}
                        className={`rounded-xl border transition-all ${
                          selectedRequest && selectedRequest._id === request._id
                            ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600 shadow-md"
                            : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
                        }`}
                      >
                        <div className="p-5">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                                Request from User ID: {request.userId}
                              </h3>
                              <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                                <span className={`px-2 py-1 rounded-full text-xs mr-2 ${
                                  request.status === 'pending' 
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-600' 
                                    : request.status === 'accepted'
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-600'
                                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-600'
                                }`}>
                                  Status: {request.status}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock size={14} className="text-gray-500" />
                                  {new Date(request.createdAt).toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-end space-x-3 min-w-max">
                              <button
                                onClick={() => setSelectedRequest(request)}
                                className="w-32 px-4 py-2 text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors dark:text-blue-400 dark:border-blue-800 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 whitespace-nowrap"
                              >
                                View Details
                              </button>
                            </div>
                          </div>

                          {/* Request Actions */}
                          {request.status === 'pending' && (
                            <div className="mt-5 p-5 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-700">
                              <div className="flex flex-col sm:flex-row items-center justify-between">
                                <p className="text-gray-700 dark:text-gray-300 mb-4 sm:mb-0">
                                  Do you want to accept this service request?
                                </p>
                                <div className="flex gap-3">
                                  <button
                                    onClick={() => handleAcceptRequest(request._id)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                  >
                                    <CheckCircle size={16} />
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleRejectRequest(request._id)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                  >
                                    <XCircle size={16} />
                                    Reject
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceProviderDashboard;