import { api } from "@/libs/axios/api";
import { ENDPOINTS } from "@/commons/endpoint";
import { OPERATOR_PREFIXES } from "@/commons/constants";
import type { OperatorEnum } from "@/commons/enums/operator.enum";
import type { TPackage, TDetectedOperator } from "./types";

export const detectOperator = (phone: string): TDetectedOperator => {
  if (!phone || phone.length < 4) return null;

  // Normalize to 08xx format
  let normalized = phone;
  if (normalized.startsWith("+62")) {
    normalized = "0" + normalized.slice(3);
  } else if (normalized.startsWith("62")) {
    normalized = "0" + normalized.slice(2);
  }

  const prefix = normalized.slice(0, 4);

  for (const [operatorId, prefixes] of Object.entries(OPERATOR_PREFIXES)) {
    if (prefixes.includes(prefix)) {
      return operatorId as OperatorEnum;
    }
  }

  return null;
};

export const getPackages = async (operatorId: string): Promise<TPackage[]> => {
  const response = await api.get<TPackage[]>(ENDPOINTS.PACKAGES, {
    params: { operatorId },
  });
  return response.data;
};

export const getPackageById = async (id: string): Promise<TPackage | null> => {
  const response = await api.get<TPackage>(`${ENDPOINTS.PACKAGES}/${id}`);
  return response.data;
};
