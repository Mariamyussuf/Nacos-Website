import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getEventRegistrations } from "../api";
import { useToast } from "../Toast";

export default function AdminEventsSection({
  events,
  eventForm,
  setEventForm,
  showForm,
  editingItem,
  isSubmitting,
  handleSaveEvent,
  handleEventFlierChange,
  startEdit,
  handleDelete,
  resetForms,
}) {
  const showToast = useToast();
  const [rosterEvent, setRosterEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [rosterLoading, setRosterLoading] = useState(false);

  const handleOpenRoster = async (evt) => {
    setRosterEvent(evt);
    setRosterLoading(true);
    try {
      const data = await getEventRegistrations(evt.id || evt.title);
      setAttendees(Array.isArray(data) ? data : []);
    } catch (err) {
      setAttendees([]);
      showToast("Could not load roster: " + err.message, "error");
    } finally {
      setRosterLoading(false);
    }
  };

  const handleExportRosterCSV = () => {
    if (attendees.length === 0) {
      showToast("No attendees to export for this event", "info");
      return;
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Ticket ID,Full Name,Matric Number,Email,Phone,Department,Level,Registered Date\n" +
      attendees
        .map(
          (a) =>
            `"${a.id}","${a.fullName}","${a.matricNumber}","${a.email}","${a.phone || ""}","${a.department || ""}","${a.level || ""}","${a.createdAt || ""}"`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const safeTitle = (rosterEvent?.title || "event").replace(/[^a-z0-9]/gi, "_").toLowerCase();
    link.setAttribute("download", `roster_${safeTitle}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Attendee roster exported as CSV!", "success");
  };

  return (
    <div className="space-y-6">
      {/* Attendee Roster Modal */}
      <AnimatePresence>
        {rosterEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-[#111110] border border-[rgba(255,255,255,0.1)] rounded-2xl max-w-4xl w-full max-h-[88vh] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.07)] bg-[#161614]">
                <div>
                  <h3 className="text-white font-display font-medium text-base">Attendee Registration Roster</h3>
                  <p className="text-[10px] text-[#888880] mt-0.5">{rosterEvent.title}</p>
                </div>
                <button
                  onClick={() => setRosterEvent(null)}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-[#888880] hover:text-white flex items-center justify-center transition-colors"
                >
                  <i className="ti ti-x text-sm" />
                </button>
              </div>

              {/* Roster Controls */}
              <div className="px-6 py-3 bg-[#1A1A17]/60 border-b border-[rgba(255,255,255,0.05)] flex items-center justify-between">
                <span className="text-xs text-[#888880]">
                  Total Registered: <strong className="text-white">{attendees.length} student(s)</strong>
                </span>
                <button
                  onClick={handleExportRosterCSV}
                  disabled={attendees.length === 0}
                  className="px-3 py-1.5 bg-[#2D7A22] hover:bg-[#3A9C2D] disabled:opacity-40 text-white text-xs font-medium rounded flex items-center gap-1.5 transition-colors"
                >
                  <i className="ti ti-download text-sm" />
                  Export Roster (CSV)
                </button>
              </div>

              {/* Roster List / Table */}
              <div className="flex-1 overflow-y-auto p-6">
                {rosterLoading ? (
                  <div className="text-center py-12 text-[#888880] flex items-center justify-center gap-2">
                    <i className="ti ti-loader-2 animate-spin text-lg text-[#2D7A22]" />
                    <span>Loading attendee records...</span>
                  </div>
                ) : attendees.length === 0 ? (
                  <div className="text-center py-12 bg-[#1A1A17]/20 rounded-lg border border-[rgba(255,255,255,0.05)]">
                    <i className="ti ti-ticket-off text-3xl text-[#555550] mb-2 block" />
                    <p className="text-[#888880] text-xs italic font-light">No students have RSVP'd for this event yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.05)] rounded-lg overflow-hidden bg-[#1A1A17]/30">
                    {attendees.map((att, idx) => (
                      <div key={att.id || idx} className="p-3.5 flex flex-col sm:flex-row justify-between sm:items-center gap-2 hover:bg-white/[0.02]">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white text-xs font-medium">{att.fullName}</span>
                            <span className="text-[10px] font-mono text-[#3A9C2D] bg-[#2D7A22]/10 border border-[#2D7A22]/20 px-1.5 py-0.2 rounded font-semibold">
                              {att.matricNumber}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#888880] mt-0.5 font-light">
                            {att.department} · {att.level} · ✉️ {att.email} {att.phone ? `· 📞 ${att.phone}` : ""}
                          </p>
                        </div>
                        <span className="text-[9px] text-[#888880] font-mono self-end sm:self-center">
                          {att.createdAt ? new Date(att.createdAt).toLocaleDateString() : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Slide Down Form Container */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-8 border-b border-[rgba(255,255,255,0.07)] pb-8"
          >
            <h3 className="text-sm uppercase tracking-wider text-[#888880] mb-4 font-normal">
              {editingItem ? "Edit Event Details" : "Create New Event Entry"}
            </h3>

            <form onSubmit={handleSaveEvent} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Event Title</label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="e.g. NACOS Hackathon 2026"
                  className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Date & Time</label>
                <input
                  type="text"
                  required
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  placeholder="e.g. July 12–16, 2026 (9:00 AM)"
                  className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Venue / Location</label>
                <input
                  type="text"
                  required
                  value={eventForm.venue}
                  onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                  placeholder="e.g. Main Auditorium"
                  className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Category</label>
                <select
                  value={eventForm.category}
                  onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
                >
                  <option value="Seminar">Seminar</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Competition">Competition</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Status</label>
                <select
                  value={eventForm.status}
                  onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
                >
                  <option value="upcoming">Upcoming Event</option>
                  <option value="past">Past / Completed Event</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Flier / Banner Image</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEventFlierChange}
                    className="text-xs text-[#888880] file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#2D7A22] file:text-[#F0EDE6] hover:file:bg-[#3A9C2D] file:cursor-pointer"
                  />
                  <input
                    type="text"
                    value={eventForm.flier}
                    onChange={(e) => setEventForm({ ...eventForm, flier: e.target.value })}
                    placeholder="Or paste an image URL directly"
                    className="flex-1 px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-xs rounded-md focus:outline-none focus:border-[#2D7A22]"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Description</label>
                <textarea
                  rows={3}
                  required
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Event description, prerequisites, and registration details..."
                  className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Post-Event Commentary (Optional)</label>
                <textarea
                  rows={3}
                  value={eventForm.commentary}
                  onChange={(e) => setEventForm({ ...eventForm, commentary: e.target.value })}
                  placeholder="Summary of how the event went, attendance stats, and key highlights..."
                  className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
                />
              </div>
              <div className="sm:col-span-2 flex gap-3 mt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#2D7A22] hover:bg-[#3A9C2D] text-[#F0EDE6] text-xs uppercase tracking-wider font-medium rounded-md flex items-center gap-2"
                >
                  {isSubmitting ? <i className="ti ti-loader-2 animate-spin text-sm" /> : null}
                  {editingItem ? "Save Changes" : "Create Event"}
                </button>
                <button
                  type="button"
                  onClick={resetForms}
                  className="px-5 py-2.5 bg-[#1A1A17] hover:bg-white/[0.03] text-[#888880] hover:text-white border border-[rgba(255,255,255,0.07)] text-xs uppercase tracking-wider font-medium rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Records List */}
      {events.length === 0 ? (
        <p className="text-[#888880] text-xs italic font-light text-center py-8">No events logged yet.</p>
      ) : (
        events.map((evt, idx) => (
          <div
            key={evt.id || idx}
            className="flex justify-between items-center bg-[#1A1A17]/40 border border-[rgba(255,255,255,0.05)] rounded-lg p-4 hover:border-[rgba(255,255,255,0.1)] transition-colors"
          >
            <div className="max-w-[70%]">
              <div className="flex gap-2 items-center">
                <span className="text-[9px] uppercase tracking-wider text-[#888880] bg-[#111110] border border-[rgba(255,255,255,0.07)] px-2 py-0.5 rounded">
                  {evt.category}
                </span>
                <span
                  className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded ${
                    evt.status === "upcoming" ? "bg-[#2D7A22]/15 text-[#2D7A22]" : "bg-white/5 text-[#888880]"
                  }`}
                >
                  {evt.status}
                </span>
              </div>
              <h4 className="text-white font-medium text-sm mt-2">{evt.title}</h4>
              <p className="text-[10px] text-[#888880] mt-1 font-light">
                At {evt.venue} · {evt.date}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenRoster(evt)}
                className="px-2.5 py-1.5 bg-[#1A1A17] hover:bg-[#2D7A22]/15 hover:text-[#3A9C2D] text-[#888880] border border-[rgba(255,255,255,0.07)] rounded transition-colors text-xs flex items-center gap-1"
                title="View Attendee Roster"
              >
                <i className="ti ti-users text-sm" />
                <span className="hidden sm:inline text-[10px] uppercase tracking-wider">Roster</span>
              </button>
              <button
                onClick={() => startEdit(evt)}
                className="p-2 border border-[rgba(255,255,255,0.07)] hover:border-white/20 text-[#888880] hover:text-white rounded transition-colors text-xs"
                title="Edit"
              >
                <i className="ti ti-edit" />
              </button>
              <button
                onClick={() => handleDelete(evt, idx)}
                className="p-2 border border-red-500/10 hover:border-red-500/30 text-red-500/70 hover:text-red-400 rounded transition-colors text-xs"
                title="Delete"
              >
                <i className="ti ti-trash" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
