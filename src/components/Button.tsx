import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  type TouchableOpacityProps,
} from 'react-native';
import { theme } from '../constants/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'solid' | 'outline';
}

export function Button({
  title,
  loading = false,
  variant = 'solid',
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const isSolid = variant === 'solid';

  return (
    <TouchableOpacity
      style={[
        styles.base,
        isSolid ? styles.solid : styles.outline,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={isSolid ? '#FFFFFF' : theme.colors.primary}
          size="small"
        />
      ) : (
        <Text style={[styles.text, isSolid ? styles.textSolid : styles.textOutline]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  solid: {
    backgroundColor: theme.colors.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  textSolid: {
    color: '#FFFFFF',
  },
  textOutline: {
    color: theme.colors.primary,
  },
});
