import asyncWrap from "../utils/asyncwrap.js"
import {validateReview} from "../middlewares/validateReview.js";
import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {isReviewAuthor} from "../middlewares/isReviewAuthor.js";
import { destroyReview, createReview } from "../controllers/reviewController.js";

const router = Router({mergeParams: true});


router.post('/', isAuthenticated, validateReview, asyncWrap(createReview));

router.delete('/:reviewId', isAuthenticated, isReviewAuthor, asyncWrap(destroyReview));


export default router;