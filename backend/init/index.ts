import mongoose from "mongoose";
import { Listing } from "../models/listing.js";
import { initData } from "./data.js";

const MONGO_URL = "mongodb://127.0.0.1:27017/Airbnb";

main()
  .then(() => {
    console.log("✅ Connected to DB");
    initDB();
  })
  .catch((err) => {
    console.log("❌ Couldn't connect to DB:", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    const listingWithOwner = initData.map((obj)=>({...obj, owner: "68f6536c33cce7d3d966fab0"}));
    await Listing.insertMany(listingWithOwner);
    console.log("🌱 Database seeded successfully!");
  } catch (err) {
    console.log("❌ Error seeding data:", err);
  } finally {
    mongoose.connection.close();
  }
};
