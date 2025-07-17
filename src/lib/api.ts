
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Helper function for API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = getAuthHeaders();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
};

export const api = {
  // Auth endpoints
  login: async (employeeId: string, password: string) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ employeeId, password }),
    });
  },

  // Menu endpoints
  getMenuItems: async () => {
    return apiRequest('/menu');
  },

  addMenuItem: async (item: any) => {
    return apiRequest('/menu', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },

  updateMenuItem: async (id: string, item: any) => {
    return apiRequest(`/menu/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  },

  deleteMenuItem: async (id: string) => {
    return apiRequest(`/menu/${id}`, {
      method: 'DELETE',
    });
  },

  // Table endpoints
  getTables: async () => {
    return apiRequest('/tables');
  },

  updateTableStatus: async (tableId: string, status: string) => {
    return apiRequest(`/tables/${tableId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Order endpoints
  createOrder: async (order: any) => {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  },

  getOrders: async () => {
    return apiRequest('/orders');
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    return apiRequest(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Admin endpoints
  getEmployees: async () => {
    return apiRequest('/admin/employees');
  },

  addEmployee: async (employee: any) => {
    return apiRequest('/admin/employees', {
      method: 'POST',
      body: JSON.stringify(employee),
    });
  },

  updateEmployee: async (id: string, employee: any) => {
    return apiRequest(`/admin/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employee),
    });
  },

  deleteEmployee: async (id: string) => {
    return apiRequest(`/admin/employees/${id}`, {
      method: 'DELETE',
    });
  },

  getSalesData: async () => {
    return apiRequest('/admin/sales');
  },
};
