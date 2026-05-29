// API Base URL - Backend Java Spring Boot
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const TOKEN_KEY = 'gocart_token';
const USER_KEY = 'gocart_user';

export const authStorage = {
    getToken: () => (typeof window === 'undefined' ? null : window.localStorage.getItem(TOKEN_KEY)),
    getUser: () => {
        if (typeof window === 'undefined') return null;
        const raw = window.localStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    },
    set: (token, user) => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(TOKEN_KEY, token);
        window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    clear: () => {
        if (typeof window === 'undefined') return;
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem(USER_KEY);
    },
};

// Helper function để gọi API
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = authStorage.getToken();
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            if ((response.status === 401 || response.status === 403) && token) {
                authStorage.clear();
                if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
                    window.location.href = '/login';
                }
            }
            let message = `API Error: ${response.status} ${response.statusText}`;
            try {
                const errorBody = await response.json();
                if (errorBody?.message) message = errorBody.message;
            } catch (_) { /* response has no JSON body */ }
            throw new Error(message);
        }

        if (response.status === 204) return null;
        return await response.json();
    } catch (error) {
        console.error('API Call Error:', error);
        throw error;
    }
}

// Auth API
export const authAPI = {
    register: (data) => apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    login: (data) => apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    me: () => apiCall('/auth/me'),
};

// Products API
export const productsAPI = {
    getAll: () => apiCall('/products'),
    getById: (id) => apiCall(`/products/${id}`),
    getByStore: (storeId) => apiCall(`/products/store/${storeId}`),
    getByCategory: (category) => apiCall(`/products/category/${category}`),
    getLatest: () => apiCall('/products/latest'),
    search: (keyword) => apiCall(`/products/search?keyword=${encodeURIComponent(keyword)}`),
    create: (product) => apiCall('/products', {
        method: 'POST',
        body: JSON.stringify(product),
    }),
    update: (id, product) => apiCall(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(product),
    }),
    delete: (id) => apiCall(`/products/${id}`, {
        method: 'DELETE',
    }),
};

// Orders API
export const ordersAPI = {
    getAll: () => apiCall('/orders'),
    getMine: () => apiCall('/orders/me'),
    getById: (id) => apiCall(`/orders/${id}`),
    getHistory: (id) => apiCall(`/orders/${id}/history`),
    getByUser: (userId) => apiCall(`/orders/user/${userId}`),
    getByStore: (storeId) => apiCall(`/orders/store/${storeId}`),
    getByStoreAndStatus: (storeId, status) => apiCall(`/orders/store/${storeId}/status/${status}`),
    place: (payload) => apiCall('/orders/place', {
        method: 'POST',
        body: JSON.stringify(payload),
    }),
    create: (order) => apiCall('/orders', {
        method: 'POST',
        body: JSON.stringify(order),
    }),
    updateStatus: (id, status) => apiCall(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(status),
    }),
    updatePaid: (id, isPaid) => apiCall(`/orders/${id}/paid`, {
        method: 'PATCH',
        body: JSON.stringify(isPaid),
    }),
    delete: (id) => apiCall(`/orders/${id}`, {
        method: 'DELETE',
    }),
};

// Users API
export const usersAPI = {
    getAll: () => apiCall('/users'),
    getById: (id) => apiCall(`/users/${id}`),
    getByEmail: (email) => apiCall(`/users/email/${email}`),
    getProfile: () => apiCall('/users/profile'),
    updateProfile: (data) => apiCall('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    create: (user) => apiCall('/users', {
        method: 'POST',
        body: JSON.stringify(user),
    }),
    update: (id, user) => apiCall(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(user),
    }),
    delete: (id) => apiCall(`/users/${id}`, {
        method: 'DELETE',
    }),
};

// Stores API
export const storesAPI = {
    getAll: () => apiCall('/stores'),
    getById: (id) => apiCall(`/stores/${id}`),
    getByUsername: (username) => apiCall(`/stores/username/${username}`),
    getByUserId: (userId) => apiCall(`/stores/user/${userId}`),
    getMyDashboard: () => apiCall('/stores/me/dashboard'),
    getActive: () => apiCall('/stores/active'),
    getByStatus: (status) => apiCall(`/stores/status/${status}`),
    create: (store) => apiCall('/stores', {
        method: 'POST',
        body: JSON.stringify(store),
    }),
    update: (id, store) => apiCall(`/stores/${id}`, {
        method: 'PUT',
        body: JSON.stringify(store),
    }),
    toggleActive: (id) => apiCall(`/stores/${id}/toggle-active`, {
        method: 'PATCH',
    }),
    updateStatus: (id, status) => apiCall(`/stores/${id}/status?status=${encodeURIComponent(status)}`, {
        method: 'PATCH',
    }),
    delete: (id) => apiCall(`/stores/${id}`, {
        method: 'DELETE',
    }),
};

// Admin API
export const adminAPI = {
    getDashboard: () => apiCall('/admin/dashboard'),
};

// Addresses API
export const addressesAPI = {
    getAll: () => apiCall('/addresses'),
    getById: (id) => apiCall(`/addresses/${id}`),
    getByUser: (userId) => apiCall(`/addresses/user/${userId}`),
    create: (address) => apiCall('/addresses', {
        method: 'POST',
        body: JSON.stringify(address),
    }),
    update: (id, address) => apiCall(`/addresses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(address),
    }),
    delete: (id) => apiCall(`/addresses/${id}`, {
        method: 'DELETE',
    }),
};

// Categories API
export const categoriesAPI = {
    getAll: () => apiCall('/categories'),
    getById: (id) => apiCall(`/categories/${id}`),
    getBySlug: (slug) => apiCall(`/categories/slug/${slug}`),
    create: (category) => apiCall('/categories', {
        method: 'POST',
        body: JSON.stringify(category),
    }),
    update: (id, category) => apiCall(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(category),
    }),
    delete: (id) => apiCall(`/categories/${id}`, {
        method: 'DELETE',
    }),
};

// Coupons API
export const couponsAPI = {
    getAll: () => apiCall('/coupons'),
    getByCode: (code) => apiCall(`/coupons/${code}`),
    getPublic: () => apiCall('/coupons/public'),
    create: (coupon) => apiCall('/coupons', {
        method: 'POST',
        body: JSON.stringify(coupon),
    }),
    update: (code, coupon) => apiCall(`/coupons/${code}`, {
        method: 'PUT',
        body: JSON.stringify(coupon),
    }),
    delete: (code) => apiCall(`/coupons/${code}`, {
        method: 'DELETE',
    }),
};

