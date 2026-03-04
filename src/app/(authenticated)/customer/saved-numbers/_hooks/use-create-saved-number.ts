import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSavedNumber } from "@/modules/customer";

export const useCreateSavedNumber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-saved-number"],
    mutationFn: createSavedNumber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-numbers"] });
    },
  });
};
