'use strict';

const Joi = require('joi');

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]).*$/;

// ── Reusable pieces ───────────────────────────────────────────────────────────

const name = Joi.string().min(20).max(60).trim().required().messages({
  'string.min': 'Name must be at least 20 characters',
  'string.max': 'Name must not exceed 60 characters',
});

const email = Joi.string().email({ tlds: { allow: false } }).lowercase().trim().required().messages({
  'string.email': 'Must be a valid email address',
});

const password = Joi.string().min(8).max(16).pattern(PASSWORD_REGEX).required().messages({
  'string.min': 'Password must be at least 8 characters',
  'string.max': 'Password must not exceed 16 characters',
  'string.pattern.base': 'Password must include at least one uppercase letter and one special character',
});

const address = Joi.string().max(400).trim().required().messages({
  'string.max': 'Address must not exceed 400 characters',
});



/**
 * POST /api/admin/users
 * Admin can create users of any role.
 */
const createUserSchema = Joi.object({
  name,
  email,
  password,
  address,
  role: Joi.string()
    .valid('admin', 'user', 'store_owner')
    .default('user')
    .messages({ 'any.only': 'Role must be one of: admin, user, store_owner' }),
});

/**
 * POST /api/admin/stores
 */
const createStoreSchema = Joi.object({
  name: Joi.string().min(20).max(60).trim().required().messages({
    'string.min': 'Store name must be at least 20 characters',
    'string.max': 'Store name must not exceed 60 characters',
  }),
  email,
  address,
  owner_id: Joi.string().uuid().optional().allow(null, '').messages({
    'string.uuid': 'owner_id must be a valid UUID',
  }),
});

module.exports = { createUserSchema, createStoreSchema };
