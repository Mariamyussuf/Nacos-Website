import React, { useState } from "react";
import { motion } from "framer-motion";
import { subscribe } from "./api";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(false);
    setMessage(null);

    if (!email) return;

    try {
      setLoading(true);
      const result = await subscribe(email);
      setMessage({ text: result.message || "Subscribed successfully!", type: "success" });
      setEmail("");
    } catch (error) {
      setMessage({ text: "Failed to subscribe. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-[#111110] border border-[rgba(255,255,255,0.07)] py-10 px-6 rounded-xl max-w-2xl mx-auto text-center relative overflow-hidden"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <span className="text-[11px] uppercase tracking-[0.18em] text-[#555550] mb-3 inline-block font-normal">Stay Connected</span>
      <h3 className="font-display font-medium text-[#F0EDE6] text-xl mb-2">Subscribe to our newsletter</h3>
      <p className="text-[#888880] text-xs max-w-md mx-auto mb-6 font-light leading-relaxed">
        Receive regular coordinates regarding university computing updates, technical bootcamps, and representative announcements.
      </p>
      
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto"
      >
        <input
          type="email"
          placeholder="Enter your student email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Email address for newsletter subscription"
          className="flex-1 px-4 py-2.5 rounded-md bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-[#F0EDE6] placeholder-[#555550] focus:outline-none focus:border-[#2D7A22]/40 text-sm transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-[#2D7A22] hover:bg-[#3A9C2D] text-[#F0EDE6] text-sm font-medium rounded-md transition-colors disabled:opacity-50"
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
      
      {message && (
        <p className={`mt-4 text-xs font-normal ${message.type === "success" ? "text-[#3A9C2D]" : "text-red-500"}`}>
          {message.text}
        </p>
      )}
    </motion.div>
  );
};

export default Newsletter;
