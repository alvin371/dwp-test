export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/users",
    SEND_OTP: "/users",
    VERIFY_OTP: "/users",
  },
  OPERATORS: "/operators",
  PACKAGES: "/packages",
  SAVED_NUMBERS: "/saved_numbers",
  PAYMENT_METHODS: "/payment_methods",
  TRANSACTIONS: "/transactions",
  USERS: "/users",
} as const;
