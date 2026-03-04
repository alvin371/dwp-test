"use client";

import { Button, Card, Form, Typography, Space } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { PhoneNumberInput } from "./phone-number-input";
import { useCheckoutStore } from "../_utils/checkout.store";
import { useEffect } from "react";
import { detectOperator } from "@/modules/packages";

type Props = {
  onContinue?: () => void;
};

export const StepNumber = ({ onContinue }: Props = {}) => {
  const { phoneNumber, setPhoneNumber, nextStep } = useCheckoutStore();
  const [form] = Form.useForm<{ phoneNumber: string }>();
  const currentPhone = Form.useWatch("phoneNumber", form) ?? "";
  const detectedOp = detectOperator(currentPhone);

  useEffect(() => {
    form.setFieldValue("phoneNumber", phoneNumber);
  }, [form, phoneNumber]);

  const handleContinue = () => {
    if (currentPhone.length >= 10 && detectedOp) {
      setPhoneNumber(currentPhone, detectedOp);
      nextStep();
      onContinue?.();
    }
  };

  const isValid = currentPhone.length >= 10 && detectedOp !== null;
  const showOperatorError = currentPhone.length >= 4 && detectedOp === null;

  return (
    <Card style={{ maxWidth: 480, margin: "0 auto" }}>
      <Space orientation="vertical" style={{ width: "100%" }} size="large">
        <div>
          <Typography.Title level={4} style={{ marginBottom: 4 }}>
            Enter Phone Number
          </Typography.Title>
          <Typography.Text type="secondary">
            Enter the number you want to top-up data for
          </Typography.Text>
        </div>

        <Form form={form} layout="vertical" initialValues={{ phoneNumber }}>
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            help={showOperatorError ? "Phone number not recognized" : undefined}
            validateStatus={showOperatorError ? "error" : undefined}
          >
            <PhoneNumberInput
              value={currentPhone}
              onChange={(v) => {
                form.setFieldValue("phoneNumber", v);
              }}
            />
          </Form.Item>
        </Form>

        <Button
          type="primary"
          size="large"
          block
          icon={<ArrowRightOutlined />}
          disabled={!isValid}
          onClick={handleContinue}
          data-testid="step-number-continue-btn"
        >
          Continue
        </Button>
      </Space>
    </Card>
  );
};
