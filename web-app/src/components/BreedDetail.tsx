import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Calendar, Ruler, Weight } from 'lucide-react';
import { breedsApi } from '../services/api';
import { DogBreed } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

export function BreedDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [breed, setBreed] = useState<DogBreed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBreed = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await breedsApi.getBreedById(parseInt(id));
        if (response.success && response.data) {
          setBreed(response.data);
        } else {
          setError(response.error || 'Breed not found');
        }
      } catch (err) {
        setError('Failed to fetch breed');
        console.error('Error fetching breed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBreed();
  }, [id]);

  const handleDelete = async () => {
    if (!breed || !confirm('Are you sure you want to delete this breed?')) {
      return;
    }

    try {
      const response = await breedsApi.deleteBreed(breed.id);
      if (response.success) {
        navigate('/');
      } else {
        setError(response.error || 'Failed to delete breed');
      }
    } catch (err) {
      setError('Failed to delete breed');
      console.error('Error deleting breed:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !breed) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">{error || 'Breed not found'}</p>
        <Link to="/" className="btn-primary mt-4 inline-block">
          Back to Breeds
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="btn-secondary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{breed.name}</h1>
            <p className="text-gray-600">{breed.breed_group}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link to={`/breeds/${breed.id}/edit`} className="btn-primary">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
          <button onClick={handleDelete} className="btn-danger">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div>
          {breed.image_url ? (
            <img
              src={breed.image_url}
              alt={breed.name}
              className="w-full h-64 object-cover rounded"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/600x400?text=No+Image';
              }}
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-lg">No image available</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">{breed.description}</p>
          </div>

          {/* Characteristics */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Characteristics</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-500">Life Span</p>
                  <p className="font-medium">{breed.life_span}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Ruler className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-500">Height</p>
                  <p className="font-medium">{breed.height_cm.min}-{breed.height_cm.max} cm</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Weight className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="font-medium">{breed.weight_kg.min}-{breed.weight_kg.max} kg</p>
                </div>
              </div>
            </div>
          </div>

          {/* Temperament */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Temperament</h2>
            <div className="flex flex-wrap gap-2">
              {breed.temperament.split(',').map((trait, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                >
                  {trait.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500 space-y-1">
              <p>Created: {new Date(breed.created_at).toLocaleDateString()}</p>
              <p>Last updated: {new Date(breed.updated_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 