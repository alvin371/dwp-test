import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setDefaultPaymentMethod } from "@/modules/customer";

export const useSetDefaultPaymentMethod = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["set-default-payment-method"],
    mutationFn: (id: string) => setDefaultPaymentMethod(id, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
    },
  });
};
