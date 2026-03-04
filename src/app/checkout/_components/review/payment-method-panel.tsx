"use client";

import { useState } from "react";
import { App, Button, Space, Typography } from "antd";
import {
  BankOutlined,
  ShopOutlined,
  MobileOutlined,
  QrcodeOutlined,
  CreditCardOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCheckoutStore } from "../../_utils/checkout.store";
import { useAuthStore } from "@/libs/stores/auth.store";
import { submitOrder } from "@/modules/checkout";
import { RETAIL_OPTIONS, EWALLET_OPTIONS } from "@/commons/constants";
import { ROUTES } from "@/commons/route";
import { BankTransferSelector } from "./bank-transfer-selector";
import { PaymentOptionCard } from "./payment-option-card";
import { SavedPaymentMethods } from "./saved-payment-methods";
import type { TPaymentGroup, TPaymentMethodDetail } from "@/modules/checkout/types";

const { Text, Title } = Typography;

type TGroupConfig = {
  key: TPaymentGroup;
  label: string;
  icon: React.ReactNode;
};

const GROUPS: TGroupConfig[] = [
  { key: "bank_transfer", label: "Bank Transfer", icon: <BankOutlined /> },
  { key: "retail", label: "Retail Payment", icon: <ShopOutlined /> },
  { key: "ewallet", label: "E-Wallet", icon: <MobileOutlined /> },
  { key: "qris", label: "QRIS", icon: <QrcodeOutlined /> },
  { key: "saved", label: "Saved Methods", icon: <CreditCardOutlined /> },
];

const GroupHeader = ({
  config,
  isOpen,
  onClick,
}: {
  config: TGroupConfig;
  isOpen: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    style={{
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "12px 14px",
      background: isOpen ? "#f0f5ff" : "#fafafa",
      border: "none",
      borderRadius: 8,
      cursor: "pointer",
      textAlign: "left",
      transition: "background 0.2s",
    }}
  >
    <span style={{ color: isOpen ? "#1677ff" : "#595959", fontSize: 16 }}>
      {config.icon}
    </span>
    <Text strong={isOpen} style={{ flex: 1, color: isOpen ? "#1677ff" : undefined }}>
      {config.label}
    </Text>
    {isOpen ? (
      <CaretUpOutlined style={{ color: "#1677ff" }} />
    ) : (
      <CaretDownOutlined style={{ color: "#bfbfbf" }} />
    )}
  </button>
);

const GroupContent = ({
  groupKey,
  paymentMethodDetail,
  setPaymentMethod,
  setPaymentMethodDetail,
}: {
  groupKey: TPaymentGroup;
  paymentMethodDetail: TPaymentMethodDetail | null;
  setPaymentMethod: (m: string) => void;
  setPaymentMethodDetail: (detail: TPaymentMethodDetail | null) => void;
}) => {
  if (groupKey === "bank_transfer") {
    return <BankTransferSelector />;
  }

  if (groupKey === "retail") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {RETAIL_OPTIONS.map((opt) => {
          const displayLabel = `Retail — ${opt.label}`;
          return (
            <PaymentOptionCard
              key={opt.value}
              label={opt.label}
              color={opt.color}
              selected={
                paymentMethodDetail?.group === "retail" &&
                paymentMethodDetail.subMethod === opt.value
              }
              onClick={() => {
                setPaymentMethod(displayLabel);
                setPaymentMethodDetail({ group: "retail", subMethod: opt.value, displayLabel });
              }}
              data-testid={`review-retail-card-${opt.value}`}
            />
          );
        })}
      </div>
    );
  }

  if (groupKey === "ewallet") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {EWALLET_OPTIONS.map((opt) => {
          const displayLabel = `E-Wallet — ${opt.label}`;
          return (
            <PaymentOptionCard
              key={opt.value}
              label={opt.label}
              color={opt.color}
              selected={
                paymentMethodDetail?.group === "ewallet" &&
                paymentMethodDetail.subMethod === opt.value
              }
              onClick={() => {
                setPaymentMethod(displayLabel);
                setPaymentMethodDetail({ group: "ewallet", subMethod: opt.value, displayLabel });
              }}
              data-testid={`review-ewallet-card-${opt.value}`}
            />
          );
        })}
      </div>
    );
  }

  if (groupKey === "qris") {
    return (
      <PaymentOptionCard
        label="Scan with any e-wallet app"
        color="#0050B3"
        selected={paymentMethodDetail?.group === "qris"}
        onClick={() => {
          setPaymentMethod("QRIS");
          setPaymentMethodDetail({ group: "qris", subMethod: "qris", displayLabel: "QRIS" });
        }}
        data-testid="review-qris-card"
      />
    );
  }

  if (groupKey === "saved") {
    return <SavedPaymentMethods />;
  }

  return null;
};

