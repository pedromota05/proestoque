import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeColors } from '../constants/theme';
import { formatCurrency } from '../utils/formatters';
import { estoqueBaixo } from '../utils/formatters';

export interface Produto {
  id: string;
  nome: string;
  quantidade: number;
  preco: number;
  estoqueMinimo: number;
}

interface ProductCardProps {
  produto: Produto;
  onEditar: (id: string) => void;
}

export function ProductCard({ produto, onEditar }: ProductCardProps) {
  const { colors } = useTheme();
  const s = React.useMemo(() => styles(colors), [colors]);
  const baixo = estoqueBaixo(produto.quantidade, produto.estoqueMinimo);

  return (
    <View style={s.card} testID="product-card">
      <View style={s.header}>
        <Text style={s.nome} testID="product-name">
          {produto.nome}
        </Text>
        <Text style={s.preco} testID="product-price">
          {formatCurrency(produto.preco)}
        </Text>
      </View>

      <Text style={s.quantidade} testID="product-quantity">
        Estoque: {produto.quantidade}
      </Text>

      {baixo && (
        <View style={s.alertContainer} testID="low-stock-alert">
          <Text style={s.alertText}>⚠ Estoque baixo</Text>
        </View>
      )}

      <TouchableOpacity
        style={s.editButton}
        onPress={() => onEditar(produto.id)}
        testID="edit-button"
        accessibilityRole="button"
        accessibilityLabel={`Editar ${produto.nome}`}
      >
        <Text style={s.editButtonText}>Editar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nome: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  preco: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  quantidade: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  alertContainer: {
    backgroundColor: colors.warningBackground,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  alertText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.warningText,
  },
  editButton: {
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});
