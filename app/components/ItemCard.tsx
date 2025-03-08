import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';

interface Item {
  id: string;
  nom: string;
  description: string;
  prix: number;
  image: string;
  allergenes: string[];
  categorie: string;
  calories: number;
  origine: string;
}

const ItemCard = ({ item }: { item: Item }) => {
  // Utilisation de useRouter pour la navigation entre écrans.
  const router = useRouter();
  // Utilisation du contexte pour ajouter des articles au panier.
  const { addToCart } = useCart();
  // Utilisation du contexte pour gérer les favoris.
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();

  // Fonction pour gérer le clic sur la carte, redirige vers la page de détails de l'article.
  const handleCardPress = () => {
    router.push({
      pathname: '/components/item-detail',
      params: {
        id: item.id,
        nom: item.nom,
        description: item.description,
        prix: item.prix.toString(),
        image: item.image,
        allergenes: item.allergenes,
        categorie: item.categorie,
        calories: item.calories,
        origine: item.origine
      }
    });
  };

  // Fonction pour ajouter l'article au panier et afficher une alerte.
  const handleAddToCart = () => {
    addToCart(item);
    Alert.alert("Ajouté au panier", `${item.nom} a été ajouté à votre panier`);
  };

  // Fonction pour gérer l'ajout/suppression des favoris, empêche la propagation de l'événement de clic de la carte.
  const handleFavoriteToggle = (e: { stopPropagation: () => void; }) => {
    e.stopPropagation();
    if (isFavorite(item.id)) {
      removeFromFavorites(item.id);
    } else {
      addToFavorites(item);
    }
  };

  return (
    // TouchableOpacity pour rendre la carte cliquable.
    <TouchableOpacity onPress={handleCardPress} activeOpacity={0.9}>
      <View style={styles.card}>
        {/* Image de l'article avec une image de remplacement en cas d'erreur de chargement. */}
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          defaultSource={require('../../assets/images/favicon.png')}
        />
        <View style={styles.content}>
          <View style={styles.header}>
            {/* Nom de l'article. */}
            <Text style={styles.title}>{item.nom}</Text>
            {/* Bouton pour ajouter/supprimer des favoris. */}
            <TouchableOpacity onPress={handleFavoriteToggle}>
              {/* Icône de favori qui change selon l'état de favori. */}
              <Icon
                name={isFavorite(item.id) ? 'heart' : 'heart-outline'}
                size={30}
                color={isFavorite(item.id) ? 'red' : 'gray'}
              />
            </TouchableOpacity>
          </View>
          {/* Description de l'article, tronquée à deux lignes. */}
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.footer}>
            {/* Prix de l'article. */}
            <Text style={styles.price}>{item.prix.toFixed(2)} €</Text>
            {/* Bouton pour ajouter l'article au panier. */}
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddToCart}
            >
              <Text style={styles.addButtonText}>Ajouter au panier</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  addButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default ItemCard;