import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [userId, setUserId] = useState(null);

  // Effet pour surveiller les changements d'utilisateur
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");

        // Si aucun utilisateur n'est connecté
        if (!userString) {
          if (userId) {
            // Si un utilisateur était précédemment connecté, sauvegardons ses favoris avant de vider l'état
            if (favorites.length > 0) {
              await AsyncStorage.setItem(
                `favorites_${userId}`,
                JSON.stringify(favorites)
              );
            }
            setUserId(null);
            setFavorites([]);
          }
          return;
        }

        // Si un utilisateur est connecté
        const user = JSON.parse(userString);

        // Si c'est un nouvel utilisateur ou si l'utilisateur a changé
        if (user.id !== userId) {
          // Sauvegarde les favoris de l'utilisateur précédent si nécessaire
          if (userId && favorites.length > 0) {
            await AsyncStorage.setItem(
              `favorites_${userId}`,
              JSON.stringify(favorites)
            );
          }

          // Définit le nouvel utilisateur
          setUserId(user.id);

          // Charge les favoris du nouvel utilisateur
          const savedFavorites = await AsyncStorage.getItem(
            `favorites_${user.id}`
          );
          if (savedFavorites) {
            const parsedFavorites = JSON.parse(savedFavorites);
            setFavorites(parsedFavorites);
          } else {
            setFavorites([]);
          }
        }
      } catch (e) {
        console.error(
          "Erreur lors de la vérification du statut de l'utilisateur:",
          e
        );
      }
    };

    // Vérifier immédiatement au montage
    checkUserStatus();

    // Puis vérifier périodiquement
    const intervalId = setInterval(checkUserStatus, 1000);
    return () => clearInterval(intervalId);
  }, [userId, favorites]);

  const addToFavorites = async (item) => {
    if (!userId) {
      console.warn(
        "Impossible d'ajouter un favori: Aucun utilisateur connecté"
      );
      return false;
    }

    if (!favorites.some((favItem) => favItem.id === item.id)) {
      const newFavorites = [...favorites, item];
      setFavorites(newFavorites);

      // Sauvegarde immédiate dans AsyncStorage
      try {
        await AsyncStorage.setItem(
          `favorites_${userId}`,
          JSON.stringify(newFavorites)
        );
      } catch (e) {
        console.error("Erreur lors de la sauvegarde du favori:", e);
      }

      return true;
    }
    return false;
  };

  const removeFromFavorites = async (itemId) => {
    if (!userId) {
      console.warn(
        "Impossible de supprimer un favori: Aucun utilisateur connecté"
      );
      return false;
    }

    const newFavorites = favorites.filter((item) => item.id !== itemId);
    setFavorites(newFavorites);

    // Sauvegarde immédiate dans AsyncStorage
    try {
      await AsyncStorage.setItem(
        `favorites_${userId}`,
        JSON.stringify(newFavorites)
      );
    } catch (e) {}

    return true;
  };

  const isFavorite = (itemId) => {
    return favorites.some((item) => item.id === itemId);
  };

  const clearAllFavorites = async () => {
    if (!userId) return;

    setFavorites([]);

    // Sauvegarde immédiate dans AsyncStorage
    try {
      await AsyncStorage.setItem(`favorites_${userId}`, JSON.stringify([]));
    } catch (e) {}
  };

  // Fonction de débogage pour afficher l'état actuel des favoris dans AsyncStorage
  const debugFavorites = async () => {
    try {
      if (userId) {
        const savedFavorites = await AsyncStorage.getItem(
          `favorites_${userId}`
        );
      } else {
      }

      // Liste toutes les clés dans AsyncStorage
      const keys = await AsyncStorage.getAllKeys();
      const favoriteKeys = keys.filter((k) => k.startsWith("favorites_"));
    } catch (e) {}
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        clearAllFavorites,
        userId,
        debugFavorites, // Fonction utile pour le débogage
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites doit être utilisé dans un FavoritesProvider");
  }
  return context;
};
