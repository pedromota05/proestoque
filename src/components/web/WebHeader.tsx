import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeColors } from '../../constants/theme';
import { LogoProEstoque } from '../LogoProEstoque';

type NavLink = {
  label: string;
  route: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
};

const NAV_LINKS: NavLink[] = [
  { label: 'Home', route: '/(tabs)', icon: 'home-outline' },
  { label: 'Produtos', route: '/(tabs)/produtos', icon: 'folder-outline' },
  { label: 'Configurações', route: '/(tabs)/configuracoes', icon: 'settings-outline' },
];

const BREAKPOINT = 768;

export function WebHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isDesktop = width >= BREAKPOINT;
  const { colors, isDark } = useTheme();
  const s = React.useMemo(() => styles(colors, isDark), [colors, isDark]);

  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <View style={s.wrapper}>
      <View style={s.container}>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)')}
          activeOpacity={0.7}
          accessibilityRole="link"
          accessibilityLabel="Ir para Home"
          style={s.logoArea}
        >
          <LogoProEstoque size="md" />
        </TouchableOpacity>

        {isDesktop ? (
          <View style={s.navArea}>
            <View style={s.navLinks}>
              {NAV_LINKS.map((link) => {
                const isActive =
                  pathname === link.route ||
                  pathname === link.route.replace('/(tabs)', '') ||
                  (link.route === '/(tabs)' && pathname === '/');
                return (
                  <TouchableOpacity
                    key={link.label}
                    onPress={() => router.push(link.route as any)}
                    style={[s.navItem, isActive && s.navItemActive]}
                    accessibilityRole="link"
                  >
                    <Ionicons
                      name={link.icon}
                      size={18}
                      color={isActive ? colors.primary : colors.textLight}
                      style={s.navIcon}
                    />
                    <Text style={[s.navText, isActive && s.navTextActive]}>
                      {link.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setMenuOpen(!menuOpen)}
            style={s.menuButton}
            accessibilityRole="button"
            accessibilityLabel="Menu de navegação"
          >
            <Ionicons
              name={menuOpen ? 'close' : 'menu-outline'}
              size={28}
              color={colors.text}
            />
          </TouchableOpacity>
        )}
      </View>

      {!isDesktop && menuOpen && (
        <View style={s.dropdown}>
          {NAV_LINKS.map((link) => (
            <TouchableOpacity
              key={link.label}
              onPress={() => {
                router.push(link.route as any);
                setMenuOpen(false);
              }}
              style={s.dropdownItem}
              accessibilityRole="link"
            >
              <Ionicons
                name={link.icon}
                size={20}
                color={colors.text}
                style={s.dropdownIcon}
              />
              <Text style={s.dropdownText}>{link.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  wrapper: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 100,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    minHeight: 80,
    maxWidth: 1600,
    width: '100%',
    alignSelf: 'center',
  },
  logoArea: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  navArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  navItemActive: {
    backgroundColor: isDark ? 'rgba(157, 102, 219, 0.15)' : 'rgba(99, 36, 164, 0.08)',
  },
  navIcon: {
    marginRight: 6,
  },
  navText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textLight,
  },
  navTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  menuButton: {
    padding: 8,
  },
  dropdown: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 32,
    paddingBottom: 16,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownIcon: {
    marginRight: 12,
  },
  dropdownText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
});
