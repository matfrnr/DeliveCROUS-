// api.js
const users = [
    {
        id: '1',
        email: 'toto@gmail.com',
        password: 'toto',
        nom: 'Toto',
        prenom: 'Toto',
        favoris: ['1', '2'],
    },
    {
        id: '2',
        email: 'chef@gmail.com',
        password: 'chef',
        nom: 'chef',
        prenom: 'chef',
        favoris: ['3'],
    },
];

export const login = async (email, password) => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
        // Generate a JWT or a simple token for this example
        const token = `mock_token_for_${user.id}`;
        return { token, user };
    }
    throw new Error('Invalid credentials');
};

export const register = async (userData) => {
    // In a real app, you would send userData to your backend
    const newUser = {
        id: (users.length + 1).toString(),
        ...userData,
    };
    users.push(newUser);
    return newUser;
};