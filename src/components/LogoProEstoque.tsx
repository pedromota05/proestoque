import React from 'react';
import { Image, StyleSheet } from 'react-native';

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

  return (
    <Image
      source={logoSource}
      style={[styles.logo, dimensions]}
      resizeMode="contain"
      accessibilityLabel="Logo ProEstoque"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    alignSelf: 'center',
  },
});
