const router = require('express').Router({ mergeParams: true });
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// protect all routes after this middleware
router.use(authController.protect);

router
  .route('/')
  .get(reviewController.setFilterReviewOnTour, reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourIdAndUserId,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReviewById)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReviewById
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReviewById
  );

module.exports = router;
