import React, { useState } from 'react';
import Home from './pages/Home/Home';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import { Route, Routes } from 'react-router-dom';
import Cart from './pages/Cart/Cart';
import LoginPopup from './components/LoginPopup/LoginPopup';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import MyOrders from './pages/MyOrders/MyOrders';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify/Verify';
import ProductDetails from './components/ProductDetails/ProductDetails';
import StoreContextProvider from './Context/StoreContext';
import Search from './components/Search/Search';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <StoreContextProvider>
      <ToastContainer />
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : null}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <br />
        <Search />
        <br />
        <br />
        <br />
        <br />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='product/:id' element={<ProductDetails />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/myorders' element={<MyOrders />} />
          <Route path='/verify' element={<Verify />} />
        </Routes>
      </div>
      <Footer />
    </StoreContextProvider>
  );
};

export default App;