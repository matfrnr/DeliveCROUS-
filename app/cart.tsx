// app/cart.js
import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../context/CartContext';

// Importez les mêmes images que dans HomeScreen
import Panier from '../assets/images/paniers.png';
import Compte from '../assets/images/utilisateur.png';
import Favoris from '../assets/images/favori.png';

const CartScreen = () => {
    const router = useRouter();
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            Alert.alert("Panier vide", "Veuillez ajouter des articles à votre panier avant de passer commande.");
            return;
        }

        Alert.alert(
            "Passer commande",
            "Voulez-vous confirmer votre commande ?",
            [
                {
                    text: "Annuler",
                    style: "cancel"
                },
                {
                    text: "Confirmer",
                    onPress: () => {
                        router.push('/sucess-screen');
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            {/* Navbar */}
            <SafeAreaView style={styles.navbarContainer}>
                <View style={styles.navbar}>
                    <TouchableOpacity onPress={() => router.push('/')}>
                        <Text style={styles.title}>DeliveCrous</Text>
                    </TouchableOpacity>
                    <View style={styles.navbarImages}>
                        <TouchableOpacity onPress={() => router.replace('/favorites')}>
                            <Image source={Favoris} style={styles.navbarImage} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image source={Compte} style={styles.navbarImage} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image source={Panier} style={[styles.navbarImage, { tintColor: '#2ecc71' }]} />
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
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Mon Panier</Text>
            </View>

            {cartItems.length === 0 ? (
                <View style={styles.emptyCartContainer}>
                    <Ionicons name="cart-outline" size={64} color="#ccc" />
                    <Text style={styles.emptyCartText}>Votre panier est vide</Text>
                    <TouchableOpacity
                        style={styles.continueShopping}
                        onPress={() => router.push('/')}
                    >
                        <Text style={styles.continueShoppingText}>Continuer mes achats</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <ScrollView style={styles.cartItemsContainer}>
                        {cartItems.map((item) => (
                            <View key={item.id} style={styles.cartItemContainer}>
                                <Image source={{ uri: item.image }} style={styles.itemImage} />
                                <View style={styles.itemDetailsContainer}>
                                    <Text style={styles.itemName}>{item.nom}</Text>
                                    <Text style={styles.itemPrice}>{item.prix.toFixed(2)} €</Text>
                                    <View style={styles.quantityContainer}>
                                        <TouchableOpacity
                                            onPress={() => updateQuantity(item.id, item.quantity - 1)}
                                        >
                                            <Ionicons name="remove-circle-outline" size={24} color="#2ecc71" />
                                        </TouchableOpacity>
                                        <Text style={styles.quantityText}>{item.quantity}</Text>
                                        <TouchableOpacity
                                            onPress={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            <Ionicons name="add-circle-outline" size={24} color="#2ecc71" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={styles.removeItemButton}
                                    onPress={() => removeFromCart(item.id)}
                                >
                                    <Ionicons name="trash-outline" size={24} color="#e74c3c" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>

                    <View style={styles.cartSummaryContainer}>
                        <Text style={styles.totalText}>Total: {getCartTotal().toFixed(2)} €</Text>
                        <TouchableOpacity
                            style={styles.checkoutButton}
                            onPress={handleCheckout}
                        >
                            <Text style={styles.checkoutButtonText}>Passer commande</Text>
                        </TouchableOpacity>
                    </View>
                </>
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
    headerContainer: {
        padding: 16,
        paddingTop: 60,
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    emptyCartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    emptyCartText: {
        fontSize: 18,
        color: '#666',
        marginTop: 16,
        marginBottom: 24,
    },
    continueShopping: {
        backgroundColor: '#2ecc71',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    continueShoppingText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cartItemsContainer: {
        flex: 1,
    },
    cartItemContainer: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        padding: 12,
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    itemDetailsContainer: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemPrice: {
        fontSize: 16,
        color: '#2ecc71',
        fontWeight: 'bold',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityText: {
        fontSize: 16,
        marginHorizontal: 8,
    },
    removeItemButton: {
        justifyContent: 'center',
        padding: 8,
    },
    cartSummaryContainer: {
        backgroundColor: '#fff',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    checkoutButton: {
        backgroundColor: '#2ecc71',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CartScreen;