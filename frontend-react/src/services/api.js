// Centralized API Service for College Event Management System
const BASE_URL = '/api';

// Safe storage wrapper with in-memory fallback for restricted/iframe environments
const memoryStore = {};

export const safeStorage = {
    getItem(key) {
        try {
            if (typeof window !== 'undefined' && 'localStorage' in window) {
                return window.localStorage.getItem(key);
            }
        } catch (e) {
            // Storage access blocked or restricted by browser
        }
        return memoryStore[key] || null;
    },
    setItem(key, value) {
        try {
            if (typeof window !== 'undefined' && 'localStorage' in window) {
                window.localStorage.setItem(key, value);
                return;
            }
        } catch (e) {
            // Storage access blocked or restricted by browser
        }
        memoryStore[key] = String(value);
    },
    removeItem(key) {
        try {
            if (typeof window !== 'undefined' && 'localStorage' in window) {
                window.localStorage.removeItem(key);
                return;
            }
        } catch (e) {
            // Storage access blocked or restricted by browser
        }
        delete memoryStore[key];
    },
    clear() {
        try {
            if (typeof window !== 'undefined' && 'localStorage' in window) {
                window.localStorage.clear();
                return;
            }
        } catch (e) {
            // Storage access blocked or restricted by browser
        }
        Object.keys(memoryStore).forEach(k => delete memoryStore[k]);
    }
};

export const Api = {
    getToken() {
        return safeStorage.getItem('cems_jwt_token');
    },

    setToken(token) {
        if (token) safeStorage.setItem('cems_jwt_token', token);
        else safeStorage.removeItem('cems_jwt_token');
    },

    getUser() {
        try {
            const raw = safeStorage.getItem('cems_user');
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    },

    setUser(user) {
        if (user) safeStorage.setItem('cems_user', JSON.stringify(user));
        else safeStorage.removeItem('cems_user');
    },

    clearAuth() {
        safeStorage.removeItem('cems_jwt_token');
        safeStorage.removeItem('cems_user');
    },

    async request(endpoint, options = {}) {
        const url = `${BASE_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };

        const token = Api.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const res = await fetch(url, { ...options, headers });
            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                if (res.status === 401) {
                    // Session expired
                    console.warn('Unauthorized request:', endpoint);
                }
                const errorMsg = data.message || `HTTP ${res.status}: ${res.statusText}`;
                throw new Error(errorMsg);
            }

            return data;
        } catch (err) {
            throw err;
        }
    },

    auth: {
        loginStudent: (creds) => Api.request('/auth/student/login', { method: 'POST', body: JSON.stringify(creds) }),
        loginAdmin: (creds) => Api.request('/auth/admin/login', { method: 'POST', body: JSON.stringify(creds) }),
        loginOrganizer: (creds) => Api.request('/auth/organizer/login', { method: 'POST', body: JSON.stringify(creds) }),
        registerStudent: (data) => Api.request('/auth/student/register', { method: 'POST', body: JSON.stringify(data) }),
        getMe: () => Api.request('/auth/me')
    },

    events: {
        getAll: () => Api.request('/events'),
        getActive: () => Api.request('/events/active'),
        getById: (id) => Api.request(`/events/${id}`),
        search: (params) => {
            const query = new URLSearchParams(params).toString();
            return Api.request(`/events/search?${query}`);
        },
        create: (data) => Api.request('/events', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => Api.request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => Api.request(`/events/${id}`, { method: 'DELETE' })
    },

    registrations: {
        register: (eventId) => Api.request('/registrations/register', { method: 'POST', body: JSON.stringify({ eventId }) }),
        getMyRegistrations: () => Api.request('/registrations/my-registrations'),
        cancel: (id) => Api.request(`/registrations/cancel/${id}`, { method: 'POST' }),
        getAllForAdmin: () => Api.request('/registrations/admin/all'),
        getById: (id) => Api.request(`/registrations/admin/${id}`),
        updateStatus: (id, status, adminRemarks) => Api.request(`/registrations/admin/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status, adminRemarks })
        })
    },

    attendance: {
        scanTicket: (ticketCode) => Api.request('/attendance/scan', { method: 'POST', body: JSON.stringify({ ticketCode }) }),
        getEventAttendance: (eventId) => Api.request(`/attendance/event/${eventId}`)
    },

    certificates: {
        issue: (registrationId) => Api.request('/certificates/issue', { method: 'POST', body: JSON.stringify({ registrationId }) }),
        getMyCertificates: () => Api.request('/certificates/my'),
        verify: (code) => Api.request(`/certificates/verify/${code}`),
        getAll: () => Api.request('/certificates/all')
    },

    gallery: {
        getPhotos: (params) => {
            if (typeof params === 'string') {
                return Api.request(params ? `/gallery?category=${encodeURIComponent(params)}` : '/gallery');
            }
            const query = new URLSearchParams();
            if (params?.category) query.append('category', params.category);
            if (params?.eventId) query.append('eventId', params.eventId);
            const qs = query.toString();
            return Api.request(qs ? `/gallery?${qs}` : '/gallery');
        },
        getByEventId: (eventId) => Api.request(`/gallery?eventId=${eventId}`),
        addPhoto: (data) => Api.request('/gallery', { method: 'POST', body: JSON.stringify(data) }),
        deletePhoto: (id) => Api.request(`/gallery/${id}`, { method: 'DELETE' })
    },

    announcements: {
        getActive: () => Api.request('/announcements/active'),
        create: (data) => Api.request('/announcements', { method: 'POST', body: JSON.stringify(data) }),
        delete: (id) => Api.request(`/announcements/${id}`, { method: 'DELETE' })
    },

    feedback: {
        submit: (eventId, rating, comments) => Api.request('/feedback', { method: 'POST', body: JSON.stringify({ eventId, rating, comments }) }),
        getEventFeedbacks: (eventId) => Api.request(`/feedback/event/${eventId}`)
    },

    waitlist: {
        join: (eventId) => Api.request(`/waitlist/join/${eventId}`, { method: 'POST' }),
        getMy: () => Api.request('/waitlist/my')
    },

    dashboard: {
        getAdminStats: () => Api.request('/dashboard/admin'),
        getOrganizerDashboard: () => Api.request('/organizer/dashboard'),
        getPublicStats: () => Api.request('/dashboard/public')
    },

    students: {
        getProfile: () => Api.request('/students/profile'),
        updateProfile: (data) => Api.request('/students/profile', { method: 'PUT', body: JSON.stringify(data) }),
        getAllForAdmin: () => Api.request('/students/admin/all')
    },

    organizers: {
        getAll: () => Api.request('/organizer/all'),
        create: (data) => Api.request('/organizer', { method: 'POST', body: JSON.stringify(data) }),
        getMyEvents: () => Api.request('/organizer/my-events')
    },

    auditLogs: {
        getAll: () => Api.request('/audit-logs')
    }
};

export default Api;
