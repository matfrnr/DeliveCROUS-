import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartContext = createContext();

// Constants for cart limitations
const MAX_QUANTITY_PER_ITEM = 5;
const MAX_TOTAL_ITEMS = 20;

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [balance, setBalance] = useState(50); // Default balance
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Effect to monitor user changes and load appropriate cart data
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        setIsLoading(true);
        const userString = await AsyncStorage.getItem("user");

        // If no user is logged in
        if (!userString) {
          if (userId) {
            // Save current cart for previous user before clearing
            if (cartItems.length > 0) {
              await AsyncStorage.setItem(
                `cartItems_${userId}`,
                JSON.stringify(cartItems)
              );
            }
            // Clear user data
            setUserId(null);
            setCartItems([]);
            setBalance(50); // Reset to default
          }
          setIsLoading(false);
          return;
        }

        // If a user is logged in
        const user = JSON.parse(userString);

        // If this is a new user or user has changed
        if (user.id !== userId) {
          // Save cart data for previous user if needed
          if (userId && cartItems.length > 0) {
            await AsyncStorage.setItem(
              `cartItems_${userId}`,
              JSON.stringify(cartItems)
            );
          }

          // Set new user
          setUserId(user.id);

          // Load cart data for new user
          const savedCart = await AsyncStorage.getItem(`cartItems_${user.id}`);
          const savedBalance = await AsyncStorage.getItem(`balance_${user.id}`);

          if (savedCart) {
            setCartItems(JSON.parse(savedCart));
          } else {
            setCartItems([]);
          }

          if (savedBalance !== null) {
            setBalance(parseFloat(savedBalance));
          } else {
            setBalance(50); // Default balance for new users
          }
        }
        setIsLoading(false);
      } catch (e) {
        console.error("Error checking user status:", e);
        setIsLoading(false);
      }
    };

    // Check immediately on mount
    checkUserStatus();

    // Set up a listener for user changes
    const intervalId = setInterval(checkUserStatus, 1000);
    return () => clearInterval(intervalId);
  }, [userId, cartItems]);

  // Helper function to save cart to AsyncStorage
  const saveCart = async (items) => {
    if (!userId) return;

    try {
      await AsyncStorage.setItem(`cartItems_${userId}`, JSON.stringify(items));
    } catch (e) {
      console.error("Error saving cart:", e);
    }
  };

  // Helper function to save balance
  const saveBalance = async (newBalance) => {
    if (!userId) return;

    try {
      await AsyncStorage.setItem(`balance_${userId}`, newBalance.toString());
    } catch (e) {
      console.error("Error saving balance:", e);
    }
  };

  // Calculate total quantity in cart
  const getTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Add item to cart
  const addToCart = async (item) => {
    if (!userId) {
      Alert.alert("Error", "You must be logged in to add items to cart");
      return false;
    }

    let newCartItems;
    const existingItem = cartItems.find((i) => i.id === item.id);
    const currentTotalQuantity = getTotalQuantity();

    // Check item quantity limit
    if (existingItem && existingItem.quantity >= MAX_QUANTITY_PER_ITEM) {
      Alert.alert(
        "Limit Reached",
        `You cannot add more than ${MAX_QUANTITY_PER_ITEM} units of the same item.`
      );
      return false;
    }

    // Check total items limit
    if (currentTotalQuantity >= MAX_TOTAL_ITEMS) {
      Alert.alert(
        "Limit Reached",
        `You cannot have more than ${MAX_TOTAL_ITEMS} items in your cart.`
      );
      return false;
    }

    // Update cart items
    if (existingItem) {
      newCartItems = cartItems.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      newCartItems = [...cartItems, { ...item, quantity: 1 }];
    }

    setCartItems(newCartItems);
    await saveCart(newCartItems);
    return true;
  };

  // Update item quantity
  const updateQuantity = async (itemId, newQuantity) => {
    if (!userId) {
      Alert.alert("Error", "You must be logged in to update your cart");
      return false;
    }

    // Remove item if quantity is less than 1
    if (newQuantity < 1) {
      return removeFromCart(itemId);
    }

    // Check item quantity limit
    if (newQuantity > MAX_QUANTITY_PER_ITEM) {
      Alert.alert(
        "Limit Reached",
        `You cannot have more than ${MAX_QUANTITY_PER_ITEM} units of the same item.`
      );
      return false;
    }

    // Calculate new total quantity
    const itemToUpdate = cartItems.find((item) => item.id === itemId);
    if (!itemToUpdate) return false;

    const newTotalQuantity =
      getTotalQuantity() - itemToUpdate.quantity + newQuantity;

    // Check total items limit
    if (newTotalQuantity > MAX_TOTAL_ITEMS) {
      Alert.alert(
        "Limit Reached",
        `You cannot have more than ${MAX_TOTAL_ITEMS} items in your cart.`
      );
      return false;
    }

    // Update cart items
    const newCartItems = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(newCartItems);
    await saveCart(newCartItems);
    return true;
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    if (!userId) {
      Alert.alert("Error", "You must be logged in to remove items from cart");
      return false;
    }

    const newCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(newCartItems);
    await saveCart(newCartItems);
    return true;
  };

  // Calculate cart total
  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.prix || item.price) * item.quantity,
      0
    );
  };

  // Process order
  const processOrder = async () => {
    if (!userId) {
      Alert.alert("Error", "You must be logged in to complete an order");
      return false;
    }

    const total = getCartTotal();

    if (total > balance) {
      Alert.alert(
        "Insufficient Balance",
        "You don't have enough balance to complete this order."
      );
      return false;
    }

    // Update balance
    const newBalance = balance - total;
    setBalance(newBalance);
    await saveBalance(newBalance);

    // Clear cart
    setCartItems([]);
    await saveCart([]);

    return true;
  };

  // Clear cart
  const clearCart = async () => {
    if (!userId) return false;

    setCartItems([]);
    await saveCart([]);
    return true;
  };

  // Add funds to balance (for demo purposes)
  const addFunds = async (amount) => {
    if (!userId) return false;

    const newBalance = balance + amount;
    setBalance(newBalance);
    await saveBalance(newBalance);
    return true;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        getTotalQuantity,
        processOrder,
        clearCart,
        balance,
        addFunds,
        isLoading,
        userId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
