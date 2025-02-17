import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartContext = createContext();

const MAX_QUANTITY_PER_ITEM = 5;
const MAX_TOTAL_ITEMS = 20;

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [balance, setBalance] = useState(50);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem("cartItems");
        if (savedCart !== null) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (e) {
        console.error("Failed to load cart.");
      }
    };

    loadCart();
  }, []);

  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem("cartItems", JSON.stringify(cartItems));
      } catch (e) {
        console.error("Failed to save cart.");
      }
    };

    saveCart();
  }, [cartItems]);

  const getTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      const currentTotalQuantity = getTotalQuantity();

      if (existingItem) {
        if (existingItem.quantity >= MAX_QUANTITY_PER_ITEM) {
          Alert.alert(
            "Limite atteinte",
            `Vous ne pouvez pas ajouter plus de ${MAX_QUANTITY_PER_ITEM} unités du même article.`
          );
          return prevItems;
        }
      }

      if (currentTotalQuantity >= MAX_TOTAL_ITEMS) {
        Alert.alert(
          "Limite atteinte",
          `Vous ne pouvez pas avoir plus de ${MAX_TOTAL_ITEMS} articles au total dans votre panier.`
        );
        return prevItems;
      }

      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }

    if (newQuantity > MAX_QUANTITY_PER_ITEM) {
      Alert.alert(
        "Limite atteinte",
        `Vous ne pouvez pas avoir plus de ${MAX_QUANTITY_PER_ITEM} unités du même article.`
      );
      return;
    }

    const newTotalQuantity =
      getTotalQuantity() -
      cartItems.find((item) => item.id === itemId).quantity +
      newQuantity;

    if (newTotalQuantity > MAX_TOTAL_ITEMS) {
      Alert.alert(
        "Limite atteinte",
        `Vous ne pouvez pas avoir plus de ${MAX_TOTAL_ITEMS} articles au total dans votre panier.`
      );
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.prix * item.quantity,
      0
    );
  };

  const processOrder = (total) => {
    if (total > balance) {
      return false;
    }
    setBalance((prevBalance) => prevBalance - total);
    setCartItems([]);
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
        balance,
        processOrder,
        getTotalQuantity,
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
