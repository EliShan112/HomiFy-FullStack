import type { NextFunction, Request, Response } from "express";
import {reviewJoiSchema} from "../joiSchema.js"
import ExpressError from "../utils/ExpressError.js";


export const validateReview = (req:Request, res:Response, next:NextFunction) =>{
    const {error} = reviewJoiSchema.validate(req.body, {abortEarly: false})
        if(error){
            const msg = error.details.map(el => el.message).join(",")
            throw new ExpressError(400, msg);
        } else{
            next();
        }
}