// src/screens/HomeScreen.js
import React from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, Alert } from 'react-native';
import ItemCard from '../components/ItemCard';

// Données mockées pour l'affichage
const MOCK_ITEMS = [
    {
        id: '1',
        nom: 'Burger Végétarien',
        description: 'Délicieux burger avec steak végétal, salade, tomates et sauce spéciale',
        prix: 6.50,
        image: 'https://i.imgur.com/4ewAzgQ.jpg',
    },
    {
        id: '2',
        nom: 'Pizza Margherita',
        description: 'Pizza traditionnelle avec sauce tomate, mozzarella et basilic frais',
        prix: 7.00,
        image: 'https://i.imgur.com/QYvOlrI.jpg',
    },
    {
        id: '3',
        nom: 'Salade César',
        description: 'Salade fraîche avec laitue romaine, parmesan, croûtons et sauce césar',
        prix: 5.50,
        image: 'https://i.imgur.com/ZFQGFZS.jpg',
    },
    {
        id: '4',
        nom: 'Pâtes Carbonara',
        description: 'Pâtes fraîches avec sauce crémeuse, lardons et parmesan',
        prix: 6.00,
        image: 'https://i.imgur.com/7BDrMHB.jpg',
    },
    {
        id: '5',
        nom: 'Frites Maison',
        description: 'Frites croustillantes servies avec mayonnaise',
        prix: 2.50,
        image: 'https://i.imgur.com/tVecD3G.jpg',
    },
    {
        id: '6',
        nom: 'Tacos Poulet',
        description: 'Tortilla garnie de poulet grillé, sauce fromagère et légumes frais',
        prix: 5.00,
        image: 'https://i.imgur.com/TY5aNZz.jpg',
    },
    {
        id: '7',
        nom: 'Sushi Mix',
        description: 'Assortiment de sushis variés avec sauce soja et wasabi',
        prix: 12.00,
        image: 'https://i.imgur.com/8hN6W3G.jpg',
    },
    {
        id: '8',
        nom: 'Steak Frites',
        description: 'Steak grillé accompagné de frites croustillantes et sauce au poivre',
        prix: 10.00,
        image: 'https://i.imgur.com/jb2dQx9.jpg',
    },
    {
        id: '9',
        nom: 'Crêpes au Chocolat',
        description: 'Crêpes maison servies avec une sauce chocolat fondante',
        prix: 4.50,
        image: 'https://i.imgur.com/E1Kk7Ka.jpg',
    },
    {
        id: '10',
        nom: 'Smoothie Mangue',
        description: 'Boisson rafraîchissante à base de mangue et lait de coco',
        prix: 3.50,
        image: 'https://i.imgur.com/bktLgXq.jpg',
    },
];

const HomeScreen = () => {
    const handleAddToCart = (item) => {
        // Cette fonction sera implémentée plus tard
        // Pour l'instant, juste une notification de confirmation
        Alert.alert("Ajouté au panier", `${item.nom} a été ajouté à votre panier`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={MOCK_ITEMS}
                renderItem={({ item }) => (
                    <ItemCard
                        item={item}
                        onAddToCart={handleAddToCart}
                    />
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    list: {
        paddingVertical: 16,
    },
});

export default HomeScreen;