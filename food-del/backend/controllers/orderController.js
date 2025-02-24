import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import { sendOrderNotification } from "../config/nodemailer.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//config variables
const currency = "usd";
const deliveryCharge = 5;
const frontend_URL = process.env.API_URL || 'http://localhost:5173';

// Placing User Order for Frontend using stripe
const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            phone: req.body.phone, // Add phone field
            currency: currency, // Add currency field
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

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
