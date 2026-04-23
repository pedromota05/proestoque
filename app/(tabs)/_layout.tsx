import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';
import { WebHeader } from '../../src/components/web/WebHeader';
import { theme } from '../../src/constants/theme';

const isWeb = Platform.OS === 'web';

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      {isWeb && <WebHeader />}

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textLight,
          tabBarStyle: isWeb
            ? { display: 'none' }
            : {
              borderTopColor: theme.colors.border,
              backgroundColor: theme.colors.background,
              height: 60,
              paddingBottom: 8,
              paddingTop: 8,
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
