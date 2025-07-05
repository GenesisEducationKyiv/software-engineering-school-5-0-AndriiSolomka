import { CacheServiceInterface } from 'src/cache/interfaces/cache-repository.interface';

export async function cachedResult<T>(
  key: string,
  cache: CacheServiceInterface<T>,
  loader: () => Promise<T>,
): Promise<T> {
  const cached = await cache.get(key);
  if (cached) return cached;

  const data = await loader();
  await cache.set(key, data);
  return data;
}
