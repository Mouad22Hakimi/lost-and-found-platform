const API_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Auth API calls
export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (response.ok && data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  register: async (fullName, email, password, studentId) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password, studentId })
    });
    const data = await response.json();
    if (response.ok && data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  forgotPassword: async (email) => {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return response.json();
  },

  getCurrentUser: async () => {
    const token = getToken();
    if (!token) return null;
    
    const response = await fetch(`${API_URL}/auth/user`, {
      headers: { 'x-auth-token': token }
    });
    return response.json();
  },

  logout: () => {
    localStorage.removeItem('token');
  }
};

// Items API calls
export const itemsAPI = {
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}/items?${queryParams}`);
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/items/${id}`);
    return response.json();
  },

  create: async (itemData) => {
    const response = await fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': getToken()
      },
      body: JSON.stringify(itemData)
    });
    return response.json();
  },

  update: async (id, itemData) => {
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': getToken()
      },
      body: JSON.stringify(itemData)
    });
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'DELETE',
      headers: { 'x-auth-token': getToken() }
    });
    return response.json();
  },

  getMyItems: async () => {
    const response = await fetch(`${API_URL}/items/user/my-items`, {
      headers: { 'x-auth-token': getToken() }
    });
    return response.json();
  }
};
