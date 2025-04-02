import React, { useState } from 'react';
import api from '../services/api';

export default function AddPublication() {
  const [formData, setFormData] = useState({
    name: '',
    language: '',
    description: '',
    price: ''
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addPublication({
        ...formData,
        price: Number(formData.price)
      });
      setStatus({ type: 'success', message: 'Publication added successfully!' });
      setFormData({ name: '', language: '', description: '', price: '' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to add publication' });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-custom-dark-blue">Add New Publication</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-custom-dark-blue">Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-custom-blue-gray shadow-sm focus:border-custom-medium-blue focus:ring-custom-medium-blue sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-custom-dark-blue">Language</label>
          <input
            type="text"
            required
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            className="mt-1 block w-full rounded-md border-custom-blue-gray shadow-sm focus:border-custom-medium-blue focus:ring-custom-medium-blue sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-custom-dark-blue">Description</label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-custom-blue-gray shadow-sm focus:border-custom-medium-blue focus:ring-custom-medium-blue sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-custom-dark-blue">Price</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="mt-1 block w-full rounded-md border-custom-blue-gray shadow-sm focus:border-custom-medium-blue focus:ring-custom-medium-blue sm:text-sm"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-custom-blue-gray hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-medium-blue transition-opacity duration-200"
          >
            Add Publication
          </button>
        </div>
        {status && (
          <div
            className={`mt-2 p-2 rounded ${
              status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {status.message}
          </div>
        )}
      </form>
    </div>
  );
}