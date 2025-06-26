import * as Joi from 'joi';

import { redisValidationSchema } from './validation/redis.validation';
import { apiValidationSchema } from './validation/api.validation';
import { cacheValidationSchema } from './validation/cache.validation';
import { loggingValidationSchema } from './validation/logging.validation';
import { appValidationSchema } from './validation/app.validation';
import { emailValidationSchema } from './validation/email.validation';

export const validationSchema = Joi.object()
  .concat(redisValidationSchema)
  .concat(emailValidationSchema)
  .concat(apiValidationSchema)
  .concat(cacheValidationSchema)
  .concat(loggingValidationSchema)
  .concat(appValidationSchema);
