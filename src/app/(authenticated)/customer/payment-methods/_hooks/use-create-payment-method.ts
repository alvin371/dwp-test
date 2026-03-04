import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPaymentMethod } from "@/modules/customer";

export const useCreatePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-payment-method"],
    mutationFn: createPaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
    },
  });
};
