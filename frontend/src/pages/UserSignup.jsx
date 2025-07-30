import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, User, Lock, Phone } from "lucide-react";

const UserSignup = () => {
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const navigate = useNavigate();

  const countryCodes = [
    { code: "+1", name: "United States" },
    { code: "+44", name: "United Kingdom" },
    { code: "+91", name: "India" },
    { code: "+61", name: "Australia" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/auth/register/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          phoneNumber: `${countryCode}${phoneNumber}`,
        }),
      });

      const data = await response.json();
      console.log("Signup response:", data); // 👈 Add this

      if (response.ok) {
        alert("Signup successful!");
        navigate("/user-login");
      } else {
        alert(
          `Signup failed: ${data.error || data.details || "Unknown error"}`
        );
      }
    } catch (err) {
      alert("Network error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 dark:bg-blue-800 px-6 py-4">
            <h2 className="text-xl font-semibold text-white text-center flex items-center justify-center gap-2">
              <AlertCircle size={20} />
              User Signup
            </h2>
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

            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <div className="flex">
                <select
                  className="w-1/4 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg mr-2 bg-transparent dark:text-white"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
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
                to="/user-login"
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

export default UserSignup;
