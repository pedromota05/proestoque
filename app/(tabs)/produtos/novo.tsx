import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { ImagePickerField } from '../../../src/components/ImagePickerField';
import { Input } from '../../../src/components/Input';
import { Button } from '../../../src/components/Button';
import { theme } from '../../../src/constants/theme';
import { useProducts } from '../../../src/contexts/ProductsContext';
import { useCategorias } from '../../../src/hooks/useCategorias';
import {
  produtoSchema,
  type ProdutoFormData,
} from '../../../src/schemas/produtoSchema';

const UNIDADES = [
  { value: 'un', label: 'Unidade' },
  { value: 'kg', label: 'Kg' },
  { value: 'cx', label: 'Caixa' },
  { value: 'L', label: 'Litro' },
  { value: 'm', label: 'Metro' },
] as const;

export default function NovoProdutoScreen() {
  const router = useRouter();
  const { adicionarProduto } = useProducts();
  const { categorias } = useCategorias();
  const [precoTexto, setPrecoTexto] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      nome: '',
      categoriaId: '',
      quantidade: 0,
      quantidadeMinima: 0,
      preco: 0,
      unidade: 'un',
      observacao: '',
      foto: undefined,
    },
  });

  async function onSubmit(data: ProdutoFormData) {
    try {
      await adicionarProduto({
        nome: data.nome,
        observacao: data.observacao ?? '',
        categoriaId: data.categoriaId,
        preco: data.preco,
        quantidade: data.quantidade,
        quantidadeMinima: data.quantidadeMinima,
        unidade: data.unidade,
        foto: data.foto,
      });

      Toast.show({
        type: 'success',
        text1: 'Cadastrado!',
        text2: 'Novo produto adicionado ao estoque.',
        position: 'top',
      });
      reset();
      setPrecoTexto('');
      router.back();
    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      const errorMessage = error?.response?.data?.message || 'Não foi possível salvar o produto.';
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: errorMessage,
        position: 'top',
      });
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
        style={Platform.OS === 'web' ? ({ overflowY: 'scroll' } as any) : undefined}
      >
        <View style={styles.formWrapper}>
          <View style={[styles.formContainer, Platform.OS === 'web' && styles.webCard]}>
          {/* Foto */}
          <Controller
            control={control}
            name="foto"
            render={({ field: { value, onChange } }) => (
              <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <ImagePickerField value={value ?? null} onChange={onChange} />
              </View>
            )}
          />

          {/* Nome */}
          <Text style={styles.label}>Nome do produto</Text>
          <Controller
            control={control}
            name="nome"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                icon="cube-outline"
                placeholder="Ex: Fone Bluetooth"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.nome?.message}
                maxLength={80}
              />
            )}
          />

          {/* Categoria */}
          <Text style={styles.label}>Categoria</Text>
          <Controller
            control={control}
            name="categoriaId"
            render={({ field: { onChange, value } }) => (
              <View style={styles.chipsRow}>
                {categorias.map((cat) => {
                  const ativo = value === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.chip,
                        ativo ? styles.chipAtivo : styles.chipInativo,
                      ]}
                      activeOpacity={0.7}
                      onPress={() => onChange(cat.id)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          ativo ? styles.chipTextAtivo : styles.chipTextInativo,
                        ]}
                      >
                        {cat.nome}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                {errors.categoriaId && (
                  <Text style={styles.errorText}>
                    {errors.categoriaId.message}
                  </Text>
                )}
              </View>
            )}
          />

          {/* Quantidade e Quantidade Mínima */}
          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.label}>Quantidade</Text>
              <Controller
                control={control}
                name="quantidade"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    icon="layers-outline"
                    placeholder="0"
                    value={value !== undefined ? String(value) : ''}
                    onChangeText={(t) => onChange(t === '' ? 0 : parseInt(t, 10) || 0)}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    error={errors.quantidade?.message}
                  />
                )}
              />
            </View>

            <View style={styles.halfField}>
              <Text style={styles.label}>Qtd. Mínima</Text>
              <Controller
                control={control}
                name="quantidadeMinima"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    icon="alert-circle-outline"
                    placeholder="0"
                    value={value !== undefined ? String(value) : ''}
                    onChangeText={(t) => onChange(t === '' ? 0 : parseInt(t, 10) || 0)}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    error={errors.quantidadeMinima?.message}
                  />
                )}
              />
            </View>
          </View>

          {/* Preço */}
          <Text style={styles.label}>Preço (R$)</Text>
          <Controller
            control={control}
            name="preco"
            render={({ field: { onChange, onBlur } }) => (
              <Input
                icon="cash-outline"
                placeholder="0,00"
                value={precoTexto}
                onChangeText={(text) => {
                  setPrecoTexto(text);
                  const parsed = parseFloat(text.replace(',', '.'));
                  onChange(isNaN(parsed) ? 0 : parsed);
                }}
                onBlur={onBlur}
                keyboardType="decimal-pad"
                error={errors.preco?.message}
              />
            )}
          />

          {/* Unidade */}
          <Text style={styles.label}>Unidade</Text>
          <Controller
            control={control}
            name="unidade"
            render={({ field: { onChange, value } }) => (
              <View style={styles.chipsRow}>
                {UNIDADES.map((u) => {
                  const ativo = value === u.value;
                  return (
                    <TouchableOpacity
                      key={u.value}
                      style={[
                        styles.chip,
                        ativo ? styles.chipAtivo : styles.chipInativo,
                      ]}
                      activeOpacity={0.7}
                      onPress={() => onChange(u.value)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          ativo ? styles.chipTextAtivo : styles.chipTextInativo,
                        ]}
                      >
                        {u.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                {errors.unidade && (
                  <Text style={styles.errorText}>
                    {errors.unidade.message}
                  </Text>
                )}
              </View>
            )}
          />

          {/* Observação */}
          <Text style={styles.label}>Observação (opcional)</Text>
          <Controller
            control={control}
            name="observacao"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                icon="chatbubble-outline"
                placeholder="Detalhes adicionais..."
                value={value ?? ''}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.observacao?.message}
                maxLength={200}
                multiline
              />
            )}
          />

          {/* Botão Salvar */}
          <Button
            title="Salvar produto"
            onPress={handleSubmit(onSubmit, (erros) => console.log('Erros de validação Zod:', erros))}
            loading={isSubmitting}
            style={{ marginTop: 8 }}
          />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  formWrapper: {
    maxWidth: 700,
    width: '100%',
    alignSelf: 'center',
    padding: 20,
  },
  formContainer: {
    gap: 4,
  },
  webCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 32,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center' as any,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipAtivo: {
    backgroundColor: theme.colors.primary,
  },
  chipInativo: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextAtivo: {
    color: theme.colors.surface,
  },
  chipTextInativo: {
    color: theme.colors.textLight,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 13,
    marginTop: 4,
    marginLeft: 4,
    width: '100%',
  },
});
