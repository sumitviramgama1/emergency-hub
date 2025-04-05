import React from 'react';
import { Link, Routes, Route } from "react-router-dom";

const services = [
  {
    title: "Roadside Assistance",
    description: "Get immediate help for vehicle breakdowns",
    path: "/roadside-assistance",
    icon: "🚗",
  },
  {
    title: "Medical Emergency",
    description: "Quick access to medical services",
    path: "/medical-emergency",
    icon: "🏥",
  },
  {
    title: "Hospital Emergency",
    description: "Find hospitals and check bed availability",
    path: "/hospital-emergency",
    icon: "🚑",
  },
  {
    title: "Fuel Emergency",
    description: "Locate nearest fuel stations",
    path: "/fuel-emergency",
    icon: "⛽",
  },
  {
    title: "General Services",
    description: "Find stores and restaurants nearby",
    path: "/general-services",
    icon: "🏪",
  },
];

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={
            <>
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 dark:text-blue-400 mb-4">
                  Emergency Assistance Services
                </h1>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
                  Quick access to essential emergency services when you need them most
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service) => (
                  <Link
                    key={service.path}
                    to={service.path}
                    className="group bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
                  >
                    <div className="p-8">
                      <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                        {service.icon}
                      </div>
                      <h2 className="text-2xl font-semibold mb-3 text-blue-800 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                        {service.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">{service.description}</p>
                    </div>
                    <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </Link>
                ))}
              </div>

              <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-6 md:mb-0 md:mr-8">
                    <h2 className="text-3xl font-bold mb-4">24/7 Emergency Support</h2>
                    <p className="text-blue-100 text-lg mb-6">
                      Need immediate assistance? Our AI chatbot is available 24/7 to help
                      you with:
                    </p>
                    <ul className="space-y-3">
                      {[
                        "Vehicle troubleshooting",
                        "First aid guidance",
                        "Directions to nearest facilities",
                        "Emergency contact information"
                      ].map((item, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-blue-300 rounded-full mr-3"></span>
                          <span className="text-blue-50">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-shrink-0 w-full md:w-1/3">
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                      <div className="text-center">
                        <span className="inline-block animate-pulse bg-green-400 w-3 h-3 rounded-full mb-4"></span>
                        <h3 className="text-xl font-semibold mb-2">AI Assistant Online</h3>
                        <p className="text-blue-100">Average response time: &lt;30 seconds</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          } />
          {/* Add placeholder routes for each service */}
          {services.map(service => (
            <Route 
              key={service.path}
              path={service.path}
              element={
                <div className="text-center py-12 min-h-screen bg-gray-50 dark:bg-gray-900">
                  <h1 className="text-3xl font-bold mb-4 text-blue-800 dark:text-blue-400">{service.title}</h1>
                  <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
                  <Link 
                    to="/" 
                    className="mt-8 inline-block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    ← Back to Home
                  </Link>
                </div>
              }
            />
          ))}
        </Routes>
      </div>
    </div>
  );
}

export default App;