import * as Joi from 'joi';

export const emailValidationSchema = Joi.object({
  EMAIL_USER: Joi.string().email().required(),
  EMAIL_PASSWORD: Joi.string().required(),
  EMAIL_SERVICE: Joi.string().required(),

  EMAIL_CONFIRM_LINK: Joi.string().uri().required(),
  EMAIL_UNSUBSCRIBE_LINK: Joi.string().uri().required(),
});
