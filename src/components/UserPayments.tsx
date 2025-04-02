import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface Payment {
  date: string;
  amount: number;
  chequeNumber?: string;
}

export default function UserPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [amount, setAmount] = useState('');
  const [chequeNumber, setChequeNumber] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/payments');
      const data = await response.json();
      setPayments(data.payments);
    } catch (err) {
      setError('Failed to load payment history');
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
      const response = await fetch('http://localhost:5000/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          amount: parseFloat(amount),
          chequeNumber: chequeNumber || undefined
        })
      });

      if (response.ok) {
        const receipt = await response.json();
        setSuccess('Payment processed successfully');
        setAmount('');
        setChequeNumber('');
        await fetchPayments();
        // Print receipt
        const receiptWindow = window.open('', '_blank');
        if (receiptWindow) {
          receiptWindow.document.write(`
            <html>
              <head>
                <title>Payment Receipt</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; color: #384959; }
                  .receipt { max-width: 400px; margin: 0 auto; }
                  .header { text-align: center; margin-bottom: 20px; }
                  .details { margin-bottom: 20px; }
                  .amount { font-size: 24px; text-align: center; color: #6A89A7; }
                </style>
              </head>
              <body>
                <div class="receipt">
                  <div class="header">
                    <h1>Payment Receipt</h1>
                    <p>Date: ${new Date().toLocaleDateString()}</p>
                  </div>
                  <div class="details">
                    <p>Amount: $${amount}</p>
                    ${chequeNumber ? `<p>Cheque Number: ${chequeNumber}</p>` : ''}
                    <p>Transaction ID: ${receipt.transactionId}</p>
                  </div>
                  <div class="amount">
                    <strong>Paid: $${amount}</strong>
                  </div>
                </div>
              </body>
            </html>
          `);
          receiptWindow.document.close();
          receiptWindow.print();
        }
      } else {
        setError('Failed to process payment');
      }
    } catch (err) {
      setError('Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  if (loading && payments.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-[#6A89A7]" size={24} />
      </div>
    );
  }

  return (
    <div className="bg-[#BDDDFC] bg-opacity-20 p-6 rounded-xl">
      <h2 className="text-2xl font-semibold text-[#384959] flex items-center mb-6">
        <span className="bg-[#6A89A7] w-1 h-8 rounded mr-3"></span>
        Payments
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

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-[#384959] mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#88BDF2] rounded mr-2"></span>
            Make a Payment
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-[#384959] mb-1">
                Amount ($)
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
                required
                className="w-full px-4 py-2.5 border border-[#88BDF2] rounded-lg focus:ring-2 focus:ring-[#6A89A7] focus:ring-opacity-30 focus:border-[#6A89A7] transition-all duration-200"
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label htmlFor="chequeNumber" className="block text-sm font-medium text-[#384959] mb-1">
                Cheque Number (Optional)
              </label>
              <input
                type="text"
                id="chequeNumber"
                value={chequeNumber}
                onChange={(e) => setChequeNumber(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#88BDF2] rounded-lg focus:ring-2 focus:ring-[#6A89A7] focus:ring-opacity-30 focus:border-[#6A89A7] transition-all duration-200"
                placeholder="Enter cheque number"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !amount}
              className="w-full py-2.5 px-4 bg-[#6A89A7] text-white rounded-lg hover:bg-[#384959] focus:outline-none focus:ring-2 focus:ring-[#6A89A7] focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  Processing...
                </span>
              ) : (
                'Submit Payment'
              )}
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-[#384959] mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#88BDF2] rounded mr-2"></span>
            Payment History
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#6A89A7] bg-opacity-10">
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#384959] uppercase tracking-wider border-b border-[#BDDDFC]">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#384959] uppercase tracking-wider border-b border-[#BDDDFC]">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#384959] uppercase tracking-wider border-b border-[#BDDDFC]">
                    Cheque #
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#BDDDFC] divide-opacity-50">
                {payments.map((payment, index) => (
                  <tr key={index} className="hover:bg-[#BDDDFC] hover:bg-opacity-5 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-[#384959]">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-[#384959] font-medium bg-[#88BDF2] bg-opacity-10 px-2.5 py-1 rounded-full">
                        ${payment.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-[#384959]">
                      {payment.chequeNumber || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-[#384959] bg-[#88BDF2] bg-opacity-10 p-4 rounded-lg">
        <p className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#6A89A7] rounded-full"></span>
          A receipt will be generated automatically after successful payment processing.
        </p>
      </div>
    </div>
  );
}
