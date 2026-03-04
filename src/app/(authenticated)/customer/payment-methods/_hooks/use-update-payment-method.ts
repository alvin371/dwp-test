import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePaymentMethod } from "@/modules/customer";
import type { TUpdatePaymentMethodRequest } from "@/modules/customer/types";

export const useUpdatePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-payment-method"],
    mutationFn: ({ id, data }: { id: string; data: TUpdatePaymentMethodRequest }) =>
      updatePaymentMethod(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
    },
  });
};
