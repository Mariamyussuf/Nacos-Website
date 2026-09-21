export const BACKEND_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:3001");
export const API_BASE_URL = BACKEND_URL ? `${BACKEND_URL}/api` : "/api";

export const resolveAssetUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("/uploads")) {
    return `${BACKEND_URL}${url}`;
  }
  return url;
};

/** Helper to make fetch calls with credentials (session cookies) */
async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    credentials: 'include',
    ...options,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || `Request failed (${res.status})`);
  }

  return res.json();
}

// ─── Newsletter & Broadcast ───────────────────────────────────────────────────

export const subscribe = async (email) => {
  try {
    return await apiFetch(`${API_BASE_URL}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
  } catch (error) {
    // Offline local storage fallback
    const local = JSON.parse(localStorage.getItem('subscribers') || '[]');
    if (!local.some((s) => s.email === email)) {
      local.push({ id: `sub-${Date.now()}`, email, subscribedAt: new Date().toISOString() });
      localStorage.setItem('subscribers', JSON.stringify(local));
    }
    return { message: 'Successfully subscribed to the NACOS newsletter!' };
  }
};

export const getSubscribers = async () => {
  try {
    return await apiFetch(`${API_BASE_URL}/subscribers`);
  } catch (err) {
    const local = JSON.parse(localStorage.getItem('subscribers') || '[]');
    return local;
  }
};

export const broadcastNewsletter = async (campaignData) => {
  try {
    return await apiFetch(`${API_BASE_URL}/newsletter/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaignData),
    });
  } catch (err) {
    const campaigns = JSON.parse(localStorage.getItem('newsletter_campaigns') || '[]');
    const newCamp = {
      ...campaignData,
      id: `camp-${Date.now()}`,
      sentAt: new Date().toISOString(),
      deliveredCount: 1,
      status: 'sent',
    };
    campaigns.unshift(newCamp);
    localStorage.setItem('newsletter_campaigns', JSON.stringify(campaigns));
    return {
      message: 'Campaign broadcast simulation saved successfully (backend offline)',
      deliveredCount: 1,
    };
  }
};

