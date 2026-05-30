import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeColors } from '../constants/theme';

interface ErrorViewProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorView({ message = 'Ocorreu um erro ao carregar os dados.', onRetry }: ErrorViewProps) {
  const { colors } = useTheme();
  const s = React.useMemo(() => styles(colors), [colors]);

  return (
    <View style={s.container}>
      <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
      <Text style={s.title}>Ops, algo deu errado</Text>
      <Text style={s.message}>{message}</Text>
      
      <TouchableOpacity style={s.retryButton} activeOpacity={0.8} onPress={onRetry}>
        <Ionicons name="refresh" size={20} color={colors.surface} style={{ marginRight: 8 }} />
        <Text style={s.retryText}>Tentar Novamente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: colors.background,
  },
  title: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  message: {
    marginTop: 8,
    fontSize: 15,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
});
