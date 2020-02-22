import ErrorResponse from '../utils/ErrorResponse';
import asyncHandler from '../middlewares/async';
import geocoder from '../utils/geocoder';
import transformQueryConditional from '../utils/query';

import Bootcamp from '../models/Bootcamps';

/**
 *
 * @description Get All bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */

export const getBootcamps = asyncHandler(async (req, res, next) => {
  let query = { ...req.query };

  // Remove custom field to first search in DB
  const filterFields = ['select', 'sort', 'page', 'limit'];

  filterFields.forEach(filter => delete query[filter]);

  query = transformQueryConditional(query);

  // Find bootcamps based on mongoDB valid query
  query = Bootcamp.find(query);

  // Apply Select Filter
  if (req.query.select) {
    query = query.select(req.query.select.replace(',', ' '));
  }

  // Apply Sort Filter
  if (req.query.sort) {
    query = query.sort(req.query.sort.replace(',', ' '));
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 1;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  // Ignore documents per page
  query = query.skip(startIndex).limit(limit);

  // Get result after all filters
  const bootcamps = await query;

  // Pagination result
  const pagination = {};

  if (startIndex > 0) {
    pagination.prev = {
      limit,
      page: page - 1,
    };
  }

  if (endIndex < total) {
    pagination.next = {
      limit,
      page: page + 1,
    };
  }

  res.status(200).send({
    pagination,
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
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
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with the id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ status: true, data: bootcamp });
});

/**
 *
 * @description Delete a bootcamp
 * @route DELETE /api/v1/bootcamps/:id
 * @access Private
 */
export const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndRemove(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with the id: ${req.params.id}`, 404)
    );
  }

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
