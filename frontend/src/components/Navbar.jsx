import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Phone, Ambulance, Fuel, MapPin, LogOut, AlertCircle, Grid } from "lucide-react";

function Navbar() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userRole = localStorage.getItem("role");
  const location = useLocation();
  const navigate = useNavigate();

  if (!isLoggedIn || location.pathname === "/" || location.pathname === "/user-login" || location.pathname === "/service-provider-login") {
    return null;
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleSOS = () => {
    window.location.href = "tel:112";
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left Side - Logo */}
        <div className="flex items-center">
          <Link to="/home" className="text-2xl font-extrabold text-blue-800 dark:text-blue-400 flex items-center gap-2">
            <Home size={24} />
            Emergency Assist
          </Link>
        </div>
        
        {/* Center - Navigation Links */}
        <div className="hidden md:flex items-center space-x-4">
          <Link 
            to="/roadside-assistance" 
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <MapPin size={16} />
            Roadside
          </Link>
          <Link 
            to="/medical-emergency" 
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Ambulance size={16} />
            Medical
          </Link>
          <Link 
            to="/hospital-emergency" 
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Phone size={16} />
            Hospital
          </Link>
          <Link 
            to="/fuel-emergency" 
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Fuel size={16} />
            Fuel
          </Link>
          <Link 
            to="/general-services" 
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Grid size={16} />
            Services
          </Link>
        </div>
        
        {/* Right Side - Action Buttons */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleSOS}
            className="relative inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full shadow-xl transform transition-all hover:scale-105"
          >
            <span className="absolute w-full h-full rounded-full animate-ping bg-red-400 opacity-75"></span>
            <AlertCircle size={16} />
            SOS
          </button>
          
          <button
            onClick={handleLogout}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;