import React, { useContext } from 'react';
import './FoodItem.css';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

const FoodItem = ({ image, name, desc, price, id }) => {
    const { cartItems, addToCart, removeFromCart, currency } = useContext(StoreContext);

    return (
        <div className='food-item' id={id}>
            <div className='food-item-img-container'>
                <img className='food-item-image' src={image} alt={name} />
                <div className="food-item-counter">
                    <img src={assets.remove_icon_red} onClick={() => removeFromCart(id)} alt="Remove" />
                    <p>{cartItems[id] || 0}</p>
                    <img src={assets.add_icon_green} onClick={() => addToCart(id)} alt="Add" />
                </div>
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p> <img src={assets.rating_starts} alt="Rating" />
                </div>
                <p className="food-item-desc">{desc}</p>
                <p className="food-item-price">{currency}{price}</p>
            </div>
        </div>
    );
};

export default FoodItem;
