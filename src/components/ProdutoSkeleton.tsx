import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeColors } from '../constants/theme';

export function ProdutoSkeletonItem({ layoutColuna = false }: { layoutColuna?: boolean }) {
  const { colors } = useTheme();
  const s = React.useMemo(() => styles(colors), [colors]);

  if (layoutColuna) {
    return (
      <View style={[s.card, s.cardColuna]}>
        <Skeleton width={44} height={44} borderRadius={12} style={s.iconeColuna} />
        <Skeleton width="80%" height={16} style={{ marginBottom: 8 }} />
        <Skeleton width="60%" height={14} style={{ marginBottom: 16 }} />
        <Skeleton width={60} height={24} borderRadius={8} />
      </View>
    );
  }

    return (
      <View style={s.card}>
        <Skeleton width={44} height={44} borderRadius={12} style={s.iconeRow} />
        <View style={s.info}>
        <Skeleton width="70%" height={16} style={{ marginBottom: 6 }} />
        <Skeleton width="40%" height={14} />
      </View>
      <Skeleton width={60} height={24} borderRadius={8} />
    </View>
  );
}

export function ProdutoListaSkeleton({ count = 6, layoutColuna = false }: { count?: number, layoutColuna?: boolean }) {
  const { colors } = useTheme();
  const s = React.useMemo(() => styles(colors), [colors]);

  return (
    <View style={layoutColuna ? s.listaColuna : s.listaRow}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={layoutColuna ? s.itemColunaWrapper : s.itemRowWrapper}>
          <ProdutoSkeletonItem layoutColuna={layoutColuna} />
        </View>
      ))}
    </View>
  );
}

const styles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardColuna: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  iconeRow: {
    marginRight: 12,
  },
  iconeColuna: {
    marginBottom: 12,
  },
  info: {
    flex: 1,
    marginRight: 8,
  },
  listaRow: {
    width: '100%',
    maxWidth: 1024,
    alignSelf: 'center',
    paddingHorizontal: 20,
    gap: 10,
    marginTop: 10,
  },
  itemRowWrapper: {
    width: '100%',
  },
  listaColuna: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: 1024,
    alignSelf: 'center',
    paddingHorizontal: 15,
  },
  itemColunaWrapper: {
    width: '50%',
    paddingHorizontal: 5,
    marginBottom: 10,
  },
});
