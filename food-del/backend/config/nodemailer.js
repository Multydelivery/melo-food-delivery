import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_EMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: process.env.GOOGLE_ACCESS_TOKEN, // Optional, Nodemailer will generate this automatically
    },
});

transporter.on('error', (error) => {
    console.error('Error with the email transporter:', error);
});

export const sendOrderNotification = async (orderDetails, userEmail) => {
    const itemsList = orderDetails.items.map(item => `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;">
          <img src="${item.image}" alt="${item.name}" style="width: 100px; height: auto; display: block; margin: 0 auto;">
        </td>
        <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${item.description}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${orderDetails.currency}${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${orderDetails.currency}${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const deliveryCharge = orderDetails.deliveryCharge || 5.00; // Fallback to 5.00 if not provided
    const totalAmount = (orderDetails.items.reduce((total, item) => total + item.price * item.quantity, 0) + deliveryCharge).toFixed(2);

    const mailOptions = {
        from: process.env.GOOGLE_EMAIL_USER,
        to: [userEmail, process.env.ADMIN_EMAIL],
        subject: 'Order Confirmation',
        html: `
        <div style="font-family: Arial, sans-serif; color: #333; text-align: center;">
            <h1 style="color: #4CAF50;">Order Confirmation</h1>
            <p>Thank you for your order, <strong>${orderDetails.name}</strong>!</p>
            <p>Your order details are as follows:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <thead>
                    <tr style="background-color: #4CAF50; color: white;">
                        <th style="padding: 10px; border: 1px solid #ddd;">Image</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Item</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Description</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Quantity</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Price</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsList}
                    <tr>
                        <td colspan="5" style="padding: 10px; border: 1px solid #ddd; text-align: right;"><strong>Delivery Charge</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${orderDetails.currency}${deliveryCharge.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="5" style="padding: 10px; border: 1px solid #ddd; text-align: right;"><strong>Total Amount</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>${orderDetails.currency}${totalAmount}</strong></td>
                    </tr>
                </tbody>
            </table>
            <p><strong>Delivery Address:</strong> ${orderDetails.address.street}, ${orderDetails.address.city}, ${orderDetails.address.state}, ${orderDetails.address.zipcode}</p>
            <p><strong>Phone Number:</strong> ${orderDetails.phone}</p>
            <p>We'll send you notification of delivery time!</p>
        </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};