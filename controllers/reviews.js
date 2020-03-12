import ErrorResponse from '../utils/ErrorResponse';
import asyncHandler from '../middlewares/async';
import Review from '../models/Review';
import Bootcamp from '../models/Bootcamp';

/**
 *
 * @description Get reviews
 * @route GET /api/v1/bootcamps/:bootcampId/reviews
 * @access Public
 */
export const getReviews = asyncHandler(async (req, res, next) => {
  const { bootcampId } = req.params;

  if (bootcampId) {
    const reviews = await Review.find({ bootcamp: bootcampId });

    res.status(200).json({
      success: true,
      data: reviews
    })
  }

  res.status(200).json(res.advancedResults);
});

/**
 *
 * @description Get Single Review
 * @route GET /api/v1/reviews/:id
 * @access Public
 */
export const getReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;


  const review = await Review.findById(id).populate({
    path: 'bootcamp',
    select: 'name description'
  });

  if (!review) {
    return next(
      new ErrorResponse(`The review with the id ${id} no found`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: review
  })
});

/**
 *
 * @description Create Review
 * @route POST /api/v1/bootcamp/:bootcampId/reviews
 * @access Private
 */
export const createReview = asyncHandler(async (req, res, next) => {
  const { bootcampId } = req.params;

  const bootcamp = await Bootcamp.findById(bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`The bootcamp with the id ${id} is not found`, 404)
    );
  }

  req.body.bootcamp = bootcampId;
  req.body.user = req.user.id;

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review
  });
});

/**
 *
 * @description Update Review
 * @route PUT /api/v1/reviews/:id
 * @access Private
 */
export const updateReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let review = await Review.findById(id);

  if (!review) {
    return next(
      new ErrorResponse(`The review with the id ${id} not found`, 404)
    );
  }

  if (
    review.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to delete the review ${id}`, 401)
    );
  }

  review = await Review.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });

  res
    .status(200)
    .json({
      success: true,
      data: review
    });
});

/**
 *
 * @description Delete Review
 * @route DELETE /api/v1/reviews/:id
 * @access Private
 */
export const deleteReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let review = await Review.findById(id);

  if (!review) {
    return next(
      new ErrorResponse(`The review with the id ${id} not found`, 404)
    )
  }

  if (
    review.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to delete the review ${id}`, 401)
    );
  }

  await review.remove();

  res
    .status(200)
    .json({
      success: true,
      data: {}
    })
});
