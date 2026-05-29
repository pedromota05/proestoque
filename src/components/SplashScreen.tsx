import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LogoProEstoque } from './LogoProEstoque';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeColors } from '../constants/theme';

export function SplashScreen() {
  const { colors } = useTheme();
  const s = React.useMemo(() => styles(colors), [colors]);
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
    <View style={s.container}>
      <LogoProEstoque size="lg" />
      <View style={s.spacing} />
      <View style={s.progressBarContainer}>
        <Animated.View style={[s.progressBar, { width: widthInterpolated }]} />
      </View>
    </View>
  );
}

const styles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  spacing: {
    height: 32,
  },
  progressBarContainer: {
    width: 200,
    height: 6,
    backgroundColor: colors.border, 
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
});
