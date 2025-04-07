import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import RoadsideAssistance from "./pages/RoadsideAssistance";
import MedicalEmergency from "./pages/MedicalEmergency";
import HospitalEmergency from "./pages/HospitalEmergency";
import FuelEmergency from "./pages/FuelEmergency";
import GeneralServices from "./pages/GeneralServices";
import ChatBot from "./components/ChatBot";
import { LocationProvider } from "./contexts/LocationContext";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import ServiceProviderLogin from "./pages/ServiceProviderLogin";
import ServiceProviderSignup from "./pages/ServiceProviderSignup";
import Landing from "./pages/Landing";
import ServiceProviderDashboard from "./pages/ServiceProviderDashboard";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <LocationProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Landing />} />{" "}
              {/* Landing page as default */}
              <Route path="/user-login" element={<UserLogin />} />
              <Route path="/user-signup" element={<UserSignup />} />
              <Route
                path="/service-provider-login"
                element={<ServiceProviderLogin />}
              />
              <Route
                path="/service-provider-signup"
                element={<ServiceProviderSignup />}
              />
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/home/*" element={<Home />} />
                <Route
                  path="/roadside-assistance"
                  element={<RoadsideAssistance />}
                />
                <Route
                  path="/medical-emergency"
                  element={<MedicalEmergency />}
                />
                <Route
                  path="/hospital-emergency"
                  element={<HospitalEmergency />}
                />
                <Route path="/fuel-emergency" element={<FuelEmergency />} />
                <Route path="/general-services" element={<GeneralServices />} />
                <Route
                  path="/service-provider-dashboard"
                  element={<ServiceProviderDashboard />}
                />
              </Route>
            </Routes>
          </main>
          <ChatBot />
        </div>
      </LocationProvider>
    </Router>
  );
}

export default App;
