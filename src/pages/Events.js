import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import flier and gallery assets
import deptFlyer from "../assets/dept_flyer.jpg";
import nacosSchedule from "../assets/nacos_schedule.jpg";
import seminarImg from "../assets/seminar.JPG";
import labImg from "../assets/lab.JPG";
import teachImg from "../assets/teach.JPG";


const OUTGOING_EVENTS = [
  {
    title: "Get Ready for Africa AI Hackathon: Introduction Webinar",
    date: "August 23, 2025",
    venue: "Online Webinar (4:00 PM)",
    description: "An introductory training session prep webinar to equip students with the skills, tools, and expectations for the upcoming Africa AI Hackathon.",
    category: "Seminar",
    status: "past",
    flier: seminarImg,
    gallery: [seminarImg, labImg, teachImg],
    commentary: "This webinar kicked off our session with a strong turnout of over 150 students eager to learn about Artificial Intelligence. Facilitators walked through machine learning models, dataset curation, and hackathon registration logistics.",
  },
  {
    title: "100L Student Orientation",
    date: "October 15, 2025",
    venue: "Edozien Lecture Hall",
    description: "Welcoming our newly admitted 100 level and direct entry computing students, detailing requirements, department codes, and academic pathways.",
    category: "General",
    status: "past",
    flier: deptFlyer,
    gallery: [deptFlyer, labImg, seminarImg],
    commentary: "Held at Edozien Lecture Hall, the orientation welcomed incoming freshmen. HODs Dr. Ezike and Dr. Adeyiga spoke about academic integrity and college regulations, followed by a Q&A session.",
  },
  {
    title: "NACOS Internship Initiative Kickoff",
    date: "November 3, 2025",
    venue: "Lecture Theatre 1",
    description: "Kicking off the official NACOS internship program in collaboration with the Inventors Community and Greatness Laboratory, focused on giving students the hands-on preparedness they need to secure high-value placements.",
    category: "Workshop",
    status: "past",
    flier: labImg,
    gallery: [labImg, teachImg, seminarImg],
    commentary: "Kicking off the official NACOS internship program in collaboration with the Inventors Community and Greatness Laboratory, focused on giving students the hands-on preparedness they need to secure high-value placements.",
  },
  {
    title: "NACOS Game Night",
    date: "November 15, 2025",
    venue: "Glass House",
    description: "A fun-filled social evening balancing academic rigor with board games, multiplayer console setups, and interactive peer networking.",
    category: "Social",
    status: "past",
    flier: teachImg,
    gallery: [teachImg, labImg, seminarImg],
    commentary: "A fun-filled social evening balancing academic rigor with board games, multiplayer console setups, and interactive peer networking.",
  },
  {
    title: "Beyond Coding 1.0: Tech Onboarding",
    date: "November 25, 2025",
    venue: "BUPF Auditorium, Bells University",
    description: "The primary tech onboarding event centered around the theme 'Navigating Diverse Careers in Tech'. Speakers detailed roles in design, security, product growth, and engineering.",
    category: "Seminar",
    status: "past",
    flier: seminarImg,
    gallery: [seminarImg, teachImg, labImg],
    commentary: "The primary tech onboarding event centered around the theme 'Navigating Diverse Careers in Tech'. Speakers detailed roles in design, security, product growth, and engineering.",
  },
  {
    title: "R&B Game Night",
    date: "March 28, 2026",
    venue: "Glass House",
    description: "A social evening bringing computing students together for collaborative board games, e-sports gaming, and music.",
    category: "Social",
    status: "past",
    flier: nacosSchedule,
    gallery: [nacosSchedule, labImg, seminarImg],
    commentary: "A unique blend of R&B music and social board gaming. The Glass House was filled with computing students participating in team-based trivia, card games, and friendly console matches.",
  },
  {
    title: "Academic Demo Day",
    date: "April 2026 (TBD)",
    venue: "Edozien Lecture Hall",
    description: "A campus-wide tech showcase where computing groups demoed their final software, design projects, and research tools to peers and mentors.",
    category: "General",
    status: "past",
    flier: nacosSchedule,
    gallery: [nacosSchedule, teachImg, seminarImg],
    commentary: "Students pitched their class projects and software prototypes to a panel of faculty members and tech mentors, receiving constructive feedback on codebase scaling and UI accessibility.",
  },
  {
    title: "NACOS Week: Quiz & Movie Night",
    date: "May 4, 2026",
    venue: "Edozien Lecture Hall",
    description: "Kicking off NACOS Week with an engaging academic quiz competition followed by a social movie night for students where we watched the movie 'Michael'.",
    category: "Social",
    status: "past",
    flier: nacosSchedule,
    gallery: [nacosSchedule, seminarImg, labImg],
    commentary: "Kicking off NACOS Week with an engaging academic quiz competition followed by a social movie night for students where we watched the movie 'Michael'.",
  },
  {
    title: "NACOS Week: Ankara Fest",
    date: "May 5, 2026",
    venue: "Main Campus Lounge",
    description: "A cultural Ankara print fashion and networking social hosted in collaboration with SAA and NASFTS.",
    category: "Social",
    status: "past",
    flier: nacosSchedule,
    gallery: [nacosSchedule, teachImg, labImg],
    commentary: "A cultural Ankara print fashion and networking social hosted in collaboration with SAA and NASFTS.",
  },
  {
    title: "NACOS Week: Orphanage Home Visit",
    date: "May 6, 2026",
    venue: "Local Orphanage Home",
    description: "A community service event visiting local orphanage homes to offer supplies, donations, and student-led charity support.",
    category: "Social",
    status: "past",
    flier: nacosSchedule,
    gallery: [nacosSchedule, seminarImg, teachImg],
    commentary: "A community service event visiting local orphanage homes to offer supplies, donations, and student-led charity support.",
  },
  {
    title: "NACOS Week: Tech Conference",
    date: "May 6, 2026",
    venue: "BUPF Auditorium",
    description: "A professional seminar featuring technical leaders sharing tips on cloud structures, software engineering tracks, and network defense.",
    category: "Seminar",
    status: "past",
    flier: nacosSchedule,
    gallery: [nacosSchedule, labImg, teachImg],
    commentary: "A professional seminar featuring technical leaders sharing tips on cloud structures, software engineering tracks, and network defense.",
  },
  {
    title: "Prof. Jeremiah Hackathon (3-Day Pitchathon)",
    date: "May 7–9, 2026",
    venue: "Lecture Theatre 1",
    description: "A 3-day startup building and product pitching hackathon held in honor of the Vice Chancellor's (Prof. Jeremiah) departure, hosted in collaboration with the BOT Company.",
    category: "Competition",
    status: "past",
    flier: nacosSchedule,
    gallery: [nacosSchedule, labImg, seminarImg],
    commentary: "A 3-day startup building and product pitching hackathon held in honor of the Vice Chancellor's (Prof. Jeremiah) departure, hosted in collaboration with the BOT Company.",
  },
  {
    title: "NACOS Week: Sports Festival & Football Match",
    date: "May 2026",
    venue: "Bells University Sports Field",
    description: "Sports activities featuring 1v1 football matches and an inter-level tournament (100L - 500L) won by the 500L students.",
    category: "Social",
    status: "past",
    flier: nacosSchedule,
    gallery: [nacosSchedule, seminarImg, teachImg],
    commentary: "Sports activities featuring 1v1 football matches and an inter-level tournament (100L - 500L) won by the 500L students.",
  },
  {
    title: "NACOS Dinner & Award Gala Night",
    date: "May 19, 2026",
    venue: "Multipurpose Hall, Bells University",
    description: "The grand themed dinner night wrapping up NACOS Week, celebrating academic awards, executive handovers, and student achievements.",
    category: "Social",
    status: "past",
    flier: nacosSchedule,
    gallery: [nacosSchedule, labImg, teachImg],
    commentary: "The grand themed dinner night wrapping up NACOS Week, celebrating academic awards, executive handovers, and student achievements.",
  },
  {
    title: "Election of New Executives",
    date: "May 25, 2026",
    venue: "CIS Seminar Room A / Online Portal",
    description: "The official democratic election of the new NACOS Bells Chapter executive council members for the next academic session.",
    category: "General",
    status: "past",
    flier: deptFlyer,
    gallery: [deptFlyer, labImg, seminarImg],
    commentary: "The official democratic election of the new NACOS Bells Chapter executive council members for the next academic session.",
  },
  {
    title: "Academic Tutorials, Exams & Session Conclusion",
    date: "June 2026 (Ended June 22)",
    venue: "Edozien Lecture Hall & Campus",
    description: "Peer-to-peer tutorial classes and final examinations. The 2025/2026 academic session officially concluded on June 22nd, 2026.",
    category: "General",
    status: "past",
    flier: teachImg,
    gallery: [teachImg, labImg, seminarImg],
    commentary: "Peer-to-peer tutorial classes and final examinations. The 2025/2026 academic session officially concluded on June 22nd, 2026.",
  },
];

