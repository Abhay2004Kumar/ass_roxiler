'use strict';

const StoreModel = require('../models/store.model');
const RatingModel = require('../models/rating.model');
const ApiError = require('../utils/ApiError');


/**
 * List all stores with the requesting user's own rating alongside each entry.
 *
 * @param {object} filters   Pagination + search filters from req.query
 * @param {string} userId    The authenticated user's ID
 */
async function listStores(filters, userId) {
  return StoreModel.listStores({ ...filters, userId });
}

/**
 * Submit a new rating for a store.
 * Prevents duplicate ratings — use updateRating() if one already exists.
 *
 * @param {string} userId
 * @param {{ store_id: string, value: number }} dto
 */
async function submitRating(userId, { store_id, value }) {
  const store = await StoreModel.findById(store_id);
  if (!store) throw ApiError.notFound('Store not found');

  const existing = await RatingModel.findByUserAndStore(userId, store_id);
  if (existing) {
    throw ApiError.conflict('You have already rated this store — use PATCH /ratings/:id to update it');
  }

  return RatingModel.create({ userId, storeId: store_id, value });
}

/**
 * Modify an existing rating. Only the rating's author can do this.
 *
 * @param {string} userId
 * @param {string} ratingId
 * @param {{ value: number }} dto
 */
async function updateRating(userId, ratingId, { value }) {
  const rating = await RatingModel.findById(ratingId);
  if (!rating) throw ApiError.notFound('Rating not found');
  if (rating.user_id !== userId) throw ApiError.forbidden('You can only modify your own ratings');

  return RatingModel.update(ratingId, value);
}

module.exports = { listStores, submitRating, updateRating };
