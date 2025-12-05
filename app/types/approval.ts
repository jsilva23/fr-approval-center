export type ApprovalStatus = "PENDING" | "APPROVED";

export interface ApprovalItem {
  id: number;
  name: string;
  type: string;
  status: ApprovalStatus;
}
