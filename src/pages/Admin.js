import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../components/Toast";
import { INITIAL_BLOG_POSTS } from "../data/blogData";
import BlogReaderModal from "../components/BlogReaderModal";
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getResources,
  createResource,
  updateResource,
  deleteResource,
  uploadImage,
  adminLogin,
  adminLogout,
  getAdminMe,
  getSubscribers,
  resolveAssetUrl,
} from "../components/api";

const DEFAULT_POSTS = INITIAL_BLOG_POSTS;

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
];

const DEPARTMENTS = ["Computer Sciences", "Information Technology", "Cyber Security"];
const LEVELS = ["100 Level", "200 Level", "300 Level", "400 Level"];

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

  // Auth states
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const [loginCreds, setLoginCreds] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState(null);
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Section states
  const [activeSection, setActiveSection] = useState("blogs");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lists
  const [blogs, setBlogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [previewPost, setPreviewPost] = useState(null);

  // Raw file references for uploads
  const [blogFile, setBlogFile] = useState(null);
  const [eventFile, setEventFile] = useState(null);
  const [resourceFile, setResourceFile] = useState(null);

  // Form states
  const [blogForm, setBlogForm] = useState({
    id: "",
    title: "",
    date: "",
    category: "News",
    author: "",
    authorRole: "",
    readTime: "4 min read",
    excerpt: "",
    content: "",
    tagsInput: "",
    image: "",
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
    filePath: "",
  });

  // Check admin session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const me = await getAdminMe();
        if (me && me.username) {
          setIsAdminAuthenticated(true);
          setAdminUser(me);
        }
      } catch (err) {
        setIsAdminAuthenticated(false);
        setAdminUser(null);
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Fetch data
  const loadAllData = async () => {
    try {
      const [fetchedBlogs, fetchedEvents, fetchedResources] = await Promise.all([
        getBlogs().catch(() => null),
        getEvents().catch(() => null),
        getResources().catch(() => null),
      ]);

      if (fetchedBlogs && Array.isArray(fetchedBlogs)) {
        setBlogs(fetchedBlogs);
        localStorage.setItem("blogs", JSON.stringify(fetchedBlogs));
      } else {
        const local = localStorage.getItem("blogs");
        setBlogs(local ? JSON.parse(local) : DEFAULT_POSTS);
      }

      if (fetchedEvents && Array.isArray(fetchedEvents)) {
        setEvents(fetchedEvents);
        localStorage.setItem("events", JSON.stringify(fetchedEvents));
      } else {
        const local = localStorage.getItem("events");
        setEvents(local ? JSON.parse(local) : DEFAULT_EVENTS);
      }

      if (fetchedResources && Array.isArray(fetchedResources)) {
        setResources(fetchedResources);
        localStorage.setItem("past_questions", JSON.stringify(fetchedResources));
      } else {
        const local = localStorage.getItem("past_questions");
        setResources(local ? JSON.parse(local) : DEFAULT_RESOURCES);
      }

      // Load subscribers if authenticated
      try {
        const fetchedSubscribers = await getSubscribers();
        if (Array.isArray(fetchedSubscribers)) {
          setSubscribers(fetchedSubscribers);
        }
      } catch (e) {}
    } catch (err) {
      console.warn("Using offline localStorage fallback:", err);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [isAdminAuthenticated]);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSubmitting(true);
    try {
      const res = await adminLogin(loginCreds.username, loginCreds.password);
      setIsAdminAuthenticated(true);
      setAdminUser(res.user);
      showToast("Welcome back, Administrator!", "success");
      loadAllData();
    } catch (err) {
      setLoginError(err.message || "Invalid administrator credentials.");
      showToast("Authentication failed", "error");
    } finally {
      setLoginSubmitting(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await adminLogout();
    } catch (e) {}
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    showToast("Signed out of Admin console", "info");
  };

  // Reset forms
  const resetForms = () => {
    setBlogForm({
      id: "",
      title: "",
      date: "",
      category: "News",
      author: "",
      authorRole: "",
      readTime: "4 min read",
      excerpt: "",
      content: "",
      tagsInput: "",
      image: "",
    });
    setEventForm({
      title: "",
      date: "",
      venue: "",
      description: "",
      category: "Seminar",
      status: "upcoming",
      flier: "",
      commentary: "",
    });
    setResourceForm({
      code: "",
      title: "",
      dept: "Computer Sciences",
      level: "100 Level",
      semester: "1st Semester",
      year: "2025/2026",
      size: "1.0 MB",
      filePath: "",
    });
    setBlogFile(null);
    setEventFile(null);
    setResourceFile(null);
    setEditingItem(null);
    setShowForm(false);
  };

  // ─── File selection handlers ───────────────────────────────────────────────

  const handleBlogImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBlogFile(file);
    const objectUrl = URL.createObjectURL(file);
    setBlogForm((prev) => ({ ...prev, image: objectUrl }));
    showToast("Cover image selected for upload.", "info");
  };

  const handleEventFlierChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEventFile(file);
    const objectUrl = URL.createObjectURL(file);
    setEventForm((prev) => ({ ...prev, flier: objectUrl }));
    showToast("Event flier selected for upload.", "info");
  };

  const handleResourceFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      showToast("PDF file is too large. Max size allowed is 20 MB.", "error");
      e.target.value = "";
      return;
    }
    setResourceFile(file);
    setResourceForm((prev) => ({
      ...prev,
      size: formatFileSize(file.size),
    }));
    showToast("PDF document attached.", "info");
  };

  // ─── Save Blog ─────────────────────────────────────────────────────────────

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalImageUrl = blogForm.image;

      // If a file was selected, upload it to NestJS backend
      if (blogFile) {
        try {
          const uploadRes = await uploadImage(blogFile);
          if (uploadRes && uploadRes.url) {
            finalImageUrl = uploadRes.url;
          }
        } catch (uploadErr) {
          console.warn("Image upload endpoint failed, proceeding with original URL:", uploadErr);
        }
      }

      const tagsArray = blogForm.tagsInput
        ? blogForm.tagsInput.split(",").map((t) => t.trim()).filter(Boolean)
        : blogForm.tags || [];

      const postData = {
        title: blogForm.title,
        date: blogForm.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        category: blogForm.category,
        author: blogForm.author,
        authorRole: blogForm.authorRole,
        readTime: blogForm.readTime,
        excerpt: blogForm.excerpt,
        content: blogForm.content,
        tags: tagsArray,
        image: finalImageUrl,
      };

      if (editingItem && editingItem.id) {
        await updateBlog(editingItem.id, postData);
        showToast("Blog post updated on server", "success");
      } else {
        await createBlog(postData);
        showToast("Blog post published to server", "success");
      }

      await loadAllData();
      resetForms();
    } catch (err) {
      console.error(err);
      showToast(`Error: ${err.message || "Failed to save blog post"}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Save Event ────────────────────────────────────────────────────────────

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalFlierUrl = eventForm.flier || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80";

      if (eventFile) {
        try {
          const uploadRes = await uploadImage(eventFile);
          if (uploadRes && uploadRes.url) {
            finalFlierUrl = uploadRes.url;
          }
        } catch (uploadErr) {
          console.warn("Flier upload failed, keeping URL:", uploadErr);
        }
      }

      const eventData = {
        title: eventForm.title,
        date: eventForm.date,
        venue: eventForm.venue,
        description: eventForm.description,
        category: eventForm.category,
        status: eventForm.status,
        flier: finalFlierUrl,
        commentary: eventForm.commentary,
        gallery: [finalFlierUrl],
      };

      if (editingItem && editingItem.id) {
        await updateEvent(editingItem.id, eventData);
        showToast("Event updated on server", "success");
      } else {
        await createEvent(eventData);
        showToast("Event created on server", "success");
      }

      await loadAllData();
      resetForms();
    } catch (err) {
      console.error(err);
      showToast(`Error: ${err.message || "Failed to save event"}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Save Resource ─────────────────────────────────────────────────────────

  const handleSaveResource = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("code", resourceForm.code);
      formData.append("title", resourceForm.title);
      formData.append("dept", resourceForm.dept);
      formData.append("level", resourceForm.level);
      formData.append("semester", resourceForm.semester);
      formData.append("year", resourceForm.year);
      formData.append("size", resourceForm.size || "1.0 MB");

      if (resourceFile) {
        formData.append("file", resourceFile);
      }

      if (editingItem && editingItem.id) {
        await updateResource(editingItem.id, formData);
        showToast("Resource updated on server", "success");
      } else {
        await createResource(formData);
        showToast("Resource uploaded to server", "success");
      }

      await loadAllData();
      resetForms();
    } catch (err) {
      console.error(err);
      showToast(`Error: ${err.message || "Failed to save resource"}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Delete Handlers ───────────────────────────────────────────────────────

  const handleDelete = async (item, index) => {
    if (!window.confirm("Are you sure you want to permanently delete this record?")) return;

    try {
      if (activeSection === "blogs") {
        if (item.id) await deleteBlog(item.id);
        setBlogs((prev) => prev.filter((_, i) => i !== index));
      } else if (activeSection === "events") {
        if (item.id) await deleteEvent(item.id);
        setEvents((prev) => prev.filter((_, i) => i !== index));
      } else if (activeSection === "resources") {
        if (item.id) await deleteResource(item.id);
        setResources((prev) => prev.filter((_, i) => i !== index));
      }
      showToast("Record deleted successfully", "success");
    } catch (err) {
      console.error(err);
      showToast(`Delete failed: ${err.message}`, "error");
    }
  };

  // ─── Edit Triggers ────────────────────────────────────────────────────────

  const startEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
    if (activeSection === "blogs") {
      setBlogForm({
        ...item,
        tagsInput: Array.isArray(item.tags) ? item.tags.join(", ") : "",
      });
    } else if (activeSection === "events") {
      setEventForm({ ...item });
    } else if (activeSection === "resources") {
      setResourceForm({ ...item });
    }
  };

  if (authLoading) {
    return (
      <div className="pt-24 min-h-screen bg-[#0A0A08] flex items-center justify-center text-[#888880]">
        <div className="flex items-center gap-3">
          <i className="ti ti-loader-2 animate-spin text-xl text-[#2D7A22]" />
          <span>Verifying administrator privileges...</span>
        </div>
      </div>
    );
  }

  // ─── Admin Login Form (when unauthenticated) ────────────────────────────────

  if (!isAdminAuthenticated) {
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
            Sign in with administrative credentials to manage blog stories, events, and course vaults.
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

  // ─── Main Admin Dashboard ──────────────────────────────────────────────────

  return (
    <div className="pt-16 bg-[#0A0A08] min-h-screen text-[#F0EDE6] selection:bg-[#2D7A22] selection:text-[#F0EDE6]">
      {/* Blog Article Live Preview Modal */}
      <BlogReaderModal
        post={previewPost}
        isOpen={Boolean(previewPost)}
        onClose={() => setPreviewPost(null)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row gap-6 sm:gap-8">

          {/* ====== SIDEBAR ====== */}
          <aside className="w-full md:w-64 shrink-0 flex flex-col gap-2">
            <div className="p-4 border border-[rgba(255,255,255,0.07)] bg-[#111110] rounded-xl mb-2 sm:mb-4 text-center relative overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-[#2D7A22]/15 text-[#2D7A22] flex items-center justify-center mx-auto mb-2 font-medium text-sm">
                {adminUser?.username?.[0]?.toUpperCase() || "A"}
              </div>
              <span className="text-[10px] uppercase tracking-widest text-[#888880] block mb-0.5">Logged in as</span>
              <h2 className="text-white font-display font-medium text-sm">{adminUser?.username || "Admin"}</h2>
              <button
                onClick={handleLogout}
                className="mt-3 text-[10px] text-red-400 hover:text-red-300 transition-colors flex items-center justify-center gap-1 mx-auto"
              >
                <i className="ti ti-logout text-xs" /> Sign Out
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-1 gap-2">
              <button
                onClick={() => { setActiveSection("blogs"); resetForms(); }}
                className={`w-full px-4 sm:px-5 py-3 rounded-lg text-xs uppercase tracking-wider font-medium text-left border flex items-center gap-3 transition-colors ${
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
                className={`w-full px-4 sm:px-5 py-3 rounded-lg text-xs uppercase tracking-wider font-medium text-left border flex items-center gap-3 transition-colors ${
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
                className={`w-full px-4 sm:px-5 py-3 rounded-lg text-xs uppercase tracking-wider font-medium text-left border flex items-center gap-3 transition-colors ${
                  activeSection === "resources"
                    ? "bg-[#2D7A22] border-transparent text-[#F0EDE6]"
                    : "bg-[#111110] border-[rgba(255,255,255,0.07)] text-[#888880] hover:text-white"
                }`}
              >
                <i className="ti ti-books text-base" />
                Manage Resources
              </button>
              <button
                onClick={() => { setActiveSection("subscribers"); resetForms(); }}
                className={`w-full px-4 sm:px-5 py-3 rounded-lg text-xs uppercase tracking-wider font-medium text-left border flex items-center gap-3 transition-colors ${
                  activeSection === "subscribers"
                    ? "bg-[#2D7A22] border-transparent text-[#F0EDE6]"
                    : "bg-[#111110] border-[rgba(255,255,255,0.07)] text-[#888880] hover:text-white"
                }`}
              >
                <i className="ti ti-mail text-base" />
                Subscribers
              </button>
            </div>
          </aside>

          {/* ====== WORKSPACE ====== */}
          <main className="flex-1 bg-[#111110] border border-[rgba(255,255,255,0.07)] rounded-xl p-5 sm:p-8">

            {/* Header Panel */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-[rgba(255,255,255,0.07)]">
              <div>
                <h1 className="font-display font-medium text-2xl text-white">
                  {activeSection === "blogs" && "Blog Stories"}
                  {activeSection === "events" && "Event Records"}
                  {activeSection === "resources" && "Vault Resources"}
                  {activeSection === "subscribers" && "Newsletter Subscribers"}
                </h1>
                <p className="text-xs text-[#888880] mt-1 font-light">
                  {activeSection === "blogs" && `Showing ${blogs.length} stories synced with the NestJS backend.`}
                  {activeSection === "events" && `Showing ${events.length} events logged in the database.`}
                  {activeSection === "resources" && `Showing ${resources.length} past questions stored in the archive.`}
                  {activeSection === "subscribers" && `Showing ${subscribers.length} newsletter subscribers registered.`}
                </p>
              </div>

              {!showForm && activeSection !== "subscribers" && (
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
                    {editingItem ? "Edit Record Details" : "Create New Record"}
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
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
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
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Category</label>
                        <select
                          value={blogForm.category}
                          onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
                        >
                          {["News", "Events", "Tech Tips", "Student Life", "Tutorials"].map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Author Name</label>
                        <input
                          type="text"
                          required
                          value={blogForm.author}
                          onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                          placeholder="e.g. PRO Team / Mariam Yussuf"
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Author Role / Directorate</label>
                        <input
                          type="text"
                          value={blogForm.authorRole || ""}
                          onChange={(e) => setBlogForm({ ...blogForm, authorRole: e.target.value })}
                          placeholder="e.g. Technical Directorate"
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
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
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Tags (comma separated)</label>
                        <input
                          type="text"
                          value={blogForm.tagsInput || ""}
                          onChange={(e) => setBlogForm({ ...blogForm, tagsInput: e.target.value })}
                          placeholder="e.g. React, Bootcamp, Hackathon"
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Excerpt / Summary</label>
                        <textarea
                          required
                          value={blogForm.excerpt}
                          onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                          placeholder="Provide a compelling 2-3 sentence overview..."
                          rows={2}
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22] resize-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="block text-[10px] uppercase text-[#888880] tracking-wider">Full Article Body (Markdown)</label>
                          <span className="text-[10px] text-[#555550]">Tip: Use ### for headers, &gt; for quotes</span>
                        </div>
                        <textarea
                          value={blogForm.content || ""}
                          onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                          placeholder="Write the full markdown content of the story..."
                          rows={8}
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22] font-mono text-xs leading-relaxed"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Cover Image (Upload or Web URL)</label>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#1A1A17] p-4 rounded border border-[rgba(255,255,255,0.07)]">
                          {blogForm.image ? (
                            <div className="relative w-28 h-20 rounded border border-[rgba(255,255,255,0.07)] overflow-hidden">
                              <img src={resolveAssetUrl(blogForm.image)} alt="Preview" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => { setBlogForm({ ...blogForm, image: "" }); setBlogFile(null); }}
                                className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-600 text-white rounded-full p-1 text-[10px]"
                                title="Remove Image"
                              >
                                <i className="ti ti-x" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1.5 w-full">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleBlogImageChange}
                                className="text-xs text-[#888880] file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#2D7A22] file:text-[#F0EDE6] hover:file:bg-[#3A9C2D] file:cursor-pointer"
                              />
                              <span className="text-[10px] text-[#555550]">Upload image file (JPG, PNG, WebP) or paste an external image URL:</span>
                              <input
                                type="text"
                                value={blogForm.image || ""}
                                onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                                placeholder="https://images.unsplash.com/..."
                                className="w-full px-3 py-1.5 bg-[#111110] border border-[rgba(255,255,255,0.07)] text-white text-xs rounded focus:outline-none focus:border-[#2D7A22] mt-1"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="sm:col-span-2 flex gap-3 mt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-5 py-2.5 bg-[#2D7A22] hover:bg-[#3A9C2D] text-[#F0EDE6] text-xs uppercase tracking-wider font-medium rounded-md flex items-center gap-2"
                        >
                          {isSubmitting ? <i className="ti ti-loader-2 animate-spin text-sm" /> : null}
                          {editingItem ? "Save Changes" : "Publish Story"}
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
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
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
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
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
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="past">Past / Archive</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Event Flier</label>
                        <div className="flex flex-col sm:flex-row gap-4 items-stretch bg-[#1A1A17] p-4 rounded border border-[rgba(255,255,255,0.07)]">
                          {eventForm.flier ? (
                            <div className="relative w-24 h-24 rounded border border-[rgba(255,255,255,0.07)] overflow-hidden flex-shrink-0">
                              <img src={resolveAssetUrl(eventForm.flier)} alt="Preview" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => { setEventForm({ ...eventForm, flier: "" }); setEventFile(null); }}
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
                                onChange={handleEventFlierChange}
                                className="text-xs text-[#888880] file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#2D7A22] file:text-[#F0EDE6] hover:file:bg-[#3A9C2D] file:cursor-pointer mb-2"
                              />
                              <span className="text-[10px] text-[#555550]">Upload an image flier or paste an image link:</span>
                              <input
                                type="text"
                                value={eventForm.flier || ""}
                                onChange={(e) => setEventForm({ ...eventForm, flier: e.target.value })}
                                placeholder="https://images.unsplash.com/..."
                                className="w-full px-4 py-2 bg-[#111110] border border-[rgba(255,255,255,0.07)] text-white text-xs rounded-md focus:outline-none focus:border-[#2D7A22] mt-1"
                              />
                            </div>
                          )}
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
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22] resize-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Recap Commentary (Past Events)</label>
                        <textarea
                          value={eventForm.commentary}
                          onChange={(e) => setEventForm({ ...eventForm, commentary: e.target.value })}
                          placeholder="Summarize the recap and highlights of the event..."
                          rows={3}
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22] resize-none"
                        />
                      </div>
                      <div className="sm:col-span-2 flex gap-3 mt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-5 py-2.5 bg-[#2D7A22] hover:bg-[#3A9C2D] text-[#F0EDE6] text-xs uppercase tracking-wider font-medium rounded-md flex items-center gap-2"
                        >
                          {isSubmitting ? <i className="ti ti-loader-2 animate-spin text-sm" /> : null}
                          {editingItem ? "Save Changes" : "Log Event"}
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
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
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
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Department</label>
                        <select
                          value={resourceForm.dept}
                          onChange={(e) => setResourceForm({ ...resourceForm, dept: e.target.value })}
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
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
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
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
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
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
                          className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">PDF File Resource (Max 20MB)</label>
                        <div className="flex items-center gap-4 bg-[#1A1A17] p-4 rounded border border-[rgba(255,255,255,0.07)]">
                          {resourceFile || resourceForm.filePath ? (
                            <div className="flex items-center gap-3 bg-[#111110] px-4 py-2.5 rounded border border-[#2D7A22]/30 w-full justify-between">
                              <div className="flex items-center gap-2">
                                <i className="ti ti-file-type-pdf text-[#2D7A22] text-xl" />
                                <div>
                                  <div className="text-xs text-white font-medium">
                                    {resourceFile ? resourceFile.name : "Attached Document"}
                                  </div>
                                  <div className="text-[10px] text-[#888880]">File Size: {resourceForm.size}</div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => { setResourceFile(null); setResourceForm({ ...resourceForm, filePath: "" }); }}
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
                                onChange={handleResourceFileChange}
                                className="text-xs text-[#888880] file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#2D7A22] file:text-[#F0EDE6] hover:file:bg-[#3A9C2D] file:cursor-pointer"
                              />
                              <span className="text-[10px] text-[#555550]">Select a PDF document (uploaded securely to backend server).</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="sm:col-span-2 flex gap-3 mt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-5 py-2.5 bg-[#2D7A22] hover:bg-[#3A9C2D] text-[#F0EDE6] text-xs uppercase tracking-wider font-medium rounded-md flex items-center gap-2"
                        >
                          {isSubmitting ? <i className="ti ti-loader-2 animate-spin text-sm" /> : null}
                          {editingItem ? "Save Changes" : "Upload Resource"}
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
                    <div key={post.id || idx} className="flex justify-between items-center bg-[#1A1A17]/40 border border-[rgba(255,255,255,0.05)] rounded-lg p-4 hover:border-[rgba(255,255,255,0.1)] transition-colors">
                      <div className="max-w-[70%]">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] uppercase tracking-wider text-[#2D7A22] bg-[#2D7A22]/10 border border-[#2D7A22]/20 px-2 py-0.5 rounded font-medium">{post.category}</span>
                          <span className="text-[10px] text-[#888880] font-light">{post.readTime}</span>
                        </div>
                        <h4 className="text-white font-medium text-sm mt-1 line-clamp-1">{post.title}</h4>
                        <p className="text-[10px] text-[#888880] mt-1 font-light">By {post.author} {post.authorRole ? `(${post.authorRole})` : ""} · {post.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setPreviewPost(post)} className="p-2 border border-[#2D7A22]/30 hover:border-[#2D7A22] text-[#2D7A22] hover:bg-[#2D7A22]/10 rounded transition-colors text-xs" title="Preview Article"><i className="ti ti-eye" /></button>
                        <button onClick={() => startEdit(post)} className="p-2 border border-[rgba(255,255,255,0.07)] hover:border-white/20 text-[#888880] hover:text-white rounded transition-colors text-xs" title="Edit"><i className="ti ti-edit" /></button>
                        <button onClick={() => handleDelete(post, idx)} className="p-2 border border-red-500/10 hover:border-red-500/30 text-red-500/70 hover:text-red-400 rounded transition-colors text-xs" title="Delete"><i className="ti ti-trash" /></button>
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
                    <div key={evt.id || idx} className="flex justify-between items-center bg-[#1A1A17]/40 border border-[rgba(255,255,255,0.05)] rounded-lg p-4 hover:border-[rgba(255,255,255,0.1)] transition-colors">
                      <div className="max-w-[70%]">
                        <div className="flex gap-2 items-center">
                          <span className="text-[9px] uppercase tracking-wider text-[#888880] bg-[#111110] border border-[rgba(255,255,255,0.07)] px-2 py-0.5 rounded">{evt.category}</span>
                          <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded ${evt.status === "upcoming" ? "bg-[#2D7A22]/15 text-[#2D7A22]" : "bg-white/5 text-[#888880]"}`}>{evt.status}</span>
                        </div>
                        <h4 className="text-white font-medium text-sm mt-2">{evt.title}</h4>
                        <p className="text-[10px] text-[#888880] mt-1 font-light">At {evt.venue} · {evt.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(evt)} className="p-2 border border-[rgba(255,255,255,0.07)] hover:border-white/20 text-[#888880] hover:text-white rounded transition-colors text-xs" title="Edit"><i className="ti ti-edit" /></button>
                        <button onClick={() => handleDelete(evt, idx)} className="p-2 border border-red-500/10 hover:border-red-500/30 text-red-500/70 hover:text-red-400 rounded transition-colors text-xs" title="Delete"><i className="ti ti-trash" /></button>
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
                    <div key={res.id || idx} className="flex justify-between items-center bg-[#1A1A17]/40 border border-[rgba(255,255,255,0.05)] rounded-lg p-4 hover:border-[rgba(255,255,255,0.1)] transition-colors">
                      <div className="max-w-[70%]">
                        <span className="text-[9px] uppercase tracking-wider text-[#2D7A22] bg-[#2D7A22]/10 border border-[#2D7A22]/20 px-2.5 py-0.5 rounded">{res.code}</span>
                        <h4 className="text-white font-medium text-sm mt-2">{res.title}</h4>
                        <p className="text-[10px] text-[#888880] mt-1 font-light">{res.dept} · {res.level} · {res.semester} · {res.size}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(res)} className="p-2 border border-[rgba(255,255,255,0.07)] hover:border-white/20 text-[#888880] hover:text-white rounded transition-colors text-xs" title="Edit"><i className="ti ti-edit" /></button>
                        <button onClick={() => handleDelete(res, idx)} className="p-2 border border-red-500/10 hover:border-red-500/30 text-red-500/70 hover:text-red-400 rounded transition-colors text-xs" title="Delete"><i className="ti ti-trash" /></button>
                      </div>
                    </div>
                  ))
                )
              )}

              {/* Subscribers List */}
              {activeSection === "subscribers" && (
                subscribers.length === 0 ? (
                  <div className="text-center py-12 bg-[#1A1A17]/20 rounded-lg border border-[rgba(255,255,255,0.05)]">
                    <i className="ti ti-mail text-3xl text-[#555550] mb-2 block" />
                    <p className="text-[#888880] text-xs italic font-light">No subscribers found in database.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[rgba(255,255,255,0.05)]">
                    {subscribers.map((sub, idx) => (
                      <div key={sub.id || idx} className="flex justify-between items-center py-3 px-4 hover:bg-white/[0.02] rounded transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-[#2D7A22]/10 text-[#2D7A22] flex items-center justify-center text-xs">
                            <i className="ti ti-user" />
                          </div>
                          <div>
                            <span className="text-white text-xs font-medium">{sub.email}</span>
                            {sub.createdAt && (
                              <p className="text-[10px] text-[#888880] font-light">Subscribed on {new Date(sub.createdAt).toLocaleDateString()}</p>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] text-[#2D7A22] bg-[#2D7A22]/10 border border-[#2D7A22]/20 px-2 py-0.5 rounded">Active</span>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
