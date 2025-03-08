import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../../services/api';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Panier from '../../assets/images/paniers.png';

function LoginScreen() {
    // États pour gérer les entrées utilisateur, le chargement, et l'affichage du mot de passe
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    // Fonction pour valider le formulaire avant la soumission
    const validateForm = () => {
        // Vérifie si les champs email et mot de passe sont remplis
        if (!email.trim() || !password.trim()) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return false;
        }

        // Validation basique de l'adresse email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Erreur', 'Veuillez entrer une adresse email valide');
            return false;
        }

        return true;
    };

    // Fonction pour gérer la logique de connexion
    const handleLogin = async () => {
        // Validation du formulaire avant de procéder
        if (!validateForm()) return;

        // Indique que le chargement est en cours
        setIsLoading(true);
        try {
            // Appel de l'API de connexion avec l'email et le mot de passe
            const response = await login(email, password);

            // Stockage du token et des informations utilisateur dans AsyncStorage
            await AsyncStorage.setItem('userToken', response.token);
            await AsyncStorage.setItem('user', JSON.stringify(response.user));

            // Redirection vers l'écran principal après une connexion réussie
            router.replace('/screen/MainScreen');

        } catch (error) {
            // Gestion des erreurs de connexion
            Alert.alert(
                'Échec de connexion',
                'Identifiants invalides. Veuillez réessayer.'
            );
        } finally {
            // Indique que le chargement est terminé
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar style="dark" />

            <View style={styles.logoContainer}>

                <Image source={Panier} style={styles.logoImage} />
                <Text style={styles.title}>Bienvenue</Text>
                <Text style={styles.subtitle}>Connectez-vous pour continuer</Text>
            </View>

            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#aaa"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        placeholder="Mot de passe"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        style={styles.input}
                        placeholderTextColor="#aaa"
                    />
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeIcon}
                    >
                        <Ionicons
                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                            size={20}
                            color="#666"
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.loginButtonText}>Se connecter</Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 40,
    },
    logoImage: {
        width: 80,
        height: 80,
        marginBottom: 20,
    },
    logoPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    logoText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#555',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
    },
    formContainer: {
        paddingHorizontal: 24,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 12,
        height: 56,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    eyeIcon: {
        padding: 8,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: '#5073F2',
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: '#5073F2',
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#5073F2',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
        marginTop: 15,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 'auto',
        marginBottom: 40,
    },
    footerText: {
        color: '#666',
        fontSize: 14,
    },
    registerText: {
        color: '#5073F2',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default LoginScreen;