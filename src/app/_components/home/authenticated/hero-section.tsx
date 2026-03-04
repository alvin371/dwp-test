"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Space, Tag, Typography } from "antd";
import {
  GlobalOutlined,
  QrcodeOutlined,
  StarOutlined,
  HeartOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { detectOperator } from "@/modules/packages";
import { getSavedNumbers } from "@/modules/customer";
import { useCheckoutStore } from "@/app/checkout/_utils/checkout.store";
import { useAuthStore } from "@/libs/stores/auth.store";
import { ROUTES } from "@/commons/route";

const SAVED_NUMBER_ICONS = [
  <StarOutlined key="star" />,
  <HeartOutlined key="heart" />,
  <PhoneOutlined key="phone" />,
];

export const AuthHeroSection = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { setPhoneNumber, goToStep } = useCheckoutStore();
  const [phone, setPhone] = useState("");

  const { data: savedNumbers } = useQuery({
    queryKey: ["saved-numbers", user?.id],
    queryFn: () => getSavedNumbers(user!.id),
    enabled: !!user?.id,
  });

  const handleContinue = () => {
    if (phone.length >= 9) {
      const op = detectOperator(phone);
      setPhoneNumber(phone, op);
      goToStep(2);
      router.push(ROUTES.CHECKOUT);
    }
  };

  const handleSavedNumberClick = (savedPhone: string, savedOperatorId: string) => {
    setPhoneNumber(savedPhone, savedOperatorId);
    goToStep(2);
    router.push(ROUTES.CHECKOUT);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const formatted = raw.startsWith("62") ? "0" + raw.slice(2) : raw;
    setPhone(formatted);
  };

  return (
    <section style={{ background: "#f5f7fa", padding: "80px 24px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Badge */}
          <div style={{ marginBottom: 16 }}>
            <Tag
              color="blue"
              style={{
                borderRadius: 20,
                padding: "4px 14px",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.06em",
              }}
              data-testid="auth-hero-badge"
            >
              ● FAST &amp; SECURE
            </Tag>
          </div>

          <Typography.Title level={1} style={{ marginBottom: 12 }}>
            Instant Data Top-up
          </Typography.Title>

          <Typography.Paragraph
            style={{ fontSize: 16, color: "#595959", marginBottom: 32, maxWidth: 480, margin: "0 auto 32px" }}
          >
            Recharge your mobile data in seconds. Choose a plan, pay, and you&apos;re connected.
          </Typography.Paragraph>

          {/* Phone input card */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 4px 24px rgba(22,119,255,0.10)",
              padding: 8,
              marginBottom: 16,
            }}
          >
            <Space.Compact style={{ width: "100%" }}>
              <Input
                prefix={<GlobalOutlined style={{ color: "#8c8c8c" }} />}
                placeholder="Enter mobile number"
                value={phone}
                onChange={handlePhoneChange}
                size="large"
                maxLength={13}
                suffix={<QrcodeOutlined style={{ color: "#8c8c8c", cursor: "pointer" }} />}
                style={{ borderRadius: "12px 0 0 12px", border: "none", boxShadow: "none" }}
                data-testid="auth-phone-input"
              />
              <Button
                type="primary"
                size="large"
                onClick={handleContinue}
                disabled={phone.length < 9}
                style={{ borderRadius: "0 12px 12px 0", paddingLeft: 20, paddingRight: 20 }}
                data-testid="auth-continue-btn"
              >
                Continue →
              </Button>
            </Space.Compact>
          </div>

          {/* Quick Top-Up saved numbers */}
          {savedNumbers && savedNumbers.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <Space size="small" wrap style={{ justifyContent: "center" }}>
                <Typography.Text
                  type="secondary"
                  style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.05em" }}
                >
                  QUICK TOP-UP:
                </Typography.Text>
                {savedNumbers.slice(0, 3).map((saved, i) => (
                  <Button
                    key={saved.id}
                    type="default"
                    size="small"
                    icon={SAVED_NUMBER_ICONS[i]}
                    onClick={() => handleSavedNumberClick(saved.phoneNumber, saved.operatorId)}
                    style={{ borderRadius: 20 }}
                    data-testid={`quick-topup-${i}`}
                  >
                    {saved.label || saved.phoneNumber}
                  </Button>
                ))}
              </Space>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
