import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { breedsApi } from '../services/api';
import { BreedFormData } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

const breedGroups = [
  'Sporting', 'Hound', 'Working', 'Terrier', 'Toy', 'Non-Sporting', 'Herding'
];

export function BreedForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<BreedFormData>({
    name: '',
    breed_group: '',
    temperament: '',
    life_span: '',
    height_min: '' as any,
    height_max: '' as any,
    weight_min: '' as any,
    weight_max: '' as any,
    description: '',
    image_url: ''
  });

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing && id) {
      const fetchBreed = async () => {
        try {
          setLoading(true);
          const response = await breedsApi.getBreedById(parseInt(id));
          if (response.success && response.data) {
            const breed = response.data;
            setFormData({
              name: breed.name,
              breed_group: breed.breed_group,
              temperament: breed.temperament,
              life_span: breed.life_span,
              height_min: breed.height_cm.min,
              height_max: breed.height_cm.max,
              weight_min: breed.weight_kg.min,
              weight_max: breed.weight_kg.max,
              description: breed.description,
              image_url: breed.image_url || ''
            });
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
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const heightMin = Number(formData.height_min) || 0;
    const heightMax = Number(formData.height_max) || 0;
    const weightMin = Number(formData.weight_min) || 0;
    const weightMax = Number(formData.weight_max) || 0;

    if (heightMin > heightMax) {
      setError('Height minimum cannot be greater than maximum');
      return;
    }
    if (weightMin > weightMax) {
      setError('Weight minimum cannot be greater than maximum');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const breedData = {
        name: formData.name,
        breed_group: formData.breed_group,
        temperament: formData.temperament,
        life_span: formData.life_span,
        height_cm: {
          min: Number(formData.height_min) || 0,
          max: Number(formData.height_max) || 0
        },
        weight_kg: {
          min: Number(formData.weight_min) || 0,
          max: Number(formData.weight_max) || 0
        },
        description: formData.description,
        image_url: formData.image_url || undefined
      };

      let response;
      if (isEditing && id) {
        response = await breedsApi.updateBreed(parseInt(id), breedData);
      } else {
        response = await breedsApi.createBreed(breedData);
      }

      if (response.success) {
        navigate('/');
      } else {
        let backendError = 'Failed to save breed';
        if (response.error) {
          backendError = response.error;
        }
        setError(backendError);
      }
    } catch (err: any) {
      let backendError = 'Failed to save breed';
      if (err.response && err.response.data && err.response.data.error) {
        backendError = err.response.data.error;
      }
      setError(backendError);
      console.error('Error saving breed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('min') || name.includes('max') ? (value === '' ? '' : parseFloat(value) || 0) : value
    }));
  };

  if (loading && isEditing) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/" className="btn-secondary">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Breed' : 'Add New Breed'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Update breed information' : 'Create a new dog breed'}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="card space-y-6" data-testid="breed-form">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Breed Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="input"
              placeholder="e.g., Golden Retriever"
              data-testid="name"
            />
          </div>

          {/* Breed Group */}
          <div>
            <label htmlFor="breed_group" className="block text-sm font-medium text-gray-700 mb-2">
              Breed Group *
            </label>
            <select
              id="breed_group"
              name="breed_group"
              value={formData.breed_group}
              onChange={handleInputChange}
              required
              className="input"
              data-testid="breed_group"
            >
              <option value="">Select a group</option>
              {breedGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          {/* Life Span */}
          <div>
            <label htmlFor="life_span" className="block text-sm font-medium text-gray-700 mb-2">
              Life Span *
            </label>
            <input
              type="text"
              id="life_span"
              name="life_span"
              value={formData.life_span}
              onChange={handleInputChange}
              required
              className="input"
              placeholder="e.g., 10-12 years"
              data-testid="life_span"
            />
          </div>

          {/* Temperament */}
          <div className="md:col-span-2">
            <label htmlFor="temperament" className="block text-sm font-medium text-gray-700 mb-2">
              Temperament *
            </label>
            <input
              type="text"
              id="temperament"
              name="temperament"
              value={formData.temperament}
              onChange={handleInputChange}
              required
              className="input"
              placeholder="e.g., Friendly, Intelligent, Devoted"
              data-testid="temperament"
            />
          </div>

          {/* Height */}
          <div>
            <label htmlFor="height_min" className="block text-sm font-medium text-gray-700 mb-2">
              Height (cm) - Min *
            </label>
            <input
              type="number"
              id="height_min"
              name="height_min"
              value={formData.height_min || ''}
              onChange={handleInputChange}
              required
              min="1"
              max="200"
              className="input"
              placeholder="e.g., 55"
              data-testid="height_min"
            />
          </div>

          <div>
            <label htmlFor="height_max" className="block text-sm font-medium text-gray-700 mb-2">
              Height (cm) - Max *
            </label>
            <input
              type="number"
              id="height_max"
              name="height_max"
              value={formData.height_max || ''}
              onChange={handleInputChange}
              required
              min="1"
              max="200"
              className="input"
              placeholder="e.g., 61"
              data-testid="height_max"
            />
          </div>

          {/* Weight */}
          <div>
            <label htmlFor="weight_min" className="block text-sm font-medium text-gray-700 mb-2">
              Weight (kg) - Min *
            </label>
            <input
              type="number"
              id="weight_min"
              name="weight_min"
              value={formData.weight_min || ''}
              onChange={handleInputChange}
              required
              min="0.1"
              max="200"
              step="0.1"
              className="input"
              placeholder="e.g., 25"
              data-testid="weight_min"
            />
          </div>

          <div>
            <label htmlFor="weight_max" className="block text-sm font-medium text-gray-700 mb-2">
              Weight (kg) - Max *
            </label>
            <input
              type="number"
              id="weight_max"
              name="weight_max"
              value={formData.weight_max || ''}
              onChange={handleInputChange}
              required
              min="0.1"
              max="200"
              step="0.1"
              className="input"
              placeholder="e.g., 34"
              data-testid="weight_max"
            />
          </div>

          {/* Image URL */}
          <div className="md:col-span-2">
            <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              className="input"
              placeholder="https://example.com/image.jpg"
              data-testid="image_url"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="input"
              placeholder="Describe the breed's characteristics, history, and personality..."
              data-testid="description"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <Link to="/" className="btn-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary inline-flex items-center"
            data-testid="submit-breed-btn"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isEditing ? 'Update Breed' : 'Create Breed'}
          </button>
        </div>
      </form>
    </div>
  );
} 