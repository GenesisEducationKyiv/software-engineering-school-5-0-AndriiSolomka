import { CacheService } from '../cache.service';
import { CacheRepository } from '../interfaces/cache-repository.interface';
import { ICacheService } from '../interfaces/cache-service.interface';

describe('CacheService', () => {
  let cacheService: ICacheService<unknown>;
  let cacheRepositoryMock: jest.Mocked<
    Pick<CacheRepository, 'get' | 'set' | 'setWithExpiry'>
  >;

  const prefix = 'testPrefix';
  const ttl = 60;

  beforeEach(() => {
    cacheRepositoryMock = {
      get: jest.fn(),
      set: jest.fn(),
      setWithExpiry: jest.fn(),
    };

    cacheService = new CacheService<unknown>(cacheRepositoryMock, prefix, ttl);
  });

  describe('get', () => {
    it('should return parsed value if cache hit', async () => {
      const key = 'SomeKey';
      const value = { foo: 'bar' };
      cacheRepositoryMock.get.mockResolvedValueOnce(JSON.stringify(value));

      const result = await cacheService.get(key);

      expect(cacheRepositoryMock.get).toHaveBeenCalledWith(
        prefix,
        key.toLowerCase(),
      );
      expect(result).toEqual(value);
    });

    it('should return null if cache miss', async () => {
      cacheRepositoryMock.get.mockResolvedValueOnce(null);

      const result = await cacheService.get('missingKey');

      expect(result).toBeNull();
    });

    it('should throw if cached value is not valid JSON', async () => {
      cacheRepositoryMock.get.mockResolvedValueOnce('not-a-json');

      await expect(cacheService.get('key')).rejects.toThrow();
    });
  });

  describe('set', () => {
    it('should call setWithExpiry with correct arguments', async () => {
      const key = 'SomeKey';
      const value = { foo: 'bar' };

      await cacheService.set(key, value);

      expect(cacheRepositoryMock.setWithExpiry).toHaveBeenCalledWith(
        prefix,
        key.toLowerCase(),
        JSON.stringify(value),
        ttl,
      );
    });
  });
});
