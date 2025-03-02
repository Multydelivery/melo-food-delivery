import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductDetails.css';
import { StoreContext } from '../../Context/StoreContext';
import { FaShoppingCart } from 'react-icons/fa';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart, cartItems } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/food/${id}`);
        setProduct(response.data.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="product-details">
      <img src={product.image} alt={product.name} />
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <p>Category: {product.category}</p>
      <button onClick={() => addToCart(product._id)}>Add to Cart</button>
      <button className="view-cart-button" onClick={() => navigate('/cart')}>
        <FaShoppingCart size={20} />
        <span className="cart-count">
          {Object.values(cartItems).reduce((total, quantity) => total + quantity, 0)}
        </span>
      </button>
    </div>
  );
};

export default ProductDetails;