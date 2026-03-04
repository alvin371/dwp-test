"use client";

import { Typography } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { motion } from "framer-motion";

const { Text } = Typography;

type TPaymentOptionCardProps = {
  label: string;
  color?: string;
  selected: boolean;
  onClick: () => void;
  "data-testid"?: string;
};

export const PaymentOptionCard = ({
  label,
  color = "#1677ff",
  selected,
  onClick,
  "data-testid": testId,
}: TPaymentOptionCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      data-testid={testId}
      style={{
        padding: "10px 14px",
        borderRadius: 8,
        border: `2px solid ${selected ? color : "#e8eef8"}`,
        background: selected ? `${color}10` : "#fff",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 10,
        transition: "border-color 0.2s, background 0.2s",
        userSelect: "none",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 11, fontWeight: 700, lineHeight: 1 }}>
          {label.slice(0, 2).toUpperCase()}
        </Text>
      </div>
      <Text style={{ flex: 1, fontWeight: selected ? 600 : 400 }}>{label}</Text>
      {selected && <CheckCircleFilled style={{ color, fontSize: 18 }} />}
    </motion.div>
  );
};