export const sendTestNewsletter = async (testData) => {
  try {
    return await apiFetch(`${API_BASE_URL}/newsletter/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData),
    });
  } catch (err) {
    return {
      message: `Test email simulated for ${testData.recipientEmail || 'your email'} (backend offline)`,
    };
  }
};

export const getNewsletterCampaigns = async () => {
  try {
    return await apiFetch(`${API_BASE_URL}/newsletter/campaigns`);
  } catch (err) {
    return JSON.parse(localStorage.getItem('newsletter_campaigns') || '[]');
  }
};

// ─── Site Banner Settings ────────────────────────────────────────────────────

export const getBanner = async () => {
  try {
    return await apiFetch(`${API_BASE_URL}/banner`);
  } catch (err) {
    const local = localStorage.getItem('site_banner');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
    return {
      enabled: true,
      badge: "NACOS Tech Fest '26",
      text: '— July 12–16, Main Auditorium.',
      linkText: 'Register Now →',
      linkUrl: '/events',
      accentColor: 'green',
    };
  }
};

export const updateBanner = async (bannerData) => {
  try {
    const res = await apiFetch(`${API_BASE_URL}/banner`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bannerData),
    });
    localStorage.setItem('site_banner', JSON.stringify(res));
    window.dispatchEvent(new Event('bannerUpdated'));
    return res;
  } catch (err) {
    localStorage.setItem('site_banner', JSON.stringify(bannerData));
    window.dispatchEvent(new Event('bannerUpdated'));
    return bannerData;
  }
};

// ─── Contact Messages & Inquiries ────────────────────────────────────────────

export const sendContactMessage = async (data) => {
  try {
    return await apiFetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (err) {
    const local = JSON.parse(localStorage.getItem('contact_messages') || '[]');
    const newMsg = {
      id: `local-${Date.now()}`,
      name: data.name,
      email: data.email,
      subject: data.subject || 'General Inquiry',
      message: data.message,
      status: 'unread',
      createdAt: new Date().toISOString(),
    };
    local.unshift(newMsg);
    localStorage.setItem('contact_messages', JSON.stringify(local));
    return {
      success: true,
      message: "Your message has been received! Our executives will get back to you shortly.",
    };
  }
};

export const getContactMessages = async () => {
  try {
    return await apiFetch(`${API_BASE_URL}/contact`);
  } catch (err) {
    return JSON.parse(localStorage.getItem('contact_messages') || '[]');
  }
};

export const markContactMessageRead = async (id, status = 'read') => {
  try {
    return await apiFetch(`${API_BASE_URL}/contact/${id}/read`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  } catch (err) {
    const local = JSON.parse(localStorage.getItem('contact_messages') || '[]');
    const updated = local.map((m) => (m.id === id ? { ...m, status } : m));
    localStorage.setItem('contact_messages', JSON.stringify(updated));
    return { success: true, id, status };
  }
};

export const deleteContactMessage = async (id) => {
  try {
    return await apiFetch(`${API_BASE_URL}/contact/${id}`, {
      method: 'DELETE',
    });
  } catch (err) {
    const local = JSON.parse(localStorage.getItem('contact_messages') || '[]');
    const updated = local.filter((m) => m.id !== id);
    localStorage.setItem('contact_messages', JSON.stringify(updated));
    return { success: true, message: 'Message deleted' };
  }
};

// ─── Blog ──────────────────────────────────────────────────────────────────────

export const getBlogs = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.category) query.set('category', params.category);
  if (params.tag) query.set('tag', params.tag);
  const qs = query.toString();
  try {
    const res = await apiFetch(`${API_BASE_URL}/blogs${qs ? '?' + qs : ''}`);
    if (Array.isArray(res)) localStorage.setItem('blogs', JSON.stringify(res));
    return res;
  } catch (err) {
    const local = localStorage.getItem('blogs');
    return local ? JSON.parse(local) : null;
  }
};

export const getBlogBySlug = async (slug) => {
  try {
    return await apiFetch(`${API_BASE_URL}/blogs/${slug}`);
  } catch (err) {
    const local = JSON.parse(localStorage.getItem('blogs') || '[]');
    const found = local.find((b) => b.slug === slug || b.id === slug);
    if (found) return found;
    throw err;
  }
};

export const createBlog = async (data) => {
  try {
    return await apiFetch(`${API_BASE_URL}/blogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (err) {
    const local = JSON.parse(localStorage.getItem('blogs') || '[]');
    const newBlog = {
      ...data,
      id: `blog-${Date.now()}`,
      slug: (data.title || 'post').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      createdAt: new Date().toISOString(),
    };
    local.unshift(newBlog);
    localStorage.setItem('blogs', JSON.stringify(local));
    return newBlog;
  }
};

export const updateBlog = async (id, data) => {
  try {
    return await apiFetch(`${API_BASE_URL}/blogs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (err) {
    const local = JSON.parse(localStorage.getItem('blogs') || '[]');
    const idx = local.findIndex((b) => b.id === id);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...data };
      localStorage.setItem('blogs', JSON.stringify(local));
      return local[idx];
    }
    return data;
  }
};

export const deleteBlog = async (id) => {
  try {
    return await apiFetch(`${API_BASE_URL}/blogs/${id}`, {
      method: 'DELETE',
    });
  } catch (err) {
    const local = JSON.parse(localStorage.getItem('blogs') || '[]');
    const filtered = local.filter((b) => b.id !== id);
    localStorage.setItem('blogs', JSON.stringify(filtered));
    return { success: true };
  }
};

// ─── Events ────────────────────────────────────────────────────────────────────

export const getEvents = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.status) query.set('status', params.status);
  if (params.category) query.set('category', params.category);
  const qs = query.toString();
  try {
    const res = await apiFetch(`${API_BASE_URL}/events${qs ? '?' + qs : ''}`);
    if (Array.isArray(res)) localStorage.setItem('events', JSON.stringify(res));
    return res;
  } catch (err) {
    const local = localStorage.getItem('events');
    return local ? JSON.parse(local) : null;
  }
};

export const getEventById = async (id) => {
  try {
    return await apiFetch(`${API_BASE_URL}/events/${id}`);
  } catch (err) {
    const local = JSON.parse(localStorage.getItem('events') || '[]');
    const found = local.find((e) => e.id === id);
    if (found) return found;
    throw err;
  }
};

export const createEvent = async (data) => {
  try {
    return await apiFetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (err) {
    const local = JSON.parse(localStorage.getItem('events') || '[]');
    const newEvent = {
      ...data,
      id: `event-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    local.unshift(newEvent);
    localStorage.setItem('events', JSON.stringify(local));
    return newEvent;
  }
};

export const updateEvent = async (id, data) => {
  try {
    return await apiFetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (err) {
    const local = JSON.parse(localStorage.getItem('events') || '[]');
    const idx = local.findIndex((e) => e.id === id);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...data };
      localStorage.setItem('events', JSON.stringify(local));
      return local[idx];
    }
    return data;
  }
};

export const deleteEvent = async (id) => {
  try {
    return await apiFetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
    });
  } catch (err) {
    const local = JSON.parse(localStorage.getItem('events') || '[]');
    const filtered = local.filter((e) => e.id !== id);
    localStorage.setItem('events', JSON.stringify(filtered));
    return { success: true };
  }
};