export const PaymentMethodPanel = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { message } = App.useApp();
  const {
    phoneNumber,
    operatorId,
    selectedPackage,
    paymentMethod,
    paymentMethodDetail,
    setPaymentMethod,
    setPaymentMethodDetail,
  } = useCheckoutStore();

  const [openGroup, setOpenGroup] = useState<TPaymentGroup | null>(null);

  const toggleGroup = (key: TPaymentGroup) => {
    setOpenGroup((prev) => (prev === key ? null : key));
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["submit-order"],
    mutationFn: submitOrder,
    onSuccess: (transaction) => {
      // Navigate first — reset() would set currentStep=0 and trigger checkout page's
      // guard (router.replace HOME), racing against this push.
      // reset() is called in the pending page on mount instead.
      router.push(`${ROUTES.CHECKOUT_PENDING}?txnId=${transaction.id}`);
    },
    onError: () => {
      message.error("Payment failed. Please try again.");
    },
  });

  const handlePay = () => {
    if (!selectedPackage || !user || !paymentMethod) return;
    const subtotal = selectedPackage.price;
    const tax = Math.round(subtotal * 0.08);
    mutate({
      userId: user.id,
      phoneNumber,
      operatorId: operatorId ?? "",
      packageId: selectedPackage.id,
      packageName: selectedPackage.name,
      amount: subtotal + tax,
      paymentMethod,
      status: "pending",
    });
  };

  return (
    <Space direction="vertical" size={12} style={{ width: "100%" }} data-testid="review-payment-panel">
      <Title level={5} style={{ marginBottom: 0 }}>
        Payment Method
      </Title>

      {GROUPS.map((group) => (
        <div key={group.key}>
          <GroupHeader
            config={group}
            isOpen={openGroup === group.key}
            onClick={() => toggleGroup(group.key)}
          />
          <AnimatePresence>
            {openGroup === group.key && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: "hidden" }}
              >
                <div style={{ padding: "10px 0 4px" }}>
                  <GroupContent
                    groupKey={group.key}
                    paymentMethodDetail={paymentMethodDetail}
                    setPaymentMethod={setPaymentMethod}
                    setPaymentMethodDetail={setPaymentMethodDetail}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {paymentMethod && (
        <div
          style={{
            padding: "10px 14px",
            background: "#f6ffed",
            borderRadius: 8,
            border: "1px solid #b7eb8f",
          }}
        >
          <Text type="secondary" style={{ fontSize: 12 }}>
            Selected:
          </Text>{" "}
          <Text strong style={{ color: "#237804" }}>
            {paymentMethod}
          </Text>
        </div>
      )}

      <Button
        type="primary"
        size="large"
        block
        icon={<ThunderboltOutlined />}
        disabled={!paymentMethod || isPending}
        loading={isPending}
        onClick={handlePay}
        data-testid="review-pay-now-btn"
        style={{ height: 52, fontSize: 16, marginTop: 4 }}
      >
        Pay &amp; Activate Now
      </Button>
    </Space>
  );
};
