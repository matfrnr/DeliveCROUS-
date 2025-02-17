// app/favorites.js
import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';

import Panier from '../assets/images/paniers.png'; // Importez l'image locale
import Compte from '../assets/images/utilisateur.png';
import Favoris from '../assets/images/favori.png';

const FavoritesScreen = () => {
    const router = useRouter();
    const { cartItems } = useCart();
    const { favorites, removeFromFavorites } = useFavorites();
    const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

    const handleRemoveFromFavorites = (itemId) => {
        removeFromFavorites(itemId);
    };

    const renderFavoriteItem = ({ item }) => (
        <TouchableOpacity
            style={styles.favoriteItem}
            onPress={() => router.push({
                pathname: '/item-detail',
                params: {
                    id: item.id,
                    nom: item.nom,
                    description: item.description,
                    prix: item.prix,
                    image: item.image,
                    categorie: item.categorie,
                    allergenes: item.allergenes,
                    calories: item.calories,
                    origine: item.origine
                }
            })}
        >
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.nom}</Text>
                <Text style={styles.itemPrice}>{item.prix.toFixed(2)} €</Text>
                <Text style={styles.itemCategory}>{item.categorie}</Text>
            </View>
            <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => handleRemoveFromFavorites(item.id)}
            >
                <Icon name="heart" size={24} color="red" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeContainer}>
            {/* Navbar */}
            <View style={styles.navbar}>
                <TouchableOpacity onPress={() => router.push('/')}>
                    <Text style={styles.title}>DeliveCrous</Text>
                </TouchableOpacity>
                <View style={styles.navbarImages}>
                    <TouchableOpacity onPress={() => router.push('/favorites')}>
                        <Image source={Favoris} style={[styles.navbarImage, { tintColor: '#2ecc71' }]} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image source={Compte} style={styles.navbarImage} />
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

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Mes Favoris</Text>
            </View>


            {favorites.length > 0 ? (
                <FlatList
                    data={favorites}
                    renderItem={renderFavoriteItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Icon name="heart-outline" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>Vous n'avez pas encore de favoris</Text>
                    <TouchableOpacity
                        style={styles.browseButton}
                        onPress={() => router.push('/')}
                    >
                        <Text style={styles.browseButtonText}>Parcourir le menu</Text>
                    </TouchableOpacity>
                </View>
            )}
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
    navbar: {
        height: 60,
        backgroundColor: 'rgb(250,250,250)',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        justifyContent: 'space-between',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        paddingHorizontal: 15,
        marginTop: 30,
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
    navbarImages: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navbarImage: {
        width: 25,
        height: 25,
        marginRight: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    headerContainer: {
        padding: 16,
        paddingTop: 60,
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    listContainer: {
        padding: 16,
    },
    favoriteItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 16,
        padding: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    itemInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 14,
        color: '#2ecc71',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    itemCategory: {
        fontSize: 12,
        color: '#666',
    },
    favoriteButton: {
        justifyContent: 'center',
        padding: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        marginTop: 16,
        marginBottom: 24,
    },
    browseButton: {
        backgroundColor: '#2ecc71',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    browseButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
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
});

export default FavoritesScreen;