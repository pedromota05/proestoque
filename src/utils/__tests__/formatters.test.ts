import { formatCurrency, calcularValorTotal, estoqueBaixo } from '../formatters';

describe('formatCurrency', () => {
  it('deve formatar um valor inteiro para BRL', () => {
    expect(formatCurrency(1500)).toBe('R$\u00A01.500,00');
  });

  it('deve formatar um valor com centavos para BRL', () => {
    expect(formatCurrency(49.9)).toBe('R$\u00A049,90');
  });

  it('deve formatar zero corretamente', () => {
    expect(formatCurrency(0)).toBe('R$\u00A00,00');
  });

  it('deve formatar valores negativos com o sinal de menos', () => {
    expect(formatCurrency(-250.5)).toBe('-R$\u00A0250,50');
  });

  it('deve formatar valores muito grandes com separadores de milhar', () => {
    expect(formatCurrency(1000000)).toBe('R$\u00A01.000.000,00');
  });
});

describe('calcularValorTotal', () => {
  it('deve calcular o total para valores inteiros', () => {
    expect(calcularValorTotal(10, 25)).toBe(250);
  });

  it('deve retornar zero quando a quantidade for zero', () => {
    expect(calcularValorTotal(0, 99.9)).toBe(0);
  });

  it('deve retornar zero quando o preço for zero', () => {
    expect(calcularValorTotal(5, 0)).toBe(0);
  });

  it('deve calcular corretamente com valores decimais', () => {
    expect(calcularValorTotal(3, 19.99)).toBeCloseTo(59.97);
  });

  it('deve lidar com quantidade negativa (devolução)', () => {
    expect(calcularValorTotal(-2, 50)).toBe(-100);
  });
});

describe('estoqueBaixo', () => {
  it('deve retornar true quando a quantidade é menor que o mínimo', () => {
    expect(estoqueBaixo(3, 10)).toBe(true);
  });

  it('deve retornar true quando a quantidade é igual ao mínimo', () => {
    expect(estoqueBaixo(10, 10)).toBe(true);
  });

  it('deve retornar false quando a quantidade é maior que o mínimo', () => {
    expect(estoqueBaixo(15, 10)).toBe(false);
  });

  it('deve retornar true quando ambos os valores são zero', () => {
    expect(estoqueBaixo(0, 0)).toBe(true);
  });

  it('deve retornar true quando a quantidade é negativa', () => {
    expect(estoqueBaixo(-5, 0)).toBe(true);
  });
});
