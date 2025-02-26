import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import { sendOrderNotification } from "../config/nodemailer.js";
import jwt from 'jsonwebtoken'; // Import jwt

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Config variables
const currency = "usd";
const frontend_URL = process.env.API_URL || 'http://localhost:5173';

// Placing User Order for Frontend using stripe
const placeOrder = async (req, res) => {
    try {
        // Decode the token to extract the user ID
        const decodedToken = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);
        const userId = decodedToken.id;

        const newOrder = new orderModel({
            userId: userId,
            items: req.body.items,
            amount: req.body.amount + req.body.deliveryCharge, // Add delivery charge to total amount
            address: req.body.address,
            phone: req.body.phone,
            currency: currency
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

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
                unit_amount: req.body.deliveryCharge * 100 // Use delivery charge from request
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder._id}`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                orderId: newOrder._id.toString(),
                email: req.body.email // Include email in metadata
            }
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log("Error in placeOrder:", error);
        res.json({ success: false, message: "Error" });
    }
};

// Stripe webhook endpoint
const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const orderId = session.metadata.orderId;
        const email = session.metadata.email;

        try {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });

            // Send order confirmation email
            await sendOrderNotification({
                _id: orderId,
                items: session.display_items,
                amount: session.amount_total / 100,
                address: session.shipping.address,
                phone: session.shipping.phone,
                currency: session.currency
            }, email);

            res.status(200).send('Success');
        } catch (error) {
            console.log("Error in stripeWebhook:", error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.status(400).send('Event type not handled');
    }
};

// Placing User Order for Frontend using cash on delivery
const placeOrderCod = async (req, res) => {
    try {
        // Decode the token to extract the user ID
        const decodedToken = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);
        const userId = decodedToken.id;

        const newOrder = new orderModel({
            userId: userId,
            items: req.body.items,
            amount: req.body.amount + req.body.deliveryCharge, // Add delivery charge to total amount
            address: req.body.address,
            phone: req.body.phone,
            payment: true,
            currency: currency
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // Debugging: Log email and order details
        console.log("Sending email to:", req.body.email);
        console.log("Order details:", newOrder);

        // Send email notification to the user
        await sendOrderNotification({
            _id: newOrder._id,
            items: req.body.items,
            amount: req.body.amount + req.body.deliveryCharge,
            address: req.body.address,
            phone: req.body.phone,
            currency: currency,
            deliveryCharge: req.body.deliveryCharge
        }, req.body.email);

        res.json({ success: true, message: "Order Placed" });
    } catch (error) {
        console.log("Error in placeOrderCod:", error);
        res.json({ success: false, message: "Error" });
    }
};

// Listing Order for Admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log("Error in listOrders:", error);
        res.json({ success: false, message: "Error" });
    }
};

// User Orders for Frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log("Error in userOrders:", error);
        res.json({ success: false, message: "Error" });
    }
};

const updateStatus = async (req, res) => {
    console.log(req.body);
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log("Error in updateStatus:", error);
        res.json({ success: false, message: "Error" });
    }
};

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
        console.log("Error in verifyOrder:", error);
        res.json({ success: false, message: "Not Verified" });
    }
};

export { placeOrder, listOrders, userOrders, updateStatus, verifyOrder, placeOrderCod, stripeWebhook };
