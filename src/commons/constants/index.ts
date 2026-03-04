export const INDONESIAN_BANKS = [
  { value: "bca", label: "BCA", prefix: "808" },
  { value: "bni", label: "BNI", prefix: "891" },
  { value: "bri", label: "BRI", prefix: "889" },
  { value: "mandiri", label: "Mandiri", prefix: "888" },
  { value: "cimb", label: "CIMB Niaga", prefix: "700" },
  { value: "danamon", label: "Bank Danamon", prefix: "727" },
  { value: "permata", label: "Bank Permata", prefix: "013" },
  { value: "btn", label: "BTN", prefix: "200" },
  { value: "bsi", label: "BSI", prefix: "451" },
  { value: "maybank", label: "Maybank", prefix: "911" },
  { value: "ocbc", label: "OCBC NISP", prefix: "028" },
  { value: "mega", label: "Bank Mega", prefix: "426" },
  { value: "jenius", label: "Jenius (BTPN)", prefix: "213" },
] as const;

export type TBankValue = (typeof INDONESIAN_BANKS)[number]["value"];

export const generateVANumber = (
  bank: TBankValue,
  phone: string,
  amount: number
): string => {
  const bankEntry = INDONESIAN_BANKS.find((b) => b.value === bank);
  const prefix = bankEntry?.prefix ?? "000";
  const digits = phone.replace(/\D/g, "").slice(-8).padStart(8, "0");
  const amountSuffix = String(amount).slice(-4).padStart(4, "0");
  return `${prefix}${digits}${amountSuffix}`;
};

export const RETAIL_OPTIONS = [
  { value: "alfamidi", label: "Alfamidi", color: "#E31837" },
  { value: "indomaret", label: "Indomaret", color: "#EE3024" },
  { value: "alfamart", label: "Alfamart", color: "#E31837" },
] as const;

export const EWALLET_OPTIONS = [
  { value: "gopay", label: "GoPay", color: "#00AED6" },
  { value: "ovo", label: "OVO", color: "#4C3494" },
  { value: "shopeepay", label: "ShopeePay", color: "#EE4D2D" },
] as const;

export const OPERATOR_PREFIXES: Record<string, string[]> = {
  telkomsel: ["0811", "0812", "0813", "0821", "0822", "0823", "0851", "0852", "0853"],
  xl: ["0817", "0818", "0819", "0859", "0877", "0878"],
  indosat: ["0814", "0815", "0816", "0855", "0856", "0857", "0858"],
  smartfren: ["0881", "0882", "0883", "0884", "0885", "0886", "0887", "0888", "0889"],
  axis: ["0831", "0832", "0833", "0838"],
  three: ["0895", "0896", "0897", "0898", "0899"],
};

export const OPERATOR_DISPLAY_NAMES: Record<string, string> = {
  telkomsel: "Telkomsel",
  xl: "XL Axiata",
  indosat: "Indosat Ooredoo",
  smartfren: "Smartfren",
  axis: "Axis",
  three: "Three (3)",
};

export const OPERATOR_COLORS: Record<string, string> = {
  telkomsel: "#FF0000",
  xl: "#0052CC",
  indosat: "#FFD700",
  smartfren: "#E91E63",
  axis: "#9C27B0",
  three: "#FF6B00",
};

export const PAYMENT_METHODS = [
  { value: "e-wallet", label: "E-Wallet (GoPay, OVO, DANA)" },
  { value: "transfer", label: "Bank Transfer" },
  { value: "credit-card", label: "Credit / Debit Card" },
] as const;

export const TRANSACTION_STATUS_MAP: Record<string, { label: string; color: string }> = {
  success: { label: "Successful", color: "green" },
  pending: { label: "Pending", color: "orange" },
  failed: { label: "Failed", color: "red" },
};
