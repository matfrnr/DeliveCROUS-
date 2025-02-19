import React, { useState } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Text,
  Platform,
  Alert,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function AuthScreen() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nom: '',
    prenom: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  // Données de démonstration
  const demoLoginData = {
    email: 'test@test.com',
    password: 'password123',
    nom: '',
    prenom: ''
  };

  const demoRegisterData = {
    email: 'demo@example.com',
    password: 'demo123',
    nom: 'Demo',
    prenom: 'User'
  };

  const fillDemoData = () => {
    setFormData(isRegistering ? demoRegisterData : demoLoginData);
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.email.match(/\S+@\S+\.\S+/)) {
      errors.push("L'email n'est pas valide");
    }
    if (formData.password.length < 4) {
      errors.push("Le mot de passe doit contenir au moins 4 caractères");
    }
    if (isRegistering) {
      if (!formData.nom.trim()) {
        errors.push("Le nom est requis");
      }
      if (!formData.prenom.trim()) {
        errors.push("Le prénom est requis");
      }
    }
    return errors;
  };

  const handleAuth = async () => {
    setErrorMessage(null);
    
    const errors = validateForm();
    if (errors.length > 0) {
      setErrorMessage(errors[0]);
      return;
    }

    setLoading(true);
    try {
      console.log('Tentative de connexion avec:', {
        email: formData.email,
        password: formData.password
      });

      if (isRegistering) {
        console.log('Mode inscription:', formData);
        const response = await api.register(
          formData.email,
          formData.password,
          formData.nom,
          formData.prenom
        );
        console.log('Réponse inscription:', response);
        if (response && response.user) {
          await login(response.user, response.token);
          Alert.alert('Succès', 'Inscription réussie !');
        } else {
          throw new Error('Réponse inscription invalide');
        }
      } else {
        console.log('Mode connexion:', {
          email: formData.email,
          password: formData.password
        });
        const response = await api.login(formData.email, formData.password);
        console.log('Réponse connexion:', response);
        if (response && response.user) {
          await login(response.user, response.token);
        } else {
          throw new Error('Réponse connexion invalide');
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : 'Une erreur est survenue lors de la connexion'
      );
    } finally {
      setLoading(false);
    }
  };


  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setErrorMessage(null);
    setFormData({
      email: '',
      password: '',
      nom: '',
      prenom: ''
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>
            {isRegistering ? 'Créer un compte' : 'Connexion'}
          </Text>

          <Pressable
            style={styles.demoButton}
            onPress={fillDemoData}
          >
            <Text style={styles.demoButtonText}>
              Remplir avec données de test
            </Text>
          </Pressable>

          <View style={styles.testAccountsContainer}>
            <Text style={styles.testAccountsTitle}>Comptes de test disponibles :</Text>
            <Text style={styles.testAccount}>test@test.com / password123</Text>
            <Text style={styles.testAccount}>etudiant@univ.fr / 1234</Text>
          </View>

          {isRegistering && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Nom"
                value={formData.nom}
                onChangeText={(text) => setFormData(prev => ({ ...prev, nom: text }))}
                placeholderTextColor="#666"
              />
              <TextInput
                style={styles.input}
                placeholder="Prénom"
                value={formData.prenom}
                onChangeText={(text) => setFormData(prev => ({ ...prev, prenom: text }))}
                placeholderTextColor="#666"
              />
            </>
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#666"
          />

          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            value={formData.password}
            onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
            secureTextEntry
            placeholderTextColor="#666"
          />

          {errorMessage && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed
            ]}
            onPress={handleAuth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>
                {isRegistering ? "S'inscrire" : 'Se connecter'}
              </Text>
            )}
          </Pressable>

          <Pressable
            style={styles.switchButton}
            onPress={toggleMode}
          >
            <Text style={styles.switchButtonText}>
              {isRegistering 
                ? 'Déjà un compte ? Se connecter'
                : "Pas encore de compte ? S'inscrire"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  errorText: {
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#007aff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonPressed: {
    backgroundColor: '#0056b3',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    marginTop: 20,
    padding: 12,
  },
  switchButtonText: {
    color: '#007aff',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  demoButton: {
    backgroundColor: '#34c759',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  demoButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  testAccountsContainer: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  testAccountsTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#856404',
  },
  testAccount: {
    color: '#856404',
    fontSize: 12,
    marginBottom: 4,
  },
});

export default AuthScreen;