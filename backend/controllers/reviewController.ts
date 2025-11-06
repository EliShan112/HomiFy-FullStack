    import { Listing } from "../models/listing.js";
    import type { Request, Response } from "express";
    import { Review } from "../models/review.js";
    import { Types } from "mongoose";


    export const createReview = async (req: Request, res: Response)=>{
        //destructuring
        const {id} = req.params;
        const {rating, comment} = req.body;

        //listing finding
        let listing = await Listing.findById(id);
        if (!listing) return res.status(404).json({ error: "No listing found" });

            //making new review
            let newReview = new Review({
                rating, 
                comment, 
                author: req.user?._id
            });

        await newReview.save();
        await newReview.populate('author', 'username');


        listing.review.push(newReview._id as Types.ObjectId);
        await listing.save();

        res.status(201).json({message: "Review added successfully", review: newReview})
    }



    export const destroyReview = async (req: Request, res: Response)=>{
        const {id, reviewId} = req.params;
        await Review.findByIdAndDelete(reviewId);
        await Listing.findByIdAndUpdate(id, {$pull: {review: reviewId}});
        res.status(200).json({ message: "Review deleted successfully" });
    }