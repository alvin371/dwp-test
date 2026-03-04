"use client";

import { Avatar, Button, Divider, Dropdown, Popconfirm, Space, Typography } from "antd";
import {
  ClockCircleOutlined,
  DeleteOutlined,
  MoreOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { OPERATOR_COLORS, OPERATOR_DISPLAY_NAMES } from "@/commons/constants";
import { useCheckoutStore } from "@/app/checkout/_utils/checkout.store";
import { ROUTES } from "@/commons/route";
import type { TSavedNumber } from "@/modules/customer/types";

const AVATAR_COLORS = [
  "#1677ff",
  "#52c41a",
  "#fa8c16",
  "#eb2f96",
  "#722ed1",
  "#13c2c2",
  "#f5222d",
  "#faad14",
];

function getAvatarColor(label: string): string {
  return AVATAR_COLORS[label.charCodeAt(0) % AVATAR_COLORS.length];
}

type Props = {
  savedNumber: TSavedNumber;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
};

export const SavedNumberCard = ({ savedNumber, onDelete, isDeleting = false }: Props) => {
  const router = useRouter();
  const { setPhoneNumber, goToStep } = useCheckoutStore();

  const handleBuyAgain = () => {
    setPhoneNumber(savedNumber.phoneNumber, savedNumber.operatorId as never);
    goToStep(2);
    router.push(ROUTES.CHECKOUT);
  };

  const avatarColor = getAvatarColor(savedNumber.label);
  const operatorName = OPERATOR_DISPLAY_NAMES[savedNumber.operatorId] ?? savedNumber.operatorId;
  const operatorColor = OPERATOR_COLORS[savedNumber.operatorId] ?? "#666";

  const dropdownItems = onDelete
    ? [
        {
          key: "delete",
          label: (
            <Popconfirm
              title="Delete this saved number?"
              onConfirm={() => onDelete(savedNumber.id)}
              okText="Yes"
              cancelText="No"
            >
              <Space data-testid={`delete-saved-number-btn-${savedNumber.id}`}>
                <DeleteOutlined style={{ color: "#ff4d4f" }} />
                <span style={{ color: "#ff4d4f" }}>Delete</span>
              </Space>
            </Popconfirm>
          ),
        },
      ]
    : [];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #f0f0f0",
        padding: "16px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
      data-testid={`saved-number-card-${savedNumber.id}`}
    >
      {/* Header Row */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Avatar
          size={40}
          style={{ backgroundColor: avatarColor, flexShrink: 0, fontWeight: 600 }}
        >
          {savedNumber.label.charAt(0).toUpperCase()}
        </Avatar>

        <div style={{ flex: 1, minWidth: 0 }}>
          <Typography.Text strong style={{ display: "block", fontSize: 14 }}>
            {savedNumber.label}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {savedNumber.phoneNumber}
          </Typography.Text>
          {" · "}
          <Typography.Text style={{ fontSize: 12, color: operatorColor, fontWeight: 500 }}>
            {operatorName}
          </Typography.Text>
        </div>

        {onDelete && (
          <Dropdown
            menu={{ items: dropdownItems }}
            trigger={["click"]}
            disabled={isDeleting}
          >
            <Button
              type="text"
              icon={<MoreOutlined />}
              size="small"
              data-testid={`saved-number-more-btn-${savedNumber.id}`}
            />
          </Dropdown>
        )}
      </div>

      <Divider style={{ margin: "12px 0" }} />

      {/* Last Top-Up Section */}
      <div style={{ marginBottom: 12 }}>
        <Space size={4} style={{ marginBottom: 4 }}>
          <ClockCircleOutlined style={{ fontSize: 11, color: "#999" }} />
          <Typography.Text
            style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 0.5 }}
          >
            Last Top-Up
          </Typography.Text>
        </Space>
        <Typography.Text type="secondary" style={{ display: "block", fontSize: 13 }}>
          No recent top-up
        </Typography.Text>
      </div>

      {/* Buy Package Button */}
      <Button
        block
        icon={<ShoppingCartOutlined />}
        onClick={handleBuyAgain}
        data-testid={`buy-again-btn-${savedNumber.id}`}
      >
        Buy Package
      </Button>
    </div>
  );
};
