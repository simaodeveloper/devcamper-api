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
  res.status(200).json({ success: true });
});
