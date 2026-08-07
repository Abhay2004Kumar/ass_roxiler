'use strict';

const Joi = require('joi');

/**
 * POST /api/user/ratings
 * Submit a new rating for a store.
 */
const submitRatingSchema = Joi.object({
  store_id: Joi.string().uuid().required().messages({
    'string.uuid': 'store_id must be a valid UUID',
    'any.required': 'store_id is required',
  }),
  value: Joi.number().integer().min(1).max(5).required().messages({
    'number.min': 'Rating must be between 1 and 5',
    'number.max': 'Rating must be between 1 and 5',
    'any.required': 'Rating value is required',
  }),
});

/**
 * PATCH /api/user/ratings/:id
 * Update an existing rating.
 */
const updateRatingSchema = Joi.object({
  value: Joi.number().integer().min(1).max(5).required().messages({
    'number.min': 'Rating must be between 1 and 5',
    'number.max': 'Rating must be between 1 and 5',
    'any.required': 'Rating value is required',
  }),
});

module.exports = { submitRatingSchema, updateRatingSchema };
