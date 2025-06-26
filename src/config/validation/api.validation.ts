import * as Joi from 'joi';

export const apiValidationSchema = Joi.object({
  WEATHER_API_KEY: Joi.string().required(),
  WEATHER_API_URL: Joi.string().uri().required(),
  OPEN_METEO_API_URL: Joi.string().uri().required(),
  GEOCODING_API_URL: Joi.string().uri().required(),
});
