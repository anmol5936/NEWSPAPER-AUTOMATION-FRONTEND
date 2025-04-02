import React, { useState, useEffect } from 'react';
import { Loader2, Printer } from 'lucide-react';

interface Publication {
  name: string;
  copies: number;
}

interface Bill {
  month: string;
  publications: Publication[];
  totalCost: number;
}

export default function UserBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/bills');
      const data = await response.json();
      setBills(data.bills);
    } catch (err) {
      setError('Failed to load bills');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-[#6A89A7]" size={24} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-[#BDDDFC] bg-opacity-20 p-6 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[#384959] flex items-center">
          <span className="bg-[#6A89A7] w-1 h-8 rounded mr-3"></span>
          Monthly Bills
        </h2>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#384959] rounded-lg hover:bg-[#6A89A7] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#6A89A7] focus:ring-offset-2"
        >
          <Printer size={18} />
          Print Bills
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#6A89A7] bg-opacity-10">
              <th className="px-6 py-3.5 text-left text-xs font-medium text-[#384959] uppercase tracking-wider border-b border-[#BDDDFC] border-opacity-50">
                Month
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-medium text-[#384959] uppercase tracking-wider border-b border-[#BDDDFC] border-opacity-50">
                Publications
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-medium text-[#384959] uppercase tracking-wider border-b border-[#BDDDFC] border-opacity-50">
                Copies
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-medium text-[#384959] uppercase tracking-wider border-b border-[#BDDDFC] border-opacity-50">
                Total Cost
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#BDDDFC] divide-opacity-50">
            {bills.map((bill, index) => (
              <tr key={index} className="hover:bg-[#BDDDFC] hover:bg-opacity-5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-[#384959] font-medium">
                  {bill.month}
                </td>
                <td className="px-6 py-4">
                  <ul className="space-y-1">
                    {bill.publications.map((pub, i) => (
                      <li key={i} className="text-[#384959]">{pub.name}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4">
                  <ul className="space-y-1">
                    {bill.publications.map((pub, i) => (
                      <li key={i} className="text-[#384959] font-medium">{pub.copies}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-[#384959] font-semibold bg-[#88BDF2] bg-opacity-10 px-3 py-1 rounded-full">
                    ${bill.totalCost.toFixed(2)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-sm text-[#384959] bg-[#88BDF2] bg-opacity-10 p-4 rounded-lg">
        <p className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#6A89A7] rounded-full"></span>
          Print your bills for record keeping or reimbursement purposes.
        </p>
      </div>
    </div>
  );
}
