// app/context/CartContext.js
import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Ajouter un produit au panier
  const addToCart = (item) => {
    // Vérifier si l'article existe déjà dans le panier
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);
    
    if (existingItemIndex !== -1) {
      // Si l'article existe, augmenter la quantité
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += 1;
      setCartItems(updatedCartItems);
    } else {
      // Sinon, ajouter le nouvel article au panier avec quantité 1
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  // Supprimer un produit du panier
  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  // Modifier la quantité d'un produit
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    const updatedCartItems = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCartItems);
  };

  // Calculer le total du panier
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.prix * item.quantity), 0);
  };

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        getCartTotal 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);