import express from 'express';

import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courses';

import Course from '../models/Course';
import advancedResults from '../middlewares/advancedResults';

const router = express.Router({ mergeParams: true });

import { protect, authorize } from '../middlewares/auth';

router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description slug'
    }),
    getCourses
  )
  .post(protect, authorize('publisher', 'admin'), createCourse);

router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorize('publisher', 'admin'), updateCourse)
  .delete(protect, authorize('publisher', 'admin'), deleteCourse);

export default router;
