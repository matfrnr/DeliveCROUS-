// CECI EST L'ECRAN D'ACCUEIL
console.log('MainScreen')
// src/screens/HomeScreen.js
import React from 'react';
import { View, FlatList, StyleSheet, SafeAreaView } from 'react-native';
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
];

const HomeScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={MOCK_ITEMS}
                renderItem={({ item }) => <ItemCard item={item} />}
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