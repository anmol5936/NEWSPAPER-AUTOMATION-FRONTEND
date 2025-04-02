import React, { useEffect, useState } from 'react';
import { Book, Loader } from 'lucide-react';
import api from '../services/api'; // Adjust the import path as needed

interface Publication {
  id: string;
  name: string;
  price: number;
  language: string;
  description?: string;
}

export default function ViewPublications() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const response = await api.getAllPublications();
      // Extract the publications array from the response
      setPublications(response.publications || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch publications');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Available Publications</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publications.map((publication) => (
          <div
            key={publication.id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start">
              <Book className="h-8 w-8 text-blue-500 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{publication.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{publication.language}</p>
                <p className="text-lg font-medium text-blue-600 mt-2">
                  ${publication.price.toFixed(2)}
                </p>
                {publication.description && (
                  <p className="text-sm text-gray-600 mt-2">{publication.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}