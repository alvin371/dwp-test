import { useQuery } from "@tanstack/react-query";
import { getSavedNumbers } from "@/modules/customer";

export const useGetSavedNumbers = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["saved-numbers", userId],
    queryFn: () => getSavedNumbers(userId!),
    enabled: !!userId,
  });
};
