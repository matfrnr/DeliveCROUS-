// authHOC.js
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const checkToken = async () => {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          router.replace("/LoginScreen"); // Redirect to login if no token
        }
        setIsLoading(false);
      };
      checkToken();
    });

    if (isLoading) {
      return null; // Or a loading indicator
    }

    return <WrappedComponent {...props} />;
  };
  return AuthenticatedComponent;
};
