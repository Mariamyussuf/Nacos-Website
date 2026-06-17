import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../components/Toast";

// Initial seed data from pages
const DEFAULT_POSTS = [
  {
    title: "NACOS Bells Chapter Kicks Off 2025 with a Bang!",
    date: "Feb 12, 2025",
    category: "News",
    author: "PRO Team",
    readTime: "3 min read",
    excerpt: "The new academic year started in style as NACOS Bells Chapter welcomed over 200 students at its annual Welcome Week event. From exciting introductions to fun socials, it was a week to remember.",
  },
  {
    title: "Highlights from the NACOS Coding Challenge 2025",
    date: "Apr 25, 2025",
    category: "Events",
    author: "Tech Director",
    readTime: "4 min read",
    excerpt: "The 2025 NACOS Coding Challenge saw over 60 participants compete across 3 rounds of algorithmic problem-solving. Here's a full recap of the winners, challenges, and the incredible energy in the room.",
  },
  {
    title: "5 Tech Skills Every CS Student Should Learn in 2025",
    date: "Mar 20, 2025",
    category: "Tech Tips",
    author: "NACOS Bells",
    readTime: "6 min read",
    excerpt: "Whether you're in your 100 or 400 level, these five in-demand tech skills will make you stand out to employers and open doors to internships and freelance opportunities.",
  },
  {
    title: "How to Make the Most of Your Time in NACOS",
    date: "Jan 30, 2025",
    category: "Student Life",
    author: "Gen Sec",
    readTime: "5 min read",
    excerpt: "Being in NACOS is more than just attending events. Here are practical ways to maximize your membership — from taking on leadership roles to representing NACOS at national competitions.",
  },
  {
    title: "Web Dev Bootcamp 2025: A Student's Perspective",
    date: "May 18, 2025",
    category: "Events",
    author: "Welfare Team",
    readTime: "4 min read",
    excerpt: "One of our members shares their experience from the 3-day Web Development Bootcamp — what they learned, what surprised them, and why every CS student should attend next time.",
  },
  {
    title: "Meet Your 2025 NACOS Bells Executives",
    date: "Jan 10, 2025",
    category: "News",
    author: "PRO Team",
    readTime: "3 min read",
    excerpt: "A new executive council has been sworn in! Get to know the 15 dedicated student leaders who will be steering the NACOS Bells Chapter ship this year and their plans for the chapter.",
  },
];

const DEFAULT_EVENTS = [
  {
    title: "Get Ready for Africa AI Hackathon: Introduction Webinar",
    date: "August 23, 2025",
    venue: "Online Webinar (4:00 PM)",
    description: "An introductory training session prep webinar to equip students with the skills, tools, and expectations for the upcoming Africa AI Hackathon.",
    category: "Seminar",
    status: "past",
    flier: "https://images.unsplash.com/photo-1591115765373-5aad4e2380ad?auto=format&fit=crop&w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1591115765373-5aad4e2380ad?auto=format&fit=crop&w=600&q=80"
    ],
    commentary: "This webinar kicked off our session with a strong turnout of over 150 students eager to learn about Artificial Intelligence. Facilitators walked through machine learning models, dataset curation, and hackathon registration logistics.",
  },
  {
    title: "100L Student Orientation",
    date: "October 15, 2025",
    venue: "Edozien Lecture Hall",
    description: "Welcoming our newly admitted 100 level and direct entry computing students, detailing requirements, department codes, and academic pathways.",
    category: "General",
    status: "past",
    flier: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80"
    ],
    commentary: "Held at Edozien Lecture Hall, the orientation welcomed incoming freshmen. HODs Dr. Ezike and Dr. Adeyiga spoke about academic integrity and college regulations, followed by a Q&A session.",
  },
];

const DEFAULT_RESOURCES = [
  {
    code: "CSC 111",
    title: "Introduction to Computer Science",
    dept: "Computer Sciences",
    level: "100 Level",
    semester: "1st Semester",
    year: "2024/2025",
    size: "1.2 MB",
  },
  {
    code: "CSC 211",
    title: "Data Structures & Algorithms",
    dept: "Computer Sciences",
    level: "200 Level",
    semester: "1st Semester",
    year: "2024/2025",
    size: "2.1 MB",
  },
  {
    code: "IFT 211",
    title: "Information Technology Fundamentals",
    dept: "Information Technology",
    level: "200 Level",
    semester: "1st Semester",
    year: "2024/2025",
    size: "1.5 MB",
  },
  {
    code: "CYB 211",
    title: "Introduction to Cybersecurity",
    dept: "Cyber Security",
    level: "200 Level",
    semester: "1st Semester",
    year: "2024/2025",
    size: "2.1 MB",
  },
];

