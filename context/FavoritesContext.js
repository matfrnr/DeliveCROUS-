// FavoritesContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [userId, setUserId] = useState(null); // Ajout de l'état pour l'ID de l'utilisateur

  useEffect(() => {
    const loadUserAndFavorites = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
          setUserId(user.id);
          await loadFavorites(user.id); // Charge les favoris spécifiques à l'utilisateur
        }
      } catch (e) {
        console.error("Failed to load user or favorites.");
      }
    };

    loadUserAndFavorites();
  }, []);

  const loadFavorites = async (userId) => {
    try {
      const savedFavorites = await AsyncStorage.getItem(`favorites_${userId}`);
      if (savedFavorites !== null) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (e) {
      console.error("Failed to load favorites.");
    }
  };

  const saveFavorites = async (userId, newFavorites) => {
    try {
      await AsyncStorage.setItem(
        `favorites_${userId}`,
        JSON.stringify(newFavorites)
      );
    } catch (e) {
      console.error("Failed to save favorites.");
    }
  };

  const addToFavorites = async (item) => {
    if (userId) {
      if (!favorites.some((favItem) => favItem.id === item.id)) {
        const newFavorites = [...favorites, item];
        setFavorites(newFavorites);
        await saveFavorites(userId, newFavorites);
      }
    }
  };

  const removeFromFavorites = async (itemId) => {
    if (userId) {
      const newFavorites = favorites.filter((item) => item.id !== itemId);
      setFavorites(newFavorites);
      await saveFavorites(userId, newFavorites);
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
