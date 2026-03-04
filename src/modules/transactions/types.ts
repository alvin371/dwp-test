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

export type TTransactionFilter = {
  userId?: string;
  status?: string;
};
