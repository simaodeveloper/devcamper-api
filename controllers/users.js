import ErrorResponse from '../utils/ErrorResponse';
import asyncHandler from '../middlewares/async';

import User from '../models/User';

/**
 *
 * @description Get Users
 * @route GET /api/v1/users
 * @access Private
 */
export const getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

/**
 *
 * @description Get Single User
 * @route GET /api/v1/users/:id
 * @access Private
 */
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with the id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 *
 * @description Create User
 * @route POST /api/v1/users
 * @access Private
 */
export const createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user
  });
});

/**
 *
 * @description Update User
 * @route PUT /api/v1/users/:id
 * @access Private
 */
export const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(
      new ErrorResponse(`User not found with the id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 *
 * @description Delete User
 * @route DELETE /api/v1/users/:id
 * @access Private
 */
export const deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});
