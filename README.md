# FR Approval Center

Aplicação Nuxt 3 que simula uma central de aprovações, permitindo filtrar, selecionar e aprovar múltiplos itens de maneira rápida.

## Decisões técnicas

- **Nuxt 3 + Vue 3 Composition API** – a Composition API facilita o compartilhamento de lógica reativa entre componentes (filtros, seleção, persistência). Nuxt entrega SSR opcional, roteamento automático em `app/pages` e integrações prontas para Vue 3.
- **Pinia** – estado global simples e tipado para armazenar aprovações, filtros e seleção. Pinia integra bem com Nuxt (auto-imports) e facilita persistência no `localStorage`.
- **TanStack Table (ColumnDef)** – usamos os tipos da TanStack Table para descrever colunas da tabela (`ColumnDef<ApprovalItem>`), garantindo segurança de tipos e abrindo espaço para evoluir com recursos como ordenação/agrupamento sem refatorações profundas.
- **Nuxt UI (UCard, UTable, UModal, etc.)** – acelera a criação de componentes responsivos com tema consistente e acessível.
- **Persistência em `localStorage`** – mantém o estado de aprovações/seleções no navegador, evitando perda de contexto ao recarregar a página.

## Estrutura do projeto

```
.
├─ app/
│  ├─ components/          # Componentes UI isolados (filtros, sumário, modal)
│  ├─ pages/               # Páginas Nuxt; `index.vue` contém o fluxo principal
│  └─ stores/              # Stores Pinia (ex.: `approval.ts`)
├─ public/                 # Assets estáticos servidos como estão
├─ nuxt.config.ts          # Configuração Nuxt e módulos
├─ package.json            # Scripts NPM e dependências
└─ README.md
```

## Requisitos

- Node.js 18+ (recomendado)
- npm 9+ (ou pnpm/yarn se preferir adaptar os comandos)

## Instalação

Instale as dependências:

```bash
npm install
```

## Execução em desenvolvimento

Inicie o servidor em `http://localhost:3000`:

```bash
npm run dev
```

O Nuxt oferece hot module replacement; alterações em `app/` são aplicadas automaticamente.

## Build e preview

Gerar build de produção:

```bash
npm run build
```

Fazer preview local da build:

```bash
npm run preview
```

Pronto! Com isso você tem um panorama das decisões técnicas, estrutura e passos para rodar o projeto.
