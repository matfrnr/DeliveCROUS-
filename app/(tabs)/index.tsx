import { Stack } from 'expo-router';
import { useAuth } from '../../context/AuthContext'; // Utilisation du hook pour l'authentification
import MainScreen from '../../screens/MainScreen';
import LoginScreen from '../../screens/LoginScreen'; 
import UserScreen from '../../screens/UserScreen';

console.log('HomeScreen: Rendering'); // Ajout d'un log pour indiquer que le composant HomeScreen est rendu

export default function HomeScreen() {
  const { isAuthenticated } = useAuth();

  console.log('isAuthenticated:', isAuthenticated); // Affiche la valeur de isAuthenticated pour savoir si l'utilisateur est authentifié

  return (
    
        
        
          <LoginScreen /> 
        
  );
}