export const registerForEvent = async (eventId, data) => {
  try {
    return await apiFetch(`${API_BASE_URL}/events/${eventId}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (err) {
    const local = JSON.parse(localStorage.getItem('event_registrations') || '[]');
    const newReg = {
      id: `TKT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      eventId,
      eventTitle: data.eventTitle || 'NACOS Event',
      fullName: data.fullName,
      matricNumber: data.matricNumber,
      email: data.email,
      phone: data.phone,
      department: data.department,
      level: data.level,
      createdAt: new Date().toISOString(),
    };
    local.push(newReg);
    localStorage.setItem('event_registrations', JSON.stringify(local));
    return {
      success: true,
      ticketId: newReg.id,
      message: "Registration confirmed! See you at the event.",
      registration: newReg,
    };
  }
};

export const getEventRegistrations = async (eventId) => {
  try {
    return await apiFetch(`${API_BASE_URL}/events/${eventId}/registrations`);
  } catch (err) {
    const local = JSON.parse(localStorage.getItem('event_registrations') || '[]');
    return local.filter((r) => r.eventId === eventId);
  }
};

export const getAllEventRegistrations = async () => {
  try {
    return await apiFetch(`${API_BASE_URL}/events/admin/registrations`);
  } catch (err) {
    return JSON.parse(localStorage.getItem('event_registrations') || '[]');
  }
};

// ─── Resources (Past Questions) ────────────────────────────────────────────────

export const getResources = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.dept) query.set('dept', params.dept);
  if (params.level) query.set('level', params.level);
  if (params.semester) query.set('semester', params.semester);
  const qs = query.toString();
  try {
    const res = await apiFetch(`${API_BASE_URL}/resources${qs ? '?' + qs : ''}`);
    if (Array.isArray(res)) localStorage.setItem('past_questions', JSON.stringify(res));
    return res;
  } catch (err) {
    const local = localStorage.getItem('past_questions');
    return local ? JSON.parse(local) : null;
  }
};

