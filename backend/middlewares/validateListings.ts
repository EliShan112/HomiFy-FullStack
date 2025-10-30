import type { NextFunction, Request, Response } from "express";
import { listingJoiSchema } from "../joiSchema.js";
import ExpressError from "../utils/ExpressError.js";


export const validateListing = (req:Request, res:Response, next:NextFunction) =>{
    const {error} = listingJoiSchema.validate(req.body, {abortEarly: false})
        if(error){
            const msg = error.details.map(el => el.message).join(",")
            throw new ExpressError(400, msg);
        } else{
            next();
        }
}