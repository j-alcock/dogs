import '@testing-library/jest-dom';
import { Pact } from '@pact-foundation/pact';
import { request, test as base } from '@playwright/test';

// Pact configuration
export const pactConfig = {
  consumer: 'DogBreedsWebApp',
  provider: 'DogBreedsAPI',
  pactDir: './pacts',
  logDir: './logs',
  logLevel: 'info' as const,
  spec: 2,
  cors: true,
  host: '127.0.0.1',
  port: 3000,
};

// Create Pact instance
export const provider = new Pact({
  consumer: pactConfig.consumer,
  provider: pactConfig.provider,
  port: pactConfig.port,
  log: './logs/pact.log',
  dir: pactConfig.pactDir,
  spec: pactConfig.spec,
  logLevel: pactConfig.logLevel as any,
  cors: pactConfig.cors,
  host: pactConfig.host,
});

// Playwright global setup/teardown for DB reset
const API_BASE_URL = process.env.PLAYWRIGHT_API_BASE_URL || 'http://localhost:3000';

base.beforeAll(async () => {
  const apiRequest = await request.newContext({ baseURL: API_BASE_URL });
  await apiRequest.post('/_pactSetup', {
    data: { state: 'reset to seed' },
    headers: { 'Content-Type': 'application/json' },
  });
  await apiRequest.dispose();
});

base.afterAll(async () => {
  const apiRequest = await request.newContext({ baseURL: API_BASE_URL });
  await apiRequest.post('/_pactSetup', {
    data: { state: 'reset to seed' },
    headers: { 'Content-Type': 'application/json' },
  });
  await apiRequest.dispose();
});

// Test timeout
jest.setTimeout(30000);

const duplicateName = 'Golden Retriever';
// ... fill the form as before ...
await expect(page.locator('.text-red-800')).toHaveText(`A breed with the name "${duplicateName}" already exists`); 