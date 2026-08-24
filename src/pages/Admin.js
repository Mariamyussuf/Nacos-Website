import React, { useState, useEffect } from "react";
import { useToast } from "../components/Toast";
import { INITIAL_BLOG_POSTS } from "../data/blogData";
import BlogReaderModal from "../components/BlogReaderModal";
import AdminLogin from "../components/admin/AdminLogin";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminBannerSection from "../components/admin/AdminBannerSection";
import AdminBlogsSection from "../components/admin/AdminBlogsSection";
import AdminEventsSection from "../components/admin/AdminEventsSection";
import AdminResourcesSection from "../components/admin/AdminResourcesSection";
import AdminSubscribersSection from "../components/admin/AdminSubscribersSection";
import AdminMessagesSection from "../components/admin/AdminMessagesSection";
import NewsletterStudioModal from "../components/admin/NewsletterStudioModal";
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
  getBanner,
  updateBanner,
  broadcastNewsletter,
  sendTestNewsletter,
  getNewsletterCampaigns,
  getContactMessages,
  markContactMessageRead,
  deleteContactMessage,
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
    gallery: ["https://images.unsplash.com/photo-1591115765373-5aad4e2380ad?auto=format&fit=crop&w=600&q=80"],
    commentary: "This webinar kicked off our session with a strong turnout of over 150 students eager to learn about Artificial Intelligence.",
  },
  {
    title: "100L Student Orientation",
    date: "October 15, 2025",
    venue: "Edozien Lecture Hall",
    description: "Welcoming our newly admitted 100 level and direct entry computing students, detailing requirements, department codes, and academic pathways.",
    category: "General",
    status: "past",
    flier: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80",
    gallery: ["https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80"],
    commentary: "Held at Edozien Lecture Hall, the orientation welcomed incoming freshmen.",
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

const DEFAULT_NEWSLETTER_TEMPLATES = {
  event: {
    template: "event",
    subject: "🚀 Register Now: NACOS Tech Fest '26 is Coming to Bells!",
    preheader: "5 days of hackathons, keynote sessions, and tech exhibitions at Bells University.",
    eyebrow: "TECH FEST 2026",
    headline: "Build, Innovate & Compete at NACOS Tech Fest 2026",
    bannerImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    bodyContent: "We are thrilled to announce that registration for NACOS Tech Fest '26 is officially open!\n\nJoin over 200+ computing students, industry leaders, and tech enthusiasts across 5 action-packed days of coding challenges, design sprints, and hardware demos. Whether you are in 100 level or final year, there is a track built just for you.\n\nSecure your spot today and get ready to represent your department.",
    highlights: [
      "📅 Date: July 12–16, 2026",
      "📍 Venue: Main Auditorium & CIS Labs",
      "🏆 Prizes: Over ₦500,000 in hackathon grants & mentorship",
      "🎯 Tracks: Software Engineering, AI/Data, UI/UX, Cyber Security"
    ],
    ctaText: "Register for Tech Fest →",
    ctaUrl: "https://nacos-bells.vercel.app/events"
  },
  blog: {
    template: "blog",
    subject: "📖 New Story: 5 Tech Skills Every Computing Student Must Master",
    preheader: "Fresh insights and career advice from the NACOS Editorial Board.",
    eyebrow: "EDITORIAL DIGEST",
    headline: "5 In-Demand Tech Skills to Boost Your Career in 2026",
    bannerImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    bodyContent: "The tech landscape is evolving at lightning speed. To help Bells computing students stay ahead of the curve, we've broken down the top five high-growth skills employers are looking for right now.\n\nFrom cloud architecture to practical AI workflow integration, check out this comprehensive breakdown written exclusively for our student community.",
    highlights: [
      "💡 Cloud Infrastructure & Containerization (Docker, AWS)",
      "🔒 Secure Coding & API Architecture",
      "⚡ AI Tooling & Data Engineering Foundations",
      "🤝 Open Source Contribution Pathways"
    ],
    ctaText: "Read Full Article →",
    ctaUrl: "https://nacos-bells.vercel.app/blog"
  },
  general: {
    template: "general",
    subject: "📢 Important Update: NACOS Chapter Academic Resources & Timetable",
    preheader: "Official communique from the NACOS Executive Council.",
    eyebrow: "EXECUTIVE COMMUNIQUE",
    headline: "Mid-Semester Updates & Course Vault Expansion",
    bannerImage: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80",
    bodyContent: "Dear Computing Students,\n\nThe NACOS Executive Council wishes to share important updates regarding academic support and semester activities.\n\nOur Course Vault has just been refreshed with past examination questions and curated study materials for 100L through 400L students across Computer Science, IT, and Cyber Security departments.\n\nPlease review the study repository and feel free to reach out to your departmental representatives for assistance.",
    highlights: [
      "📚 Updated 100L–400L Past Exam Collections available in Vault",
      "💻 Weekly Peer Tutoring sessions running at CIS Lab 2",
      "🤝 Executive Office Hours: Mondays & Wednesdays (2 PM – 4 PM)"
    ],
    ctaText: "Access Course Vault →",
    ctaUrl: "https://nacos-bells.vercel.app/resources"
  },
  custom: {
    template: "custom",
    subject: "",
    preheader: "",
    eyebrow: "ANNOUNCEMENT",
    headline: "",
    bannerImage: "",
    bodyContent: "",
    highlights: [],
    ctaText: "Learn More →",
    ctaUrl: "https://nacos-bells.vercel.app"
  }
};

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
  const [activeSection, setActiveSection] = useState("blogs"); // "blogs" | "events" | "resources" | "banner" | "subscribers" | "messages"
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lists
  const [blogs, setBlogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [messages, setMessages] = useState([]);
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

  // Banner Settings State
  const [bannerForm, setBannerForm] = useState({
    enabled: true,
    badge: "NACOS Tech Fest '26",
    text: "— July 12–16, Main Auditorium.",
    linkText: "Register Now →",
    linkUrl: "/events",
    accentColor: "green",
  });
  const [bannerSaving, setBannerSaving] = useState(false);

  // Newsletter Promotional Studio State
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState("event");
  const [newsletterForm, setNewsletterForm] = useState({ ...DEFAULT_NEWSLETTER_TEMPLATES.event });
  const [newHighlightInput, setNewHighlightInput] = useState("");
  const [testEmailAddress, setTestEmailAddress] = useState("");
  const [testSubmitting, setTestSubmitting] = useState(false);
  const [broadcastSubmitting, setBroadcastSubmitting] = useState(false);

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

  // Fetch all data
  const loadAllData = async () => {
    try {
      const [fetchedBlogs, fetchedEvents, fetchedResources, fetchedBanner] = await Promise.all([
        getBlogs().catch(() => null),
        getEvents().catch(() => null),
        getResources().catch(() => null),
        getBanner().catch(() => null),
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

      if (fetchedBanner) {
        setBannerForm(fetchedBanner);
      }

      // Load subscribers, campaigns, and contact messages if authenticated
      try {
        const [fetchedSubscribers, fetchedCampaigns, fetchedMessages] = await Promise.all([
          getSubscribers().catch(() => []),
          getNewsletterCampaigns().catch(() => []),
          getContactMessages().catch(() => []),
        ]);
        if (Array.isArray(fetchedSubscribers)) setSubscribers(fetchedSubscribers);
        if (Array.isArray(fetchedCampaigns)) setCampaigns(fetchedCampaigns);
        if (Array.isArray(fetchedMessages)) setMessages(fetchedMessages);
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

  // File selection handlers
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

  const handleNewsletterBannerChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const uploadRes = await uploadImage(file);
      if (uploadRes && uploadRes.url) {
        setNewsletterForm((prev) => ({ ...prev, bannerImage: uploadRes.url }));
        showToast("Promotional banner uploaded successfully!", "success");
      }
    } catch (err) {
      const objectUrl = URL.createObjectURL(file);
      setNewsletterForm((prev) => ({ ...prev, bannerImage: objectUrl }));
      showToast("Banner preview selected.", "info");
    }
  };

  // Save Blog
  const handleSaveBlog = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalImageUrl = blogForm.image;
      if (blogFile) {
        try {
          const uploadRes = await uploadImage(blogFile);
          if (uploadRes && uploadRes.url) finalImageUrl = uploadRes.url;
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

  // Save Event
  const handleSaveEvent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalFlierUrl = eventForm.flier || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80";
      if (eventFile) {
        try {
          const uploadRes = await uploadImage(eventFile);
          if (uploadRes && uploadRes.url) finalFlierUrl = uploadRes.url;
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

  // Save Resource
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

      if (resourceFile) formData.append("file", resourceFile);

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

  // Save Banner Settings
  const handleSaveBanner = async (e) => {
    e.preventDefault();
    setBannerSaving(true);
    try {
      const res = await updateBanner(bannerForm);
      setBannerForm(res);
      showToast("Site banner settings updated & published!", "success");
    } catch (err) {
      showToast(`Error: ${err.message || "Failed to update banner"}`, "error");
    } finally {
      setBannerSaving(false);
    }
  };

  // Delete Handlers
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

  // Edit Triggers
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

  // Newsletter Broadcast & Template Helpers
  const handleSelectTemplate = (templateKey) => {
    setSelectedTemplateKey(templateKey);
    const selected = DEFAULT_NEWSLETTER_TEMPLATES[templateKey];
    if (selected) {
      setNewsletterForm({ ...selected });
    }
    showToast(`Loaded ${templateKey.toUpperCase()} promotional template`, "info");
  };

  const handleAddHighlight = () => {
    if (!newHighlightInput.trim()) return;
    setNewsletterForm((prev) => ({
      ...prev,
      highlights: [...(prev.highlights || []), newHighlightInput.trim()],
    }));
    setNewHighlightInput("");
  };

  const handleRemoveHighlight = (idx) => {
    setNewsletterForm((prev) => ({
      ...prev,
      highlights: (prev.highlights || []).filter((_, i) => i !== idx),
    }));
  };

  const handleSendTestEmail = async (e) => {
    e.preventDefault();
    if (!testEmailAddress.trim()) {
      showToast("Please enter an email address for testing", "error");
      return;
    }
    setTestSubmitting(true);
    try {
      await sendTestNewsletter({
        ...newsletterForm,
        testEmail: testEmailAddress.trim(),
      });
      showToast(`Test promotional email dispatched to ${testEmailAddress}!`, "success");
    } catch (err) {
      showToast(`Test failed: ${err.message}`, "error");
    } finally {
      setTestSubmitting(false);
    }
  };

  const handleBroadcastNewsletter = async (e) => {
    e.preventDefault();
    if (subscribers.length === 0) {
      if (!window.confirm("There are currently 0 registered subscribers in the database. Proceed to save campaign draft?")) {
        return;
      }
    } else {
      if (!window.confirm(`Are you sure you want to broadcast this promotional email to ALL ${subscribers.length} subscriber(s)?`)) {
        return;
      }
    }

    setBroadcastSubmitting(true);
    try {
      const res = await broadcastNewsletter(newsletterForm);
      showToast(res.message || "Promotional newsletter broadcasted successfully!", "success");
      setShowBroadcastModal(false);
      loadAllData();
    } catch (err) {
      showToast(`Broadcast failed: ${err.message}`, "error");
    } finally {
      setBroadcastSubmitting(false);
    }
  };

  const handleCopyAllEmails = () => {
    if (subscribers.length === 0) {
      showToast("No subscriber emails to copy", "info");
      return;
    }
    const emailList = subscribers.map((s) => s.email).join(", ");
    navigator.clipboard.writeText(emailList);
    showToast(`Copied ${subscribers.length} email(s) to clipboard (BCC ready)!`, "success");
  };

  const handleExportCSV = () => {
    if (subscribers.length === 0) {
      showToast("No subscriber data to export", "info");
      return;
    }
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Email,Subscribed Date\n" +
      subscribers.map((s, idx) => `${s.id || idx + 1},"${s.email}","${s.createdAt || ""}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nacos_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Subscribers exported as CSV file!", "success");
  };

  // Contact Inquiries Handlers
  const handleMarkRead = async (id, status = "read") => {
    try {
      await markContactMessageRead(id, status);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status } : m))
      );
      showToast(`Marked inquiry as ${status}`, "info");
    } catch (err) {
      showToast(`Failed to update message: ${err.message}`, "error");
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry message?")) return;
    try {
      await deleteContactMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      showToast("Inquiry message deleted", "success");
    } catch (err) {
      showToast(`Delete failed: ${err.message}`, "error");
    }
  };

  const unreadCount = messages.filter((m) => m.status === "unread").length;

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

  // Admin Login Screen
  if (!isAdminAuthenticated) {
    return (
      <AdminLogin
        loginCreds={loginCreds}
        setLoginCreds={setLoginCreds}
        handleLogin={handleLogin}
        loginError={loginError}
        loginSubmitting={loginSubmitting}
      />
    );
  }

  return (
    <div className="pt-16 bg-[#0A0A08] min-h-screen text-[#F0EDE6] selection:bg-[#2D7A22] selection:text-[#F0EDE6]">
      {/* Blog Article Live Preview Modal */}
      <BlogReaderModal
        post={previewPost}
        isOpen={Boolean(previewPost)}
        onClose={() => setPreviewPost(null)}
      />

      {/* Promotional Newsletter Broadcast Studio Modal */}
      <NewsletterStudioModal
        isOpen={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
        newsletterForm={newsletterForm}
        setNewsletterForm={setNewsletterForm}
        selectedTemplateKey={selectedTemplateKey}
        handleSelectTemplate={handleSelectTemplate}
        handleNewsletterBannerChange={handleNewsletterBannerChange}
        handleAddHighlight={handleAddHighlight}
        handleRemoveHighlight={handleRemoveHighlight}
        newHighlightInput={newHighlightInput}
        setNewHighlightInput={setNewHighlightInput}
        handleSendTestEmail={handleSendTestEmail}
        handleBroadcastNewsletter={handleBroadcastNewsletter}
        testEmailAddress={testEmailAddress}
        setTestEmailAddress={setTestEmailAddress}
        testSubmitting={testSubmitting}
        broadcastSubmitting={broadcastSubmitting}
        subscriberCount={subscribers.length}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
          {/* Sidebar */}
          <AdminSidebar
            adminUser={adminUser}
            handleLogout={handleLogout}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            resetForms={resetForms}
            unreadMessagesCount={unreadCount}
          />

          {/* Workspace Area */}
          <main className="flex-1 bg-[#111110] border border-[rgba(255,255,255,0.07)] rounded-xl p-5 sm:p-8">
            {/* Header Panel */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-[rgba(255,255,255,0.07)]">
              <div>
                <h1 className="font-display font-medium text-2xl text-white">
                  {activeSection === "blogs" && "Blog Stories"}
                  {activeSection === "events" && "Event Records"}
                  {activeSection === "resources" && "Vault Resources"}
                  {activeSection === "banner" && "Site Announcement Banner"}
                  {activeSection === "subscribers" && "Newsletter & Broadcast Studio"}
                  {activeSection === "messages" && "Contact Inquiries & Inbox"}
                </h1>
                <p className="text-xs text-[#888880] mt-1 font-light">
                  {activeSection === "blogs" && `Showing ${blogs.length} stories synced with the NestJS backend.`}
                  {activeSection === "events" && `Showing ${events.length} events logged in the database.`}
                  {activeSection === "resources" && `Showing ${resources.length} past questions stored in the archive.`}
                  {activeSection === "banner" && "Customize, theme, and toggle the announcement banner shown on top of the website."}
                  {activeSection === "subscribers" && `Manage ${subscribers.length} student subscribers and broadcast promotional emails.`}
                  {activeSection === "messages" && `Review ${messages.length} student inquiries (${unreadCount} unread).`}
                </p>
              </div>

              {!showForm && !["subscribers", "banner", "messages"].includes(activeSection) && (
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

              {activeSection === "subscribers" && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowBroadcastModal(true)}
                    className="px-4 py-2 bg-[#2D7A22] hover:bg-[#3A9C2D] text-[#F0EDE6] text-xs uppercase tracking-wider font-medium rounded-md transition-colors flex items-center gap-1.5"
                  >
                    <i className="ti ti-sparkles text-sm" />
                    Broadcast Email
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="px-3.5 py-2 bg-[#1A1A17] hover:bg-white/[0.04] text-[#888880] hover:text-white border border-[rgba(255,255,255,0.07)] text-xs uppercase tracking-wider font-medium rounded-md transition-colors flex items-center gap-1.5"
                  >
                    <i className="ti ti-download text-sm" />
                    CSV
                  </button>
                  <button
                    onClick={handleCopyAllEmails}
                    className="px-3.5 py-2 bg-[#1A1A17] hover:bg-white/[0.04] text-[#888880] hover:text-white border border-[rgba(255,255,255,0.07)] text-xs uppercase tracking-wider font-medium rounded-md transition-colors flex items-center gap-1.5"
                  >
                    <i className="ti ti-copy text-sm" />
                    Copy Emails
                  </button>
                </div>
              )}
            </div>

            {/* Section Views */}
            {activeSection === "banner" && (
              <AdminBannerSection
                bannerForm={bannerForm}
                setBannerForm={setBannerForm}
                handleSaveBanner={handleSaveBanner}
                bannerSaving={bannerSaving}
              />
            )}

            {activeSection === "blogs" && (
              <AdminBlogsSection
                blogs={blogs}
                blogForm={blogForm}
                setBlogForm={setBlogForm}
                showForm={showForm}
                editingItem={editingItem}
                isSubmitting={isSubmitting}
                handleSaveBlog={handleSaveBlog}
                handleBlogImageChange={handleBlogImageChange}
                startEdit={startEdit}
                handleDelete={handleDelete}
                setPreviewPost={setPreviewPost}
                resetForms={resetForms}
              />
            )}

            {activeSection === "events" && (
              <AdminEventsSection
                events={events}
                eventForm={eventForm}
                setEventForm={setEventForm}
                showForm={showForm}
                editingItem={editingItem}
                isSubmitting={isSubmitting}
                handleSaveEvent={handleSaveEvent}
                handleEventFlierChange={handleEventFlierChange}
                startEdit={startEdit}
                handleDelete={handleDelete}
                resetForms={resetForms}
              />
            )}

            {activeSection === "resources" && (
              <AdminResourcesSection
                resources={resources}
                resourceForm={resourceForm}
                setResourceForm={setResourceForm}
                resourceFile={resourceFile}
                setResourceFile={setResourceFile}
                showForm={showForm}
                editingItem={editingItem}
                isSubmitting={isSubmitting}
                handleSaveResource={handleSaveResource}
                handleResourceFileChange={handleResourceFileChange}
                startEdit={startEdit}
                handleDelete={handleDelete}
                resetForms={resetForms}
              />
            )}

            {activeSection === "subscribers" && (
              <AdminSubscribersSection
                subscribers={subscribers}
                campaigns={campaigns}
              />
            )}

            {activeSection === "messages" && (
              <AdminMessagesSection
                messages={messages}
                handleMarkRead={handleMarkRead}
                handleDeleteMessage={handleDeleteMessage}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

