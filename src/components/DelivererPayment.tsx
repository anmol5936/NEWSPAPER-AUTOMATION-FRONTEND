import React, { useState, useEffect } from 'react';
import api, { DelivererPayment as Payment } from '../services/api';
import { Printer } from 'lucide-react';

export default function DelivererPayment() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const data = await api.getDelivererPayments();
      setPayments(data.payments);
      setError(null);
    } catch (err) {
      setError('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#BDDDFC] bg-opacity-20 flex items-center justify-center">
        <div className="text-[#384959] text-lg animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#BDDDFC] bg-opacity-20 flex items-center justify-center">
        <div className="text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-200">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#BDDDFC] bg-opacity-20 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-[#384959]">Payment History</h2>
              <p className="text-[#6A89A7] text-sm mt-1">View and manage your payment records</p>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center px-5 py-2.5 text-sm text-white bg-[#6A89A7] rounded-lg hover:bg-[#384959] transition-colors duration-200 ease-in-out shadow-sm hover:shadow-md"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print History
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#BDDDFC]">
            <table className="min-w-full divide-y divide-[#BDDDFC]">
              <thead className="bg-[#BDDDFC] bg-opacity-30">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#384959] uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#384959] uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#BDDDFC]">
                {payments.map((payment, index) => (
                  <tr 
                    key={index}
                    className="hover:bg-[#BDDDFC] hover:bg-opacity-10 transition-colors duration-150 ease-in-out"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-[#384959]">
                      {payment.period}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-[#6A89A7]">
                        ${payment.amount.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}