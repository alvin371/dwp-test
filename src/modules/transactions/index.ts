import { api } from "@/libs/axios/api";
import { ENDPOINTS } from "@/commons/endpoint";
import type { TTransaction, TTransactionFilter } from "./types";

export const getTransactions = async (filter: TTransactionFilter = {}): Promise<TTransaction[]> => {
  const response = await api.get<TTransaction[]>(ENDPOINTS.TRANSACTIONS, {
    params: filter,
  });
  return response.data;
};

export const getTransactionById = async (id: string): Promise<TTransaction> => {
  const response = await api.get<TTransaction>(`${ENDPOINTS.TRANSACTIONS}/${id}`);
  return response.data;
};

export const updateTransactionStatus = async (
  id: string,
  status: TTransaction["status"]
): Promise<TTransaction> => {
  const response = await api.patch<TTransaction>(`${ENDPOINTS.TRANSACTIONS}/${id}`, {
    status,
    updatedAt: new Date().toISOString(),
  });
  return response.data;
};
