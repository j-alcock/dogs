import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { DogBreed } from '../types';

interface BreedCardProps {
  breed: DogBreed;
  onDelete: (id: number) => void;
}

export function BreedCard({ breed, onDelete }: BreedCardProps) {
  return (
    <div className="card hover:shadow-md transition-shadow duration-200" data-testid="breed-card">
      {/* Image */}
      <div className="aspect-w-16 aspect-h-9 mb-4">
        {breed.image_url ? (
          <Link to={`/breeds/${breed.id}`} tabIndex={-1} aria-label={`View details for ${breed.name}`} data-testid="breed-image-link">
            <img
              src={breed.image_url}
              alt={breed.name}
              className="w-full h-48 object-cover rounded-t hover:opacity-80 transition-opacity"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/400x300?text=No+Image';
              }}
            />
          </Link>
        ) : (
          <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">No image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div>
          <Link to={`/breeds/${breed.id}`} className="hover:underline focus:underline outline-none" data-testid="breed-name-link">
            <h3 className="text-xl font-semibold text-gray-900 inline">{breed.name}</h3>
          </Link>
          <p className="text-sm text-gray-500">{breed.breed_group}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600 line-clamp-2">{breed.description}</p>
          
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {breed.temperament.split(',')[0].trim()}
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {breed.life_span}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Height:</span>
              <span className="ml-1 font-medium">
                {breed.height_cm.min}-{breed.height_cm.max} cm
              </span>
            </div>
            <div>
              <span className="text-gray-500">Weight:</span>
              <span className="ml-1 font-medium">
                {breed.weight_kg.min}-{breed.weight_kg.max} kg
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
          <Link
            to={`/breeds/${breed.id}`}
            className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Link
            to={`/breeds/${breed.id}/edit`}
            className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
            title="Edit breed"
            data-testid="edit-breed-btn"
          >
            <Edit className="h-4 w-4" />
          </Link>
          <button
            onClick={() => onDelete(breed.id)}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete breed"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
} 