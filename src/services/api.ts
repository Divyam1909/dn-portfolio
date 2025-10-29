import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('adminToken');
      // Redirect to login if we're in admin area
      if (window.location.pathname.includes('/admin')) {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// ==================== PUBLIC API ====================

export const portfolioAPI = {
  // Get all portfolio data
  getAll: () => api.get('/portfolio'),
  
  // Get personal info
  getPersonalInfo: () => api.get('/personal-info'),
  
  // Get projects
  getProjects: () => api.get('/projects'),
  getProject: (id: string) => api.get(`/projects/${id}`),
  
  // Get experience
  getExperience: () => api.get('/experience'),
  
  // Get education
  getEducation: () => api.get('/education'),
  
  // Get skills
  getSkills: () => api.get('/skills'),
  
  // Get certifications
  getCertifications: () => api.get('/certifications'),
  
  // Get quotes
  getRandomQuote: (category?: string) => api.get('/quotes/random', { params: { category } }),
  getQuotes: (category?: string) => api.get('/quotes', { params: { category } }),
  
  // Submit contact form
  submitContact: (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => api.post('/contact', data),
};

// ==================== ADMIN API ====================

export const adminAPI = {
  // Authentication
  login: (credentials: { username: string; password: string }) =>
    api.post('/admin/login', credentials),
  
  getMe: () => api.get('/admin/me'),
  
  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/admin/password', data),
  
  // Personal Info
  updatePersonalInfo: (data: any) => api.put('/admin/personal-info', data),
  
  // Projects
  getAllProjects: () => api.get('/admin/projects'),
  createProject: (data: any) => api.post('/admin/projects', data),
  updateProject: (id: string, data: any) => api.put(`/admin/projects/${id}`, data),
  deleteProject: (id: string) => api.delete(`/admin/projects/${id}`),
  
  // Experience
  createExperience: (data: any) => api.post('/admin/experience', data),
  updateExperience: (id: string, data: any) => api.put(`/admin/experience/${id}`, data),
  deleteExperience: (id: string) => api.delete(`/admin/experience/${id}`),
  
  // Education
  createEducation: (data: any) => api.post('/admin/education', data),
  updateEducation: (id: string, data: any) => api.put(`/admin/education/${id}`, data),
  deleteEducation: (id: string) => api.delete(`/admin/education/${id}`),
  
  // Skills
  createSkill: (data: any) => api.post('/admin/skills', data),
  updateSkill: (id: string, data: any) => api.put(`/admin/skills/${id}`, data),
  deleteSkill: (id: string) => api.delete(`/admin/skills/${id}`),
  
  // Contact Messages
  getContacts: (status?: string) => api.get('/admin/contacts', { params: { status } }),
  updateContactStatus: (id: string, data: { status: string; replied?: boolean }) =>
    api.put(`/admin/contacts/${id}`, data),
  deleteContact: (id: string) => api.delete(`/admin/contacts/${id}`),
  
  // Certifications
  getAllCertifications: () => api.get('/admin/certifications'),
  createCertification: (data: any) => api.post('/admin/certifications', data),
  updateCertification: (id: string, data: any) => api.put(`/admin/certifications/${id}`, data),
  deleteCertification: (id: string) => api.delete(`/admin/certifications/${id}`),
  reorderCertifications: (certifications: any[]) => 
    api.put('/admin/certifications/reorder', { certifications }),
  
  // Quotes
  getAllQuotes: () => api.get('/admin/quotes'),
  createQuote: (data: any) => api.post('/admin/quotes', data),
  updateQuote: (id: string, data: any) => api.put(`/admin/quotes/${id}`, data),
  deleteQuote: (id: string) => api.delete(`/admin/quotes/${id}`),
};

export default api;

