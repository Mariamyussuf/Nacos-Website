import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { login } from "../components/api";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    matricNumber: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log('Attempting login with:', credentials); 
      const response = await login(credentials);
      console.log('Login response:', response); 
      
      localStorage.setItem("token", response.token);
      localStorage.setItem("userData", JSON.stringify(response.user));
      
      // Redirect to portal
      navigate("/portal");
    } catch (err) {
      console.error('Login error:', err); 
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 bg-gray-50 min-h-screen flex items-center justify-center">
      <motion.div
        className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow max-w-sm w-full"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-extrabold text-gray-900 text-center">Log In</h2>
        {error && (
          <div className="mt-4 text-red-600 text-center text-sm">{error}</div>
        )}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <label className="block text-gray-700 font-medium">Matric Number</label>
            <input
              type="text"
              name="matricNumber"
              value={credentials.matricNumber}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your matric number"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              required
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-2 rounded-md transition-transform transform hover:scale-105 hover:bg-blue-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {loading ? "Logging in..." : "Log In"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
