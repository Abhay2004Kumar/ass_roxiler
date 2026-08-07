'use strict';

const { Router }   = require('express');
const ctrl         = require('../controllers/store.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole }  = require('../middleware/role.middleware');

const router = Router();

// Every route here requires: valid JWT + 'store_owner' role.
router.use(authenticate, requireRole('store_owner'));

// GET /api/owner/dashboard  — avg rating + list of raters
router.get('/dashboard', ctrl.getOwnerDashboard);

module.exports = router;
