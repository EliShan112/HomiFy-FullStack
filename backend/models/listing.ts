import mongoose, { Schema, model, Document, Types } from "mongoose";
import { Review } from "./review.js";

export interface IListing extends Document{
    title: string;
    description: string;
    image: string;
    price: number;
    location: string;
    country: string;
    review: Types.ObjectId[];
    owner: Types.ObjectId;
}

const listingSchema = new Schema<IListing>({
    title:{
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    image: {
        url:{
            type: String,
            default: "https://unsplash.com/photos/coconut-palm-trees-in-hotel-lobby-_dS27XGgRyQ",
            set: (v: string)=> v === "" ? "https://unsplash.com/photos/coconut-palm-trees-in-hotel-lobby-_dS27XGgRyQ" : v,
        }
    },

    price: {
        type: Number,
        required: true
    },

    location: {
        type: String,
        required: true,
    },

    country: {
        type: String,
        required: true,
    },
    review:[
        {
        type: mongoose.Types.ObjectId,
        ref: "Review"
    }   
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.review}})
    }
})

export const Listing = model<IListing>("Listing", listingSchema);