import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  TextInput as RNTextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
import { useTheme } from '../../src/contexts/ThemeContext';
import { ThemeColors } from '../../src/constants/theme';
import { useAuth } from '../../src/contexts/AuthContext';

export default function CadastroScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const s = React.useMemo(() => styles(colors), [colors]);
  const { registrar, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const emailRef = useRef<RNTextInput>(null);
  const passwordRef = useRef<RNTextInput>(null);
  const confirmPasswordRef = useRef<RNTextInput>(null);

  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const handleCreateAccount = async () => {
    if (passwordMismatch) {
      Toast.show({
        type: 'error',
        text1: 'Senhas não coincidem',
        text2: 'Verifique se as senhas são iguais.',
        position: 'top',
      });
      return;
    }

    if (!name.trim() || !email.trim() || !password.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Campos obrigatórios',
        text2: 'Preencha todos os campos.',
        position: 'top',
      });
      return;
    }

    try {
      await registrar(name, email, password);
      Toast.show({
        type: 'success',
        text1: 'Conta criada com sucesso!',
        text2: 'Bem-vindo ao ProEstoque.',
        position: 'top',
      });
      // Login automático: o AuthContext já atualiza user/token,
      // então o _layout redireciona para as tabs automaticamente.
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao criar conta',
        text2: error.message || 'Não foi possível criar a conta. Tente novamente.',
        position: 'top',
      });
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={s.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[s.innerContainer, Platform.OS === 'web' && s.webCard]}>
            <View style={s.header}>
              <LogoProEstoque size="lg" />
              <Text style={s.subtitle}>Preencha seus dados para começar</Text>
            </View>

            <View style={s.form}>
              <Input
                icon="person-outline"
                placeholder="Nome completo"
                autoCapitalize="words"
                value={name}
                style={{ outlineStyle: 'none' as any }}
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
                blurOnSubmit={false}
                onChangeText={setName}
              />

              <Input
                ref={emailRef}
                icon="mail-outline"
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                style={{ outlineStyle: 'none' as any }}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                blurOnSubmit={false}
                onChangeText={setEmail}
              />

              <Input
                ref={passwordRef}
                icon="lock-closed-outline"
                placeholder="Senha"
                isPassword
                value={password}
                style={{ outlineStyle: 'none' as any }}
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                blurOnSubmit={false}
                onChangeText={setPassword}
              />

              <Input
                ref={confirmPasswordRef}
                icon="lock-closed-outline"
                placeholder="Confirmar senha"
                isPassword
                value={confirmPassword}
                style={{ outlineStyle: 'none' as any }}
                returnKeyType="send"
                onSubmitEditing={handleCreateAccount}
                onChangeText={setConfirmPassword}
                error={passwordMismatch ? 'As senhas não coincidem' : undefined}
              />

              <Button
                title="Criar Conta"
                loading={isLoading}
                onPress={handleCreateAccount}
              />
            </View>

            <View style={s.footer}>
              <TouchableOpacity
                onPress={() => router.back()}
                accessibilityRole="link"
              >
                <Text style={s.footerLink}>Já tenho conta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = (colors: ThemeColors) => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
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
    backgroundColor: colors.surface,
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
    color: colors.textLight,
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
    color: colors.primary,
    fontWeight: '600',
  },
});

