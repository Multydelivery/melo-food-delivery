import { createContext, useEffect, useState } from "react";
import { food_list as defaultFoodList, menu_list } from "../assets/assets";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState(() => {
    // Load cart items from localStorage on initial render
    const savedCartItems = localStorage.getItem("cartItems");
    return savedCartItems ? JSON.parse(savedCartItems) : {};
  });
  const [token, setToken] = useState("");
  const currency = "$";
  const deliveryCharge = 0;

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (itemId) => {
    const newCartItems = {
      ...cartItems,
      [itemId]: cartItems[itemId] ? cartItems[itemId] + 1 : 1,
    };
    setCartItems(newCartItems);

    if (token) {
      await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  };

  const removeFromCart = async (itemId) => {
    const newCartItems = {
      ...cartItems,
      [itemId]: cartItems[itemId] - 1,
    };
    setCartItems(newCartItems);

    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      try {
        if (cartItems[item] > 0) {
          let itemInfo = food_list.find((product) => product._id === item);
          if (itemInfo) {
            totalAmount += itemInfo.price * cartItems[item];
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    setFoodList(response.data.data);
  };

  const loadCartData = async (localToken) => {
    const response = await axios.post(
      url + "/api/cart/get",
      {},
      { headers: { Authorization: `Bearer ${localToken}` } }
    );
    // Merge server cart data with localStorage cart data
    const serverCartData = response.data.cartData || {};
    const localCartData = JSON.parse(localStorage.getItem("cartItems")) || {};
    const mergedCartData = { ...localCartData, ...serverCartData };
    setCartItems(mergedCartData);
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const localToken = localStorage.getItem("token");
      if (localToken) {
        setToken(localToken);
        await loadCartData(localToken);
      }
    }
    loadData();
  }, []);

  const contextValue = {
    url,
    food_list,
    menu_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    token,
    setToken,
    loadCartData,
    setCartItems,
    currency,
    deliveryCharge,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
