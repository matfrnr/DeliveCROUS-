import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ItemCard = ({ item, onAddToCart }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <View style={styles.card}>
      <Image 
        source={{ uri: item.image }} 
        style={styles.image}
        defaultSource={require('../assets/images/favicon.png')} 
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{item.nom}</Text>
          <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
            <Icon 
              name={isFavorite ? 'heart' : 'heart-outline'} 
              size={24} 
              color={isFavorite ? 'red' : 'gray'} 
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.price}>{item.prix.toFixed(2)} €</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => onAddToCart(item)}
          >
            <Text style={styles.addButtonText}>Ajouter au panier</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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