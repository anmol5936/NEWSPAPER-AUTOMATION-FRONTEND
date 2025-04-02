import React, { useState } from 'react';

const DeliveryStatusUpdate = ({ deliveries, updateDeliveryStatus }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Today's Deliveries</h2>
      <ul>
        {deliveries.map((delivery) => (
          <DeliveryItem key={delivery.id} delivery={delivery} updateDeliveryStatus={updateDeliveryStatus} />
        ))}
      </ul>
    </div>
  );
};

const DeliveryItem = ({ delivery, updateDeliveryStatus }) => {
  const [status, setStatus] = useState(delivery.status || 'pending');
  const [reason, setReason] = useState('');

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    if (newStatus === 'not_delivered' && reason.trim() === '') {
      alert('Please provide a reason for non-delivery.');
      return;
    }
    updateDeliveryStatus(delivery.id, newStatus, reason);
  };

  return (
    <li className="flex items-center justify-between border-b py-3">
      <div>
        <p className="text-lg font-medium">{delivery.customerName}</p>
        <p className="text-sm text-gray-500">{delivery.address}</p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          className={`px-4 py-2 rounded-md text-white ${status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}
          onClick={() => handleStatusChange('delivered')}
        >
          Delivered
        </button>
        <button
          className={`px-4 py-2 rounded-md text-white ${status === 'not_delivered' ? 'bg-red-500' : 'bg-gray-300'}`}
          onClick={() => handleStatusChange('not_delivered')}
        >
          Not Delivered
        </button>
        {status === 'not_delivered' && (
          <input
            type="text"
            placeholder="Reason..."
            className="border px-2 py-1 rounded"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        )}
      </div>
    </li>
  );
};

export default DeliveryStatusUpdate;
