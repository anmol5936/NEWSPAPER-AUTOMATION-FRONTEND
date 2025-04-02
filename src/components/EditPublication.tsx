import React, { useState, useEffect } from 'react';
import api, { Publication } from '../services/api';

export default function EditPublication() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [selectedPublication, setSelectedPublication] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    language: '',
    description: '',
    price: ''
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/publications`);
        const data = await response.json();
        setPublications(data);
      } catch (error) {
        console.error('Failed to fetch publications:', error);
      }
    };
    fetchPublications();
  }, []);

  const handlePublicationSelect = (id: string) => {
    const publication = publications.find(p => p.id === id);
    if (publication) {
      setSelectedPublication(id);
      setFormData({
        name: publication.name,
        language: publication.language,
        description: publication.description,
        price: publication.price.toString()
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPublication) return;

    try {
      await api.editPublication(selectedPublication, {
        ...formData,
        price: Number(formData.price)
      });
      setStatus({ type: 'success', message: 'Publication updated successfully!' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to update publication' });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-custom-dark-blue">Edit Publication</h2>
      <div className="max-w-lg">
        <select
          className="block w-full rounded-md border-custom-blue-gray shadow-sm focus:border-custom-medium-blue focus:ring-custom-medium-blue sm:text-sm mb-4 bg-white"
          value={selectedPublication}
          onChange={(e) => handlePublicationSelect(e.target.value)}
        >
          <option value="">Select a publication</option>
          {publications.map((pub) => (
            <option key={pub.id} value={pub.id}>
              {pub.name}
            </option>
          ))}
        </select>

        {selectedPublication && (
          <form onSubmit={handleSubmit} className="space-y-4">
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
                Update Publication
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
        )}
      </div>
    </div>
  );
}