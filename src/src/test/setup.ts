import { Pact } from '@pact-foundation/pact';
import path from 'path';

// Pact configuration
export const pactConfig = {
  consumer: 'DogBreedsWebApp',
  provider: 'DogBreedsAPI',
  pactDir: path.resolve(process.cwd(), 'pacts'),
  logDir: path.resolve(process.cwd(), 'logs'),
  logLevel: 'info' as const,
  spec: 2,
  cors: true,
  host: '127.0.0.1',
  port: 1234,
};

// Create Pact instance
export const provider = new Pact({
  consumer: pactConfig.consumer,
  provider: pactConfig.provider,
  port: pactConfig.port,
  log: path.resolve(process.cwd(), 'logs', 'pact.log'),
  dir: pactConfig.pactDir,
  spec: pactConfig.spec,
  logLevel: pactConfig.logLevel as any,
  cors: pactConfig.cors,
  host: pactConfig.host,
});

// Test timeout
jest.setTimeout(30000); 