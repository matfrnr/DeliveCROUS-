import React, { useMemo, useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, Alert, Text, Image, TouchableOpacity } from 'react-native';
import ItemCard from '../components/ItemCard';
import Panier from '../assets/images/paniers.png'; // Importez l'image locale
import Compte from '../assets/images/utilisateur.png'; // Importez l'image locale
import Favoris from '../assets/images/favori.png'; // Importez l'image locale
import { router } from 'expo-router';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import Icon from 'react-native-vector-icons/Ionicons';
import mockData from '../data/mockData.json'; // Importez le fichier JSON local

const MOCK_ITEMS = mockData; // Utilisez les données mockées

const SORT_OPTIONS = {
    NONE: 'none',
    NAME_ASC: 'name_asc',
    NAME_DESC: 'name_desc',
    PRICE_ASC: 'price_asc',
    PRICE_DESC: 'price_desc',
    FAVORITES: 'favorites'
};

const HomeScreen = () => {
    const { cartItems, addToCart } = useCart();
    const { favorites } = useFavorites();
    const [currentSort, setCurrentSort] = useState(SORT_OPTIONS.NONE);
    const [isPriceAscending, setIsPriceAscending] = useState(true);
    const [isNameAscending, setIsNameAscending] = useState(true);
    const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

    const handlePriceSort = () => {
        if (currentSort !== SORT_OPTIONS.PRICE_ASC && currentSort !== SORT_OPTIONS.PRICE_DESC) {
            setCurrentSort(SORT_OPTIONS.PRICE_ASC);
            setIsPriceAscending(true);
        } else {
            setIsPriceAscending(!isPriceAscending);
            setCurrentSort(isPriceAscending ? SORT_OPTIONS.PRICE_DESC : SORT_OPTIONS.PRICE_ASC);
        }
    };

    const handleNameSort = () => {
        if (currentSort !== SORT_OPTIONS.NAME_ASC && currentSort !== SORT_OPTIONS.NAME_DESC) {
            setCurrentSort(SORT_OPTIONS.NAME_ASC);
            setIsNameAscending(true);
        } else {
            setIsNameAscending(!isNameAscending);
            setCurrentSort(isNameAscending ? SORT_OPTIONS.NAME_DESC : SORT_OPTIONS.NAME_ASC);
        }
    };

    const sortedItems = useMemo(() => {
        let items = [...MOCK_ITEMS];

        switch (currentSort) {
            case SORT_OPTIONS.NAME_ASC:
                return items.sort((a, b) => a.nom.localeCompare(b.nom));
            case SORT_OPTIONS.NAME_DESC:
                return items.sort((a, b) => b.nom.localeCompare(a.nom));
            case SORT_OPTIONS.PRICE_ASC:
                return items.sort((a, b) => a.prix - b.prix);
            case SORT_OPTIONS.PRICE_DESC:
                return items.sort((a, b) => b.prix - a.prix);
            case SORT_OPTIONS.FAVORITES:
                return items.filter(item => favorites.some(fav => fav.id === item.id));
            default:
                return items;
        }
    }, [currentSort, favorites]);

    const handleAddToCart = (item) => {
        Alert.alert("Ajouté au panier", `${item.nom} a été ajouté à votre panier`);
    };

    const FilterButton = ({ title, isActive, onPress, icon }) => (
        <TouchableOpacity
            style={[styles.filterButton, isActive && styles.filterButtonActive]}
            onPress={onPress}
        >
            <Text style={[styles.filterButtonText, isActive && styles.filterButtonTextActive]}>
                {title} {icon}
            </Text>
        </TouchableOpacity>
    );

    const isPriceActive = currentSort === SORT_OPTIONS.PRICE_ASC || currentSort === SORT_OPTIONS.PRICE_DESC;
    const priceIcon = isPriceActive ? (isPriceAscending ? ' ↑' : ' ↓') : '';

    const isNameActive = currentSort === SORT_OPTIONS.NAME_ASC || currentSort === SORT_OPTIONS.NAME_DESC;
    const nameIcon = isNameActive ? (isNameAscending ? ' ↑' : ' ↓') : '';

    return (
        <SafeAreaView style={styles.safeContainer}>
            <SafeAreaView style={styles.navbarContainer}>
                <View style={styles.navbar}>
                    <Text style={styles.title}>DeliveCrous</Text>
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

            {/* Filter Bar */}
            <View style={styles.filterBar}>
                <FilterButton
                    title="Tous"
                    icon={''}
                    isActive={currentSort === SORT_OPTIONS.NONE}
                    onPress={() => setCurrentSort(SORT_OPTIONS.NONE)}
                />
                <FilterButton
                    title="Mes favoris"
                    icon={''}
                    isActive={currentSort === SORT_OPTIONS.FAVORITES}
                    onPress={() => setCurrentSort(SORT_OPTIONS.FAVORITES)}
                />
                <FilterButton
                    title="Prix"
                    icon={priceIcon}
                    isActive={isPriceActive}
                    onPress={handlePriceSort}
                />
                <FilterButton
                    title="Nom"
                    icon={nameIcon}
                    isActive={isNameActive}
                    onPress={handleNameSort}
                />
            </View>

            {currentSort === SORT_OPTIONS.FAVORITES && sortedItems.length === 0 ? (
                <View style={styles.noFavoritesContainer}>
                    <Icon name="heart-outline" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>Vous n'avez pas encore de favoris</Text>
                </View>
            ) : (
                <FlatList
                    data={sortedItems}
                    renderItem={({ item }) => (
                        <ItemCard item={item} onAddToCart={handleAddToCart} />
                    )}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                />
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
    emptyText: {
        fontSize: 16,
        color: '#666',
        marginTop: 16,
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    list: {
        paddingVertical: 16,
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
    filterBar: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        justifyContent: 'space-evenly',
    },
    filterButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        marginHorizontal: 4,
    },
    filterButtonActive: {
        backgroundColor: '#2ecc71',
    },
    filterButtonText: {
        fontSize: 14,
        color: '#666',
    },
    filterButtonTextActive: {
        color: '#fff',
    },
    noFavoritesContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noFavoritesText: {
        fontSize: 18,
        color: '#999',
    },
});

export default HomeScreen;
