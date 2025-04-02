import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface Subscription {
  id: string;
  name: string;
  price: number;
}

export default function UserSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<string[]>([]);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/subscriptions');
      const data = await response.json();
      setSubscriptions(data.subscriptions);
      setSelectedSubscriptions(data.subscriptions.map((s: Subscription) => s.id));
    } catch (err) {
      setError('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch('http://localhost:5000/api/user/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          subscriptions: selectedSubscriptions
        })
      });

      if (response.ok) {
        setSuccess('Subscription changes requested successfully. Changes will take effect in 7 days.');
      } else {
        setError('Failed to update subscriptions');
      }
    } catch (err) {
      setError('Failed to update subscriptions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Current Subscriptions</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Publication
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Select
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subscriptions.map((subscription) => (
              <tr key={subscription.id}>
                <td className="px-6 py-4 whitespace-nowrap">{subscription.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${subscription.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedSubscriptions.includes(subscription.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSubscriptions([...selectedSubscriptions, subscription.id]);
                      } else {
                        setSelectedSubscriptions(
                          selectedSubscriptions.filter((id) => id !== subscription.id)
                        );
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-500 mb-4">
          Note: Subscription changes will take effect after 7 days from the request date.
        </p>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={16} />
              Updating...
            </span>
          ) : (
            'Update Subscriptions'
          )}
        </button>
      </div>
    </div>
  );
}