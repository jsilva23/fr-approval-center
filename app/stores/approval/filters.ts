import { computed } from "vue";
import type { Ref } from "vue";
import type { ApprovalItem } from "~/types/approval";
import type { StatusFilter } from "./state";

export const createApprovalFilters = (
  approvals: Ref<ApprovalItem[]>,
  searchTerm: Ref<string>,
  statusFilter: Ref<StatusFilter>
) => {
  const filteredItems = computed(() => {
    const term = searchTerm.value.trim().toLowerCase();
    return approvals.value.filter((item) => {
      const matchesTerm =
        !term.length ||
        item.name.toLowerCase().includes(term) ||
        item.type.toLowerCase().includes(term);
      const matchesStatus =
        statusFilter.value === "ALL" || item.status === statusFilter.value;
      return matchesTerm && matchesStatus;
    });
  });

  const pendingCount = computed(
    () => approvals.value.filter((item) => item.status === "PENDING").length
  );
  const approvedCount = computed(
    () => approvals.value.filter((item) => item.status === "APPROVED").length
  );

  return { filteredItems, pendingCount, approvedCount };
};
