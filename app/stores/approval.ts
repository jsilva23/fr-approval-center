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

const STORAGE_KEY = "approval-center-items";

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
  // more 15 items
  { id: 5, name: "Indústria Sol", type: "Conta digital PJ", status: "PENDING" },
  {
    id: 6,
    name: "Transportes Vega",
    type: "Cartão corporativo",
    status: "PENDING",
  },
  {
    id: 7,
    name: "Loja Prisma",
    type: "Antecipação de recebíveis",
    status: "APPROVED",
  },
  {
    id: 8,
    name: "Fazenda Aurora",
    type: "Financiamento agrícola",
    status: "APPROVED",
  },
  { id: 9, name: "TechNova", type: "Conta digital PJ", status: "PENDING" },
  {
    id: 10,
    name: "Logística Delta",
    type: "Cartão corporativo",
    status: "PENDING",
  },
  {
    id: 11,
    name: "Varejo Prisma",
    type: "Antecipação de recebíveis",
    status: "APPROVED",
  },
  {
    id: 12,
    name: "Agropecuária Sol",
    type: "Financiamento agrícola",
    status: "APPROVED",
  },
  {
    id: 13,
    name: "Construtora Vega",
    type: "Conta digital PJ",
    status: "PENDING",
  },
  {
    id: 14,
    name: "Serviços Atlas",
    type: "Cartão corporativo",
    status: "PENDING",
  },
  {
    id: 15,
    name: "Comércio Delta",
    type: "Antecipação de recebíveis",
    status: "APPROVED",
  },
  {
    id: 16,
    name: "Fazenda Horizonte",
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
  const initialized = ref(false);

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

  const persist = () => {
    if (!import.meta.client) {
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(approvals.value));
  };

  const loadFromStorage = () => {
    if (!import.meta.client) {
      return;
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }
    try {
      const parsed = JSON.parse(raw) as ApprovalItem[];
      if (Array.isArray(parsed)) {
        approvals.value = parsed.map((item) => ({
          id: item.id,
          name: item.name,
          type: item.type,
          status: item.status === "APPROVED" ? "APPROVED" : "PENDING",
        }));
      }
    } catch (error) {
      console.warn("Erro ao carregar dados do localStorage", error);
    }
  };

  const initialize = () => {
    if (initialized.value) {
      return;
    }
    loadFromStorage();
    initialized.value = true;
  };

  const setSearchTerm = (term: string) => {
    searchTerm.value = term;
  };

  const setStatusFilter = (status: StatusFilter) => {
    statusFilter.value = status;
  };

  const toggleSelection = (id: number) => {
    if (isSelected(id)) {
      selectedIds.value = selectedIds.value.filter(
        (selectedId) => selectedId !== id
      );
    } else {
      selectedIds.value = [...selectedIds.value, id];
    }
  };

  const clearSelection = () => {
    selectedIds.value = [];
  };

  const selectMany = (ids: number[]) => {
    selectedIds.value = [...new Set(ids)];
  };

  const approveItem = (id: number) => {
    const item = approvals.value.find((approval) => approval.id === id);
    if (!item || item.status === "APPROVED") {
      return;
    }
    item.status = "APPROVED";
    persist();
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
    persist();
    selectedIds.value = selectedIds.value.filter(
      (selectedId) => !targetIds.has(selectedId)
    );
  };

  return {
    approvals,
    filteredItems,
    pendingCount,
    approvedCount,
    selectedIds,
    searchTerm,
    statusFilter,
    initialize,
    setSearchTerm,
    setStatusFilter,
    isSelected,
    toggleSelection,
    clearSelection,
    selectMany,
    approveItem,
    approveMany,
  };
});
