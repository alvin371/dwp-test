"use client";

import { Space, Tag, Typography } from "antd";
import { motion } from "framer-motion";
import { OPERATOR_DISPLAY_NAMES } from "@/commons/constants";

const CARRIER_KEYS = ["telkomsel", "xl", "indosat", "smartfren", "axis"];

export const TrustedCarriersSection = () => {
  return (
    <section style={{ padding: "32px 24px", textAlign: "center" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <Typography.Text
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: "#8c8c8c",
              textTransform: "uppercase",
              display: "block",
              marginBottom: 16,
            }}
          >
            Trusted by Major Carriers
          </Typography.Text>
          <Space size="small" wrap style={{ justifyContent: "center" }}>
            {CARRIER_KEYS.map((key) => (
              <Tag
                key={key}
                style={{
                  borderRadius: 20,
                  padding: "4px 14px",
                  fontSize: 13,
                  color: "#595959",
                  background: "#fafafa",
                  border: "1px solid #e8e8e8",
                }}
              >
                {OPERATOR_DISPLAY_NAMES[key]}
              </Tag>
            ))}
          </Space>
        </motion.div>
      </div>
    </section>
  );
};
