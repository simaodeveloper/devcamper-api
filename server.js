// Load env vars
import './utils/envSetup';

import path from 'path';

import 'colors';

import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cors from 'cors';
import helmet from 'helmet';
import xss from 'xss-clean';

import errorHandler from './middlewares/error';

import connectDB from './config/db';

import bootcamps from './routes/bootcamps';
import courses from './routes/courses';
import auth from './routes/auth';
import users from './routes/users';
import reviews from './routes/reviews';

// Connect with the DB
connectDB();

const app = express();

const PORT = process.env.PORT || 5000;

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File uploading
app.use(fileUpload());

// Sanitize data
app.use(mongoSanitize());

// Set security to headers
app.use(helmet());

// Prevent XSS Attacks
app.use(xss());

// Set Rate Limit
app.use(rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // requests
}));

// Enable CORS
app.use(cors());

// Prevent Header Polution
app.use(hpp());

// Set static folder
app.use(express.static(path.resolve(process.cwd(), 'public')));

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

app.use(errorHandler);

const server = app.listen(
  process.env.PORT,
  () => console.log(`Server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`.yellow.bold)
);

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  // Close server and exit process with failure status
  server.close(() => process.exit(1));
})
