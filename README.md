# FR Approval Center

Aplicação Nuxt 3 que simula uma central de aprovações corporativas. O usuário consegue pesquisar items, filtrar por status, selecionar aprovações em massa e confirmar ações com feedback visual consistente.

## Visão geral funcional

- Listagem responsiva de empresas e produtos financeiros com estados `PENDING` e `APPROVED`.
- Busca textual que cobre `name` e `type`, e filtro de status com opção “Todos”.
- Seleção individual e em massa com checkbox tri-state no cabeçalho, confirmação modal e limpeza rápida.
- Sumário agregado (pendentes/aprovados/total) atualizado em tempo real.
- Persistência local das aprovações aprovadas para não perder contexto ao recarregar a página.

## Stack e dependências principais

- **Nuxt 3 + Vue 3 (Composition API)** para roteamento automático, SSR opcional e padrão reativo moderno (`app/app.vue`, `app/pages/index.vue`).
- **Pinia (`app/stores/approval`)** como camada de estado global tipada.
- **Nuxt UI (`@nuxt/ui`)** para componentes estilizados (`UCard`, `UTable`, `UButton`, `UModal`, etc.).
- **TanStack Table types** (`ColumnDef` em `app/pages/index.vue`) para tipar colunas e permitir evoluções futuras (sorting, pagination) sem refatoração.
- **LocalStorage** via utilitário `app/utils/approvalPersistence.ts` para hidratar/persistir aprovações aprovadas.

## Fluxo de dados (alto nível)

1. Ao montar `app/pages/index.vue`, `useApprovalStore.initialize()` tenta carregar dados persistidos; se inexistentes, clona `app/data/defaultApprovalItems.ts`.
2. Os componentes leem apenas referências reativas (via `storeToRefs`), evitando cópias manuais.
3. A filtragem (`searchTerm`, `statusFilter`) gera `filteredItems`, `pendingCount` e `approvedCount` computados.
4. A seleção (composable `useApprovalSelection.ts`) deriva `selectableIds`, estado do checkbox do cabeçalho e ações para toggles individuais/massivos.
5. Ao aprovar itens (`approveItem` ou `approveMany`) os dados são atualizados, persistidos no `localStorage` e a seleção é sincronizada (ids removidos).

## Arquitetura detalhada

### Layout e páginas
- `app/app.vue` encapsula a aplicação dentro de `UApp` e aplica `NuxtLayout`/`NuxtPage`.
- `app/layouts/default.vue` aplica `UContainer` e espaçamento consistente para todas as páginas.
- `app/pages/index.vue` concentra o fluxo da Central: importa a store, chama o composable de seleção, define colunas da tabela e orquestra componentes de domínio.

### Componentes de domínio (`app/components`)
- `ApprovalSummary.vue`: mostra os contadores agregados em cards.
- `ApprovalFilters.vue`: input de busca + select de status com `v-model` customizado.
- `ApprovalSelectionActions.vue`: CTA para limpar/aprovar seleção; mostra contagem atual.
- `ApprovalConfirmModal.vue`: modal controlada via `v-model:open` para confirmação em massa.

### Store de aprovações (`app/stores/approval`)

| Parte | Descrição |
| --- | --- |
| `state.ts` | Define `ApprovalState` (aprovações, seleção, filtros, flag `initialized`). Inicializa com `cloneDefaultApprovals()`. |
| `filters.ts` | Computed `filteredItems`, `pendingCount`, `approvedCount` baseados em `searchTerm`/`statusFilter`. |
| `selection.ts` | Funções puras de seleção (`toggleSelection`, `clearSelection`, `selectMany`). |
| `actions.ts` | Fluxos de negócio: `initialize`, `setSearchTerm`, `setStatusFilter`, `approveItem`, `approveMany`. Responsável por persistir dados e manter a seleção coerente. |
| `index.ts` | Compoõe todas as partes via `defineStore`, expondo refs e ações já preparados para os componentes. |

### Composable `useApprovalSelection.ts`

