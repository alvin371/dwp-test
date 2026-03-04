"use client";

import { Space, Skeleton, Typography } from "antd";
import { CreditCardOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/libs/axios/api";
import { ENDPOINTS } from "@/commons/endpoint";
import { useAuthStore } from "@/libs/stores/auth.store";
import { useCheckoutStore } from "../../_utils/checkout.store";
import { PaymentOptionCard } from "./payment-option-card";

const { Text } = Typography;

type TSavedPaymentMethod = {
  id: string;
  userId: string;
  type: string;
  last4: string;
  brand: string;
  label: string;
};

export const SavedPaymentMethods = () => {
  const { user } = useAuthStore();
  const { paymentMethodDetail, setPaymentMethodDetail, setPaymentMethod } =
    useCheckoutStore();

  const { data: methods, isLoading } = useQuery({
    queryKey: ["payment-methods", user?.id],
    queryFn: async () => {
      const res = await api.get<TSavedPaymentMethod[]>(ENDPOINTS.PAYMENT_METHODS, {
        params: { userId: user!.id },
      });
      return res.data;
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 2 }} />;
  }

  if (!methods || methods.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "16px 0" }}>
        <CreditCardOutlined style={{ fontSize: 28, color: "#bfbfbf", marginBottom: 8 }} />
        <Text type="secondary" style={{ display: "block" }}>
          No saved payment methods
        </Text>
      </div>
    );
  }

  return (
    <Space direction="vertical" size={8} style={{ width: "100%" }}>
      {methods.map((method) => {
        const displayLabel = `Saved — ${method.brand} ending in ${method.last4}`;
        const isSelected =
          paymentMethodDetail?.group === "saved" &&
          paymentMethodDetail.subMethod === method.id;
        return (
          <PaymentOptionCard
            key={method.id}
            label={`${method.brand} •••• ${method.last4}`}
            color="#722ed1"
            selected={isSelected}
            onClick={() => {
              setPaymentMethod(displayLabel);
              setPaymentMethodDetail({
                group: "saved",
                subMethod: method.id,
                displayLabel,
              });
            }}
          />
        );
      })}
    </Space>
  );
};
