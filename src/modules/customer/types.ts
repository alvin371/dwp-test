export type TProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type TSavedNumber = {
  id: string;
  userId: string;
  phoneNumber: string;
  label: string;
  operatorId: string;
};

export type TUpdateProfileRequest = {
  name: string;
  email: string;
  phone: string;
};

export type TChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type TCreateSavedNumberRequest = {
  userId: string;
  phoneNumber: string;
  label: string;
  operatorId: string;
};

export type TPaymentMethodType = "credit_card" | "e_wallet";
export type TCardBrand = "visa" | "mastercard";
export type TWalletBrand = "gopay" | "ovo" | "shopee_pay" | "link_aja" | "dana";

export type TPaymentMethod = {
  id: string;
  userId: string;
  type: TPaymentMethodType;
  brand?: TCardBrand;
  lastFour?: string;
  expiryMonth?: string;
  expiryYear?: string;
  walletBrand?: TWalletBrand;
  accountIdentifier?: string;
  isDefault: boolean;
  isVerified: boolean;
};

export type TCreatePaymentMethodRequest = {
  userId: string;
  type: TPaymentMethodType;
  brand?: TCardBrand;
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  walletBrand?: TWalletBrand;
  accountIdentifier?: string;
};

export type TUpdatePaymentMethodRequest = Partial<Omit<TCreatePaymentMethodRequest, "userId" | "cardNumber">> & {
  expiryMonth?: string;
  expiryYear?: string;
};
