import { defineStore } from "pinia";
import { createApprovalState } from "./state";
import { createApprovalFilters } from "./filters";
import { createSelectionActions } from "./selection";
import { createApprovalActions } from "./actions";

export const useApprovalStore = defineStore("approval-center", () => {
  const state = createApprovalState();
  const filters = createApprovalFilters(
    state.approvals,
    state.searchTerm,
    state.statusFilter
  );
  const selection = createSelectionActions(state.selectedIds);
  const actions = createApprovalActions(
    state.approvals,
    state.selectedIds,
    state.searchTerm,
    state.statusFilter,
    state.initialized
  );

  return {
    approvals: state.approvals,
    selectedIds: state.selectedIds,
    searchTerm: state.searchTerm,
    statusFilter: state.statusFilter,
    ...filters,
    ...selection,
    ...actions,
  };
});
