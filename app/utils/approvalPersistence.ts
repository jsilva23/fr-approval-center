import type { ApprovalItem, ApprovalStatus } from "~/types/approval";

const STORAGE_KEY = "approval-center-items";

const sanitizeStatus = (status: ApprovalStatus | string): ApprovalStatus =>
  status === "APPROVED" ? "APPROVED" : "PENDING";

export const persistApprovals = (items: ApprovalItem[]) => {
  if (!import.meta.client) {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const loadPersistedApprovals = (): ApprovalItem[] | null => {
  if (!import.meta.client) {
    return null;
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as ApprovalItem[];
    if (!Array.isArray(parsed)) {
      return null;
    }

    return parsed.map((item) => ({
      id: item.id,
      name: item.name,
      type: item.type,
      status: sanitizeStatus(item.status),
    }));
  } catch (error) {
    console.warn("Erro ao carregar dados do localStorage", error);
    return null;
  }
};
