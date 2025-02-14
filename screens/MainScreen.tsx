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
        image: 'https://yuka.io/wp-content/uploads/Burger-banniere-1024x512.jpg',
    },
    {
        id: '2',
        nom: 'Pizza Margherita',
        description: 'Pizza traditionnelle avec sauce tomate, mozzarella et basilic frais',
        prix: 7.00,
        image: 'https://img.passeportsante.net/1200x675/2022-09-23/shutterstock-2105210927.webp',
    },
    {
        id: '3',
        nom: 'Salade César',
        description: 'Salade fraîche avec laitue romaine, parmesan, croûtons et sauce césar',
        prix: 5.50,
        image: 'https://img.hellofresh.com/f_auto,fl_lossy,h_640,q_auto,w_1200/hellofresh_s3/image/5ba8a97130006c3be559c7d2-6cea7001.jpg',
    },
    {
        id: '4',
        nom: 'Pâtes Carbonara',
        description: 'Pâtes fraîches avec sauce crémeuse, lardons et parmesan',
        prix: 6.00,
        image: 'https://www.panzani.fr/_ipx/f_webp&q_80&s_1800x1196/https://backend.panzani.fr/app/uploads/2023/10/fettuccine-a-la-carbonara-et-chorizo-min-scaled.jpg',
    },
    {
        id: '5',
        nom: 'Frites Maison',
        description: 'Frites croustillantes servies avec mayonnaise',
        prix: 2.50,
        image: 'https://img.passeportsante.net/1000x526/2021-03-22/i100610-frites-maison.jpeg',
    },
    {
        id: '6',
        nom: 'Tacos Poulet',
        description: 'Tortilla garnie de poulet grillé, sauce fromagère et légumes frais',
        prix: 5.00,
        image: 'https://s3.ca-central-1.amazonaws.com/files.exceldor.ca/files/seo/_1200x630_crop_center-center_82_none/Tacos-de-poulet.jpg?mtime=1720554819',
    },
    {
        id: '7',
        nom: 'Sushi Mix',
        description: 'Assortiment de sushis variés avec sauce soja et wasabi',
        prix: 12.00,
        image: 'https://img.freepik.com/photos-premium/sushi-mix-set-faux-nourriture-japonaise-echantillon-affichage-bois-bambou-au-japon_43300-355.jpg',
    },
    {
        id: '8',
        nom: 'Steak Frites',
        description: 'Steak grillé accompagné de frites croustillantes et sauce au poivre',
        prix: 10.00,
        image: 'https://monpanierlatin.co.uk/cdn/shop/articles/Capture_d_ecran_2022-04-25_a_15.52.02.png?v=1650898431',
    },
    {
        id: '9',
        nom: 'Crêpes au Chocolat',
        description: 'Crêpes maison servies avec une sauce chocolat fondante',
        prix: 4.50,
        image: 'https://www.kilometre-0.fr/wp-content/uploads/2019/01/images20160123-Cuisine_Mart-322.jpg',
    },
    {
        id: '10',
        nom: 'Smoothie Mangue',
        description: 'Boisson rafraîchissante à base de mangue et lait de coco',
        prix: 3.50,
        image: 'https://wordpress.potagercity.fr/wp-content/uploads/2019/06/RECETTE_smoothie_mangue_poire_banane-1.jpg',
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