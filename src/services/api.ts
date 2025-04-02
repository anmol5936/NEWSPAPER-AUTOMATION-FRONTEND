const API_BASE_URL = 'http://localhost:5000/api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  role: 'manager' | 'deliverer';
  username: string;
}

export interface Publication {
  id: string;
  name: string;
  language: string;
  description: string;
  price: number;
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  phone: string;
  subscriptions: string[];
}

export interface DeliveryItem {
  address: string;
  publications: Publication[];
}

export interface Bill {
  customerId: string;
  customerName: string;
  publications: Array<{
    name: string;
    copies: number;
    cost: number;
  }>;
  totalCost: number;
}

export interface Payment {
  customerId: string;
  amount: number;
  chequeNumber?: string;
}

export interface DelivererPayment {
  delivererId: string;
  amount: number;
  period: string;
}

const api = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      throw new Error('Invalid credentials');
    }
    
    return response.json();
  },

  register: async (credentials: LoginCredentials & { role: 'manager' | 'deliverer' | 'user'}): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  },

  // Publications
  addPublication: async (publication: Omit<Publication, 'id'>): Promise<Publication> => {
    const response = await fetch(`${API_BASE_URL}/publications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(publication),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add publication');
    }
    
    return response.json();
  },
  getAllPublications: async (): Promise<Publication[]> => {
    const response = await fetch(`${API_BASE_URL}/publications`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch publications');
    }
    
    return response.json();
  },

  editPublication: async (id: string, publication: Partial<Publication>): Promise<Publication> => {
    const response = await fetch(`${API_BASE_URL}/publications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(publication),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update publication');
    }
    
    return response.json();
  },

    // Customers
    viewCustomers: async (): Promise<Customer[]> => {
      const response = await fetch(`${API_BASE_URL}/customers`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) {
        throw new Error('Failed to retrieve customers');
      }
  
      return response.json();
    },

  // Customers
  addCustomer: async (customer: Omit<Customer, 'id'>): Promise<Customer> => {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add customer');
    }
    
    return response.json();
  },

  editCustomer: async (id: string, customer: Partial<Customer>): Promise<Customer> => {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update customer');
    }
    
    return response.json();
  },

  // Deliveries
  getDeliveryList: async (): Promise<DeliveryItem[]> => {
    const response = await fetch(`${API_BASE_URL}/deliveries/today`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch delivery list');
    }
    
    return response.json();
  },

  getDeliverySummary: async (): Promise<{ customers: Array<{ name: string; publicationsDelivered: number }> }> => {
    const response = await fetch(`${API_BASE_URL}/delivery-summary`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch delivery summary');
    }
    
    return response.json();
  },

  // Bills
  getBills: async (): Promise<{ bills: Bill[] }> => {
    const response = await fetch(`${API_BASE_URL}/bills`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch bills');
    }
    
    return response.json();
  },

  // Withhold Subscription
  withholdSubscription: async (data: { customerId: string; startDate: string; endDate: string }): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/customers/withhold`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to withhold subscription');
    }
  },

  // Payments
  recordPayment: async (payment: Payment): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payment),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to record payment');
    }
    
    return response.json();
  },

  getDelivererPayments: async (): Promise<{ payments: DelivererPayment[] }> => {
    const response = await fetch(`${API_BASE_URL}/payments/deliverer-payments`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch deliverer payments');
    }
    
    return response.json();
  },
};

export default api;