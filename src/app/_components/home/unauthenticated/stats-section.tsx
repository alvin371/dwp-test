"use client";

import { Col, Row, Typography } from "antd";
import { motion } from "framer-motion";

const STATS = [
  { value: "2M+", label: "Top-ups Processed" },
  { value: "150+", label: "Countries Supported" },
  { value: "99.9%", label: "Success Rate" },
  { value: "24/7", label: "Customer Support" },
];

export const StatsSection = () => {
  return (
    <section style={{ background: "#fafafa", padding: "48px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Row gutter={[16, 16]} justify="center">
          {STATS.map((stat, i) => (
            <Col xs={12} md={6} key={i}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{ textAlign: "center", padding: "16px 0" }}
              >
                <Typography.Title
                  level={2}
                  style={{ color: "#1677ff", marginBottom: 4, fontSize: 36 }}
                >
                  {stat.value}
                </Typography.Title>
                <Typography.Text type="secondary" style={{ fontSize: 14 }}>
                  {stat.label}
                </Typography.Text>
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};
