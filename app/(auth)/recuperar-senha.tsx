import { Ionicons } from '@expo/vector-icons';
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
import { useTheme } from '../../src/contexts/ThemeContext';
import { ThemeColors } from '../../src/constants/theme';
import { api } from '../../src/services/api';

export default function RecuperarSenhaScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const s = React.useMemo(() => styles(colors), [colors]);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) {
      Toast.show({
        type: 'error',
        text1: 'E-mail obrigatório',
        text2: 'Por favor, informe seu e-mail.',
        position: 'top',
      });
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/solicitar-reset', { email });
      setIsSubmitted(true);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao enviar',
        text2: error.response?.data?.message || 'Não foi possível enviar o e-mail.',
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
            {!isSubmitted ? (
              <>
                <View style={s.header}>
                  <LogoProEstoque size="lg" />
                  <Text style={s.title}>Recuperar senha</Text>
                  <Text style={s.subtitle}>
                    Informe seu e-mail e enviaremos um link
                  </Text>
                </View>

                <Input
                  icon="mail-outline"
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  style={{ outlineStyle: 'none' as any }}
                  onChangeText={setEmail}
                />

                <Button title="Enviar" onPress={handleSend} loading={isLoading} />
              </>
            ) : (
              <>
                <View style={s.successCard}>
                  <Ionicons
                    name="checkmark-circle"
                    size={48}
                    color={colors.accent}
                  />
                  <Text style={s.successTitle}>E-mail enviado!</Text>
                  <Text style={s.successSubtitle}>
                    Verifique sua caixa de entrada
                  </Text>
                </View>

                <Button
                  title="Voltar ao Login"
                  variant="outline"
                  onPress={() => router.back()}
                />
              </>
            )}
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
  successCard: {
    backgroundColor: colors.successBackground,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.successText,
    marginTop: 16,
  },
  successSubtitle: {
    fontSize: 15,
    color: colors.successText,
    marginTop: 8,
  },
});
