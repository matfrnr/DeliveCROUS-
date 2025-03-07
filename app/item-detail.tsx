// app/item-detail.js
import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

// Import des images de la navbar
import Panier from '../assets/images/paniers.png'; // Importez l'image locale
import Compte from '../assets/images/utilisateur.png';
import Favoris from '../assets/images/favori.png';

const ItemDetailScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { cartItems, addToCart } = useCart();
    const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
    const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

    // Reconstruction de l'objet item à partir des paramètres
    const item = {
        id: params.id,
        nom: params.nom,
        description: params.description,
        prix: parseFloat(params.prix),
        image: params.image,
        allergenes: params.allergenes,
        categorie: params.categorie,
        calories: params.calories,
        origine: params.origine
    };

    const handleAddToCart = () => {
        addToCart(item);
        Alert.alert("Ajouté au panier", `${item.nom} a été ajouté à votre panier`);
    };

    const handleFavoriteToggle = () => {
        if (isFavorite(item.id)) {
            removeFromFavorites(item.id);
        } else {
            addToFavorites(item);
        }
    };

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
            </SafeAreaView>

            {/* Bouton retour */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <ScrollView style={styles.contentContainer}>
                {/* Image du produit */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.image }} style={styles.itemImage} />
                    <View style={styles.categoryOverlay}>
                        <Text style={styles.categoryText}>{item.categorie}</Text>
                    </View>
                </View>

                {/* Informations du produit */}
                <View style={styles.detailsContainer}>
                    <View style={styles.nameAndIconContainer}>
                        <Text style={styles.itemName}>{item.nom}</Text>
                        <TouchableOpacity
                            onPress={handleFavoriteToggle}
                            style={styles.favoriteButton}
                        >
                            <Icon
                                name={isFavorite(item.id) ? 'heart' : 'heart-outline'}
                                size={30}
                                color={isFavorite(item.id) ? 'red' : 'gray'}
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.itemPrice}>{item.prix.toFixed(2)} €</Text>
                    <Text style={styles.itemDescription}>{item.description}</Text>

                    <View style={styles.allergenesAndCaloriesContainer}>
                        <View style={styles.allergenesContainer}>
                            <Text style={styles.allergenesTitle}>Allergènes:</Text>
                            {Array.isArray(item.allergenes) ? (
                                item.allergenes.map((allergene, index) => (
                                    <Text key={index} style={styles.itemAllergene}>{allergene}</Text>
                                ))
                            ) : (
                                item.allergenes.split(',').map((allergene, index) => (
                                    <Text key={index} style={styles.itemAllergene}>{allergene.trim()}</Text>
                                ))
                            )}
                        </View>
                        <View style={styles.caloriesContainer}>
                            <Text style={styles.allergenesTitle}>Calories :</Text>
                            <Text style={styles.itemDescription}>{item.calories}kcal</Text>
                        </View>
                    </View>

                    <Text style={styles.itemOrigine}>{item.origine}</Text>

                    {/* Bouton ajouter au panier */}
                    <TouchableOpacity
                        style={styles.addToCartButton}
                        onPress={handleAddToCart}
                    >
                        <Text style={styles.addToCartButtonText}>Ajouter au panier</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
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
    contentContainer: {
        flex: 1,
    },
    imageContainer: {
        position: 'relative',
    },
    itemImage: {
        width: '100%',
        height: 270,
        resizeMode: 'cover',
    },
    categoryOverlay: {
        position: 'absolute',
        top: 20,
        right: 15,
        backgroundColor: 'rgb(40, 128, 24)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
    categoryText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    detailsContainer: {
        padding: 16,
        paddingTop: 25,
        flex: 1,
    },
    nameAndIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    itemName: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 16,
    },
    favoriteButton: {
        padding: 8,
    },
    itemPrice: {
        fontSize: 18,
        color: '#2ecc71',
        fontWeight: 'bold',
        marginBottom: 16,
    },
    itemDescription: {
        fontSize: 16,
        color: '#555',
        lineHeight: 24,
        marginBottom: 24,
    },
    allergenesAndCaloriesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    allergenesContainer: {
        flex: 1,
        marginRight: 8,
    },
    caloriesContainer: {
        marginLeft: 8,
        marginRight: 16,
    },
    allergenesTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    itemAllergene: {
        fontSize: 16,
        color: '#000',
    },
    itemOrigine: {
        fontSize: 20,
        color: '#000',
        marginBottom: 12,
    },
    addToCartButton: {
        backgroundColor: '#2ecc71',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    addToCartButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ItemDetailScreen;