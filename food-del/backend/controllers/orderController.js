import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import { sendOrderNotification } from "../config/nodemailer.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//config variables
const currency = "usd";
const deliveryCharge = 5;
const frontend_URL = 'http://localhost:5173';

// Placing User Order for Frontend using stripe
const placeOrder = async (req, res) => {
    try {
        const currentDate = new Date();
        const currentHour = currentDate.getHours();

        // Check if the current time is within the allowed range (8:00 AM to 10:00 PM)
        if (currentHour < 9 || currentHour >= 22) {
            return res.status(400).json({ success: false, message: 'Orders can only be placed between 8:00 AM and 10:00 PM' });
        }

        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            phone: req.body.phone, // Add phone field
            currency: currency, // Add currency field
        });
        await newOrder.save();

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charge"
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder._id}`,
            line_items: line_items,
            mode: 'payment',
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Placing User Order for Frontend using cash on delivery
const placeOrderCod = async (req, res) => {
    try {
        const currentDate = new Date();
        const currentHour = currentDate.getHours();

        // Check if the current time is within the allowed range (9:00 AM to 10:00 PM)
        if (currentHour < 9 || currentHour >= 22) {
            return res.status(400).json({ success: false, message: 'Orders can only be placed between 9:00 AM and 10:00 PM' });
        }

        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            phone: req.body.phone, // Add phone field
            payment: true,
            currency: currency, // Add currency field
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Debugging: Log email and order details
        console.log("Sending email to:", req.body.email);
        console.log("Order details:", newOrder);

        // Send email notification to the user
        await sendOrderNotification({
            _id: newOrder._id,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            phone: req.body.phone, // Pass phone field
            currency: currency
        }, req.body.email);

        res.json({ success: true, message: "Order Placed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Listing Order for Admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// User Orders for Frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const updateStatus = async (req, res) => {
    console.log(req.body);
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        res.json({ success: false, message: "Error" });
    }
};

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });

            // Send order confirmation email
            const order = await orderModel.findById(orderId);
            await sendOrderNotification({
                _id: order._id,
                items: order.items,
                amount: order.amount,
                address: order.address,
                phone: order.phone, // Pass phone field
                currency: order.currency
            }, req.body.email);

            // Clear the cart after successful payment
            await userModel.findByIdAndUpdate(order.userId, { cartData: {} });

            res.json({ success: true, message: "Paid" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not Paid" });
        }
    } catch (error) {
        res.json({ success: false, message: "Not Verified" });
    }
};

export { placeOrder, listOrders, userOrders, updateStatus, verifyOrder, placeOrderCod };