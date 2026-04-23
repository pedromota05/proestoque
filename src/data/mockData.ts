// ─── Tipos ───
export interface Categoria {
  id: string;
  nome: string;
  icone: string;
}

export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  categoriaId: string;
  preco: number;
  quantidadeEstoque: number;
  estoqueMinimo: number;
  unidade: string;
  imagemUrl?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export type TipoMovimentacao = 'entrada' | 'saida';

export interface Movimentacao {
  id: string;
  produtoId: string;
  tipo: TipoMovimentacao;
  quantidade: number;
  observacao?: string;
  data: string;
}

// ─── Categorias Mock ───
export const CATEGORIAS_MOCK: Categoria[] = [
  { id: 'cat-1', nome: 'Eletrônicos', icone: 'hardware-chip-outline' },
  { id: 'cat-2', nome: 'Alimentos', icone: 'fast-food-outline' },
  { id: 'cat-3', nome: 'Bebidas', icone: 'beer-outline' },
  { id: 'cat-4', nome: 'Limpeza', icone: 'sparkles-outline' },
  { id: 'cat-5', nome: 'Papelaria', icone: 'document-text-outline' },
  { id: 'cat-6', nome: 'Ferramentas', icone: 'construct-outline' },
];

// ─── Produtos Mock ───
export const PRODUTOS_MOCK: Produto[] = [
  {
    id: 'prod-1',
    nome: 'Fone Bluetooth',
    descricao: 'Fone de ouvido sem fio com cancelamento de ruído',
    categoriaId: 'cat-1',
    preco: 189.9,
    quantidadeEstoque: 34,
    estoqueMinimo: 10,
    unidade: 'un',
    criadoEm: '2026-01-10T08:00:00Z',
    atualizadoEm: '2026-04-18T14:30:00Z',
  },
  {
    id: 'prod-2',
    nome: 'Cabo USB-C',
    descricao: 'Cabo USB-C para USB-A, 1,5 m, trançado',
    categoriaId: 'cat-1',
    preco: 29.9,
    quantidadeEstoque: 120,
    estoqueMinimo: 20,
    unidade: 'un',
    criadoEm: '2026-01-12T10:00:00Z',
    atualizadoEm: '2026-04-15T09:00:00Z',
  },
  {
    id: 'prod-3',
    nome: 'Arroz Integral 1kg',
    descricao: 'Arroz integral tipo 1 — pacote de 1 kg',
    categoriaId: 'cat-2',
    preco: 8.49,
    quantidadeEstoque: 3,
    estoqueMinimo: 15,
    unidade: 'pct',
    criadoEm: '2026-02-05T11:00:00Z',
    atualizadoEm: '2026-04-20T16:45:00Z',
  },
  {
    id: 'prod-4',
    nome: 'Café Torrado 500g',
    descricao: 'Café premium torrado e moído, embalagem a vácuo',
    categoriaId: 'cat-2',
    preco: 24.9,
    quantidadeEstoque: 48,
    estoqueMinimo: 10,
    unidade: 'pct',
    criadoEm: '2026-02-10T09:30:00Z',
    atualizadoEm: '2026-04-19T11:00:00Z',
  },
  {
    id: 'prod-5',
    nome: 'Suco de Laranja 1L',
    descricao: 'Suco de laranja integral, sem adição de açúcar',
    categoriaId: 'cat-3',
    preco: 12.5,
    quantidadeEstoque: 5,
    estoqueMinimo: 12,
    unidade: 'un',
    criadoEm: '2026-03-01T07:00:00Z',
    atualizadoEm: '2026-04-21T08:20:00Z',
  },
  {
    id: 'prod-6',
    nome: 'Detergente 500ml',
    descricao: 'Detergente neutro concentrado para uso doméstico',
    categoriaId: 'cat-4',
    preco: 3.99,
    quantidadeEstoque: 72,
    estoqueMinimo: 20,
    unidade: 'un',
    criadoEm: '2026-01-20T14:00:00Z',
    atualizadoEm: '2026-04-10T10:00:00Z',
  },
  {
    id: 'prod-7',
    nome: 'Resma Papel A4',
    descricao: 'Resma com 500 folhas, papel sulfite 75 g/m²',
    categoriaId: 'cat-5',
    preco: 28.0,
    quantidadeEstoque: 2,
    estoqueMinimo: 5,
    unidade: 'resma',
    criadoEm: '2026-02-15T13:00:00Z',
    atualizadoEm: '2026-04-22T09:15:00Z',
  },
  {
    id: 'prod-8',
    nome: 'Chave Phillips',
    descricao: 'Chave de fenda Phillips 3/16″ com cabo ergonômico',
    categoriaId: 'cat-6',
    preco: 14.9,
    quantidadeEstoque: 18,
    estoqueMinimo: 5,
    unidade: 'un',
    criadoEm: '2026-03-08T15:00:00Z',
    atualizadoEm: '2026-04-17T17:00:00Z',
  },
  {
    id: 'prod-9',
    nome: 'Água Mineral 500ml',
    descricao: 'Água mineral sem gás, garrafa PET 500 ml',
    categoriaId: 'cat-3',
    preco: 2.5,
    quantidadeEstoque: 200,
    estoqueMinimo: 50,
    unidade: 'un',
    criadoEm: '2026-03-12T06:00:00Z',
    atualizadoEm: '2026-04-22T07:30:00Z',
  },
  {
    id: 'prod-10',
    nome: 'Mouse Sem Fio',
    descricao: 'Mouse óptico wireless 1600 DPI, design compacto',
    categoriaId: 'cat-1',
    preco: 59.9,
    quantidadeEstoque: 7,
    estoqueMinimo: 8,
    unidade: 'un',
    criadoEm: '2026-01-25T12:00:00Z',
    atualizadoEm: '2026-04-20T14:00:00Z',
  },
];

