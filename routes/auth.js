import express from 'express';

import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword
} from '../controllers/auth';

const router = express.Router();

import { protect } from '../middlewares/auth';

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

export default router;
