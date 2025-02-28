import userModel from "../models/userModel.js";

// Get user cart
const getCart = async (req, res) => {
   try {
     console.log("Authenticated user ID:", req.user.id); // Debugging log
     const userData = await userModel.findById(req.user.id);
     if (!userData) {
       return res.status(404).json({ success: false, message: "User not found" });
     }
 
     console.log("User data from database:", userData); // Debugging log
     const cartData = userData.cartData || {};
     console.log("Fetched cart data:", cartData); // Debugging log
     res.json({ success: true, cartData });
   } catch (error) {
     console.error("Error fetching cart:", error);
     res.status(500).json({ success: false, message: "Internal Server Error" });
   }
 };
 
 // Add to user cart
 const addToCart = async (req, res) => {
   try {
     const userData = await userModel.findById(req.user.id);
     if (!userData) {
       return res.status(404).json({ success: false, message: "User not found" });
     }
 
     let cartData = userData.cartData || {}; // Ensure cartData is an object
     if (!cartData[req.body.itemId]) {
       cartData[req.body.itemId] = 1;
     } else {
       cartData[req.body.itemId] += 1;
     }
 
     await userModel.findByIdAndUpdate(req.user.id, { cartData });
     res.json({ success: true, message: "Added To Cart", cartData });
   } catch (error) {
     console.error("Error adding to cart:", error);
     res.status(500).json({ success: false, message: "Internal Server Error" });
   }
 };
 
 // Remove food from user cart
 const removeFromCart = async (req, res) => {
   try {
     const userData = await userModel.findById(req.user.id);
     if (!userData) {
       return res.status(404).json({ success: false, message: "User not found" });
     }
 
     let cartData = userData.cartData || {}; // Ensure cartData is an object
     if (cartData[req.body.itemId] > 0) {
       cartData[req.body.itemId] -= 1;
       if (cartData[req.body.itemId] === 0) {
         delete cartData[req.body.itemId]; // Remove the item if quantity is 0
       }
     }
 
     await userModel.findByIdAndUpdate(req.user.id, { cartData });
     res.json({ success: true, message: "Removed From Cart", cartData });
   } catch (error) {
     console.error("Error removing from cart:", error);
     res.status(500).json({ success: false, message: "Internal Server Error" });
   }
 };
export { addToCart, removeFromCart, getCart };