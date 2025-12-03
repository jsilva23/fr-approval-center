import { ref } from "vue";
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

  return {
    approvals,
    selectedIds,
    searchTerm,
    statusFilter,
  };
});
