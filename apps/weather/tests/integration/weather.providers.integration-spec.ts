import { INestApplication } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { AppConfig } from 'apps/weather/config/app.config';
import { AppModule } from 'apps/weather/src/app.module';
import { searchApi } from 'libs/common/setup/msw/handlers/geocoding';
import { openMeteoApi } from 'libs/common/setup/msw/handlers/openmeteo';
import { weatherApi } from 'libs/common/setup/msw/handlers/weather-api';
import { mockServer } from 'libs/common/setup/msw/setup';
import {
  CacheRepositoryInterface,
  CacheRepositoryToken,
} from 'libs/core/cache/cache-repository.interface';
import { WeatherServiceDefinition } from 'libs/proto/generated/weather';
import { WeatherClient } from 'libs/types/clients.grpc.types';
import { createChannel, createClient } from 'nice-grpc';

function resetMockServerWeatherApi() {
  mockServer.clearHandlers();
  mockServer.addHandlers([searchApi.ok()]);
}

async function clearCityCache(
  cacheRepository: CacheRepositoryInterface,
  city: string,
) {
  const key = city.toLowerCase();
  await cacheRepository.set('city', key, '');
  await cacheRepository.set('weather', key, '');
}

describe('WeatherService gRPC (integration)', () => {
  let app: INestApplication;
  let weatherClient: WeatherClient;
  let cacheRepository: CacheRepositoryInterface;

  const validCity = 'Kyiv';
  const invalidCity = 'NonExistentCity';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    const config = app.get(AppConfig);

    app.connectMicroservice({
      transport: Transport.GRPC,
      options: {
        package: 'weather',
        protoPath: 'libs/proto/weather.proto',
        url: `localhost:${config.port}`,
      },
    });

    await app.startAllMicroservices();
    await app.init();

    const channel = createChannel(`localhost:${config.port}`);
    weatherClient = createClient(WeatherServiceDefinition, channel);

    cacheRepository = app.get(CacheRepositoryToken);
  });
  beforeEach(() => {
    mockServer.clearHandlers();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('gRPC GetWeather', () => {
    beforeEach(async () => {
      await clearCityCache(cacheRepository, validCity);
      await clearCityCache(cacheRepository, invalidCity);
    });

    it('should return weather from WeatherApiProvider if available', async () => {
      mockServer.addHandlers([searchApi.ok(), weatherApi.ok()]);

      const res = await weatherClient.getWeather({ city: validCity });

      expect(res).toEqual({
        temperature: 20,
        humidity: 50,
        description: 'Sunny',
      });
    });

    it('should fallback to OpenMeteoProvider if WeatherApiProvider fails', async () => {
      mockServer.addHandlers([
        weatherApi.notFound(),
        searchApi.ok(),
        openMeteoApi.ok(),
      ]);

      const res = await weatherClient.getWeather({ city: validCity });

      expect(res).toEqual({
        temperature: 18,
        humidity: 65,
        description: 'Mainly clear',
      });
    });

    it('should throw error if all providers fail', async () => {
      mockServer.addHandlers([
        weatherApi.notFound(),
        searchApi.ok(),
        openMeteoApi.error(),
      ]);

      await expect(
        weatherClient.getWeather({ city: invalidCity }),
      ).rejects.toThrow();
    });

    it('should cache weather data from WeatherApiProvider and return cached value on second request', async () => {
      mockServer.addHandlers([searchApi.ok(), weatherApi.ok()]);

      const key = validCity.toLowerCase();

      const res1 = await weatherClient.getWeather({ city: validCity });

      resetMockServerWeatherApi();

      const res2 = await weatherClient.getWeather({ city: validCity });

      expect(res2).toEqual(res1);

      const cachedData = await cacheRepository.get('weather', key);
      expect(cachedData).toBeTruthy();
      expect(JSON.parse(cachedData!)).toEqual(res1);
    });

    it('should cache weather data from OpenMeteoProvider and return cached value on second request', async () => {
      mockServer.addHandlers([
        searchApi.ok(),
        weatherApi.notFound(),
        openMeteoApi.ok(),
      ]);

      const key = validCity.toLowerCase();

      const res1 = await weatherClient.getWeather({ city: validCity });

      resetMockServerWeatherApi();

      const res2 = await weatherClient.getWeather({ city: validCity });

      expect(res2).toEqual(res1);

      const cachedData = await cacheRepository.get('weather', key);
      expect(cachedData).toBeTruthy();
      expect(JSON.parse(cachedData!)).toEqual(res1);
    });
  });
});
