# DeliveCROUS

Une application de livraison de repas pour les étudiants ! Avec la possibilité de consulter les plats, de les ajouter en ❤️ et de suivre la commande.

## Présentation

DeliveCROUS est une app React Native / Expo construite avec `expo-router`. Elle propose :

- un écran principal de sélection de produits
- une gestion de panier
- un système de favoris
- une navigation par onglets
- des écrans de login et de confirmation de commande

## Prérequis

- Node.js 18+ recommandé
- npm
- Expo CLI ou `npx expo`
- Android Studio / iOS Simulator pour l’émulation native (facultatif)

## Installation

```bash
 npm install
```

## Lancer l’application

```bash
npm start
```

Puis choisissez :

- Android avec `a`
- iOS avec `i`
- Web avec `w`
- Expo Go pour un smartphone physique

## Scripts disponibles

- `npm start` : lance Metro et Expo Router
- `npm run android` : démarre l’app sur un appareil Android ou un émulateur
- `npm run ios` : démarre l’app sur un simulateur iOS
- `npm run web` : lance l’app dans le navigateur
- `npm test` : exécute Jest en mode watch
- `npm run lint` : vérifie le code avec Expo lint
- `npm run reset-project` : réinitialise le projet via `scripts/reset-project.js`

## Structure du projet

- `app/` : pages et navigation de l’application
  - `screen/`: écrans principaux (`cart.tsx`, `favorites.tsx`, `LoginScreen.tsx`, `MainScreen.tsx`, `user.tsx`)
  - `(tabs)/` : navigation par onglets
  - `components/` : composants de l’interface (`item-detail.tsx`, `ItemCard.tsx`, `success-screen.tsx`)
- `components/` : éléments UI réutilisables (`ThemedText.tsx`, `ThemedView.tsx`)
- `context/` : context React pour le panier, les favoris, la commande et le timer
- `constants/` : constantes, notamment les couleurs
- `data/` : données de démonstration (`mockData.json`)
- `hooks/` : hooks personnalisés
- `services/` : appels API ou services partagés
- `assets/` : polices et images

## Tests

Le projet utilise Jest et React Native Testing Library. Pour lancer les tests :

```bash
npm test
```

## Notes

- La navigation est gérée par `expo-router`.
- Le projet est configuré pour fonctionner sur mobile et web via Expo.

## Ressources utiles

- Expo Router : https://docs.expo.dev/router/introduction/
- Expo : https://expo.dev/
- React Native : https://reactnative.dev/
