import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interface pour les infos utilisateur
interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  favoris: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: User) => Promise<void>; // Nouvelle fonction
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      const storedUser = await AsyncStorage.getItem('userData');
      const token = await AsyncStorage.getItem('userToken');

      if (storedUser && token) {
        setUser(JSON.parse(storedUser)); // Charger les infos utilisateur
        setIsAuthenticated(true);
      }
    };

    checkAuthentication();
  }, []);

  const login = async (userData: User, token: string) => {
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userData', JSON.stringify(userData));

    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');

    setUser(null);
    setIsAuthenticated(false);
  };

  // ✅ Fonction pour mettre à jour l'utilisateur
  const updateUser = async (updatedUser: User) => {
    await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
