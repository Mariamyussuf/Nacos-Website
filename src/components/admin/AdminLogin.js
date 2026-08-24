import React from "react";
import { motion } from "framer-motion";

export default function AdminLogin({
  loginCreds,
  setLoginCreds,
  handleLogin,
  loginError,
  loginSubmitting,
}) {
  return (
    <div className="pt-20 pb-12 px-4 sm:px-6 bg-[#0A0A08] min-h-screen flex items-center justify-center text-[#F0EDE6] selection:bg-[#2D7A22] selection:text-[#F0EDE6]">
      <motion.div
        className="bg-[#111110] border border-[rgba(255,255,255,0.07)] p-6 sm:p-8 rounded-xl max-w-sm w-full relative overflow-hidden shadow-2xl"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-12 h-12 rounded-xl bg-[#2D7A22]/10 border border-[#2D7A22]/30 flex items-center justify-center mx-auto mb-4 text-[#2D7A22] text-2xl">
          <i className="ti ti-shield-lock" />
        </div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#888880] mb-1 block text-center font-normal">
          Control Center
        </span>
        <h2 className="text-xl font-display font-medium text-white text-center mb-2">
          Administrator Access
        </h2>
        <p className="text-xs text-[#888880] text-center mb-6 font-light">
          Sign in with administrative credentials to manage blog stories, events, banner announcements, and email campaigns.
        </p>

        {loginError && (
          <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-md p-3 text-center mb-4">
            {loginError}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-[10px] font-normal text-[#888880] mb-1.5 uppercase tracking-wider">
              Admin Username
            </label>
            <input
              type="text"
              required
              value={loginCreds.username}
              onChange={(e) => setLoginCreds({ ...loginCreds, username: e.target.value })}
              className="w-full px-4 py-2.5 rounded-md bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-[#F0EDE6] text-xs placeholder-[#555550] focus:outline-none focus:border-[#2D7A22]"
              placeholder="e.g. admin"
            />
          </div>

          <div>
            <label className="block text-[10px] font-normal text-[#888880] mb-1.5 uppercase tracking-wider">
              Admin Password
            </label>
            <input
              type="password"
              required
              value={loginCreds.password}
              onChange={(e) => setLoginCreds({ ...loginCreds, password: e.target.value })}
              className="w-full px-4 py-2.5 rounded-md bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-[#F0EDE6] text-xs placeholder-[#555550] focus:outline-none focus:border-[#2D7A22]"
              placeholder="••••••••"
            />
          </div>

          <div className="p-2.5 bg-white/[0.02] border border-white/[0.05] rounded text-[10px] text-[#888880]">
            <span className="text-[#2D7A22] font-medium">Default Dev Credentials:</span> admin / nacos2025
          </div>

          <button
            type="submit"
            disabled={loginSubmitting}
            className="w-full bg-[#2D7A22] hover:bg-[#3A9C2D] text-[#F0EDE6] py-2.5 rounded-md text-xs font-medium uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
          >
            {loginSubmitting ? (
              <>
                <i className="ti ti-loader-2 animate-spin text-sm" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <i className="ti ti-lock-open text-sm" />
                <span>Enter Dashboard</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
