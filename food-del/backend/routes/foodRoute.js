import express from 'express';
import { addFood, listFood, removeFood } from '../controllers/foodController.js';
import upload from '../config/cloudinary.js'; // Import the Cloudinary configuration

const foodRouter = express.Router();

// Use Cloudinary for image uploads
foodRouter.get("/list", listFood);
foodRouter.post("/add", upload.single('image'), addFood);
foodRouter.post("/remove", removeFood);

export default foodRouter;