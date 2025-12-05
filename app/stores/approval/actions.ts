import type { Ref } from "vue";
import type { ApprovalItem } from "~/types/approval";
import type { StatusFilter } from "./state";
import {
  loadPersistedApprovals,
  persistApprovals,
} from "~/utils/approvalPersistence";

export const createApprovalActions = (
  approvals: Ref<ApprovalItem[]>,
  selectedIds: Ref<number[]>,
  searchTerm: Ref<string>,
  statusFilter: Ref<StatusFilter>,
  initialized: Ref<boolean>
) => {
  const initialize = () => {
    if (initialized.value) {
      return;
    }
    const stored = loadPersistedApprovals();
    if (stored) {
      approvals.value = stored;
    }
    initialized.value = true;
  };

  const setSearchTerm = (term: string) => {
    searchTerm.value = term;
  };

  const setStatusFilter = (status: StatusFilter) => {
    statusFilter.value = status;
  };

  const approveItem = (id: number) => {
    const item = approvals.value.find((approval) => approval.id === id);
    if (!item || item.status === "APPROVED") {
      return;
    }
    item.status = "APPROVED";
    persistApprovals(approvals.value);
    selectedIds.value = selectedIds.value.filter(
      (selectedId) => selectedId !== id
    );
  };

  const approveMany = (ids: number[]) => {
    const targetIds = new Set(ids);
    approvals.value = approvals.value.map((approval) =>
      targetIds.has(approval.id) ?
          { ...approval, status: "APPROVED" } :
        approval
    );
    persistApprovals(approvals.value);
    selectedIds.value = selectedIds.value.filter(
      (selectedId) => !targetIds.has(selectedId)
    );
  };

  return {
    initialize,
    setSearchTerm,
    setStatusFilter,
    approveItem,
    approveMany,
  };
};
