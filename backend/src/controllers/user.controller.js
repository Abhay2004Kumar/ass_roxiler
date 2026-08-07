'use strict';

const UserService = require('../services/user.service');
const { parsePagination, buildPaginatedResponse } = require('../utils/pagination.util');

async function listStores(req, res, next) {
  try {
    const pagination = parsePagination(req.query, ['name', 'address', 'avg_rating', 'created_at']);
    const { name, address } = req.query;

    const { rows, total } = await UserService.listStores(
      { name, address, ...pagination },
      req.user.id,
    );

    res.json({ success: true, ...buildPaginatedResponse(rows, total, pagination) });
  } catch (err) {
    next(err);
  }
}

async function submitRating(req, res, next) {
  try {
    const rating = await UserService.submitRating(req.user.id, req.body);
    res.status(201).json({ success: true, data: rating });
  } catch (err) {
    next(err);
  }
}

async function updateRating(req, res, next) {
  try {
    const rating = await UserService.updateRating(req.user.id, req.params.id, req.body);
    res.json({ success: true, data: rating });
  } catch (err) {
    next(err);
  }
}

module.exports = { listStores, submitRating, updateRating };
