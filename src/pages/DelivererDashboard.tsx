import React, { useState } from 'react';
import { Newspaper, DollarSign } from 'lucide-react';
import DeliveryList from '../components/DeliveryList';
import DelivererPayment from '../components/DelivererPayment';
import DeliveryStatusUpdate from '../components/DeliveryStatusUpdate';
import { useAuth } from '../hooks/useAuth';

export function DelivererDashboard() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('deliveries');

  const tabs = [
    { id: 'deliveries', label: 'Deliveries', icon: Newspaper },
    { id: 'payments', label: 'Payments', icon: DollarSign }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Newspaper className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-semibold text-gray-900">Deliverer Dashboard</span>
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
        <div className="flex space-x-4 mb-6">
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
          {activeTab === 'deliveries' && <DeliveryList />}
          {activeTab === 'payments' && <DelivererPayment />}
          {activeTab === 'updatestatus' && <DeliveryStatusUpdate />}
        </div>
      </div>
    </div>
  );
}