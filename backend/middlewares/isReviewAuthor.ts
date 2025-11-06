import type { NextFunction, Request, Response } from "express";
import ExpressError from "../utils/ExpressError.js";
import { Review } from "../models/review.js";
  
export const isReviewAuthor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let {reviewId} = req.params;
        let review = await Review.findById(reviewId);
        
        if(!review) throw new ExpressError(404, "Review not found!");

        if(!req.user) throw new ExpressError(401, "You must be logged in!");

        if(review.author && !review.author.equals(req.user._id)){
            throw new ExpressError(403, "You are not the Author of this review!")
        }
        next();

    } catch (err) {
        next(err);
    }

}