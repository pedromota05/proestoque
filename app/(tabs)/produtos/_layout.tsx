import { Stack, useRouter } from 'expo-router';
import { Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../src/constants/theme';

const isWeb = Platform.OS === 'web';

export default function ProdutosLayout() {
  const router = useRouter();

  const CustomBackButton = () => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/(tabs)/produtos' as any);
        }
      }}
      style={{ paddingRight: 16, flexDirection: 'row', alignItems: 'center' }}
    >
      <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
    </TouchableOpacity>
  );

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background },
        headerShadowVisible: false,
        headerTintColor: theme.colors.primary,
        headerTitleStyle: { fontWeight: 'bold' },
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: false, title: 'Produtos' }}
      />
      <Stack.Screen
        name="novo"
        options={{
          title: 'Novo Produto',
          headerShown: !isWeb,
          headerLeft: () => <CustomBackButton />,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Editar Produto',
          headerShown: !isWeb,
          headerLeft: () => <CustomBackButton />,
        }}
      />
    </Stack>
  );
}
