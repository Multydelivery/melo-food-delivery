import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import { sendOrderNotification } from "../config/nodemailer.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Config variables
const currency = "usd";
const deliveryCharge = 5;
const frontend_URL = process.env.API_URL;  // Ensure this is set in your .env file for production

// Helper function to create line items for Stripe
function createLineItems(items) {
    const line_items = items.map(item => ({
        price_data: {
            currency: currency,
            product_data: {
                name: item.name
            },
            unit_amount: item.price * 100  // converting to cents
        },
        quantity: item.quantity
    }));

    line_items.push({
        price_data: {
            currency: currency,
            product_data: {
                name: "Delivery Charge"
            },
            unit_amount: deliveryCharge * 100  // converting to cents
        },
        quantity: 1
    });

    return line_items;
}

// Helper function to send order notification with detailed error logging
async function sendNotification(order, email) {
    try {
        await sendOrderNotification(order, email);
        console.log("Notification sent successfully to:", email);
        return { success: true };
    } catch (error) {
        console.error("Failed to send order notification:", error);
        return { success: false, error: error.message };
    }
}

// Placing User Order for Frontend using stripe
const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            phone: req.body.phone,
            currency: currency,
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = createLineItems(req.body.items);
        const session = await stripe.checkout.sessions.create({
            success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder._id}`,
            line_items: line_items,
            mode: 'payment',
        });

        const notificationResult = await sendNotification({
            _id: newOrder._id,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            phone: req.body.phone,
            currency: currency
        }, req.body.email);

        if (!notificationResult.success) {
            console.error(`Error sending notification: ${notificationResult.error}`);
            // Optionally handle the error, e.g., retry logic or alerting
        }

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error("Error in placeOrder:", error);
        res.status(500).json({ success: false, message: "Error processing your order" });
    }
};

// Placing User Order for Frontend using cash on delivery
const placeOrderCod = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            phone: req.body.phone,
            payment: true,
            currency: currency,
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const notificationResult = await sendNotification({
            _id: newOrder._id,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            phone: req.body.phone,
            currency: currency
        }, req.body.email);

        if (!notificationResult.success) {
            console.error(`Error sending notification: ${notificationResult.error}`);
        }

        res.json({ success: true, message: "Order Placed" });
    } catch (error) {
        console.error("Error in placeOrderCod:", error);
        res.status(500).json({ success: false, message: "Error" });
    }
};

// Listing Orders for Admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("Error in listOrders:", error);
        res.json({ success: false, message: "Error" });
    }
};

// User Orders for Frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("Error in userOrders:", error);
        res.json({ success: false, message: "Error" });
    }
};

// Update Order Status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.error("Error in updateStatus:", error);
        res.json({ success: false, message: "Error" });
    }
};

// Verify Order Payment
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not Paid" });
        }
    } catch (error) {
        console.error("Error in verifyOrder:", error);
        res.json({ success: false, message: "Not Verified" });
    }
};

export { placeOrder, listOrders, userOrders, updateStatus, verifyOrder, placeOrderCod };
