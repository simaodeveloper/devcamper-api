import express from 'express';

import { getReviews, getReview, createReview, updateReview, deleteReview } from '../controllers/reviews';

import Review from '../models/Review';

import advancedResults from '../middlewares/advancedResults';

import { protect, authorize } from '../middlewares/auth';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    advancedResults(Review, {
      path: 'bootcamp',
      select: 'name description'
    }),
    getReviews
  )
  .post(protect, authorize('user', 'admin'), createReview);

router
  .route('/:id')
  .get(getReview)
  .put(protect, authorize('user', 'admin'), updateReview)
  .delete(protect, authorize('user', 'admin'), deleteReview)

export default router;
