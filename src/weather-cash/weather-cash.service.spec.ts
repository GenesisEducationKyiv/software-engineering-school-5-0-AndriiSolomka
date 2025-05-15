import { Test, TestingModule } from '@nestjs/testing';
import { WeatherCashService } from './weather-cash.service';

describe('WeatherCashService', () => {
  let service: WeatherCashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeatherCashService],
    }).compile();

    service = module.get<WeatherCashService>(WeatherCashService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
