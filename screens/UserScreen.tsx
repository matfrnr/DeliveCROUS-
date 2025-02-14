import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';

function UserScreen() {
  const { user, updateUser } = useAuth();
  const [editableField, setEditableField] = useState<string | null>(null);
  const [newValue, setNewValue] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false); // Gestion de l'affichage du mot de passe
  
  // Animation pour agrandir l'input lors de la modification
  const [inputHeight] = useState(new Animated.Value(40)); // Valeur initiale pour l'input

  if (!user) return <Text>Utilisateur non connecté</Text>;

  const handleEdit = (field: string) => {
    setEditableField(field);
    setNewValue(user[field as keyof typeof user] as string);

    // Animation pour agrandir l'input lors de la modification
    Animated.timing(inputHeight, {
      toValue: 50, // Taille de l'input agrandie
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleSave = () => {
    if (editableField && newValue !== '') {
      const updatedUser = { ...user, [editableField]: newValue };
      updateUser(updatedUser);
      Alert.alert('Succès', 'Informations mises à jour avec succès');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle pour afficher/masquer le mot de passe
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <Text style={styles.title}>Informations Utilisateur</Text>

        {/* Affichage et modification de l'email */}
        <View style={styles.fieldContainer}>
          <Text>Email:</Text>
          <View style={[styles.inputContainer, editableField === 'email' ? styles.editingField : null]}>
            {editableField === 'email' ? (
              <TextInput
                style={[styles.input, { height: inputHeight }]}
                value={newValue}
                onChangeText={setNewValue}
                placeholder="Nouvel email"
              />
            ) : (
              <Text>{user.email}</Text>
            )}
          </View>
          <TouchableOpacity onPress={() => handleEdit('email')}>
            <Icon name="pencil" size={20} color="blue" style={styles.editButton} />
          </TouchableOpacity>
        </View>

        {/* Affichage et modification du prénom */}
        <View style={styles.fieldContainer}>
          <Text>Prénom:</Text>
          <View style={[styles.inputContainer, editableField === 'prenom' ? styles.editingField : null]}>
            {editableField === 'prenom' ? (
              <TextInput
                style={[styles.input, { height: inputHeight }]}
                value={newValue}
                onChangeText={setNewValue}
                placeholder="Nouveau prénom"
              />
            ) : (
              <Text>{user.prenom}</Text>
            )}
          </View>
          <TouchableOpacity onPress={() => handleEdit('prenom')}>
            <Icon name="pencil" size={20} color="blue" style={styles.editButton} />
          </TouchableOpacity>
        </View>

        {/* Affichage et modification du nom */}
        <View style={styles.fieldContainer}>
          <Text>Nom:</Text>
          <View style={[styles.inputContainer, editableField === 'nom' ? styles.editingField : null]}>
            {editableField === 'nom' ? (
              <TextInput
                style={[styles.input, { height: inputHeight }]}
                value={newValue}
                onChangeText={setNewValue}
                placeholder="Nouveau nom"
              />
            ) : (
              <Text>{user.nom}</Text>
            )}
          </View>
          <TouchableOpacity onPress={() => handleEdit('nom')}>
            <Icon name="pencil" size={20} color="blue" style={styles.editButton} />
          </TouchableOpacity>
        </View>

        {/* Affichage et modification du mot de passe */}
        <View style={styles.fieldContainer}>
          <Text>Mot de passe:</Text>
          <View style={[styles.inputContainer, editableField === 'password' ? styles.editingField : null, editableField === 'password' && styles.noBorder]}>
            {editableField === 'password' ? (
              <TextInput
                style={[styles.input, { height: inputHeight }]}
                value={password}
                onChangeText={setPassword}
                placeholder="Nouveau mot de passe"
                secureTextEntry={!showPassword} // Utilisation du toggle pour masquer/afficher le mot de passe
              />
            ) : (
              <Text>**********</Text>
            )}
          </View>
          {editableField === 'password' && (
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeButton}>
              <Icon name={showPassword ? 'eye' : 'eye-slash'} size={20} color="blue" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => handleEdit('password')}>
            <Icon name="pencil" size={20} color="blue" style={styles.editButton} />
          </TouchableOpacity>
        </View>

        {/* Sauvegarder les modifications */}
        {editableField && newValue && (
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    padding: 20,
    margin: 10,
    alignItems: 'center',
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '80%', // Ne prend pas toute la largeur
    justifyContent: 'space-between',
  },
  inputContainer: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderRadius: 10,
    marginRight: 8,
    backgroundColor: '#f5f5f5',
    marginTop: 5, // Espacement entre l'énoncé et la bordure
  },
  editingField: {
    borderColor: '#007BFF', // Change border color when editing
    backgroundColor: '#e6f0ff', // Change background color when editing
  },
  noBorder: {
    borderWidth: 0, // Masque la bordure lors de l'édition du mot de passe
  },
  input: {
    paddingLeft: 8,
    borderRadius: 8,
  },
  editButton: { marginLeft: 10 },
  eyeButton: { marginLeft: 10 },
  saveButton: {
    marginTop: 20,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: { color: 'white', textAlign: 'center' },
});

export default UserScreen;
