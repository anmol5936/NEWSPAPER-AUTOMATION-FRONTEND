import React, { useState } from 'react';
import { Newspaper, Users, FileText, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import AddPublication from '../components/AddPublication';
import EditPublication from '../components/EditPublication';
import AddCustomer from '../components/AddCustomer';
import EditCustomer from '../components/EditCustomer';
import DeliverySummary from '../components/DeliverySummary';
import CustomerBills from '../components/CustomerBills';
import WithholdSubscription from '../components/WithholdSubscription';
import PaymentReceipt from '../components/PaymentReceipt';
import { useAuth } from '../hooks/useAuth';

export function ManagerDashboard() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('publications');

  const tabs = [
    { id: 'publications', label: 'Publications', icon: Newspaper },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'summary', label: 'Delivery Summary', icon: TrendingUp },
    { id: 'bills', label: 'Bills', icon: FileText },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'withhold', label: 'Withhold', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Newspaper className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-semibold text-gray-900">Manager Dashboard</span>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={logout}
                className="ml-4 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-md ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          {activeTab === 'publications' && (
            <div className="space-y-8">
              <AddPublication />
              <EditPublication />
            </div>
          )}
          {activeTab === 'customers' && (
            <div className="space-y-8">
              <AddCustomer />
              <EditCustomer />
            </div>
          )}
          {activeTab === 'summary' && <DeliverySummary />}
          {activeTab === 'bills' && <CustomerBills />}
          {activeTab === 'payments' && <PaymentReceipt />}
          {activeTab === 'withhold' && <WithholdSubscription />}
        </div>
      </div>
    </div>
  );
}