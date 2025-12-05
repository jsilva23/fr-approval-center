import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useApprovalStore } from "~/stores/approval";

export const useApprovalSelection = (
  approvalStore = useApprovalStore()
) => {
  const { filteredItems, selectedIds } = storeToRefs(approvalStore);
  const { toggleSelection, approveMany } = approvalStore;

  const isConfirmModalOpen = ref(false);

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

  return {
    selectedIds,
    selectableIds,
    headerCheckboxState,
    toggleSelectAll,
    toggleRowSelection,
    handleApproveSelected,
    isConfirmModalOpen,
    closeConfirmModal,
    confirmApproveSelected,
  };
};
