# 📦 ProEstoque

<br>

<div align="center">
  <img src="./assets/images/logo.png" alt="ProEstoque Logo" width="300" />
</div>

<br>

**ProEstoque** é um sistema completo de gestão de produtos e estoque projetado com foco em pequenos comércios. O aplicativo segue uma abordagem *mobile-first*, mas conta com um layout totalmente responsivo e adaptado de forma limpa para experiências Web (Desktop) ao compartilhar a mesma base de código. 

---

## 🚦 Status do Projeto

> ✅ **Concluído / Integrado**
>
> O desenvolvimento do projeto foi concluído com sucesso. A aplicação front-end está 100% integrada, comunicando-se em tempo real com uma API REST robusta construída em Node.js.

---

## ✨ Features (Funcionalidades)

- 🔒 **Autenticação JWT Avançada**: Sistema seguro com interceptors do Axios para renovação automática de tokens (Refresh Token).
- 🌓 **Tema Dinâmico (Dark Mode / Light Mode)**: Suporte completo a temas, gerenciado de forma global pela Context API e persistido no dispositivo utilizando o AsyncStorage.
- ✅ **Validações Robustas**: Formulários de entrada fortemente validados utilizando a combinação de `react-hook-form` e `Zod`.
- ⏳ **Estados de Interface Aprimorados**: Uso de *Skeleton Loading* para feedback visual contínuo durante o carregamento de requisições.
- 🔔 **Notificações Locais**: Alertas proativos e notificações para itens que atingem níveis críticos de estoque.
- 📱 **Mobile-First & Web Responsivo**: Adaptação visual fluida baseada na plataforma de acesso (Mobile via Bottom Tabs e Web via Header/Footer dedicado).
- 📊 **Dashboard de Visão Geral**: Tela *Home* exibindo indicadores estratégicos do estoque, como valor total investido e métricas de categorias.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
* ⚛️ **[React Native](https://reactnative.dev/)**
* 🏗️ **[Expo](https://expo.dev/)** & **[Expo Router](https://docs.expo.dev/router/introduction/)** *(file-based routing)*
* 📘 **[TypeScript](https://www.typescriptlang.org/)**
* 📡 **Axios** *(Requisições HTTP e Interceptors)*
* 🧠 **Context API** *(Gerenciamento de Estado Global)*
* 📝 **React-hook-form** & **Zod** *(Validação de Formulários)*
* 💾 **AsyncStorage** *(Persistência Local)*
* 🎨 **[Ionicons](https://ionic.io/ionicons)** *(Ícones Vetoriais)*

### Backend (Integrado)
* 🟢 **Node.js**
* 🗄️ **PostgreSQL**
* 💎 **Prisma ORM**

---

## 🛠️ Pré-requisitos

Para rodar o projeto localmente, certifique-se de que o seu ambiente atenda aos seguintes requisitos:

- **[Node.js](https://nodejs.org/en/)** (Versão LTS recomendada: v18 ou superior)
- **[Git](https://git-scm.com/)**
- **[Expo Go](https://expo.dev/client)** instalado no celular para testes, **OU** um emulador/simulador configurado.

---

## ⚙️ Configuração Local (.env)

Antes de executar a aplicação localmente, configure a variável de ambiente para o endpoint da API. Crie um arquivo `.env` na raiz do projeto:

```env
# URL de Comunicação com a API Backend
EXPO_PUBLIC_API_URL=https://proestoque-api.onrender.com/api
```

---

## 🚀 Como rodar o projeto

Clone o repositório e navegue até o diretório:

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/proestoque.git

# 2. Acesse a pasta do projeto
cd proestoque

# 3. Instale as dependências
npm install

# 4. Inicie o servidor do Expo
npx expo start -c
```
Pressione `w` no terminal para abrir o aplicativo na Web, ou escaneie o QR Code através do **Expo Go** para visualizar o Mobile App nativo.

---

## 🚀 Produção / Build

O projeto foi devidamente implantado e distribuído visando a melhor performance e acessibilidade:

- **Web:** A versão Web responsiva está hospedada e otimizada na **Vercel**, oferecendo um tempo de carregamento acelerado através da sua infraestrutura global de CDN.
- **Mobile (Android):** O build final de produção foi compilado nativamente utilizando o **Expo EAS Build**, resultando em um arquivo `APK` robusto, pronto para distribuição e instalação em dispositivos Android.

---

## 📁 Estrutura de Pastas e Arquitetura

O projeto aproveita o Expo Router e uma estrutura arquitetural limpa para a organização de componentes, contextos e serviços:

```text
proestoque/
 ├── app/                      # Expo Router "File-based Routing"
 │    ├── (auth)/              # Grupo de telas de autenticação
 │    │    ├── cadastro.tsx
 │    │    ├── login.tsx
 │    │    └── recuperar-senha.tsx
 │    ├── (tabs)/              # Grupo de telas autenticadas (Bottom Tabs)
 │    │    ├── _layout.tsx     # Tabs Mobile / Header e Footer Web
 │    │    ├── configuracoes.tsx
 │    │    └── index.tsx       # Tela Home / Dashboard
 │    ├── _layout.tsx          # Root Layout com provedores principais
 │
 ├── src/
 │    ├── components/          # Componentes visuais UI reutilizáveis
 │    │    ├── web/            # Componentes dedicados para a plataforma Web
 │    │    │    ├── WebFooter.tsx
 │    │    │    └── WebHeader.tsx
 │    │    ├── Button.tsx
 │    │    ├── Input.tsx
 │    │    └── LogoProEstoque.tsx
 │    │
 │    ├── contexts/            # Gerenciamento de Estados Globais (Context API)
 │    │    ├── ThemeContext.tsx
 │    │    └── ProductsContext.tsx
 │    │
 │    ├── services/            # Serviços externos e comunicação HTTP
 │    │    └── api.ts          # Instância e Interceptors do Axios
 │    │
 │    └── constants/           # Constantes globais
 │         └── theme.ts        # Cores e Tokens de estilo globais
 │
 ├── assets/                   # Mídia, Fontes e Ícones
 └── app.json                  # Configuração de Build do Expo
```

---

## 🧪 Testes Automatizados (Jest & Testing Library)

O projeto conta com uma suíte de **53 testes automatizados** construída com **Jest** (via `jest-expo`) e **@testing-library/react-native**, garantindo a confiabilidade das regras de negócio, dos componentes visuais e dos hooks customizados.

### Como executar os testes

```bash
# Rodar todos os testes uma única vez
npm test

# Rodar em modo watch (re-executa ao salvar arquivos)
npm run test:watch

# Gerar relatório de cobertura de código
npm run test:coverage
```

> Após executar `npm run test:coverage`, o relatório detalhado estará disponível em `coverage/lcov-report/index.html`.

### O que foi coberto

| Categoria | Arquivo de teste | Testes | Descrição |
|---|---|:---:|---|
| **Funções puras (utils)** | `formatters.test.ts` | 15 | Testes para `formatCurrency`, `calcularValorTotal` e `estoqueBaixo`, incluindo edge cases com valores zero e negativos. |
| **Hooks customizados** | `useEstoque.test.ts` | 6 | Validação dos indicadores calculados (`valorTotal`, `produtosBaixoEstoque`, `totalItens`) usando `renderHook`, incluindo cenário com lista vazia. |
| **Componentes visuais** | `ProductCard.test.tsx` | 7 | Renderização de props, exibição condicional do alerta de estoque baixo, e callback `onEditar` via `fireEvent.press`. |
| **Componentes visuais** | `ProdutoSkeleton.test.tsx` | 9 | Testes que garantem o funcionamento correto de toda a lógica condicional de layouts de linha e coluna (`layoutColuna`), validação de tamanhos das listas e comportamentos vazios de loading. |
| **Componentes web** | `WebFooter.test.tsx` | 4 | Validação de renderização de conteúdo do rodapé de web, com testes de botões (clique sem quebra) e atributos de acessibilidade. |
| **Tela assíncrona (HTTP)** | `ListaProdutos.test.tsx` | 12 | Simulação completa dos fluxos de tela: loading, fetch e renderização de listas, Empty States, botão de falha da API ("Tentar Novamente"), uso do Pull-to-Refresh (`onRefresh`), simulação do Toggle de Grade vs Agrupado e filtragem visual (`chips`). |

### Métricas de Cobertura

> ✅ **Meta da disciplina: ≥ 70% de cobertura nas pastas `src/utils` e `src/hooks`** — alcançamos **100%** em ambas.
> 🏆 **Cobertura Global**: Evoluímos o projeto de 78.33% para **95.83%** de cobertura global em nosso refatoramento!

| Métrica | `src/utils/` | `src/hooks/` | `src/components/` | **Global** |
|---|:---:|:---:|:---:|:---:|
| **Statements** | 100% | 100% | 100% | **95.83%** |
| **Branches** | 100% | 100% | 92.30% | **84.84%** |
| **Functions** | 100% | 100% | 100% | **92.53%** |
| **Lines** | 100% | 100% | 100% | **95.83%** |

### Resultado Final

```
Test Suites: 6 passed, 6 total
Tests:       53 passed, 53 total
Snapshots:   0 total
```
