import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  type TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeColors } from '../constants/theme';

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
  const { colors } = useTheme();
  const s = React.useMemo(() => styles(colors), [colors]);
  const isSolid = variant === 'solid';

  return (
    <TouchableOpacity
      style={[
        s.base,
        isSolid ? s.solid : s.outline,
        (disabled || loading) && s.disabled,
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
          color={isSolid ? '#FFFFFF' : colors.primary}
          size="small"
        />
      ) : (
        <Text style={[s.text, isSolid ? s.textSolid : s.textOutline]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = (colors: ThemeColors) => StyleSheet.create({
  base: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  solid: {
    backgroundColor: colors.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
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
    color: colors.primary,
  },
});
