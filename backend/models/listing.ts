import mongoose, { Schema, model, Document, Types } from "mongoose";
import { Review } from "./review.js";

export interface IListing extends Document{
    title: string;
    description: string;
    image: {
        url: string; 
        filename: string;
    }
    price: number;
    location: string;
    country: string;
    review: Types.ObjectId[];
    owner: Types.ObjectId;
    geometry: {
        type: string;
        coordinates: number[];
    }
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
        url: String,
        filename: String
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
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
})

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.review}})
    }
})

export const Listing = model<IListing>("Listing", listingSchema);