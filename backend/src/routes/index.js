'use strict';

const { Router } = require('express');

const authRoutes = require('./auth.routes');
const adminRoutes = require('./admin.routes');
const userRoutes = require('./user.routes');
const ownerRoutes = require('./store.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/user', userRoutes);
router.use('/owner', ownerRoutes);

// 404 handler for any /api/* routes that don't match
router.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

module.exports = router;
