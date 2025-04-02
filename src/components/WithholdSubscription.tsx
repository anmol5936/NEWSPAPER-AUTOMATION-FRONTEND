import React, { useState, useEffect } from 'react';
import api, { Customer } from '../services/api';

export default function WithholdSubscription() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [dates, setDates] = useState({
    startDate: '',
    endDate: ''
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/customers`);
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error('Failed to fetch customers:', error);
      }
    };
    fetchCustomers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !dates.startDate || !dates.endDate) return;

    try {
      await api.withholdSubscription({
        customerId: selectedCustomer,
        startDate: dates.startDate,
        endDate: dates.endDate
      });
      setStatus({ type: 'success', message: 'Subscription withheld successfully!' });
      setSelectedCustomer('');
      setDates({ startDate: '', endDate: '' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to withhold subscription' });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Withhold Subscription</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700">Customer</label>
          <select
            required
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select a customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            required
            value={dates.startDate}
            onChange={(e) => setDates({ ...dates, startDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            required
            value={dates.endDate}
            min={dates.startDate}
            onChange={(e) => setDates({ ...dates, endDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Withhold Subscription
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
    </div>
  );
}