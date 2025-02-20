import React, { useState, useContext } from 'react';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import AppDownload from '../../components/AppDownload/AppDownload';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import './Home.css';

const Home = () => {
  const [category, setCategory] = useState("All");
  const navigate = useNavigate();
  const { cartItems } = useContext(StoreContext);

  return (
    <>
      <Header />
      <ExploreMenu setCategory={setCategory} category={category} />
      <FoodDisplay category={category} />
      <AppDownload />
      <button className="view-cart-button" onClick={() => navigate('/cart')}>
        View Cart ({Object.keys(cartItems).length})
      </button>
    </>
  );
}

export default Home;
