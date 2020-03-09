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

  sendTokenResponse(user, 200, res);
});

/**
 *
 * @description Login user
 * @route POST /api/v1/auth/login
 * @access Public
 */
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

/**
 *
 * @description Get the logged user
 * @route GET /api/v1/auth/me
 * @access Private
 */

export const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res
    .status(200)
    .json({
      success: true,
      data: user
    })
});

//Get token from model,create cookie and send response
const sendTokenResponse = function (user, statusCode, res) {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      token,
      success: true
    });
}
