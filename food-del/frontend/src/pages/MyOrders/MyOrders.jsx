import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  const [data, setData] = useState([]);
  const { url, token, currency } = useContext(StoreContext);

  // Function to format the date and time
  const formatDate = (date) => {
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, // Use 12-hour format (AM/PM)
    };
    return new Date(date).toLocaleString('en-US', options);
  };

  const fetchOrders = async () => {
    const response = await axios.post(url + "/api/order/userorders", {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setData(response.data.data);
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  // Sort orders by date in descending order (most recent first)
  const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {sortedData.map((order, index) => {
          return (
            <div key={index} className='my-orders-order'>
              <img src={assets.parcel_icon} alt="" />
              <p>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity;
                  } else {
                    return item.name + " x " + item.quantity + ", ";
                  }
                })}
              </p>
              <p>{currency}{order.amount.toFixed(2)}</p>
              <p>Items: {order.items.length}</p>
              <p><span>&#x25cf;</span> <b>{order.status}</b></p>
              <p>Ordered on: {formatDate(order.date)}</p> {/* Display formatted date and time */}
              <button onClick={fetchOrders}>Track Order</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
