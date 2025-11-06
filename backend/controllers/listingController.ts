import { Listing } from "../models/listing.js";
import type { NextFunction, Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import ExpressError from "../utils/ExpressError.js";

export const indexListing = async (req: Request, res: Response) => {
  const listings = await Listing.find({});
  res.json(listings);
};

export const getListing = async (req: Request, res: Response) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "review", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    return res.status(404).json({ error: "Listing not found" });
  }

  res.json(listing);
};

// Creating the new listing
export const createNewListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    console.log("no req.user");
    return res
      .status(401)
      .json({ message: "You must be logged in to create a listing" });
  }

  const { title, description, price, country, location } = req.body;

  // Validate required fields
  if (!title || !description || !price || !country || !location) {
    return res.status(400).json({
      message: "All fields are required",
      missing: {
        title: !title,
        description: !description,
        price: !price,
        country: !country,
        location: !location,
      },
    });
  }

  //Validating file upload
  if (!req.file) {
    return res.status(400).json({ message: "Image is required" });
  }

  let geometry;

  try {
    // Format the URL for the Nominatim API
    const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      location
    )}&format=json&limit=1`;

    // Fetch the coordinates
    const geoRes = await axios(geoUrl, {
      headers: { "User-Agent": "Homify/1.0 (mailto:asifkausar112@gmail.com)" },
    });

    if (!geoRes.data || geoRes.data.length === 0) {
      return res
        .status(400)
        .json({ message: "Could not find coordinates for this location" });
    }

    // Create the geometry object [longitude, latitude]
    geometry = {
      type: "Point",
      coordinates: [
        parseFloat(geoRes.data[0].lon), //longitude
        parseFloat(geoRes.data[0].lat), //latitude
      ],
    };
  } catch (err) {
    console.error("Geocoding service failed:", err);
    return next(new ExpressError(500, "Geocoding service failed."));
  }

  const newListing = new Listing({
    title,
    description,
    price,
    country,
    location,
    geometry: geometry,
    owner: req.user._id,
    image: {
      url: req.file?.path,
      filename: req.file?.filename,
    },
  });
  await newListing.save();
  res.status(201).json(newListing);
};

export const updateListing = async (req: Request, res: Response) => {
  const { id } = req.params;

  //   Find the listing by ID
  const listing = await Listing.findById(id);

  if (!listing) {
    return res.status(404).json({ error: "Couldn't find listing" });
  }

  // Updating all text fields from listing document that I will get from req.body
  Object.assign(listing, req.body);

  if (req.body.location) {
    console.log("Location changed, re-geocoding...");
    const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      req.body.location
    )}&format=json&limit=1`;

    const geoRes = await axios(geoUrl, {
      headers: { "User-Agent": "Homify/1.0 (mailto:asifkausar112@gmail.com)" },
    });

    if (!geoRes.data || geoRes.data.length === 0) {
      return res
        .status(400)
        .json({ message: "Could not find coordinates for this location" });
    }

    listing.geometry = {
      type: "Point",
      coordinates: [
        parseFloat(geoRes.data[0].lon),
        parseFloat(geoRes.data[0].lat),
      ],
    };
  }

  // Checking if a new file was uploaded
  if (req.file) {
    const oldFilename = listing.image.filename;

    listing.image = {
      url: req.file?.path,
      filename: req.file?.filename,
    };

    try {
      if (oldFilename) {
        await cloudinary.uploader.destroy(oldFilename);
        console.log("Successfully deleted the old image");
      }
    } catch (err) {
      console.error("Failed to delete old image from Cloudinary:", err);
    }
  }

  await listing.save();

  res.json(listing);
};

export const searchListings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const query = req.query.q as string;
  if (!query) {
    return res.status(400).json({ message: "Search query is required." });
  }

  // Geocode the search query
  let coordinates: number[];

  try {
    const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json&limit=1`;

    const geoRes = await axios(geoUrl, {
      headers: { "User-Agent": "Homify/1.0 (mailto:asifkausar112@gmail.com)"},
      timeout: 10000
    });

    if (!geoRes.data || geoRes.data.length === 0) {
      return res.json([]);
    }

    coordinates = [
      parseFloat(geoRes.data[0].lon),
      parseFloat(geoRes.data[0].lat),
    ];
  } catch (err) {
    console.error("--- GEOCODING SERVICE ERROR ---");
    if (axios.isAxiosError(err)) {
    // This logs the specific network error, e.g., "Network Error", "ECONNRESET"
    console.error("Axios Error Message:", err.message); 
    console.error("Axios Error Code:", err.code);

    // We still log these just in case
    console.error("Axios Status:", err.response?.status);
    console.error("Axios Data:", err.response?.data);
  } else {
    // Log any other non-Axios error
    console.error("Raw Error:", err);
  }
    return next(new ExpressError(500, "Geocoding service failed."));
  }

  // Use $near to find listings
  // This finds all listings near the [lon, lat]
  // within 50 kilometers (50000 meters)
  const listings = await Listing.find({
    geometry: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: coordinates,
        },
        $maxDistance: 50000,
      },
    },
  });

  res.json(listings);
};

// deleting the listing
export const destroyListing = async (req: Request, res: Response) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    res.status(404).json({ error: "Listing not found" });
  }

  if (listing?.image && listing?.image.filename) {
    try {
      await cloudinary.uploader.destroy(listing.image.filename);
    } catch (err) {
      console.error("Failed to delete image from Cloudinary:", err);
    }
  }

  await Listing.findByIdAndDelete(id);

  res.json({ message: "successfully deleted!" });
};
