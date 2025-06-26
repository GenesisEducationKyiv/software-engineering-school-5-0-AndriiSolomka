import * as Joi from 'joi';

export const appValidationSchema = Joi.object({
  PORT: Joi.number().port().default(3000),
});
