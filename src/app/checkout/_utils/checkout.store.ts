import { create } from "zustand";
import type { TPackage } from "@/modules/packages/types";
import type { TCheckoutStep, TPaymentMethodDetail } from "@/modules/checkout/types";

type TCheckoutStore = {
  phoneNumber: string;
  operatorId: string | null;
  selectedPackage: TPackage | null;
  currentStep: TCheckoutStep;
  paymentMethod: string;
  paymentMethodDetail: TPaymentMethodDetail | null;

  setPhoneNumber: (phone: string, operatorId: string | null) => void;
  setSelectedPackage: (pkg: TPackage) => void;
  setPaymentMethod: (method: string) => void;
  setPaymentMethodDetail: (detail: TPaymentMethodDetail | null) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: TCheckoutStep) => void;
  reset: () => void;
};

const initialState = {
  phoneNumber: "",
  operatorId: null,
  selectedPackage: null,
  currentStep: 0 as TCheckoutStep,
  paymentMethod: "",
  paymentMethodDetail: null,
};

export const useCheckoutStore = create<TCheckoutStore>((set, get) => ({
  ...initialState,

  setPhoneNumber: (phone, operatorId) =>
    set({ phoneNumber: phone, operatorId }),

  setSelectedPackage: (pkg) =>
    set({ selectedPackage: pkg }),

  setPaymentMethod: (method) =>
    set({ paymentMethod: method }),

  setPaymentMethodDetail: (detail) =>
    set({ paymentMethodDetail: detail }),

  nextStep: () => {
    const current = get().currentStep;
    if (current < 3) {
      set({ currentStep: (current + 1) as TCheckoutStep });
    }
  },

  prevStep: () => {
    const current = get().currentStep;
    if (current > 0) {
      set({ currentStep: (current - 1) as TCheckoutStep });
    }
  },

  goToStep: (step) => set({ currentStep: step }),

  reset: () => set(initialState),
}));
