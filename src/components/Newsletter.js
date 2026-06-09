import React, { useState } from "react";
import { motion } from "framer-motion";
import { subscribe } from "./api";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const fadeInUp = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await subscribe(email);
      setMessage(result.message || "Subscribed successfully!");
    } catch (error) {
      setMessage("Failed to subscribe. Please try again.");
    }
  };

  return (
    <motion.div
      className="mt-12 bg-white py-12 px-6 rounded-lg shadow-md max-w-4xl mx-auto"
      variants={fadeInUp}
      initial="initial"
      animate="animate"
    >
      <p className="text-gray-600 mt-4 text-center">
        Subscribe to our newsletter for the latest updates on university events, programs, and admissions.
      </p>
      <form
        onSubmit={handleSubmit}
        className="mt-6 flex justify-center gap-4"
      >
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-6 py-3 w-96 border-2 border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition"
        >
          Subscribe
        </button>
      </form>
      {message && (
        <p className="text-center mt-4 text-gray-600">{message}</p>
      )}
    </motion.div>
  );
};

export default Newsletter;
