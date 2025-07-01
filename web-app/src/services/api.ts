import axios from 'axios';
import { 
  DogBreed, 
  CreateDogBreedRequest, 
  ApiResponse, 
  PaginatedResponse 
} from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const breedsApi = {
  // Get all breeds with pagination
  getAllBreeds: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<DogBreed>> => {
    const response = await api.get(`/breeds?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get breed by ID
  getBreedById: async (id: number): Promise<ApiResponse<DogBreed>> => {
    const response = await api.get(`/breeds/${id}`);
    return response.data;
  },

  // Create new breed
  createBreed: async (breedData: CreateDogBreedRequest): Promise<ApiResponse<DogBreed>> => {
    const response = await api.post('/breeds', breedData);
    return response.data;
  },

  // Update breed
  updateBreed: async (id: number, breedData: Partial<CreateDogBreedRequest>): Promise<ApiResponse<DogBreed>> => {
    const response = await api.put(`/breeds/${id}`, breedData);
    return response.data;
  },

  // Delete breed
  deleteBreed: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/breeds/${id}`);
    return response.data;
  },

  // Search breeds
  searchBreeds: async (query: string): Promise<ApiResponse<DogBreed[]>> => {
    const response = await api.get(`/breeds/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};

export default api; 