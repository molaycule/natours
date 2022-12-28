const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({ status: 'success', data: newDoc });
  });

exports.getAll = (Model, type) =>
  asyncHandler(async (req, res, next) => {
    const apiFeatures = new APIFeatures(
      Model.find(req.nestedRouteFilter || {}),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // const docs = await apiFeatures.query.explain();
    const docs = await apiFeatures.query;
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: { [type]: docs },
    });
  });

exports.getOne = (Model, type, populateOptions = null) =>
  asyncHandler(async (req, res, next) => {
    const query = Model.findById(req.params.id);
    if (populateOptions) query.populate(populateOptions);
    const doc = await query;

    if (!doc) return next(new AppError(`No ${type} found with that ID`, 404));

    res.status(200).json({ status: 'success', data: { [type]: doc } });
  });

exports.updateOne = (Model, type) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) return next(new AppError(`No ${type} found with that ID`, 404));

    res.status(200).json({ status: 'success', data: { [type]: doc } });
  });

exports.deleteOne = (Model, type) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError(`No ${type} found with that ID`, 404));

    res.status(204).json({ status: 'success', data: null });
  });
