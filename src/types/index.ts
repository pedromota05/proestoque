export interface Categoria {
  id: string;
  nome: string;
  icone: string;
  cor: string;
  criadoEm: string;
}

export interface Produto {
  id: string;
  nome: string;
  observacao?: string | null;
  categoriaId: string;
  preco: number;
  quantidade: number;
  quantidadeMinima: number;
  unidade: string;
  foto?: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export type TipoMovimentacao = 'entrada' | 'saida';

export interface Movimentacao {
  id: string;
  produtoId: string;
  tipo: TipoMovimentacao;
  quantidade: number;
  observacao?: string | null;
  data: string;
}
