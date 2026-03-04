export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  CHECKOUT: "/checkout",
  CHECKOUT_SUCCESS: "/checkout/success",
  CHECKOUT_PENDING: "/checkout/pending",
  CUSTOMER: "/customer",
  CUSTOMER_PROFILE: "/customer/profile",
  CUSTOMER_SAVED_NUMBERS: "/customer/saved-numbers",
  CUSTOMER_PAYMENT_METHODS: "/customer/payment-methods",
  TRANSACTIONS: "/customer/transactions",
  TRANSACTION_DETAIL: (id: string) => `/customer/transactions/${id}`,
} as const;
