import { Redirect, Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { ProductsProvider } from '../src/contexts/ProductsContext';
import { solicitarPermissaoNotificacoes, agendarVerificacaoDiaria } from '../src/services/notifications';
import * as SplashScreen from 'expo-splash-screen';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { ThemeProvider, useTheme } from '../src/contexts/ThemeContext';
import { ThemeColors } from '../src/constants/theme';

// Impede que a splash nativa desapareça automaticamente
SplashScreen.preventAutoHideAsync();

function NavigationGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuth();
  const { isDark } = useTheme();
  const segments = useSegments();

  useEffect(() => {
    if (isAuthenticated) {
      solicitarPermissaoNotificacoes();
      agendarVerificacaoDiaria();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isInitializing) {
      SplashScreen.hideAsync();
    }
  }, [isInitializing]);

  if (isInitializing) {
    return null;
  }

  const inAuthGroup = segments[0] === '(auth)';

  // Usuário NÃO autenticado tentando acessar rota protegida → redireciona para login
  if (!isAuthenticated && !inAuthGroup) {
    return <Redirect href="/(auth)/login" />;
  }

  // Usuário autenticado tentando acessar rota de auth → redireciona para tabs
  if (isAuthenticated && inAuthGroup) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {children}
    </>
  );
}

function ThemedToast() {
  const { colors } = useTheme();

  const toastConfig = React.useMemo(() => ({
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: colors.accent, backgroundColor: colors.surface, height: 'auto', paddingVertical: 12, minHeight: 60 }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{ fontSize: 18, fontWeight: '700', color: colors.text }}
        text2Style={{ fontSize: 15, color: colors.textLight }}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: colors.error, backgroundColor: colors.surface, height: 'auto', paddingVertical: 12, minHeight: 60 }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{ fontSize: 18, fontWeight: '700', color: colors.text }}
        text2Style={{ fontSize: 15, color: colors.textLight }}
      />
    ),
  }), [colors]);

  return <Toast config={toastConfig} />;
}

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'web' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
      });
    }
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProductsProvider>
            <NavigationGuard>
              <Stack screenOptions={{ headerShown: false }} />
            </NavigationGuard>
            <ThemedToast />
          </ProductsProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
