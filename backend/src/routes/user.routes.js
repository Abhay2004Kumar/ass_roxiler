'use strict';

const { Router }   = require('express');
const ctrl         = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole }  = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');
const { submitRatingSchema, updateRatingSchema } = require('../validators/store.validator');

const router = Router();

// Every route here requires: valid JWT + 'user' role.
router.use(authenticate, requireRole('user'));

// GET   /api/user/stores          — list all stores (with user's own rating)
// POST  /api/user/ratings         — submit a new rating
// PATCH /api/user/ratings/:id     — modify an existing rating
router.get('/stores',          ctrl.listStores);
router.post('/ratings',        validate(submitRatingSchema), ctrl.submitRating);
router.patch('/ratings/:id',   validate(updateRatingSchema), ctrl.updateRating);

module.exports = router;
