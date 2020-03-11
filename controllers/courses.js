import ErrorResponse from '../utils/ErrorResponse';
import asyncHandler from '../middlewares/async';

import Course from '../models/Course';
import Bootcamp from '../models/Bootcamp';

/**
 *
 * @description Get courses
 * @route GET /api/v1/bootcamps/:bootcampId/courses
 * @access Public
 */
export const getCourses = asyncHandler(async (req, res, next) => {
  const { bootcampId } = req.params;

  if (bootcampId) {
    const courses = await Course.find({ bootcamp: bootcampId });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  }

  res.status(200).json(res.advancedResults);
});

/**
 *
 * @description Get single course
 * @route GET /api/v1/courses/:id
 * @access Public
 */
export const getCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const course = await Course.findById(id).populate({
    path: 'bootcamp',
    select: 'name description slug'
  });

  if (!course) {
    return next(new ErrorResponse(
      `No course with the id of ${id}`, 404
    ));
  }

  res.status(200).json({
    success: true,
    data: course
  })
});

/**
 *
 * @description Create a course for a specific bootcamp
 * @route POST /api/v1/bootcamps/:bootcampId/courses
 * @access Private
 */
export const createCourse = asyncHandler(async (req, res, next) => {
  const { bootcampId } = req.params;

  const bootcamp = await Bootcamp.findById(bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp with the id of ${bootcampId}`, 404)
    );
  }

  if (
    bootcamp.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to add a course to bootcamp ${bootcampId}`, 401)
    );
  }

  req.body.bootcamp = bootcampId;
  req.body.user = req.user.id;

  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    data: course
  });
});

/**
 *
 * @description Update a course
 * @route PUT /api/v1/courses/:id
 * @access Private
 */
export const updateCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let course = await Course.findById(id);

  if (!course) {
    next(new ErrorResponse(
      `No course with the id of ${id}`,
      404
    ));
  }

  if (
    course.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to update the course ${id}`, 401)
    );
  }

  course = await Course.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(201).json({
    success: true,
    data: course
  })
});

/**
 *
 * @description Delete a course
 * @route DELETE /api/v1/courses/:id
 * @access Private
 */
export const deleteCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const course = await Course.findById(id);

  if (!course) {
    next(new ErrorResponse(
      `No course with the id of ${id}`,
      404
    ));
  }

  if (
    course.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to delete the course ${id}`, 401)
    );
  }

  await course.remove();

  res.status(201).json({
    success: true,
    data: {}
  })
});
