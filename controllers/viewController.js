const Tour = require('../models/tourModel');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

exports.getOverview = asyncHandler(async (req, res, next) => {
  // get tour data from collection
  const tours = await Tour.find();
  // render the template using the tours data
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = asyncHandler(async (req, res, next) => {
  // get the data for the requested tour (including reviews and guides)
  const { slug } = req.params;
  const tour = await Tour.findOne({ slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  // render the template using the tour data
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      'connect-src https://*.tiles.mapbox.com https://api.mapbox.com https://events.mapbox.com'
    )
    .render('tour', {
      title: `${tour.name} Tour`,
      tour,
    });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', { title: 'Log into your account' });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', { title: 'Your account' });
};

exports.updateUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});
