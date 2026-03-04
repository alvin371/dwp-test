export const normalizeIndonesiaPhone = (input: string): string => {
  let digits = input.trim().replace(/\D/g, "");

  if (!digits) return "";

  // Accept international prefixes like 0062...
  while (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

  // Convert country-code prefix to local format
  if (digits.startsWith("62")) {
    digits = digits.slice(2);
  }

  // Keep a single leading 0 in local representation
  digits = digits.replace(/^0+/, "");

  return digits ? `0${digits}` : "";
};

export const formatPhoneDisplay = (localPhone: string): string => {
  if (!localPhone) return "";
  if (localPhone.startsWith("0")) return `+62 ${localPhone.slice(1)}`;
  return localPhone;
};