Centraliza regras específicas da tabela:
- Deriva `selectableIds` (apenas itens pendentes no filtro atual) e o estado do checkbox de cabeçalho (`false` / `true` / `"indeterminate"`).
- Expõe `toggleSelectAll`, `toggleRowSelection(id, isDisabled)` para acoplamento mínimo com `UTable`.
- Mantém o estado do modal (`isConfirmModalOpen`) e executa `approveMany` após confirmação, garantindo reset da seleção.

### Persistência e dados mockados
- `app/data/defaultApprovalItems.ts` contém a seed com 16 registros. `cloneDefaultApprovals()` garante que o store receba cópias novas.
- `app/utils/approvalPersistence.ts` salva/carrega do `localStorage` (`approval-center-items`) somente no cliente (`import.meta.client`). Também sanitiza status para evitar valores inválidos e captura erros de parsing.

## Decisões técnicas (motivação)

- **Camadas separadas (state/actions/filters/selection)** deixam o store mais testável e reutilizável (cada parte recebe apenas as refs necessárias).
- **Composable para seleção** evita duplicar lógica no componente da página e permite evoluir a UX da tabela independentemente da store.
- **TanStack types** garantem alinhamento com futuras integrações do próprio `UTable`, mantendo type safety para `ApprovalItem`.
- **Persistência otimista**: após aprovar, o item é atualizado no array local e salvo imediatamente, evitando round-trips (não há backend real neste cenário).
- **Nuxt UI** reduz custo de manutenção de design system e já traz acessibilidade (foco, aria) pronta.

## Estrutura de pastas

```
app/
├─ app.vue                  # Shell raiz (UApp + layouts)
├─ components/              # Componentes de apresentação e interações
├─ composables/             # Lógicas reutilizáveis (ex.: seleção)
├─ data/                    # Seeds/mock data
├─ layouts/                 # Layouts Nuxt
├─ pages/                   # Rotas (index.vue = dashboard principal)
├─ stores/                  # Stores Pinia particionados por domínio
├─ types/                   # Tipos compartilhados (ApprovalItem/Status)
├─ utils/                   # Serviços utilitários (persistência, etc.)
└─ assets/css/main.css      # Tailwind + Nuxt UI base
public/                     # Assets estáticos
nuxt.config.ts              # Configuração Nuxt/módulos/css/routeRules
package.json                # Scripts e dependências
```

## Scripts e desenvolvimento

| Comando | Descrição |
| --- | --- |
| `npm install` | Instala dependências (executa `nuxt prepare` no pós-install). |
| `npm run dev` | Ambiente de desenvolvimento com HMR em `http://localhost:3000`. |
| `npm run build` | Gera build otimizada para produção. |
| `npm run preview` | Servidor local para inspecionar a build resultante. |
| `npm run lint` | Executa eslint (config via `eslint.config.mjs` e módulo `@nuxt/eslint`). |
| `npm run typecheck` | Usa `nuxt typecheck`/`vue-tsc` para validar tipos. |

Requisitos mínimos: Node 18+ e npm 9+. Adapte os comandos conforme o gerenciador preferido (pnpm/yarn).

## Como evoluir

1. **Conectar a um backend real**: trocar a seed estática por chamadas em `asyncData`/`server routes`, mantendo a store como cache.
2. **Novos filtros ou colunas**: centralizar opções em `ApprovalFilters.vue` e usar os tipos da TanStack para garantir consistência.
3. **Estados adicionais**: basta ampliar `ApprovalStatus` em `app/types/approval.ts`, ajustar `statusBadgeVariants` e sanitização em `approvalPersistence`.
4. **Paginação/ordenação**: reutilizar `UTable` com recursos do TanStack (já usamos `ColumnDef`, o que facilita adicionar `sortingFn`).
5. **Testes unitários**: `createSelectionActions` e `createApprovalActions` são funções puras que podem ser testadas com Vitest ou Jest sem precisar montar Vue components.

Com esta documentação você pode navegar pelas decisões técnicas, entender como os dados fluem entre componentes e stores, e evoluir a central de aprovações com segurança.
