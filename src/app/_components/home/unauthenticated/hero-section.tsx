"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Typography, Tag, Space, Avatar } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { motion } from "framer-motion";
import { PhoneNumberInput } from "@/app/checkout/_components/phone-number-input";
import { useCheckoutStore } from "@/app/checkout/_utils/checkout.store";
import { ROUTES } from "@/commons/route";
import { detectOperator } from "@/modules/packages";

const RECENT_ACTIVITY = [
  { name: "User ***89", action: "topped up 10GB", operator: "Telkomsel", color: "#ff4d4f" },
  { name: "User ***34", action: "topped up 5GB", operator: "XL Axiata", color: "#1677ff" },
  { name: "User ***72", action: "topped up 20GB", operator: "Indosat Ooredoo", color: "#faad14" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export const UnauthHeroSection = () => {
  const router = useRouter();
  const { setPhoneNumber, goToStep } = useCheckoutStore();
  const [phone, setPhone] = useState("");

  const handleSeePackages = () => {
    if (phone.length >= 9) {
      setPhoneNumber(phone, detectOperator(phone));
      goToStep(2);
      router.push(ROUTES.CHECKOUT);
    }
  };

  return (
    <section
      style={{
        background: "linear-gradient(135deg, #f0f5ff 0%, #ffffff 60%)",
        padding: "64px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
          alignItems: "center",
        }}
        className="hero-grid"
      >
        {/* Left Side */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography.Title level={1} style={{ marginBottom: 8, lineHeight: 1.2 }}>
            Jual Paket Internet Termurah{" "}
            <span style={{ color: "#1677ff", display: "block" }}>
              Semua Operator hanya di DWP Top Up
            </span>
          </Typography.Title>
          <Typography.Paragraph
            style={{ fontSize: 16, color: "#595959", marginBottom: 32, maxWidth: 420 }}
          >
            Top up data cepat, aman, dan tersedia untuk semua operator utama Indonesia.
          </Typography.Paragraph>

          {/* Recent Activity Chips */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ marginBottom: 24 }}
          >
            {RECENT_ACTIVITY.map((item, i) => (
              <motion.div key={i} variants={itemVariants} style={{ marginBottom: 8 }}>
                <Space
                  style={{
                    background: "#fff",
                    border: "1px solid #f0f0f0",
                    borderRadius: 20,
                    padding: "6px 12px",
                    display: "inline-flex",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  }}
                >
                  <Avatar size={20} style={{ background: item.color, flexShrink: 0 }} />
                  <Typography.Text style={{ fontSize: 13 }}>
                    {item.name} {item.action}
                  </Typography.Text>
                  <Tag color="blue" style={{ marginRight: 0, fontSize: 11 }}>
                    {item.operator}
                  </Tag>
                </Space>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust badges */}
          <Space size="middle">
            <Space size={4}>
              <CheckCircleFilled style={{ color: "#52c41a", fontSize: 14 }} />
              <Typography.Text style={{ fontSize: 13, color: "#52c41a", fontWeight: 500 }}>
                Verified Carriers
              </Typography.Text>
            </Space>
            <Space size={4}>
              <CheckCircleFilled style={{ color: "#52c41a", fontSize: 14 }} />
              <Typography.Text style={{ fontSize: 13, color: "#52c41a", fontWeight: 500 }}>
                Instant Delivery
              </Typography.Text>
            </Space>
          </Space>
        </motion.div>

        {/* Right Side — Quick Top Up Card */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card
            style={{
              borderRadius: 12,
              boxShadow: "0 8px 32px rgba(22,119,255,0.12)",
              border: "1px solid #e6f0ff",
            }}
            styles={{ body: { padding: 28 } }}
          >
            <Typography.Title level={4} style={{ marginBottom: 4 }}>
              DWP Top Up Cepat
            </Typography.Title>
            <Typography.Text type="secondary" style={{ display: "block", marginBottom: 20 }}>
              Masukkan nomor untuk melihat paket yang tersedia
            </Typography.Text>

            <div style={{ marginBottom: 16 }}>
              <PhoneNumberInput
                value={phone}
                onChange={setPhone}
                size="large"
              />
            </div>

            <Button
              type="primary"
              block
              size="large"
              onClick={handleSeePackages}
              disabled={phone.length < 9}
              data-testid="see-packages-btn"
            >
              Lihat Paket →
            </Button>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
