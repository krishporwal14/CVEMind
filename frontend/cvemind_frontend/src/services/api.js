import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 404) {
      throw new Error('Resource not found');
    } else if (error.response?.status === 500) {
      throw new Error('Internal server error. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection.');
    } else if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    }
    
    throw error;
  }
);

export const cveApi = {
  // CVE Search and Retrieval
  searchCves: async (keyword) => {
    const response = await api.get(`/cve/search?keyword=${encodeURIComponent(keyword)}`);
    return response.data;
  },

  getCveById: async (cveId) => {
    const response = await api.get(`/cve/${cveId}`);
    return response.data;
  },

  getAllCves: async () => {
    const response = await api.get('/cve/all');
    return response.data;
  },

  // NVD Service Direct Access
  searchNvd: async (keyword) => {
    const response = await api.get(`/cve/nvd/search?keyword=${encodeURIComponent(keyword)}`);
    return response.data;
  },

  getCveFromNvd: async (cveId) => {
    const response = await api.get(`/cve/nvd/${cveId}`);
    return response.data;
  },

  // AI Analysis Endpoints
  summarizeCve: async (cveId) => {
    try {
      const response = await api.post(`/cve/${cveId}/summarize`);
      return response.data;
    } catch (error) {
      console.error(`Error summarizing CVE ${cveId}:`, error);
      throw error;
    }
  },

  batchSummarize: async (cveIds) => {
    try {
      const response = await api.post('/cve/batch/summarize', cveIds);
      return response.data;
    } catch (error) {
      console.error('Error in batch summarize:', error);
      throw error;
    }
  },

  // Utility Endpoints
  healthCheck: async () => {
    const response = await api.get('/cve/health');
    return response.data;
  },

  testAI: async () => {
    const response = await api.get('/cve/test-ai');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/cve/stats');
    return response.data;
  },
};

export default api;