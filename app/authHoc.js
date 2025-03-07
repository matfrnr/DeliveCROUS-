import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const checkToken = async () => {
        try {
          // Récupérez le token depuis AsyncStorage
          const token = await AsyncStorage.getItem("userToken");

          if (!token) {
            // Si aucun token n'est trouvé, redirigez vers la page de connexion
            router.replace("/LoginScreen");
          }
        } catch (error) {
          console.error("Erreur lors de la vérification du token :", error);
          // En cas d'erreur, redirigez vers la page de connexion
          router.replace("/LoginScreen");
        } finally {
          setIsLoading(false);
        }
      };

      checkToken();
    }, [router]); // Ajoutez router aux dépendances de useEffect

    if (isLoading) {
      return null; // Ou un indicateur de chargement
    }

    return <WrappedComponent {...props} />;
  };
  return AuthenticatedComponent;
};