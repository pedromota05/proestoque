import React, { useState } from 'react';
import {
  Alert,
  Modal,
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
import { WebFooter } from '../../src/components/web/WebFooter';
import { useAuth } from '../../src/contexts/AuthContext';
import { useTheme, ThemePreference } from '../../src/contexts/ThemeContext';
import { ThemeColors } from '../../src/constants/theme';

const isWeb = Platform.OS === 'web';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  colors: ThemeColors;
}

function MenuItem({ icon, label, value, onPress, colors }: MenuItemProps) {
  return (
    <TouchableOpacity
      style={styles(colors).menuItem}
      activeOpacity={0.6}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles(colors).menuItemLeft}>
        <View style={styles(colors).menuIconWrapper}>
          <Ionicons name={icon} size={20} color={colors.primary} />
        </View>
        <Text style={styles(colors).menuItemLabel}>{label}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {value && <Text style={styles(colors).menuItemValue}>{value}</Text>}
        <Ionicons
          name="chevron-forward"
          size={18}
          color={colors.textLight}
        />
      </View>
    </TouchableOpacity>
  );
}

function DangerButton({ onPress, colors }: { onPress: () => void, colors: ThemeColors }) {
  const [isHovered, setIsHovered] = React.useState(false);
  const s = styles(colors);

  return (
    <Pressable
      style={[
        s.dangerButton,
        isHovered && s.dangerButtonHover,
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
        color={isHovered ? colors.surface : colors.error}
        style={s.dangerIcon}
      />
      <Text
        style={[
          s.dangerText,
          isHovered && s.dangerTextHover,
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
  const { colors, themePreference, setThemePreference } = useTheme();
  
  const [modalVisible, setModalVisible] = useState(false);

  const s = React.useMemo(() => styles(colors), [colors]);

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

  const getThemeLabel = (pref: ThemePreference) => {
    if (pref === 'light') return 'Claro';
    if (pref === 'dark') return 'Escuro';
    return 'Padrão do Sistema';
  };

  const selectTheme = (pref: ThemePreference) => {
    setThemePreference(pref);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        style={s.scrollView}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={isWeb}
      >
        <View style={s.innerContainer}>
          {/* Header */}
          <Text style={s.screenTitle}>Configurações</Text>

          {/* Card de Perfil */}
          <View style={s.profileCard}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>
                {user?.nome?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={s.profileInfo}>
              <Text style={s.profileName}>{nomeFormatado}</Text>
              <Text style={s.profileEmail}>{user?.email}</Text>
            </View>
          </View>

          {/* Menu */}
          <View style={s.menuSection}>
            <Text style={s.sectionTitle}>Preferências</Text>
            <View style={s.menuCard}>
              <MenuItem icon="notifications-outline" label="Notificações" colors={colors} />
              <View style={s.menuDivider} />
              <MenuItem 
                icon="color-palette-outline" 
                label="Aparência" 
                value={getThemeLabel(themePreference)}
                onPress={() => setModalVisible(true)}
                colors={colors}
              />
              <View style={s.menuDivider} />
              <MenuItem 
                icon="help-circle-outline" 
                label="Ajuda" 
                onPress={() => router.push('/ajuda')}
                colors={colors} 
              />
            </View>
          </View>

          {/* Botão Sair */}
          <View style={s.logoutSection}>
            <DangerButton onPress={handleLogout} colors={colors} />
          </View>
        </View>
      </ScrollView>

      {/* Modal de Tema */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={s.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={s.modalContent}>
            <Text style={s.modalTitle}>Aparência</Text>
            
            <TouchableOpacity 
              style={s.modalOption} 
              onPress={() => selectTheme('system')}
            >
              <Text style={[s.modalOptionText, themePreference === 'system' && { color: colors.primary, fontWeight: 'bold' }]}>Padrão do Sistema</Text>
              {themePreference === 'system' && <Ionicons name="checkmark" size={20} color={colors.primary} />}
            </TouchableOpacity>
            
            <View style={s.menuDivider} />
            
            <TouchableOpacity 
              style={s.modalOption} 
              onPress={() => selectTheme('light')}
            >
              <Text style={[s.modalOptionText, themePreference === 'light' && { color: colors.primary, fontWeight: 'bold' }]}>Claro</Text>
              {themePreference === 'light' && <Ionicons name="checkmark" size={20} color={colors.primary} />}
            </TouchableOpacity>

            <View style={s.menuDivider} />

            <TouchableOpacity 
              style={s.modalOption} 
              onPress={() => selectTheme('dark')}
            >
              <Text style={[s.modalOptionText, themePreference === 'dark' && { color: colors.primary, fontWeight: 'bold' }]}>Escuro</Text>
              {themePreference === 'dark' && <Ionicons name="checkmark" size={20} color={colors.primary} />}
            </TouchableOpacity>

            <TouchableOpacity 
              style={s.modalCancel} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={s.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {isWeb && <WebFooter />}
    </SafeAreaView>
  );
}

// Estilos dinâmicos baseados no tema atual
const styles = (colors: ThemeColors) => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
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
    color: colors.text,
    marginBottom: 24,
  },

  // ─── Card de Perfil ───
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 28,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFF', // Mantém branco independente do tema (pois o fundo é primary)
    fontSize: 22,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 2,
  },

  // ─── Menu ───
  menuSection: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
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
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  menuItemValue: {
    fontSize: 14,
    color: colors.textLight,
    marginRight: 8,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
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
    borderColor: colors.error,
    backgroundColor: colors.errorBackground,
  },
  dangerButtonHover: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  dangerIcon: {
    marginRight: 8,
  },
  dangerText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
  dangerTextHover: {
    color: colors.surface,
  },

  // ─── Modal ───
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  modalOptionText: {
    fontSize: 16,
    color: colors.text,
  },
  modalCancel: {
    marginTop: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
});
