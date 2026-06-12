import { useMemo } from 'react';
import type { Produto } from '../types';

export interface IndicadoresEstoque {
  valorTotal: number;
  produtosBaixoEstoque: Produto[];
  totalItens: number;
}

/**
 * Hook que calcula indicadores de estoque a partir de um array de produtos.
 *
 * @param produtos - Lista de produtos do estoque.
 * @returns Indicadores calculados: valorTotal, produtosBaixoEstoque e totalItens.
 */
export function useEstoque(produtos: Produto[]): IndicadoresEstoque {
  const valorTotal = useMemo(
    () => produtos.reduce((acc, p) => acc + p.quantidade * p.preco, 0),
    [produtos],
  );

  const produtosBaixoEstoque = useMemo(
    () => produtos.filter((p) => p.quantidade <= p.quantidadeMinima),
    [produtos],
  );

  const totalItens = useMemo(
    () => produtos.reduce((acc, p) => acc + p.quantidade, 0),
    [produtos],
  );

  return { valorTotal, produtosBaixoEstoque, totalItens };
}
