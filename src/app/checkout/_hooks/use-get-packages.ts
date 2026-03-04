import { useQuery } from "@tanstack/react-query";
import { getPackages } from "@/modules/packages";

export const useGetPackages = (operatorId: string | null) => {
  return useQuery({
    queryKey: ["packages", operatorId],
    queryFn: () => getPackages(operatorId!),
    enabled: !!operatorId,
  });
};
