import { ref, type Ref } from "vue";
import type { ApprovalItem, ApprovalStatus } from "~/types/approval";
import { cloneDefaultApprovals } from "~/data/defaultApprovalItems";

export type StatusFilter = "ALL" | ApprovalStatus;

export interface ApprovalState {
  approvals: Ref<ApprovalItem[]>;
  selectedIds: Ref<number[]>;
  searchTerm: Ref<string>;
  statusFilter: Ref<StatusFilter>;
  initialized: Ref<boolean>;
}

export const createApprovalState = (): ApprovalState => ({
  approvals: ref<ApprovalItem[]>(cloneDefaultApprovals()),
  selectedIds: ref<number[]>([]),
  searchTerm: ref(""),
  statusFilter: ref<StatusFilter>("ALL"),
  initialized: ref(false),
});
