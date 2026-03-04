import { useMutation } from "@tanstack/react-query";
import { sendOtp } from "@/modules/auth";

export const useSendOtp = () => {
  return useMutation({
    mutationKey: ["send-otp"],
    mutationFn: sendOtp,
  });
};
