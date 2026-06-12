/**
 * Formata um valor numérico para o padrão monetário brasileiro (BRL).
 *
 * @param valor - O valor numérico a ser formatado.
 * @returns Uma string no formato "R$ X.XXX,XX".
 */
export function formatCurrency(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

/**
 * Calcula o valor total a partir da quantidade e do preço unitário.
 *
 * @param quantidade - A quantidade de itens.
 * @param preco - O preço unitário do item.
 * @returns O valor total (quantidade * preço).
 */
export function calcularValorTotal(quantidade: number, preco: number): number {
  return quantidade * preco;
}

/**
 * Verifica se o estoque está abaixo ou igual ao mínimo definido.
 *
 * @param quantidade - A quantidade atual em estoque.
 * @param minimo - O limiar mínimo de estoque.
 * @returns `true` se a quantidade for menor ou igual ao mínimo.
 */
export function estoqueBaixo(quantidade: number, minimo: number): boolean {
  return quantidade <= minimo;
}
