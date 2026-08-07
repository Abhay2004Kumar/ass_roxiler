'use strict';

const StoreService = require('../services/store.service');

async function getOwnerDashboard(req, res, next) {
  try {
    const data = await StoreService.getOwnerDashboard(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { getOwnerDashboard };
