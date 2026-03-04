"use client";

import { Col, Row, Typography } from "antd";
import { MobileOutlined, SyncOutlined, CreditCardOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const STEPS = [
  {
    icon: <MobileOutlined style={{ fontSize: 36, color: "#1677ff" }} />,
    number: "1",
    title: "Enter Number",
    desc: "Type your mobile number and we'll automatically detect your carrier.",
  },
  {
    icon: <SyncOutlined style={{ fontSize: 36, color: "#1677ff" }} />,
    number: "2",
    title: "Choose Plan",
    desc: "Browse available data packages and pick the one that fits your needs.",
  },
  {
    icon: <CreditCardOutlined style={{ fontSize: 36, color: "#1677ff" }} />,
    number: "3",
    title: "Pay & Activate",
    desc: "Complete payment securely and your data will be active instantly.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section style={{ background: "#fff", padding: "80px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Typography.Title level={2} style={{ marginBottom: 8 }}>
            How It Works
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: 16 }}>
            Top up your data in three simple steps
          </Typography.Text>
        </div>

        <Row gutter={[32, 32]}>
          {STEPS.map((step, i) => (
            <Col xs={24} md={8} key={i}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                style={{ textAlign: "center", padding: "0 16px" }}
              >
                <div style={{ position: "relative", display: "inline-block", marginBottom: 16 }}>
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      background: "#f0f5ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {step.icon}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -4,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: "#1677ff",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {step.number}
                  </div>
                </div>
                <Typography.Title level={4} style={{ marginBottom: 8 }}>
                  {step.title}
                </Typography.Title>
                <Typography.Text type="secondary">{step.desc}</Typography.Text>
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};
