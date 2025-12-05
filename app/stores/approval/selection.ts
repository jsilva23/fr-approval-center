import type { Ref } from "vue";

export const createSelectionActions = (selectedIds: Ref<number[]>) => {
  const isSelected = (id: number) => selectedIds.value.includes(id);

  const toggleSelection = (id: number) => {
    if (isSelected(id)) {
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

  const selectMany = (ids: number[]) => {
    selectedIds.value = [...new Set(ids)];
  };

  return {
    isSelected,
    toggleSelection,
    clearSelection,
    selectMany,
  };
};
