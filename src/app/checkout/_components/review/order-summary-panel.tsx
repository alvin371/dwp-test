"use client";

import { Card, Space, Typography } from "antd";
import { LockOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { useCheckoutStore } from "../../_utils/checkout.store";
import { OPERATOR_DISPLAY_NAMES } from "@/commons/constants";

const { Text, Title } = Typography;

const InfoCard = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <Card
    size="small"
    styles={{ body: { padding: "10px 14px" } }}
    style={{ borderRadius: 8, background: "#f8faff", border: "1px solid #e8eef8" }}
  >
    <Text type="secondary" style={{ fontSize: 11, display: "block", marginBottom: 2 }}>
      {label}
    </Text>
    <Text strong style={{ fontSize: 14 }}>
      {value}
    </Text>
  </Card>
);

export const OrderSummaryPanel = () => {
  const { phoneNumber, operatorId, selectedPackage } = useCheckoutStore();

  if (!selectedPackage) return null;

  const subtotal = selectedPackage.price;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + tax;

  const operatorName = operatorId
    ? (OPERATOR_DISPLAY_NAMES[operatorId] ?? operatorId)
    : "-";

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }} data-testid="review-order-summary-panel">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <InfoCard label="Plan" value={selectedPackage.name} />
        <InfoCard label="Number" value={phoneNumber || "-"} />
        <InfoCard label="Operator" value={operatorName} />
      </div>

      <Card
        size="small"
        styles={{ body: { padding: "16px" } }}
        style={{ borderRadius: 10, border: "1px solid #e8eef8" }}
      >
        <Title level={5} style={{ marginBottom: 12 }}>
          Pricing Details
        </Title>

        <Space direction="vertical" size={8} style={{ width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text type="secondary">Subtotal</Text>
            <Text>Rp {subtotal.toLocaleString("id-ID")}</Text>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text type="secondary">Tax (8%)</Text>
            <Text>Rp {tax.toLocaleString("id-ID")}</Text>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: "1px solid #e8eef8",
              paddingTop: 10,
              marginTop: 4,
            }}
          >
            <Text strong style={{ fontSize: 16 }}>
              Total
            </Text>
            <Text strong style={{ fontSize: 18, color: "#1677ff" }}>
              Rp {total.toLocaleString("id-ID")}
            </Text>
          </div>
        </Space>
      </Card>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 14px",
          background: "#f6ffed",
          borderRadius: 8,
          border: "1px solid #b7eb8f",
        }}
      >
        <SafetyCertificateOutlined style={{ color: "#52c41a", fontSize: 18 }} />
        <div>
          <Text strong style={{ fontSize: 13, color: "#237804", display: "block" }}>
            Secure SSL Encrypted Transaction
          </Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            No hidden fees. Safe &amp; protected payment.
          </Text>
        </div>
        <LockOutlined style={{ color: "#52c41a", marginLeft: "auto" }} />
      </div>
    </Space>
  );
};
