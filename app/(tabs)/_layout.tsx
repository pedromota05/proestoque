import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebHeader } from '../../src/components/web/WebHeader';
import { useTheme } from '../../src/contexts/ThemeContext';

const isWeb = Platform.OS === 'web';

export default function TabsLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {isWeb && <WebHeader />}

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textLight,
          tabBarStyle: isWeb
            ? { display: 'none' }
            : {
              borderTopColor: colors.border,
              backgroundColor: colors.surface,
              minHeight: 60 + insets.bottom,
              paddingTop: 8,
              paddingBottom: Math.max(insets.bottom, 8),
              elevation: 0,
            },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="produtos"
          options={{
            title: 'Produtos',
            href: '/produtos',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? 'folder' : 'folder-outline'} size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="configuracoes"
          options={{
            title: 'Config',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
