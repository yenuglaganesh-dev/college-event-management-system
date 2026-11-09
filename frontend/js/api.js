/**
 * College Event Management System - API Client
 * Connects Frontend directly to Java Spring Boot REST APIs
 */

const API_BASE_URL = window.location.origin.includes('8080') 
  ? '/api' 
  : 'http://localhost:8080/api';

const _memoryStore = {};
const safeStorage = {
  getItem(key) {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {}
    return _memoryStore[key] || null;
  },
  setItem(key, value) {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch (e) {}
    _memoryStore[key] = String(value);
  },
  removeItem(key) {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch (e) {}
    delete _memoryStore[key];
  }
};

const Api = {
  getToken() {
    return safeStorage.getItem('cems_jwt_token');
  },

  setAuth(data) {
    safeStorage.setItem('cems_jwt_token', data.token);
    safeStorage.setItem('cems_user_role', data.role);
    safeStorage.setItem('cems_user_id', data.id);
    safeStorage.setItem('cems_username', data.username);
    safeStorage.setItem('cems_full_name', data.fullName);
    safeStorage.setItem('cems_email', data.email);
    if (data.studentId) {
      safeStorage.setItem('cems_student_id', data.studentId);
    }
  },

  clearAuth() {
    safeStorage.removeItem('cems_jwt_token');
    safeStorage.removeItem('cems_user_role');
    safeStorage.removeItem('cems_user_id');
    safeStorage.removeItem('cems_username');
    safeStorage.removeItem('cems_full_name');
    safeStorage.removeItem('cems_email');
    safeStorage.removeItem('cems_student_id');
  },

  getUser() {
    const token = this.getToken();
    if (!token) return null;
    return {
      role: safeStorage.getItem('cems_user_role'),
      id: safeStorage.getItem('cems_user_id'),
      username: safeStorage.getItem('cems_username'),
      fullName: safeStorage.getItem('cems_full_name'),
      email: safeStorage.getItem('cems_email'),
      studentId: safeStorage.getItem('cems_student_id')
    };
  },

  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'ROLE_ADMIN';
  },

  isStudent() {
    const user = this.getUser();
    return user && user.role === 'ROLE_STUDENT';
  },

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const resData = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // If unauthorized and on protected page, handle session expiration
          if (window.location.pathname.includes('admin') || window.location.pathname.includes('student') || window.location.pathname.includes('my-registrations')) {
            console.warn('Session expired or unauthorized');
          }
        }
        const message = resData?.message || `HTTP ${response.status}: Request failed`;
        throw new Error(message);
      }

      return resData;
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err);
      throw err;
    }
  },

  // Auth APIs
  auth: {
    studentRegister: (data) => Api.request('/auth/student/register', { method: 'POST', body: JSON.stringify(data) }),
    studentLogin: (data) => Api.request('/auth/student/login', { method: 'POST', body: JSON.stringify(data) }),
    adminLogin: (data) => Api.request('/auth/admin/login', { method: 'POST', body: JSON.stringify(data) }),
    getMe: () => Api.request('/auth/me')
  },

  // Events APIs
  events: {
    getAll: () => Api.request('/events'),
    getActive: () => Api.request('/events/active'),
    getById: (id) => Api.request(`/events/${id}`),
    search: (keyword, category, status) => {
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (category) params.append('category', category);
      if (status) params.append('status', status);
      return Api.request(`/events/search?${params.toString()}`);
    },
    create: (data) => Api.request('/events', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => Api.request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => Api.request(`/events/${id}`, { method: 'DELETE' })
  },

  // Registrations APIs (CORE REQUIREMENT)
  registrations: {
    // Student registers for an event
    register: (eventId) => Api.request('/registrations/register', { 
      method: 'POST', 
      body: JSON.stringify({ eventId }) 
    }),
    // Student views own registrations
    getMyRegistrations: () => Api.request('/registrations/my-registrations'),
    // Student cancels registration
    cancel: (id) => Api.request(`/registrations/cancel/${id}`, { method: 'POST' }),
    // Admin views all registrations
    getAllForAdmin: () => Api.request('/registrations/admin/all'),
    // Admin filter registrations
    filter: (eventId, status, search) => {
      const params = new URLSearchParams();
      if (eventId) params.append('eventId', eventId);
      if (status) params.append('status', status);
      if (search) params.append('search', search);
      return Api.request(`/registrations/admin/filter?${params.toString()}`);
    },
    getById: (id) => Api.request(`/registrations/admin/${id}`),
    // Admin updates status (Approve / Reject)
    updateStatus: (id, status, remarks = '') => Api.request(`/registrations/admin/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, remarks })
    })
  },

  // Dashboard APIs
  dashboard: {
    getAdminStats: () => Api.request('/dashboard/admin'),
    getPublicStats: () => Api.request('/dashboard/public')
  },

  // Students APIs
  students: {
    getProfile: () => Api.request('/students/profile'),
    updateProfile: (data) => Api.request('/students/profile', { method: 'PUT', body: JSON.stringify(data) }),
    getAllForAdmin: () => Api.request('/students/admin/all'),
    getByIdForAdmin: (id) => Api.request(`/students/admin/${id}`)
  }
};

window.Api = Api;

