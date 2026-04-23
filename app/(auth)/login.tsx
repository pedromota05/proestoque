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
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { LogoProEstoque } from '../../src/components/LogoProEstoque';
import { theme } from '../../src/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    router.replace('/(tabs)');
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
            <Input
              icon="mail-outline"
              placeholder="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              style={{ outlineStyle: 'none' as any }}
              onChangeText={setEmail}
            />

            <Input
              icon="lock-closed-outline"
              placeholder="Senha"
              isPassword
              value={password}
              style={{ outlineStyle: 'none' as any }}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              onPress={() => router.push('/(auth)/recuperar-senha')}
              style={styles.forgotButton}
              accessibilityRole="link"
            >
              <Text style={styles.forgotText}>Esqueci minha senha</Text>
            </TouchableOpacity>

            <Button title="Entrar" onPress={handleLogin} />
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
});
