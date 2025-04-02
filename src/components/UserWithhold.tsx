import React, { useState } from 'react';
import { Loader2, Calendar } from 'lucide-react';

export default function UserWithhold() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch('http://localhost:5000/api/user/withhold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          startDate,
          endDate
        })
      });

      if (response.ok) {
        setSuccess('Delivery withhold request submitted successfully');
        setStartDate('');
        setEndDate('');
      } else {
        setError('Failed to submit withhold request');
      }
    } catch (err) {
      setError('Failed to submit withhold request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#BDDDFC] bg-opacity-20 p-6 rounded-xl max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold text-[#384959] flex items-center mb-6">
        <span className="bg-[#6A89A7] w-1 h-8 rounded mr-3"></span>
        Request Delivery Withhold
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

      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-[#384959] mb-2 flex items-center">
              <Calendar size={16} className="mr-2 text-[#6A89A7]" />
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
              className="w-full px-4 py-2.5 border border-[#88BDF2] rounded-lg focus:ring-2 focus:ring-[#6A89A7] focus:ring-opacity-30 focus:border-[#6A89A7] transition-all duration-200"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-[#384959] mb-2 flex items-center">
              <Calendar size={16} className="mr-2 text-[#6A89A7]" />
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || new Date().toISOString().split('T')[0]}
              required
              className="w-full px-4 py-2.5 border border-[#88BDF2] rounded-lg focus:ring-2 focus:ring-[#6A89A7] focus:ring-opacity-30 focus:border-[#6A89A7] transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !startDate || !endDate}
            className="w-full py-2.5 px-4 bg-[#6A89A7] text-white rounded-lg hover:bg-[#384959] focus:outline-none focus:ring-2 focus:ring-[#6A89A7] focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={16} />
                Submitting...
              </span>
            ) : (
              'Submit Request'
            )}
          </button>
        </form>
      </div>

      <div className="mt-6 text-sm text-[#384959] bg-[#88BDF2] bg-opacity-10 p-4 rounded-lg">
        <p className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#6A89A7] rounded-full"></span>
          Please submit your withhold request at least 24 hours in advance.
        </p>
      </div>
    </div>
  );
}