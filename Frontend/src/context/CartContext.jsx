// import { createContext, useContext, useReducer, useState } from 'react';

// const CartContext = createContext();

// const cartReducer = (state, action) => {
//   switch (action.type) {
//     case 'ADD_TO_CART': {
//       const payloadId = action.payload._id || action.payload.id;
//       const existingIndex = state.findIndex(item => item.id === payloadId);
//       if (existingIndex >= 0) {
//         const updated = [...state];
//         updated[existingIndex] = {
//           ...updated[existingIndex],
//           quantity: updated[existingIndex].quantity + 1
//         };
//         return updated;
//       }
//       return [...state, { ...action.payload, quantity: 1, id: payloadId }];
//     }
//     case 'REMOVE_FROM_CART':
//       return state.filter(item => item.id !== action.payload);
//     case 'UPDATE_QUANTITY': {
//       if (action.payload.quantity <= 0) {
//         return state.filter(item => item.id !== action.payload.id);
//       }
//       return state.map(item =>
//         item.id === action.payload.id
//           ? { ...item, quantity: action.payload.quantity }
//           : item
//       );
//     }
//     case 'CLEAR_CART':
//       return [];
//     default:
//       return state;
//   }
// };

// export function CartProvider({ children }) {
//   const [cart, dispatch] = useReducer(cartReducer, []);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

//   const addToCart = (product) => {
//     dispatch({ type: 'ADD_TO_CART', payload: product });
//     setIsDrawerOpen(true);
//   };

//   const removeFromCart = (id) => {
//     dispatch({ type: 'REMOVE_FROM_CART', payload: id });
//   };

//   const updateQuantity = (id, quantity) => {
//     dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
//   };

//   const clearCart = () => {
//     dispatch({ type: 'CLEAR_CART' });
//   };

//   const cartTotal = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
//   const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

//   return (
//     <CartContext.Provider value={{
//       cart,
//       isDrawerOpen,
//       setIsDrawerOpen,
//       addToCart,
//       removeFromCart,
//       updateQuantity,
//       clearCart,
//       cartTotal,
//       cartCount
//     }}>
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// }

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // --- 1. THE HELPER (AUTHORIZATION) ---
  // WHAT: A reusable function to grab the latest token from storage
  // WHY: This ensures we don't use an old 'null' value from before login
  // HOW: It looks at localStorage at the exact moment an API call is made
  const getAuthHeader = () => {
    const userInfo = JSON.parse(localStorage.getItem("shopvibe_user"));
    return userInfo && userInfo.token 
      ? { headers: { Authorization: `Bearer ${userInfo.token}` } } 
      : null;
  };

  // --- 2. THE SYNC (FETCH CART) ---
  // WHAT: Pulls the user's saved items from MongoDB
  // WHY: To keep the Navbar count and Cart Drawer accurate
  // HOW: Sends a GET request. If no token is found, it clears the local cart
  const fetchCart = async () => {
    const config = getAuthHeader();
    if (!config) {
      setCart([]); // Clear cart if user is logged out
      return;
    }

    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, config);
      setCart(data.cartItems || []);
    } catch (err) {
      console.error("Sync error:", err.response?.data?.message || "Server unreachable");
    }
  };

  // --- 3. THE TRIGGER (ADD TO CART) ---
  // WHAT: Adds a product or increases its quantity
  // WHY: To save the selection to the database so it's never lost
  // HOW: It checks for a token first. If it fails, it gives a specific warning.
  const addToCart = async (productId, qty = 1) => {
    const config = getAuthHeader();
    
    if (!config) {
      alert("Your session has timed out. Please login again to shop!");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/cart`, { productId, qty }, config);
      await fetchCart(); // Re-sync the state with the new DB data
      setLoading(false);
      setIsDrawerOpen(true); // Pop open the drawer for feedback
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || "Could not add item";
      alert(msg);
    }
  };

  // --- 4. THE REMOVER (DELETE) ---
  // WHAT: Removes an item entirely from the database
  // WHY: To allow users to manage their bag
  // HOW: Sends a DELETE request using the Product ID
  const removeFromCart = async (productId) => {
    const config = getAuthHeader();
    if (!config) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart/${productId}`, config);
      await fetchCart(); 
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };

  // --- NEW: THE DECREASER ---
  const decreaseQuantity = async (productId) => {
    const config = getAuthHeader();
    if (!config) return;

    try {
      // We use the ID to tell the backend which item to decrement
      await axios.put(`${import.meta.env.VITE_API_URL}/api/cart/decrease`, { productId }, config);
      await fetchCart(); 
    } catch (err) {
      console.error("Decrease failed:", err.response?.data?.message || err.message);
    }
  };

  // --- 5. THE WATCHER (AUTO-REFRESH) ---
  // WHAT: Runs fetchCart automatically
  // WHY: This is the fix! It ensures that when the page loads, we try to get the data
  // HOW: We also want to call this from our Login page to "wake up" the cart
  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ 
      cart, 
      loading, 
      isDrawerOpen, 
      setIsDrawerOpen, 
      addToCart, 
      removeFromCart, 
      decreaseQuantity,
      fetchCart // We export this so Login.jsx can trigger it!
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);