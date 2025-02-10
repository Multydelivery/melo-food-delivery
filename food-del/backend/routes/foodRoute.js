import express from 'express';
import multer from 'multer';
import { addFood, listFood, removeFood } from '../controllers/foodController.js';

const upload = multer({ dest: 'uploads/' }); // Configure multer to save files to the 'uploads' directory

const router = express.Router();

router.get('/list', listFood);
router.post('/add', upload.single('image'), addFood); // Use multer middleware for file upload
router.post('/remove', removeFood);

export default router;