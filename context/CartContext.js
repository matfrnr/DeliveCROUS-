import React, { createContext, useContext, useState } from "react";
import { Alert } from "react-native";

const CartContext = createContext();

const MAX_QUANTITY_PER_ITEM = 5;
const MAX_TOTAL_ITEMS = 20;

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [balance, setBalance] = useState(50);

  const getTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      const currentTotalQuantity = getTotalQuantity();

      if (existingItem) {
        // Vérifier si l'ajout dépasserait la limite par article
        if (existingItem.quantity >= MAX_QUANTITY_PER_ITEM) {
          Alert.alert(
            "Limite atteinte",
            `Vous ne pouvez pas ajouter plus de ${MAX_QUANTITY_PER_ITEM} unités du même article.`
          );
          return prevItems;
        }
      }

      // Vérifier si l'ajout dépasserait la limite totale
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

    // Vérifier la limite par article
    if (newQuantity > MAX_QUANTITY_PER_ITEM) {
      Alert.alert(
        "Limite atteinte",
        `Vous ne pouvez pas avoir plus de ${MAX_QUANTITY_PER_ITEM} unités du même article.`
      );
      return;
    }

    // Calculer le nouveau total
    const newTotalQuantity =
      getTotalQuantity() -
      cartItems.find((item) => item.id === itemId).quantity +
      newQuantity;

    // Vérifier la limite totale
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

export const useCart = () => useContext(CartContext);
