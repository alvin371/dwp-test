"use client";

import { Select, Space, Typography } from "antd";
import { BankOutlined } from "@ant-design/icons";
import { useState } from "react";
import {
  INDONESIAN_BANKS,
  generateVANumber,
  type TBankValue,
} from "@/commons/constants";
import { useCheckoutStore } from "../../_utils/checkout.store";

const { Text } = Typography;

export const BankTransferSelector = () => {
  const [selectedBank, setSelectedBank] = useState<TBankValue | null>(null);
  const { phoneNumber, selectedPackage, setPaymentMethodDetail, setPaymentMethod } =
    useCheckoutStore();

  const handleBankChange = (bank: TBankValue) => {
    setSelectedBank(bank);
    const bankEntry = INDONESIAN_BANKS.find((b) => b.value === bank);
    const vaNumber = generateVANumber(
      bank,
      phoneNumber,
      selectedPackage?.price ?? 0
    );
    const displayLabel = `Bank Transfer — ${bankEntry?.label ?? bank}`;
    setPaymentMethod(displayLabel);
    setPaymentMethodDetail({
      group: "bank_transfer",
      subMethod: bank,
      vaNumber,
      displayLabel,
    });
  };

  const vaNumber =
    selectedBank && phoneNumber
      ? generateVANumber(selectedBank, phoneNumber, selectedPackage?.price ?? 0)
      : null;

  const bankEntry = selectedBank
    ? INDONESIAN_BANKS.find((b) => b.value === selectedBank)
    : null;

  return (
    <Space direction="vertical" size={12} style={{ width: "100%" }}>
      <Select
        placeholder="Select bank"
        style={{ width: "100%" }}
        size="large"
        value={selectedBank}
        onChange={handleBankChange}
        showSearch
        optionFilterProp="label"
        options={INDONESIAN_BANKS.map((b) => ({ value: b.value, label: b.label }))}
        data-testid="review-bank-select"
      />

      {vaNumber && bankEntry && (
        <div
          data-testid="review-va-number-display"
          style={{
            padding: "14px 16px",
            background: "linear-gradient(135deg, #e8f4fd, #f0f8ff)",
            borderRadius: 10,
            border: "1px solid #91caff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <BankOutlined style={{ color: "#1677ff" }} />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Virtual Account — {bankEntry.label}
            </Text>
          </div>
          <Text
            copyable
            style={{
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 2,
              color: "#1677ff",
              fontFamily: "monospace",
            }}
          >
            {vaNumber}
          </Text>
          <Text
            type="secondary"
            style={{ display: "block", fontSize: 11, marginTop: 4 }}
          >
            Transfer the exact amount to this VA number
          </Text>
        </div>
      )}
    </Space>
  );
};