const categories = ["All", "Workshop", "Competition", "Social", "Seminar", "General"];

const categoryColors = {
  Workshop: "bg-[#1A1A17] text-[#888880] border border-[rgba(255,255,255,0.07)]",
  Competition: "bg-[#1A1A17] text-[#888880] border border-[rgba(255,255,255,0.07)]",
  Social: "bg-[#1A1A17] text-[#888880] border border-[rgba(255,255,255,0.07)]",
  General: "bg-[#1A1A17] text-[#888880] border border-[rgba(255,255,255,0.07)]",
  Seminar: "bg-[#1A1A17] text-[#888880] border border-[rgba(255,255,255,0.07)]",
};

const Events = () => {
  const [activeTab, setActiveTab] = useState("upcoming"); // "upcoming" or "outgoing"
  const [activeCategory, setActiveCategory] = useState("All");
  
  // Modal states
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState(null);

  const [eventsList] = useState(() => {
    const saved = localStorage.getItem("events");
    return saved ? JSON.parse(saved) : OUTGOING_EVENTS;
  });

  const currentEventsList = eventsList.filter(e => {
    if (activeTab === "upcoming") {
      return e.status === "upcoming";
    } else {
      return e.status === "past" || e.status === "concluded" || e.status === "archive";
    }
  });

  const filteredEvents = activeCategory === "All"
    ? currentEventsList
    : currentEventsList.filter((e) => e.category === activeCategory);

  return (
    <div className="pt-16 bg-[#0A0A08] min-h-screen text-[#F0EDE6] relative selection:bg-[#2D7A22] selection:text-[#F0EDE6]">

      {/* ====== PAGE HEADER ====== */}
      <section className="relative py-20 z-10 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 border border-[rgba(255,255,255,0.07)] bg-white/[0.02] px-4 py-1.5 rounded-full text-[#888880] text-xs font-normal uppercase tracking-widest mb-6"
          >
            <span className="w-1.5 h-1.5 bg-[#2D7A22] rounded-full flex-shrink-0" />
            Events Coordinator
          </motion.div>
          <motion.h1
            className="font-display font-medium text-5xl text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            NACOS <span className="text-[#2D7A22]">Events &amp; Timeline</span>
          </motion.h1>
          <motion.p
            className="text-[#888880] text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Click any card to explore the event flyer, detailed commentary recap, and media archives.
          </motion.p>
        </div>
      </section>

      {/* ====== TAB NAVIGATION ====== */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 mb-8">
        <div className="flex justify-center gap-4">
          <button
            onClick={() => { setActiveTab("upcoming"); setActiveCategory("All"); }}
            className={`px-5 py-3 rounded-full font-medium text-xs uppercase tracking-wider border transition-all duration-300 flex items-center gap-2 ${
              activeTab === "upcoming"
                ? "bg-[#2D7A22] border-transparent text-[#F0EDE6] scale-102"
                : "bg-white/[0.02] border-[rgba(255,255,255,0.07)] text-[#888880] hover:text-white"
            }`}
          >
            <i className="ti ti-calendar" /> Upcoming (New Session)
          </button>
          <button
            onClick={() => { setActiveTab("outgoing"); setActiveCategory("All"); }}
            className={`px-5 py-3 rounded-full font-medium text-xs uppercase tracking-wider border transition-all duration-300 flex items-center gap-2 ${
              activeTab === "outgoing"
                ? "bg-[#2D7A22] border-transparent text-[#F0EDE6] scale-102"
                : "bg-white/[0.02] border-[rgba(255,255,255,0.07)] text-[#888880] hover:text-white"
            }`}
          >
            <i className="ti ti-history" /> Outgoing Session Archive
          </button>
        </div>
      </section>

      {/* ====== FILTERS ====== */}
      <section className="sticky top-16 z-40 bg-[#0A0A08]/85 backdrop-blur-md border-b border-[rgba(255,255,255,0.07)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-[#2D7A22] text-[#F0EDE6] scale-102"
                  : "bg-[#111110] text-[#888880] hover:text-white border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.12)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ====== EVENTS CONTENT ====== */}
      <section className="relative z-10 py-16 max-w-7xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {filteredEvents.length === 0 ? (
            <motion.div
              key="empty"
              className="text-center py-16 px-6 max-w-2xl mx-auto bg-[#111110] border border-[rgba(255,255,255,0.07)] rounded-2xl"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-[#2D7A22]/10 flex items-center justify-center mx-auto mb-6 text-[#2D7A22] text-3xl">
                <i className="ti ti-calendar-event" />
              </div>
              <h3 className="font-display font-medium text-xl text-white mb-3">
                {activeTab === "upcoming" ? "Calendar Finalization Underway" : "Archive Empty"}
              </h3>
              <p className="text-[#888880] text-sm leading-relaxed mb-8 font-light">
                {activeTab === "upcoming" 
                  ? "The newly elected executive administration is currently finalizing the official event calendar for the incoming 2026/2027 academic session. Details on Freshers Orientation, bootcamps, and Tech Fest hackathons will be updated soon."
                  : "No events match the selected category in this archive path."}
              </p>
              {activeTab === "upcoming" && (
                <div className="flex justify-center gap-4">
                  <a
                    href="https://chat.whatsapp.com/nacos-bells-community"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-[#2D7A22] text-[#F0EDE6] text-xs font-medium uppercase tracking-wider rounded-md hover:bg-[#3A9C2D] transition-all duration-300"
                  >
                    Join Community
                  </a>
                  <a
                    href="/contact"
                    className="px-5 py-2.5 bg-white/[0.02] text-[#888880] hover:bg-white/[0.04] text-xs font-medium uppercase tracking-wider rounded-md border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.12)] transition-all duration-300"
                  >
                    Get Notified
                  </a>
                </div>
              )}
            </motion.div>
          ) : activeTab === "upcoming" ? (
            /* Upcoming events: Grid Cards */
            <motion.div
              key="upcoming-grid"
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {filteredEvents.map((event, idx) => (
                <motion.div
                  key={idx}
                  onClick={() => setSelectedEvent(event)}
                  className="card overflow-hidden cursor-pointer flex flex-col justify-between group relative"
                  whileHover={{ y: -4 }}
                >
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={event.flier} 
                      alt={event.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A08] to-transparent opacity-60" />
                  </div>

                  <div className="p-6 flex flex-col gap-3 flex-1 justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className={`text-[10px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-md ${categoryColors[event.category]}`}>
                          {event.category}
                        </span>
                        <span className="text-[10px] font-medium uppercase bg-[#2D7A22]/10 text-[#2D7A22] border border-[#2D7A22]/20 px-2 py-0.5 rounded-md">
                          {event.status}
                        </span>
                      </div>

                      <h3 className="font-display font-medium text-white text-lg leading-snug group-hover:text-[#2D7A22] transition-colors mt-2">
                        {event.title}
                      </h3>
                      <p className="text-[#888880] text-xs leading-relaxed mt-2 line-clamp-2 font-light">{event.description}</p>
                    </div>

                    <div className="pt-4 border-t border-[rgba(255,255,255,0.07)] flex flex-wrap gap-x-4 gap-y-1 mt-4 text-[10px] text-[#555550] font-normal">
                      <span className="flex items-center gap-1"><i className="ti ti-calendar text-[#2D7A22] text-sm" /> {event.date}</span>
                      <span className="flex items-center gap-1"><i className="ti ti-map-pin text-[#888880] text-sm" /> {event.venue}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* Outgoing events: Vertical Chronological Timeline Archive */
            <motion.div
              key="outgoing-timeline"
              className="relative"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {/* Vertical timeline line */}
              <div className="absolute top-0 bottom-0 left-4 md:left-1/2 w-[0.5px] bg-[rgba(255,255,255,0.07)] -translate-x-1/2" />

              <div className="space-y-12">
                {filteredEvents.map((event, idx) => {
                  const isEven = idx % 2 === 0;
                  
                  return (
                    <div
                      key={idx}
                      className={`relative flex flex-col md:flex-row items-start ${isEven ? "md:justify-start" : "md:justify-end"}`}
                    >
                      {/* Circle Node indicator */}
                      <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#0A0A08] border-2 border-[#2D7A22] top-2 z-10" />

                      {/* Timeline card wrapper */}
                      <div className={`w-full md:w-[46%] pl-10 md:pl-0 ${isEven ? "md:pr-12" : "md:pl-12"}`}>
                        <motion.div 
                          className="card overflow-hidden cursor-pointer group relative"
                          onClick={() => setSelectedEvent(event)}
                          whileHover={{ y: -4 }}
                        >
                          <div className="h-44 overflow-hidden relative">
                            <img 
                              src={event.flier} 
                              alt={event.title} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A08] to-transparent opacity-60" />
                          </div>

                          <div className="p-6">
                            <div className="flex justify-between items-center mb-3">
                              <span className={`text-[10px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-md ${categoryColors[event.category]}`}>
                                {event.category}
                              </span>
                              <span className="text-[10px] font-medium uppercase bg-[#1A1A17] text-[#888880] border border-[rgba(255,255,255,0.07)] px-2 py-0.5 rounded-md">
                                Concluded
                              </span>
                            </div>

                            <h3 className="font-display font-medium text-white text-base leading-snug group-hover:text-[#2D7A22] transition-colors mt-2">
                              {event.title}
                            </h3>
                            <p className="text-[#888880] text-xs leading-relaxed mt-2 line-clamp-2 font-light">{event.description}</p>

                            <div className="pt-4 border-t border-[rgba(255,255,255,0.07)] flex flex-wrap gap-x-4 gap-y-1 mt-4 text-[10px] text-[#555550] font-normal">
                              <span className="flex items-center gap-1"><i className="ti ti-calendar text-[#2D7A22]" /> {event.date}</span>
                              <span className="flex items-center gap-1"><i className="ti ti-map-pin text-[#888880]" /> {event.venue}</span>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ====== DETAIL MODAL (Commentary & Gallery) ====== */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#111110] border border-[rgba(255,255,255,0.07)] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              initial={{ scale: 0.98, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 10 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-[#2D7A22] hover:text-[#F0EDE6] border border-[rgba(255,255,255,0.07)] hover:border-transparent text-white flex items-center justify-center transition-all"
              >
                <i className="ti ti-x text-sm" />
              </button>

              {/* Left Column: Flier */}
              <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden bg-black flex items-center justify-center relative">
                <img
                  src={selectedEvent.flier}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur border border-[rgba(255,255,255,0.07)] px-3 py-1.5 rounded-lg text-[10px] font-medium text-[#888880]">
                  Official Event Flier
                </div>
              </div>

              {/* Right Column: Commentary & Media Gallery */}
              <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col justify-between max-h-[90vh] md:max-h-none">
                <div>
                  <span className={`text-[9px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-md inline-block mb-3 ${categoryColors[selectedEvent.category]}`}>
                    {selectedEvent.category}
                  </span>
                  <h2 className="font-display font-medium text-2xl text-white mb-2 leading-tight">
                    {selectedEvent.title}
                  </h2>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#888880] mb-6 font-normal pb-4 border-b border-[rgba(255,255,255,0.07)]">
                    <span className="flex items-center gap-1.5"><i className="ti ti-calendar text-[#2D7A22]" /> {selectedEvent.date}</span>
                    <span className="flex items-center gap-1.5"><i className="ti ti-map-pin text-[#888880]" /> {selectedEvent.venue}</span>
                  </div>

                  {/* Commentary */}
                  <div className="mb-6">
                    <h4 className="text-white font-display font-medium text-xs uppercase tracking-wider mb-2">Event Commentary</h4>
                    <p className="text-[#888880] text-xs leading-relaxed font-light">
                      {selectedEvent.commentary}
                    </p>
                  </div>

                  {/* Photo Gallery */}
                  <div>
                    <h4 className="text-white font-display font-medium text-xs uppercase tracking-wider mb-3">Event Gallery</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedEvent.gallery.map((imgSrc, i) => (
                        <div
                          key={i}
                          onClick={() => setSelectedGalleryImg(imgSrc)}
                          className="h-16 rounded-lg overflow-hidden cursor-pointer border border-[rgba(255,255,255,0.07)] hover:border-[#2D7A22] transition-colors relative group"
                        >
                          <img
                            src={imgSrc}
                            alt="Gallery preview"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors flex items-center justify-center">
                            <i className="ti ti-zoom-in text-white/70 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-[rgba(255,255,255,0.07)] flex gap-2">
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="w-full py-2.5 rounded-md bg-[#1A1A17] hover:bg-[#2D7A22] hover:text-[#F0EDE6] border border-[rgba(255,255,255,0.07)] hover:border-transparent text-[#888880] hover:text-white font-medium text-xs transition-all flex items-center justify-center gap-2"
                  >
                    Close Log
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox for Gallery Image */}
      <AnimatePresence>
        {selectedGalleryImg && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm cursor-zoom-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedGalleryImg(null)}
          >
            <motion.div
              className="max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.07)]"
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={selectedGalleryImg}
                alt="Enlarged gallery view"
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== BOTTOM CTA ====== */}
      <section className="relative z-10 bg-[#111110]/30 border-t border-[rgba(255,255,255,0.07)] py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display font-medium text-3xl text-white mb-4">
              Have Media or Event Feedback?
            </h2>
            <p className="text-[#888880] text-sm mb-8 max-w-lg mx-auto leading-relaxed font-light">
              If you have photos, videos, or questions about past coordinates, feel free to contact our PRO and Media teams.
            </p>
            <a href="/contact" className="btn-primary">
              Get In Touch
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Events;
