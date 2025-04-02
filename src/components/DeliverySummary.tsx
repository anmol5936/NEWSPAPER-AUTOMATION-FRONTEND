import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Printer } from 'lucide-react';

interface DeliverySummaryData {
  customers: Array<{
    name: string;
    publicationsDelivered: number;
  }>;
}

export default function DeliverySummary() {
  const [summary, setSummary] = useState<DeliverySummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const data = await api.getDeliverySummary();
      setSummary(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch delivery summary');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="text-center text-custom-dark-blue">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-custom-dark-blue">Monthly Delivery Summary</h2>
        <button
          onClick={handlePrint}
          className="flex items-center px-4 py-2 text-sm text-white bg-custom-blue-gray hover:opacity-90 rounded-md transition-opacity duration-200"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print Summary
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-custom-blue-gray">
          <thead className="bg-custom-light-blue bg-opacity-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-custom-dark-blue uppercase tracking-wider">
                Customer Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-custom-dark-blue uppercase tracking-wider">
                Publications Delivered
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-custom-blue-gray">
            {summary?.customers.map((customer, index) => (
              <tr key={index} className="hover:bg-custom-light-blue hover:bg-opacity-25 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-custom-dark-blue">{customer.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-custom-dark-blue">{customer.publicationsDelivered}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}