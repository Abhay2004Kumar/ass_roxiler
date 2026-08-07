'use strict';

const { Router }   = require('express');
const ctrl         = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const {
  registerSchema,
  loginSchema,
  changePasswordSchema,
} = require('../validators/auth.validator');

const router = Router();

// POST /api/auth/register
router.post('/register', validate(registerSchema), ctrl.register);

// POST /api/auth/login
router.post('/login', validate(loginSchema), ctrl.login);

// PATCH /api/auth/change-password  (requires a valid session)
router.patch('/change-password', authenticate, validate(changePasswordSchema), ctrl.changePassword);

module.exports = router;
