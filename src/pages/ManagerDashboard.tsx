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
    <div className="min-h-screen" style={{ backgroundColor: '#BDDDFC' }}>
      <nav style={{ backgroundColor: '#384959' }} className="shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Newspaper className="h-8 w-8 text-white" />
                <span className="ml-2 text-xl font-semibold text-white">Manager Dashboard</span>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={logout}
                className="ml-4 px-4 py-2 text-sm text-white hover:opacity-80 rounded-md"
                style={{ backgroundColor: '#6A89A7' }}
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
                className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-white hover:opacity-80'
                }`}
                style={{
                  backgroundColor: activeTab === tab.id ? '#88BDF2' : '#6A89A7'
                }}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="shadow rounded-lg p-6" style={{ backgroundColor: '#FFFFFF' }}>
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

export default ManagerDashboard