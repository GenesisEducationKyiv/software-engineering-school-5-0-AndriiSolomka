import * as Joi from 'joi';

export const loggingValidationSchema = Joi.object({
  ENABLE_FILE_LOGGING: Joi.boolean()
    .truthy('true')
    .falsy('false')
    .default(false),
});
