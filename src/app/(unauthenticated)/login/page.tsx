"use client";

import { Card, Typography, Space } from "antd";
import { WifiOutlined } from "@ant-design/icons";
import Link from "next/link";
import { ROUTES } from "@/commons/route";
import { LoginForm } from "./_components/form/login-form";

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background:
          "linear-gradient(135deg, #e8eaf6 0%, #f0f4ff 50%, #e3f2fd 100%)",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
        data-testid="login-card"
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <Link
              href={ROUTES.HOME}
              style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "#1677ff",
                  marginBottom: 12,
                }}
              >
                <WifiOutlined style={{ fontSize: 24, color: "#fff" }} />
              </div>
              <Typography.Text
                style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#262626" }}
              >
                DWP Top Up
              </Typography.Text>
            </Link>
            <Typography.Title level={3} style={{ margin: "8px 0 4px" }}>
              Welcome Back
            </Typography.Title>
            <Typography.Text type="secondary">
              Log in to manage your data plans
            </Typography.Text>
          </div>

          <LoginForm />

          <Typography.Text
            type="secondary"
            style={{ display: "block", textAlign: "center", fontSize: 13 }}
          >
            Don&apos;t have an account?{" "}
            <Typography.Link href="#">Sign up</Typography.Link>
          </Typography.Text>
        </Space>
      </Card>
    </div>
  );
}
