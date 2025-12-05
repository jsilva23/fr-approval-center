import type { ApprovalItem } from "~/types/approval";

export const defaultApprovalItems: ApprovalItem[] = [
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

export const cloneDefaultApprovals = () =>
  defaultApprovalItems.map((item) => ({ ...item }));
