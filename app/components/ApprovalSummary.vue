<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  pending: number;
  approved: number;
  total: number;
}>();

const cards = computed(() => [
  {
    label: "Pendentes",
    value: props.pending,
  },
  {
    label: "Aprovados",
    value: props.approved,
  },
  {
    label: "Total",
    value: props.total,
  },
]);
</script>

<template>
  <div class="grid gap-4 md:grid-cols-3">
    <UCard v-for="card in cards" :key="card.label">
      <p class="text-sm text-gray-500">
        {{ card.label }}
      </p>
      <p class="text-3xl font-semibold text-emerald-600">
        {{ card.value }}
      </p>
    </UCard>
  </div>
</template>
