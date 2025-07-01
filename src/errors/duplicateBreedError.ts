export class DuplicateBreedError extends Error {
  code: string;
  constructor(message: string = 'A breed with this name already exists') {
    super(message);
    this.name = 'DuplicateBreedError';
    this.code = 'DUPLICATE_BREED';
  }
} 