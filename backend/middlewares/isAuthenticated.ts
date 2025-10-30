//Find if user logged in
import type { NextFunction, Request, Response } from "express";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if(req.isAuthenticated && req.isAuthenticated() ){
        return next();
    }
    else{
        // For API routes, return 401 with redirect info
        return res.status(401).json({ 
            message: "Not authenticated", 
            redirectTo: req.originalUrl 
        });
    }
}