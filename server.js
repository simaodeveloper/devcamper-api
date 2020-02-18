import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import morgan from 'morgan';

import connectDB from './config/db';

import bootcamps from './routes/bootcamps';

// Load env vars
dotenv.config({ path: './config/config.env' });

connectDB();

const {
  NODE_ENV = 'development',
  PORT = 5000,
  DOMAIN,
} = process.env;

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (NODE_ENV === 'development') {
  const MORGAN_FORMAT = 'dev';
  app.use(morgan(MORGAN_FORMAT));
}

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

const server = app.listen(
  PORT,
  () => console.log(`Server running in ${NODE_ENV} mode on ${DOMAIN}:${PORT}`.yellow.bold)
);

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  // Close server and exit process with failure status
  server.close(() => process.exit(1));
})
