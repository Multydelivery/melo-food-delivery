import express from 'express';
import multer from 'multer';
import { addFood, listFood, removeFood } from '../controllers/foodController.js';
import authMiddleware from '../middleware/auth.js'; // Import the authentication middleware

const storage = multer.memoryStorage(); // Use memory storage
const upload = multer({ storage }); // Configure multer to use memory storage

const foodRouter = express.Router();

foodRouter.get("/list", listFood);
foodRouter.post("/add", authMiddleware, upload.single('image'), addFood); // Use multer middleware for file upload
foodRouter.post("/remove", authMiddleware, removeFood);

export default foodRouter;