"use client";

import { useState, useEffect } from "react";
import { App, Button, Form, Input, Segmented, Space, Typography } from "antd";
import { SafetyOutlined, LockOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createZodSync } from "@/utils/zod-sync";
import { sendOtp, verifyOtp } from "@/modules/auth";
import { useAuthStore } from "@/libs/stores/auth.store";
import { formatPhoneDisplay, normalizeIndonesiaPhone } from "@/libs/utils/phone";
import { ROUTES } from "@/commons/route";
import {
  PhoneInputSchema,
  EmailInputSchema,
  OtpVerifySchema,
} from "./schema";
import type { TLoginMethod, TUser } from "@/modules/auth/types";

type TStep = "identifier" | "otp";

const RESEND_COOLDOWN = 30;

export const LoginForm = () => {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { message } = App.useApp();

  const [step, setStep] = useState<TStep>("identifier");
  const [method, setMethod] = useState<TLoginMethod>("phone");
  const [identifier, setIdentifier] = useState("");
  const [foundUser, setFoundUser] = useState<TUser | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const [identifierForm] = Form.useForm();
  const [otpForm] = Form.useForm();

  const phoneRule = createZodSync(PhoneInputSchema);
  const emailRule = createZodSync(EmailInputSchema);
  const otpRule = createZodSync(OtpVerifySchema);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const sendOtpMutation = useMutation({
    mutationKey: ["send-otp"],
    mutationFn: sendOtp,
    onSuccess: (user) => {
      setFoundUser(user);
      setStep("otp");
      setCooldown(RESEND_COOLDOWN);
      message.success("OTP sent successfully!");
    },
    onError: (error: Error) => {
      message.error(error.message || "Account not found");
    },
  });

  const verifyOtpMutation = useMutation({
    mutationKey: ["verify-otp"],
    mutationFn: verifyOtp,
    onSuccess: (user) => {
      setAuth(user, user.token);
      message.success("Login successful!");
      router.push(ROUTES.HOME);
    },
    onError: (error: Error) => {
      message.error(error.message || "Invalid OTP");
    },
  });

  const handleSendOtp = (values: Record<string, string>) => {
    const id =
      method === "phone"
        ? normalizeIndonesiaPhone(values.phone)
        : values.email.trim();
    setIdentifier(id);
    sendOtpMutation.mutate({ method, identifier: id });
  };

  const handleVerifyOtp = (values: Record<string, string>) => {
    if (!foundUser) return;
    verifyOtpMutation.mutate({ userId: foundUser.id, otp: values.otp });
  };

  const handleResendOtp = () => {
    if (cooldown > 0 || !identifier) return;
    sendOtpMutation.mutate({ method, identifier });
    setCooldown(RESEND_COOLDOWN);
  };

  const handleBack = () => {
    setStep("identifier");
    setFoundUser(null);
    otpForm.resetFields();
  };

  const handleMethodChange = (val: string | number) => {
    setMethod(val as TLoginMethod);
    identifierForm.resetFields();
  };

  if (step === "otp") {
    return (
      <Form
        form={otpForm}
        layout="vertical"
        onFinish={handleVerifyOtp}
        data-testid="login-form"
      >
        <div style={{ marginBottom: 20 }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            data-testid="login-back-btn"
            style={{ padding: 0, color: "#1677ff" }}
          >
            Back
          </Button>
        </div>

        <Typography.Paragraph type="secondary" style={{ marginBottom: 24 }}>
          Enter the OTP sent to your{" "}
          <Typography.Text strong>
            {method === "phone" ? formatPhoneDisplay(identifier) : identifier}
          </Typography.Text>
        </Typography.Paragraph>

        <Form.Item name="otp" label="OTP Code" rules={[otpRule]}>
          <Input.OTP
            length={6}
            size="large"
            data-testid="login-otp-input"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={verifyOtpMutation.isPending}
            disabled={verifyOtpMutation.isPending}
            block
            size="large"
            data-testid="login-verify-otp-btn"
          >
            Verify OTP
          </Button>
        </Form.Item>

        <div style={{ textAlign: "center" }}>
          <Button
            type="link"
            onClick={handleResendOtp}
            disabled={cooldown > 0 || sendOtpMutation.isPending}
            loading={sendOtpMutation.isPending}
            data-testid="login-resend-otp-btn"
            style={{ padding: 0 }}
          >
            {cooldown > 0 ? `Resend OTP (${cooldown}s)` : "Resend OTP"}
          </Button>
        </div>

        <Typography.Text
          type="secondary"
          style={{ display: "block", textAlign: "center", marginTop: 16, fontSize: 12 }}
        >
          Demo OTP: 123456
        </Typography.Text>
      </Form>
    );
  }

  return (
    <Form
      form={identifierForm}
      layout="vertical"
      onFinish={handleSendOtp}
      data-testid="login-form"
    >
      <Form.Item style={{ marginBottom: 20 }}>
        <Segmented
          block
          value={method}
          onChange={handleMethodChange}
          options={[
            { label: "Phone", value: "phone" },
            { label: "Email", value: "email" },
          ]}
          data-testid="login-method-toggle"
        />
      </Form.Item>

      {method === "phone" ? (
        <Form.Item name="phone" label="Phone Number" rules={[phoneRule]}>
          <Input
            addonBefore={
              <span style={{ color: "#595959", fontWeight: 500 }}>+62</span>
            }
            placeholder="81234567890"
            size="large"
            maxLength={20}
            data-testid="login-phone-input"
          />
        </Form.Item>
      ) : (
        <Form.Item name="email" label="Email Address" rules={[emailRule]}>
          <Input
            placeholder="demo@example.com"
            type="email"
            size="large"
            data-testid="login-email-input"
          />
        </Form.Item>
      )}

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={sendOtpMutation.isPending}
          disabled={sendOtpMutation.isPending}
          block
          size="large"
          data-testid="login-send-otp-btn"
        >
          Send OTP
        </Button>
      </Form.Item>

      <Space style={{ width: "100%", justifyContent: "center" }} size="large">
        <Space size={6}>
          <SafetyOutlined style={{ color: "#52c41a" }} />
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Bank-grade Security
          </Typography.Text>
        </Space>
        <Space size={6}>
          <LockOutlined style={{ color: "#1677ff" }} />
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            256-bit Encrypted
          </Typography.Text>
        </Space>
      </Space>
    </Form>
  );
};
