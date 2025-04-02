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
        <Loader2 className="animate-spin text-[#6A89A7]" size={24} />
      </div>
    );
  }

  return (
    <div className="bg-[#BDDDFC] bg-opacity-20 p-6 rounded-xl">
      <h2 className="text-2xl font-semibold mb-6 text-[#384959] flex items-center">
        <span className="bg-[#6A89A7] w-1 h-8 rounded mr-3"></span>
        Current Subscriptions
      </h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg border border-green-100">
          {success}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg shadow-md bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#6A89A7] bg-opacity-10">
              <th className="px-6 py-3 text-left text-xs font-medium text-[#384959] uppercase tracking-wider">
                Publication
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#384959] uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#384959] uppercase tracking-wider">
                Select
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#BDDDFC] divide-opacity-50">
            {subscriptions.map((subscription) => (
              <tr key={subscription.id} className="hover:bg-[#BDDDFC] hover:bg-opacity-5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-[#384959]">{subscription.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-[#384959]">
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
                    className="h-4 w-4 text-[#6A89A7] focus:ring-[#88BDF2] border-[#88BDF2] rounded transition-colors"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <p className="text-sm text-[#384959] mb-4 bg-[#88BDF2] bg-opacity-10 p-3 rounded-lg">
          Note: Subscription changes will take effect after 7 days from the request date.
        </p>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2.5 bg-[#6A89A7] text-white rounded-lg hover:bg-[#384959] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#6A89A7] focus:ring-offset-2 shadow-sm hover:shadow-md"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
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
