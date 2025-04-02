import React, { useState, useEffect } from 'react';
import api, { Customer, Publication } from '../services/api';

export default function EditCustomer() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    subscriptions: [] as string[]
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersResponse, publicationsResponse] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/customers`),
          fetch(`${import.meta.env.VITE_API_URL}/publications`)
        ]);
        const customersData = await customersResponse.json();
        const publicationsData = await publicationsResponse.json();
        setCustomers(customersData);
        setPublications(publicationsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  const handleCustomerSelect = (id: string) => {
    const customer = customers.find(c => c.id === id);
    if (customer) {
      setSelectedCustomer(id);
      setFormData({
        name: customer.name,
        address: customer.address,
        phone: customer.phone,
        subscriptions: customer.subscriptions
      });
    }
  };

  const handleSubscriptionChange = (pubId: string) => {
    setFormData(prev => ({
      ...prev,
      subscriptions: prev.subscriptions.includes(pubId)
        ? prev.subscriptions.filter(id => id !== pubId)
        : [...prev.subscriptions, pubId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    try {
      await api.editCustomer(selectedCustomer, formData);
      setStatus({ type: 'success', message: 'Customer updated successfully!' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to update customer' });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Edit Customer</h2>
      <div className="max-w-lg">
        <select
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mb-4"
          value={selectedCustomer}
          onChange={(e) => handleCustomerSelect(e.target.value)}
        >
          <option value="">Select a customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>

        {selectedCustomer && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subscriptions</label>
              <div className="space-y-2">
                {publications.map((pub) => (
                  <label key={pub.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.subscriptions.includes(pub.id)}
                      onChange={() => handleSubscriptionChange(pub.id)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{pub.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Update Customer
              </button>
            </div>
            {status && (
              <div
                className={`mt-2 p-2 rounded ${
                  status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}
              >
                {status.message}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}