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

app.get('/api/v1/bootcamps', (req, res) => {
  res.status(200).send({ success: true, msg: 'Show all bootcamps' });
});

app.get('/api/v1/bootcamps/:id', (req, res) => {
  res.status(200).send({ success: true, msg: `Get bootcamp ${req.params.id}` });
});

app.post('/api/v1/bootcamps', (req, res) => {
  res.status(201).send({ success: true, msg: 'Create new bootcamp' });
});

app.put('/api/v1/bootcamps/:id', (req, res) => {
  res.status(200).send({ success: true, msg: `Update bootcamp ${req.params.id}` });
});

app.delete('/api/v1/bootcamps/:id', (req, res) => {
  res.status(200).send({ success: true, msg: `Delete bootcamp ${req.params.id}` });
});

app.listen(
  PORT,
  () => console.log(`Server running in ${NODE_ENV} mode on  ${DOMAIN}:${PORT}`)
);
