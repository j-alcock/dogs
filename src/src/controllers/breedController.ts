import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { DatabaseService } from '../database';
import { DogBreed, CreateDogBreedRequest, ApiResponse, PaginatedResponse } from '../types';

export class BreedController {
  private dbService: DatabaseService;

  constructor(dbService: DatabaseService) {
    this.dbService = dbService;
  }

  // Validation middleware
  public static validateCreateBreed = [
    body('name').isString().trim().isLength({ min: 1, max: 100 }).withMessage('Name is required and must be 1-100 characters'),
    body('breed_group').isString().trim().isLength({ min: 1, max: 50 }).withMessage('Breed group is required and must be 1-50 characters'),
    body('temperament').isString().trim().isLength({ min: 1, max: 200 }).withMessage('Temperament is required and must be 1-200 characters'),
    body('life_span').isString().trim().isLength({ min: 1, max: 50 }).withMessage('Life span is required and must be 1-50 characters'),
    body('height_cm.min').isInt({ min: 1, max: 200 }).withMessage('Height min must be between 1-200 cm'),
    body('height_cm.max').isInt({ min: 1, max: 200 }).withMessage('Height max must be between 1-200 cm'),
    body('weight_kg.min').isFloat({ min: 0.1, max: 200 }).withMessage('Weight min must be between 0.1-200 kg'),
    body('weight_kg.max').isFloat({ min: 0.1, max: 200 }).withMessage('Weight max must be between 0.1-200 kg'),
    body('description').isString().trim().isLength({ min: 10, max: 1000 }).withMessage('Description is required and must be 10-1000 characters'),
    body('image_url').optional().isURL().withMessage('Image URL must be a valid URL')
  ];

  public static validateUpdateBreed = [
    body('name').optional().isString().trim().isLength({ min: 1, max: 100 }).withMessage('Name must be 1-100 characters'),
    body('breed_group').optional().isString().trim().isLength({ min: 1, max: 50 }).withMessage('Breed group must be 1-50 characters'),
    body('temperament').optional().isString().trim().isLength({ min: 1, max: 200 }).withMessage('Temperament must be 1-200 characters'),
    body('life_span').optional().isString().trim().isLength({ min: 1, max: 50 }).withMessage('Life span must be 1-50 characters'),
    body('height_cm.min').optional().isInt({ min: 1, max: 200 }).withMessage('Height min must be between 1-200 cm'),
    body('height_cm.max').optional().isInt({ min: 1, max: 200 }).withMessage('Height max must be between 1-200 cm'),
    body('weight_kg.min').optional().isFloat({ min: 0.1, max: 200 }).withMessage('Weight min must be between 0.1-200 kg'),
    body('weight_kg.max').optional().isFloat({ min: 0.1, max: 200 }).withMessage('Weight max must be between 0.1-200 kg'),
    body('description').optional().isString().trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
    body('image_url').optional().isURL().withMessage('Image URL must be a valid URL')
  ];

