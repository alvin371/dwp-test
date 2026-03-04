"use client";

import { Avatar, Card, Divider, Space, Typography } from "antd";
import {
  CreditCardOutlined,
  PhoneOutlined,
  SafetyOutlined,
  StarFilled,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useAuthStore } from "@/libs/stores/auth.store";
import { ROUTES } from "@/commons/route";

const NAV_ITEMS = [
  { label: "Profile", icon: <UserOutlined />, href: ROUTES.CUSTOMER_PROFILE },
  { label: "Saved Numbers", icon: <PhoneOutlined />, href: ROUTES.CUSTOMER_SAVED_NUMBERS },
  { label: "Payment Methods", icon: <CreditCardOutlined />, href: ROUTES.CUSTOMER_PAYMENT_METHODS },
  { label: "Transactions", icon: <UnorderedListOutlined />, href: ROUTES.TRANSACTIONS },
  { label: "Security", icon: <SafetyOutlined />, href: "#" },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

type Props = {
  activePath: string;
};

export const CustomerSidebar = ({ activePath }: Props) => {
  const { user } = useAuthStore();
  const userInitials = user?.name ? getInitials(user.name) : "U";

  return (
    <Card style={{ borderRadius: 12 }} styles={{ body: { padding: 20 } }}>
      {/* User profile */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <Avatar
          size={56}
          style={{ backgroundColor: "#1677ff", fontSize: 20, fontWeight: 700, marginBottom: 8 }}
        >
          {userInitials}
        </Avatar>
        <Typography.Title level={5} style={{ margin: "4px 0 2px" }}>
          {user?.name ?? "User"}
        </Typography.Title>
        <Typography.Text type="secondary" style={{ fontSize: 13 }}>
          {user?.email ?? ""}
        </Typography.Text>
      </div>

      {/* Member status */}
      <div
        style={{
          background: "#fffbe6",
          borderRadius: 8,
          padding: "8px 12px",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div style={{ flex: 1 }}>
          <Typography.Text
            style={{
              fontSize: 10,
              color: "#1677ff",
              textTransform: "uppercase",
              letterSpacing: 1,
              display: "block",
            }}
          >
            Member Status
          </Typography.Text>
          <Space size={4}>
            <StarFilled style={{ color: "#faad14", fontSize: 13 }} />
            <Typography.Text strong style={{ fontSize: 13, color: "#d48806" }}>
              Gold Tier
            </Typography.Text>
          </Space>
        </div>
      </div>

      <Divider style={{ margin: "0 0 12px" }} />

      {/* Nav items */}
      <div>
        {NAV_ITEMS.map((item) => {
          const isActive = activePath === item.href;
          return (
            <Link key={item.label} href={item.href} style={{ textDecoration: "none" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 8,
                  marginBottom: 2,
                  backgroundColor: isActive ? "#e6f4ff" : "transparent",
                  borderLeft: isActive ? "3px solid #1677ff" : "3px solid transparent",
                  cursor: "pointer",
                  color: isActive ? "#1677ff" : "#595959",
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 14,
                }}
              >
                <span style={{ fontSize: 15, lineHeight: 1 }}>{item.icon}</span>
                {item.label}
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
};
