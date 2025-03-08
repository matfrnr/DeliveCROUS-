import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartContext = createContext();

// Constants for cart limitations
const MAX_QUANTITY_PER_ITEM = 5;
const MAX_TOTAL_ITEMS = 20;
const DEFAULT_BALANCE = 50; // Default balance for new users

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [balance, setBalance] = useState(DEFAULT_BALANCE);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Effect to load user data on mount (this runs only once)
  useEffect(() => {
    const loadInitialUserData = async () => {
      try {
        setIsLoading(true);
        const userString = await AsyncStorage.getItem("user");

        if (userString) {
          const user = JSON.parse(userString);
          setUserId(user.id);

          // Load cart data for user
          const savedCart = await AsyncStorage.getItem(`cartItems_${user.id}`);
          if (savedCart) {
            setCartItems(JSON.parse(savedCart));
          }

          // Load balance for user
          const savedBalance = await AsyncStorage.getItem(`balance_${user.id}`);
          if (savedBalance !== null) {
            setBalance(parseFloat(savedBalance));
          } else {
            // If no saved balance, set default and save it
            await AsyncStorage.setItem(
              `balance_${user.id}`,
              DEFAULT_BALANCE.toString()
            );
          }
        }

        setIsLoading(false);
      } catch (e) {
        console.error("Error loading initial user data:", e);
        setIsLoading(false);
      }
    };

    loadInitialUserData();
  }, []);

  // Effect to monitor user changes
  useEffect(() => {
    const userChangeListener = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");

        // If no user is logged in
        if (!userString) {
          if (userId) {
            // Save current cart and balance for previous user before clearing
            if (cartItems.length > 0) {
              await AsyncStorage.setItem(
                `cartItems_${userId}`,
                JSON.stringify(cartItems)
              );
            }
            await saveBalance(balance);

            // Clear user data in state
            setUserId(null);
            setCartItems([]);
            setBalance(DEFAULT_BALANCE);
          }
          return;
        }

        // If a user is logged in
        const user = JSON.parse(userString);

        // If this is a new user or user has changed
        if (user.id !== userId) {
          // Save cart data and balance for previous user if needed
          if (userId) {
            if (cartItems.length > 0) {
              await AsyncStorage.setItem(
                `cartItems_${userId}`,
                JSON.stringify(cartItems)
              );
            }
            await saveBalance(balance);
          }

          // Set new user
          setUserId(user.id);

          // Load cart data for new user
          const savedCart = await AsyncStorage.getItem(`cartItems_${user.id}`);
          const savedBalance = await AsyncStorage.getItem(`balance_${user.id}`);

          // Set cart items
          if (savedCart) {
            setCartItems(JSON.parse(savedCart));
          } else {
            setCartItems([]);
          }

          // Set balance
          if (savedBalance !== null) {
            setBalance(parseFloat(savedBalance));
          } else {
            // If no saved balance, set default and save it
            setBalance(DEFAULT_BALANCE);
            await AsyncStorage.setItem(
              `balance_${user.id}`,
              DEFAULT_BALANCE.toString()
            );
          }
        }
      } catch (e) {
        console.error("Error checking user status:", e);
      }
    };

    // Set up the interval for checking user changes
    const intervalId = setInterval(userChangeListener, 1000);
    return () => clearInterval(intervalId);
  }, [userId, cartItems, balance]);

  // Helper function to save balance
  const saveBalance = async (newBalance) => {
    if (!userId) return;

    try {
      await AsyncStorage.setItem(`balance_${userId}`, newBalance.toString());
    } catch (e) {
      console.error("Error saving balance:", e);
    }
  };

  // Helper function to save cart to AsyncStorage
  const saveCart = async (items) => {
    if (!userId) return;

    try {
      await AsyncStorage.setItem(`cartItems_${userId}`, JSON.stringify(items));
    } catch (e) {
      console.error("Error saving cart:", e);
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
  const processOrder = async (total) => {
    if (!userId) {
      Alert.alert("Error", "You must be logged in to complete an order");
      return false;
    }

    if (!total) {
      total = getCartTotal();
    }

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
    if (!userId) {
      Alert.alert("Error", "You must be logged in to add funds");
      return false;
    }

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
