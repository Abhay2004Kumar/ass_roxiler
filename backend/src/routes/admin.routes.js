'use strict';

const { Router } = require('express');
const ctrl = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');
const { createUserSchema, createStoreSchema } = require('../validators/admin.validator');

const router = Router();


router.use(authenticate, requireRole('admin'));

// GET  /api/admin/dashboard
router.get('/dashboard', ctrl.getDashboard);
router.post('/users', validate(createUserSchema), ctrl.createUser);
router.get('/users', ctrl.listUsers);
router.get('/users/:id', ctrl.getUserDetail);

// POST /api/admin/stores     — create store (optionally assign an owner)
// GET  /api/admin/stores     — list + filter + sort + paginate
router.post('/stores', validate(createStoreSchema), ctrl.createStore);
router.get('/stores', ctrl.listStores);

module.exports = router;
