// import * as Joi from 'joi';

// /**
//  * Validates process.env at bootstrap time so the app fails fast with a
//  * clear error instead of crashing later with a confusing Mongo/connection
//  * error when a required variable is missing.
//  */
// export const validationSchema = Joi.object({
//   NODE_ENV: Joi.string()
//     .valid('development', 'production', 'test')
//     .default('development'),
//   PORT: Joi.number().default(3000),
//   CORS_ORIGIN: Joi.string().default('*'),
//   MONGODB_URI: Joi.string().required().messages({
//     'any.required':
//       'MONGODB_URI is required. Set it in your .env file to your MongoDB Atlas connection string.',
//   }),
// }); 
import Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  PORT: Joi.number().default(3000),

  CORS_ORIGIN: Joi.string().default('*'),

  MONGODB_URI: Joi.string().required().messages({
    'any.required':
      'MONGODB_URI is required. Set it in your .env file to your MongoDB Atlas connection string.',
  }),
});
