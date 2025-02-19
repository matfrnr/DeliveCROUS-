import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';

// Définition du type utilisateur
interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  favoris: string[];
}

// Simule un appel API pour la connexion
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
    }, 1500);
  });
};

// Simule un appel API pour l'inscription
const fakeApiRegister = (nom: string, prenom: string, email: string, password: string): Promise<{ user: User; token: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email.includes('@')) {
        resolve({
          user: {
            id: Math.random().toString(36).substr(2, 9), // Génère un ID unique
            email,
            nom,
            prenom,
            favoris: [],
          },
          token: 'fake-jwt-token',
        });
      } else {
        reject(new Error('Email invalide'));
      }
    }, 1500);
  });
};

function AuthScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      if (isRegistering) {
        const response = await fakeApiRegister(nom, prenom, email, password);
        await login(response.user, response.token);
        console.log('Utilisateur inscrit:', response.user);
      } else {
        const response = await fakeApiLogin(email, password);
        await login(response.user, response.token);
        console.log('Utilisateur connecté:', response.user);
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Une erreur inconnue est survenue.');
      }
    }

    setLoading(false);
  };

  const isButtonDisabled = isRegistering
    ? email.trim() === '' || password.trim() === '' || nom.trim() === '' || prenom.trim() === ''
    : email.trim() === '' || password.trim() === '';

  return (
    <View style={styles.container}>
      {isRegistering && (
        <>
          <TextInput style={styles.input} placeholder="Nom" value={nom} onChangeText={setNom} />
          <TextInput style={styles.input} placeholder="Prénom" value={prenom} onChangeText={setPrenom} />
        </>
      )}
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry />

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Pressable
          style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
          onPress={handleAuth}
          disabled={isButtonDisabled}
        >
          <Text style={styles.buttonText}>{isRegistering ? "S'inscrire" : 'Se connecter'}</Text>
        </Pressable>
      )}

      <Pressable style={styles.switchButton} onPress={() => setIsRegistering(!isRegistering)}>
        <Text style={styles.switchButtonText}>
          {isRegistering ? 'Déjà un compte ? Se connecter' : 'Pas encore de compte ? S\'inscrire'}
        </Text>
      </Pressable>
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
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 15,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007bff',
    backgroundColor: 'white',
  },
  switchButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});

export default AuthScreen;
