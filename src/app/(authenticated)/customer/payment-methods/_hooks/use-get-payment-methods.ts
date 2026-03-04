import { useQuery } from "@tanstack/react-query";
import { getPaymentMethods } from "@/modules/customer";

export const useGetPaymentMethods = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["payment-methods", userId],
    queryFn: () => getPaymentMethods(userId!),
    enabled: !!userId,
  });
};
