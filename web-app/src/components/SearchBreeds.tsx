import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import { breedsApi } from '../services/api';
import { DogBreed } from '../types';
import { BreedCard } from './BreedCard';
import { LoadingSpinner } from './LoadingSpinner';

export function SearchBreeds() {
  const [query, setQuery] = useState('');
  const [breeds, setBreeds] = useState<DogBreed[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      
      const response = await breedsApi.searchBreeds(query);
      if (response.success && response.data) {
        setBreeds(response.data);
      } else {
        setError(response.error || 'Search failed');
        setBreeds([]);
      }
    } catch (err) {
      setError('Search failed');
      setBreeds([]);
      console.error('Error searching breeds:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/" className="btn-secondary">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Search Breeds</h1>
          <p className="text-gray-600">Find breeds by name, group, or temperament</p>
        </div>
      </div>

      {/* Search */}
      <div className="card">
        <div className="flex gap-2">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for breeds..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="input pl-10"
              />
            </div>
          </div>
          <button 
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Search className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <LoadingSpinner />
      ) : hasSearched ? (
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Search Results
            </h2>
            <p className="text-gray-600">
              Found {breeds.length} breed{breeds.length !== 1 ? 's' : ''} matching "{query}"
            </p>
          </div>

          {breeds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {breeds.map((breed) => (
                <BreedCard
                  key={breed.id}
                  breed={breed}
                  onDelete={() => {
                    setBreeds(breeds.filter(b => b.id !== breed.id));
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No breeds found matching "{query}"</p>
              <p className="text-gray-400 mt-2">Try a different search term</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Enter a search term to find breeds</p>
          <p className="text-gray-400 mt-2">You can search by breed name, group, or temperament</p>
        </div>
      )}
    </div>
  );
} 