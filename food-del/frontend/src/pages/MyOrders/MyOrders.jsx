import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import axios from 'axios'
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  
  const [data,setData] =  useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const {url,token,currency} = useContext(StoreContext);

  const fetchOrders = async () => {
    const response = await axios.post(url+"/api/order/userorders",{},{headers:{token}});
    setData(response.data.data)
  }

  const handleTrackOrder = (order) => {
    setSelectedOrder(order);
  }

  const closeModal = () => {
    setSelectedOrder(null);
  }

  useEffect(()=>{
    if (token) {
      fetchOrders();
    }
  },[token])

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order,index)=>{
          return (
            <div key={index} className='my-orders-order'>
                <img src={assets.parcel_icon} alt="" />
                <p>{order.items.map((item,index)=>{
                  if (index === order.items.length-1) {
                    return item.name+" x "+item.quantity
                  }
                  else{
                    return item.name+" x "+item.quantity+", "
                  }
                  
                })}</p>
                <p>{currency}{order.amount}.00</p>
                <p>Items: {order.items.length}</p>
                <p><span>&#x25cf;</span> <b>{order.status}</b></p>
                <button onClick={() => handleTrackOrder(order)}>Track Order</button>
            </div>
          )
        })}
      </div>

      {/* Tracking Modal */}
      {selectedOrder && (
        <div className="tracking-modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h3>Order Tracking</h3>
            <p>Order ID: {selectedOrder._id}</p>
            <p>Status: {selectedOrder.status}</p>
            <p>Estimated Delivery: {/* Add your delivery estimate here */}</p>
            {/* Add more tracking details as needed */}
          </div>
        </div>
      )}
    </div>
  )
}

export default MyOrders
