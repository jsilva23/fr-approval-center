<script setup lang="ts">
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import type { ColumnDef } from "@tanstack/vue-table";
import {
  useApprovalStore,
  type ApprovalItem,
  type ApprovalStatus,
} from "~/stores/approval";

const approvalStore = useApprovalStore();
const {
  approvals,
  filteredItems,
  pendingCount,
  approvedCount,
  selectedIds,
  searchTerm,
  statusFilter,
} = storeToRefs(approvalStore);
const {
  initialize,
  setSearchTerm,
  setStatusFilter,
  isSelected,
  toggleSelection,
  clearSelection,
  approveItem,
  approveMany,
} = approvalStore;

onMounted(() => {
  initialize();
});

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

const statusOptions: { label: string; value: ApprovalStatus | "ALL" }[] = [
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

const totalCount = computed(() => approvals.value.length);

const selectableIds = computed(() =>
  filteredItems.value
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
  toggleSelection(id);
};

const handleApproveSelected = () => {
  if (!selectedIds.value.length) {
    return;
  }
  approveMany(selectedIds.value);
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
          {{ pendingCount }}
        </p>
      </UCard>
      <UCard>
        <p class="text-sm text-gray-500">Aprovados</p>
        <p class="text-3xl font-semibold text-emerald-600">
          {{ approvedCount }}
        </p>
      </UCard>
      <UCard>
        <p class="text-sm text-gray-500">Total</p>
        <p class="text-3xl font-semibold text-emerald-600">
          {{ totalCount }}
        </p>
      </UCard>
    </div>

    <UCard>
      <template #header>
        <div class="flex flex-col gap-4 md:flex-row md:items-end">
          <UInput
            icon="i-heroicons-magnifying-glass-20-solid"
            placeholder="Buscar por nome ou tipo"
            :model-value="searchTerm"
            @update:model-value="setSearchTerm"
          />
          <USelect
            placeholder="Status"
            class="md:w-56"
            :model-value="statusFilter"
            :items="statusOptions"
            @update:model-value="setStatusFilter"
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
            <UButton
              size="sm"
              variant="ghost"
              color="gray"
              @click="clearSelection"
            >
              Limpar seleção
            </UButton>
            <UButton
              size="sm"
              icon="i-heroicons-check-circle"
              :disabled="!selectedIds.length"
              @click="handleApproveSelected"
            >
              Aprovar selecionados
            </UButton>
          </div>
        </div>

        <UTable :columns="columns" :data="filteredItems">
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
                :model-value="isSelected(row.original.id)"
                :disabled="row.original.status === 'APPROVED'"
                @update:model-value="
                  () =>
                    toggleRowSelection(
                      row.original.id,
                      row.original.status === 'APPROVED'
                    )
                "
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
              :disabled="row.original.status === 'APPROVED'"
              @click="store.approveItem(row.id)"
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
