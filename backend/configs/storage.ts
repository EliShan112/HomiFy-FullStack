import {v2 as cloudinary} from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';


dotenv.config();


console.log("--- LOADING CLOUDINARY CONFIG ---");
console.log("CLOUD_NAME:", process.env.CLOUD_NAME);
console.log("CLOUD_API_KEY:", process.env.CLOUD_API_KEY ? "Loaded" : "!!! UNDEFINED !!!");
console.log("CLOUD_API_SECRET:", process.env.CLOUD_API_SECRET ? "Loaded" : "!!! UNDEFINED !!!");

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})


// Configure Multer storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'homify',
        allowedFormats: ['jpeg', 'png', 'jpg']
    } as any
})

const upload = multer({storage: storage});

export default upload;