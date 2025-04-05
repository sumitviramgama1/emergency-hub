import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, User, Lock, Phone, Info } from "lucide-react";

const ServiceProviderSignup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const navigate = useNavigate();

  const countryCodes = [
    { code: "+1", name: "United States" },
    { code: "+44", name: "United Kingdom" },
    { code: "+91", name: "India" },
    { code: "+61", name: "Australia" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(
      "import.meta.env.VITE_BACKEND_URL/api/auth/register/service-provider",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          serviceType,
          phoneNumber: `${countryCode}${phoneNumber}`,
        }),
      }
    );
    const data = await response.json();
    if (data.message) {
      navigate("/service-provider-login");
    } else {
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 dark:bg-blue-800 px-6 py-4">
            <h2 className="text-xl font-semibold text-white text-center flex items-center justify-center gap-2">
              <AlertCircle size={20} />
              Service Provider Signup
            </h2>
          </div>

          {/* Google Maps Phone Number Notice */}
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4 mb-2 mx-4 mt-4 rounded">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  <strong>Important:</strong> Please use the same phone number
                  that is registered with your service on Google Maps. This
                  helps us verify your business identity.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
                <div className="pl-3 text-gray-500 dark:text-gray-400">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-transparent dark:text-white focus:outline-none"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
                <div className="pl-3 text-gray-500 dark:text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  className="w-full px-3 py-2 bg-transparent dark:text-white focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Service Type
              </label>
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
                <div className="pl-3 text-gray-500 dark:text-gray-400">
                  <AlertCircle size={20} />
                </div>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-transparent dark:text-white focus:outline-none"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Phone Number{" "}
                <span className="text-blue-600 dark:text-blue-400 text-sm">
                  (as listed on Google Maps)
                </span>
              </label>
              <div className="flex">
                <select
                  className="w-1/4 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg mr-2 bg-transparent dark:text-white"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  {countryCodes.map((country) => (
                    <option
                      key={country.code}
                      value={country.code}
                      className="dark:bg-gray-800"
                    >
                      {country.code}
                    </option>
                  ))}
                </select>
                <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg w-3/4">
                  <div className="pl-3 text-gray-500 dark:text-gray-400">
                    <Phone size={20} />
                  </div>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-transparent dark:text-white focus:outline-none"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    placeholder="Use Google Maps registered number"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300"
            >
              Sign Up
            </button>

            <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/service-provider-login"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderSignup;
