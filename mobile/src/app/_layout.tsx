// Imported per weight rather than from the package barrel: the barrel requires
// every weight and italic (36 files, ~11MB) even though we use eight.
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { Inter_800ExtraBold } from '@expo-google-fonts/inter/800ExtraBold';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display/700Bold';
import { PlayfairDisplay_800ExtraBold } from '@expo-google-fonts/playfair-display/800ExtraBold';
import { PlayfairDisplay_900Black } from '@expo-google-fonts/playfair-display/900Black';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '@/store/auth';
import { CartProvider } from '@/store/cart';
import { colors } from '@/theme';

// The gate at `index.tsx` hides the splash once fonts are in and it knows where
// to send the user — hiding earlier would flash unstyled system type.
void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Playfair carries the headlines, Inter everything structural. One family per
  // weight: React Native ignores fontWeight once fontFamily is set.
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
    PlayfairDisplay_800ExtraBold,
    PlayfairDisplay_900Black,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <CartProvider>
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.cream },
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen name="index" options={{ animation: 'none' }} />
              <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
              <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
              {/* Tasks slide up; destinations slide across. */}
              <Stack.Screen name="login" options={{ animation: 'slide_from_bottom' }} />
              <Stack.Screen name="signup" options={{ animation: 'slide_from_bottom' }} />
              <Stack.Screen name="checkout" options={{ animation: 'slide_from_bottom' }} />
              <Stack.Screen name="address/edit" options={{ animation: 'slide_from_bottom' }} />
            </Stack>
          </CartProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
