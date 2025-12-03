<script setup lang="ts">
import { ref } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";

type ApprovalStatus = "PENDING" | "APPROVED";
type FilterStatus = "ALL" | ApprovalStatus;

type ApprovalRow = {
  id: number;
  name: string;
  type: string;
  status: ApprovalStatus;
};

const approvalRequests = ref<ApprovalRow[]>([
  { id: 1, name: "Banco Aurora", type: "Conta digital PJ", status: "PENDING" },
  {
    id: 2,
    name: "Grupo Horizonte",
    type: "Cartão corporativo",
    status: "PENDING",
  },
  {
    id: 3,
    name: "Comércio Prisma",
    type: "Antecipação de recebíveis",
    status: "APPROVED",
  },
  {
    id: 4,
    name: "Cooperativa Atlas",
    type: "Financiamento agrícola",
    status: "APPROVED",
  },
]);

const columns: ColumnDef<ApprovalRow>[] = [
  {
    id: "select",
    header: "",
    enableSorting: false,
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Empresa",
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    header: "Ações",
    enableSorting: false,
  },
];

const statusOptions: { label: string; value: FilterStatus }[] = [
  { label: "Todos", value: "ALL" },
  { label: "Pendentes", value: "PENDING" },
  { label: "Aprovados", value: "APPROVED" },
];

const statusBadgeVariants: Record<
  ApprovalStatus,
  { label: string; color: string }
> = {
  PENDING: { label: "Pendente", color: "amber" },
  APPROVED: { label: "Aprovado", color: "emerald" },
};

const statusBadge = (status: ApprovalStatus) =>
  statusBadgeVariants[status] ?? { label: status, color: "gray" };
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-2">
      <h1 class="text-3xl font-semibold text-gray-900">
        Central de Aprovações
      </h1>
      <p class="text-gray-600 max-w-3xl">
        Visualize e aprove itens pendentes individualmente ou em massa.
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <UCard>
        <p class="text-sm text-gray-500">Pendentes</p>
        <p class="text-3xl font-semibold text-emerald-600">3</p>
      </UCard>
      <UCard>
        <p class="text-sm text-gray-500">Aprovados</p>
        <p class="text-3xl font-semibold text-emerald-600">2</p>
      </UCard>
      <UCard>
        <p class="text-sm text-gray-500">Total</p>
        <p class="text-3xl font-semibold text-emerald-600">1</p>
      </UCard>
    </div>

    <UCard>
      <template #header>
        <div class="flex flex-col gap-4 md:flex-row md:items-end">
          <UInput
            icon="i-heroicons-magnifying-glass-20-solid"
            placeholder="Buscar por nome ou tipo"
          />
          <USelect
            placeholder="Status"
            class="md:w-56"
            :items="statusOptions"
          />
        </div>
      </template>

      <div class="space-y-4">
        <div
          class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
        >
          <p class="text-sm text-gray-500">1 item(s) selecionado(s)</p>
          <div class="flex flex-wrap gap-3">
            <UButton size="sm" variant="ghost" color="gray">
              Limpar selecao
            </UButton>
            <UButton size="sm" icon="i-heroicons-check-circle">
              Aprovar selecionados
            </UButton>
          </div>
        </div>

        <UTable :columns="columns" :data="approvalRequests">
          <template #select-header>
            <div class="flex justify-center">
              <UCheckbox />
            </div>
          </template>

          <template #select-cell="{ row }">
            <div class="flex justify-center">
              <UCheckbox :disabled="row.original.status === 'APPROVED'" />
            </div>
          </template>

          <template #name-cell="{ row }">
            <div>
              <p class="font-semibold text-gray-900">
                {{ row.original.name }}
              </p>
              <p class="text-sm text-gray-500">
                {{ row.original.type }}
              </p>
            </div>
          </template>

          <template #status-cell="{ row }">
            <UBadge
              :color="statusBadge(row.original.status).color"
              variant="soft"
            >
              {{ statusBadge(row.original.status).label }}
            </UBadge>
          </template>

          <template #actions-cell="{ row }">
            <UButton
              size="xs"
              color="emerald"
              :disabled="row.original.status === 'APPROVED'"
            >
              Aprovar
            </UButton>
          </template>

          <template #empty>
            <div class="py-10 text-center text-sm text-gray-500">
              Nenhum item encontrado.
            </div>
          </template>
        </UTable>
      </div>
    </UCard>
  </div>
</template>
