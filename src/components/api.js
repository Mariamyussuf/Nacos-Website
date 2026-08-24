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
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Please check your internet connection.');
    }
    throw error;
  }
};

export const getSubscribers = async () => {
  return apiFetch(`${API_BASE_URL}/subscribers`);
};

export const broadcastNewsletter = async (campaignData) => {
  return apiFetch(`${API_BASE_URL}/newsletter/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(campaignData),
  });
};

export const sendTestNewsletter = async (testData) => {
  return apiFetch(`${API_BASE_URL}/newsletter/test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testData),
  });
};

export const getNewsletterCampaigns = async () => {
  return apiFetch(`${API_BASE_URL}/newsletter/campaigns`);
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
    // Offline local storage fallback
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
  return apiFetch(`${API_BASE_URL}/blogs${qs ? '?' + qs : ''}`);
};

export const getBlogBySlug = async (slug) => {
  return apiFetch(`${API_BASE_URL}/blogs/${slug}`);
};

export const createBlog = async (data) => {
  return apiFetch(`${API_BASE_URL}/blogs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

export const updateBlog = async (id, data) => {
  return apiFetch(`${API_BASE_URL}/blogs/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

export const deleteBlog = async (id) => {
  return apiFetch(`${API_BASE_URL}/blogs/${id}`, {
    method: 'DELETE',
  });
};

// ─── Events ────────────────────────────────────────────────────────────────────

export const getEvents = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.status) query.set('status', params.status);
  if (params.category) query.set('category', params.category);
  const qs = query.toString();
  return apiFetch(`${API_BASE_URL}/events${qs ? '?' + qs : ''}`);
};

export const getEventById = async (id) => {
  return apiFetch(`${API_BASE_URL}/events/${id}`);
};

export const createEvent = async (data) => {
  return apiFetch(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

export const updateEvent = async (id, data) => {
  return apiFetch(`${API_BASE_URL}/events/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

export const deleteEvent = async (id) => {
  return apiFetch(`${API_BASE_URL}/events/${id}`, {
    method: 'DELETE',
  });
};

export const registerForEvent = async (eventId, data) => {
  try {
    return await apiFetch(`${API_BASE_URL}/events/${eventId}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (err) {
    // Offline local storage fallback
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
  return apiFetch(`${API_BASE_URL}/resources${qs ? '?' + qs : ''}`);
};

export const createResource = async (formData) => {
  // formData is a FormData object with fields + optional PDF file
  return apiFetch(`${API_BASE_URL}/resources`, {
    method: 'POST',
    body: formData, // no Content-Type header — browser sets multipart boundary
  });
};

export const updateResource = async (id, formData) => {
  return apiFetch(`${API_BASE_URL}/resources/${id}`, {
    method: 'PATCH',
    body: formData,
  });
};

export const deleteResource = async (id) => {
  return apiFetch(`${API_BASE_URL}/resources/${id}`, {
    method: 'DELETE',
  });
};

export const downloadResource = (id) => {
  // Direct browser download — opens in new tab
  window.open(`${API_BASE_URL}/resources/${id}/download`, '_blank');
};

// ─── Uploads ───────────────────────────────────────────────────────────────────

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiFetch(`${API_BASE_URL}/uploads/image`, {
    method: 'POST',
    body: formData,
  });
};

export const uploadPdf = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiFetch(`${API_BASE_URL}/uploads/pdf`, {
    method: 'POST',
    body: formData,
  });
};

// ─── Admin Auth ────────────────────────────────────────────────────────────────

export const adminLogin = async (username, password) => {
  return apiFetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
};

export const adminLogout = async () => {
  return apiFetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
  });
};

export const getAdminMe = async () => {
  return apiFetch(`${API_BASE_URL}/auth/me`);
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
    console.log('Attempting to connect to:', `${API_BASE_URL}/login`);
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
    } else {
      console.log('Server response not OK, attempting mock login fallback.');
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
    throw new Error("Invalid matric number. Use demo credentials (e.g., 2022/12345, 21/1000, 2023/10001).");
  }
};
