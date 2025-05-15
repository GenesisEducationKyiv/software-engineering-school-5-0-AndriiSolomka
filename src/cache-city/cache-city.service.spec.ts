import { Test, TestingModule } from '@nestjs/testing';
import { CacheCityService } from './cache-city.service';

describe('CacheCityService', () => {
  let service: CacheCityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CacheCityService],
    }).compile();

    service = module.get<CacheCityService>(CacheCityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
