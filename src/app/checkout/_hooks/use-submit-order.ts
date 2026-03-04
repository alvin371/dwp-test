import { useMutation } from "@tanstack/react-query";
import { submitOrder } from "@/modules/checkout";

export const useSubmitOrder = () => {
  return useMutation({
    mutationKey: ["submit-order"],
    mutationFn: submitOrder,
  });
};
