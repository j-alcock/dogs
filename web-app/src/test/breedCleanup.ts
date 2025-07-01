import { request, test } from '@playwright/test';

export const createdBreedNames: string[] = [];
// Per-test cleanup removed; globalTeardown handles cleanup. 