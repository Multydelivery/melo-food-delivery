import { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import DeliveryChargeCalculator from '../../components/Deliveries/DeliveryChargeCalculator';

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
  const [showSummary, setShowSummary] = useState(false); // State to manage summary visibility

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

  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Function to check if the current time is within the allowed range (10:00 AM to 9:30 PM)
  const isOrderTimeAllowed = () => {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    // Define the allowed time range (10:00 AM to 9:30 PM)
    const startTime = 9; // 10:00 AM
    const endTime = 23; // 9:00 PM
    const endMinutes = 30; // 9:30 PM

    if (
      (currentHours > startTime || (currentHours === startTime && currentMinutes >= 0)) &&
      (currentHours < endTime || (currentHours === endTime && currentMinutes <= endMinutes))
    ) {
      return true; // Order time is allowed
    }
    return false; // Order time is not allowed
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    // Check if the current time is within the allowed range
    if (!isOrderTimeAllowed()) {
      toast.error("Orders can only be placed between 10:00 AM and 9:30 PM.");
      return; // Stop the order process if the time is outside the allowed range
    }

    // Calculate delivery charge using the DeliveryChargeCalculator logic
    const deliveryFee = DeliveryChargeCalculator.calculateDeliveryCharge(data.zipcode);

    // Check if the zip code is served
    if (deliveryFee === null) {
      toast.error("We do not deliver to this location.");
      return; // Stop the order process if the zip code is not served
    }

    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item, quantity: cartItems[item._id] };
        orderItems.push(itemInfo);
      }
    });

    // Calculate the total amount (subtotal + delivery fee)
    const totalAmount = getTotalCartAmount() + deliveryFee;

    let orderData = {
      userId: token.userId,
      items: orderItems,
      amount: totalAmount,
      name: `${data.firstName} ${data.lastName}`, // Combine first and last name
      address: {
        street: data.street,
        city: data.city,
        state: data.state,
        zipcode: data.zipcode
      },
      phone: data.phone,
      email: data.email,
      deliveryCharge: deliveryFee
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
            <div className="cart-total-details"><p>Subtotal</p><p>{currency}{getTotalCartAmount().toFixed(2)}</p></div>
            <hr />
            {/* Use DeliveryChargeCalculator component here */}
            <DeliveryChargeCalculator zipCode={data.zipcode} />
            <hr />
            <div className="cart-total-details"><b>Total</b><b>{currency}{(getTotalCartAmount() + (DeliveryChargeCalculator.calculateDeliveryCharge(data.zipcode) || 0)).toFixed(2)}</b></div>
          </div>
        </div>
        <div className="order-summary-toggle">
          <button
            type="button"
            onClick={() => setShowSummary(!showSummary)}
            className="toggle-summary-button"
          >
            {showSummary ? "Hide Order Summary" : "Show Order Summary"}
          </button>
        </div>
        {showSummary && (
          <div className="order-summary">
            <h2>Order Summary</h2>
            {food_list.map((item) => (
              cartItems[item._id] > 0 && (
                <div key={item._id} className="order-item">
                  <p>{item.name} x {cartItems[item._id]}</p>
                  <p>{currency}{(item.price * cartItems[item._id]).toFixed(2)}</p>
                </div>
              )
            ))}
          </div>
        )}
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
        <p className="order-time-info">Orders can only be placed between 10:00 AM and 9:30 PM.</p>
      </div>
    </form>
  );
};

export default PlaceOrder;