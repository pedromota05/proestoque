import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../src/contexts/ThemeContext';
import { ThemeColors } from '../src/constants/theme';
import { Button } from '../src/components/Button';

export default function AjudaScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const s = React.useMemo(() => styles(colors), [colors]);

  const faqs = [
    {
      pergunta: 'Como adicionar um novo produto?',
      resposta: 'Acesse a aba "Produtos" no menu principal e clique no botão "+" ou "Novo Produto". Preencha os dados e salve.',
    },
    {
      pergunta: 'Como recuperar minha senha?',
      resposta: 'Na tela de Login, clique em "Esqueci minha senha". Você receberá um e-mail com as instruções para redefinição.',
    },
    {
      pergunta: 'Como funciona o alerta de estoque crítico?',
      resposta: 'O sistema verifica diariamente a quantidade dos seus produtos. Se algum estiver abaixo do limite mínimo definido, você receberá uma notificação.',
    },
    {
      pergunta: 'Posso alterar a categoria de um produto depois de salvo?',
      resposta: 'Sim. Basta acessar os detalhes do produto, clicar em "Editar" e selecionar a nova categoria desejada.',
    },
  ];

  const handleSupportWhatsApp = () => {
    const phone = '5511999999999'; // Número fictício
    const message = 'Olá, equipe de suporte do ProEstoque! Preciso de ajuda com o aplicativo.';
    const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          // Fallback para web se o WhatsApp não estiver instalado ou for Web
          Linking.openURL(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('Erro ao abrir o WhatsApp', err));
  };

  const handleSupportEmail = () => {
    Linking.openURL('mailto:suporte@proestoque.com?subject=Ajuda%20com%20o%20App');
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={s.backButton}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
          <Text style={s.backText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Ajuda e Suporte</Text>
      </View>

      <ScrollView
        style={s.scrollView}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={Platform.OS === 'web'}
      >
        <View style={s.innerContainer}>
          
          <View style={s.section}>
            <Text style={s.sectionTitle}>Perguntas Frequentes (FAQ)</Text>
            
            {faqs.map((faq, index) => (
              <View key={index} style={s.faqItem}>
                <Text style={s.faqQuestion}>{faq.pergunta}</Text>
                <Text style={s.faqAnswer}>{faq.resposta}</Text>
              </View>
            ))}
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>Ainda precisa de ajuda?</Text>
            <Text style={s.supportDesc}>
              Nossa equipe está disponível de segunda a sexta, das 09h às 18h.
            </Text>

            <Button 
              title="Falar com o Suporte (WhatsApp)" 
              onPress={handleSupportWhatsApp}
              style={s.supportButton}
            />
            
            <Button 
              title="Enviar E-mail" 
              variant="outline"
              onPress={handleSupportEmail}
              style={s.supportButton}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (colors: ThemeColors) => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginRight: 16,
  },
  backText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 4,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  innerContainer: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  faqItem: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  supportDesc: {
    fontSize: 15,
    color: colors.textLight,
    marginBottom: 24,
  },
  supportButton: {
    marginBottom: 12,
  },
});
