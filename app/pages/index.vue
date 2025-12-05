<script setup lang="ts">
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import type { ColumnDef } from "@tanstack/vue-table";
import {
  useApprovalStore,
  type ApprovalItem,
  type ApprovalStatus,
} from "~/stores/approval";
import { useApprovalSelection } from "~/composables/useApprovalSelection";

const approvalStore = useApprovalStore();
const {
  approvals,
  filteredItems,
  pendingCount,
  approvedCount,
  searchTerm,
  statusFilter,
} = storeToRefs(approvalStore);
const {
  initialize,
  setSearchTerm,
  setStatusFilter,
  isSelected,
  clearSelection,
} = approvalStore;
const {
  selectedIds,
  selectableIds,
  headerCheckboxState,
  toggleSelectAll,
  toggleRowSelection,
  handleApproveSelected,
  isConfirmModalOpen,
  closeConfirmModal,
  confirmApproveSelected,
} = useApprovalSelection(approvalStore);

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
