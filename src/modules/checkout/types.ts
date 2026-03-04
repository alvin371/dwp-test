import type { TPackage } from "@/modules/packages/types";

export type TCheckoutStep = 0 | 1 | 2 | 3;

export type TPaymentGroup = "bank_transfer" | "retail" | "ewallet" | "qris" | "saved";

export type TPaymentMethodDetail = {
  group: TPaymentGroup;
  subMethod: string;
  vaNumber?: string;
  displayLabel: string;
};

export type TOrder = {
  phoneNumber: string;
  operatorId: string;
  packageId: string;
  packageName: string;
  amount: number;
  paymentMethod: string;
};

export type TTransaction = {
  id: string;
  userId: string;
  phoneNumber: string;
  operatorId: string;
  packageId: string;
  packageName: string;
  amount: number;
  paymentMethod: string;
  status: "success" | "pending" | "failed";
  createdAt: string;
  updatedAt: string;
};

export type TCheckoutState = {
  phoneNumber: string;
  operatorId: string | null;
  selectedPackage: TPackage | null;
  currentStep: TCheckoutStep;
  paymentMethod: string;
  paymentMethodDetail: TPaymentMethodDetail | null;
};
