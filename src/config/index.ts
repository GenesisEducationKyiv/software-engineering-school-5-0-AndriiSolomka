import emailConfig from './email.config';
import redisConfig from './redis.config';
import cityCacheConfig from './cache/city-cache.config';
import weatherCacheConfig from './cache/weather-cache.config';
import openMeteoConfig from './weather/open-meteo.config';
import weatherApiConfig from './weather/weather-api.config';

export default [
  emailConfig,
  weatherApiConfig,
  redisConfig,
  cityCacheConfig,
  weatherCacheConfig,
  openMeteoConfig,
];
