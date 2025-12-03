<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  selectedCount: number;
}>();

const emit = defineEmits<{
  clear: [];
  approve: [];
}>();

const hasSelection = computed(() => props.selectedCount > 0);
const selectedLabel = computed(
  () => `${props.selectedCount} item(s) selecionado(s)`
);

const handleClear = () => {
  emit("clear");
};

const handleApprove = () => {
  emit("approve");
};
</script>

<template>
  <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
    <p class="text-sm text-gray-500">
      {{ selectedLabel }}
    </p>
    <div class="flex flex-wrap gap-3">
      <UButton size="sm" variant="ghost" @click="handleClear">
        Limpar seleção
      </UButton>
      <UButton
        size="sm"
        icon="i-heroicons-check-circle"
        :disabled="!hasSelection"
        @click="handleApprove"
      >
        Aprovar selecionados
      </UButton>
    </div>
  </div>
</template>
