import React, { useState } from 'react';
import { LogOut, NewspaperIcon, Receipt, CreditCard, PauseCircle } from 'lucide-react';
import UserSubscriptions from '../components/UserSubscriptions';
import UserBills from '../components/UserBills';
import UserPayments from '../components/UserPayments';
import UserWithhold from '../components/UserWithhold';
import { useAuth } from '../hooks/useAuth'; // Add this import

type Tab = 'subscriptions' | 'bills' | 'payments' | 'withhold';

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('subscriptions');
  const { user, logout } = useAuth(); // Use auth context
  const username = user?.username || 'User'; // Use user from auth context

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold">Welcome, {username}</h1>
          <button
            onClick={logout} // Use logout from useAuth
            className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 px-4">
        {/* Tabs */}
        <div className="flex space-x-1 border-b border-gray-200 mb-6">
          <TabButton
            icon={<NewspaperIcon size={18} />}
            label="My Subscriptions"
            isActive={activeTab === 'subscriptions'}
            onClick={() => setActiveTab('subscriptions')}
          />
          <TabButton
            icon={<Receipt size={18} />}
            label="My Bills"
            isActive={activeTab === 'bills'}
            onClick={() => setActiveTab('bills')}
          />
          <TabButton
            icon={<CreditCard size={18} />}
            label="Payments"
            isActive={activeTab === 'payments'}
            onClick={() => setActiveTab('payments')}
          />
          <TabButton
            icon={<PauseCircle size={18} />}
            label="Withhold Delivery"
            isActive={activeTab === 'withhold'}
            onClick={() => setActiveTab('withhold')}
          />
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'subscriptions' && <UserSubscriptions />}
          {activeTab === 'bills' && <UserBills />}
          {activeTab === 'payments' && <UserPayments />}
          {activeTab === 'withhold' && <UserWithhold />}
        </div>
      </div>
    </div>
  );
}

// TabButton remains unchanged
function TabButton({ icon, label, isActive, onClick }: {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 font-medium text-sm rounded-t-lg transition-colors
        ${isActive
          ? 'text-blue-600 border-b-2 border-blue-600 bg-white -mb-px'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
    >
      {icon}
      {label}
    </button>
  );
}