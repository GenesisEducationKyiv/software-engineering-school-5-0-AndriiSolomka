import { setupServer } from 'msw/node';
import { createWeatherHandlers } from './handlers';
import * as process from 'node:process';

export const setupMswServer = () => {
  const { WEATHER_API_URL } = process.env;
  const server = setupServer(...createWeatherHandlers(WEATHER_API_URL ?? ''));

  beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  return server;
};
