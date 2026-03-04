"use client";

import { Button, Dropdown, Popconfirm, Tag, Typography } from "antd";
import {
  CheckCircleFilled,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import type { TPaymentMethod } from "@/modules/customer/types";

const WALLET_COLORS: Record<string, string> = {
  gopay: "#00AED6",
  ovo: "#4C3494",
  shopee_pay: "#EE4D2D",
  link_aja: "#E82529",
  dana: "#118EEA",
};

const WALLET_DISPLAY_NAMES: Record<string, string> = {
  gopay: "GoPay",
  ovo: "OVO",
  shopee_pay: "ShopeePay",
  link_aja: "LinkAja",
  dana: "DANA",
};

function BrandLogo({ method }: { method: TPaymentMethod }) {
  if (method.type === "credit_card") {
    if (method.brand === "visa") {
      return (
        <div
          style={{
            width: 48,
            height: 30,
            border: "1px solid #e0e0e0",
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fff",
            flexShrink: 0,
          }}
        >
          <Typography.Text
            style={{ fontWeight: 800, fontStyle: "italic", color: "#1A1F71", fontSize: 15, letterSpacing: -0.5 }}
          >
            VISA
          </Typography.Text>
        </div>
      );
    }
    if (method.brand === "mastercard") {
      return (
        <div style={{ display: "flex", alignItems: "center", flexShrink: 0, width: 48 }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#EB001B" }} />
          <div
            style={{ width: 24, height: 24, borderRadius: "50%", background: "#F79E1B", marginLeft: -10 }}
          />
        </div>
      );
    }
  }
  if (method.type === "e_wallet" && method.walletBrand) {
    const color = WALLET_COLORS[method.walletBrand] ?? "#666";
    const name = WALLET_DISPLAY_NAMES[method.walletBrand] ?? method.walletBrand;
    return (
      <div
        style={{
          height: 30,
          padding: "0 10px",
          borderRadius: 4,
          background: color,
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <Typography.Text style={{ color: "#fff", fontWeight: 700, fontSize: 12 }}>{name}</Typography.Text>
      </div>
    );
  }
  return null;
}

type Props = {
  paymentMethod: TPaymentMethod;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  onEdit: (method: TPaymentMethod) => void;
  isSettingDefault?: boolean;
  isDeleting?: boolean;
};

export const PaymentMethodCard = ({
  paymentMethod,
  onDelete,
  onSetDefault,
  onEdit,
  isSettingDefault = false,
  isDeleting = false,
}: Props) => {
  const isCard = paymentMethod.type === "credit_card";
  const maskedInfo = isCard
    ? `•••• ${paymentMethod.lastFour}`
    : (WALLET_DISPLAY_NAMES[paymentMethod.walletBrand ?? ""] ?? paymentMethod.accountIdentifier ?? "");
  const subInfo = isCard
    ? `Expires ${paymentMethod.expiryMonth}/${paymentMethod.expiryYear}`
    : (paymentMethod.accountIdentifier ?? "");

  const dropdownItems = [
    {
      key: "edit",
      label: (
        <span>
          <EditOutlined style={{ marginRight: 6 }} />
          Edit
        </span>
      ),
      onClick: () => onEdit(paymentMethod),
    },
  ];

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #f0f0f0",
        borderRadius: 10,
        padding: "16px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
      data-testid={`payment-method-card-${paymentMethod.id}`}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <BrandLogo method={paymentMethod} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <Typography.Text strong style={{ fontSize: 14 }}>
              {maskedInfo}
            </Typography.Text>
            {paymentMethod.isVerified && (
              <CheckCircleFilled style={{ color: "#52c41a", fontSize: 13 }} />
            )}
            {paymentMethod.isDefault && (
              <Tag color="blue" style={{ marginRight: 0, fontSize: 11, fontWeight: 600, lineHeight: "18px" }}>
                DEFAULT
              </Tag>
            )}
          </div>
          {subInfo && (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {subInfo}
            </Typography.Text>
          )}
        </div>

        <Dropdown menu={{ items: dropdownItems }} trigger={["click"]}>
          <Button
            type="text"
            icon={<MoreOutlined />}
            size="small"
            data-testid={`payment-method-more-btn-${paymentMethod.id}`}
          />
        </Dropdown>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 8 }}>
        <Button
          block
          disabled={paymentMethod.isDefault || isSettingDefault}
          loading={isSettingDefault && !paymentMethod.isDefault}
          onClick={() => onSetDefault(paymentMethod.id)}
          style={{ flex: 1 }}
          data-testid={`set-default-btn-${paymentMethod.id}`}
        >
          Set as Default
        </Button>
        <Popconfirm
          title="Remove this payment method?"
          onConfirm={() => onDelete(paymentMethod.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            danger
            loading={isDeleting}
            style={{ flex: 1 }}
            data-testid={`remove-payment-method-btn-${paymentMethod.id}`}
          >
            <DeleteOutlined />
            Remove
          </Button>
        </Popconfirm>
      </div>
    </div>
  );
};
