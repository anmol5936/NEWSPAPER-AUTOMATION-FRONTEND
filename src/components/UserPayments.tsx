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
                  body { font-family: Arial, sans-serif; padding: 20px; }
                  .receipt { max-width: 400px; margin: 0 auto; }
                  .header { text-align: center; margin-bottom: 20px; }
                  .details { margin-bottom: 20px; }
                  .amount { font-size: 24px; text-align: center; }
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
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Payments</h2>

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

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Make a Payment</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="chequeNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Cheque Number (Optional)
              </label>
              <input
                type="text"
                id="chequeNumber"
                value={chequeNumber}
                onChange={(e) => setChequeNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !amount}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
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

        <div>
          <h3 className="text-lg font-medium mb-4">Payment History</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cheque #
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      ${payment.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {payment.chequeNumber || '-'}
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