// src/screens/HomeScreen.js
import React from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, Alert, Text, Image } from 'react-native';
import ItemCard from '../components/ItemCard';
import Panier from '../assets/images/paniers.png'; // Importez l'image locale
import Compte from '../assets/images/utilisateur.png'; // Importez l'image locale
import Favoris from '../assets/images/favori.png'; // Importez l'image locale

// Données mockées pour l'affichage
const MOCK_ITEMS = [
    {
        id: '1',
        nom: 'Burger Végétarien',
        description: 'Délicieux burger avec steak végétal, salade, tomates et sauce spéciale',
        prix: 6.50,
        image: 'https://yuka.io/wp-content/uploads/Burger-banniere-1024x512.jpg',
        allergenes: ['gluten', 'soja', 'moutarde', 'sésame'],
        categorie: 'plat principal',
        calories: 550,
        origine: '🇺🇸 États-Unis',
    },
    {
        id: '2',
        nom: 'Pizza Margherita',
        description: 'Pizza traditionnelle avec sauce tomate, mozzarella et basilic frais',
        prix: 7.00,
        image: 'https://img.passeportsante.net/1200x675/2022-09-23/shutterstock-2105210927.webp',
        allergenes: ['gluten', 'lait'],
        categorie: 'plat principal',
        calories: 700,
        origine: '🇮🇹 Italie',
    },
    {
        id: '3',
        nom: 'Salade César',
        description: 'Salade fraîche avec laitue romaine, parmesan, croûtons et sauce césar',
        prix: 5.50,
        image: 'https://img.hellofresh.com/f_auto,fl_lossy,h_640,q_auto,w_1200/hellofresh_s3/image/5ba8a97130006c3be559c7d2-6cea7001.jpg',
        allergenes: ['gluten', 'lait', 'œufs', 'poisson'],
        categorie: 'plat principal',
        calories: 450,
        origine: '🇺🇸 États-Unis',
    },
    {
        id: '4',
        nom: 'Pâtes Carbonara',
        description: 'Pâtes fraîches avec sauce crémeuse, lardons et parmesan',
        prix: 6.00,
        image: 'https://www.panzani.fr/_ipx/f_webp&q_80&s_1800x1196/https://backend.panzani.fr/app/uploads/2023/10/fettuccine-a-la-carbonara-et-chorizo-min-scaled.jpg',
        allergenes: ['gluten', 'lait', 'œufs'],
        categorie: 'plat principal',
        calories: 650,
        origine: '🇮🇹 Italie',
    },
    {
        id: '5',
        nom: 'Frites Maison',
        description: 'Frites croustillantes servies avec mayonnaise',
        prix: 2.50,
        image: 'https://img.passeportsante.net/1000x526/2021-03-22/i100610-frites-maison.jpeg',
        categorie: 'accompagnement',
        allergenes: ['Aucun allergène dans ce plat'],
        calories: 400,
        origine: '🇧🇪 Belgique',
    },
    {
        id: '6',
        nom: 'Tacos Poulet',
        description: 'Tortilla garnie de poulet grillé, sauce fromagère et légumes frais',
        prix: 5.00,
        image: 'https://s3.ca-central-1.amazonaws.com/files.exceldor.ca/files/seo/_1200x630_crop_center-center_82_none/Tacos-de-poulet.jpg?mtime=1720554819',
        allergenes: ['gluten', 'lait', 'moutarde'],
        categorie: 'plat principal',
        calories: 550,
        origine: '🇲🇽 Mexique',
    },
    {
        id: '7',
        nom: 'Sushi Mix',
        description: 'Assortiment de sushis variés avec sauce soja et wasabi',
        prix: 12.00,
        image: 'https://img.freepik.com/photos-premium/sushi-mix-set-faux-nourriture-japonaise-echantillon-affichage-bois-bambou-au-japon_43300-355.jpg',
        allergenes: ['poisson', 'soja', 'sésame'],
        categorie: 'plat principal',
        calories: 320,
        origine: '🇯🇵 Japon',
    },
    {
        id: '8',
        nom: 'Steak Frites',
        description: 'Steak grillé accompagné de frites croustillantes et sauce au poivre',
        prix: 10.00,
        image: 'https://monpanierlatin.co.uk/cdn/shop/articles/Capture_d_ecran_2022-04-25_a_15.52.02.png?v=1650898431',
        categorie: 'plat principal',
        allergenes: ['Aucun allergène dans ce plat'],
        calories: 750,
        origine: '🇫🇷 France',
    },
    {
        id: '9',
        nom: 'Crêpes au Chocolat',
        description: 'Crêpes maison servies avec une sauce chocolat fondante',
        prix: 4.50,
        image: 'https://www.kilometre-0.fr/wp-content/uploads/2019/01/images20160123-Cuisine_Mart-322.jpg',
        allergenes: ['gluten', 'lait', 'œufs'],
        categorie: 'dessert',
        calories: 350,
        origine: '🇫🇷 France',
    },
    {
        id: '10',
        nom: 'Smoothie Mangue',
        description: 'Boisson rafraîchissante à base de mangue et lait de coco',
        prix: 3.50,
        image: 'https://wordpress.potagercity.fr/wp-content/uploads/2019/06/RECETTE_smoothie_mangue_poire_banane-1.jpg',
        allergenes: ['lait'],
        categorie: 'boisson',
        calories: 200,
        origine: '🇹🇭 Thaïlande',
    },
];

const HomeScreen = () => {
    const handleAddToCart = (item) => {
        // Cette fonction sera implémentée plus tard
        // Pour l'instant, juste une notification de confirmation
        Alert.alert("Ajouté au panier", `${item.nom} a été ajouté à votre panier`);
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            {/* SafeAreaView pour la navbar */}
            <SafeAreaView style={styles.navbarContainer}>
                <View style={styles.navbar}>
                    <Text style={styles.title}>DeliveCrous</Text>
                    <View style={styles.navbarImages}>
                        <Image
                            source={Favoris} // Utilisez l'image locale importée
                            style={styles.navbarImage}
                        />
                        <Image
                            source={Compte} // Utilisez l'image locale importée
                            style={styles.navbarImage}
                        />
                        <Image
                            source={Panier} // Utilisez l'image locale importée
                            style={styles.navbarImage}
                        />
                    </View>
                </View>
            </SafeAreaView>

            <FlatList
                data={MOCK_ITEMS}
                renderItem={({ item }) => (
                    <ItemCard item={item} onAddToCart={handleAddToCart} />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
            />
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
        marginRight: 10, // Espace entre l'image et le texte
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    list: {
        paddingVertical: 16,
    },
});


export default HomeScreen;