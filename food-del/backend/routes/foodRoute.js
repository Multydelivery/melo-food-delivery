import express from 'express';
import multer from 'multer';
import { addFood, listFood, removeFood, updateFood } from '../controllers/foodController.js';
import authMiddleware from '../middleware/auth.js'; // Import the authentication middleware

const upload = multer({ dest: 'uploads/' }); // Configure multer to save files to the 'uploads' directory

const router = express.Router();

router.get('/list', listFood);
router.post('/add', authMiddleware, upload.single('image'), addFood); // Use multer middleware for file upload
router.post('/remove', authMiddleware, removeFood);
router.put('/update', authMiddleware, upload.single('image'), updateFood); // Add the update route

export default router;