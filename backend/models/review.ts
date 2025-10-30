import { Schema, model, Document, Types } from "mongoose";

export interface IReview extends Document{
    comment: string;
    rating: number;
    createdAt: Date;
    author: Types.ObjectId;
}


const reviewSchema = new Schema<IReview>({
    comment: String,
    
    rating: {
        type: Number, 
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

export const Review = model<IReview>("Review", reviewSchema);