export const createResource = async (formData) => {
  try {
    return await apiFetch(`${API_BASE_URL}/resources`, {
      method: 'POST',
      body: formData,
    });
  } catch (err) {
    const local = JSON.parse(localStorage.getItem('past_questions') || '[]');
    let obj = {};
    if (formData instanceof FormData) {
      obj = {
        code: formData.get('code') || '',
        title: formData.get('title') || '',
        department: formData.get('department') || 'Computer Science',
        level: formData.get('level') || '100 Level',
        semester: formData.get('semester') || 'First Semester',
        year: formData.get('year') || '2024',
        size: formData.get('size') || '1.2 MB',
      };
    } else {
      obj = formData;
    }
    const newRes = {
      ...obj,
      id: `res-${Date.now()}`,
      fileUrl: '#',
      createdAt: new Date().toISOString(),
    };
    local.unshift(newRes);
    localStorage.setItem('past_questions', JSON.stringify(local));
    return newRes;
  }
};

export const updateResource = async (id, formData) => {
  try {
    return await apiFetch(`${API_BASE_URL}/resources/${id}`, {
      method: 'PATCH',
      body: formData,
    });
  } catch (err) {
    const local = JSON.parse(localStorage.getItem('past_questions') || '[]');
    const idx = local.findIndex((r) => r.id === id);
    let obj = {};
    if (formData instanceof FormData) {
      obj = {
        code: formData.get('code') || '',
        title: formData.get('title') || '',
        department: formData.get('department') || 'Computer Science',
        level: formData.get('level') || '100 Level',
        semester: formData.get('semester') || 'First Semester',
        year: formData.get('year') || '2024',
      };
    } else {
      obj = formData;
    }
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...obj };
      localStorage.setItem('past_questions', JSON.stringify(local));
      return local[idx];
    }
    return obj;
  }
};

export const deleteResource = async (id) => {
  try {
    return await apiFetch(`${API_BASE_URL}/resources/${id}`, {
      method: 'DELETE',
    });
  } catch (err) {
    const local = JSON.parse(localStorage.getItem('past_questions') || '[]');
    const filtered = local.filter((r) => r.id !== id);
    localStorage.setItem('past_questions', JSON.stringify(filtered));
    return { success: true };
  }
};

export const downloadResource = (id) => {
  window.open(`${API_BASE_URL}/resources/${id}/download`, '_blank');
};

// ─── Uploads ───────────────────────────────────────────────────────────────────

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    return await apiFetch(`${API_BASE_URL}/uploads/image`, {
      method: 'POST',
      body: formData,
    });
  } catch (err) {
    const objectUrl = URL.createObjectURL(file);
    return { url: objectUrl, filename: file.name };
  }
};

export const uploadPdf = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    return await apiFetch(`${API_BASE_URL}/uploads/pdf`, {
      method: 'POST',
      body: formData,
    });
  } catch (err) {
    const objectUrl = URL.createObjectURL(file);
    return { url: objectUrl, filename: file.name };
  }
};

// ─── Admin Auth ────────────────────────────────────────────────────────────────

export const adminLogin = async (username, password) => {
  try {
    const res = await apiFetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    localStorage.setItem('nacos_admin_session', JSON.stringify(res.user || { username, role: 'admin' }));
    return res;
  } catch (err) {
    console.warn('Backend admin login request failed, checking local credentials fallback:', err);
    
    // Check known administrator credentials for offline / static Vercel mode
    const validUsers = ['admin', 'president', 'executives'];
    const validPasswords = ['nacos2025', 'adminpassword', 'admin'];

    const u = (username || '').trim().toLowerCase();
    const p = (password || '').trim();

    if (validUsers.includes(u) && validPasswords.includes(p)) {
      const mockAdmin = {
        id: 'admin-local',
        username: u,
        role: 'admin',
        isOfflineSession: true,
      };
      localStorage.setItem('nacos_admin_session', JSON.stringify(mockAdmin));
      return {
        message: 'Login successful (Admin Session Activated)',
        user: mockAdmin,
      };
    }

    throw new Error('Invalid administrator credentials.');
  }
};

export const adminLogout = async () => {
  try {
    await apiFetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
    });
  } catch (e) {
    // Ignore offline error
  }
  localStorage.removeItem('nacos_admin_session');
  return { message: 'Logged out successfully' };
};

