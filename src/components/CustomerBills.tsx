import React, { useState, useEffect } from 'react';
import api, { Bill } from '../services/api';
import { Printer } from 'lucide-react';

export default function CustomerBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const data = await api.getBills();
      setBills(data.bills);
      setError(null);
    } catch (err) {
      setError('Failed to fetch bills');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Customer Bills</h2>
        <button
          onClick={handlePrint}
          className="flex items-center px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print Bills
        </button>
      </div>

      <div className="space-y-6">
        {bills.map((bill) => (
          <div key={bill.customerId} className="bg-white shadow rounded-lg p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium">{bill.customerName}</h3>
              <p className="text-sm text-gray-500">Customer ID: {bill.customerId}</p>
            </div>

            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Publication
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Copies
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bill.publications.map((pub, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{pub.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{pub.copies}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${pub.cost.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium" colSpan={2}>
                    Total
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    ${bill.totalCost.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}