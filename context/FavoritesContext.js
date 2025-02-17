import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const savedFavorites = await AsyncStorage.getItem("favorites");
        if (savedFavorites !== null) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (e) {
        console.error("Failed to load favorites.");
      }
    };

    loadFavorites();
  }, []);

  const addToFavorites = async (item) => {
    if (!favorites.some((favItem) => favItem.id === item.id)) {
      const newFavorites = [...favorites, item];
      setFavorites(newFavorites);
      try {
        await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
      } catch (e) {
        console.error("Failed to save favorites.");
      }
    }
  };

  const removeFromFavorites = async (itemId) => {
    const newFavorites = favorites.filter((item) => item.id !== itemId);
    setFavorites(newFavorites);
    try {
      await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
    } catch (e) {
      console.error("Failed to save favorites.");
    }
  };

  const isFavorite = (itemId) => {
    return favorites.some((item) => item.id === itemId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
