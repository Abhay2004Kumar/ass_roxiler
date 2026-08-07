'use strict';

const StoreModel = require('../models/store.model');
const RatingModel = require('../models/rating.model');
const ApiError = require('../utils/ApiError');


/**
 * Fetch the store owner's dashboard data.
 *
 * Returns:
 *  - The store record (with avg rating)
 *  - A list of all users who have rated their store (with their ratings)
 *
 * @param {string} ownerId  The authenticated store_owner's user ID
 */
async function getOwnerDashboard(ownerId) {
  const store = await StoreModel.findByOwnerId(ownerId);

  if (!store) {
    throw ApiError.notFound('No store is currently linked to your account. Contact an admin.');
  }

  const raters = await RatingModel.listRatersForStore(store.id);

  return {
    store: {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      avg_rating: store.avg_rating ? parseFloat(store.avg_rating) : null,
      rating_count: store.rating_count ?? 0,
    },
    raters,
  };
}

module.exports = { getOwnerDashboard };
