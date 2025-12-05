<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  selectedCount: number;
}>();

const isOpen = defineModel<boolean>("open", { required: true });

const emit = defineEmits<{
  cancel: [];
  confirm: [];
}>();

const hasSelection = computed(() => props.selectedCount > 0);

const handleCancel = () => {
  emit("cancel");
  isOpen.value = false;
};

const handleConfirm = () => {
  if (!hasSelection.value) {
    return;
  }
  emit("confirm");
};
</script>

<template>
  <UModal v-model:open="isOpen">
    <template #content>
      <div class="space-y-4 p-4 sm:p-6">
        <div class="space-y-2">
          <h3 class="text-lg font-semibold">
            Confirmar aprovação
          </h3>
          <p class="text-gray-600">
            Deseja realmente aprovar {{ props.selectedCount }} item(s)
            selecionado(s)?
          </p>
        </div>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" color="neutral" @click="handleCancel">
            Cancelar
          </UButton>
          <UButton
            color="primary"
            icon="i-heroicons-check-circle"
            :disabled="!hasSelection"
            @click="handleConfirm"
          >
            Confirmar
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
