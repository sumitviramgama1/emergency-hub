import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Shield } from 'lucide-react';

function ContactUs() {
  const handleCall = () => {
    window.location.href = "tel:+916353823676";
  };

  const handleEmail = () => {
    window.location.href = "mailto:sumitviramgama1@gmail.com";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto pt-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 dark:text-blue-400 mb-4">
            Contact Us
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Get in touch with our team for any assistance or queries regarding our emergency services.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Information Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-blue-800 dark:text-blue-400">
              Contact Information
            </h2>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                  <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                  <button 
                    onClick={handleCall}
                    className="text-lg font-medium text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    +91 6353823676
                  </button>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                  <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <button 
                    onClick={handleEmail}
                    className="text-lg font-medium text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    sumitviramgama1@gmail.com
                  </button>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Headquarters</p>
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    Emergency Assist Services, Gujarat, India
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Services Info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-blue-800 dark:text-blue-400">
              Our Services
            </h2>

            <ul className="space-y-4">
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Roadside Assistance
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Medical Emergency Support
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Hospital Emergency Navigation
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Fuel Emergency Assistance
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                General Services Location
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                24/7 AI Assistant Support
              </li>
            </ul>
          </div>

          {/* Support Hours & Info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-blue-800 dark:text-blue-400">
              Support Information
            </h2>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                  <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Support Hours</p>
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    24/7 Emergency Support
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Our team is available around the clock
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Emergency Response</p>
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    Average Response Time: &lt;30 seconds
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    For urgent matters, use the SOS button in the navbar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Need Immediate Help?</h2>
            <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
              In case of an emergency, use our SOS feature for immediate assistance or contact us directly through the information provided above.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={handleCall}
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Phone size={18} />
                Call Now
              </button>
              <Link 
                to="/home" 
                className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors"
              >
                Go to Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;