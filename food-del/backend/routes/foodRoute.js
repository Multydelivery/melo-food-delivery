import express from 'express';
import { addFood, listFood, removeFood, updateFood } from '../controllers/foodController.js';
import upload from '../config/cloudinary.js'; // Import the Cloudinary configuration

const foodRouter = express.Router();

// Use Cloudinary for image uploads
foodRouter.get("/list", listFood);
foodRouter.post("/add", upload.single('image'), addFood);
foodRouter.post("/remove", removeFood);
foodRouter.put("/update", upload.single('image'), updateFood); // Add the update route

export default foodRouter;