import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeColors } from '../constants/theme';

interface LoadingViewProps {
  message?: string;
}

export function LoadingView({ message = 'Carregando dados...' }: LoadingViewProps) {
  const { colors } = useTheme();
  const s = React.useMemo(() => styles(colors), [colors]);

  return (
    <View style={s.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={s.text}>{message}</Text>
    </View>
  );
}

const styles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textLight,
    fontWeight: '500',
  },
});