// ─── Movimentações Mock ───
export const MOVIMENTACOES_MOCK: Movimentacao[] = [
  {
    id: 'mov-1',
    produtoId: 'prod-1',
    tipo: 'entrada',
    quantidade: 20,
    observacao: 'Reposição do fornecedor',
    data: '2026-04-18T14:30:00Z',
  },
  {
    id: 'mov-2',
    produtoId: 'prod-3',
    tipo: 'saida',
    quantidade: 12,
    observacao: 'Venda PDV',
    data: '2026-04-20T16:45:00Z',
  },
  {
    id: 'mov-3',
    produtoId: 'prod-5',
    tipo: 'saida',
    quantidade: 7,
    observacao: 'Venda online',
    data: '2026-04-21T08:20:00Z',
  },
  {
    id: 'mov-4',
    produtoId: 'prod-7',
    tipo: 'saida',
    quantidade: 3,
    observacao: 'Consumo interno',
    data: '2026-04-22T09:15:00Z',
  },
  {
    id: 'mov-5',
    produtoId: 'prod-2',
    tipo: 'entrada',
    quantidade: 50,
    observacao: 'Compra atacado',
    data: '2026-04-15T09:00:00Z',
  },
  {
    id: 'mov-6',
    produtoId: 'prod-9',
    tipo: 'entrada',
    quantidade: 100,
    observacao: 'Reposição semanal',
    data: '2026-04-22T07:30:00Z',
  },
  {
    id: 'mov-7',
    produtoId: 'prod-10',
    tipo: 'saida',
    quantidade: 3,
    observacao: 'Inventário — ajuste',
    data: '2026-04-20T14:00:00Z',
  },
];

// ─── Funções Auxiliares ───
export function getProdutosComEstoqueBaixo(
  produtos: Produto[] = PRODUTOS_MOCK,
): Produto[] {
  return produtos.filter((p) => p.quantidadeEstoque <= p.estoqueMinimo);
}

export function getValorTotalEstoque(
  produtos: Produto[] = PRODUTOS_MOCK,
): number {
  return produtos.reduce(
    (total, p) => total + p.preco * p.quantidadeEstoque,
    0,
  );
}

export function formatarPreco(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}
