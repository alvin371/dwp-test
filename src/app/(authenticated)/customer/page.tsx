"use client";

import { Card, Typography, Space, Avatar, Button, Divider } from "antd";
import { UserOutlined, EditOutlined, PhoneOutlined, HistoryOutlined } from "@ant-design/icons";
import Link from "next/link";
import { AppHeader } from "@/components/layouts/app-header";
import { AppFooter } from "@/components/layouts/app-footer";
import { useAuthStore } from "@/libs/stores/auth.store";
import { ROUTES } from "@/commons/route";

export default function CustomerPage() {
  const { user } = useAuthStore();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppHeader />

      <main
        className="main-content"
        style={{ flex: 1, padding: "32px 16px", maxWidth: 600, margin: "0 auto", width: "100%" }}
      >
        <Typography.Title level={3} style={{ marginBottom: 24 }}>
          My Account
        </Typography.Title>

        <Card style={{ borderRadius: 12 }} data-testid="customer-profile-card">
          <Space orientation="vertical" size="large" style={{ width: "100%" }} align="center">
            <Avatar size={80} icon={<UserOutlined />} style={{ background: "#1677ff" }} />
            <div style={{ textAlign: "center" }}>
              <Typography.Title level={4} style={{ margin: 0 }}>
                {user?.name}
              </Typography.Title>
              <Typography.Text type="secondary">{user?.email}</Typography.Text>
            </div>
          </Space>

          <Divider />

          <Space orientation="vertical" style={{ width: "100%" }} size="middle">
            <Link href={ROUTES.CUSTOMER_PROFILE} style={{ display: "block" }}>
              <Button block icon={<EditOutlined />} size="large" data-testid="edit-profile-btn">
                Edit Profile
              </Button>
            </Link>
            <Link href={ROUTES.CUSTOMER_SAVED_NUMBERS} style={{ display: "block" }}>
              <Button
                block
                icon={<PhoneOutlined />}
                size="large"
                data-testid="saved-numbers-btn"
              >
                Saved Numbers
              </Button>
            </Link>
            <Link href={ROUTES.TRANSACTIONS} style={{ display: "block" }}>
              <Button
                block
                icon={<HistoryOutlined />}
                size="large"
                data-testid="transactions-btn"
              >
                Transaction History
              </Button>
            </Link>
          </Space>
        </Card>
      </main>

      <AppFooter />
    </div>
  );
}
