import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

interface ErrorViewProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorView({ message = 'Ocorreu um erro ao carregar os dados.', onRetry }: ErrorViewProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={64} color={theme.colors.error} />
      <Text style={styles.title}>Ops, algo deu errado</Text>
      <Text style={styles.message}>{message}</Text>
      
      <TouchableOpacity style={styles.retryButton} activeOpacity={0.8} onPress={onRetry}>
        <Ionicons name="refresh" size={20} color={theme.colors.surface} style={{ marginRight: 8 }} />
        <Text style={styles.retryText}>Tentar Novamente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  message: {
    marginTop: 8,
    fontSize: 15,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
});
