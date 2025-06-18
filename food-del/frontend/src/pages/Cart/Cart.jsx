import React, { useContext, useEffect, useState } from 'react';
import './Cart.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import { BsArrowLeft } from 'react-icons/bs';
import { toast } from 'react-toastify';

const Cart = () => {
  const { 
    cartItems, 
    food_list, 
    removeFromCart, 
    addToCart, 
    getTotalCartAmount, 
    currency, 
    deliveryCharge,
    clearCart
  } = useContext(StoreContext);
  
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleApplyPromo = () => {
    setIsApplyingPromo(true);
    // Simulate API call
    setTimeout(() => {
      if (promoCode.toUpperCase() === 'MELO10') {
        setDiscount(10);
        toast.success('Promo code applied! 10% discount');
      } else {
        toast.error('Invalid promo code');
      }
      setIsApplyingPromo(false);
    }, 1000);
  };

  const calculateTotal = () => {
    const subtotal = getTotalCartAmount();
    const delivery = subtotal === 0 ? 0 : deliveryCharge;
    const discountedAmount = subtotal * (discount / 100);
    return (subtotal - discountedAmount + delivery).toFixed(2);
  };

  const handleProceedToCheckout = () => {
    if (getTotalCartAmount() === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/order');
  };

  return (
    <div className='cart-container'>
      <button className="back-button" onClick={() => navigate(-1)}>
        <BsArrowLeft /> Continue Shopping
      </button>

      <h1 className="cart-title">Your Shopping Cart</h1>
      
      {getTotalCartAmount() === 0 ? (
        <div className="empty-cart">
          <img src="/empty-cart.svg" alt="Empty cart" />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet</p>
          <button className="explore-button" onClick={() => navigate('/')}>
            Explore Menu
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            <div className="cart-header">
              <div className="header-product">Product</div>
              <div className="header-price">Price</div>
              <div className="header-quantity">Quantity</div>
              <div className="header-total">Total</div>
              <div className="header-remove"></div>
            </div>

            {food_list.map((item) => {
              if (cartItems[item._id] > 0) {
                return (
                  <div className="cart-item" key={item._id}>
                    <div className="item-product">
                      <img src={item.image} alt={item.name} loading="lazy" />
                      <div>
                        <h3>{item.name}</h3>
                        {item.description && <p className="item-description">{item.description}</p>}
                      </div>
                    </div>
                    <div className="item-price">{currency}{item.price}</div>
                    <div className="item-quantity">
                      <button 
                        onClick={() => removeFromCart(item._id)}
                        aria-label="Decrease quantity"
                      >
                        <FiMinus />
                      </button>
                      <span>{cartItems[item._id]}</span>
                      <button 
                        onClick={() => addToCart(item._id)}
                        aria-label="Increase quantity"
                      >
                        <FiPlus />
                      </button>
                    </div>
                    <div className="item-total">{currency}{(item.price * cartItems[item._id]).toFixed(2)}</div>
                    <div className="item-remove">
                      <button 
                        onClick={() => {
                          removeFromCart(item._id);
                          toast.success(`${item.name} removed from cart`);
                        }}
                        aria-label="Remove item"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                );
              }
              return null;
            })}

            <div className="cart-actions">
              <button 
                className="clear-cart"
                onClick={() => {
                  clearCart();
                  toast.info('Cart cleared');
                }}
              >
                Clear Cart
              </button>
            </div>
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h2>Order Summary</h2>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{currency}{getTotalCartAmount().toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div className="summary-row discount">
                  <span>Discount ({discount}%)</span>
                  <span>-{currency}{(getTotalCartAmount() * (discount / 100)).toFixed(2)}</span>
                </div>
              )}
              
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>{currency}{getTotalCartAmount() === 0 ? 0 : deliveryCharge}</span>
              </div>
              
              <div className="summary-total">
                <span>Total</span>
                <span>{currency}{calculateTotal()}</span>
              </div>
              
              <div className="promo-code">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={discount > 0}
                />
                <button 
                  onClick={handleApplyPromo}
                  disabled={!promoCode || isApplyingPromo || discount > 0}
                >
                  {isApplyingPromo ? 'Applying...' : discount > 0 ? 'Applied' : 'Apply'}
                </button>
              </div>
              
              <button 
                className="checkout-button"
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
