import { useQuery } from "@tanstack/react-query";
import { getTransactionById } from "@/modules/transactions";

export const useGetTransaction = (id: string | undefined) => {
  return useQuery({
    queryKey: ["transaction", id],
    queryFn: () => getTransactionById(id!),
    enabled: !!id,
  });
};
