import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentUser } from "../services/api";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Load current user and their orders
  useEffect(() => {
    const loadUserAndOrders = async () => {
      try {
        // Get the current logged-in user
        const user = await getCurrentUser();
        if (user) {
          setCurrentUser(user);

          // Load orders for this specific user using a user-specific key
          const ordersKey = `orders_${user.id}`;
          const savedOrders = await AsyncStorage.getItem(ordersKey);

          if (savedOrders) {
            const parsedOrders = JSON.parse(savedOrders);
            const now = Math.floor(Date.now() / 1000);
            const updatedOrders = parsedOrders.map((order) => {
              const elapsedTime = now - order.startTime;
              const newRemainingTime = Math.max(
                order.remainingTime - elapsedTime,
                0
              );

              return {
                ...order,
                remainingTime: newRemainingTime,
                status: newRemainingTime === 0 ? "delivered" : order.status,
              };
            });

            setOrders(updatedOrders);
          }
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement de l'utilisateur et des commandes:",
          error
        );
      }
    };

    loadUserAndOrders();
  }, []);

  // Save orders automatically when they change or when the user changes
  useEffect(() => {
    const saveOrders = async () => {
      if (!currentUser) return; // Don't save if no user is logged in

      try {
        const ordersKey = `orders_${currentUser.id}`;
        await AsyncStorage.setItem(ordersKey, JSON.stringify(orders));
      } catch (error) {
        console.error("Erreur lors de la sauvegarde des commandes:", error);
      }
    };

    if (orders.length > 0 && currentUser) {
      saveOrders();
    }
  }, [orders, currentUser]);

  // Update remaining time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.remainingTime > 0) {
            return { ...order, remainingTime: order.remainingTime - 1 };
          } else {
            return { ...order, status: "delivered" };
          }
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Listen for user changes (login/logout)
  useEffect(() => {
    const checkUserChanges = async () => {
      const user = await getCurrentUser();

      // If user changed, update current user and load their orders
      if ((!currentUser && user) || currentUser?.id !== user?.id) {
        setCurrentUser(user);

        if (user) {
          const ordersKey = `orders_${user.id}`;
          const savedOrders = await AsyncStorage.getItem(ordersKey);

          if (savedOrders) {
            const parsedOrders = JSON.parse(savedOrders);
            const now = Math.floor(Date.now() / 1000);
            const updatedOrders = parsedOrders.map((order) => {
              const elapsedTime = now - order.startTime;
              const newRemainingTime = Math.max(
                order.remainingTime - elapsedTime,
                0
              );

              return {
                ...order,
                remainingTime: newRemainingTime,
                status: newRemainingTime === 0 ? "delivered" : order.status,
              };
            });

            setOrders(updatedOrders);
          } else {
            setOrders([]);
          }
        } else {
          // No user logged in, clear orders
          setOrders([]);
        }
      }
    };

    // Check for user changes every 2 seconds
    const userInterval = setInterval(checkUserChanges, 2000);
    return () => clearInterval(userInterval);
  }, [currentUser]);

  const addOrder = async (orderItems) => {
    if (!currentUser) {
      console.error("Cannot add order: No user is logged in");
      return;
    }

    const now = Math.floor(Date.now() / 1000);
    const newOrder = {
      id: Date.now(),
      userId: currentUser.id,
      items: orderItems,
      startTime: now,
      remainingTime: 180, 
      status: "in-progress",
    };

    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);

    try {
      const ordersKey = `orders_${currentUser.id}`;
      await AsyncStorage.setItem(ordersKey, JSON.stringify(updatedOrders));
    } catch (error) {
      console.error("Erreur lors de l'ajout de la commande:", error);
    }
  };

  const removeOrder = async (orderId) => {
    if (!currentUser) return;

    const updatedOrders = orders.filter((order) => order.id !== orderId);
    setOrders(updatedOrders);

    try {
      const ordersKey = `orders_${currentUser.id}`;
      await AsyncStorage.setItem(ordersKey, JSON.stringify(updatedOrders));
    } catch (error) {
      console.error("Erreur lors de la suppression de la commande:", error);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        removeOrder,
        currentUser, // Expose current user to consumers if needed
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
