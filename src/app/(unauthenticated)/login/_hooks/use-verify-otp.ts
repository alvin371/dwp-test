import { useMutation } from "@tanstack/react-query";
import { verifyOtp } from "@/modules/auth";

export const useVerifyOtp = () => {
  return useMutation({
    mutationKey: ["verify-otp"],
    mutationFn: verifyOtp,
  });
};
