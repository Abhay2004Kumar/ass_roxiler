'use strict';

const Joi = require('joi');

// ─────────────────────────────────────────────────────────────────────────────
// Shared field definitions — keeps validation rules DRY and in one place.
// ─────────────────────────────────────────────────────────────────────────────

const name = Joi.string().min(20).max(60).trim().required().messages({
  'string.base': 'Name must be a string',
  'string.empty': 'Name is required',
  'string.min': 'Name must be at least 20 characters long',
  'string.max': 'Name must not exceed 60 characters',
  'any.required': 'Name is required',
});

const email = Joi.string().email({ tlds: { allow: false } }).lowercase().trim().required().messages({
  'string.email': 'Please provide a valid email address',
  'any.required': 'Email is required',
});

// 8–16 chars, at least one uppercase, at least one special character
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]).*$/;

const password = Joi.string().min(8).max(16).pattern(PASSWORD_REGEX).required().messages({
  'string.min': 'Password must be at least 8 characters',
  'string.max': 'Password must not exceed 16 characters',
  'string.pattern.base': 'Password must include at least one uppercase letter and one special character',
  'any.required': 'Password is required',
});

const address = Joi.string().max(400).trim().required().messages({
  'string.max': 'Address must not exceed 400 characters',
  'any.required': 'Address is required',
});



/** POST /api/auth/register */
const registerSchema = Joi.object({ name, email, password, address });

/** POST /api/auth/login */
const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).lowercase().trim().required(),
  password: Joi.string().required().messages({ 'any.required': 'Password is required' }),
});

/** PATCH /api/auth/change-password */
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({ 'any.required': 'Current password is required' }),
  newPassword: password,
});

module.exports = { registerSchema, loginSchema, changePasswordSchema };
