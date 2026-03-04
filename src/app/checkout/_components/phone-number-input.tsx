"use client";

import { Input, Tag, Typography } from "antd";
import { PhoneOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { detectOperator } from "@/modules/packages";
import { OPERATOR_DISPLAY_NAMES, OPERATOR_COLORS } from "@/commons/constants";
import type { TDetectedOperator } from "@/modules/packages/types";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  onOperatorDetected?: (operator: TDetectedOperator) => void;
  size?: "large" | "middle" | "small";
};

export const PhoneNumberInput = ({ value = "", onChange, onOperatorDetected, size = "large" }: Props) => {
  const detectedOperator = detectOperator(value);

  useEffect(() => {
    onOperatorDetected?.(detectedOperator);
  }, [detectedOperator, onOperatorDetected]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const formatted = raw.startsWith("62") ? "0" + raw.slice(2) : raw;
    onChange?.(formatted);
  };

  return (
    <div>
      <Input
        prefix={<PhoneOutlined />}
        placeholder="e.g. 08123456789"
        value={value}
        onChange={handleChange}
        size={size}
        maxLength={13}
        data-testid="phone-number-input"
        suffix={
          detectedOperator && (
            <Tag color={OPERATOR_COLORS[detectedOperator]} style={{ marginRight: 0 }}>
              {OPERATOR_DISPLAY_NAMES[detectedOperator]}
            </Tag>
          )
        }
      />
      {detectedOperator && (
        <Typography.Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
          Operator: {OPERATOR_DISPLAY_NAMES[detectedOperator]}
        </Typography.Text>
      )}
    </div>
  );
};
