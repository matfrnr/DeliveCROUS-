import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

// Assurez-vous d'importer les écrans correctement
import MainScreen from '../MainScreen';
import LoginScreen from '../LoginScreen';

export default function HomeScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [loading, setLoading] = useState(true); // Ajout d'un état de chargement
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Vérifiez si le token ou l'utilisateur est stocké dans AsyncStorage
        const userString = await AsyncStorage.getItem('user');

        if (userString) {
          // L'utilisateur est connecté
          setIsLoggedIn(true);
        } else {
          // L'utilisateur n'est pas connecté
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de la session :", error);
        setIsLoggedIn(false); // En cas d'erreur, redirigez vers l'écran de connexion
      } finally {
        setLoading(false); // Le chargement est terminé
      }
    };
    checkSession();
  }, [router]); // Ajoutez router aux dépendances

  if (loading) {
    // Affichez un indicateur de chargement pendant la vérification de la session
    return null; // ou un composant de chargement
  }

  if (isLoggedIn) {
    // Si l'utilisateur est connecté, affichez MainScreen
    return <MainScreen />;
  } else {
    // Si l'utilisateur n'est pas connecté, affichez LoginScreen
    return <LoginScreen />;
  }
}