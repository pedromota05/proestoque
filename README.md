# 📦 ProEstoque

<br>

<div align="center">
  <img src="./assets/images/logo.png" alt="ProEstoque Logo" width="300" />
</div>

<br>

**ProEstoque** é um sistema completo de gestão de produtos e estoque projetado com foco em pequenos comércios. Trata-se de um projeto acadêmico semestral que visa simplificar e dar previsibilidade ao controle de mercadorias. O aplicativo segue uma abordagem *mobile-first*, mas conta com um layout totalmente responsivo e adaptado de forma limpa para experiências Web (Desktop) ao compartilhar a mesma base de código.

---

## 🚦 Status do Projeto

> 🚧 **Em Desenvolvimento**
>
> A primeira fase **Frontend** (Interface do Usuário com fluxo de telas e responsividade) foi concluída. O projeto atualmente aguarda a integração com o **Backend**.

---

## ✨ Features (Funcionalidades)

- 🔒 **Fluxo de Autenticação Completo**: Interface de **Login**, **Cadastro** e **Recuperação de Senha** com validações de inputs nativos.
- 📱 **Mobile-First & Web Responsivo**: Usando o mesmo código UI, a navegação adapta visualmente o layout baseado na plataforma.
  - **Mobile:** *Bottom Tabs*, formulários full-width.
  - **Web / Desktop:** *Header* de navegação dedicado, menu responsivo para telas web pequenas, *Footer* informativo, e layout centralizado em cards com sombra e larguras máximas limitadas.
- 📊 **Dashboard de Visão Geral**: Tela *Home* exibindo indicadores gerais do estoque, como Total em Produtos, Categorias e Alertas.
- 🚀 **Splash Screen Integrada**: Splash screen nativa baseada na logo, em sinergia com o icone adaptável do Android na pasta base do projeto.

---

## 🛠️ Tecnologias Utilizadas

### Frontend (Atual)
* ⚛️ **[React Native](https://reactnative.dev/)**
* 🏗️ **[Expo](https://expo.dev/)**
* 🗺️ **[Expo Router](https://docs.expo.dev/router/introduction/)** *(file-based routing)*
* 📘 **[TypeScript](https://www.typescriptlang.org/)**
* 🎨 **[Ionicons](https://ionic.io/ionicons)** *(ícones de tipografia inclusos diretamente no Expo vector-icons)*

### Backend (Previsto)
O plano tecnológico para a próxima fase acadêmica integrairá a stack de:
* 🟢 **Node.js**
* 🗄️ **PostgreSQL**
* 💎 **Prisma ORM**

---

## 🛠️ Pré-requisitos

Para rodar o projeto localmente, certifique-se de que o seu ambiente atenda aos seguintes requisitos mínimos:

- **[Node.js](https://nodejs.org/en/)** (Versão LTS recomendada: v18 ou superior)
- **[Git](https://git-scm.com/)**
- **[Expo Go](https://expo.dev/client)** instalado no seu celular Android ou iOS para testes mobile, **OU** um emulador Android / simulador iOS configurado em sua máquina de desenvolvimento.

---

## 🚀 Como rodar o projeto

Clone o repositório e navegue até o diretório via terminal:

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/proestoque.git

# 2. Acesse a pasta do projeto
cd proestoque

# 3. Instale as dependências
npm install

# 4. Inicie o servidor do Expo limpando cache (opcional, recomendado para ícones limpos)
npx expo start -c
```
Pressione `w` no terminal para abrir o aplicativo renderizado como Web, ou escaneie o código QR exibido através do **Expo Go** em seu smartphone para visualizar o Mobile App nativo.

---

## 📁 Estrutura de Pastas e Arquitetura

O projeto aproveita o Expo Router e uma estrutura robusta de componentes reutilizáveis.

```text
proestoque/
 ├── app/                      # Expo Router "File-based Routing"
 │    ├── (auth)/              # Grupo de telas de autenticação (não aparece na URL)
 │    │    ├── cadastro.tsx
 │    │    ├── login.tsx
 │    │    └── recuperar-senha.tsx
 │    ├── (tabs)/              # Grupo de telas autenticadas (Bottom Tabs)
 │    │    ├── _layout.tsx     # Define as Tabs Mobile e insere o Header Web e Footer Web
 │    │    ├── configuracoes.tsx
 │    │    └── index.tsx       # Tela Home / Dashboard
 │    ├── _layout.tsx          # Root Layout com provedores primários (SafeAreaProvider)
 │
 ├── src/
 │    ├── components/          # Componentes visuais UI reutilizáveis
 │    │    ├── web/            # Componentes dedicados para plataforma Web
 │    │    │    ├── WebFooter.tsx
 │    │    │    └── WebHeader.tsx
 │    │    ├── Button.tsx
 │    │    ├── Input.tsx
 │    │    └── LogoProEstoque.tsx  # Componente para manuseio universal do Logo
 │    │
 │    └── constants/           # Constantes globais
 │         └── theme.ts        # Cores (Primary, Accent, Text, etc) e Tokens de estilo globais
 │
 ├── assets/                   # Mídia e Fonts (Logo completa, Adaptive Android Icons)
 └── app.json                  # Arquivo de configuração de Build do Expo (Ícones, Splashes, Metadados)
```

---

## 😉 Desafio Bônus Cumprido!

O **Componente Customizado (`LogoProEstoque`)** foi extraído com sucesso! 
Inicialmente baseando-se em ícones simplificados, refatoramos o componente inteiro para renderizar nativamente o recurso `assets/images/logo.png`. 

As características mais proeminentes desta implementação:
- O uso inteligente de uma propriedade **`size`** (`sm`, `md`, `lg`) atrelada a metadados rígidos de dimensão em `width/height`.
- Retirada de margens atreladas ("*hardcoded magic margins*") para entregar responsabilidade espacial aos contextos pais – as telas. Isto permitiu um alinhamento perfeito do ícone no topo do Web Header, ao mesmo tempo em que dimensionamentos gigantes no Cadastro parecem naturais em conjunto à tela.
