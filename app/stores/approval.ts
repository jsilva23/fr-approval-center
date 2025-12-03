import { computed, ref } from "vue";
import { defineStore } from "pinia";

export type ApprovalStatus = "PENDING" | "APPROVED";

export interface ApprovalItem {
  id: number;
  name: string;
  type: string;
  status: ApprovalStatus;
}

type StatusFilter = "ALL" | ApprovalStatus;

const defaultItems: ApprovalItem[] = [
  { id: 1, name: "Banco Aurora", type: "Conta digital PJ", status: "PENDING" },
  {
    id: 2,
    name: "Grupo Horizonte",
    type: "Cartão corporativo",
    status: "PENDING",
  },
  {
    id: 3,
    name: "Comércio Prisma",
    type: "Antecipação de recebíveis",
    status: "APPROVED",
  },
  {
    id: 4,
    name: "Cooperativa Atlas",
    type: "Financiamento agrícola",
    status: "APPROVED",
  },
];

export const useApprovalStore = defineStore("approval-center", () => {
  const approvals = ref<ApprovalItem[]>(
    defaultItems.map((item) => ({ ...item }))
  );
  const selectedIds = ref<number[]>([]);
  const searchTerm = ref("");
  const statusFilter = ref<StatusFilter>("ALL");

  const filteredItems = computed(() => {
    const term = searchTerm.value.trim().toLowerCase();
    return approvals.value.filter((item) => {
      const matchesTerm =
        term.length === 0 ||
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

  const isSelected = (id: number) => selectedIds.value.includes(id);

  const setSearchTerm = (term: string) => {
    searchTerm.value = term;
  };

  const setStatusFilter = (status: StatusFilter) => {
    statusFilter.value = status;
  };

  return {
    approvals,
    filteredItems,
    pendingCount,
    approvedCount,
    selectedIds,
    searchTerm,
    statusFilter,
    setSearchTerm,
    setStatusFilter,
    isSelected,
  };
});
