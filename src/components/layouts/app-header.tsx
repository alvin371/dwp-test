"use client";

import { Button, Dropdown, Space, Typography } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  ThunderboltFilled,
  HistoryOutlined,
  ProfileOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/libs/stores/auth.store";
import { ROUTES } from "@/commons/route";
import type { MenuProps } from "antd";

export const AppHeader = () => {
  const router = useRouter();
  const { isAuthenticated, user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    router.push(ROUTES.LOGIN);
  };

  const customerMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: <Link href={ROUTES.CUSTOMER_PROFILE}>Profile</Link>,
      icon: <ProfileOutlined />,
    },
    {
      key: "saved-numbers",
      label: <Link href={ROUTES.CUSTOMER_SAVED_NUMBERS}>Saved Numbers</Link>,
      icon: <UserOutlined />,
    },
    { type: "divider" },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <header
      style={{
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <Link href={ROUTES.HOME} style={{ textDecoration: "none" }}>
        <Space>
          <ThunderboltFilled style={{ fontSize: 24, color: "#1677ff" }} />
          <Typography.Title level={4} style={{ margin: 0, color: "#1677ff" }}>
            DWP Top Up
          </Typography.Title>
        </Space>
      </Link>

      {/* Desktop Nav */}
      <Space className="desktop-nav" size="middle" style={{ display: "flex" }}>
        <Link href={ROUTES.HOME}>
          <Button type="text">Jual Paket</Button>
        </Link>

        {isAuthenticated ? (
          <>
            <Link href={ROUTES.TRANSACTIONS}>
              <Button type="text" icon={<HistoryOutlined />}>
                History
              </Button>
            </Link>
            <Button type="text" icon={<CustomerServiceOutlined />} data-testid="support-btn">
              Support
            </Button>
            <Dropdown menu={{ items: customerMenuItems }} placement="bottomRight">
              <Button type="default" icon={<UserOutlined />} data-testid="account-dropdown-btn">
                {user?.name ?? "Account"}
              </Button>
            </Dropdown>
          </>
        ) : (
          <>
            <Button type="text" data-testid="help-btn">
              Help
            </Button>
            <Button
              type="primary"
              onClick={() => router.push(ROUTES.LOGIN)}
              data-testid="login-btn"
            >
              Login
            </Button>
          </>
        )}
      </Space>
    </header>
  );
};
