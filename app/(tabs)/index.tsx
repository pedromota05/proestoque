import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../src/constants/theme';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <Text style={styles.greeting}>Olá, Pedro Mota 👋</Text>
            <Text style={styles.subtitle}>Visão geral do seu estoque</Text>
          </View>

          <View style={styles.mainCard}>
            <Text style={styles.mainCardLabel}>Total em produtos</Text>
            <Text style={styles.mainCardValue}>247</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.smallCard}>
              <Text style={styles.smallCardLabel}>Categorias</Text>
              <Text style={styles.smallCardValue}>12</Text>
            </View>

            <View style={styles.smallCard}>
              <Text style={styles.smallCardLabel}>Alertas</Text>
              <Text style={[styles.smallCardValue, styles.alertValue]}>5</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: 24,
  },
  innerContainer: {
    width: '100%',
    maxWidth: 1024,
    alignSelf: 'center',
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.textLight,
    marginTop: 4,
  },
  mainCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  mainCardLabel: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  mainCardValue: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  smallCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  smallCardLabel: {
    fontSize: 14,
    color: theme.colors.textLight,
    fontWeight: '500',
  },
  smallCardValue: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 8,
  },
  alertValue: {
    color: theme.colors.error,
  },
});
