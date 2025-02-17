import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);

    // Charger les commandes depuis AsyncStorage au démarrage
    useEffect(() => {
        const loadOrders = async () => {
            try {
                const savedOrders = await AsyncStorage.getItem('orders');
                if (savedOrders) {
                    const parsedOrders = JSON.parse(savedOrders);
                    const updatedOrders = parsedOrders.map(order => {
                        const now = Math.floor(Date.now() / 1000); // Timestamp actuel en secondes
                        const elapsedTime = now - order.startTime;
                        const newRemainingTime = Math.max(order.remainingTime - elapsedTime, 0);
                        
                        return {
                            ...order,
                            remainingTime: newRemainingTime,
                            status: newRemainingTime === 0 ? 'delivered' : order.status
                        };
                    });

                    setOrders(updatedOrders);
                }
            } catch (error) {
                console.error('Erreur lors du chargement des commandes:', error);
            }
        };

        loadOrders();
    }, []);

    // Sauvegarde automatique des commandes
    useEffect(() => {
        const saveOrders = async () => {
            try {
                await AsyncStorage.setItem('orders', JSON.stringify(orders));
            } catch (error) {
                console.error('Erreur lors de la sauvegarde des commandes:', error);
            }
        };

        if (orders.length > 0) {
            saveOrders();
        }
    }, [orders]);

    // Mettre à jour les temps restants toutes les secondes
    useEffect(() => {
        const interval = setInterval(() => {
            setOrders((prevOrders) =>
                prevOrders.map(order => {
                    if (order.remainingTime > 0) {
                        return { ...order, remainingTime: order.remainingTime - 1 };
                    } else {
                        return { ...order, status: 'delivered' };
                    }
                })
            );
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const addOrder = async (orderItems) => {
        const now = Math.floor(Date.now() / 1000); // Timestamp actuel en secondes
        const newOrder = {
            id: Date.now(),
            items: orderItems,
            startTime: now, // On stocke l'heure de début
            remainingTime: 180, // 3 minutes
            status: 'in-progress',
        };

        const updatedOrders = [...orders, newOrder];
        setOrders(updatedOrders);

        try {
            await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));
        } catch (error) {
            console.error('Erreur lors de l’ajout de la commande:', error);
        }
    };

    const removeOrder = async (orderId) => {
        const updatedOrders = orders.filter(order => order.id !== orderId);
        setOrders(updatedOrders);

        try {
            await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));
        } catch (error) {
            console.error('Erreur lors de la suppression de la commande:', error);
        }
    };

    return (
        <OrderContext.Provider value={{ orders, addOrder, removeOrder }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return context;
};
