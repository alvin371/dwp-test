"use client";

import { Collapse, Typography } from "antd";
import { motion } from "framer-motion";

const FAQ_ITEMS = [
  {
    key: "1",
    label: "How long does activation take?",
    children: (
      <Typography.Text type="secondary">
        Activation typically happens within a few seconds after payment is confirmed. In rare cases,
        it may take up to 5 minutes depending on your carrier&apos;s system. If it takes longer, please
        contact our support team.
      </Typography.Text>
    ),
  },
  {
    key: "2",
    label: "Is my payment information secure?",
    children: (
      <Typography.Text type="secondary">
        Yes, absolutely. We use industry-standard TLS encryption for all transactions and never
        store your full card details. All payments are processed through certified payment gateways.
      </Typography.Text>
    ),
  },
  {
    key: "3",
    label: "Which carriers are supported?",
    children: (
      <Typography.Text type="secondary">
        We support all major Indonesian carriers including Telkomsel, XL Axiata, Indosat Ooredoo,
        Smartfren, Axis, and Three (3). More carriers are being added regularly.
      </Typography.Text>
    ),
  },
  {
    key: "4",
    label: "Can I top up someone else's number?",
    children: (
      <Typography.Text type="secondary">
        Yes! You can top up any number — just enter the recipient&apos;s mobile number in the input field.
        This is great for gifting data to family or friends.
      </Typography.Text>
    ),
  },
];

export const FaqSection = () => {
  return (
    <section style={{ background: "#fff", padding: "80px 24px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <Typography.Title level={2} style={{ marginBottom: 8 }}>
              Frequently Asked Questions
            </Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: 16 }}>
              Everything you need to know about DWP Top Up
            </Typography.Text>
          </div>

          <Collapse
            items={FAQ_ITEMS}
            expandIconPlacement="end"
            style={{ borderRadius: 12 }}
          />

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Typography.Link style={{ fontSize: 14 }}>View all FAQs →</Typography.Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
