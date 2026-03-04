"use client";

import { Space, Typography } from "antd";
import { ThunderboltOutlined, HistoryOutlined, UserOutlined } from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@/commons/route";
import { useAuthStore } from "@/libs/stores/auth.store";

export const AppFooter = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const navItems = [
    { icon: <ThunderboltOutlined />, label: "Home", href: ROUTES.HOME },
    {
      icon: <HistoryOutlined />,
      label: "Transactions",
      href: ROUTES.TRANSACTIONS,
      requiresAuth: true,
    },
    {
      icon: <UserOutlined />,
      label: "Account",
      href: isAuthenticated ? ROUTES.CUSTOMER : ROUTES.LOGIN,
    },
  ];

  return (
    <>
      {/* Desktop Footer */}
      <footer
        style={{
          background: "#f5f5f5",
          padding: "16px 24px",
          borderTop: "1px solid #e8e8e8",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
        className="desktop-footer"
      >
        <Typography.Text type="secondary">
          © 2026 DWP Top Up. All rights reserved.
        </Typography.Text>
        <Space size="middle">
          <Typography.Link type="secondary" style={{ fontSize: 13 }}>
            Privacy Policy
          </Typography.Link>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            |
          </Typography.Text>
          <Typography.Link type="secondary" style={{ fontSize: 13 }}>
            Terms of Service
          </Typography.Link>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            |
          </Typography.Text>
          <Typography.Link type="secondary" style={{ fontSize: 13 }}>
            Help Center
          </Typography.Link>
        </Space>
      </footer>

      {/* Mobile Bottom Tab Bar */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#fff",
          boxShadow: "0 -2px 8px rgba(0,0,0,0.08)",
          display: "flex",
          justifyContent: "space-around",
          padding: "8px 0",
          zIndex: 100,
        }}
        className="mobile-nav"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const handleClick = () => {
            if (item.requiresAuth && !isAuthenticated) {
              router.push(ROUTES.LOGIN);
              return;
            }
            router.push(item.href);
          };

          return (
            <button
              key={item.href}
              onClick={handleClick}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                border: "none",
                background: "none",
                cursor: "pointer",
                color: isActive ? "#1677ff" : "#8c8c8c",
                fontSize: 12,
                padding: "4px 16px",
              }}
              data-testid={`mobile-nav-${item.label.toLowerCase()}`}
            >
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
