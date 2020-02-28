// Load env vars
import './utils/envSetup';

import express from 'express';
import colors from 'colors';
import morgan from 'morgan';

import errorHandler from './middlewares/error';

import connectDB from './config/db';

import bootcamps from './routes/bootcamps';
import courses from './routes/courses';

// Connect with the DB
connectDB();

const app = express();

const PORT = process.env.PORT || 5000;

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

app.use(errorHandler);

const server = app.listen(
  process.env.PORT,
  () => console.log(`Server running in ${process.env.NODE_ENV} mode on ${process.env.DOMAIN}:${PORT}`.yellow.bold)
);

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  // Close server and exit process with failure status
  server.close(() => process.exit(1));
})
