import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useCart } from '../context/CartContext';

import Panier from '../assets/images/paniers.png';
import Compte from '../assets/images/utilisateur.png';
import Favoris from '../assets/images/favori.png';
import { Ionicons } from '@expo/vector-icons';


const UserScreen = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { cartItems, addToCart } = useCart();
  const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        if (userString) {
          setUser(JSON.parse(userString));
        } else {
          router.replace('/LoginScreen'); // Redirige si l'utilisateur n'est pas connecté
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur :', error);
        router.replace('/LoginScreen'); // Redirige en cas d'erreur
      }
    };

    loadUser();
  }, [router]);

  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Oui',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('user');
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('cartItems_' + user.id);
              await AsyncStorage.removeItem('balance_' + user.id);
              await AsyncStorage.removeItem('favorites_' + user.id);
              router.replace('/LoginScreen');
            } catch (error) {
              console.error('Erreur lors de la déconnexion :', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  if (!user) {
    return (
      <View>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Navbar */}
      <SafeAreaView style={styles.navbarContainer}>
        <View style={styles.navbar}>
          <TouchableOpacity onPress={() => router.push('/MainScreen')}>
            <Text style={styles.title}>DeliveCrous</Text>
          </TouchableOpacity>
          <View style={styles.navbarImages}>
            <TouchableOpacity onPress={() => router.push('/favorites')}>
              <Image source={Favoris} style={styles.navbarImage} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={Compte} style={[styles.navbarImage, { tintColor: '#2ecc71' }]} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/cart')}>
              <View style={styles.cartIconContainer}>
                <Image source={Panier} style={styles.navbarImage} />
                {totalItemsInCart > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{totalItemsInCart}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Contenu de l'écran User */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <Text style={styles.Headertitle}>Profil</Text>
        <Text style={styles.userInfo}>
          Nom: {user.nom}
        </Text>
        <Text style={styles.userInfo}>
          Prénom : {user.prenom}
        </Text>
        <Text style={styles.userInfo}>
          Email : {user.email}
        </Text>
        <View style={styles.logoutButtonContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',

  },
  navbarContainer: {
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 105,
    left: 15,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navbar: {
    height: 60,
    backgroundColor: 'rgb(250,250,250)',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginTop: 30,
  },
  navbarImages: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navbarImage: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  cartIconContainer: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
    padding: 16,
    paddingTop: 60,
  },
  userInfo: {
    fontSize: 18,
    marginBottom: 25,
  },
  logoutButtonContainer: {
    alignItems: 'center',
    width: '100%',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 25,
    width: 270,
    alignItems: 'center',
  },
  Headertitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default UserScreen;