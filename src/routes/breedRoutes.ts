import { Router } from 'express';
import { BreedController } from '../controllers/breedController';

export function createBreedRoutes(breedController: BreedController): Router {
  const router = Router();

  /**
   * @swagger
   * /api/breeds/search:
   *   get:
   *     summary: Search breeds by query
   *     description: Search for dog breeds by name, breed group, or temperament
   *     tags: [Breeds]
   *     parameters:
   *       - $ref: '#/components/parameters/SearchQuery'
   *     responses:
   *       200:
   *         description: Successful search results
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/DogBreed'
   *                     message:
   *                       type: string
   *                       example: "Found 1 breeds matching \"golden\""
   *       400:
   *         description: Bad request - missing or invalid query parameter
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.get('/search', breedController.searchBreeds);

  /**
   * @swagger
   * /api/breeds:
   *   get:
   *     summary: Get all breeds with pagination
   *     description: Retrieve a paginated list of all dog breeds
   *     tags: [Breeds]
   *     parameters:
   *       - $ref: '#/components/parameters/Page'
   *       - $ref: '#/components/parameters/Limit'
   *     responses:
   *       200:
   *         description: Successful response with paginated breeds
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PaginatedResponse'
   *       400:
   *         description: Bad request - invalid pagination parameters
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.get('/', breedController.getAllBreeds);

  /**
   * @swagger
   * /api/breeds/{id}:
   *   get:
   *     summary: Get breed by ID
   *     description: Retrieve a specific dog breed by its unique identifier
   *     tags: [Breeds]
   *     parameters:
   *       - $ref: '#/components/parameters/BreedId'
   *     responses:
   *       200:
   *         description: Successful response with breed data
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/DogBreed'
   *       404:
   *         description: Breed not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.get('/:id', breedController.getBreedById);

  /**
   * @swagger
   * /api/breeds:
   *   post:
   *     summary: Create a new breed
   *     description: Create a new dog breed with the provided information
   *     tags: [Breeds]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateDogBreedRequest'
   *           example:
   *             name: "Border Collie"
   *             breed_group: "Herding"
   *             temperament: "Intelligent, Energetic, Responsive"
   *             life_span: "12-15 years"
   *             height_cm:
   *               min: 46
   *               max: 56
   *             weight_kg:
   *               min: 14
   *               max: 20
   *             description: "The Border Collie is a working and herding dog breed."
   *             image_url: "https://example.com/border-collie.jpg"
   *     responses:
   *       201:
   *         description: Breed created successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/DogBreed'
   *                     message:
   *                       type: string
   *                       example: "Breed created successfully"
   *       400:
   *         description: Bad request - validation errors
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       409:
   *         description: Conflict - breed name already exists
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.post('/', BreedController.validateCreateBreed, breedController.createBreed);

  /**
   * @swagger
   * /api/breeds/{id}:
   *   put:
   *     summary: Update an existing breed
   *     description: Update a dog breed with the provided information (partial updates supported)
   *     tags: [Breeds]
   *     parameters:
   *       - $ref: '#/components/parameters/BreedId'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: Updated breed name
   *                 example: "Updated Golden Retriever"
   *               breed_group:
   *                 type: string
   *                 enum: ['Sporting', 'Hound', 'Working', 'Terrier', 'Toy', 'Non-Sporting', 'Herding']
   *                 description: Updated breed group
   *               temperament:
   *                 type: string
   *                 description: Updated temperament
   *               life_span:
   *                 type: string
   *                 description: Updated life span
   *               height_cm:
   *                 type: object
   *                 properties:
   *                   min:
   *                     type: number
   *                   max:
   *                     type: number
   *               weight_kg:
   *                 type: object
   *                 properties:
   *                   min:
   *                     type: number
   *                   max:
   *                     type: number
   *               description:
   *                 type: string
   *                 description: Updated breed description
   *               image_url:
   *                 type: string
   *                 format: uri
   *                 description: Updated image URL
   *           example:
   *             name: "Updated Golden Retriever"
   *             description: "Updated description for the Golden Retriever"
   *     responses:
   *       200:
   *         description: Breed updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/DogBreed'
   *                     message:
   *                       type: string
   *                       example: "Breed updated successfully"
   *       400:
   *         description: Bad request - validation errors
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       404:
   *         description: Breed not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       409:
   *         description: Conflict - breed name already exists
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.put('/:id', BreedController.validateUpdateBreed, breedController.updateBreed);

  /**
   * @swagger
   * /api/breeds/{id}:
   *   delete:
   *     summary: Delete a breed
   *     description: Delete a dog breed by its unique identifier
   *     tags: [Breeds]
   *     parameters:
   *       - $ref: '#/components/parameters/BreedId'
   *     responses:
   *       200:
   *         description: Breed deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     message:
   *                       type: string
   *                       example: "Breed deleted successfully"
   *       404:
   *         description: Breed not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.delete('/:id', breedController.deleteBreed);

  return router;
} 