import type { NextFunction, Request, Response } from "express";
import {Listing} from "../models/listing.js";
import ExpressError from "../utils/ExpressError.js";

interface CustomRequest extends Request {
  user?: {
    _id: any;
    username: string;
    email: string;
  };
}

export const isOwner = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      let {id} = req.params;
      let listing = await Listing.findById(id);
      
      if(!listing) throw new ExpressError(404, "Listing not found!");

      if(!req.user) throw new ExpressError(401, "You must be logged in!");

      if(!listing.owner.equals(req.user._id)){
          throw new ExpressError(403, "You are not Owner")
      }

      next();
    } catch (err) {
      next(err);
    }
}