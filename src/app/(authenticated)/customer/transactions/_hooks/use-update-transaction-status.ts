import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTransactionStatus } from "@/modules/transactions";
import type { TTransaction } from "@/modules/transactions/types";

export const useUpdateTransactionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-transaction-status"],
    mutationFn: ({ id, status }: { id: string; status: TTransaction["status"] }) =>
      updateTransactionStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};
