import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LogoProEstoque } from './LogoProEstoque';
import { theme } from '../constants/theme';

export function SplashScreen() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 100,
      duration: 1500,
      useNativeDriver: false, // width cannot use native driver
    }).start();
  }, [progress]);

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <LogoProEstoque size="lg" />
      <View style={styles.spacing} />
      <View style={styles.progressBarContainer}>
        <Animated.View style={[styles.progressBar, { width: widthInterpolated }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  spacing: {
    height: 32,
  },
  progressBarContainer: {
    width: 200,
    height: 6,
    backgroundColor: '#E2E8F0', // slate-200
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
});
