import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Simuler la fin de la commande après 10 minutes
        const interval = setInterval(() => {
            setOrders((prevOrders) =>
                prevOrders.map((order) => {
                    if (order.remainingTime > 0) {
                        return { ...order, remainingTime: order.remainingTime - 1 };
                    } else {
                        // Marquer la commande comme livrée
                        return { ...order, status: 'delivered' };
                    }
                })
            );
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const addOrder = (orderItems) => {
        const newOrder = {
            id: Date.now(),
            items: orderItems,
            remainingTime: 180, // 10 minutes in seconds
            status: 'in-progress'
        };
        setOrders([...orders, newOrder]);
    };

    const removeOrder = (orderId) => {
        setOrders(orders.filter(order => order.id !== orderId));
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
