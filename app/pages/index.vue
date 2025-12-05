<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
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
  approveMany,
} = approvalStore;

const isConfirmModalOpen = ref(false);

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
  isConfirmModalOpen.value = true;
};

const closeConfirmModal = () => {
  isConfirmModalOpen.value = false;
};

const confirmApproveSelected = () => {
  if (!selectedIds.value.length) {
    return;
  }
  approveMany(selectedIds.value);
  closeConfirmModal();
};

onMounted(() => {
  initialize();
});
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-2">
      <h1 class="text-3xl font-semibold">
        Central de Aprovações
      </h1>
      <p class="text-gray-600 max-w-3xl">
        Visualize e aprove itens pendentes individualmente ou em massa.
      </p>
    </div>

    <ApprovalSummary
      :pending="pendingCount"
      :approved="approvedCount"
      :total="totalCount"
    />

    <UCard>
      <template #header>
        <ApprovalFilters
          :search-term="searchTerm"
          :status-filter="statusFilter"
          :status-options="statusOptions"
          @update:search-term="setSearchTerm"
          @update:status-filter="setStatusFilter"
        />
      </template>

      <div class="space-y-4">
        <ApprovalSelectionActions
          :selected-count="selectedIds.length"
          @clear="clearSelection"
          @approve="handleApproveSelected"
        />

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
              <p class="font-semibold">
                {{ row.original.name }}
              </p>
              <p class="text-sm text-gray-500">
                {{ row.original.type }}
              </p>
            </div>
          </template>

          <template #status-cell="{ row }">
            <UBadge
              :color="
                row.original.status === 'APPROVED' ? 'primary' : 'warning'
              "
              variant="soft"
            >
              {{ statusBadge(row.original.status).label }}
            </UBadge>
          </template>

          <template #actions-cell="{ row }">
            <UButton
              size="xs"
              :disabled="row.original.status === 'APPROVED'"
              @click="approvalStore.approveItem(row.original.id)"
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
    <ApprovalConfirmModal
      v-model:open="isConfirmModalOpen"
      :selected-count="selectedIds.length"
      @cancel="closeConfirmModal"
      @confirm="confirmApproveSelected"
    />
  </div>
</template>
