import React from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/constants/theme';
import { WebFooter } from '../../src/components/web/WebFooter';
import { useAuth } from '../../src/contexts/AuthContext';

const isWeb = Platform.OS === 'web';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
}

function MenuItem({ icon, label, onPress }: MenuItemProps) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      activeOpacity={0.6}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIconWrapper}>
          <Ionicons name={icon} size={20} color={theme.colors.primary} />
        </View>
        <Text style={styles.menuItemLabel}>{label}</Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={theme.colors.textLight}
      />
    </TouchableOpacity>
  );
}

function DangerButton({ onPress }: { onPress: () => void }) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Pressable
      style={[
        styles.dangerButton,
        isHovered && styles.dangerButtonHover,
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
        color={isHovered ? theme.colors.surface : theme.colors.error}
        style={styles.dangerIcon}
      />
      <Text
        style={[
          styles.dangerText,
          isHovered && styles.dangerTextHover,
        ]}
      >
        Sair da conta
      </Text>
    </Pressable>
  );
}

export default function ConfiguracoesScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const nomeFormatado = user?.nome ? user.nome.charAt(0).toUpperCase() + user.nome.slice(1) : '';

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      const confirmLogout = window.confirm('Tem certeza que deseja sair?');
      if (confirmLogout) {
        await logout();
        router.replace('/(auth)/login');
      }
    } else {
      Alert.alert(
        'Sair da conta',
        'Tem certeza que deseja sair?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Sair',
            style: 'destructive',
            onPress: async () => {
              await logout();
              router.replace('/(auth)/login');
            },
          },
        ],
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={isWeb}
      >
        <View style={styles.innerContainer}>
          {/* Header */}
          <Text style={styles.screenTitle}>Configurações</Text>

          {/* Card de Perfil */}
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.nome?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{nomeFormatado}</Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
            </View>
          </View>

          {/* Menu */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Preferências</Text>
            <View style={styles.menuCard}>
              <MenuItem icon="notifications-outline" label="Notificações" />
              <View style={styles.menuDivider} />
              <MenuItem icon="color-palette-outline" label="Aparência" />
              <View style={styles.menuDivider} />
              <MenuItem icon="help-circle-outline" label="Ajuda" />
            </View>
          </View>

          {/* Botão Sair */}
          <View style={styles.logoutSection}>
            <DangerButton onPress={handleLogout} />
          </View>
        </View>
      </ScrollView>

      {isWeb && <WebFooter />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 24,
  },

  // ─── Card de Perfil ───
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 28,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: theme.colors.surface,
    fontSize: 22,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  profileEmail: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginTop: 2,
  },

  // ─── Menu ───
  menuSection: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  menuDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginLeft: 66,
  },

  // ─── Botão Sair ───
  logoutSection: {
    marginTop: 'auto' as any,
    paddingTop: 20,
    alignItems: 'center',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 300,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.error,
    backgroundColor: theme.colors.errorBackground,
  },
  dangerButtonHover: {
    backgroundColor: theme.colors.error,
    borderColor: theme.colors.error,
  },
  dangerIcon: {
    marginRight: 8,
  },
  dangerText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.error,
  },
  dangerTextHover: {
    color: theme.colors.surface,
  },
});
