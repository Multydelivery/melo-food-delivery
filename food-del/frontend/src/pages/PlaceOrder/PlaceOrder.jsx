import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PlaceOrder.css';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

const PlaceOrder = () => {
    const [payment, setPayment] = useState("cod");
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    });

    const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems, currency, deliveryCharge, updateDeliveryCharge } = useContext(StoreContext);
    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prevData => ({ ...prevData, [name]: value }));
        if (name === 'zipcode') {
            updateDeliveryCharge(value);
        }
    };

    const placeOrder = async (e) => {
        e.preventDefault();
        let orderItems = [];
        food_list.forEach((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = {
                    ...item,
                    quantity: cartItems[item._id]
                };
                orderItems.push(itemInfo);
            }
        });
        let orderData = {
            userId: token, // Ensure userId is set correctly
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + deliveryCharge,
            email: data.email,
            phone: data.phone,
            deliveryCharge: deliveryCharge // Include the delivery charge in the order data
        };
        console.log("Order Data:", orderData); // Debugging: Log order data
        try {
            let response;
            if (payment === "stripe") {
                response = await axios.post(`${url}/api/order/place`, orderData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    window.location.replace(response.data.session_url);
                } else {
                    toast.error("Something Went Wrong");
                }
            } else {
                response = await axios.post(`${url}/api/order/placecod`, orderData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    navigate("/myorders");
                    setCartItems({});
                    toast.success(response.data.message);
                } else {
                    toast.error("Something Went Wrong");
                }
            }
        } catch (error) {
            toast.error("Error processing your order: " + error.message);
        }
    };

    useEffect(() => {
        if (!token) {
            toast.error("To place an order, sign in first");
            navigate('/cart');
        } else if (getTotalCartAmount() === 0) {
            navigate('/cart');
        }
    }, [token, getTotalCartAmount, navigate]);

    return (
        <form id="placeOrderForm" onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className='title'>Delivery Information</p>
                <div className="multi-field">
                    <input type="text" id="firstName" name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='First name' required autoComplete="given-name" />
                    <input type="text" id="lastName" name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Last name' required autoComplete="family-name" />
                </div>
                <input type="email" id="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='Email address' required autoComplete="email" />
                <input type="text" id="street" name='street' onChange={onChangeHandler} value={data.street} placeholder='Street' required autoComplete="street-address" />
                <div className="multi-field">
                    <input type="text" id="city" name='city' onChange={onChangeHandler} value={data.city} placeholder='City' required autoComplete="address-level2" />
                    <input type="text" id="state" name='state' onChange={onChangeHandler} value={data.state} placeholder='State' required autoComplete="address-level1" />
                </div>
                <div className="multi-field">
                    <input type="text" id="zipcode" name='zipcode' onChange={onChangeHandler} value={data.zipcode} placeholder='Zip code' required autoComplete="postal-code" />
                    <input type="text" id="country" name='country' onChange={onChangeHandler} value={data.country} placeholder='Country' required autoComplete="country" />
                </div>
                <input type="text" id="phone" name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Phone' required autoComplete="tel" />
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details"><p>Subtotal</p><p>{currency}{getTotalCartAmount()}</p></div>
                        <hr />
                        <div className="cart-total-details"><p>Delivery Fee</p><p>{currency}{deliveryCharge}</p></div>
                        <hr />
                        <div className="cart-total-details"><b>Total</b><b>{currency}{getTotalCartAmount() + deliveryCharge}</b></div>
                    </div>
                </div>
                <div className="payment">
                    <h2>Payment Method</h2>
                    <div onClick={() => setPayment("cod")} className="payment-option">
                        <img src={payment === "cod" ? assets.checked : assets.un_checked} alt="" />
                        <p>COD (Cash on delivery)</p>
                    </div>
                    <div onClick={() => setPayment("stripe")} className="payment-option">
                        <img src={payment === "stripe" ? assets.checked : assets.un_checked} alt="" />
                        <p>Stripe (Credit / Debit)</p>
                    </div>
                </div>
                <button className='place-order-submit' type='submit'>{payment === "cod" ? "Place Order" : "Proceed To Payment"}</button>
            </div>
        </form>
    );
}

export default PlaceOrder;