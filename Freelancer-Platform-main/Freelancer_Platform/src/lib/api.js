import { apiClient } from '@/integrations/mongodb/client';

// Freelancer API
export const freelancerApi = {
  getAll: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const data = await apiClient.get(`/api/freelancers${queryString ? `?${queryString}` : ''}`);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  getById: async (id) => {
    try {
      const data = await apiClient.get(`/api/freelancers/${id}`);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  create: async (freelancer) => {
    try {
      const data = await apiClient.post('/api/freelancers', freelancer);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  update: async (id, freelancer) => {
    try {
      const data = await apiClient.put(`/api/freelancers/${id}`, freelancer);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  delete: async (id) => {
    try {
      await apiClient.delete(`/api/freelancers/${id}`);
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
      const data = await apiClient.get(`/api/reports${queryString}`);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  create: async (report) => {
    try {
      const data = await apiClient.post('/api/reports', report);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  delete: async (id) => {
    try {
      await apiClient.delete(`/api/reports/${id}`);
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
      const data = await apiClient.get('/api/settings');
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  get: async (key) => {
    try {
      const data = await apiClient.get(`/api/settings/${key}`);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  set: async (setting) => {
    try {
      const data = await apiClient.put(`/api/settings/${setting.key}`, setting);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  delete: async (key) => {
    try {
      await apiClient.delete(`/api/settings/${key}`);
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
      const data = await apiClient.get('/api/admin/users');
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  setUserRole: async (userId, role) => {
    try {
      const data = await apiClient.put(`/api/admin/users/${userId}/role`, { role });
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  getStats: async () => {
    try {
      const data = await apiClient.get('/api/admin/stats');
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};
