import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "./Toast";
import { registerForEvent } from "./api";

const DEPARTMENTS = ["Computer Sciences", "Information Technology", "Cyber Security"];
const LEVELS = ["100 Level", "200 Level", "300 Level", "400 Level"];

export default function EventRegisterModal({ event, isOpen, onClose }) {
  const showToast = useToast();
  const [form, setForm] = useState({
    fullName: "",
    matricNumber: "",
    email: "",
    phone: "",
    department: "Computer Sciences",
    level: "100 Level",
  });
  const [loading, setLoading] = useState(false);
  const [ticketResult, setTicketResult] = useState(null);

  if (!isOpen || !event) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.matricNumber.trim() || !form.email.trim()) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await registerForEvent(event.id || event.title, {
        ...form,
        eventTitle: event.title,
      });

      if (res.alreadyRegistered) {
        showToast(res.message, "info");
      } else {
        showToast(res.message || "Registration confirmed!", "success");
      }
      setTicketResult(res);
    } catch (err) {
      showToast(`Registration failed: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTicketResult(null);
    setForm({
      fullName: "",
      matricNumber: "",
      email: "",
      phone: "",
      department: "Computer Sciences",
      level: "100 Level",
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleReset}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative w-full max-w-lg bg-[#111110] border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.07)] bg-[#161614]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2D7A22]" />
              <h2 className="text-white font-display font-medium text-base">Event RSVP & Registration</h2>
            </div>
            <button
              onClick={handleReset}
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-[#888880] hover:text-white flex items-center justify-center transition-colors"
            >
              <i className="ti ti-x text-sm" />
            </button>
          </div>

          {/* Event Quick Context Card */}
          <div className="px-6 py-3.5 bg-[#1A1A17]/70 border-b border-[rgba(255,255,255,0.05)] flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#2D7A22]/15 text-[#3A9C2D] border border-[#2D7A22]/30 font-medium">
                  {event.category || "Event"}
                </span>
                <span className="text-[10px] text-[#888880]">{event.date}</span>
              </div>
              <h3 className="text-white font-medium text-xs leading-snug">{event.title}</h3>
              <p className="text-[10px] text-[#888880] mt-0.5">📍 {event.venue}</p>
            </div>
          </div>

          {ticketResult ? (
            /* Ticket Confirmation View */
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#2D7A22]/20 text-[#3A9C2D] flex items-center justify-center mx-auto text-2xl">
                <i className="ti ti-circle-check" />
              </div>

              <div>
                <h3 className="font-display font-medium text-lg text-white">Registration Confirmed!</h3>
                <p className="text-xs text-[#888880] mt-1 font-light">
                  Your seat is reserved for this session. Please save your ticket reference:
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#161614] border border-[rgba(255,255,255,0.08)] text-left space-y-2 font-mono text-xs">
                <div className="flex justify-between items-center text-[#888880] text-[10px] uppercase border-b border-[rgba(255,255,255,0.05)] pb-1.5">
                  <span>Ticket Reference</span>
                  <span className="text-[#3A9C2D] font-bold">{ticketResult.ticketId || ticketResult.registration?.id}</span>
                </div>
                <div className="flex justify-between items-center text-white text-xs pt-1">
                  <span className="text-[#888880]">Attendee:</span>
                  <span>{form.fullName}</span>
                </div>
                <div className="flex justify-between items-center text-white text-xs">
                  <span className="text-[#888880]">Matric No:</span>
                  <span>{form.matricNumber.toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-center text-white text-xs">
                  <span className="text-[#888880]">Department:</span>
                  <span>{form.department} ({form.level})</span>
                </div>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-[#2D7A22] hover:bg-[#3A9C2D] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-lg shadow-[#2D7A22]/20"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] uppercase text-[#888880] mb-1 tracking-wider">
                  Full Name <span className="text-[#2D7A22]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="e.g. Mariam Yussuf"
                  className="w-full px-3.5 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-xs rounded-md focus:outline-none focus:border-[#2D7A22]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-[#888880] mb-1 tracking-wider">
                    Matric Number <span className="text-[#2D7A22]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.matricNumber}
                    onChange={(e) => setForm({ ...form, matricNumber: e.target.value })}
                    placeholder="e.g. 2022/10452"
                    className="w-full px-3.5 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-xs rounded-md focus:outline-none focus:border-[#2D7A22]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-[#888880] mb-1 tracking-wider">
                    Email Address <span className="text-[#2D7A22]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-xs rounded-md focus:outline-none focus:border-[#2D7A22]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-[#888880] mb-1 tracking-wider">Department</label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-xs rounded-md focus:outline-none focus:border-[#2D7A22]"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-[#888880] mb-1 tracking-wider">Academic Level</label>
                  <select
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-xs rounded-md focus:outline-none focus:border-[#2D7A22]"
                  >
                    {LEVELS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#888880] mb-1 tracking-wider">WhatsApp / Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g. 08123456789"
                  className="w-full px-3.5 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-xs rounded-md focus:outline-none focus:border-[#2D7A22]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 bg-[#1A1A17] hover:bg-white/[0.04] text-[#888880] hover:text-white border border-[rgba(255,255,255,0.07)] text-xs uppercase tracking-wider rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-[#2D7A22] hover:bg-[#3A9C2D] text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors flex items-center gap-2 shadow-lg shadow-[#2D7A22]/20"
                >
                  {loading && <i className="ti ti-loader-2 animate-spin text-sm" />}
                  <span>{loading ? "Registering..." : "Confirm RSVP"}</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
