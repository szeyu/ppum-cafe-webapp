const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('access_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
  }

  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        // Token expired or invalid - throw error but don't immediately clear token
        // Let the AppContext handle the authentication refresh
        throw new Error('Authentication required');
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: userData,
    });
    
    if (response.access_token) {
      this.setToken(response.access_token);
    }
    
    return response;
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: credentials,
    });
    
    if (response.access_token) {
      this.setToken(response.access_token);
    }
    
    return response;
  }

  async logout() {
    this.setToken(null);
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // User endpoints
  async createUser(userData) {
    return this.request('/users/', {
      method: 'POST',
      body: userData,
    });
  }

  async getUser(userId) {
    return this.request(`/users/${userId}`);
  }

  async updateUserLanguage(userId, language) {
    return this.request(`/users/${userId}/language?language=${language}`, {
      method: 'PUT',
    });
  }

  // Stall endpoints
  async getStalls() {
    return this.request('/stalls/');
  }

  async getStall(stallId) {
    return this.request(`/stalls/${stallId}`);
  }

  // Menu endpoints
  async getMenuItems(stallId = null, category = null) {
    let endpoint = '/menu-items/';
    const params = new URLSearchParams();
    
    if (stallId) params.append('stall_id', stallId);
    if (category) params.append('category', category);
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
    
    return this.request(endpoint);
  }

  async getMenuItem(itemId) {
    return this.request(`/menu-items/${itemId}`);
  }

  async getMenuCategories(stallId) {
    return this.request(`/stalls/${stallId}/categories`);
  }

  // Enhanced Order endpoints
  async createOrder(orderData) {
    return this.request('/orders/', {
      method: 'POST',
      body: orderData,
    });
  }

  async getUserOrders(userId) {
    return this.request(`/orders/user/${userId}`);
  }

  async getOrder(orderId) {
    return this.request(`/orders/${orderId}`);
  }

  async getOrderTracking(orderId) {
    return this.request(`/orders/${orderId}/tracking`);
  }

  // Food Tracker endpoints
  async updateFoodTrackerStatus(trackerId, status) {
    return this.request(`/food-trackers/${trackerId}/status?status=${status}`, {
      method: 'PUT',
    });
  }

  // Notification endpoints
  async getUserNotifications(userId, unreadOnly = false) {
    return this.request(`/notifications/user/${userId}?unread_only=${unreadOnly}`);
  }

  async markNotificationRead(notificationId) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  // Search endpoints
  async searchMenuItems(query, stallId = null) {
    let endpoint = `/search/menu-items?q=${encodeURIComponent(query)}`;
    if (stallId) {
      endpoint += `&stall_id=${stallId}`;
    }
    return this.request(endpoint);
  }

  async searchStalls(query) {
    return this.request(`/search/stalls?q=${encodeURIComponent(query)}`);
  }

  // Admin endpoints
  async getAdminStats() {
    return this.request('/admin/stats');
  }

  async getAdminMenuItems() {
    return this.request('/admin/menu-items');
  }

  // Admin Stall Management
  async deleteStall(stallId) {
    return this.request(`/admin/stalls/${stallId}`, {
      method: 'DELETE',
    });
  }

  async updateStall(stallId, stallData) {
    return this.request(`/admin/stalls/${stallId}`, {
      method: 'PUT',
      body: stallData,
    });
  }

  async createStall(stallData) {
    return this.request('/admin/stalls', {
      method: 'POST',
      body: stallData,
    });
  }

  // Admin Menu Item Management
  async deleteMenuItem(itemId) {
    return this.request(`/admin/menu-items/${itemId}`, {
      method: 'DELETE',
    });
  }

  async updateMenuItem(itemId, itemData) {
    return this.request(`/admin/menu-items/${itemId}`, {
      method: 'PUT',
      body: itemData,
    });
  }

  async createMenuItem(itemData) {
    return this.request('/admin/menu-items', {
      method: 'POST',
      body: itemData,
    });
  }

  // Admin Order Management
  async getAllOrders() {
    return this.request('/admin/orders');
  }

  async deleteOrder(orderId) {
    return this.request(`/admin/orders/${orderId}`, {
      method: 'DELETE',
    });
  }

  // Admin User Management
  async getAllUsers() {
    return this.request('/admin/users');
  }

  async getUsersByRole(role) {
    return this.request(`/admin/users/by-role/${role}`);
  }

  async changeUserRole(email, newRole, stallId = null) {
    const body = { email, new_role: newRole };
    if (stallId) {
      body.stall_id = stallId;
    }
    return this.request('/admin/users/change-role', {
      method: 'PUT',
      body: body,
    });
  }

  async createUserByAdmin(userData) {
    return this.request('/admin/users', {
      method: 'POST',
      body: userData,
    });
  }

  async deleteUser(userId) {
    return this.request(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // Stall Owner endpoints
  async getStallOrders() {
    return this.request('/stall-owner/orders');
  }

  async getStallFoodTrackers(status = null) {
    let endpoint = '/stall-owner/food-trackers';
    if (status) {
      endpoint += `?status=${status}`;
    }
    return this.request(endpoint);
  }

  async updateStallFoodTrackerStatus(trackerId, status) {
    return this.request(`/stall-owner/food-trackers/${trackerId}/status?status=${status}`, {
      method: 'PUT',
    });
  }

  async getStallOwnerStall() {
    return this.request('/stall-owner/stall');
  }

  // Stall Owner Menu Management
  async getStallMenuItems() {
    return this.request('/stall-owner/menu-items');
  }

  async createStallMenuItem(itemData) {
    return this.request('/stall-owner/menu-items', {
      method: 'POST',
      body: itemData,
    });
  }

  async updateStallMenuItem(itemId, itemData) {
    return this.request(`/stall-owner/menu-items/${itemId}`, {
      method: 'PUT',
      body: itemData,
    });
  }

  async deleteStallMenuItem(itemId) {
    return this.request(`/stall-owner/menu-items/${itemId}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export default new ApiService(); 