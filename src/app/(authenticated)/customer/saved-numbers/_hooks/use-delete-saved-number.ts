import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSavedNumber } from "@/modules/customer";

export const useDeleteSavedNumber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-saved-number"],
    mutationFn: deleteSavedNumber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-numbers"] });
    },
  });
};
