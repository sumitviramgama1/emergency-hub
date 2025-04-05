import { useState, useEffect } from "react";
import {
  useMap,
  useNearbyServices,
  useRouting,
  useTroubleshootingGuides,
  useEmergencyService,
} from "../hooks";
import { useLocationContext } from "../contexts/LocationContext";
import GoogleMapComponent from "../components/GoogleMapComponent";
import {
  AlertCircle,
  MapPin,
  Phone,
  Globe,
  Navigation,
  Star,
  Info,
} from "lucide-react";
import useAuth from "../hooks/useAuth";

function FuelEmergency() {
  const { user } = useAuth();
  const EmergencyType = "fuel";
  const { location, locationName, loading, locationError, retryLocation } =
    useLocationContext();

  const {
    map,
    currentRoute,
    setCurrentRoute,
    destinationMarker,
    setDestinationMarker,
    mapContainerStyle,
    getMapCenter,
    handleMapLoad,
  } = useMap(location);

  const {
    servicesWithDistances,
    selectedService,
    setSelectedService,
    serviceDetails,
    loadingDetails,
    fetchServiceDetailsWithDistance,
  } = useNearbyServices(location, EmergencyType);

  const { displayRouteOnMap, updateRouteForNewPosition } = useRouting(
    location,
    map,
    setCurrentRoute,
    setDestinationMarker
  );

  const { guides, selectedGuide, openGuide, closeGuide } =
    useTroubleshootingGuides();

  const { emergencyLoading, handleSOS } = useEmergencyService(location);

  const fetchReqForStatus = async (serviceProviderPhone) => {
    try {
      const response = await axios.get(
        `import.meta.env.VITE_BACKEND_URL/api/auth/srequests`,
        {
          params: {
            userId: user.userId,
          },
        }
      );
      const data = await response.data;

      if (data.message === "Request accepted") {
        alert("Request accepted");
        window.location.href = `tel:${serviceProviderPhone}`;
      } else if (data.message === "Request rejected") {
        alert("Request rejected");
      } else if (data.message === "Request pending") {
        console.log("Request not yet accepted");
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const requestAssistance = async (serviceProviderPhone) => {
    if (!serviceProviderPhone || serviceProviderPhone === "Not available") {
      alert("Service provider phone number is not available");
      return;
    }
    if (!user) {
      alert("Please log in to request assistance");
      return;
    }

    try {
      const response = await fetch(
        "import.meta.env.VITE_BACKEND_URL/api/auth/request/send",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.userId, serviceProviderPhone }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Request sent successfully");
        setTimeout(() => {
          fetchReqForStatus(serviceProviderPhone); // Initial call after 15 seconds
          const intervalId = setInterval(
            () => fetchReqForStatus(serviceProviderPhone),
            4000
          );
        }, 8000);
      } else {
        console.log("Service provider not on this plateform yet");
        alert("Service provider not on this plateform yet");
      }
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  // Update route when location changes if a service is selected
  useEffect(() => {
    if (
      location.latitude &&
      location.longitude &&
      selectedService &&
      currentRoute
    ) {
      updateRouteForNewPosition(selectedService);
    }
  }, [location, selectedService, currentRoute]);

  // Function to handle requesting help
  const requestHelp = (service) => {
    alert(
      `Assistance requested from ${service.name}. They will contact you shortly.`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-800 dark:text-blue-400 mb-2">
            Fuel Assistance
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Find nearby fuel help when you need it most
          </p>
        </div>

        {/* SOS Button */}
        <div className="mb-12 text-center">
          <button
            onClick={handleSOS}
            disabled={emergencyLoading}
            className="relative inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-full text-xl shadow-xl transform transition-all hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
          >
            <span className="absolute w-full h-full rounded-full animate-ping bg-red-400 opacity-75"></span>
            <AlertCircle size={24} />
            <span>SOS EMERGENCY</span>
          </button>
        </div>

        {/* Two column layout for wider screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Location & Map */}
          <div className="lg:col-span-1">
            {/* Current Location Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-6">
              <div className="bg-blue-600 dark:bg-blue-800 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <MapPin size={20} />
                  Your Location
                </h2>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="flex flex-col items-center py-6 text-gray-500 dark:text-gray-400">
                    <p>Detecting your location...</p>
                    <div className="mt-4 w-10 h-10 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
                  </div>
                ) : locationError ? (
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
                    <p className="text-red-600 dark:text-red-400 mb-3">
                      {locationError}
                    </p>
                    <button
                      onClick={retryLocation}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="mr-3 bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
                        <MapPin className="text-blue-600 dark:text-blue-300" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Current coordinates
                        </p>
                        <p className="font-medium text-gray-700 dark:text-gray-300">
                          {location.latitude?.toFixed(4)},{" "}
                          {location.longitude?.toFixed(4)}
                        </p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Location:
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        {locationName || "Loading location name..."}
                      </p>
                    </div>
                    <div className="mt-6 w-full h-[300px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md">
                      <GoogleMapComponent
                        location={location}
                        mapContainerStyle={{
                          ...mapContainerStyle,
                          borderRadius: "0.75rem",
                        }}
                        handleMapLoad={handleMapLoad}
                        map={map}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Troubleshooting */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-6">
              <div className="bg-blue-600 dark:bg-blue-800 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Info size={20} />
                  Common Issues
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-3">
                  {guides
                    .filter((guide) => guide.category === "fuel")
                    .map((guide) => (
                      <div
                        key={guide.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors hover:border-blue-300 dark:hover:border-blue-600"
                        onClick={() => openGuide(guide.id)}
                      >
                        <h3 className="font-semibold text-blue-700 dark:text-blue-400">
                          {guide.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {guide.description}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Display Selected Guide Content */}
            {selectedGuide && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-blue-600 dark:bg-blue-800 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">
                    {selectedGuide.title}
                  </h2>
                  <button
                    onClick={closeGuide}
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
                      {selectedGuide.description}
                    </p>
                  </div>
                  <div className="mt-4 prose dark:prose-invert max-w-none">
                    <pre className="text-sm text-gray-800 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                      {selectedGuide.content}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Nearby Services */}
          <div className="lg:col-span-2">
            {/* Nearby Services */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-blue-600 dark:bg-blue-800 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Phone size={20} />
                  Nearby Fuel Services
                </h2>
              </div>
              <div className="p-6">
                {!location.latitude || !location.longitude ? (
                  <div className="text-center py-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-100 dark:border-yellow-800">
                    <p className="text-yellow-700 dark:text-yellow-500">
                      Please enable location to find nearby services
                    </p>
                  </div>
                ) : servicesWithDistances.length === 0 ? (
                  <div className="flex flex-col items-center py-10 text-gray-500 dark:text-gray-400">
                    <p>Finding nearby services...</p>
                    <div className="mt-4 w-10 h-10 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {servicesWithDistances.map((service) => (
                      <div
                        key={service.place_id}
                        className={`rounded-xl border transition-all ${
                          serviceDetails &&
                          serviceDetails.placeDetails &&
                          serviceDetails.placeDetails.name === service.name
                            ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600 shadow-md"
                            : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
                        }`}
                      >
                        <div className="p-5">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                                {service.name}
                              </h3>
                              <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                                <span className="capitalize px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs mr-2">
                                  {service.types[0].replace("_", " ")}
                                </span>
                                {service.distanceInfo && (
                                  <>
                                    <span className="flex items-center gap-1 mr-3">
                                      <Navigation size={14} />
                                      {service.distanceInfo.distance}
                                    </span>
                                    <span className="mr-3">
                                      ETA: {service.distanceInfo.duration}
                                    </span>
                                  </>
                                )}
                                <span className="flex items-center gap-1">
                                  <Star size={14} className="text-yellow-500" />
                                  {service.rating}/5
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-end space-x-3 min-w-max">
                              <button
                                onClick={() =>
                                  fetchServiceDetailsWithDistance(service)
                                }
                                className="w-32 px-4 py-2 text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors dark:text-blue-400 dark:border-blue-800 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 whitespace-nowrap"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() =>
                                  displayRouteOnMap(
                                    service,
                                    currentRoute,
                                    destinationMarker
                                  )
                                }
                                className="w-32 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap"
                              >
                                Show Route
                              </button>
                            </div>
                          </div>

                          {/* Service Details Section - Shows when a service is selected */}
                          {serviceDetails &&
                            serviceDetails.placeDetails &&
                            serviceDetails.placeDetails.name ===
                              service.name && (
                              <div className="mt-5 p-5 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-700">
                                {loadingDetails ? (
                                  <div className="flex justify-center items-center py-6">
                                    <div className="w-8 h-8 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
                                  </div>
                                ) : (
                                  <>
                                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-4">
                                      Contact Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div className="flex items-start gap-3">
                                        <div className="mt-1 bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
                                          <MapPin
                                            size={16}
                                            className="text-blue-600 dark:text-blue-300"
                                          />
                                        </div>
                                        <div>
                                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Address:
                                          </p>
                                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            {
                                              serviceDetails.placeDetails
                                                .address
                                            }
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-start gap-3">
                                        <div className="mt-1 bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
                                          <Phone
                                            size={16}
                                            className="text-blue-600 dark:text-blue-300"
                                          />
                                        </div>
                                        <div>
                                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Phone:
                                          </p>
                                          <p className="text-sm mt-1">
                                            {serviceDetails.placeDetails
                                              .phone !== "Not available" ? (
                                              <button
                                                onClick={() =>
                                                  requestAssistance(
                                                    serviceDetails.placeDetails.phone.replace(
                                                      /^0/,
                                                      "+91"
                                                    )
                                                  )
                                                }
                                                className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg flex items-center gap-1 transition-all shadow-sm hover:shadow font-medium"
                                              >
                                                <Phone size={14} />
                                                Click For Call
                                              </button>
                                            ) : (
                                              <span className="text-gray-500 dark:text-gray-400">
                                                Not available
                                              </span>
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-start gap-3">
                                        <div className="mt-1 bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
                                          <Globe
                                            size={16}
                                            className="text-blue-600 dark:text-blue-300"
                                          />
                                        </div>
                                        <div>
                                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Website:
                                          </p>
                                          <p className="text-sm mt-1">
                                            {serviceDetails.placeDetails
                                              .website !== "Not available" ? (
                                              <a
                                                href={
                                                  serviceDetails.placeDetails
                                                    .website
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline dark:text-blue-400"
                                              >
                                                Visit Website
                                              </a>
                                            ) : (
                                              <span className="text-gray-500 dark:text-gray-400">
                                                Not available
                                              </span>
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-start gap-3">
                                        <div className="mt-1 bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
                                          <Navigation
                                            size={16}
                                            className="text-blue-600 dark:text-blue-300"
                                          />
                                        </div>
                                        <div>
                                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Distance & ETA:
                                          </p>
                                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            {service.distanceInfo ? (
                                              <>
                                                {service.distanceInfo.distance}{" "}
                                                •{" "}
                                                {service.distanceInfo.duration}
                                              </>
                                            ) : (
                                              "Calculating route..."
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Call to action buttons */}
                                    <div className="mt-6 flex justify-end gap-3">
                                      <button
                                        onClick={() =>
                                          displayRouteOnMap(
                                            service,
                                            currentRoute,
                                            destinationMarker
                                          )
                                        }
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                      >
                                        <Navigation size={16} />
                                        Navigate
                                      </button>

                                      {serviceDetails.placeDetails.phone !==
                                      "Not available" ? (
                                        <button
                                          onClick={() =>
                                            requestAssistance(service)
                                          }
                                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                        >
                                          <Phone size={16} />
                                          Call for Assistance
                                        </button>
                                      ) : (
                                        <button
                                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                          onClick={() => requestHelp(service)}
                                        >
                                          Request Assistance
                                        </button>
                                      )}
                                    </div>
                                  </>
                                )}
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

export default FuelEmergency;
