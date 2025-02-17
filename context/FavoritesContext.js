import React, { createContext, useContext, useState } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    const addToFavorites = (item) => {
        if (!favorites.some(favItem => favItem.id === item.id)) {
            setFavorites([...favorites, item]);
        }
    };

    const removeFromFavorites = (itemId) => {
        setFavorites(favorites.filter(item => item.id !== itemId));
    };

    const isFavorite = (itemId) => {
        return favorites.some(item => item.id === itemId);
    };

    return (
        <FavoritesContext.Provider value={{
            favorites,
            addToFavorites,
            removeFromFavorites,
            isFavorite
        }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};