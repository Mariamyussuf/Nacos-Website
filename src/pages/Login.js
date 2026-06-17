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
    <div className="pt-16 bg-[#0A0A08] min-h-screen flex items-center justify-center text-[#F0EDE6] selection:bg-[#2D7A22] selection:text-[#F0EDE6]">
      <motion.div
        className="bg-[#111110] border border-[rgba(255,255,255,0.07)] p-8 rounded-xl max-w-sm w-full relative overflow-hidden"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <span className="text-[11px] uppercase tracking-[0.18em] text-[#888880] mb-3 block text-center font-normal">Student Portal</span>
        <h2 className="text-2xl font-display font-medium text-white text-center mb-6">Log In</h2>
        
        {error && (
          <div className="text-red-500 text-xs bg-red-500/5 border border-red-500/20 rounded-md p-3 text-center mb-4">
            {error}
          </div>
        )}
        
        <form className="space-y-5" onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <label className="block text-xs font-normal text-[#888880] mb-1.5 uppercase tracking-wide">Matric Number</label>
            <input
              type="text"
              name="matricNumber"
              value={credentials.matricNumber}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-md bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-[#F0EDE6] text-sm placeholder-[#555550] focus:outline-none focus:border-[#2D7A22]/40 transition-colors"
              placeholder="e.g. 21/1000"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <label className="block text-xs font-normal text-[#888880] mb-1.5 uppercase tracking-wide">Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-md bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-[#F0EDE6] text-sm placeholder-[#555550] focus:outline-none focus:border-[#2D7A22]/40 transition-colors"
              placeholder="••••••••"
              required
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#2D7A22] text-[#F0EDE6] py-2.5 rounded-md transition-colors hover:bg-[#3A9C2D] font-medium text-sm ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.99 }}
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