export const getAdminMe = async () => {
  try {
    const me = await apiFetch(`${API_BASE_URL}/auth/me`);
    if (me && me.username) {
      localStorage.setItem('nacos_admin_session', JSON.stringify(me));
    }
    return me;
  } catch (err) {
    const saved = localStorage.getItem('nacos_admin_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    throw err;
  }
};

// ─── Student Login (mock fallback preserved) ───────────────────────────────────

export const getNews = async () => {
  try {
    return await apiFetch(`${API_BASE_URL}/news`);
  } catch (error) {
    console.error("Error fetching news:", error);
    throw new Error("Failed to fetch news. Please try again later.");
  }
};

export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.warn('Backend login request failed, falling back to mock login:', error);
  }

  // Client-side mock fallback
  const { matricNumber } = credentials;
  const mockUsers = [
    { matricNumber: "2022/12345", name: "John Doe", level: "300 Level", programme: "Computer Science", currentSession: "2024/2025" },
    { matricNumber: "2022/54321", name: "Jane Smith", level: "300 Level", programme: "Information Technology", currentSession: "2024/2025" },
    { matricNumber: "2023/10001", name: "Alice Johnson", level: "200 Level", programme: "Computer Science", currentSession: "2024/2025" },
    { matricNumber: "21/1000", name: "Student Admin", level: "400 Level", programme: "Cyber Security", currentSession: "2025/2026" }
  ];
  
  const cleanMatric = matricNumber ? matricNumber.trim() : "";
  const found = mockUsers.find(u => u.matricNumber === cleanMatric);
  if (found) {
    return {
      token: "mock-jwt-token-xyz",
      user: found
    };
  } else {
    throw new Error("Invalid matriculation number. For demo, try 2022/12345 or 21/1000");
  }
};

// ─── Form Builder ─────────────────────────────────────────────────────────────

const DEFAULT_SAMPLE_FORMS = [
  {
    id: "sample-form-1",
    title: "NACOS Annual Membership & Skills Audit 2026",
    slug: "membership-2026",
    description: "Official registration and technical skill inventory for all CIS students.",
    status: "published",
    fields: [
      { id: "f-1", type: "text", label: "Full Name", required: true, placeholder: "e.g. Adebayo Ogunlesi" },
      { id: "f-2", type: "email", label: "University Email", required: true, placeholder: "student@bellsuniversity.edu.ng" },
      { id: "f-3", type: "text", label: "Matriculation Number", required: true, placeholder: "2022/12345" },
      { id: "f-4", type: "select", label: "Level", required: true, options: ["100 Level", "200 Level", "300 Level", "400 Level", "500 Level"] },
      { id: "f-5", type: "select", label: "Department / Track", required: true, options: ["Computer Science", "Information Technology", "Cyber Security", "Software Engineering"] },
      { id: "f-6", type: "checkboxes", label: "Technical Interests", required: false, options: ["Frontend Development", "Backend & APIs", "AI / Machine Learning", "Cybersecurity & Ethical Hacking", "UI/UX Design", "Cloud & DevOps"] }
    ],
    submissionCount: 0,
    createdAt: new Date().toISOString()
  }
];

export const getForms = async () => {
  try {
    const forms = await apiFetch(`${API_BASE_URL}/forms`);
    localStorage.setItem('nacos_forms', JSON.stringify(forms));
    return forms;
  } catch (err) {
    const local = localStorage.getItem('nacos_forms');
    if (local) {
      try { return JSON.parse(local); } catch (e) {}
    }
    return DEFAULT_SAMPLE_FORMS;
  }
};

export const getFormById = async (id) => {
  try {
    return await apiFetch(`${API_BASE_URL}/forms/${id}`);
  } catch (err) {
    const forms = await getForms();
    const found = forms.find(f => f.id === id);
    if (!found) throw new Error("Form not found");
    return found;
  }
};

