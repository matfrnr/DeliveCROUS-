import AsyncStorage from "@react-native-async-storage/async-storage";

const users = [
    {
        id: '1',
        email: 'toto@gmail.com',
        password: 'toto',
        nom: 'Toto',
        prenom: 'Toto',
    },
    {
        id: '2',
        email: 'chef@gmail.com',
        password: 'chef',
        nom: 'chef',
        prenom: 'chef',
    },
];

export const login = async (email: string, password: any) => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
        // Générer un JWT ou un token simple pour cet exemple
        const token = `mock_token_for_${user.id}`;

        // Sauvegarder l'utilisateur actuel dans AsyncStorage
        try {
            // Récupérer d'abord l'utilisateur actuel (s'il existe)
            const currentUserString = await AsyncStorage.getItem('user');
            // Sauvegarder le nouvel utilisateur
            await AsyncStorage.setItem('user', JSON.stringify(user));
        } catch (e) {
            console.error('Échec de sauvegarde de l\'utilisateur dans AsyncStorage', e);
        }

        return { token, user };
    }
    throw new Error('Identifiants invalides');
};

export const logout = async () => {
    try {
        // Récupérer l'utilisateur actuel avant la déconnexion
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
            const user = JSON.parse(userString);
            console.log(`Déconnexion de l'utilisateur ${user.id} (${user.email})`);
            const favoritesKey = `favorites_${user.id}`;
            const hasFavorites = await AsyncStorage.getItem(favoritesKey);
        }

        // IMPORTANT: Ne supprimez que l'utilisateur, pas les favoris!
        await AsyncStorage.removeItem("user");
        console.log('Utilisateur supprimé d\'AsyncStorage, favoris conservés');

        return true;
    } catch (e) {
        console.error('Échec de la déconnexion', e);
        return false;
    }
};

export const register = async (userData: any) => {
    const newUser = {
        id: (users.length + 1).toString(),
        ...userData,
        favoris: [], // Initialiser avec des favoris vides
    };
    users.push(newUser);

    // Sauvegarder l'utilisateur dans AsyncStorage
    try {
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
        console.log(`Nouvel utilisateur enregistré: ${newUser.id} (${newUser.email})`);
    } catch (e) {
        console.error('Échec de sauvegarde du nouvel utilisateur dans AsyncStorage', e);
    }

    return newUser;
};

export const getCurrentUser = async () => {
    try {
        const userString = await AsyncStorage.getItem('user');
        if (userString) {
            const user = JSON.parse(userString);
            return user;
        }
        return null;
    } catch (e) {
        console.error('Échec de récupération de l\'utilisateur actuel', e);
        return null;
    }
};