import express from 'express';
import dotenv from 'dotenv';

import bootcamps from './routes/bootcamps';

// Load env vars
dotenv.config({ path: './config/config.env' });

const {
  NODE_ENV = 'development',
  PORT = 5000,
  DOMAIN,
} = process.env;

const app = express();

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

app.listen(
  PORT,
  () => console.log(`Server running in ${NODE_ENV} mode on  ${DOMAIN}:${PORT}`)
);
