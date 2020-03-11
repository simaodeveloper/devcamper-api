import jwt from 'jsonwebtoken';

import asyncHandler from './async';
import ErrorResponse from '../utils/ErrorResponse';

import User from '../models/User';


// Protect routes
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookie.token) {
    token = req.cookie.token;
  }

  if (!token) {
    next(new ErrorResponse('Not authorize to access this token', 401))
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    next(new ErrorResponse('Not authorize to access this token', 401))
  }
});

// Authorize actions
export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403)
    );
  }
  next();
};
