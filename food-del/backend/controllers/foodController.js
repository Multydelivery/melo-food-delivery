import foodModel from "../models/foodModel.js";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// all food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const addFood = async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: "Image file is required" });
    if (!req.body.name || !req.body.description || !req.body.price || !req.body.category) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'uploads',
            public_id: Date.now().toString() + '-' + req.file.originalname,
        });

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: result.secure_url,
        });

        await food.save();
        res.json({ success: true, message: "Food Added", data: food });
    } catch (error) {
        console.error("Error adding food:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// update food
const updateFood = async (req, res) => {
    try {
        const { id, name, description, price, category, image } = req.body;
        let updatedImage = image;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'uploads',
                public_id: Date.now().toString() + '-' + req.file.originalname,
            });
            updatedImage = result.secure_url;
        }

        const updatedFood = await foodModel.findByIdAndUpdate(id, {
            name,
            description,
            price,
            category,
            image: updatedImage,
        }, { new: true });

        res.json({ success: true, message: "Food Updated", data: updatedFood });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error" });
    }
};

// delete food
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);

        // Extract the public ID from the Cloudinary URL
        const publicId = food.image.split('/').pop().split('.')[0];

        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(`uploads/${publicId}`);

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// search food
const searchFood = async (req, res) => {
    try {
        const { query } = req.query;
        const results = await foodModel.find({ name: { $regex: query, $options: 'i' } });
        res.json({ success: true, data: results });
    } catch (error) {
        console.error('Error searching for food items:', error);
        res.status(500).json({ success: false, message: 'An error occurred while searching for food items' });
    }
};

// get food by id
const getFoodById = async (req, res) => {
    try {
        const food = await foodModel.findById(req.params.id);
        res.json({ success: true, data: food });
    } catch (error) {
        console.error('Error fetching food item:', error);
        res.status(500).json({ success: false, message: 'An error occurred while fetching the food item' });
    }
};

export { listFood, addFood, updateFood, removeFood, searchFood, getFoodById };