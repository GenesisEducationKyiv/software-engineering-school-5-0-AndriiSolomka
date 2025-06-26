import { registerAs } from '@nestjs/config';

export default registerAs('cache', () => ({
  cityCachePrefix: process.env.CITY_CACHE_PREFIX!,
  cityCacheTTL: Number(process.env.CITY_CACHE_TTL),
  weatherCachePrefix: process.env.WEATHER_CACHE_PREFIX!,
  weatherCacheTTL: Number(process.env.WEATHER_CACHE_TTL),
}));
