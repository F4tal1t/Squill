const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

class ApiService {
  constructor() {
    this.token = null;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      if (response.status === 401) {
        this.token = null;
        localStorage.removeItem('auth_token');
        throw new Error('Authentication failed');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  async login(email, password) {
    // Demo credentials handling
    if (email === 'admin@squill.com' && password === 'demo123') {
      const demoToken = 'demo_token_' + Date.now();
      this.token = demoToken;
      localStorage.setItem('auth_token', this.token);
      return { token: demoToken, user: email };
    }
    
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.token = response.token;
    localStorage.setItem('auth_token', this.token);
    return response;
  }

  async logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  setToken(token) {
    this.token = token;
  }

  getToken() {
    return this.token || localStorage.getItem('auth_token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  async getAnalytics() {
    return this.request('/analytics');
  }

  async getCustomers() {
    return this.request('/customers');
  }

  async getInvoices() {
    return this.request('/invoices');
  }

  async getCustomer(customerId) {
    return this.request(`/customers/${customerId}`);
  }

  async createCustomer(customerData) {
    return this.request('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  }

  async getInvoice(invoiceId) {
    return this.request(`/invoices/${invoiceId}`);
  }

  async generateInvoice(invoiceData) {
    return this.request('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoiceData),
    });
  }

  async getUsage(customerId) {
    return this.request(`/usage/${customerId}`);
  }

  async recordUsage(usageData) {
    return this.request('/usage', {
      method: 'POST',
      body: JSON.stringify(usageData),
    });
  }

  async getPricingTiers() {
    return this.request('/pricing-tiers');
  }
}

export default new ApiService();