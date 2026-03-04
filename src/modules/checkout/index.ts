import { api } from "@/libs/axios/api";
import { ENDPOINTS } from "@/commons/endpoint";
import type { TOrder, TTransaction } from "./types";

export const submitOrder = async (
  order: TOrder & { userId: string; status?: TTransaction["status"] }
): Promise<TTransaction> => {
  const { status = "pending", ...rest } = order;
  const response = await api.post<TTransaction>(ENDPOINTS.TRANSACTIONS, {
    ...rest,
    status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return response.data;
};
