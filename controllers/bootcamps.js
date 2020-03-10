import path from 'path';

import ErrorResponse from '../utils/ErrorResponse';
import asyncHandler from '../middlewares/async';
import geocoder from '../utils/geocoder';

import Bootcamp from '../models/Bootcamp';

/**
 *
 * @description Get All bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
export const getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).send(res.advancedResults);
});

/**
 *
 * @description Get single bootcamp
 * @route GET /api/v1/bootcamps/:id
 * @access Public
 */
export const getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with the id ${req.params.id}`, 404)
    );
  }

  res.status(200).send({ success: true, data: bootcamp });
});

/**
 *
 * @description Create a bootcamp
 * @route POST /api/v1/bootcamps
 * @access Private
 */
export const createBootcamp = asyncHandler(async (req, res, next) => {

  // Add user id to the body
  req.body.user = req.user.id;

  // Check for published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  // If the user is not an admin, they can obly add one bootcamp
  if (
    publishedBootcamp &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(`The user with ID ${req.user.id} has already published a bootcamp`, 400)
    );
  }

  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).send({ success: true, data: bootcamp });
});

/**
 *
 * @description Update a bootcamp
 * @route PUT /api/v1/bootcamps/:id
 * @access Private
 */
export const updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with the id ${req.params.id}`, 404)
    );
  }

  if (
    bootcamp.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to update this bootcamp`, 401)
    );
  }

  bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ status: true, data: bootcamp });
});

/**
 *
 * @description Delete a bootcamp
 * @route DELETE /api/v1/bootcamps/:id
 * @access Private
 */
export const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with the id: ${req.params.id}`, 404)
    );
  }

  if (
    bootcamp.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to delete this bootcamp`, 401)
    );
  }

  bootcamp.remove();

  res.status(200).json({ status: true, data: {} });
});

/**
 *
 * @description Get bootcamps within a radius
 * @route GET /api/v1/bootcamps/radius/:zipcode/:distance
 * @access Private
 */
export const getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lt/lng from geocoder
  const location = await geocoder.geocode(zipcode);
  const { latitude, longitude } = location[0];
  const coordinates = [longitude, latitude];

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth radius = 3.963 miles
  const EARTCH_RADIUS_IN_MILES = 3963;
  const radius = distance / EARTCH_RADIUS_IN_MILES;

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: {
        $centerSphere: [coordinates, radius]
      }
    }
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  })
});

/**
 *
 * @description Upload photo for bootcamp
 * @route PUT /api/v1/bootcamps/:id
 * @access Private
 */
export const bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with the id: ${req.params.id}`, 404)
    );
  }

  if (
    bootcamp.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to update this bootcamp`, 401)
    );
  }

  if (!req.files) {
    return next(
      new ErrorResponse(`Please upload a file`, 400)
    );
  }

  const { file } = req.files;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(
      new ErrorResponse(`Please upload a image file`, 400)
    )
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400)
    );
  }

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  // Save file in a teporary folder
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.log(err);
      return next(
        new ErrorResponse(`Problem with file upload`, 500)
      );
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, {
      photo: file.name
    });

    res.status(200).json({
      success: true,
      data: file.name
    });

  });

});
