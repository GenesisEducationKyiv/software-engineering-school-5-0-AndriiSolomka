import emailConfig from './email.config';
import redisConfig from './redis.config';
import apiConfig from './api.config';
import appConfig from './app.config';
import cacheConfig from './cache.config';
import loggingConfig from './logging.config';

export default [
  emailConfig,
  redisConfig,
  cacheConfig,
  apiConfig,
  appConfig,
  loggingConfig,
];
