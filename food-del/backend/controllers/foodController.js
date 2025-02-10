import foodModel from "../models/foodModel.js";
import cloudinary from '../config/cloudinary.js'; // Import the Cloudinary configuration

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

// add food
const addFood = async (req, res) => {
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
            image: result.secure_url, // Cloudinary URL
        });

        await food.save();
        res.json({ success: true, message: "Food Added", data: food });
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

export { listFood, addFood, removeFood };