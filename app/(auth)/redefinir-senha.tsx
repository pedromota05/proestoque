import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
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
import { api } from '../../src/services/api';

export default function RedefinirSenhaScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const s = React.useMemo(() => styles(colors), [colors]);
  // Extrai o token da URL, ex: /redefinir-senha?token=xxx
  const { token } = useLocalSearchParams<{ token: string }>();

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const confirmarSenhaRef = useRef<RNTextInput>(null);

  const passwordMismatch =
    confirmarSenha.length > 0 && novaSenha !== confirmarSenha;

  const handleRedefinir = async () => {
    if (!token) {
      Toast.show({
        type: 'error',
        text1: 'Link inválido',
        text2: 'O token de recuperação não foi encontrado na URL.',
        position: 'top',
      });
      return;
    }

    if (passwordMismatch) {
      Toast.show({
        type: 'error',
        text1: 'Senhas não coincidem',
        text2: 'Verifique se as senhas são iguais.',
        position: 'top',
      });
      return;
    }

    if (!novaSenha.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Senha obrigatória',
        text2: 'Por favor, informe a nova senha.',
        position: 'top',
      });
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/redefinir-senha', { token, novaSenha });
      
      Toast.show({
        type: 'success',
        text1: 'Senha redefinida!',
        text2: 'Sua senha foi alterada com sucesso.',
        position: 'top',
      });
      
      // Redireciona para o login após sucesso
      router.replace('/(auth)/login');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao redefinir',
        text2: error.response?.data?.message || 'Não foi possível redefinir a senha.',
        position: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        style={s.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[s.innerContainer, Platform.OS === 'web' && s.webCard]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={s.backButton}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
            <Text style={s.backText}>Voltar</Text>
          </TouchableOpacity>

          <View style={s.content}>
            <View style={s.header}>
              <LogoProEstoque size="lg" />
              <Text style={s.title}>Nova senha</Text>
              <Text style={s.subtitle}>
                Crie uma nova senha para acessar sua conta
              </Text>
            </View>

            <Input
              icon="lock-closed-outline"
              placeholder="Nova senha"
              isPassword
              value={novaSenha}
              style={{ outlineStyle: 'none' as any }}
              returnKeyType="next"
              onSubmitEditing={() => confirmarSenhaRef.current?.focus()}
              blurOnSubmit={false}
              onChangeText={setNovaSenha}
            />

            <Input
              ref={confirmarSenhaRef}
              icon="lock-closed-outline"
              placeholder="Confirmar nova senha"
              isPassword
              value={confirmarSenha}
              style={{ outlineStyle: 'none' as any }}
              returnKeyType="send"
              onSubmitEditing={handleRedefinir}
              onChangeText={setConfirmarSenha}
              error={passwordMismatch ? 'As senhas não coincidem' : undefined}
            />

            <Button 
              title="Redefinir Senha" 
              onPress={handleRedefinir} 
              loading={isLoading} 
              style={{ marginTop: 8 }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = (colors: ThemeColors) => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
  },
  webCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 32,
    marginVertical: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  backText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 4,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textLight,
    marginTop: 8,
    textAlign: 'center',
  },
});
