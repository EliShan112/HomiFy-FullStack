import express from "express";
import { Router } from "express";
import { User } from "../models/user.js";
import asyncWrap from "../utils/asyncwrap.js"
import type { NextFunction, Request, Response } from "express";
import ExpressError from "../utils/ExpressError.js";
import passport from "passport";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = Router();

//signup
router.post("/signup", asyncWrap(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      throw new ExpressError(400, "All fields are required");
    }

    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    const cleanUser = {
      _id: registeredUser._id,
      username: registeredUser.username,
      email: registeredUser.email,
    };

    req.login(registeredUser, (err) => {
        if (err) return next(err);
        res.status(201).json({
            message: "Signup successful! Logged in automatically.",
            user: {
            _id: registeredUser._id,
            username: registeredUser.username,
            email: registeredUser.email,
            },
        });
    });


  } catch (err: any) {
    if (err.name === "UserExistsError") {
      throw new ExpressError(409, "Username already exists");
    }

    console.error("Signup error:", err);
    throw new ExpressError(500, "Something went wrong during signup");
  }
}));


//login
router.post("/login", asyncWrap( async (req: Request, res: Response, next: NextFunction)=>{
    passport.authenticate('local', (err: any, user: any, info: any)=>{
        if(err){
            return next( new ExpressError(500, err.message) );
        }

        if(!user){
            return next( new ExpressError(401, info.message || "Invalid credentials") );
        }

        req.login(user, (err)=>{
            if(err){
                return res.status(500).json({ error: err.message });
            }

            res.status(200).json({
                message: "Logged in successfully",
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email
                },
            });
        });
    })(req, res, next);
}))

router.get('/logout', (req: Request, res: Response, next: NextFunction) => {
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
    })
})

router.get("/check-auth", (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    const { _id, username, email } = req.user;
    return res.json({ isAuthenticated: true, user: { _id, username, email } });
  }
  return res.json({ isAuthenticated: false, user: null });
});


router.get("/me", isAuthenticated, (req: Request, res: Response)=> {
    return res.json(req.user);
})

export default router