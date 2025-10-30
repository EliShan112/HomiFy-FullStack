import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import {validateListing} from "../middlewares/validateListings.js"
import asyncWrap from "../utils/asyncwrap.js"
import { Listing } from "../models/listing.js";
import {isAuthenticated} from "../middlewares/isAuthenticated.js"
import {isOwner} from "../middlewares/isOwner.js"

const router = Router();

router.get('/', asyncWrap(async (req: Request, res: Response) => {
    const listings = await Listing.find({});
    res.json(listings);
}));

router.get('/:id', asyncWrap(async (req: Request, res: Response) => {
        const { id } = req.params;
        const listing = await Listing.findById(id).populate({path: 'review', populate: {path: "author"}}).populate('owner');

        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }

        res.json(listing);
}));

router.post('/new', isAuthenticated, validateListing, asyncWrap(async (req: Request, res: Response, next:NextFunction)=>{

        const newListing = new Listing(req.body);
        newListing.owner = req.user!._id;
        await newListing.save();
        res.status(201).json(newListing);
}));

router.put('/:id', isAuthenticated, isOwner, validateListing, asyncWrap(async (req: Request, res: Response)=>{
        const {id} = req.params;
        const editedRes = await Listing.findByIdAndUpdate(id, req.body, {new:true, runValidators: true})
        if(!editedRes){
            return res.status(404).json({error: "Couldn't find listing"});
        }
        res.json(editedRes);
}));

router.delete('/:id', isAuthenticated, isOwner, asyncWrap(async (req: Request, res: Response)=>{
        const {id} = req.params;
        const deletedItem = await Listing.findByIdAndDelete(id);
        if(!deletedItem){
            return res.status(404).json({error: "Listing not found"})
        }
        res.json({message: "successfully deleted!"});
}));

export default router;