  // Get all breeds with pagination
  public getAllBreeds = async (req: Request, res: Response): Promise<void> => {
    try {
      const pageRaw = req.query.page as string;
      const limitRaw = req.query.limit as string;
      
      // Parse page parameter
      let page = 1;
      if (pageRaw !== undefined) {
        if (pageRaw === '') {
          const response: ApiResponse<null> = {
            success: false,
            error: 'Invalid pagination parameters. Page must be >= 1, limit must be 1-100'
          };
          res.status(400).json(response);
          return;
        }
        const pageNum = parseInt(pageRaw);
        if (isNaN(pageNum) || pageNum < 1) {
          const response: ApiResponse<null> = {
            success: false,
            error: 'Invalid pagination parameters. Page must be >= 1, limit must be 1-100'
          };
          res.status(400).json(response);
          return;
        }
        page = pageNum;
      }
      
      // Parse limit parameter
      let limit = 10;
      if (limitRaw !== undefined) {
        if (limitRaw === '') {
          const response: ApiResponse<null> = {
            success: false,
            error: 'Invalid pagination parameters. Page must be >= 1, limit must be 1-100'
          };
          res.status(400).json(response);
          return;
        }
        const limitNum = parseInt(limitRaw);
        if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
          const response: ApiResponse<null> = {
            success: false,
            error: 'Invalid pagination parameters. Page must be >= 1, limit must be 1-100'
          };
          res.status(400).json(response);
          return;
        }
        limit = limitNum;
      }

      const result = await this.dbService.getAllBreeds(page, limit);
      const totalPages = Math.ceil(result.total / limit);

      const response: PaginatedResponse<DogBreed> = {
        success: true,
        data: result.breeds,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages
        }
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error getting all breeds:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Internal server error'
      };
      res.status(500).json(response);
    }
  };

  // Get breed by ID
  public getBreedById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id || '0');
      
      if (isNaN(id) || id < 1) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Invalid breed ID'
        };
        res.status(400).json(response);
        return;
      }

      const breed = await this.dbService.getBreedById(id);
      
      if (!breed) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Breed not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<DogBreed> = {
        success: true,
        data: breed
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error getting breed by ID:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Internal server error'
      };
      res.status(500).json(response);
    }
  };

  // Create new breed
  public createBreed = async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Validation failed',
          message: errors.array().map(err => err.msg).join(', ')
        };
        res.status(400).json(response);
        return;
      }

      const breedData: CreateDogBreedRequest = req.body;

      // Validate height and weight ranges
      if (breedData.height_cm.min > breedData.height_cm.max) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Height min cannot be greater than height max'
        };
        res.status(400).json(response);
        return;
      }

      if (breedData.weight_kg.min > breedData.weight_kg.max) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Weight min cannot be greater than weight max'
        };
        res.status(400).json(response);
        return;
      }

      const breed = await this.dbService.createBreed(breedData);
      
      const response: ApiResponse<DogBreed> = {
        success: true,
        data: breed,
        message: 'Breed created successfully'
      };

      res.status(201).json(response);
    } catch (error: any) {
      console.error('Error creating breed:', error);
      
      let errorMessage = 'Internal server error';
      if (error.message && error.message.includes('UNIQUE constraint failed')) {
        errorMessage = 'A breed with this name already exists';
      }

      const response: ApiResponse<null> = {
        success: false,
        error: errorMessage
      };
      res.status(500).json(response);
    }
  };

  // Update breed
  public updateBreed = async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Validation failed',
          message: errors.array().map(err => err.msg).join(', ')
        };
        res.status(400).json(response);
        return;
      }

      const id = parseInt(req.params.id || '0');
      
      if (isNaN(id) || id < 1) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Invalid breed ID'
        };
        res.status(400).json(response);
        return;
      }

      const breedData = req.body;

      // Validate height and weight ranges if provided
      if (breedData.height_cm && breedData.height_cm.min > breedData.height_cm.max) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Height min cannot be greater than height max'
        };
        res.status(400).json(response);
        return;
      }

      if (breedData.weight_kg && breedData.weight_kg.min > breedData.weight_kg.max) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Weight min cannot be greater than weight max'
        };
        res.status(400).json(response);
        return;
      }

      const updatedBreed = await this.dbService.updateBreed(id, breedData);
      
      if (!updatedBreed) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Breed not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<DogBreed> = {
        success: true,
        data: updatedBreed,
        message: 'Breed updated successfully'
      };

      res.status(200).json(response);
    } catch (error: any) {
      console.error('Error updating breed:', error);
      
      let errorMessage = 'Internal server error';
      if (error.message && error.message.includes('UNIQUE constraint failed')) {
        errorMessage = 'A breed with this name already exists';
      }

      const response: ApiResponse<null> = {
        success: false,
        error: errorMessage
      };
      res.status(500).json(response);
    }
  };

  // Delete breed
  public deleteBreed = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id || '0');
      
      if (isNaN(id) || id < 1) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Invalid breed ID'
        };
        res.status(400).json(response);
        return;
      }

      const deleted = await this.dbService.deleteBreed(id);
      
      if (!deleted) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Breed not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<null> = {
        success: true,
        message: 'Breed deleted successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error deleting breed:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Internal server error'
      };
      res.status(500).json(response);
    }
  };

  // Search breeds
  public searchBreeds = async (req: Request, res: Response): Promise<void> => {
    try {
      const query = req.query.q as string;
      
      if (!query || query.trim().length === 0) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Search query is required'
        };
        res.status(400).json(response);
        return;
      }

      const breeds = await this.dbService.searchBreeds(query.trim());
      
      const response: ApiResponse<DogBreed[]> = {
        success: true,
        data: breeds,
        message: `Found ${breeds.length} breeds matching "${query}"`
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error searching breeds:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Internal server error'
      };
      res.status(500).json(response);
    }
  };
} 