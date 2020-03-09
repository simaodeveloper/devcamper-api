import express from 'express';

import { register, login, getMe } from '../controllers/auth';

const router = express.Router();

import { protect } from '../middlewares/auth';

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

export default router;
