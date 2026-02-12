// MongoDB client configuration
const MONGODB_URL = import.meta.env.VITE_MONGODB_URL || 'mongodb://localhost:27017';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const apiClient = {
  baseURL: API_BASE_URL,
  
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('authToken');
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/auth';
      }
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  },

  get(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'GET' });
  },

  post(endpoint, body, options) {
    return this.request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
  },

  put(endpoint, body, options) {
    return this.request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
  },

  delete(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  },
};

export const mongodbUrl = MONGODB_URL;
