import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 dark:bg-blue-800 px-6 py-4">
            <h2 className="text-xl font-semibold text-white text-center">
              Emergency Assistance
            </h2>
          </div>
          
          <div className="p-8">
            <p className="mb-8 text-center text-gray-600 dark:text-gray-300 text-lg">
              Please select your login type:
            </p>

            <div className="space-y-5">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/user-login")}
                className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <AlertCircle size={20} />
                Normal User Login
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/service-provider-login")}
                className="w-full bg-green-600 dark:bg-green-700 text-white py-3 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <AlertCircle size={20} />
                Service Provider Login
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Landing;