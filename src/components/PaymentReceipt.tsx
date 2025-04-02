import React, { useState, useEffect } from 'react';
import api, { Customer } from '../services/api';
import { Printer } from 'lucide-react';

export default function PaymentReceipt() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [formData, setFormData] = useState({
    customerId: '',
    amount: '',
    chequeNumber: ''
  });
  const [receipt, setReceipt] = useState<string | null>(null);
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
    if (!formData.customerId || !formData.amount) return;

    try {
      const response = await api.recordPayment({
        customerId: formData.customerId,
        amount: Number(formData.amount),
        ...(formData.chequeNumber && { chequeNumber: formData.chequeNumber })
      });
      setReceipt(response.receipt);
      setStatus({ type: 'success', message: 'Payment recorded successfully!' });
      setFormData({ customerId: '', amount: '', chequeNumber: '' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to record payment' });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Record Payment</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer</label>
            <select
              required
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
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
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cheque Number (Optional)</label>
            <input
              type="text"
              value={formData.chequeNumber}
              onChange={(e) => setFormData({ ...formData, chequeNumber: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Record Payment
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

        {receipt && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Payment Receipt</h3>
              <button
                onClick={handlePrint}
                className="flex items-center px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Receipt
              </button>
            </div>
            <div
              className="prose prose-sm"
              dangerouslySetInnerHTML={{ __html: receipt }}
            />
          </div>
        )}
      </div>
    </div>
  );
}