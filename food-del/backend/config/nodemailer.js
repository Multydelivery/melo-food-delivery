import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com', // Namecheap's private email SMTP server
    port: 587, // Port for TLS/STARTTLS
    secure: false, // Use TLS/STARTTLS
    auth: {
        user: process.env.NAMECHEAP_EMAIL_USER,
        pass: process.env.NAMECHEAP_EMAIL_PASS,
    }
});

transporter.on('error', (error) => {
    console.error('Error with the email transporter:', error);
});

export const sendOrderNotification = async (orderDetails, userEmail) => {
    const itemsList = orderDetails.items.map(item => `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${orderDetails.currency}${item.price.toFixed(2)}</td>
        <td>${orderDetails.currency}${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');
  
    const deliveryCharge = orderDetails.deliveryCharge || 5.00; // Fallback to 5.00 if not provided
    const totalAmount = (orderDetails.items.reduce((total, item) => total + item.price * item.quantity, 0) + deliveryCharge).toFixed(2);
  
    const mailOptions = {
      from: process.env.NAMECHEAP_EMAIL_USER,
      to: [userEmail, process.env.ADMIN_EMAIL],
      subject: 'Order Confirmation',
      html: `
        <div style="text-align: center;">
          <img src="${process.env.API_URL}/header_img.png" alt="Logo" style="width: 150px; height: auto;"/>
        </div>
        <h1>Order Confirmation</h1>
        <p>Thank you for your order, <strong>${orderDetails.name}</strong>!</p> <!-- Add name here -->
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
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully: ' + info.response);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };