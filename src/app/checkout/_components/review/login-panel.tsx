"use client";

import { useState, useEffect } from "react";
import {
  App,
  Button,
  Checkbox,
  Form,
  Input,
  Segmented,
  Space,
  Typography,
} from "antd";
import { ArrowLeftOutlined, SafetyOutlined, LockOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { createZodSync } from "@/utils/zod-sync";
import { sendOtp, verifyOtp } from "@/modules/auth";
import { useAuthStore } from "@/libs/stores/auth.store";
import { formatPhoneDisplay, normalizeIndonesiaPhone } from "@/libs/utils/phone";
import {
  PhoneInputSchema,
  EmailInputSchema,
  OtpVerifySchema,
} from "@/app/(unauthenticated)/login/_components/form/schema";
import type { TLoginMethod, TUser } from "@/modules/auth/types";

const { Text, Paragraph, Link } = Typography;

type TStep = "identifier" | "otp";

const RESEND_COOLDOWN = 120;

export const LoginPanel = () => {
  const { setAuth } = useAuthStore();
  const { message } = App.useApp();

  const [step, setStep] = useState<TStep>("identifier");
  const [method, setMethod] = useState<TLoginMethod>("phone");
  const [identifier, setIdentifier] = useState("");
  const [foundUser, setFoundUser] = useState<TUser | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [otpValue, setOtpValue] = useState("");

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
    mutationKey: ["review-send-otp"],
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
    mutationKey: ["review-verify-otp"],
    mutationFn: verifyOtp,
    onSuccess: (user) => {
      setAuth(user, user.token);
      message.success("Login successful!");
      // No router.push — parent re-renders via Zustand
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

  const handleVerifyOtp = () => {
    if (!foundUser || !termsAccepted || otpValue.length !== 6) return;
    verifyOtpMutation.mutate({ userId: foundUser.id, otp: otpValue });
  };

  const handleResendOtp = () => {
    if (cooldown > 0 || !identifier) return;
    sendOtpMutation.mutate({ method, identifier });
    setCooldown(RESEND_COOLDOWN);
  };

  const handleBack = () => {
    setStep("identifier");
    setFoundUser(null);
    setOtpValue("");
    setTermsAccepted(false);
    otpForm.resetFields();
  };

  const handleMethodChange = (val: string | number) => {
    setMethod(val as TLoginMethod);
    identifierForm.resetFields();
  };

  const canContinue = otpValue.length === 6 && termsAccepted;

  if (step === "otp") {
    return (
      <Space direction="vertical" size={16} style={{ width: "100%" }} data-testid="review-login-panel">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          style={{ padding: 0, color: "#1677ff" }}
        >
          Back
        </Button>

        <Paragraph type="secondary" style={{ margin: 0 }}>
          Enter the 6-digit OTP sent to{" "}
          <Text strong>
            {method === "phone" ? formatPhoneDisplay(identifier) : identifier}
          </Text>
        </Paragraph>

        <Form form={otpForm} layout="vertical">
          <Form.Item name="otp" label="OTP Code" rules={[otpRule]}>
            <Input.OTP
              length={6}
              size="large"
              value={otpValue}
              onChange={(val) => setOtpValue(val)}
              data-testid="review-login-otp-input"
            />
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center" }}>
          <Button
            type="link"
            onClick={handleResendOtp}
            disabled={cooldown > 0 || sendOtpMutation.isPending}
            loading={sendOtpMutation.isPending}
            data-testid="review-login-resend-btn"
            style={{ padding: 0 }}
          >
            {cooldown > 0 ? `Resend OTP (${cooldown}s)` : "Resend OTP"}
          </Button>
        </div>

        <Form.Item style={{ margin: 0 }}>
          <Checkbox
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            data-testid="review-login-terms-checkbox"
          >
            <Text style={{ fontSize: 12 }}>
              I agree to the{" "}
              <Link href="#" target="_blank">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" target="_blank">
                Privacy Policy
              </Link>
            </Text>
          </Checkbox>
        </Form.Item>

        <Button
          type="primary"
          size="large"
          block
          disabled={!canContinue || verifyOtpMutation.isPending}
          loading={verifyOtpMutation.isPending}
          onClick={handleVerifyOtp}
          data-testid="review-login-continue-btn"
          style={{ height: 48 }}
        >
          Continue to Payment →
        </Button>

        <Text type="secondary" style={{ display: "block", textAlign: "center", fontSize: 12 }}>
          Demo OTP: 123456
        </Text>

        <div style={{ textAlign: "center" }}>
          <Link href="mailto:support@dwp.id" style={{ fontSize: 12 }}>
            Need help? Contact Support
          </Link>
        </div>
      </Space>
    );
  }

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }} data-testid="review-login-panel">
      <div>
        <Typography.Title level={5} style={{ marginBottom: 4 }}>
          Login to Continue
        </Typography.Title>
        <Paragraph type="secondary" style={{ margin: 0, fontSize: 13 }}>
          Sign in to complete your purchase securely.
        </Paragraph>
      </div>

      <Form form={identifierForm} layout="vertical" onFinish={handleSendOtp}>
        <Form.Item style={{ marginBottom: 12 }}>
          <Segmented
            block
            value={method}
            onChange={handleMethodChange}
            options={[
              { label: "Phone", value: "phone" },
              { label: "Email", value: "email" },
            ]}
            data-testid="review-login-method-tabs"
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
              data-testid="review-login-phone-input"
            />
          </Form.Item>
        ) : (
          <Form.Item name="email" label="Email Address" rules={[emailRule]}>
            <Input
              placeholder="demo@example.com"
              type="email"
              size="large"
              data-testid="review-login-phone-input"
            />
          </Form.Item>
        )}

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={sendOtpMutation.isPending}
            disabled={sendOtpMutation.isPending}
            block
            size="large"
            data-testid="review-login-send-code-btn"
            style={{ height: 48 }}
          >
            Send Verification Code
          </Button>
        </Form.Item>
      </Form>

      <Space style={{ width: "100%", justifyContent: "center" }} size="large">
        <Space size={6}>
          <SafetyOutlined style={{ color: "#52c41a" }} />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Bank-grade Security
          </Text>
        </Space>
        <Space size={6}>
          <LockOutlined style={{ color: "#1677ff" }} />
          <Text type="secondary" style={{ fontSize: 12 }}>
            256-bit Encrypted
          </Text>
        </Space>
      </Space>

      <div style={{ textAlign: "center" }}>
        <Link href="mailto:support@dwp.id" style={{ fontSize: 12 }}>
          Need help? Contact Support
        </Link>
      </div>
    </Space>
  );
};
