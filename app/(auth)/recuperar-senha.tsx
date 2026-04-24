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
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { LogoProEstoque } from '../../src/components/LogoProEstoque';
import { theme } from '../../src/constants/theme';

export default function RecuperarSenhaScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSend = () => {
    setIsSubmitted(true);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.innerContainer, Platform.OS === 'web' && styles.webCard]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>

          <View style={styles.content}>
            {!isSubmitted ? (
              <>
                <View style={styles.header}>
                  <LogoProEstoque size="lg" />
                  <Text style={styles.title}>Recuperar senha</Text>
                  <Text style={styles.subtitle}>
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

                <Button title="Enviar" onPress={handleSend} />
              </>
            ) : (
              <>
                <View style={styles.successCard}>
                  <Ionicons
                    name="checkmark-circle"
                    size={48}
                    color={theme.colors.accent}
                  />
                  <Text style={styles.successTitle}>E-mail enviado!</Text>
                  <Text style={styles.successSubtitle}>
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

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
    backgroundColor: theme.colors.surface,
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
    color: theme.colors.text,
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
    color: theme.colors.text,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.textLight,
    marginTop: 8,
    textAlign: 'center',
  },
  successCard: {
    backgroundColor: theme.colors.successBackground,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.successText,
    marginTop: 16,
  },
  successSubtitle: {
    fontSize: 15,
    color: theme.colors.successText,
    marginTop: 8,
  },
});
