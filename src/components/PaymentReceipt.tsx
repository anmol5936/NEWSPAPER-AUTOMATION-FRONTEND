import React, { useState, useEffect } from 'react';
import api, { Customer } from '../services/api';
import { Printer, Loader } from 'lucide-react';

// Define expected response types
interface PaymentReceiptData {
  receiptNumber: string;
  customerName: string;
  amount: number;
  chequeNumber: string;
  date: string;
}

interface ApiResponse {
  message: string;
  customers?: Customer[];
  receipt?: PaymentReceiptData;
}

export default function PaymentReceipt() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    customerId: '',
    amount: '',
    chequeNumber: ''
  });
  const [receipt, setReceipt] = useState<PaymentReceiptData | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await api.viewCustomers();
        const customerData = Array.isArray(response) 
          ? response 
          : (response as ApiResponse).customers || [];
        setCustomers(customerData);
      } catch (error) {
        console.error('Failed to fetch customers:', error);
        setStatus({ type: 'error', message: 'Failed to load customers' });
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId || !formData.amount) {
      setStatus({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }

    try {
      const response = await api.recordPayment({
        customerId: formData.customerId,
        amount: Number(formData.amount),
        ...(formData.chequeNumber && { chequeNumber: formData.chequeNumber })
      }) as ApiResponse;
      
      setReceipt(response.receipt || null);
      setStatus({ type: 'success', message: 'Payment recorded successfully!' });
      setFormData({ customerId: '', amount: '', chequeNumber: '' });
    } catch (error: any) {
      setStatus({ 
        type: 'error', 
        message: error.message || 'Failed to record payment' 
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

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
              {customers.length > 0 && customers.map((customer) => (
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
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-custom-blue-gray hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-medium-blue transition-opacity duration-200"
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
            <div className="prose prose-sm">
              <p>Receipt Number: {receipt.receiptNumber}</p>
              <p>Customer: {receipt.customerName}</p>
              <p>Amount: ${receipt.amount}</p>
              <p>Cheque Number: {receipt.chequeNumber}</p>
              <p>Date: {new Date(receipt.date).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}