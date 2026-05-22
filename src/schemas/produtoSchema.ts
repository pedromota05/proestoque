import { z } from 'zod';

export const produtoSchema = z.object({
  nome: z
    .string()
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(80, 'O nome pode ter no máximo 80 caracteres'),

  categoriaId: z
    .string()
    .min(1, 'Selecione uma categoria'),

  quantidade: z
    .number({ error: 'Informe a quantidade' })
    .int('A quantidade deve ser um número inteiro')
    .min(0, 'A quantidade não pode ser negativa'),

  quantidadeMinima: z
    .number({ error: 'Informe a quantidade mínima' })
    .int('A quantidade mínima deve ser um número inteiro')
    .min(0, 'A quantidade mínima não pode ser negativa'),

  preco: z
    .number({ error: 'Informe o preço' })
    .positive('O preço deve ser maior que zero'),

  unidade: z.enum(['un', 'kg', 'cx', 'L', 'm'], {
    message: 'Selecione uma unidade válida',
  }),

  observacao: z
    .string()
    .max(200, 'A observação pode ter no máximo 200 caracteres')
    .nullish(),

  foto: z.string().nullish(),
});

export type ProdutoFormData = z.infer<typeof produtoSchema>;
