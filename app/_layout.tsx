import { Redirect, Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { ProductsProvider } from '../src/contexts/ProductsContext';
import { solicitarPermissaoNotificacoes, agendarVerificacaoDiaria } from '../src/services/notifications';
import { theme } from '../src/constants/theme';
import { SplashScreen } from '../src/components/SplashScreen';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

function NavigationGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (isAuthenticated) {
      solicitarPermissaoNotificacoes();
      agendarVerificacaoDiaria();
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return <SplashScreen />;
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

  return <>{children}</>;
}

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: theme.colors.accent, height: 'auto', paddingVertical: 12, minHeight: 60 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 18, fontWeight: '700', color: theme.colors.text }}
      text2Style={{ fontSize: 15, color: theme.colors.textLight }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: theme.colors.error, height: 'auto', paddingVertical: 12, minHeight: 60 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 18, fontWeight: '700', color: theme.colors.text }}
      text2Style={{ fontSize: 15, color: theme.colors.textLight }}
    />
  ),
};

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
      <AuthProvider>
        <ProductsProvider>
          <NavigationGuard>
            <Stack screenOptions={{ headerShown: false }} />
          </NavigationGuard>
          <StatusBar style="dark" />
          <Toast config={toastConfig} />
        </ProductsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
