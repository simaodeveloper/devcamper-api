import ErrorResponse from '../utils/ErrorResponse';
import asyncHandler from '../middlewares/async';

import User from '../models/User';

/**
 *
 * @description Register user
 * @route POST /api/v1/auth/register
 * @access Public
 */
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role
  });

  res
    .status(201)
    .json({ success: true });
});
