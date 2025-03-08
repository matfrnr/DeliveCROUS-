import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { CartProvider } from '@/context/CartContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { OrderProvider } from '@/context/OrderContext';
import { useColorScheme } from '@/hooks/useColorScheme';

// Empêcher l'écran de splash de se cacher automatiquement avant que le chargement des ressources soit terminé.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <OrderProvider>
      <CartProvider>
        <FavoritesProvider>
          <ThemeProvider value={DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
              <Stack.Screen name="screen/MainScreen" options={{ headerShown: false }} />
              <Stack.Screen name="components/item-detail" options={{ headerShown: false }} />
              <Stack.Screen name="screen/cart" options={{ headerShown: false }} />
              <Stack.Screen name="components/success-screen" options={{ headerShown: false }} />
              <Stack.Screen name="screen/favorites" options={{ headerShown: false }} />
              <Stack.Screen name="screen/user" options={{ headerShown: false }} />
              <Stack.Screen name="screen/LoginScreen" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </FavoritesProvider>
      </CartProvider>
    </OrderProvider>
  );
}
