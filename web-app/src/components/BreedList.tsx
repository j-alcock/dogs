import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { breedsApi } from '../services/api';
import { DogBreed } from '../types';
import { BreedCard } from './BreedCard';
import { LoadingSpinner } from './LoadingSpinner';

export function BreedList() {
  const [breeds, setBreeds] = useState<DogBreed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBreeds = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await breedsApi.getAllBreeds(pageNum, 12);
      if (response.success && response.data) {
        setBreeds(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
      } else {
        setError(response.error || 'Failed to fetch breeds');
      }
    } catch (err) {
      setError('Failed to fetch breeds');
      console.error('Error fetching breeds:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchBreeds(1);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await breedsApi.searchBreeds(searchQuery);
      if (response.success && response.data) {
        setBreeds(response.data);
        setTotalPages(1);
      } else {
        setError(response.error || 'Search failed');
      }
    } catch (err) {
      setError('Search failed');
      console.error('Error searching breeds:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this breed?')) {
      return;
    }

    try {
      const response = await breedsApi.deleteBreed(id);
      if (response.success) {
        setBreeds(breeds.filter(breed => breed.id !== id));
      } else {
        setError(response.error || 'Failed to delete breed');
      }
    } catch (err) {
      setError('Failed to delete breed');
      console.error('Error deleting breed:', err);
    }
  };

  useEffect(() => {
    fetchBreeds(page);
  }, [page]);

  if (loading && breeds.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dog Breeds</h1>
          <p className="text-gray-600 mt-1">Discover and manage dog breeds</p>
        </div>
        <Link
          to="/breeds/new"
          className="btn-primary inline-flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Breed</span>
        </Link>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search breeds..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="input pl-10"
            />
          </div>
        </div>
        <button onClick={handleSearch} className="btn-primary">
          Search
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Breeds Grid */}
      {breeds.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {breeds.map((breed) => (
            <BreedCard
              key={breed.id}
              breed={breed}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : !loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No breeds found</p>
        </div>
      ) : null}

      {/* Pagination */}
      {totalPages > 1 && !searchQuery && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
} 