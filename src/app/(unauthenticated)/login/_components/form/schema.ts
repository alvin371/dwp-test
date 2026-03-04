import { z } from "zod";
import { normalizeIndonesiaPhone } from "@/libs/utils/phone";

export const LoginSchema = z.object({
  email: z
    .string({ error: "Email is required" })
    .email("Please enter a valid email address"),
  password: z
    .string({ error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});

export type TLoginFormValues = z.infer<typeof LoginSchema>;

export const PhoneInputSchema = z.object({
  phone: z
    .string({ error: "Phone number is required" })
    .trim()
    .min(1, "Phone number is required")
    .refine(
      (value) => {
        const normalized = normalizeIndonesiaPhone(value);
        return normalized.length >= 10 && normalized.length <= 13;
      },
      { message: "Enter a valid phone number" },
    ),
});

export const EmailInputSchema = z.object({
  email: z
    .string({ error: "Email address is required" })
    .email("Enter a valid email address"),
});

export const OtpVerifySchema = z.object({
  otp: z
    .string({ error: "OTP is required" })
    .length(6, "OTP must be 6 digits"),
});

export type TPhoneInputValues = z.infer<typeof PhoneInputSchema>;
export type TEmailInputValues = z.infer<typeof EmailInputSchema>;
export type TOtpVerifyValues = z.infer<typeof OtpVerifySchema>;
