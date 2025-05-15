import { Test, TestingModule } from '@nestjs/testing';
import { CacheWeatherService } from './cache-weather.service';

describe('CacheWeatherService', () => {
  let service: CacheWeatherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CacheWeatherService],
    }).compile();

    service = module.get<CacheWeatherService>(CacheWeatherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
