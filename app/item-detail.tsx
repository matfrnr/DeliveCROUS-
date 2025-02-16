// app/item-detail.js
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { useCart } from '../context/CartContext';

// Importez les mêmes images que dans HomeScreen
import Panier from '../assets/images/paniers.png';
import Compte from '../assets/images/utilisateur.png';
import Favoris from '../assets/images/favori.png';

const ItemDetailScreen = () => {
    const router = useRouter();
    // Récupération des paramètres de l'URL
    const params = useLocalSearchParams();
    const [isFavorite, setIsFavorite] = useState(false);
    const { cartItems } = useCart();
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

    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(item);
        Alert.alert("Ajouté au panier", `${item.nom} a été ajouté à votre panier`);
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            {/* Navbar */}
            <SafeAreaView style={styles.navbarContainer}>
                <View style={styles.navbar}>
                    <Text style={styles.title}>DeliveCrous</Text>
                    <View style={styles.navbarImages}>
                        <Image source={Favoris} style={styles.navbarImage} />
                        <Image source={Compte} style={styles.navbarImage} />
                        <TouchableOpacity onPress={() => router.push('/cart')}>
                            <Image source={Panier} style={styles.navbarImage} />
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
                            onPress={(e) => {
                                e.stopPropagation(); // Empêche la navigation
                                setIsFavorite(!isFavorite);
                            }}
                        >
                            <Icon
                                name={isFavorite ? 'heart' : 'heart-outline'}
                                size={24}
                                color={isFavorite ? 'red' : 'gray'}
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
    allergenesAndCaloriesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    allergenesContainer: {
        flex: 1,
        marginRight: 8,
    },
    itemOrigine: {
        fontSize: 20,
        color: '#000',
        marginBottom: 12,
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
    cartIconContainer: {
        position: 'relative',
    },
    cartBadge: {
        position: 'absolute',
        right: 5,
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
    itemAllergene: {
        fontSize: 16,
        color: '#000',
    },
    nameAndIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
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
    imageContainer: {
        position: 'relative',
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
    navbarImages: {
        flexDirection: 'row',
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
    itemImage: {
        width: '100%',
        height: 270,
        resizeMode: 'cover',
    },
    detailsContainer: {
        padding: 16,
        paddingTop: 25,
        flex: 1,
    },
    itemName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
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