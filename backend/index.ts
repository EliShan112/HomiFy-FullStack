import express from "express";
import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import ExpressError from "./utils/ExpressError.js"
import listingRoutes from "./routes/listingRoute.js"
import reviewRoutes from "./routes/reviewRoute.js"
import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import { User } from "./models/user.js";
import session from "express-session";
import type { SessionOptions } from "express-session"
import userRoutes from "./routes/userRoute.js";
    
const app = express();
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());

const MONGO_URL = "mongodb://127.0.0.1:27017/Airbnb";

main()
    .then(()=>{
        console.log("Connected to db");
    })
    .catch((err)=>{
        console.log("Couldn't connected to db", err);
    })

async function main(){
    await mongoose.connect(MONGO_URL);
}


const sessionOptions: SessionOptions = {
    secret: "TheGreatSecretCodeOfEliShan112221",
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "lax",
        secure: false
    }

}

app.use(session(sessionOptions))

app.get('/', (req: Request, res: Response)=>{
    res.json({message: "This is homepage"});
})


//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// Serialize & Deserialize passport
passport.serializeUser(User.serializeUser() as any);
passport.deserializeUser(User.deserializeUser() as any);


//Routes
app.use("/listing", listingRoutes);
app.use("/listing/:id/review", reviewRoutes);
app.use("/", userRoutes);


app.all(/(.*)/, (req: Request, res: Response, next: NextFunction)=>{
    next(new ExpressError(404, "Page Not Found!"))
})

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    res.status(statusCode).json({ message });
});



const PORT = 4000;
app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`);
})