const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.setFilterReviewOnTour = async (req, res, next) => {
  const { tourId } = req.params;
  req.nestedRouteFilter = tourId ? { tour: tourId } : {};
  next();
};

exports.setTourIdAndUserId = async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = factory.createOne(Review);
exports.getAllReviews = factory.getAll(Review, 'reviews');
exports.getReviewById = factory.getOne(Review, 'review');
exports.updateReviewById = factory.updateOne(Review, 'review');
exports.deleteReviewById = factory.deleteOne(Review, 'review');
