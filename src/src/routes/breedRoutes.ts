import { Router } from 'express';
import { BreedController } from '../controllers/breedController';

export function createBreedRoutes(breedController: BreedController): Router {
  const router = Router();

  // GET /api/breeds/search - Search breeds (must come before /:id)
  router.get('/search', breedController.searchBreeds);

  // GET /api/breeds - Get all breeds with pagination
  router.get('/', breedController.getAllBreeds);

  // GET /api/breeds/:id - Get breed by ID
  router.get('/:id', breedController.getBreedById);

  // POST /api/breeds - Create new breed
  router.post('/', BreedController.validateCreateBreed, breedController.createBreed);

  // PUT /api/breeds/:id - Update breed
  router.put('/:id', BreedController.validateUpdateBreed, breedController.updateBreed);

  // DELETE /api/breeds/:id - Delete breed
  router.delete('/:id', breedController.deleteBreed);

  return router;
} 