// Image compression helper using Canvas
const compressImage = (base64Str) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const maxWidth = 800;
      const maxHeight = 800;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };
  });
};

// Formatting utility for file sizes
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

export default function Admin() {
  const showToast = useToast();
  const [activeSection, setActiveSection] = useState("blogs");
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  // Lists loaded from localStorage
  const [blogs, setBlogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState([]);

  // Form states
  const [blogForm, setBlogForm] = useState({
    title: "",
    date: "",
    category: "News",
    author: "",
    readTime: "3 min read",
    excerpt: "",
    image: "", // Base64 cover image
  });

  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    venue: "",
    description: "",
    category: "Seminar",
    status: "upcoming",
    flier: "",
    commentary: "",
  });

  const [resourceForm, setResourceForm] = useState({
    code: "",
    title: "",
    dept: "Computer Sciences",
    level: "100 Level",
    semester: "1st Semester",
    year: "2025/2026",
    size: "1.0 MB",
    fileData: "", // Base64 PDF content
  });

  // Helper file uploader
  const handleFileChange = (e, type, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const rawBase64 = event.target.result;
      if (type === "blog") {
        try {
          const compressed = await compressImage(rawBase64);
          setBlogForm((prev) => ({ ...prev, [fieldName]: compressed }));
          showToast("Cover image uploaded and compressed.", "success");
        } catch (err) {
          console.error(err);
          showToast("Failed to process image.", "error");
        }
      } else if (type === "event") {
        try {
          const compressed = await compressImage(rawBase64);
          setEventForm((prev) => ({ ...prev, [fieldName]: compressed }));
          showToast("Event flier uploaded and compressed.", "success");
        } catch (err) {
          console.error(err);
          showToast("Failed to process image.", "error");
        }
      } else if (type === "resource") {
        // PDF File size limit checking (1.5 MB)
        if (file.size > 1.5 * 1024 * 1024) {
          showToast("PDF file is too large. Max size allowed is 1.5 MB.", "error");
          e.target.value = ""; // Reset file input
          return;
        }
        setResourceForm((prev) => ({
          ...prev,
          fileData: rawBase64,
          size: formatFileSize(file.size),
        }));
        showToast("PDF file uploaded successfully.", "success");
      }
    };
    reader.readAsDataURL(file);
  };

  // Load from localStorage
  useEffect(() => {
    const localBlogs = localStorage.getItem("blogs");
    if (localBlogs) {
      setBlogs(JSON.parse(localBlogs));
    } else {
      localStorage.setItem("blogs", JSON.stringify(DEFAULT_POSTS));
      setBlogs(DEFAULT_POSTS);
    }

    const localEvents = localStorage.getItem("events");
    if (localEvents) {
      setEvents(JSON.parse(localEvents));
    } else {
      localStorage.setItem("events", JSON.stringify(DEFAULT_EVENTS));
      setEvents(DEFAULT_EVENTS);
    }

    const localResources = localStorage.getItem("past_questions");
    if (localResources) {
      setResources(JSON.parse(localResources));
    } else {
      localStorage.setItem("past_questions", JSON.stringify(DEFAULT_RESOURCES));
      setResources(DEFAULT_RESOURCES);
    }
  }, []);

  const resetForms = () => {
    setBlogForm({ title: "", date: "", category: "News", author: "", readTime: "3 min read", excerpt: "", image: "" });
    setEventForm({ title: "", date: "", venue: "", description: "", category: "Seminar", status: "upcoming", flier: "", commentary: "" });
    setResourceForm({ code: "", title: "", dept: "Computer Sciences", level: "100 Level", semester: "1st Semester", year: "2025/2026", size: "1.0 MB", fileData: "" });
    setEditingIndex(null);
    setShowForm(false);
  };

  // ─── Save Actions ─────────────────────────────────────────────────────────

  const handleSaveBlog = (e) => {
    e.preventDefault();
    let updatedBlogs = [...blogs];
    if (editingIndex !== null) {
      updatedBlogs[editingIndex] = blogForm;
      showToast("Blog post updated successfully", "success");
    } else {
      updatedBlogs.unshift(blogForm);
      showToast("Blog post created successfully", "success");
    }
    setBlogs(updatedBlogs);
    localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
    resetForms();
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    let updatedEvents = [...events];
    const flierUrl = eventForm.flier || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80";
    const eventData = { ...eventForm, flier: flierUrl, gallery: [flierUrl] };

    if (editingIndex !== null) {
      updatedEvents[editingIndex] = eventData;
      showToast("Event updated successfully", "success");
    } else {
      updatedEvents.unshift(eventData);
      showToast("Event created successfully", "success");
    }
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    resetForms();
  };

  const handleSaveResource = (e) => {
    e.preventDefault();
    let updatedResources = [...resources];
    if (editingIndex !== null) {
      updatedResources[editingIndex] = resourceForm;
      showToast("Resource updated successfully", "success");
    } else {
      updatedResources.unshift(resourceForm);
      showToast("Resource added successfully", "success");
    }
    setResources(updatedResources);
    localStorage.setItem("past_questions", JSON.stringify(updatedResources));
    resetForms();
  };

  // ─── Delete Actions ───────────────────────────────────────────────────────

  const handleDelete = (index) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    if (activeSection === "blogs") {
      const updated = blogs.filter((_, i) => i !== index);
      setBlogs(updated);
      localStorage.setItem("blogs", JSON.stringify(updated));
    } else if (activeSection === "events") {
      const updated = events.filter((_, i) => i !== index);
      setEvents(updated);
      localStorage.setItem("events", JSON.stringify(updated));
    } else {
      const updated = resources.filter((_, i) => i !== index);
      setResources(updated);
      localStorage.setItem("past_questions", JSON.stringify(updated));
    }
    showToast("Item deleted successfully", "success");
  };

  // ─── Edit Triggers ────────────────────────────────────────────────────────

  const startEdit = (index) => {
    setEditingIndex(index);
    setShowForm(true);
    if (activeSection === "blogs") {
      setBlogForm({ image: "", ...blogs[index] });
    } else if (activeSection === "events") {
      setEventForm({ flier: "", ...events[index] });
    } else {
      setResourceForm({ fileData: "", size: "1.0 MB", ...resources[index] });
    }
  };

  return (
    <div className="pt-16 bg-[#0A0A08] min-h-screen text-[#F0EDE6] selection:bg-[#2D7A22] selection:text-[#F0EDE6]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* ====== SIDEBAR ====== */}
          <aside className="w-full md:w-64 shrink-0 flex flex-col gap-2">
            <div className="p-4 border border-[rgba(255,255,255,0.07)] bg-[#111110] rounded-xl mb-4 text-center">
              <span className="text-[10px] uppercase tracking-widest text-[#888880] block mb-1">Administrative Role</span>
              <h2 className="text-white font-display font-medium text-sm">NACOS Administrator</h2>
            </div>
            
            <button
              onClick={() => { setActiveSection("blogs"); resetForms(); }}
              className={`w-full px-5 py-3 rounded-lg text-xs uppercase tracking-wider font-medium text-left border flex items-center gap-3 transition-colors ${
                activeSection === "blogs"
                  ? "bg-[#2D7A22] border-transparent text-[#F0EDE6]"
                  : "bg-[#111110] border-[rgba(255,255,255,0.07)] text-[#888880] hover:text-white"
              }`}
            >
              <i className="ti ti-news text-base" />
              Manage Blogs
            </button>
            <button
              onClick={() => { setActiveSection("events"); resetForms(); }}
              className={`w-full px-5 py-3 rounded-lg text-xs uppercase tracking-wider font-medium text-left border flex items-center gap-3 transition-colors ${
                activeSection === "events"
                  ? "bg-[#2D7A22] border-transparent text-[#F0EDE6]"
                  : "bg-[#111110] border-[rgba(255,255,255,0.07)] text-[#888880] hover:text-white"
              }`}
            >
              <i className="ti ti-calendar-event text-base" />
              Manage Events
            </button>
            <button
              onClick={() => { setActiveSection("resources"); resetForms(); }}
              className={`w-full px-5 py-3 rounded-lg text-xs uppercase tracking-wider font-medium text-left border flex items-center gap-3 transition-colors ${
                activeSection === "resources"
                  ? "bg-[#2D7A22] border-transparent text-[#F0EDE6]"
                  : "bg-[#111110] border-[rgba(255,255,255,0.07)] text-[#888880] hover:text-white"
              }`}
            >
              <i className="ti ti-books text-base" />
              Manage Resources
            </button>
          </aside>

          {/* ====== WORKSPACE ====== */}
          <main className="flex-1 bg-[#111110] border border-[rgba(255,255,255,0.07)] rounded-xl p-8">
            
            {/* Header / Stats Panel */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-[rgba(255,255,255,0.07)]">
              <div>
                <h1 className="font-display font-medium text-2xl text-white">
                  {activeSection === "blogs" && "Blog Archives"}
                  {activeSection === "events" && "Event Records"}
                  {activeSection === "resources" && "Vault Resources"}
                </h1>
                <p className="text-xs text-[#888880] mt-1 font-light">
                  {activeSection === "blogs" && `Showing ${blogs.length} stories listed on the blog page.`}
                  {activeSection === "events" && `Showing ${events.length} logs rendered on the events timelines.`}
                  {activeSection === "resources" && `Showing ${resources.length} past question files in the vault folders.`}
                </p>
              </div>

              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="px-5 py-2.5 bg-[#2D7A22] hover:bg-[#3A9C2D] text-[#F0EDE6] text-xs uppercase tracking-wider font-medium rounded-md transition-colors flex items-center gap-2"
                >
                  <i className="ti ti-plus" />
                  {activeSection === "blogs" && "Write Post"}
                  {activeSection === "events" && "Add Event"}
                  {activeSection === "resources" && "Add Resource"}
                </button>
              )}
            </div>

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
                    {editingIndex !== null ? "Edit Item Details" : "Create New Record"}
                  </h3>

                  {/* ─── BLOG FORM ─── */}
                  {activeSection === "blogs" && (
                    <form onSubmit={handleSaveBlog} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Post Title</label>
                        <input
                          type="text"
                          required
                          value={blogForm.title}
                          onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                          placeholder="e.g. Highlights from Web Dev Bootcamp 2025"
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Publication Date</label>
                        <input
                          type="text"
                          required
                          value={blogForm.date}
                          onChange={(e) => setBlogForm({ ...blogForm, date: e.target.value })}
                          placeholder="e.g. June 15, 2026"
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Category</label>
                        <select
                          value={blogForm.category}
                          onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]/40"
                        >
                          {["News", "Events", "Tech Tips", "Student Life"].map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Author Tag</label>
                        <input
                          type="text"
                          required
                          value={blogForm.author}
                          onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                          placeholder="e.g. PRO Team"
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Est. Read Time</label>
                        <input
                          type="text"
                          required
                          value={blogForm.readTime}
                          onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                          placeholder="e.g. 4 min read"
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]/40"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Excerpt / Summary</label>
                        <textarea
                          required
                          value={blogForm.excerpt}
                          onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                          placeholder="Provide a short intro paragraph..."
                          rows={3}
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]/40 resize-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Cover Image (Optional)</label>
                        <div className="flex items-center gap-4 bg-[#1A1A17] p-4 rounded border border-[rgba(255,255,255,0.07)]">
                          {blogForm.image ? (
                            <div className="relative w-24 h-24 rounded border border-[rgba(255,255,255,0.07)] overflow-hidden">
                              <img src={blogForm.image} alt="Preview" className="w-full h-full object-cover" />
                              <button 
                                type="button" 
                                onClick={() => setBlogForm({ ...blogForm, image: "" })}
                                className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-600 text-white rounded-full p-1 text-[10px]"
                                title="Remove Image"
                              >
                                <i className="ti ti-x" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1.5">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, "blog", "image")}
                                className="text-xs text-[#888880] file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#2D7A22] file:text-[#F0EDE6] hover:file:bg-[#3A9C2D] file:cursor-pointer"
                              />
                              <span className="text-[10px] text-[#555550]">Supports JPEG, PNG (max 800x800 auto-resizing)</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="sm:col-span-2 flex gap-3 mt-2">
                        <button type="submit" className="px-5 py-2.5 bg-[#2D7A22] hover:bg-[#3A9C2D] text-[#F0EDE6] text-xs uppercase tracking-wider font-medium rounded-md">
                          {editingIndex !== null ? "Save Changes" : "Publish Story"}
                        </button>
                        <button type="button" onClick={resetForms} className="px-5 py-2.5 bg-[#1A1A17] hover:bg-white/[0.03] text-[#888880] hover:text-white border border-[rgba(255,255,255,0.07)] text-xs uppercase tracking-wider font-medium rounded-md">
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* ─── EVENT FORM ─── */}
                  {activeSection === "events" && (
                    <form onSubmit={handleSaveEvent} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Event Title</label>
                        <input
                          type="text"
                          required
                          value={eventForm.title}
                          onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                          placeholder="e.g. NACOS Hackathon Demo Day"
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Event Date</label>
                        <input
                          type="text"
                          required
                          value={eventForm.date}
                          onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                          placeholder="e.g. July 14, 2026"
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Venue</label>
                        <input
                          type="text"
                          required
                          value={eventForm.venue}
                          onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                          placeholder="e.g. CIS Lecture Theatre 1"
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Category</label>
                        <select
                          value={eventForm.category}
                          onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]/40"
                        >
                          {["Workshop", "Competition", "Social", "Seminar", "General"].map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Status</label>
                        <select
                          value={eventForm.status}
                          onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })}
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]/40"
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="past">Past / Archive</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Event Flier</label>
                        <div className="flex flex-col sm:flex-row gap-4 items-stretch bg-[#1A1A17] p-4 rounded border border-[rgba(255,255,255,0.07)]">
                          {eventForm.flier && eventForm.flier.startsWith("data:") ? (
                            <div className="relative w-24 h-24 rounded border border-[rgba(255,255,255,0.07)] overflow-hidden flex-shrink-0">
                              <img src={eventForm.flier} alt="Preview" className="w-full h-full object-cover" />
                              <button 
                                type="button" 
                                onClick={() => setEventForm({ ...eventForm, flier: "" })}
                                className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-600 text-white rounded-full p-1 text-[10px]"
                                title="Remove Flier"
                              >
                                <i className="ti ti-x" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex-1 flex flex-col justify-center">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, "event", "flier")}
                                className="text-xs text-[#888880] file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#2D7A22] file:text-[#F0EDE6] hover:file:bg-[#3A9C2D] file:cursor-pointer mb-2"
                              />
                              <span className="text-[10px] text-[#555550]">Upload an image file (auto-compressed)</span>
                            </div>
                          )}
                          
                          <div className="hidden sm:flex items-center text-[#555550] text-xs font-light px-2">OR</div>
                          
                          <div className="flex-1 flex flex-col justify-center">
                            <input
                              type="text"
                              value={eventForm.flier && eventForm.flier.startsWith("data:") ? "" : eventForm.flier}
                              disabled={!!(eventForm.flier && eventForm.flier.startsWith("data:"))}
                              onChange={(e) => setEventForm({ ...eventForm, flier: e.target.value })}
                              placeholder="Or paste image URL (e.g., https://...)"
                              className="w-full px-4 py-2 bg-[#111110] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]/40"
                            />
                            <span className="text-[10px] text-[#555550] mt-1">Paste a web URL directly</span>
                          </div>
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Event Brief Description</label>
                        <textarea
                          required
                          value={eventForm.description}
                          onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                          placeholder="Write a brief overview of what this event is..."
                          rows={2}
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]/40 resize-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Recap Commentary (Past/Archive Only)</label>
                        <textarea
                          value={eventForm.commentary}
                          onChange={(e) => setEventForm({ ...eventForm, commentary: e.target.value })}
                          placeholder="Summarize the outcome recap of the event..."
                          rows={3}
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]/40 resize-none"
                        />
                      </div>
                      <div className="sm:col-span-2 flex gap-3 mt-2">
                        <button type="submit" className="px-5 py-2.5 bg-[#2D7A22] hover:bg-[#3A9C2D] text-[#F0EDE6] text-xs uppercase tracking-wider font-medium rounded-md">
                          {editingIndex !== null ? "Save Changes" : "Log Event"}
                        </button>
                        <button type="button" onClick={resetForms} className="px-5 py-2.5 bg-[#1A1A17] hover:bg-white/[0.03] text-[#888880] hover:text-white border border-[rgba(255,255,255,0.07)] text-xs uppercase tracking-wider font-medium rounded-md">
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* ─── RESOURCE FORM ─── */}
                  {activeSection === "resources" && (
                    <form onSubmit={handleSaveResource} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Course Code</label>
                        <input
                          type="text"
                          required
                          value={resourceForm.code}
                          onChange={(e) => setResourceForm({ ...resourceForm, code: e.target.value })}
                          placeholder="e.g. CSC 311"
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Course Title</label>
                        <input
                          type="text"
                          required
                          value={resourceForm.title}
                          onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                          placeholder="e.g. Object-Oriented Programming"
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Department</label>
                        <select
                          value={resourceForm.dept}
                          onChange={(e) => setResourceForm({ ...resourceForm, dept: e.target.value })}
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]/40"
                        >
                          {DEPARTMENTS.map((dept) => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Level</label>
                        <select
                          value={resourceForm.level}
                          onChange={(e) => setResourceForm({ ...resourceForm, level: e.target.value })}
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]/40"
                        >
                          {LEVELS.map((lvl) => (
                            <option key={lvl} value={lvl}>{lvl}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Semester</label>
                        <select
                          value={resourceForm.semester}
                          onChange={(e) => setResourceForm({ ...resourceForm, semester: e.target.value })}
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]/40"
                        >
                          <option value="1st Semester">1st Semester</option>
                          <option value="2nd Semester">2nd Semester</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Academic Year</label>
                        <input
                          type="text"
                          required
                          value={resourceForm.year}
                          onChange={(e) => setResourceForm({ ...resourceForm, year: e.target.value })}
                          placeholder="e.g. 2025/2026"
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]/40"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">PDF File Resource (Max 1.5MB)</label>
                        <div className="flex items-center gap-4 bg-[#1A1A17] p-4 rounded border border-[rgba(255,255,255,0.07)]">
                          {resourceForm.fileData ? (
                            <div className="flex items-center gap-3 bg-[#111110] px-4 py-2.5 rounded border border-[#2D7A22]/30 w-full justify-between">
                              <div className="flex items-center gap-2">
                                <i className="ti ti-file-type-pdf text-[#2D7A22] text-xl" />
                                <div>
                                  <div className="text-xs text-white font-medium">Resource Attached</div>
                                  <div className="text-[10px] text-[#888880]">File Size: {resourceForm.size}</div>
                                </div>
                              </div>
                              <button 
                                type="button" 
                                onClick={() => setResourceForm({ ...resourceForm, fileData: "", size: "1.0 MB" })}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded p-1.5 text-xs transition-colors"
                                title="Remove PDF"
                              >
                                <i className="ti ti-trash" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1.5 w-full">
                              <input
                                type="file"
                                accept=".pdf"
                                required={editingIndex === null}
                                onChange={(e) => handleFileChange(e, "resource")}
                                className="text-xs text-[#888880] file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#2D7A22] file:text-[#F0EDE6] hover:file:bg-[#3A9C2D] file:cursor-pointer"
                              />
                              <span className="text-[10px] text-[#555550]">Select a PDF document (Required for new uploads).</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="sm:col-span-2 flex gap-3 mt-2">
                        <button type="submit" className="px-5 py-2.5 bg-[#2D7A22] hover:bg-[#3A9C2D] text-[#F0EDE6] text-xs uppercase tracking-wider font-medium rounded-md">
                          {editingIndex !== null ? "Save Changes" : "Upload Resource"}
                        </button>
                        <button type="button" onClick={resetForms} className="px-5 py-2.5 bg-[#1A1A17] hover:bg-white/[0.03] text-[#888880] hover:text-white border border-[rgba(255,255,255,0.07)] text-xs uppercase tracking-wider font-medium rounded-md">
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ====== RECORD ROWS LIST ====== */}
            <div className="space-y-4">
              
              {/* Blog Records List */}
              {activeSection === "blogs" && (
                blogs.length === 0 ? (
                  <p className="text-[#888880] text-xs italic font-light text-center py-8">No stories published yet.</p>
                ) : (
                  blogs.map((post, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-[#1A1A17]/40 border border-[rgba(255,255,255,0.05)] rounded-lg p-4 hover:border-[rgba(255,255,255,0.1)] transition-colors">
                      <div className="max-w-[70%]">
                        <span className="text-[9px] uppercase tracking-wider text-[#2D7A22] bg-[#2D7A22]/10 border border-[#2D7A22]/20 px-2 py-0.5 rounded">{post.category}</span>
                        <h4 className="text-white font-medium text-sm mt-2">{post.title}</h4>
                        <p className="text-[10px] text-[#888880] mt-1 font-light">By {post.author} · {post.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(idx)} className="p-2 border border-[rgba(255,255,255,0.07)] hover:border-white/20 text-[#888880] hover:text-white rounded transition-colors text-xs" title="Edit"><i className="ti ti-edit" /></button>
                        <button onClick={() => handleDelete(idx)} className="p-2 border border-red-500/10 hover:border-red-500/30 text-red-500/70 hover:text-red-400 rounded transition-colors text-xs" title="Delete"><i className="ti ti-trash" /></button>
                      </div>
                    </div>
                  ))
                )
              )}

              {/* Event Records List */}
              {activeSection === "events" && (
                events.length === 0 ? (
                  <p className="text-[#888880] text-xs italic font-light text-center py-8">No events logged yet.</p>
                ) : (
                  events.map((evt, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-[#1A1A17]/40 border border-[rgba(255,255,255,0.05)] rounded-lg p-4 hover:border-[rgba(255,255,255,0.1)] transition-colors">
                      <div className="max-w-[70%]">
                        <div className="flex gap-2 items-center">
                          <span className="text-[9px] uppercase tracking-wider text-[#888880] bg-[#111110] border border-[rgba(255,255,255,0.07)] px-2 py-0.5 rounded">{evt.category}</span>
                          <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded ${evt.status === "upcoming" ? "bg-[#2D7A22]/15 text-[#2D7A22]" : "bg-white/5 text-[#888880]"}`}>{evt.status}</span>
                        </div>
                        <h4 className="text-white font-medium text-sm mt-2">{evt.title}</h4>
                        <p className="text-[10px] text-[#888880] mt-1 font-light">At {evt.venue} · {evt.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(idx)} className="p-2 border border-[rgba(255,255,255,0.07)] hover:border-white/20 text-[#888880] hover:text-white rounded transition-colors text-xs" title="Edit"><i className="ti ti-edit" /></button>
                        <button onClick={() => handleDelete(idx)} className="p-2 border border-red-500/10 hover:border-red-500/30 text-red-500/70 hover:text-red-400 rounded transition-colors text-xs" title="Delete"><i className="ti ti-trash" /></button>
                      </div>
                    </div>
                  ))
                )
              )}

              {/* Resource Records List */}
              {activeSection === "resources" && (
                resources.length === 0 ? (
                  <p className="text-[#888880] text-xs italic font-light text-center py-8">No resource files uploaded yet.</p>
                ) : (
                  resources.map((res, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-[#1A1A17]/40 border border-[rgba(255,255,255,0.05)] rounded-lg p-4 hover:border-[rgba(255,255,255,0.1)] transition-colors">
                      <div className="max-w-[70%]">
                        <span className="text-[9px] uppercase tracking-wider text-[#2D7A22] bg-[#2D7A22]/10 border border-[#2D7A22]/20 px-2.5 py-0.5 rounded">{res.code}</span>
                        <h4 className="text-white font-medium text-sm mt-2">{res.title}</h4>
                        <p className="text-[10px] text-[#888880] mt-1 font-light">{res.dept} · {res.level} · {res.semester} · {res.size}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(idx)} className="p-2 border border-[rgba(255,255,255,0.07)] hover:border-white/20 text-[#888880] hover:text-white rounded transition-colors text-xs" title="Edit"><i className="ti ti-edit" /></button>
                        <button onClick={() => handleDelete(idx)} className="p-2 border border-red-500/10 hover:border-red-500/30 text-red-500/70 hover:text-red-400 rounded transition-colors text-xs" title="Delete"><i className="ti ti-trash" /></button>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

const DEPARTMENTS = ["Computer Sciences", "Information Technology", "Cyber Security"];
const LEVELS = ["100 Level", "200 Level", "300 Level", "400 Level"];
