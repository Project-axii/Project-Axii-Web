<div align="center">

<img src="https://lfcostldktmoevensqdj.supabase.co/storage/v1/object/public/axii/white-logo.svg" alt="AXII Logo" width="120" />

# AXII — Sistema de Automação para Salas de Aula

**Interface web do sistema AXII, desenvolvida como Trabalho de Conclusão de Curso do Curso Técnico em Informática da ETEC de Mauá.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Licença MIT](https://img.shields.io/badge/licença-MIT-blue)](LICENSE)

</div>


## Sobre o Projeto

O **AXII** é um sistema de automação educacional que centraliza o controle dos equipamentos tecnológicos de uma instituição de ensino — computadores, projetores, iluminação e ar-condicionado — em um único painel web. O objetivo é reduzir o tempo perdido na preparação de equipamentos antes das aulas e facilitar o monitoramento em tempo real por professores e gestores.

Este repositório contém a **interface web** do sistema, responsável por:

- Autenticação de usuários (professores, gestores e administradores)
- Dashboard com visão geral de todos os dispositivos por sala
- Controle individual e em massa de dispositivos
- Gerenciamento de perfil e preferências do usuário

O sistema AXII é composto por três frentes:
- **Web** (este repositório) — painel de controle via navegador
- **Mobile** — aplicativo para controle pelo celular
- **Desktop** — cliente instalado nos computadores das salas, que recebe e executa os comandos


## Funcionalidades

### Dashboard
- Estatísticas em tempo real: total de dispositivos, online, offline e em manutenção
- Visualização de dispositivos organizados por sala (Laboratório 1, 2, 3, Auditório, Biblioteca)
- Detalhamento de cada sala, com dispositivos agrupados por tipo

### Gerenciamento de Dispositivos
- Cadastro de novos dispositivos (nome, IP, tipo, sala e descrição)
- Ligar/desligar dispositivos individualmente ou todos de uma categoria de uma vez
- Atualização de status: **Online**, **Offline** ou **Em Manutenção**
- Exclusão de dispositivos

**Tipos de dispositivos suportados:**

| Ícone | Tipo |
|---|---|
| 🖥️ | Computador |
| 📽️ | Projetor |
| 💡 | Iluminação |
| ❄️ | Ar-condicionado |
| 🔌 | Outro |

### Perfil e Configurações
- Edição de nome e e-mail
- Upload de foto de perfil
- Alteração de senha com verificação de força (calculada localmente, sem envio ao servidor)
- Preferências de notificações e privacidade
- Zona de perigo: limpar dados ou excluir conta

### Interface
- Tema **claro e escuro**, com alternância em tempo real
- Design responsivo para desktop e mobile
- Animações e transições suaves
- Acessibilidade com suporte ao VLibras (língua de sinais brasileira)


## Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| [React](https://react.dev/) | 19 | Biblioteca de interface |
| [TypeScript](https://www.typescriptlang.org/) | 5.9 | Tipagem estática |
| [Vite](https://vitejs.dev/) | 8 | Bundler e servidor de desenvolvimento |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Estilização |
| [React Router DOM](https://reactrouter.com/) | 7 | Roteamento |
| [Lucide React](https://lucide.dev/) | 0.552 | Ícones |
| [ESLint](https://eslint.org/) | 9 | Qualidade de código |


## Estrutura do Projeto

```
src/
├── components/
│   ├── Authentication/
│   │   └── input.tsx           # Componente de input reutilizável para autenticação
│   ├── home/
│   │   ├── device-list.tsx     # Card individual de dispositivo
│   │   ├── filters.tsx         # Filtros do dashboard
│   │   ├── input.tsx           # Input do dashboard
│   │   ├── modal.tsx           # Modal de cadastro de dispositivo
│   │   ├── room-card.tsx       # Card de sala
│   │   ├── select.tsx          # Select reutilizável
│   │   └── statistics.tsx      # Cards de estatísticas
│   ├── hooks/
│   │   ├── api.ts              # Hook que lê VITE_API_URL do ambiente
│   │   └── use-device-management.tsx  # Hook com toda a lógica de CRUD de dispositivos
│   ├── settings/
│   │   ├── danger-zone.tsx     # Ações destrutivas (limpar dados, excluir conta)
│   │   ├── label.tsx           # Label de campo
│   │   ├── notifications-tab.tsx
│   │   ├── privacy-tab.tsx
│   │   ├── profile-tab.tsx
│   │   ├── security-tab.tsx
│   │   └── tab.tsx             # Wrapper de aba
│   ├── theme/
│   │   ├── theme-context.tsx   # Contexto global do tema (claro/escuro)
│   │   └── theme-toggle.tsx    # Botão de alternância de tema
│   ├── background.tsx          # Animação de fundo (blobs)
│   └── header.tsx              # Cabeçalho global com avatar local
├── lib/
│   └── password-strength.ts    # Utilitário de força de senha (100% client-side)
├── pages/
│   ├── App.tsx                 # Roteador principal e controle de sessão
│   ├── home.tsx                # Dashboard principal
│   ├── login.tsx               # Tela de login
│   ├── register.tsx            # Tela de cadastro
│   └── settings.tsx            # Página de configurações
├── style/
│   └── index.css               # Estilos globais
└── main.tsx                    # Ponto de entrada da aplicação
```


## Configuração

### URL da API — Resolução dinâmica

O frontend resolve o endereço do backend seguindo esta prioridade:

1. **JSON de redirecionamento** (principal) — busca automaticamente a URL atual em:
   ```
   https://raw.githubusercontent.com/Project-axii/sistema-redirecionamento/main/sistema.json
   ```
   Isso permite usar túneis dinâmicos (como ngrok) sem precisar alterar o código: basta atualizar o JSON com o novo endereço.

2. **Variável de ambiente** `VITE_API_URL` (fallback) — usada quando o JSON não estiver acessível:
   ```bash
   cp .env.example .env
   # Edite o .env com a URL do seu backend
   ```

3. **Padrão local** — `http://localhost/tcc-axii/Project-axii-api` como último recurso.

> **Nunca comite o arquivo `.env`** — ele está no `.gitignore` e pode conter dados sensíveis.

### Endpoints utilizados

| Método | Caminho | Descrição |
|---|---|---|
| `POST` | `/api/auth/login.php` | Autenticação do usuário |
| `GET` | `/api/devices/list.php` | Listar dispositivos |
| `POST` | `/api/devices/create.php` | Cadastrar dispositivo |
| `POST` | `/api/devices/toggle.php` | Ligar/desligar dispositivo |
| `POST` | `/api/devices/update.php` | Atualizar status |
| `DELETE` | `/api/devices/delete.php` | Excluir dispositivo |
| `POST` | `/api/user/update_photo.php` | Atualizar foto de perfil |

A autenticação usa **JWT Bearer Token**, armazenado no `localStorage` (quando "Lembrar-me" está marcado) ou `sessionStorage` (sessão única).


## Como rodar localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- [npm](https://www.npmjs.com/) ou [pnpm](https://pnpm.io/)
- API PHP backend em execução (consulte o repositório `Project-axii-api`)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Project-axii/Project-Axii-Web.git
cd Project-Axii-Web

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com a URL da sua API
```

### Desenvolvimento

```bash
npm run dev
```

O servidor de desenvolvimento será iniciado em `http://localhost:5173`.

### Build de produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

### Pré-visualização da build

```bash
npm run preview
```


## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento com HMR |
| `npm run build` | Gera a build de produção |
| `npm run preview` | Pré-visualiza a build de produção localmente |
| `npm run lint` | Executa o ESLint em todo o projeto |


## Rotas da Aplicação

| Rota | Descrição | Protegida |
|---|---|---|
| `/login` | Tela de autenticação | Não |
| `/register` | Tela de cadastro de novo usuário | Não |
| `/` | Dashboard principal com visão de salas e dispositivos | Sim |
| `/settings` | Configurações de conta do usuário | Sim |

Rotas protegidas redirecionam para `/login` caso o usuário não esteja autenticado.


## Perfis de usuário

| Perfil | Descrição |
|---|---|
| `admin` | Administrador — acesso completo ao sistema |
| `professor` | Professor — controle dos dispositivos de sua sala |
| `gestor` | Gestor — visão geral e relatórios |


## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).
