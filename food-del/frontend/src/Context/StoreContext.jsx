import { createContext, useEffect, useState } from "react";
import { food_list as defaultFoodList, menu_list } from "../assets/assets";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"; // Use Vite environment variable for backend URL
  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const currency = "$";
  const deliveryCharge = 5;

  const addToCart = async (itemId) => {
    // Update cartItems state
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] ? prev[itemId] + 1 : 1,
    }));

    // Call the API if token exists
    if (token) {
      await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { Authorization: `Bearer ${token}` } } // Use Bearer token
      );
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] - 1,
    }));

    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { Authorization: `Bearer ${token}` } } // Use Bearer token
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
      { headers: { Authorization: `Bearer ${localToken}` } } // Use Bearer token
    );
    // Default to an empty object if cartData is not returned
    setCartItems(response.data.cartData || {});
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
