<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import type { ColumnDef } from "@tanstack/vue-table";
import {
  useApprovalStore,
  type ApprovalItem,
  type ApprovalStatus,
} from "~/stores/approval";

type FilterStatus = "ALL" | ApprovalStatus;

const approvalStore = useApprovalStore();
const { approvals, selectedIds, searchTerm, statusFilter } =
  storeToRefs(approvalStore);

const columns: ColumnDef<ApprovalItem>[] = [
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

const filteredApprovals = computed(() => {
  const normalizedSearch = searchTerm.value.trim().toLowerCase();

  return approvals.value.filter((approval) => {
    const matchesStatus =
      statusFilter.value === "ALL" || approval.status === statusFilter.value;
    const matchesSearch =
      !normalizedSearch ||
      approval.name.toLowerCase().includes(normalizedSearch) ||
      approval.type.toLowerCase().includes(normalizedSearch);

    return matchesStatus && matchesSearch;
  });
});

const summaryCounts = computed(() => {
  const pending = approvals.value.filter(
    (approval) => approval.status === "PENDING"
  ).length;
  const approved = approvals.value.filter(
    (approval) => approval.status === "APPROVED"
  ).length;

  return {
    pending,
    approved,
    total: approvals.value.length,
  };
});

const selectableIds = computed(() =>
  filteredApprovals.value
    .filter((approval) => approval.status !== "APPROVED")
    .map((approval) => approval.id)
);

const headerCheckboxState = computed(() => {
  if (!selectableIds.value.length) {
    return false;
  }

  const selectedInView = selectableIds.value.filter((id) =>
    selectedIds.value.includes(id)
  ).length;

  if (!selectedInView) {
    return false;
  }

  if (selectedInView === selectableIds.value.length) {
    return true;
  }

  return "indeterminate";
});

const selectedItemsLabel = computed(
  () => `${selectedIds.value.length} item(s) selecionado(s)`
);

const toggleSelectAll = () => {
  if (!selectableIds.value.length) {
    return;
  }

  const selectableSet = new Set(selectableIds.value);
  const selectedInView = selectedIds.value.filter((id) =>
    selectableSet.has(id)
  );

  if (selectedInView.length === selectableIds.value.length) {
    selectedIds.value = selectedIds.value.filter(
      (id) => !selectableSet.has(id)
    );
  } else {
    selectedIds.value = Array.from(
      new Set([...selectedIds.value, ...selectableIds.value])
    );
  }
};

const toggleRowSelection = (id: number, isDisabled: boolean) => {
  if (isDisabled) {
    return;
  }

  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter(
      (selectedId) => selectedId !== id
    );
    return;
  }

  selectedIds.value = [...selectedIds.value, id];
};

const clearSelection = () => {
  selectedIds.value = [];
};
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
        <p class="text-3xl font-semibold text-emerald-600">
          {{ summaryCounts.pending }}
        </p>
      </UCard>
      <UCard>
        <p class="text-sm text-gray-500">Aprovados</p>
        <p class="text-3xl font-semibold text-emerald-600">
          {{ summaryCounts.approved }}
        </p>
      </UCard>
      <UCard>
        <p class="text-sm text-gray-500">Total</p>
        <p class="text-3xl font-semibold text-emerald-600">
          {{ summaryCounts.total }}
        </p>
      </UCard>
    </div>

    <UCard>
      <template #header>
        <div class="flex flex-col gap-4 md:flex-row md:items-end">
          <UInput
            icon="i-heroicons-magnifying-glass-20-solid"
            placeholder="Buscar por nome ou tipo"
            v-model="searchTerm"
          />
          <USelect
            placeholder="Status"
            class="md:w-56"
            v-model="statusFilter"
            :items="statusOptions"
          />
        </div>
      </template>

      <div class="space-y-4">
        <div
          class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
        >
          <p class="text-sm text-gray-500">
            {{ selectedItemsLabel }}
          </p>
          <div class="flex flex-wrap gap-3">
            <UButton size="sm" variant="ghost" color="gray" @click="clearSelection">
              Limpar seleção
            </UButton>
            <UButton size="sm" icon="i-heroicons-check-circle">
              Aprovar selecionados
            </UButton>
          </div>
        </div>

        <UTable :columns="columns" :data="filteredApprovals">
          <template #select-header>
            <div class="flex justify-center">
              <UCheckbox
                :model-value="headerCheckboxState"
                :disabled="!selectableIds.length"
                @update:model-value="toggleSelectAll"
              />
            </div>
          </template>

          <template #select-cell="{ row }">
            <div class="flex justify-center">
              <UCheckbox
                :model-value="selectedIds.includes(row.original.id)"
                :disabled="row.original.status === 'APPROVED'"
                @update:model-value="() =>
                  toggleRowSelection(
                    row.original.id,
                    row.original.status === 'APPROVED'
                  )"
              />
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
