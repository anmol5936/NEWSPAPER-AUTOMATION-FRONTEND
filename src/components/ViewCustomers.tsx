import React, { useEffect, useState } from 'react';
import { User, Loader, MapPin, Phone, Mail } from 'lucide-react';
import api from '../services/api';

// Update interface to match actual API response
interface Customer {
  _id: string;
  name: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  dues: number;
  paymentHistory: any[];
  pendingSubscriptions: { changes: any[] };
  subscriptions: any[];
  // Add email as optional since it's not in the response
  email?: string;
  // Compute subscriptionStatus based on available data
  subscriptionStatus?: 'active' | 'inactive' | 'pending';
}

interface ApiResponse {
  message: string;
  customers: Customer[];
}

export default function ViewCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.viewCustomers() as ApiResponse;
      console.log('Fetched customers:', response);
      
      // Map the API data to match our expected structure
      const formattedCustomers = response.customers.map(customer => ({
        ...customer,
        id: customer._id, // Map _id to id
        joinDate: customer.createdAt, // Map createdAt to joinDate
        // Set a default subscription status since it's not directly in the data
        subscriptionStatus: customer.subscriptions.length > 0 ? 'active' : 'inactive'
      }));
      
      setCustomers(formattedCustomers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Customer Directory</h2>
      {customers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <div
              key={customer._id} // Use _id instead of id
              className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {customer.name}
                  </h3>
                  <div className="mt-2 space-y-2">
                    {customer.email && ( // Only show email if it exists
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="h-4 w-4 mr-2" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="truncate">{customer.address}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        customer.subscriptionStatus === 'active'
                          ? 'bg-green-100 text-green-800'
                          : customer.subscriptionStatus === 'inactive'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {customer.subscriptionStatus?.charAt(0).toUpperCase() +
                        customer.subscriptionStatus?.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                      Joined {new Date(customer.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No customers found</p>
      )}
    </div>
  );
}