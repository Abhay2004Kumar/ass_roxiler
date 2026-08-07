'use strict';

const AdminService = require('../services/admin.service');
const { parsePagination, buildPaginatedResponse } = require('../utils/pagination.util');

async function getDashboard(req, res, next) {
  try {
    const stats = await AdminService.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const user = await AdminService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

async function listUsers(req, res, next) {
  try {
    const pagination  = parsePagination(req.query, ['name', 'email', 'role', 'created_at']);
    const { name, email, address, role } = req.query;

    const { rows, total } = await AdminService.listUsers({
      name, email, address, role,
      ...pagination,
    });

    res.json({ success: true, ...buildPaginatedResponse(rows, total, pagination) });
  } catch (err) {
    next(err);
  }
}

async function getUserDetail(req, res, next) {
  try {
    const user = await AdminService.getUserDetail(req.params.id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

async function createStore(req, res, next) {
  try {
    const store = await AdminService.createStore(req.body);
    res.status(201).json({ success: true, data: store });
  } catch (err) {
    next(err);
  }
}

async function listStores(req, res, next) {
  try {
    const pagination = parsePagination(req.query, ['name', 'email', 'address', 'avg_rating', 'created_at']);
    const { name, address } = req.query;

    const { rows, total } = await AdminService.listStores({
      name, address,
      ...pagination,
    });

    res.json({ success: true, ...buildPaginatedResponse(rows, total, pagination) });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDashboard, createUser, listUsers, getUserDetail, createStore, listStores };
