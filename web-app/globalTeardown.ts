import { request } from '@playwright/test';

export default async () => {
  const apiRequest = await request.newContext({ baseURL: 'http://localhost:3000' });
  await apiRequest.post('/_pactSetup', {
    data: { state: 'reset to seed' },
    headers: { 'Content-Type': 'application/json' },
  });
  await apiRequest.dispose();
  console.log('[Playwright Global Teardown] Database reset to seed state.');
}; 