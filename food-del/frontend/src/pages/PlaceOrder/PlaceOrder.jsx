import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import DeliveryChargeCalculator from '../../components/Deliveries/DeliveryChargeCalculator'; // Import the new component

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

  const {
    getTotalCartAmount,
    token,
    food_list,
    cartItems,
    url,
    setCartItems,
    currency,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item, quantity: cartItems[item._id] };
        orderItems.push(itemInfo);
      }
    });

    const deliveryFee = calculateDeliveryCharge(data.zipcode); // Calculate delivery fee

    // Check if zip code is served
    if (deliveryFee === null) {
      toast.error("We do not deliver to this location.");   
        return; // Exit the function
    }

    let orderData = {
      userId: token.userId,
      items: orderItems,
      amount: getTotalCartAmount() + deliveryFee,
      address: `${data.street}, ${data.city}, ${data.state}, ${data.zipcode}, ${data.country}`,
      phone: data.phone,
      email: data.email,
      deliveryCharge: deliveryFee // Include delivery charge
    };

    try {
      if (payment === "stripe") {
        let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
        if (response.data.success) {
          const { session_url } = response.data;
          window.location.replace(session_url);
        } else {
          toast.error("Something Went Wrong");
        }
      } else {
        let response = await axios.post(url + "/api/order/placecod", orderData, { headers: { token } });
        if (response.data.success) {
          navigate("/myorders");
          toast.success(response.data.message);
          setCartItems({});
        } else {
          toast.error("Something Went Wrong");
        }
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("An error occurred while placing the order.");
    }
  };

  const calculateDeliveryCharge = (zip) => {
    const deliveryCharges = {
      "07631": 5, // Englewood, NJ
      "07666": 5, // Englewood, NJ (shared with Teaneck)
      "07608": 7, // Teaneck, NJ
      "07024": 7, // Fort Lee, NJ
      "07621": 7, // Bergenfield, NJ
      "07670": 7, // Tenafly, NJ
      "07601": 7, // Hackensack, NJ
      "07652": 7, // Paramus, NJ
      "07450": 7, // Ridgewood, NJ
      "07650": 7, // Palisades Park, NJ
    };
    return deliveryCharges[zip] || 10; // Default to $10 if zip code is not found
  };

  useEffect(() => {
    if (!token) {
      toast.error("To place an order, sign in first.");
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
            {/* Use DeliveryChargeCalculator component here */}
            <DeliveryChargeCalculator zipCode={data.zipcode} />
            <hr />
            <div className="cart-total-details"><b>Total</b><b>{currency}{getTotalCartAmount() + calculateDeliveryCharge(data.zipcode)}</b></div>
          </div>
        </div>
        <div className="payment">
          <h2>Payment Method</h2>
          <div onClick={() => setPayment("cod")} className="payment-option">
            <img src={payment === "cod" ? assets.checked : assets.un_checked} alt="" />
            <p>COD ( Cash on delivery )</p>
          </div>
          <div onClick={() => setPayment("stripe")} className="payment-option">
            <img src={payment === "stripe" ? assets.checked : assets.un_checked} alt="" />
            <p>Stripe ( Credit / Debit )</p>
          </div>
        </div>
        <button className='place-order-submit' type='submit'>{payment === "cod" ? "Place Order" : "Proceed To Payment"}</button>
      </div>
    </form>
  );
};

export default PlaceOrder;