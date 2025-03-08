import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCart } from "@/context/CartContext";

const OrderConfirmationScreen = () => {
    // Récupération du solde depuis le contexte du panier.
    const { balance } = useCart();

    return (
        <SafeAreaView style={styles.safeContainer}>
            {/* Barre de navigation */}
            <SafeAreaView style={styles.navbarContainer}>
                <View style={styles.navbar}>
                    <Text style={styles.title}>DeliveCrous</Text>
                    {/* Bouton de retour */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* Contenu principal de l'écran */}
            <View style={styles.contentContainer}>
                {/* Image de confirmation de commande réussie */}
                <Image
                    source={require("../../assets/images/sucess.png")}
                    style={styles.image}
                    resizeMode="contain"
                />

                {/* Titre de confirmation */}
                <Text style={styles.heading}>Commande envoyée !</Text>
                {/* Sous-titre avec des détails sur la commande */}
                <Text style={styles.subtext}>Elle vous attendra à la fin de votre cours ! Régalez vous !</Text>
                {/* Affichage du solde restant */}
                <Text style={styles.balance}>Solde CROUS restant: {balance.toFixed(2)} €</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    navbarContainer: {
        backgroundColor: '#fff',
    },
    navbar: {
        height: 60,
        backgroundColor: '#fff',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        paddingHorizontal: 15,
        marginTop: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    contentContainer: {
        flex: 1,
        alignItems: "center",
        padding: 20,
    },
    backButton: {
        position: "absolute",
        top: 20,
        left: 15,
    },
    image: {
        width: 350,
        height: 350,
        marginVertical: 20,
        marginTop: 50,
    },
    heading: {
        fontSize: 29,
        fontWeight: "bold",
        color: "#713335",
        textAlign: "center",
        marginBottom: 30,
    },
    subtext: {
        fontSize: 18,
        textAlign: "center",
        marginVertical: 10,
    },
    balance: {
        fontSize: 15,
        fontWeight: "400",
        color: "#748090",
    },
});

export default OrderConfirmationScreen;