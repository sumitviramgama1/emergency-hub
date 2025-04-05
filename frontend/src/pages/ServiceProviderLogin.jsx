import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, User, Lock } from 'lucide-react';

const ServiceProviderLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/auth/login/service-provider', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem("role", "serviceProvider");
      localStorage.setItem('isLoggedIn', true);
      localStorage.setItem('userId', data.userId);
      navigate('/service-provider-dashboard');
    } else {
      alert('Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 dark:bg-blue-800 px-6 py-4">
            <h2 className="text-xl font-semibold text-white text-center flex items-center justify-center gap-2">
              <AlertCircle size={20} />
              Service Provider Login
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8">
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Username</label>
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

            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Password</label>
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

            <button
              type="submit"
              className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300"
            >
              Login
            </button>

            <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/service-provider-signup" className="text-blue-600 dark:text-blue-400 hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderLogin;