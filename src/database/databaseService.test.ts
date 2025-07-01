import { DatabaseService } from './index';
import { CreateDogBreedRequest } from '../types';
import tmp from 'tmp';
import fs from 'fs';

describe('DatabaseService', () => {
  let dbService: DatabaseService;
  let tmpFile: tmp.FileResult;
  let dbFile: string;

  beforeEach(async () => {
    tmpFile = tmp.fileSync({ postfix: '.sqlite' });
    dbFile = tmpFile.name;
    console.log('Using temp DB file:', dbFile);
    dbService = new DatabaseService({ filename: dbFile });
    // Wait for table creation and seeding
    await new Promise((resolve) => setTimeout(resolve, 300));
  });

  afterAll(async () => {
    if (dbService) {
      console.log('Closing DB connection');
      await dbService.close();
    }
    if (tmpFile) {
      console.log('Removing temp DB file');
      try { fs.unlinkSync(dbFile); } catch (e) { /* ignore */ }
    }
  });

  it('should get all breeds with pagination', async () => {
    const { breeds, total } = await dbService.getAllBreeds(1, 2);
    expect(Array.isArray(breeds)).toBe(true);
    expect(typeof total).toBe('number');
    expect(breeds.length).toBeLessThanOrEqual(2);
  });

  it('should get a breed by id', async () => {
    const { breeds } = await dbService.getAllBreeds(1, 1);
    expect(breeds.length).toBeGreaterThan(0);
    const breedId = breeds[0]?.id;
    expect(typeof breedId).toBe('number');
    const breed = await dbService.getBreedById(breedId!);
    expect(breed).toBeTruthy();
    expect(breed?.id).toBe(breedId);
  });

  it('should return null for non-existent breed id', async () => {
    const breed = await dbService.getBreedById(9999);
    expect(breed).toBeNull();
  });

  it('should create a new breed', async () => {
    const newBreed: CreateDogBreedRequest = {
      name: 'Test Breed',
      breed_group: 'Test Group',
      temperament: 'Friendly',
      life_span: '10-12 years',
      height_cm: { min: 50, max: 60 },
      weight_kg: { min: 20, max: 30 },
      description: 'A test breed for testing purposes',
      image_url: 'https://example.com/test.jpg',
    };
    const created = await dbService.createBreed(newBreed);
    expect(created.name).toBe('Test Breed');
    expect(created.id).toBeDefined();
  });

  it('should update an existing breed', async () => {
    const { breeds } = await dbService.getAllBreeds(1, 1);
    expect(breeds.length).toBeGreaterThan(0);
    const breedId = breeds[0]?.id;
    expect(typeof breedId).toBe('number');
    const updated = await dbService.updateBreed(breedId!, { name: 'Updated Name' });
    expect(updated).toBeTruthy();
    expect(updated?.name).toBe('Updated Name');
  });

  it('should return null when updating non-existent breed', async () => {
    const updated = await dbService.updateBreed(9999, { name: 'Nope' });
    expect(updated).toBeNull();
  });

  it('should delete a breed', async () => {
    const { breeds } = await dbService.getAllBreeds(1, 1);
    expect(breeds.length).toBeGreaterThan(0);
    const breedId = breeds[0]?.id;
    expect(typeof breedId).toBe('number');
    const deleted = await dbService.deleteBreed(breedId!);
    expect(deleted).toBe(true);
    const breed = await dbService.getBreedById(breedId!);
    expect(breed).toBeNull();
  });

  it('should return false when deleting non-existent breed', async () => {
    const deleted = await dbService.deleteBreed(9999);
    expect(deleted).toBe(false);
  });

  it('should search breeds by name, group, or temperament', async () => {
    const results = await dbService.searchBreeds('Retriever');
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    if (results.length === 0) throw new Error('No breeds found for search');
    expect(results[0]?.name).toBe('Golden Retriever');
  });

  it('should clear the database', async () => {
    await dbService.clearDatabase();
    const { breeds, total } = await dbService.getAllBreeds(1, 10);
    expect(total).toBe(0);
    expect(breeds.length).toBe(0);
  });

  it('should run raw SQL', async () => {
    await dbService.runRaw("INSERT INTO dog_breeds (name, breed_group, temperament, life_span, height_min_cm, height_max_cm, weight_min_kg, weight_max_kg, description, image_url) VALUES ('RawDog', 'RawGroup', 'Raw', '1-2 years', 10, 20, 1, 2, 'Raw dog', 'http://raw.com')");
    const results = await dbService.searchBreeds('RawDog');
    expect(results.length).toBe(1);
    if (results.length === 0) throw new Error('No breeds found for RawDog');
    expect(results[0]?.name).toBe('RawDog');
  });
}); 