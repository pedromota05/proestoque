import React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/constants/theme';
import { WebFooter } from '../../src/components/web/WebFooter';

const isWeb = Platform.OS === 'web';

export default function ConfiguracoesScreen() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <Ionicons name="settings-outline" size={48} color={theme.colors.primary} />
            <Text style={styles.title}>Configurações</Text>
          </View>

          <View style={styles.content}>
            <LogoutButton onPress={handleLogout} />
          </View>
        </View>
      </View>

      {isWeb && <WebFooter />}
    </SafeAreaView>
  );
}

function LogoutButton({ onPress }: { onPress: () => void }) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Pressable
      style={[
        styles.logoutButton,
        isHovered && styles.logoutButtonHover,
      ]}
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      accessibilityRole="button"
      accessibilityLabel="Sair da conta"
    >
      <Ionicons
        name="log-out-outline"
        size={20}
        color={isHovered ? theme.colors.surface : theme.colors.primary}
        style={styles.logoutIcon}
      />
      <Text
        style={[
          styles.logoutText,
          isHovered && styles.logoutTextHover,
        ]}
      >
        Sair da conta
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 40,
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 300,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    backgroundColor: 'transparent',
  },
  logoutButtonHover: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  logoutTextHover: {
    color: theme.colors.surface,
  },
});
