export interface DogBreed {
  id: number;
  name: string;
  breed_group: string;
  temperament: string;
  life_span: string;
  height_cm: {
    min: number;
    max: number;
  };
  weight_kg: {
    min: number;
    max: number;
  };
  description: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDogBreedRequest {
  name: string;
  breed_group: string;
  temperament: string;
  life_span: string;
  height_cm: {
    min: number;
    max: number;
  };
  weight_kg: {
    min: number;
    max: number;
  };
  description: string;
  image_url?: string;
}

export interface UpdateDogBreedRequest extends Partial<CreateDogBreedRequest> {
  id: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BreedFormData {
  name: string;
  breed_group: string;
  temperament: string;
  life_span: string;
  height_min: number;
  height_max: number;
  weight_min: number;
  weight_max: number;
  description: string;
  image_url: string;
} 