import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const logoSource = require('../../assets/images/logo.png');

type LogoSize = 'sm' | 'md' | 'lg';

interface LogoProEstoqueProps {
  size?: LogoSize;
}

const sizeMap: Record<LogoSize, { width: number; height: number }> = {
  sm: { width: 100, height: 35 },
  md: { width: 180, height: 60 },
  lg: { width: 260, height: 85 },
};

export function LogoProEstoque({ size = 'md' }: LogoProEstoqueProps) {
  const dimensions = sizeMap[size];
  const { isDark } = useTheme();

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <Image
        source={logoSource}
        style={[styles.logo, dimensions]}
        resizeMode="contain"
        accessibilityLabel="Logo ProEstoque"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logo: {
    alignSelf: 'center',
  },
});
