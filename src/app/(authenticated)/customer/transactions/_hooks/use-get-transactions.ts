import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/modules/transactions";
import type { TTransactionFilter } from "@/modules/transactions/types";

export const useGetTransactions = (filter: TTransactionFilter = {}) => {
  return useQuery({
    queryKey: ["transactions", filter],
    queryFn: () => getTransactions(filter),
  });
};
