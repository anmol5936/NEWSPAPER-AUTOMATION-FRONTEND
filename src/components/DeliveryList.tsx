import React, { useState, useEffect } from 'react';
import api, { DeliveryItem } from '../services/api';
import { Printer } from 'lucide-react';

export default function DeliveryList() {
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const data = await api.getDeliveryList();
      setDeliveries(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch delivery list');
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
        <h2 className="text-xl font-semibold">Today's Delivery List</h2>
        <button
          onClick={handlePrint}
          className="flex items-center px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print List
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Publications
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {deliveries.map((delivery, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-pre-wrap">{delivery.address}</td>
                <td className="px-6 py-4">
                  <ul className="list-disc list-inside">
                    {delivery.publications.map((pub, pubIndex) => (
                      <li key={pubIndex}>{pub.name}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}