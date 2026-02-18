const API_BASE_URL = 'http://localhost:5001';

// Helper function to get auth token
const getAuthToken = () => localStorage.getItem('authToken');

// Helper function to make authenticated requests
const makeRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/auth';
    }
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || errorData.error || `API error: ${response.status}`);
  }

  return response.json();
};

// Freelancer API
export const freelancerApi = {
  getAll: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const data = await makeRequest(`/api/freelancers${queryString ? `?${queryString}` : ''}`);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  getById: async (id) => {
    try {
      const data = await makeRequest(`/api/freelancers/${id}`);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  create: async (freelancer) => {
    try {
      const data = await makeRequest('/api/freelancers', {
        method: 'POST',
        body: JSON.stringify(freelancer),
      });
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  update: async (id, freelancer) => {
    try {
      const data = await makeRequest(`/api/freelancers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(freelancer),
      });
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  delete: async (id) => {
    try {
      await makeRequest(`/api/freelancers/${id}`, {
        method: 'DELETE',
      });
      return { error: null };
    } catch (error) {
      return { error };
    }
  },
};

// Reports API
export const reportsApi = {
  getAll: async (type) => {
    try {
      const queryString = type ? `?type=${type}` : '';
      const data = await makeRequest(`/api/reports${queryString}`);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  create: async (report) => {
    try {
      const data = await makeRequest('/api/reports', {
        method: 'POST',
        body: JSON.stringify(report),
      });
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  delete: async (id) => {
    try {
      await makeRequest(`/api/reports/${id}`, {
        method: 'DELETE',
      });
      return { error: null };
    } catch (error) {
      return { error };
    }
  },
};

// Settings API
export const settingsApi = {
  getAll: async () => {
    try {
      const data = await makeRequest('/api/settings');
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  get: async (key) => {
    try {
      const data = await makeRequest(`/api/settings/${key}`);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  set: async (setting) => {
    try {
      const data = await makeRequest(`/api/settings/${setting.key}`, {
        method: 'PUT',
        body: JSON.stringify(setting),
      });
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  delete: async (key) => {
    try {
      await makeRequest(`/api/settings/${key}`, {
        method: 'DELETE',
      });
      return { error: null };
    } catch (error) {
      return { error };
    }
  },
};

// Admin API
export const adminApi = {
  getUsers: async () => {
    try {
      const data = await makeRequest('/api/admin/users');
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  setUserRole: async (userId, role) => {
    try {
      const data = await makeRequest(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role }),
      });
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  getStats: async () => {
    try {
      const data = await makeRequest('/api/admin/stats');
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};
