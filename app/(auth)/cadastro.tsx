import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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

export default function CadastroScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const handleCreateAccount = () => {
    if (passwordMismatch) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.innerContainer, Platform.OS === 'web' && styles.webCard]}>
            <View style={styles.header}>
              <LogoProEstoque size="lg" />
              <Text style={styles.subtitle}>Preencha seus dados para começar</Text>
            </View>

            <View style={styles.form}>
              <Input
                icon="person-outline"
                placeholder="Nome completo"
                autoCapitalize="words"
                value={name}
                onChangeText={setName}
              />

              <Input
                icon="mail-outline"
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <Input
                icon="lock-closed-outline"
                placeholder="Senha"
                isPassword
                value={password}
                onChangeText={setPassword}
              />

              <Input
                icon="lock-closed-outline"
                placeholder="Confirmar senha"
                isPassword
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                error={passwordMismatch ? 'As senhas não coincidem' : undefined}
              />

              <Button
                title="Criar Conta"
                loading={isLoading}
                onPress={handleCreateAccount}
              />
            </View>

            <View style={styles.footer}>
              <TouchableOpacity
                onPress={() => router.back()}
                accessibilityRole="link"
              >
                <Text style={styles.footerLink}>Já tenho conta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingVertical: 40,
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
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textLight,
    marginTop: 10,
  },
  form: {
    width: '100%',
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
  footerLink: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});
