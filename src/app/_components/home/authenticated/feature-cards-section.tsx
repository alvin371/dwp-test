"use client";

import { Card, Col, Row, Typography } from "antd";
import {
  ThunderboltFilled,
  SafetyCertificateOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: <ThunderboltFilled style={{ fontSize: 24, color: "#fff" }} />,
    iconBg: "#1677ff",
    title: "Instant Delivery",
    desc: "Your data is activated the moment payment clears. No waiting required.",
  },
  {
    icon: <SafetyCertificateOutlined style={{ fontSize: 24, color: "#fff" }} />,
    iconBg: "#52c41a",
    title: "Secure Payment",
    desc: "End-to-end encrypted transactions protect your financial data.",
  },
  {
    icon: <DollarCircleOutlined style={{ fontSize: 24, color: "#fff" }} />,
    iconBg: "#722ed1",
    title: "Best Rates",
    desc: "Competitive pricing across all carriers with no hidden fees.",
  },
];

export const FeatureCardsSection = () => {
  return (
    <section style={{ padding: "48px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Row gutter={[24, 24]}>
          {FEATURES.map((feat, i) => (
            <Col xs={24} md={8} key={i}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.12 }}
              >
                <Card
                  style={{
                    borderRadius: 12,
                    border: "1px solid #f0f0f0",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  }}
                  styles={{ body: { padding: 24 } }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: feat.iconBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {feat.icon}
                    </div>
                    <div>
                      <Typography.Title level={5} style={{ marginBottom: 4 }}>
                        {feat.title}
                      </Typography.Title>
                      <Typography.Text type="secondary" style={{ fontSize: 14 }}>
                        {feat.desc}
                      </Typography.Text>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};
