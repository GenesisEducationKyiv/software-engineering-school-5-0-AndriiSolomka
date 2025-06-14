import emailConfig from './email.config';
import weatherApiConfig from './weather-api.config';
import redisConfig from './redis.config';
import cityCacheConfig from './cache/city-cache.config';
import weatherCacheConfig from './cache/weather-cache.config';

export default [
  emailConfig,
  weatherApiConfig,
  redisConfig,
  cityCacheConfig,
  weatherCacheConfig,
];
