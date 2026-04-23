import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../constants/theme';

const FOOTER_LINKS = [
  'Sobre',
  'Ajuda',
  'Termos de Privacidade',
  'Cookies',
  'Acessibilidade',
  'Desenvolvedores',
];

export function WebFooter() {
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.linksRow}>
          {FOOTER_LINKS.map((label, index) => (
            <TouchableOpacity
              key={label}
              accessibilityRole="link"
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />

        <Text style={styles.copyright}>
          © 2026 ProEstoque — Todos os direitos reservados
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
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
    color: theme.colors.text,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 4,
  },
  copyright: {
    fontSize: 13,
    color: theme.colors.textLight,
  },
});
