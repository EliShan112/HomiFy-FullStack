"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listing = void 0;
var mongoose_1 = require("mongoose");
var listingSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "https://unsplash.com/photos/coconut-palm-trees-in-hotel-lobby-_dS27XGgRyQ",
        set: function (v) { return v === "" ? "https://unsplash.com/photos/coconut-palm-trees-in-hotel-lobby-_dS27XGgRyQ" : v; },
    },
    price: Number,
    location: String,
    country: String,
});
exports.Listing = (0, mongoose_1.model)("Listing", listingSchema);
