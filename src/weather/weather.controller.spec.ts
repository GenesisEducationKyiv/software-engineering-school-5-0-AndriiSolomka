import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { WeatherApiClientService } from '../weather-api-client/weather-api-client.service';

describe('WeatherController', () => {
  let controller: WeatherController;

  const mockWeatherApiClientService = {
    getCityWeather: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [
        WeatherService,
        {
          provide: WeatherApiClientService,
          useValue: mockWeatherApiClientService,
        },
      ],
    }).compile();

    controller = module.get<WeatherController>(WeatherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
