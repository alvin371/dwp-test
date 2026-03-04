"use client";

import { Card, Col, Row, Typography } from "antd";
import {
  ThunderboltOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: <ThunderboltOutlined style={{ fontSize: 28, color: "#1677ff" }} />,
    title: "Instant Activation",
    desc: "Your data package activates within seconds of payment. No waiting, no delays.",
  },
  {
    icon: <LockOutlined style={{ fontSize: 28, color: "#1677ff" }} />,
    title: "Secure Payment",
    desc: "All transactions are encrypted and protected with industry-standard security.",
  },
  {
    icon: <UserOutlined style={{ fontSize: 28, color: "#1677ff" }} />,
    title: "No Login Required",
    desc: "Buy data without creating an account. Quick and hassle-free top-up experience.",
  },
];

export const WhyChooseUsSection = () => {
  return (
    <section style={{ background: "#f5f7fa", padding: "80px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Typography.Title level={2} style={{ marginBottom: 8 }}>
            Why Choose Us
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: 16 }}>
            The fastest and most trusted way to top up your mobile data
          </Typography.Text>
        </div>

        <Row gutter={[24, 24]}>
          {FEATURES.map((feat, i) => (
            <Col xs={24} md={8} key={i}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
              >
                <Card
                  style={{
                    height: "100%",
                    borderRadius: 12,
                    border: "1px solid #e8e8e8",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  }}
                  styles={{ body: { padding: 28 } }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 12,
                      background: "#f0f5ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 16,
                    }}
                  >
                    {feat.icon}
                  </div>
                  <Typography.Title level={4} style={{ marginBottom: 8 }}>
                    {feat.title}
                  </Typography.Title>
                  <Typography.Text type="secondary">{feat.desc}</Typography.Text>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};
