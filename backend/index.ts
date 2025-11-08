import express from "express";
import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import ExpressError from "./utils/ExpressError.js";
import listingRoutes from "./routes/listingRoute.js";
import reviewRoutes from "./routes/reviewRoute.js";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "./models/user.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import type { SessionOptions } from "express-session";
import userRoutes from "./routes/userRoute.js";
import dotenv from "dotenv";
import asyncWrap from "./utils/asyncwrap.js";
import { indexListing } from "./controllers/listingController.js";

dotenv.config();

const app = express();

//Cors
app.use(
  cors({
    origin: process.env.CLIENT_URL as string,
    credentials: true,
  })
);

//Db connection
const MONGO_URI = process.env.MONGO_URI;
main()
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log("Couldn't connected to db", err);
  });

async function main() {
  await mongoose.connect(MONGO_URI as string);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//mongostore
const store = MongoStore.create({
  mongoUrl: MONGO_URI,
  crypto: {
    secret: process.env.SESSION_SECRET as string,
  },
  touchAfter: 24 * 3600, //in seconds
});

store.on("error", (err) => {
  console.log("ERROR IN MONGO STORE", err);
});

//session options
const sessionOptions: SessionOptions = {
  store,
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    secure: true,
  },
};

app.use(session(sessionOptions));

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// Serialize & Deserialize passport
passport.serializeUser(User.serializeUser() as any);
passport.deserializeUser(User.deserializeUser() as any);

app.get('/', asyncWrap(indexListing));

//Multer route
app.use("/listing", listingRoutes);

//Routes
app.use("/listing/:id/review", reviewRoutes);
app.use("/", userRoutes);

app.all(/(.*)/, (req: Request, res: Response, next: NextFunction) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";
  res.status(statusCode).json({ message });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
