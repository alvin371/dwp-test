import type { OperatorEnum } from "@/commons/enums/operator.enum";

export type TOperator = {
  id: string;
  name: string;
  prefixes: string[];
  color: string;
  logo: string;
};

export type TPackage = {
  id: string;
  operatorId: string;
  name: string;
  quota: string;
  validity: number;
  validityUnit: "days" | "hours";
  price: number;
  description: string;
};

export type TDetectedOperator = OperatorEnum | null;
