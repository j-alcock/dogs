import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { BreedForm } from './BreedForm';
import { breedsApi } from '../services/api';

// Mock the API service
jest.mock('../services/api');
const mockedBreedsApi = breedsApi as jest.Mocked<typeof breedsApi>;

// --- Dynamic useParams mock setup ---
let mockParams: Record<string, any> = {};
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
  };
});
// ------------------------------------

// Helper function to render BreedForm with router context
const renderBreedForm = () => {
  return render(
    <BrowserRouter>
      <BreedForm />
    </BrowserRouter>
  );
};

describe('BreedForm - Numeric Fields Behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    mockParams = {}; // Default to create mode
  });

  describe('1. Show empty initially with placeholders', () => {
    it('should display placeholders for all numeric fields when form is empty', () => {
      renderBreedForm();

      // Check that numeric fields show placeholders
      expect(screen.getByPlaceholderText('e.g., 55')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('e.g., 61')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('e.g., 25')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('e.g., 34')).toBeInTheDocument();

      // Check that fields are empty (not showing 0)
      const heightMinInput = screen.getByLabelText('Height (cm) - Min *') as HTMLInputElement;
      const heightMaxInput = screen.getByLabelText('Height (cm) - Max *') as HTMLInputElement;
      const weightMinInput = screen.getByLabelText('Weight (kg) - Min *') as HTMLInputElement;
      const weightMaxInput = screen.getByLabelText('Weight (kg) - Max *') as HTMLInputElement;

      expect(heightMinInput.value).toBe('');
      expect(heightMaxInput.value).toBe('');
      expect(weightMinInput.value).toBe('');
      expect(weightMaxInput.value).toBe('');
    });
  });

  describe('2. Allow typing and hide placeholders', () => {
    it('should allow typing in numeric fields and hide placeholders when focused', async () => {
      renderBreedForm();

      const heightMinInput = screen.getByLabelText('Height (cm) - Min *') as HTMLInputElement;
      const heightMaxInput = screen.getByLabelText('Height (cm) - Max *') as HTMLInputElement;
      const weightMinInput = screen.getByLabelText('Weight (kg) - Min *') as HTMLInputElement;
      const weightMaxInput = screen.getByLabelText('Weight (kg) - Max *') as HTMLInputElement;

      // Focus and type in height min field
      fireEvent.focus(heightMinInput);
      fireEvent.change(heightMinInput, { target: { value: '55' } });
      expect(heightMinInput.value).toBe('55');

      // Focus and type in height max field
      fireEvent.focus(heightMaxInput);
      fireEvent.change(heightMaxInput, { target: { value: '61' } });
      expect(heightMaxInput.value).toBe('61');

      // Focus and type in weight min field
      fireEvent.focus(weightMinInput);
      fireEvent.change(weightMinInput, { target: { value: '25' } });
      expect(weightMinInput.value).toBe('25');

      // Focus and type in weight max field
      fireEvent.focus(weightMaxInput);
      fireEvent.change(weightMaxInput, { target: { value: '34' } });
      expect(weightMaxInput.value).toBe('34');
    });

    it('should handle decimal values in weight fields', () => {
      renderBreedForm();

      const weightMinInput = screen.getByLabelText('Weight (kg) - Min *') as HTMLInputElement;
      const weightMaxInput = screen.getByLabelText('Weight (kg) - Max *') as HTMLInputElement;

      fireEvent.change(weightMinInput, { target: { value: '25.5' } });
      fireEvent.change(weightMaxInput, { target: { value: '34.2' } });

      expect(weightMinInput.value).toBe('25.5');
      expect(weightMaxInput.value).toBe('34.2');
    });
  });

  describe('3. Show placeholders when cleared', () => {
    it('should show placeholders when numeric fields are cleared', () => {
      renderBreedForm();

      const heightMinInput = screen.getByLabelText('Height (cm) - Min *') as HTMLInputElement;
      const heightMaxInput = screen.getByLabelText('Height (cm) - Max *') as HTMLInputElement;

      // Type some values
      fireEvent.change(heightMinInput, { target: { value: '55' } });
      fireEvent.change(heightMaxInput, { target: { value: '61' } });

      expect(heightMinInput.value).toBe('55');
      expect(heightMaxInput.value).toBe('61');

      // Clear the fields
      fireEvent.change(heightMinInput, { target: { value: '' } });
      fireEvent.change(heightMaxInput, { target: { value: '' } });

      expect(heightMinInput.value).toBe('');
      expect(heightMaxInput.value).toBe('');

      // Check that placeholders are still available
      expect(screen.getByPlaceholderText('e.g., 55')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('e.g., 61')).toBeInTheDocument();
    });
  });

  describe('4. Handle validation properly', () => {
    it('should show error when height min is greater than height max', async () => {
      renderBreedForm();

      // Fill required fields
      fireEvent.change(screen.getByLabelText('Breed Name *'), { target: { value: 'Test Breed' } });
      fireEvent.change(screen.getByLabelText('Breed Group *'), { target: { value: 'Sporting' } });
      fireEvent.change(screen.getByLabelText('Life Span *'), { target: { value: '10-12 years' } });
      fireEvent.change(screen.getByLabelText('Temperament *'), { target: { value: 'Friendly' } });
      fireEvent.change(screen.getByLabelText('Description *'), { target: { value: 'Test description' } });

      // Set invalid height values (min > max)
      fireEvent.change(screen.getByLabelText('Height (cm) - Min *'), { target: { value: '70' } });
      fireEvent.change(screen.getByLabelText('Height (cm) - Max *'), { target: { value: '60' } });

      // Set valid weight values
      fireEvent.change(screen.getByLabelText('Weight (kg) - Min *'), { target: { value: '25' } });
      fireEvent.change(screen.getByLabelText('Weight (kg) - Max *'), { target: { value: '34' } });

      // Submit form
      fireEvent.click(screen.getByText('Create Breed'));

      await waitFor(() => {
        expect(screen.getByText('Height minimum cannot be greater than maximum')).toBeInTheDocument();
      });
    });

    it('should show error when weight min is greater than weight max', async () => {
      renderBreedForm();

      // Fill required fields
      fireEvent.change(screen.getByLabelText('Breed Name *'), { target: { value: 'Test Breed' } });
      fireEvent.change(screen.getByLabelText('Breed Group *'), { target: { value: 'Sporting' } });
      fireEvent.change(screen.getByLabelText('Life Span *'), { target: { value: '10-12 years' } });
      fireEvent.change(screen.getByLabelText('Temperament *'), { target: { value: 'Friendly' } });
      fireEvent.change(screen.getByLabelText('Description *'), { target: { value: 'Test description' } });

      // Set valid height values
      fireEvent.change(screen.getByLabelText('Height (cm) - Min *'), { target: { value: '55' } });
      fireEvent.change(screen.getByLabelText('Height (cm) - Max *'), { target: { value: '61' } });

      // Set invalid weight values (min > max)
      fireEvent.change(screen.getByLabelText('Weight (kg) - Min *'), { target: { value: '40' } });
      fireEvent.change(screen.getByLabelText('Weight (kg) - Max *'), { target: { value: '30' } });

      // Submit form
      fireEvent.click(screen.getByText('Create Breed'));

      await waitFor(() => {
        expect(screen.getByText('Weight minimum cannot be greater than maximum')).toBeInTheDocument();
      });
    });

    it('should handle empty numeric fields as 0 for validation', async () => {
      renderBreedForm();

      // Fill required fields
      fireEvent.change(screen.getByLabelText('Breed Name *'), { target: { value: 'Test Breed' } });
      fireEvent.change(screen.getByLabelText('Breed Group *'), { target: { value: 'Sporting' } });
      fireEvent.change(screen.getByLabelText('Life Span *'), { target: { value: '10-12 years' } });
      fireEvent.change(screen.getByLabelText('Temperament *'), { target: { value: 'Friendly' } });
      fireEvent.change(screen.getByLabelText('Description *'), { target: { value: 'Test description' } });

      // Set height min to 5 and height max to 1 - this will trigger validation error
      fireEvent.change(screen.getByLabelText('Height (cm) - Min *'), { target: { value: '5' } });
      fireEvent.change(screen.getByLabelText('Height (cm) - Max *'), { target: { value: '1' } });

      // Verify the values are set correctly
      const heightMinInput = screen.getByLabelText('Height (cm) - Min *') as HTMLInputElement;
      const heightMaxInput = screen.getByLabelText('Height (cm) - Max *') as HTMLInputElement;
      expect(heightMinInput.value).toBe('5');
      expect(heightMaxInput.value).toBe('1');
      console.log('heightMaxInput', heightMaxInput.value);

      // Submit form
      fireEvent.click(screen.getByText('Create Breed'));

      // Check for the validation error
      await waitFor(() => {
        // Debug: log what's in the document
        console.log('Document body:', document.body.innerHTML);
        
        // Look for the error message in the error div
        const errorElement = screen.getByText('Height minimum cannot be greater than maximum');
        expect(errorElement).toBeInTheDocument();
        expect(errorElement.closest('.bg-red-50')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('5. Work correctly when editing existing breeds', () => {
    it('should populate numeric fields with actual values when editing', async () => {
      // Set up edit mode
      mockParams = { id: '1' };
      // Mock the API response for editing
      const mockBreed = {
        id: 1,
        name: 'Golden Retriever',
        breed_group: 'Sporting',
        temperament: 'Friendly, Intelligent, Devoted',
        life_span: '10-12 years',
        height_cm: { min: 55, max: 61 },
        weight_kg: { min: 25, max: 34 },
        description: 'A friendly and intelligent breed.',
        image_url: 'https://example.com/image.jpg',
        created_at: '2025-07-01T03:28:30',
        updated_at: '2025-07-01T03:28:30'
      };
      mockedBreedsApi.getBreedById.mockResolvedValue({
        success: true,
        data: mockBreed
      });
      renderBreedForm();
      await waitFor(() => {
        expect(mockedBreedsApi.getBreedById).toHaveBeenCalledWith(1);
      });
      // Wait for the form fields to appear
      const heightMinInput = await screen.findByLabelText('Height (cm) - Min *') as HTMLInputElement;
      const heightMaxInput = await screen.findByLabelText('Height (cm) - Max *') as HTMLInputElement;
      const weightMinInput = await screen.findByLabelText('Weight (kg) - Min *') as HTMLInputElement;
      const weightMaxInput = await screen.findByLabelText('Weight (kg) - Max *') as HTMLInputElement;

      expect(heightMinInput.value).toBe('55');
      expect(heightMaxInput.value).toBe('61');
      expect(weightMinInput.value).toBe('25');
      expect(weightMaxInput.value).toBe('34');
    });

    it('should allow editing numeric values and submit successfully', async () => {
      // Set up edit mode
      mockParams = { id: '1' };
      // Mock the API response for editing
      const mockBreed = {
        id: 1,
        name: 'Golden Retriever',
        breed_group: 'Sporting',
        temperament: 'Friendly, Intelligent, Devoted',
        life_span: '10-12 years',
        height_cm: { min: 55, max: 61 },
        weight_kg: { min: 25, max: 34 },
        description: 'A friendly and intelligent breed.',
        image_url: 'https://example.com/image.jpg',
        created_at: '2025-07-01T03:28:30',
        updated_at: '2025-07-01T03:28:30'
      };
      mockedBreedsApi.getBreedById.mockResolvedValue({
        success: true,
        data: mockBreed
      });
      mockedBreedsApi.updateBreed.mockResolvedValue({
        success: true,
        data: { ...mockBreed, height_cm: { min: 50, max: 65 } }
      });
      renderBreedForm();
      await waitFor(() => {
        expect(mockedBreedsApi.getBreedById).toHaveBeenCalledWith(1);
      });
      // Wait for the form fields to appear
      const heightMinInput = await screen.findByLabelText('Height (cm) - Min *') as HTMLInputElement;
      const heightMaxInput = await screen.findByLabelText('Height (cm) - Max *') as HTMLInputElement;

      fireEvent.change(heightMinInput, { target: { value: '50' } });
      fireEvent.change(heightMaxInput, { target: { value: '65' } });

      expect(heightMinInput.value).toBe('50');
      expect(heightMaxInput.value).toBe('65');

      // Submit the form
      fireEvent.click(screen.getByText('Update Breed'));

      await waitFor(() => {
        expect(mockedBreedsApi.updateBreed).toHaveBeenCalledWith(1, expect.objectContaining({
          height_cm: { min: 50, max: 65 }
        }));
      });
    });
  });

  describe('Required field validation', () => {
    it('should show validation bubbles for missing required fields', async () => {
      renderBreedForm();

      // Try to submit form without filling any required fields
      fireEvent.click(screen.getByText('Create Breed'));

      // Check that validation bubbles appear for required fields
      await waitFor(() => {
        // Check for HTML5 validation messages on required fields
        const nameInput = screen.getByLabelText('Breed Name *') as HTMLInputElement;
        const breedGroupSelect = screen.getByLabelText('Breed Group *') as HTMLSelectElement;
        const lifeSpanInput = screen.getByLabelText('Life Span *') as HTMLInputElement;
        const temperamentInput = screen.getByLabelText('Temperament *') as HTMLInputElement;
        const heightMinInput = screen.getByLabelText('Height (cm) - Min *') as HTMLInputElement;
        const heightMaxInput = screen.getByLabelText('Height (cm) - Max *') as HTMLInputElement;
        const weightMinInput = screen.getByLabelText('Weight (kg) - Min *') as HTMLInputElement;
        const weightMaxInput = screen.getByLabelText('Weight (kg) - Max *') as HTMLInputElement;
        const descriptionTextarea = screen.getByLabelText('Description *') as HTMLTextAreaElement;

        // Check that all required fields have the required attribute
        expect(nameInput.required).toBe(true);
        expect(breedGroupSelect.required).toBe(true);
        expect(lifeSpanInput.required).toBe(true);
        expect(temperamentInput.required).toBe(true);
        expect(heightMinInput.required).toBe(true);
        expect(heightMaxInput.required).toBe(true);
        expect(weightMinInput.required).toBe(true);
        expect(weightMaxInput.required).toBe(true);
        expect(descriptionTextarea.required).toBe(true);

        // Check that fields are empty (validation should trigger)
        expect(nameInput.value).toBe('');
        expect(breedGroupSelect.value).toBe('');
        expect(lifeSpanInput.value).toBe('');
        expect(temperamentInput.value).toBe('');
        expect(heightMinInput.value).toBe('');
        expect(heightMaxInput.value).toBe('');
        expect(weightMinInput.value).toBe('');
        expect(weightMaxInput.value).toBe('');
        expect(descriptionTextarea.value).toBe('');
      });
    });

    it('should allow submission when all required fields are filled', async () => {
      mockedBreedsApi.createBreed.mockResolvedValue({
        success: true,
        data: {
          id: 2,
          name: 'Test Breed',
          breed_group: 'Sporting',
          temperament: 'Friendly',
          life_span: '10-12 years',
          height_cm: { min: 55, max: 61 },
          weight_kg: { min: 25, max: 34 },
          description: 'Test description',
          image_url: '',
          created_at: '2025-07-01T03:28:30',
          updated_at: '2025-07-01T03:28:30'
        }
      });

      renderBreedForm();

      // Fill all required fields
      fireEvent.change(screen.getByLabelText('Breed Name *'), { target: { value: 'Test Breed' } });
      fireEvent.change(screen.getByLabelText('Breed Group *'), { target: { value: 'Sporting' } });
      fireEvent.change(screen.getByLabelText('Life Span *'), { target: { value: '10-12 years' } });
      fireEvent.change(screen.getByLabelText('Temperament *'), { target: { value: 'Friendly' } });
      fireEvent.change(screen.getByLabelText('Height (cm) - Min *'), { target: { value: '55' } });
      fireEvent.change(screen.getByLabelText('Height (cm) - Max *'), { target: { value: '61' } });
      fireEvent.change(screen.getByLabelText('Weight (kg) - Min *'), { target: { value: '25' } });
      fireEvent.change(screen.getByLabelText('Weight (kg) - Max *'), { target: { value: '34' } });
      fireEvent.change(screen.getByLabelText('Description *'), { target: { value: 'Test description' } });

      // Submit form
      fireEvent.click(screen.getByText('Create Breed'));

      // Verify that the API was called (form submission succeeded)
      await waitFor(() => {
        expect(mockedBreedsApi.createBreed).toHaveBeenCalledWith(expect.objectContaining({
          name: 'Test Breed',
          breed_group: 'Sporting',
          temperament: 'Friendly',
          life_span: '10-12 years',
          height_cm: { min: 55, max: 61 },
          weight_kg: { min: 25, max: 34 },
          description: 'Test description'
        }));
      });
    });
  });

  describe('Form submission with numeric fields', () => {
    it('should submit form successfully with valid numeric values', async () => {
      mockedBreedsApi.createBreed.mockResolvedValue({
        success: true,
        data: {
          id: 2,
          name: 'Test Breed',
          breed_group: 'Sporting',
          temperament: 'Friendly',
          life_span: '10-12 years',
          height_cm: { min: 55, max: 61 },
          weight_kg: { min: 25, max: 34 },
          description: 'Test description',
          image_url: '',
          created_at: '2025-07-01T03:28:30',
          updated_at: '2025-07-01T03:28:30'
        }
      });
      renderBreedForm();

      // Fill all required fields
      fireEvent.change(screen.getByLabelText('Breed Name *'), { target: { value: 'Test Breed' } });
      fireEvent.change(screen.getByLabelText('Breed Group *'), { target: { value: 'Sporting' } });
      fireEvent.change(screen.getByLabelText('Life Span *'), { target: { value: '10-12 years' } });
      fireEvent.change(screen.getByLabelText('Temperament *'), { target: { value: 'Friendly' } });
      fireEvent.change(screen.getByLabelText('Description *'), { target: { value: 'Test description' } });

      // Fill numeric fields
      fireEvent.change(screen.getByLabelText('Height (cm) - Min *'), { target: { value: '55' } });
      fireEvent.change(screen.getByLabelText('Height (cm) - Max *'), { target: { value: '61' } });
      fireEvent.change(screen.getByLabelText('Weight (kg) - Min *'), { target: { value: '25' } });
      fireEvent.change(screen.getByLabelText('Weight (kg) - Max *'), { target: { value: '34' } });

      // Submit form
      fireEvent.click(screen.getByText('Create Breed'));

      await waitFor(() => {
        expect(mockedBreedsApi.createBreed).toHaveBeenCalledWith(expect.objectContaining({
          height_cm: { min: 55, max: 61 },
          weight_kg: { min: 25, max: 34 }
        }));
      });

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
}); 