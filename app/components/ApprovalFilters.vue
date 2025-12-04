<script setup lang="ts">
import type { ApprovalStatus } from "~/stores/approval";

type StatusOption = { label: string; value: ApprovalStatus | "ALL" };

const props = defineProps<{
  searchTerm: string;
  statusFilter: ApprovalStatus | "ALL";
  statusOptions: StatusOption[];
}>();

const emit = defineEmits<{
  "update:search-term": [value: string];
  "update:status-filter": [value: ApprovalStatus | "ALL"];
}>();

const handleSearch = (value: string) => {
  emit("update:search-term", value);
};

const handleStatusChange = (value: ApprovalStatus | "ALL") => {
  emit("update:status-filter", value);
};
</script>

<template>
  <div class="flex flex-col gap-4 md:flex-row md:items-end">
    <UInput
      icon="i-heroicons-magnifying-glass-20-solid"
      placeholder="Buscar por nome ou tipo"
      :model-value="searchTerm"
      @update:model-value="handleSearch"
    />
    <USelect
      placeholder="Status"
      class="md:w-56"
      :model-value="statusFilter"
      :items="statusOptions"
      @update:model-value="handleStatusChange"
    />
  </div>
</template>
