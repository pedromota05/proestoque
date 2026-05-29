import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { lightColors, darkColors, ThemeColors } from '../constants/theme';

export type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeContextData {
  colors: ThemeColors;
  themePreference: ThemePreference;
  setThemePreference: (theme: ThemePreference) => Promise<void>;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

const THEME_STORAGE_KEY = '@proestoque:theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themePreference, setThemeState] = useState<ThemePreference>('light');
  const [systemTheme, setSystemTheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

  useEffect(() => {
    // Carrega a preferência do storage na inicialização
    async function loadTheme() {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setThemeState(stored);
        }
      } catch (error) {
        console.error('Erro ao carregar tema:', error);
      }
    }
    loadTheme();
  }, []);

  useEffect(() => {
    // Escuta mudanças no tema do sistema
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  const setThemePreference = async (newTheme: ThemePreference) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  };

  const isDark =
    themePreference === 'dark' || (themePreference === 'system' && systemTheme === 'dark');
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ colors, themePreference, setThemePreference, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
}
