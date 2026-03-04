import { api } from "@/libs/axios/api";
import { ENDPOINTS } from "@/commons/endpoint";
import type { TLoginRequest, TSendOtpRequest, TVerifyOtpRequest, TUser } from "./types";
import { normalizeIndonesiaPhone } from "@/libs/utils/phone";

export const login = async (data: TLoginRequest): Promise<TUser> => {
  // json-server: GET /users?email=x&password=y
  const response = await api.get<TUser[]>(ENDPOINTS.AUTH.LOGIN, {
    params: { email: data.email, password: data.password },
  });

  const users = response.data;
  if (!users || users.length === 0) {
    throw new Error("Invalid email or password");
  }

  return users[0];
};

export const sendOtp = async (data: TSendOtpRequest): Promise<TUser> => {
  if (data.method === "phone") {
    const normalizedInput = normalizeIndonesiaPhone(data.identifier);
    const response = await api.get<TUser[]>(ENDPOINTS.AUTH.SEND_OTP);
    const users = response.data ?? [];

    // json-server beta can fail exact filtering for numeric-like strings with leading zero.
    const user = users.find((candidate) => {
      const normalizedCandidate = normalizeIndonesiaPhone(candidate.phone ?? "");
      return normalizedCandidate === normalizedInput;
    });

    if (!user) {
      throw new Error("No account found with that phone number or email");
    }

    return user;
  }

  const response = await api.get<TUser[]>(ENDPOINTS.AUTH.SEND_OTP, {
    params: { email: data.identifier.trim() },
  });
  const users = response.data;

  if (!users || users.length === 0) {
    throw new Error("No account found with that phone number or email");
  }

  return users[0];
};

export const verifyOtp = async (data: TVerifyOtpRequest): Promise<TUser> => {
  const response = await api.get<TUser>(`${ENDPOINTS.AUTH.VERIFY_OTP}/${data.userId}`);
  const user = response.data;

  if (!user || user.otp !== data.otp) {
    throw new Error("Invalid OTP. Please try again.");
  }

  return user;
};

export const logout = async (): Promise<void> => {
  // Stateless logout — just clear local state
};
