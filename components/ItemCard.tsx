// src/components/ItemCard.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ItemCard = ({ item }) => {
  return (
    <View style={styles.card}>
      <Image 
        source={{ uri: item.image }} 
        style={styles.image}
        // Fallback pour les images qui ne chargent pas
        defaultSource={require('../assets/images/favicon.png')} 
      />
      <View style={styles.content}>
        <Text style={styles.title}>{item.nom}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.price}>{item.prix.toFixed(2)} €</Text>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
});

export default ItemCard;