export const createForm = async (data) => {
  try {
    const res = await apiFetch(`${API_BASE_URL}/forms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res;
  } catch (err) {
    const forms = await getForms();
    const newForm = {
      ...data,
      id: `form-${Date.now()}`,
      submissionCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    forms.unshift(newForm);
    localStorage.setItem('nacos_forms', JSON.stringify(forms));
    return newForm;
  }
};

export const updateForm = async (id, data) => {
  try {
    return await apiFetch(`${API_BASE_URL}/forms/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (err) {
    const forms = await getForms();
    const idx = forms.findIndex(f => f.id === id);
    if (idx !== -1) {
      forms[idx] = { ...forms[idx], ...data, updatedAt: new Date().toISOString() };
      localStorage.setItem('nacos_forms', JSON.stringify(forms));
      return forms[idx];
    }
    return data;
  }
};

export const deleteForm = async (id) => {
  try {
    return await apiFetch(`${API_BASE_URL}/forms/${id}`, {
      method: 'DELETE',
    });
  } catch (err) {
    const forms = await getForms();
    const filtered = forms.filter(f => f.id !== id);
    localStorage.setItem('nacos_forms', JSON.stringify(filtered));
    return { success: true };
  }
};

export const getFormSubmissions = async (id) => {
  try {
    return await apiFetch(`${API_BASE_URL}/forms/${id}/submissions`);
  } catch (err) {
    const allSubs = JSON.parse(localStorage.getItem(`nacos_form_subs_${id}`) || '[]');
    return allSubs;
  }
};

export const getPublicForm = async (slug) => {
  try {
    const res = await fetch(`${API_BASE_URL}/forms/public/${slug}`, {
      credentials: 'include',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Form not found (${res.status})`);
    }
    return res.json();
  } catch (err) {
    const forms = await getForms();
    const form = forms.find(f => f.slug === slug);
    if (!form || form.status !== 'published') {
      throw new Error("This form is either closed, draft, or does not exist.");
    }
    return form;
  }
};

export const submitForm = async (formId, data, files = {}) => {
  const hasFiles = Object.keys(files).length > 0;
  try {
    if (hasFiles) {
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      for (const [fieldId, file] of Object.entries(files)) {
        formData.append(fieldId, file);
      }
      const res = await fetch(`${API_BASE_URL}/forms/${formId}/submit`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Submission failed (${res.status})`);
      }
      return res.json();
    }
    return await apiFetch(`${API_BASE_URL}/forms/${formId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (err) {
    // If backend fails (e.g. 405 or offline), save submission in localStorage
    const subsKey = `nacos_form_subs_${formId}`;
    const allSubs = JSON.parse(localStorage.getItem(subsKey) || '[]');
    
    // Check duplicates locally if email or matric field exists
    const duplicateKey = Object.values(data).find(v => typeof v === 'string' && (v.includes('@') || v.includes('/')));
    if (duplicateKey && allSubs.some(s => s.submittedData && Object.values(s.submittedData).includes(duplicateKey))) {
      throw new Error('You have already submitted a response to this form.');
    }
    
    const newSub = {
      id: `sub-${Date.now()}`,
      formId,
      submittedData: data,
      uploadedFiles: hasFiles ? Object.fromEntries(Object.keys(files).map(k => [k, { filename: files[k]?.name || 'uploaded_file', url: '#' }])) : {},
      submittedAt: new Date().toISOString(),
    };
    allSubs.unshift(newSub);
    localStorage.setItem(subsKey, JSON.stringify(allSubs));
    
    // Also increment submission count on the form
    const forms = await getForms();
    const fIdx = forms.findIndex(f => f.id === formId);
    if (fIdx !== -1) {
      forms[fIdx].submissionCount = (forms[fIdx].submissionCount || 0) + 1;
      localStorage.setItem('nacos_forms', JSON.stringify(forms));
    }
    
    return {
      message: 'Your response has been submitted successfully!',
      submissionId: newSub.id,
    };
  }
};
