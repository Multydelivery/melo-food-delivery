// Import necessary modules
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com', // Namecheap's private email SMTP server
    port: 587, // Port for TLS/STARTTLS
    secure: false, // Use TLS/STARTTLS
    auth: {
        user: process.env.NAMECHEAP_EMAIL_USER,
        pass: process.env.NAMECHEAP_EMAIL_PASS,
    }
});

// Function to send an order confirmation email
export const sendOrderNotification = (orderDetails, userEmail) => {
    const itemsList = orderDetails.items.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${orderDetails.currency}${item.price.toFixed(2)}</td>
            <td>${orderDetails.currency}${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
    `).join('');

    const deliveryCharge = 5.00;
    const totalAmount = (orderDetails.items.reduce((total, item) => total + item.price * item.quantity, 0) + deliveryCharge).toFixed(2);

    const mailOptions = {
        from: process.env.NAMECHEAP_EMAIL_USER,  // Sender address from environment variable
        to: userEmail,                   // Recipient's email address
        subject: 'Order Confirmation',   // Subject line of the email
        html: `                          
            <div style="text-align: center;">
                <img src="https://your-public-url.com/public/default-monochrome-black.svg" alt="Logo" style="width: 150px; height: auto;"/>
            </div>
            <h1>Order Confirmation</h1>
            <p>Thank you for your order!</p>
            <p>Your order details are as follows:</p>
            <table border="1" cellpadding="10" cellspacing="0" style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsList}
                    <tr>
                        <td colspan="3"><strong>Delivery Charge</strong></td>
                        <td>${orderDetails.currency}${deliveryCharge.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="3"><strong>Total Amount</strong></td>
                        <td><strong>${orderDetails.currency}${totalAmount}</strong></td>
                    </tr>
                </tbody>
            </table>
            <p><strong>Delivery Address:</strong> ${orderDetails.address.street}, ${orderDetails.address.city}, ${orderDetails.address.state}, ${orderDetails.address.zipcode}</p>
            <p><strong>Phone Number:</strong> ${orderDetails.phone}</p>
            <p>If you have any questions, please reply to this email.</p>
        `
    };

    // Sending the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent successfully: ' + info.response);
        }
    });
};