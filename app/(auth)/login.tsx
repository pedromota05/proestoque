import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { LogoProEstoque } from '../../src/components/LogoProEstoque';
import { theme } from '../../src/constants/theme';
import { useAuth } from '../../src/contexts/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleLogin = async () => {
    let hasError = false;

    if (!email.trim()) {
      if (Platform.OS === 'web') setEmailError(true);
      hasError = true;
    }
    if (!password.trim()) {
      if (Platform.OS === 'web') setPasswordError(true);
      hasError = true;
    }

    if (hasError) {
      Toast.show({
        type: 'error',
        text1: 'Campos obrigatórios',
        text2: 'Preencha e-mail e senha.',
        position: 'top',
      });
      return;
    }

    try {
      await login(email, password);
      Toast.show({
        type: 'success',
        text1: 'Login efetuado!',
        text2: 'Bem-vindo de volta ao ProEstoque.',
        position: 'top',
      });
      // Força o redirecionamento explicitamente, ignorando falhas do NavigationGuard na Web
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Erro no login:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro no login',
        text2: error.message || 'Não foi possível fazer o login. Tente novamente.',
        position: 'top',
      });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.innerContainer, Platform.OS === 'web' && styles.webCard]}>
          <View style={styles.header}>
            <LogoProEstoque size="lg" />
            <Text style={styles.subtitle}>Bem-vindo de volta</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <Input
                icon="mail-outline"
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                error={Platform.OS === 'web' && emailError}
                style={{ outlineStyle: 'none' as any }}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError(false);
                }}
              />
              {Platform.OS === 'web' && emailError && (
                <Text style={styles.errorText}>Preencha o e-mail.</Text>
              )}
            </View>

            <View style={styles.inputWrapper}>
              <Input
                icon="lock-closed-outline"
                placeholder="Senha"
                isPassword
                value={password}
                error={Platform.OS === 'web' && passwordError}
                style={{ outlineStyle: 'none' as any }}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError(false);
                }}
              />
              {Platform.OS === 'web' && passwordError && (
                <Text style={styles.errorText}>Preencha a senha.</Text>
              )}
            </View>

            <TouchableOpacity
              onPress={() => router.push('/(auth)/recuperar-senha')}
              style={styles.forgotButton}
              accessibilityRole="link"
            >
              <Text style={styles.forgotText}>Esqueci minha senha</Text>
            </TouchableOpacity>

            <Button title="Entrar" onPress={handleLogin} loading={isLoading} />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Não tem conta? </Text>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/cadastro')}
              accessibilityRole="link"
            >
              <Text style={styles.footerLink}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  innerContainer: {
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
  },
  webCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textLight,
    marginTop: 10,
  },
  form: {
    width: '100%',
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: -8,
  },
  forgotText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  footerLink: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  inputWrapper: {
    marginBottom: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
});

