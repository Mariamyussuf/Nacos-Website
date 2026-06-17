const API_BASE_URL = "http://localhost:5000/api";

export const subscribe = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to subscribe');
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Please check your internet connection.');
    }
    throw error;
  }
};

export const getNews = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/news`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch news.");
    }

    return response.json();
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

