'use strict';

const db = require('../config/db');
const UserModel = require('../models/user.model');
const StoreModel = require('../models/store.model');
const RatingModel = require('../models/rating.model');
const { hashPassword } = require('../utils/bcrypt.util');
const ApiError = require('../utils/ApiError');


/**
 * Aggregate counts for the admin dashboard.
 *
 * We run all three queries in parallel because they're independent.
 * @returns {{ totalUsers, totalStores, totalRatings }}
 */
async function getDashboardStats() {
  const [usersResult, storesResult, ratingsTotal] = await Promise.all([
    db.query('SELECT COUNT(*)::int AS cnt FROM users'),
    db.query('SELECT COUNT(*)::int AS cnt FROM stores'),
    RatingModel.getTotalCount(),
  ]);

  return {
    totalUsers: usersResult.rows[0].cnt,
    totalStores: storesResult.rows[0].cnt,
    totalRatings: ratingsTotal,
  };
}

/**
 * Create a user of any role.
 * Admin-specific version — unlike the public register endpoint this
 * allows role assignment.
 */
async function createUser(dto) {
  const existing = await UserModel.findByEmail(dto.email);
  if (existing) throw ApiError.conflict('A user with that email already exists');

  const hashedPassword = await hashPassword(dto.password);
  return UserModel.create({
    name: dto.name,
    email: dto.email,
    hashedPassword,
    address: dto.address,
    role: dto.role || 'user',
  });
}

/**
 * List users with filters, sort, and pagination.
 * @param {object} filters
 */
async function listUsers(filters) {
  return UserModel.listUsers(filters);
}

/**
 * Get full detail for a user.
 * If the user is a store_owner, include their store + avg rating.
 *
 * @param {string} id UUID
 */
async function getUserDetail(id) {
  const user = await UserModel.findById(id);
  if (!user) throw ApiError.notFound('User not found');

  if (user.role === 'store_owner') {
    const store = await StoreModel.findByOwnerId(id);
    return { ...user, store: store || null };
  }

  return user;
}

/**
 * Create a new store.
 * Validates that owner_id (if supplied) points to a store_owner user.
 */
async function createStore(dto) {
  if (dto.owner_id) {
    const owner = await UserModel.findById(dto.owner_id);
    if (!owner) throw ApiError.badRequest('Specified owner does not exist');
    if (owner.role !== 'store_owner') {
      throw ApiError.badRequest(`User ${owner.email} is not a store owner`);
    }
  }

  const existing = await StoreModel.findByEmail(dto.email);
  if (existing) throw ApiError.conflict('A store with that email already exists');

  return StoreModel.create(dto);
}

/**
 * List stores with filters, sort, and pagination (admin view — no user rating column).
 * @param {object} filters
 */
async function listStores(filters) {
  return StoreModel.listStores({ ...filters, userId: null });
}

module.exports = { getDashboardStats, createUser, listUsers, getUserDetail, createStore, listStores };
