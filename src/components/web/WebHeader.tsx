import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { theme } from '../../constants/theme';
import { LogoProEstoque } from '../LogoProEstoque';

type NavLink = {
  label: string;
  route: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
};

const NAV_LINKS: NavLink[] = [
  { label: 'Home', route: '/(tabs)', icon: 'home-outline' },
  { label: 'Configurações', route: '/(tabs)/configuracoes', icon: 'settings-outline' },
];

const BREAKPOINT = 768;

export function WebHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isDesktop = width >= BREAKPOINT;

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)')}
          activeOpacity={0.7}
          accessibilityRole="link"
          accessibilityLabel="Ir para Home"
          style={styles.logoArea}
        >
          <LogoProEstoque size="md" />
        </TouchableOpacity>

        {isDesktop ? (
          <View style={styles.navArea}>
            <View style={styles.navLinks}>
              {NAV_LINKS.map((link) => {
                const isActive =
                  pathname === link.route ||
                  pathname === link.route.replace('/(tabs)', '') ||
                  (link.route === '/(tabs)' && pathname === '/');
                return (
                  <TouchableOpacity
                    key={link.label}
                    onPress={() => router.push(link.route as any)}
                    style={[styles.navItem, isActive && styles.navItemActive]}
                    accessibilityRole="link"
                  >
                    <Ionicons
                      name={link.icon}
                      size={18}
                      color={isActive ? theme.colors.primary : theme.colors.textLight}
                      style={styles.navIcon}
                    />
                    <Text style={[styles.navText, isActive && styles.navTextActive]}>
                      {link.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.searchContainer}>
              <Ionicons
                name="search-outline"
                size={18}
                color={theme.colors.textLight}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Pesquisar..."
                placeholderTextColor={theme.colors.textLight}
                value={searchQuery}
                onChangeText={setSearchQuery}
                accessibilityLabel="Campo de pesquisa"
              />
            </View>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setMenuOpen(!menuOpen)}
            style={styles.menuButton}
            accessibilityRole="button"
            accessibilityLabel="Menu de navegação"
          >
            <Ionicons
              name={menuOpen ? 'close' : 'menu-outline'}
              size={28}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        )}
      </View>

      {!isDesktop && menuOpen && (
        <View style={styles.dropdown}>
          {NAV_LINKS.map((link) => (
            <TouchableOpacity
              key={link.label}
              onPress={() => {
                router.push(link.route as any);
                setMenuOpen(false);
              }}
              style={styles.dropdownItem}
              accessibilityRole="link"
            >
              <Ionicons
                name={link.icon}
                size={20}
                color={theme.colors.text}
                style={styles.dropdownIcon}
              />
              <Text style={styles.dropdownText}>{link.label}</Text>
            </TouchableOpacity>
          ))}

          <View style={styles.dropdownSearchContainer}>
            <Ionicons
              name="search-outline"
              size={18}
              color={theme.colors.textLight}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar..."
              placeholderTextColor={theme.colors.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
              accessibilityLabel="Campo de pesquisa"
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
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
    backgroundColor: 'rgba(99, 36, 164, 0.08)',
  },
  navIcon: {
    marginRight: 6,
  },
  navText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textLight,
  },
  navTextActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    width: 220,
    marginLeft: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    outlineStyle: 'none',
  } as any,
  menuButton: {
    padding: 8,
  },
  dropdown: {
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingHorizontal: 32,
    paddingBottom: 16,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dropdownIcon: {
    marginRight: 12,
  },
  dropdownText: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.text,
  },
  dropdownSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    marginTop: 12,
  },
});
