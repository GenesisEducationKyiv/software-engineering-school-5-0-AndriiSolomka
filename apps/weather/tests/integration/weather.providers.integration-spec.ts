import { INestApplication } from '@nestjs/common';
import { ClientGrpc, ClientsModule, Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'apps/weather/src/app.module';
import { searchApi } from 'libs/common/setup/msw/handlers/geocoding';
import { openMeteoApi } from 'libs/common/setup/msw/handlers/openmeteo';
import { weatherApi } from 'libs/common/setup/msw/handlers/weather-api';
import { mockServer } from 'libs/common/setup/msw/setup';
import {
  CacheRepositoryInterface,
  CacheRepositoryToken,
} from 'libs/core/cache/cache-repository.interface';
import {
  GetWeatherRequest,
  GetWeatherResponse,
} from 'libs/proto/generated/weather';
import { Observable, firstValueFrom } from 'rxjs';

const grpcOptions = {
  package: 'weather',
  protoPath: 'libs/proto/weather.proto',
  url: 'localhost:50051',
};

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

interface WeatherServiceClient {
  GetWeather(request: GetWeatherRequest): Observable<GetWeatherResponse>;
}

describe('WeatherService gRPC (integration)', () => {
  let app: INestApplication;
  let grpcClient: ClientGrpc;
  let weatherService: WeatherServiceClient;
  let cacheRepository: CacheRepositoryInterface;

  const validCity = 'Kyiv';
  const invalidCity = 'NonExistentCity';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ClientsModule.register([
          {
            name: 'WEATHER_PACKAGE',
            transport: Transport.GRPC,
            options: grpcOptions,
          },
        ]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.connectMicroservice({
      transport: Transport.GRPC,
      options: grpcOptions,
    });

    await app.startAllMicroservices();
    await app.init();

    grpcClient = app.get('WEATHER_PACKAGE');
    weatherService =
      grpcClient.getService<WeatherServiceClient>('WeatherService');
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

      const res = await firstValueFrom(
        weatherService.GetWeather({ city: validCity }),
      );

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

      const res = await firstValueFrom(
        weatherService.GetWeather({ city: validCity }),
      );

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
        firstValueFrom(weatherService.GetWeather({ city: invalidCity })),
      ).rejects.toThrow();
    });

    it('should cache weather data from WeatherApiProvider and return cached value on second request', async () => {
      mockServer.addHandlers([searchApi.ok(), weatherApi.ok()]);

      const key = validCity.toLowerCase();

      const res1 = await firstValueFrom(
        weatherService.GetWeather({ city: validCity }),
      );

      resetMockServerWeatherApi();

      const res2 = await firstValueFrom(
        weatherService.GetWeather({ city: validCity }),
      );

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

      const res1 = await firstValueFrom(
        weatherService.GetWeather({ city: validCity }),
      );

      resetMockServerWeatherApi();

      const res2 = await firstValueFrom(
        weatherService.GetWeather({ city: validCity }),
      );

      expect(res2).toEqual(res1);

      const cachedData = await cacheRepository.get('weather', key);
      expect(cachedData).toBeTruthy();
      expect(JSON.parse(cachedData!)).toEqual(res1);
    });
  });
});
