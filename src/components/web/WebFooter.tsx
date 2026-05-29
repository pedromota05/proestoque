import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeColors } from '../../constants/theme';

const FOOTER_LINKS = [
  'Sobre',
  'Ajuda',
  'Termos de Privacidade',
  'Cookies',
  'Acessibilidade',
  'Desenvolvedores',
];

export function WebFooter() {
  const { colors } = useTheme();
  const s = React.useMemo(() => styles(colors), [colors]);

  return (
    <View style={s.container}>
      <View style={s.inner}>
        <View style={s.linksRow}>
          {FOOTER_LINKS.map((label, index) => (
            <TouchableOpacity
              key={label}
              accessibilityRole="link"
              activeOpacity={0.7}
            >
              <Text style={s.linkText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={s.divider} />

        <Text style={s.copyright}>
          © 2026 ProEstoque — Todos os direitos reservados
        </Text>
      </View>
    </View>
  );
}

const styles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 32,
    paddingHorizontal: 32,
    marginTop: 15,
  },
  inner: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    gap: 16,
  },
  linksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  copyright: {
    fontSize: 13,
    color: colors.textLight,
  },
});
