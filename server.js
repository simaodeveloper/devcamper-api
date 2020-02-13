import express from 'express';
import dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: './config/config.env' });

const {
  NODE_ENV = 'development',
  PORT = 5000,
  DOMAIN,
} = process.env;

const app = express();

app.listen(
  PORT,
  () => console.log(`Server running in ${NODE_ENV} mode on  ${DOMAIN}:${PORT}`)
);
