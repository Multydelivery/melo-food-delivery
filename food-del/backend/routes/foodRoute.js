import express from 'express';
import { addFood, listFood, removeFood, updateFood, searchFood, getFoodById } from '../controllers/foodController.js';
import upload from '../config/cloudinary.js'; // Import the Cloudinary configuration

const foodRouter = express.Router();

// Use Cloudinary for image uploads
foodRouter.get("/list", listFood);
foodRouter.post("/add", upload.single('image'), addFood);
foodRouter.post("/remove", removeFood);
foodRouter.put("/update", upload.single('image'), updateFood); // Add the update route
foodRouter.get("/search", searchFood); // Add the search route
foodRouter.get("/:id", getFoodById); // Add the route for getting food by id

export default foodRouter;