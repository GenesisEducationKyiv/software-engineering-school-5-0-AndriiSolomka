import * as Joi from 'joi';

export const cacheValidationSchema = Joi.object({
  CITY_CACHE_PREFIX: Joi.string().required(),
  CITY_CACHE_TTL: Joi.number().integer().positive().required(),

  WEATHER_CACHE_PREFIX: Joi.string().required(),
  WEATHER_CACHE_TTL: Joi.number().integer().positive().required(),
});
