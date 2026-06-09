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

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Please check your internet connection.');
    }
    throw error;
  }
};
