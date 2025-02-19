// Définition des types
export type User = {
    id: string;
    email: string;
    password: string;
  };
  
  export type Item = {
    id: string;
    nom: string;
    description: string;
    prix: number;
    image: string;
  };
  
  export type Favori = {
    id: string;
    userId: string;
    itemId: string;
  };
  
  export type Command = {
    id?: string;
    userId: string;
    items: Item[];
    date: string;
    time: string;
    room: string;
    address: string;
    prix: number;
  };
  
  // Définition de l'URL de base de l'API
  const BASE_URL = 'http://localhost:3000';
  
  export const api = {
    // Connexion utilisateur
    login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
      const response = await fetch(`${BASE_URL}/users?email=${email}`);
      const users: User[] = await response.json();
      const user = users[0];
  
      if (user && user.password === password) {
        return { user, token: 'fake-jwt-token' };
      }
      throw new Error('Invalid credentials');
    },
  
    // Inscription utilisateur
    register: async (email: string, password: string): Promise<User> => {
      const newUser = { email, password };
      const response = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
  
      return response.json();
    },
  
    // Mise à jour des informations utilisateur
    updateUser: async (userId: string, data: Partial<User>): Promise<User> => {
      const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
  
      return response.json();
    },
  
    // Récupérer tous les items
    getItems: async (): Promise<Item[]> => {
      const response = await fetch(`${BASE_URL}/items`);
      return response.json();
    },
  
    // Récupérer les favoris d'un utilisateur
    getFavoris: async (userId: string): Promise<Favori[]> => {
      const response = await fetch(`${BASE_URL}/favoris?userId=${userId}`);
      return response.json();
    },
  
    // Ajouter ou retirer un favori
    toggleFavori: async (userId: string, itemId: string): Promise<void> => {
      const response = await fetch(`${BASE_URL}/favoris?userId=${userId}&itemId=${itemId}`);
      const favoris: Favori[] = await response.json();
  
      if (favoris.length > 0) {
        const favori = favoris[0];
        await fetch(`${BASE_URL}/favoris/${favori.id}`, { method: 'DELETE' });
      } else {
        await fetch(`${BASE_URL}/favoris`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, itemId })
        });
      }
    },
  
    // Création d'une commande
    createCommand: async (command: Command): Promise<Command> => {
      const response = await fetch(`${BASE_URL}/commands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(command)
      });
  
      return response.json();
    },
  
    // Récupération des commandes d'un utilisateur
    getCommands: async (userId: string): Promise<Command[]> => {
      const response = await fetch(`${BASE_URL}/commands?userId=${userId}`);
      return response.json();
    },
  
    // Mise à jour d'un item
    updateItem: async (itemId: string, data: Partial<Item>): Promise<Item> => {
      const response = await fetch(`${BASE_URL}/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
  
      return response.json();
    },
  
    // Suppression d'un item
    deleteItem: async (itemId: string): Promise<void> => {
      await fetch(`${BASE_URL}/items/${itemId}`, {
        method: 'DELETE'
      });
    }
  };

  