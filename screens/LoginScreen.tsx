import React, { useState } from 'react';
import { View, TextInput, Pressable, Alert, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';

// Définition du type utilisateur
interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  favoris: string[];
}

// Simule un appel API avec une promesse (remplace le `mockUsers`)
const fakeApiLogin = (email: string, password: string): Promise<{ user: User; token: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'a@a' && password === 'a') {
        resolve({
          user: {
            id: '1',
            email: 'a@a',
            nom: 'Dupont',
            prenom: 'Jean',
            favoris: ['1', '2'],
          },
          token: 'fake-jwt-token',
        });
      } else {
        reject(new Error('Email ou mot de passe incorrect'));
      }
    }, 1500); // Simule un délai de réponse de 1.5s
  });
};

function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage(null); // Réinitialise le message d'erreur avant de tenter la connexion

    try {
      const response = await fakeApiLogin(email, password);
      await login(response.user, response.token);
      console.log('Utilisateur connecté:', response.user);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message); // Stocke l'erreur pour affichage
      } else {
        setErrorMessage('Une erreur inconnue est survenue.');
      }
    }

    setLoading(false);
  };

  // Vérifie si les champs sont remplis pour activer le bouton
  const isButtonDisabled = email.trim() === '' || password.trim() === '';

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Mot de passe" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
      />

      {/* Affichage du message d'erreur en rouge si la connexion échoue */}
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Pressable 
          style={[styles.button, isButtonDisabled && styles.buttonDisabled]} 
          onPress={handleLogin} 
          disabled={isButtonDisabled}
        >
          <Text style={styles.buttonText}>Se connecter</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 12, paddingLeft: 8 },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 10 },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#aaa', // Couleur grisée pour le bouton désactivé
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
