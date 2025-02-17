import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { CartProvider } from '@/context/CartContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { OrderProvider } from '@/context/OrderContext'; // Importer le contexte de commande
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
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
              <Stack.Screen name="item-detail" options={{ headerShown: false }} />
              <Stack.Screen name="cart" options={{ headerShown: false }} />
              <Stack.Screen name="success-screen" options={{ headerShown: false }} />
              <Stack.Screen name="favorites" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </FavoritesProvider>
      </CartProvider>
    </OrderProvider>
  );
}
