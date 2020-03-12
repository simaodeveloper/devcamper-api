import express from 'express';

import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/users';

import User from '../models/User';

const router = express.Router({ mergeParams: true });

import advancedResults from '../middlewares/advancedResults';
import { protect, authorize } from '../middlewares/auth';

router.use(protect);
router.use(authorize('admin'));

router
  .route('/')
  .get(advancedResults(User), getUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

export default router;
