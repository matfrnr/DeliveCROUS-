import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { hash, compare } from 'bcrypt';

const BASE_URL = "http://localhost:3000";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // À stocker dans les variables d'environnement

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const secureApi = {
  // Fonction utilitaire pour les requêtes authentifiées
  async authenticatedRequest(endpoint, options = {}) {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) throw new ApiError('Non authentifié', 401);

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new ApiError(`Erreur ${response.status}`, response.status);
      }

      return response.json();
    } catch (error) {
      console.error('Request error:', error);
      throw error;
    }
  },

  // Login sécurisé
  async login(email, password) {
    if (!email || !password) {
      throw new ApiError('Email et mot de passe requis', 400);
    }

    try {
      const response = await fetch(`${BASE_URL}/users?email=${encodeURIComponent(email)}`);
      const users = await response.json();

      const user = users[0];
      if (!user) throw new ApiError('Utilisateur non trouvé', 404);

      // Vérification du mot de passe avec bcrypt
      const passwordMatch = await compare(password, user.password);
      if (!passwordMatch) throw new ApiError('Mot de passe incorrect', 401);

      // Générer un JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Stocker le token de manière sécurisée
      await SecureStore.setItemAsync('userToken', token);
      
      // Ne pas renvoyer le mot de passe
      const { password: _, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, token };
    } catch (error) {
      throw new ApiError(error.message, error.status || 500);
    }
  },

  // Inscription sécurisée
  async register(email, password, nom, prenom) {
    if (!email || !password || !nom || !prenom) {
      throw new ApiError('Tous les champs sont requis', 400);
    }

    // Validation des données
    if (password.length < 8) {
      throw new ApiError('Le mot de passe doit contenir au moins 8 caractères', 400);
    }

    try {
      // Vérifier si l'email existe déjà
      const existingUser = await fetch(`${BASE_URL}/users?email=${encodeURIComponent(email)}`);
      const users = await existingUser.json();
      if (users.length > 0) {
        throw new ApiError('Cet email est déjà utilisé', 409);
      }

      // Hasher le mot de passe
      const hashedPassword = await hash(password, 10);

      const newUser = {
        email,
        password: hashedPassword,
        nom,
        prenom,
        favoris: [],
        id: Date.now().toString()
      };

      const response = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (!response.ok) {
        throw new ApiError("Échec de l'inscription", response.status);
      }

      const { password: _, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error) {
      throw new ApiError(error.message, error.status || 500);
    }
  },

  // Déconnexion
  async logout() {
    await SecureStore.deleteItemAsync('userToken');
  },

  // Mise à jour utilisateur sécurisée
  async updateUser(userId, data) {
    // Vérifier les données sensibles
    if (data.password) {
      data.password = await hash(data.password, 10);
    }

    return this.authenticatedRequest(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  // Récupération sécurisée des commandes
  async getCommandsUser(userId) {
    return this.authenticatedRequest(`/commands?userId=${userId}`);
  },

  // Création de commande sécurisée
  async createCommand(command) {
    return this.authenticatedRequest('/commands', {
      method: 'POST',
      body: JSON.stringify({
        ...command,
        id: Date.now().toString(),
        date: new Date().toISOString()
      })
    });
  },

  // Récupération sécurisée des items
  async getItems() {
    return this.authenticatedRequest('/items');
  },

  // Gestion sécurisée des favoris
  async toggleFavori(userId, itemId) {
    return this.authenticatedRequest('/favoris', {
      method: 'POST',
      body: JSON.stringify({ userId, itemId })
    });
  },

  // Méthodes ajoutées

  // Récupération des favoris d'un utilisateur
  async getFavoris(userId) {
    try {
      // Récupérer les favoris de l'utilisateur
      const favoris = await this.authenticatedRequest(`/favoris?userId=${userId}`);
      
      // Enrichir avec les données des items
      const enrichedFavoris = await Promise.all(favoris.map(async (favori) => {
        const item = await this.authenticatedRequest(`/items/${favori.itemId}`);
        return { ...favori, item };
      }));

      return enrichedFavoris;
    } catch (error) {
      throw new ApiError(error.message, error.status || 500);
    }
  },

  // Récupération des données utilisateur complètes
  async getUserData(userId) {
    try {
      // Récupérer les données de base de l'utilisateur
      const user = await this.authenticatedRequest(`/users/${userId}`);
      
      // Récupérer les favoris
      const favoris = await this.getFavoris(userId);
      
      // Récupérer les commandes
      const commands = await this.getCommandsUser(userId);
      
      // Retourner l'utilisateur enrichi
      const { password: _, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        favoris,
        commands
      };
    } catch (error) {
      throw new ApiError(error.message, error.status || 500);
    }
  },

  // Mise à jour d'un item
  async updateItem(itemId, data) {
    if (!itemId || Object.keys(data).length === 0) {
      throw new ApiError('ID item et données requis', 400);
    }

    try {
      return await this.authenticatedRequest(`/items/${itemId}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      });
    } catch (error) {
      throw new ApiError(error.message, error.status || 500);
    }
  },

  // Suppression d'un item
  async deleteItem(itemId) {
    if (!itemId) {
      throw new ApiError('ID item requis', 400);
    }

    try {
      // Vérifier si l'item existe
      await this.authenticatedRequest(`/items/${itemId}`);
      
      // Supprimer l'item
      await this.authenticatedRequest(`/items/${itemId}`, {
        method: 'DELETE'
      });

      // Supprimer les références dans les favoris
      const favoris = await this.authenticatedRequest(`/favoris?itemId=${itemId}`);
      await Promise.all(favoris.map(favori => 
        this.authenticatedRequest(`/favoris/${favori.id}`, {
          method: 'DELETE'
        })
      ));

      return { success: true, message: 'Item supprimé avec succès' };
    } catch (error) {
      throw new ApiError(error.message, error.status || 500);
    }
  }
};

export default secureApi;