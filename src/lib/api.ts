const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
  [key: string]: any;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('cafeToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('cafeToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('cafeToken');
  }

  // Authentication
  async login(employeeId: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ employeeId, password }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // User Management (Admin)
  async getUsers() {
    return this.request('/auth/users');
  }

  async createUser(userData: {
    name: string;
    email: string;
    employeeId: string;
    password: string;
    role: 'Admin' | 'Waiter' | 'Cashier';
  }) {
    return this.request('/auth/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: {
    name: string;
    email: string;
    employeeId: string;
    role: 'Admin' | 'Waiter' | 'Cashier';
    status?: 'Active' | 'Inactive';
  }) {
    return this.request(`/auth/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/auth/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Menu Management
  async getMenuCategories() {
    return this.request('/menu/categories');
  }

  async getMenuItems() {
    return this.request('/menu/items');
  }

  async getAllMenuItems() {
    return this.request('/menu/items/all');
  }

  async createMenuItem(itemData: {
    name: string;
    price: number;
    categoryId: number;
    subcategory?: 'Special' | 'Strong' | 'Less Sugar' | 'Normal';
    icon?: string;
  }) {
    return this.request('/menu/items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  }

  async updateMenuItem(id: string, itemData: {
    name: string;
    price: number;
    categoryId: number;
    subcategory?: 'Special' | 'Strong' | 'Less Sugar' | 'Normal';
    icon?: string;
    isAvailable?: boolean;
  }) {
    return this.request(`/menu/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
  }

  async deleteMenuItem(id: string) {
    return this.request(`/menu/items/${id}`, {
      method: 'DELETE',
    });
  }

  async createCategory(categoryData: {
    name: string;
    displayOrder?: number;
  }) {
    return this.request('/menu/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id: string, categoryData: {
    name: string;
    displayOrder?: number;
  }) {
    return this.request(`/menu/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id: string) {
    return this.request(`/menu/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Table Management
  async getTables() {
    return this.request('/tables');
  }

  async getTable(id: string) {
    return this.request(`/tables/${id}`);
  }

  async createTable(tableData: {
    number: string;
    zone: string;
    seats: number;
  }) {
    return this.request('/tables', {
      method: 'POST',
      body: JSON.stringify(tableData),
    });
  }

  async updateTable(id: string, tableData: {
    number: string;
    zone: string;
    seats: number;
    status?: 'Available' | 'Ordering' | 'Full' | 'Booked';
  }) {
    return this.request(`/tables/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tableData),
    });
  }

  async deleteTable(id: string) {
    return this.request(`/tables/${id}`, {
      method: 'DELETE',
    });
  }

  async getTableStats() {
    return this.request('/tables/stats/summary');
  }

  // Order Management
  async getOrders(params?: {
    status?: string;
    tableId?: string;
    date?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.tableId) queryParams.append('tableId', params.tableId);
    if (params?.date) queryParams.append('date', params.date);

    const endpoint = `/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async getOrder(id: string) {
    return this.request(`/orders/${id}`);
  }

  async createOrder(orderData: {
    tableId: number;
    items: Array<{
      menuItemId: number;
      quantity: number;
      modifiers?: string[];
      notes?: string;
    }>;
    notes?: string;
  }) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async updateOrderStatus(id: string, status: string) {
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async processPayment(id: string, paymentData: {
    paymentMethod: string;
    amount: number;
    transactionId?: string;
  }) {
    return this.request(`/orders/${id}/payment`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async getOrderStats(params?: {
    startDate?: string;
    endDate?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const endpoint = `/orders/stats/summary${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  // Admin Dashboard
  async getDashboardStats(params?: {
    startDate?: string;
    endDate?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const endpoint = `/admin/dashboard${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async getSystemStats() {
    return this.request('/admin/stats/system');
  }

  async getFinancialReport(params: {
    startDate: string;
    endDate: string;
  }) {
    const queryParams = new URLSearchParams();
    queryParams.append('startDate', params.startDate);
    queryParams.append('endDate', params.endDate);

    return this.request(`/admin/reports/financial?${queryParams.toString()}`);
  }

  async getSalesReport(params: {
    startDate: string;
    endDate: string;
  }) {
    const queryParams = new URLSearchParams();
    queryParams.append('startDate', params.startDate);
    queryParams.append('endDate', params.endDate);

    return this.request(`/admin/reports/sales?${queryParams.toString()}`);
  }

  async exportData(tables?: string[]) {
    const queryParams = new URLSearchParams();
    if (tables) queryParams.append('tables', tables.join(','));

    const endpoint = `/admin/export/data${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(endpoint);
  }
}

// Create and export a singleton instance
export const api = new ApiClient(API_BASE_URL);

// Export types for use in components
export interface User {
  id: number;
  name: string;
  email: string;
  employee_id: string;
  role: 'Admin' | 'Waiter' | 'Cashier';
  status: 'Active' | 'Inactive';
  created_at: string;
}

export interface Table {
  id: number;
  number: string;
  zone: string;
  seats: number;
  status: 'Available' | 'Ordering' | 'Full' | 'Booked';
  created_at: string;
  updated_at: string;
  current_order_id?: number;
  current_order_number?: string;
  current_order_total?: number;
}

export interface MenuCategory {
  id: number;
  name: string;
  display_order: number;
  created_at: string;
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category_id: number;
  category_name: string;
  subcategory: 'Special' | 'Strong' | 'Less Sugar' | 'Normal';
  icon: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  order_number: string;
  status: 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Served' | 'Completed' | 'Cancelled';
  subtotal: number;
  gst_amount: number;
  total_amount: number;
  payment_status: 'Pending' | 'Paid' | 'Partially Paid';
  payment_method?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  table_number: string;
  table_zone: string;
  user_name: string;
  user_employee_id: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  modifiers?: string;
  notes?: string;
  menu_item_id: number;
  menu_item_name: string;
  menu_item_icon: string;
  menu_item_category: string;
}

export interface Transaction {
  id: number;
  order_id: number;
  amount: number;
  payment_method: string;
  transaction_id?: string;
  status: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
  created_at: string;
} 