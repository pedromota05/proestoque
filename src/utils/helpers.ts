import type { Produto } from '../types';

export function getProdutosComEstoqueBaixo(
  produtos: Produto[]
): Produto[] {
  return produtos.filter((p) => p.quantidade <= p.quantidadeMinima);
}

export function getValorTotalEstoque(
  produtos: Produto[]
): number {
  return produtos.reduce(
    (total, p) => total + p.preco * p.quantidade,
    0,
  );
}

export function formatarPreco(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}
