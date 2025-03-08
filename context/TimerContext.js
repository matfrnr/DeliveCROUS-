import React, { createContext, useContext, useState, useEffect } from "react";

// Création du contexte pour le minuteur
const TimerContext = createContext();

// Fournisseur du contexte du minuteur
export const TimerProvider = ({ children }) => {
  // État pour stocker le temps restant en secondes (initialisé à 600 secondes = 10 minutes)
  const [remainingTime, setRemainingTime] = useState(600);
  // État pour indiquer si une commande est en cours
  const [orderInProgress, setOrderInProgress] = useState(false);

  // Effet pour gérer le décompte du minuteur
  useEffect(() => {
    // Vérifie si une commande est en cours et si le temps restant est supérieur à 0
    if (orderInProgress && remainingTime > 0) {
      // Crée un intervalle qui décrémente le temps restant toutes les secondes
      const interval = setInterval(() => {
        setRemainingTime((prevTime) => {
          // Si le temps restant atteint 0, arrête l'intervalle et met à jour l'état
          if (prevTime <= 0) {
            clearInterval(interval);
            setOrderInProgress(false);
            return 0;
          }
          // Décrémente le temps restant
          return prevTime - 1;
        });
      }, 1000);

      // Fonction de nettoyage pour effacer l'intervalle lorsque le composant est démonté ou les dépendances changent
      return () => clearInterval(interval);
    }
  }, [orderInProgress, remainingTime]); // Les dépendances de l'effet sont orderInProgress et remainingTime

  // Fournit les valeurs du contexte aux composants enfants
  return (
    <TimerContext.Provider
      value={{
        remainingTime,
        setRemainingTime,
        orderInProgress,
        setOrderInProgress,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

// Hook personnalisé pour accéder aux valeurs du contexte du minuteur
export const useTimer = () => {
  const context = useContext(TimerContext);
  // Vérifie si le hook est utilisé à l'intérieur d'un TimerProvider
  if (!context) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
};
