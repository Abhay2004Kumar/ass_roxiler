'use strict';

const AuthService = require('../services/auth.service');


async function register(req, res, next) {
  try {
    const result = await AuthService.register(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const result = await AuthService.login(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function changePassword(req, res, next) {
  try {
    const updated = await AuthService.changePassword(req.user.id, req.body);
    res.json({ success: true, message: 'Password updated successfully', data: updated });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, changePassword };
