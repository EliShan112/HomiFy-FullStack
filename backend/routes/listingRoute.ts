import { Router } from "express";
import { validateListing } from "../middlewares/validateListings.js";
import asyncWrap from "../utils/asyncwrap.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isOwner } from "../middlewares/isOwner.js";
import {
  index,
  getListing,
  createNewListing,
  updateListing,
  destroyListing,
} from "../controllers/listingController.js";
import upload from "../configs/storage.js";

const router = Router();

router.get("/", asyncWrap(index));

router.post(
  "/new",
  isAuthenticated,
  upload.single("image"),
  validateListing,
  asyncWrap(createNewListing)
);

router
  .route("/:id")
  .get(asyncWrap(getListing))
  .put(
    isAuthenticated,
    isOwner,
    upload.single("image"),
    validateListing,
    asyncWrap(updateListing)
  )
  .delete(isAuthenticated, isOwner, asyncWrap(destroyListing));

export default router;
