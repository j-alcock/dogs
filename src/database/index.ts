console.log('>>> Using DatabaseService from dogs/src/database/index.ts');
import sqlite3 from 'sqlite3';
import { DatabaseConfig, DogBreed, CreateDogBreedRequest, UpdateDogBreedRequest } from '../types';
import { DuplicateBreedError } from '../errors/duplicateBreedError';

export class DatabaseService {
  private db: sqlite3.Database;

  constructor(config: DatabaseConfig) {
    this.db = new sqlite3.Database(config.filename);
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS dog_breeds (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        breed_group TEXT NOT NULL,
        temperament TEXT NOT NULL,
        life_span TEXT NOT NULL,
        height_min_cm INTEGER NOT NULL,
        height_max_cm INTEGER NOT NULL,
        weight_min_kg REAL NOT NULL,
        weight_max_kg REAL NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.run(createTableSQL, (err) => {
      if (err) {
        console.error('Error creating table:', err);
      } else {
        console.log('Database initialized successfully');
        this.seedDatabase();
      }
    });
  }

  public seedDatabase(): void {
    const checkDataSQL = 'SELECT COUNT(*) as count FROM dog_breeds';
    
    this.db.get(checkDataSQL, (err, row: any) => {
      if (err) {
        console.error('Error checking data:', err);
        return;
      }

      if (row.count === 0) {
        this.insertSeedData();
      }
    });
  }

  private insertSeedData(): void {
    const seedData = [
      {
        name: 'Golden Retriever',
        breed_group: 'Sporting',
        temperament: 'Friendly, Intelligent, Devoted',
        life_span: '10-12 years',
        height_min_cm: 55,
        height_max_cm: 61,
        weight_min_kg: 25,
        weight_max_kg: 34,
        description: 'The Golden Retriever is a large-sized breed of dog bred as gun dogs to retrieve shot waterfowl.',
        image_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop'
      },
      {
        name: 'German Shepherd',
        breed_group: 'Herding',
        temperament: 'Loyal, Courageous, Confident',
        life_span: '7-10 years',
        height_min_cm: 55,
        height_max_cm: 65,
        weight_min_kg: 22,
        weight_max_kg: 40,
        description: 'The German Shepherd is a breed of medium to large-sized working dog that originated in Germany.',
        image_url: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=300&fit=crop'
      },
      {
        name: 'Labrador Retriever',
        breed_group: 'Sporting',
        temperament: 'Friendly, Active, Outgoing',
        life_span: '10-12 years',
        height_min_cm: 55,
        height_max_cm: 62,
        weight_min_kg: 25,
        weight_max_kg: 36,
        description: 'The Labrador Retriever is a medium-large breed of retriever-gun dog.',
        image_url: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=400&h=300&fit=crop'
      }
    ];

    const insertSQL = `
      INSERT INTO dog_breeds (
        name, breed_group, temperament, life_span, 
        height_min_cm, height_max_cm, weight_min_kg, weight_max_kg, 
        description, image_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    seedData.forEach((breed) => {
      this.db.run(insertSQL, [
        breed.name, breed.breed_group, breed.temperament, breed.life_span,
        breed.height_min_cm, breed.height_max_cm, breed.weight_min_kg, breed.weight_max_kg,
        breed.description, breed.image_url
      ]);
    });

    console.log('Seed data inserted successfully');
  }

  public async getAllBreeds(page: number = 1, limit: number = 10): Promise<{ breeds: DogBreed[], total: number }> {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * limit;
      
      const countSQL = 'SELECT COUNT(*) as total FROM dog_breeds';
      const dataSQL = `
        SELECT 
          id, name, breed_group, temperament, life_span,
          height_min_cm, height_max_cm, weight_min_kg, weight_max_kg,
          description, image_url, created_at, updated_at
        FROM dog_breeds 
        ORDER BY name 
        LIMIT ? OFFSET ?
      `;

      this.db.get(countSQL, (err, countRow: any) => {
        if (err) {
          reject(err);
          return;
        }

        this.db.all(dataSQL, [limit, offset], (err, rows: any[]) => {
          if (err) {
            reject(err);
            return;
          }

          const breeds: DogBreed[] = rows.map(row => ({
            id: row.id,
            name: row.name,
            breed_group: row.breed_group,
            temperament: row.temperament,
            life_span: row.life_span,
            height_cm: {
              min: row.height_min_cm,
              max: row.height_max_cm
            },
            weight_kg: {
              min: row.weight_min_kg,
              max: row.weight_max_kg
            },
            description: row.description,
            image_url: row.image_url,
            created_at: row.created_at,
            updated_at: row.updated_at
          }));

          resolve({
            breeds,
            total: countRow.total
          });
        });
      });
    });
  }

  public async getBreedById(id: number): Promise<DogBreed | null> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          id, name, breed_group, temperament, life_span,
          height_min_cm, height_max_cm, weight_min_kg, weight_max_kg,
          description, image_url, created_at, updated_at
        FROM dog_breeds 
        WHERE id = ?
      `;

      this.db.get(sql, [id], (err, row: any) => {
        if (err) {
          reject(err);
          return;
        }

        if (!row) {
          resolve(null);
          return;
        }

        const breed: DogBreed = {
          id: row.id,
          name: row.name,
          breed_group: row.breed_group,
          temperament: row.temperament,
          life_span: row.life_span,
          height_cm: {
            min: row.height_min_cm,
            max: row.height_max_cm
          },
          weight_kg: {
            min: row.weight_min_kg,
            max: row.weight_max_kg
          },
          description: row.description,
          image_url: row.image_url,
          created_at: row.created_at,
          updated_at: row.updated_at
        };

        resolve(breed);
      });
    });
  }

  public async createBreed(breedData: CreateDogBreedRequest): Promise<DogBreed> {
    const self = this;
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO dog_breeds (
          name, breed_group, temperament, life_span,
          height_min_cm, height_max_cm, weight_min_kg, weight_max_kg,
          description, image_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      self.db.run(sql, [
        breedData.name,
        breedData.breed_group,
        breedData.temperament,
        breedData.life_span,
        breedData.height_cm.min,
        breedData.height_cm.max,
        breedData.weight_kg.min,
        breedData.weight_kg.max,
        breedData.description,
        breedData.image_url || null
      ], function(err) {
        if (err) {
          const errorAny = err as any;
          console.error('[DB] createBreed error:', errorAny);
          if (
            (errorAny.code && errorAny.code === 'SQLITE_CONSTRAINT') ||
            (errorAny.message && errorAny.message.includes('UNIQUE constraint failed: dog_breeds.name'))
          ) {
            console.error('[DB] Wrapping as DuplicateBreedError');
            reject(new DuplicateBreedError(`A breed with the name "${breedData.name}" already exists`));
          } else {
            reject(err);
          }
          return;
        }
        // 'this' here refers to the statement, not DatabaseService, so use 'self'
        self.getBreedById(this.lastID)
          .then(breed => {
            if (!breed) reject(new Error('Breed not found after insert'));
            else resolve(breed);
          })
          .catch(reject);
      });
    });
  }

  public async updateBreed(id: number, breedData: Partial<CreateDogBreedRequest>): Promise<DogBreed | null> {
    return new Promise((resolve, reject) => {
      const currentBreed = this.getBreedById(id);
      
      currentBreed.then((breed) => {
        if (!breed) {
          resolve(null);
          return;
        }

        const updatedData = {
          name: breedData.name ?? breed.name,
          breed_group: breedData.breed_group ?? breed.breed_group,
          temperament: breedData.temperament ?? breed.temperament,
          life_span: breedData.life_span ?? breed.life_span,
          height_min_cm: breedData.height_cm?.min ?? breed.height_cm.min,
          height_max_cm: breedData.height_cm?.max ?? breed.height_cm.max,
          weight_min_kg: breedData.weight_kg?.min ?? breed.weight_kg.min,
          weight_max_kg: breedData.weight_kg?.max ?? breed.weight_kg.max,
          description: breedData.description ?? breed.description,
          image_url: breedData.image_url ?? breed.image_url
        };

        const sql = `
          UPDATE dog_breeds SET
            name = ?, breed_group = ?, temperament = ?, life_span = ?,
            height_min_cm = ?, height_max_cm = ?, weight_min_kg = ?, weight_max_kg = ?,
            description = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `;

        this.db.run(sql, [
          updatedData.name,
          updatedData.breed_group,
          updatedData.temperament,
          updatedData.life_span,
          updatedData.height_min_cm,
          updatedData.height_max_cm,
          updatedData.weight_min_kg,
          updatedData.weight_max_kg,
          updatedData.description,
          updatedData.image_url,
          id
                 ], function(this: any, err: any) {
           if (err) {
             reject(err);
             return;
           }

           this.getBreedById(id).then(resolve).catch(reject);
         }.bind(this));
      }).catch(reject);
    });
  }

  public async deleteBreed(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM dog_breeds WHERE id = ?';
      
      this.db.run(sql, [id], function(err) {
        if (err) {
          reject(err);
          return;
        }

        resolve(this.changes > 0);
      });
    });
  }

  public async searchBreeds(query: string): Promise<DogBreed[]> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          id, name, breed_group, temperament, life_span,
          height_min_cm, height_max_cm, weight_min_kg, weight_max_kg,
          description, image_url, created_at, updated_at
        FROM dog_breeds 
        WHERE name LIKE ? OR breed_group LIKE ? OR temperament LIKE ?
        ORDER BY name
      `;

      const searchTerm = `%${query}%`;

      this.db.all(sql, [searchTerm, searchTerm, searchTerm], (err, rows: any[]) => {
        if (err) {
          reject(err);
          return;
        }

        const breeds: DogBreed[] = rows.map(row => ({
          id: row.id,
          name: row.name,
          breed_group: row.breed_group,
          temperament: row.temperament,
          life_span: row.life_span,
          height_cm: {
            min: row.height_min_cm,
            max: row.height_max_cm
          },
          weight_kg: {
            min: row.weight_min_kg,
            max: row.weight_max_kg
          },
          description: row.description,
          image_url: row.image_url,
          created_at: row.created_at,
          updated_at: row.updated_at
        }));

        resolve(breeds);
      });
    });
  }

  public async clearDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM dog_breeds', (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Database cleared successfully');
          resolve();
        }
      });
    });
  }

  public async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  public async runRaw(sql: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
} 