import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePaymentMethod } from "@/modules/customer";

export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-payment-method"],
    mutationFn: deletePaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
    },
  });
};
