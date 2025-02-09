import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // This line loads the .env file contents into process.env

const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io', // Mailtrap SMTP host
    port: 2525, // Mailtrap SMTP port
    auth: {
        user: process.env.MAILTRAP_USER, // Using environment variable for Mailtrap username
        pass: process.env.MAILTRAP_PASS  // Using environment variable for Mailtrap password
    }
});

export const sendOrderNotification = (orderDetails, userEmail) => {
    const mailOptions = {
        from: process.env.SENDER_EMAIL, // Using environment variable for sender email
        to: userEmail,                  // User's email address
        subject: 'New Order Confirmation',
        html: `
            <h1>Thank you for your order!</h1>
            <p>Here are the details:</p>
            <ul>
                <li><strong>Order ID:</strong> ${orderDetails._id}</li>
                <li><strong>Amount:</strong> $${orderDetails.amount}</li>
                <li><strong>Address:</strong> ${orderDetails.address.street}, ${orderDetails.address.city}, ${orderDetails.address.state}, ${orderDetails.address.zipcode}, ${orderDetails.address.country}</li>
                <li><strong>Items:</strong></li>
                <ul>
                    ${orderDetails.items.map(item => `
                        <li>${item.name} - ${item.quantity} x $${item.price}</li>
                    `).join('')}
                </ul>
            </ul>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};
