# FR Approval Center

Uma aplicação de central de aprovações corporativas construída com Nuxt 3. Aqui você pode pesquisar, filtrar e aprovar items em lote de forma rápida e intuitiva.

## O que a aplicação faz

A ideia é simples: você tem uma lista de empresas e produtos financeiros que precisam ser aprovados. A aplicação te deixa:

- Ver todos os items com seus status (`PENDING` ou `APPROVED`)
- Buscar por nome ou tipo
- Filtrar por status específico ou ver todos
- Selecionar vários items de uma vez e aprovar em massa
- Acompanhar quantos items estão pendentes ou já aprovados
- Manter suas aprovações salvas mesmo depois de recarregar a página

## Tecnologias usadas

Escolhemos ferramentas modernas que facilitam a manutenção e evolução do projeto:

- **Nuxt 3 + Vue 3** - Framework principal com Composition API
- **Pinia** - Gerenciamento de estado global
- **Nuxt UI** - Componentes prontos e estilizados
- **TanStack Table** - Tipos para a tabela (facilita adicionar ordenação depois)
- **LocalStorage** - Salva suas aprovações no navegador

## Como funciona por dentro

### Quando você abre a aplicação

1. A store carrega os dados salvos no navegador (se existirem)
2. Se for a primeira vez, ela usa uma lista padrão de 16 items
3. Todos os componentes reagem automaticamente a mudanças nos dados
4. Suas buscas e filtros atualizam a lista em tempo real

### Estrutura do código

Organizamos o código em camadas para facilitar a manutenção:

**Páginas e Layout**

- `app/app.vue` - Ponto de entrada da aplicação
- `app/layouts/default.vue` - Layout padrão com espaçamento consistente
- `app/pages/index.vue` - Página principal da central de aprovações

**Componentes** (`app/components/`)

- `ApprovalSummary.vue` - Cards com contadores de pendentes/aprovados
- `ApprovalFilters.vue` - Campo de busca e filtro de status
- `ApprovalSelectionActions.vue` - Botões para limpar ou aprovar seleção
- `ApprovalConfirmModal.vue` - Modal de confirmação para aprovações em massa

**Store de aprovações** (`app/stores/approval/`)

A store é dividida em partes menores e focadas:

- `state.ts` - Estado inicial (items, seleção, filtros)
- `filters.ts` - Lógica de filtragem e contadores
- `selection.ts` - Funções para selecionar/desmarcar items
- `actions.ts` - Ações principais (aprovar, filtrar, etc.)
- `index.ts` - Junta tudo e expõe para os componentes

**Composable** (`app/composables/`)

- `useApprovalSelection.ts` - Lógica da seleção de items na tabela (checkbox do header, selecionar todos, etc.)

**Utilitários e dados**

- `app/data/defaultApprovalItems.ts` - Lista inicial de 16 items
- `app/utils/approvalPersistence.ts` - Salva e carrega dados do localStorage

## Por que fizemos assim

**Separação em camadas**: Cada arquivo tem uma responsabilidade clara. Isso facilita encontrar bugs e adicionar features.

**Composable para seleção**: Toda a lógica de marcar/desmarcar checkboxes fica em um só lugar, reutilizável.

**Tipos do TanStack**: Preparamos a tabela para evoluir facilmente com ordenação e paginação no futuro.

**Salvamento automático**: Quando você aprova um item, ele já é salvo instantaneamente. Sem espera.

**Nuxt UI**: Componentes prontos que já vêm com acessibilidade e são fáceis de customizar.

## Estrutura de pastas

```
app/
├─ app.vue                  # Raiz da aplicação
├─ components/              # Componentes visuais
├─ composables/             # Lógicas reutilizáveis
├─ data/                    # Dados iniciais (mock)
├─ layouts/                 # Layouts das páginas
├─ pages/                   # Rotas (index = página principal)
├─ stores/                  # Estado global (Pinia)
├─ types/                   # Definições de tipos TypeScript
├─ utils/                   # Funções auxiliares
└─ assets/css/main.css      # Estilos globais
```
### Rodar o projecto localmente

**Clonar o repositorio**

## Comandos disponíveis

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Gerar build de produção
npm run build

# Ver a build localmente
npm run preview

# Verificar código
npm run lint

# Verificar tipos TypeScript
npm run typecheck
```

**Requisitos**: Node 18+ e npm 9+ (Eu uso node 22)

## Ideias para o futuro

Algumas coisas que seriam legais de adicionar:

1. **Backend real** - Trocar os dados mockados por uma API de verdade
2. **Mais filtros** - Adicionar filtro por data, empresa específica, etc.
3. **Novos status** - Além de pendente/aprovado, ter "rejeitado", "em análise", etc.
4. **Ordenação** - Clicar nas colunas para ordenar a tabela
5. **Paginação** - Dividir em páginas quando houver muitos items
6. **Testes** - Adicionar testes unitários para as funções principais🚀

# Link do projecto
[https://fr-approval-center.vercel.app/](https://fr-approval-center.vercel.app/)
