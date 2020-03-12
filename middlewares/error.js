import ErrorResponse from '../utils/ErrorResponse';

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  console.dir(err);

  error.message = err.message;

  if (err.name === 'CastError') {
    error = new ErrorResponse(`Resource not found`, 404);
  }

  if (err.code === 11000) {
    error = new ErrorResponse('Duplicate field value entered', 400);
  }

  if (err.name === 'ValidationError') {
    error = new ErrorResponse(Object.values(err.errors).map(error => error.message), 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Error Server'
  });
};

export default errorHandler;
