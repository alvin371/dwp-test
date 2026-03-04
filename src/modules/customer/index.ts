import { api } from "@/libs/axios/api";
import { ENDPOINTS } from "@/commons/endpoint";
import type {
  TProfile,
  TSavedNumber,
  TUpdateProfileRequest,
  TCreateSavedNumberRequest,
  TPaymentMethod,
  TCreatePaymentMethodRequest,
  TUpdatePaymentMethodRequest,
} from "./types";


export const getProfile = async (userId: string): Promise<TProfile> => {
  const response = await api.get<TProfile>(`${ENDPOINTS.USERS}/${userId}`);
  return response.data;
};

export const updateProfile = async (
  userId: string,
  data: TUpdateProfileRequest,
): Promise<TProfile> => {
  const response = await api.patch<TProfile>(`${ENDPOINTS.USERS}/${userId}`, data);
  return response.data;
};

export const changePassword = async (userId: string, password: string): Promise<void> => {
  await api.patch(`${ENDPOINTS.USERS}/${userId}`, { password });
};

export const getSavedNumbers = async (userId: string): Promise<TSavedNumber[]> => {
  const response = await api.get<TSavedNumber[]>(ENDPOINTS.SAVED_NUMBERS, {
    params: { userId },
  });
  return response.data;
};

export const createSavedNumber = async (data: TCreateSavedNumberRequest): Promise<TSavedNumber> => {
  const response = await api.post<TSavedNumber>(ENDPOINTS.SAVED_NUMBERS, data);
  return response.data;
};

export const deleteSavedNumber = async (id: string): Promise<void> => {
  await api.delete(`${ENDPOINTS.SAVED_NUMBERS}/${id}`);
};

export const getPaymentMethods = async (userId: string): Promise<TPaymentMethod[]> => {
  const response = await api.get<TPaymentMethod[]>(ENDPOINTS.PAYMENT_METHODS, {
    params: { userId },
  });
  return response.data;
};

export const createPaymentMethod = async (data: TCreatePaymentMethodRequest): Promise<TPaymentMethod> => {
  const { cardNumber, ...rest } = data;
  const payload = {
    ...rest,
    ...(cardNumber ? { lastFour: cardNumber.replace(/\s/g, "").slice(-4) } : {}),
    isDefault: false,
    isVerified: true,
  };
  const response = await api.post<TPaymentMethod>(ENDPOINTS.PAYMENT_METHODS, payload);
  return response.data;
};

export const updatePaymentMethod = async (
  id: string,
  data: TUpdatePaymentMethodRequest,
): Promise<TPaymentMethod> => {
  const response = await api.patch<TPaymentMethod>(`${ENDPOINTS.PAYMENT_METHODS}/${id}`, data);
  return response.data;
};

export const deletePaymentMethod = async (id: string): Promise<void> => {
  await api.delete(`${ENDPOINTS.PAYMENT_METHODS}/${id}`);
};

export const setDefaultPaymentMethod = async (id: string, userId: string): Promise<void> => {
  const response = await api.get<TPaymentMethod[]>(ENDPOINTS.PAYMENT_METHODS, { params: { userId } });
  const others = response.data.filter((pm) => pm.isDefault && pm.id !== id);
  await Promise.all(others.map((pm) => api.patch(`${ENDPOINTS.PAYMENT_METHODS}/${pm.id}`, { isDefault: false })));
  await api.patch(`${ENDPOINTS.PAYMENT_METHODS}/${id}`, { isDefault: true });
};
