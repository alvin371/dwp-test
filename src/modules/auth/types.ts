export type TUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  token: string;
  otp?: string;
};

export type TLoginRequest = {
  email: string;
  password: string;
};

export type TRegisterRequest = {
  name: string;
  email: string;
  password: string;
  phone: string;
};

export type TLoginMethod = "phone" | "email";

export type TSendOtpRequest = {
  method: TLoginMethod;
  identifier: string;
};

export type TVerifyOtpRequest = {
  userId: string;
  otp: string;
};
