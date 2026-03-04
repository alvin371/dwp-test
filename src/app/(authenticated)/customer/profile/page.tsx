"use client";

import { useState } from "react";
import {
  App,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Switch,
  Typography,
} from "antd";
import {
  CheckCircleFilled,
  CloudDownloadOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AppHeader } from "@/components/layouts/app-header";
import { AppFooter } from "@/components/layouts/app-footer";
import { useAuthStore } from "@/libs/stores/auth.store";
import { changePassword, updateProfile } from "@/modules/customer";
import { CustomerSidebar } from "../_components/customer-sidebar";
import { ROUTES } from "@/commons/route";
import type { TChangePasswordRequest, TUpdateProfileRequest } from "@/modules/customer/types";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { user, setAuth } = useAuthStore();
  const { message } = App.useApp();

  const [profileForm] = Form.useForm<TUpdateProfileRequest>();
  const [passwordForm] = Form.useForm<TChangePasswordRequest>();

  const [emailMarketing, setEmailMarketing] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [transactionalAlerts, setTransactionalAlerts] = useState(true);
  const [twoStepVerification, setTwoStepVerification] = useState(true);

  const saveProfileMutation = useMutation({
    mutationKey: ["update-profile"],
    mutationFn: (data: TUpdateProfileRequest) => updateProfile(user!.id, data),
    onSuccess: (updated) => {
      if (user) {
        setAuth({ ...user, ...updated }, user.token);
      }
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      message.success("Profile updated successfully");
    },
    onError: () => {
      message.error("Failed to update profile");
    },
  });

  const updatePasswordMutation = useMutation({
    mutationKey: ["change-password"],
    mutationFn: (data: TChangePasswordRequest) => changePassword(user!.id, data.newPassword),
    onSuccess: () => {
      message.success("Password updated successfully");
      passwordForm.resetFields();
    },
    onError: () => {
      message.error("Failed to update password");
    },
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f5f6fa" }}>
      <AppHeader />

      <main
        className="main-content"
        style={{ flex: 1, padding: "32px 16px", maxWidth: 1100, margin: "0 auto", width: "100%" }}
      >
        <Row gutter={[24, 24]} align="top">
          <Col xs={24} lg={7}>
            <CustomerSidebar activePath={ROUTES.CUSTOMER_PROFILE} />
          </Col>

          <Col xs={24} lg={17}>
            {/* Page Header */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 24,
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <Typography.Title level={4} style={{ margin: 0 }}>
                  User Profile &amp; Security Settings
                </Typography.Title>
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                  Manage your personal information and account security
                </Typography.Text>
              </div>
              <Button
                type="primary"
                loading={saveProfileMutation.isPending}
                disabled={saveProfileMutation.isPending}
                onClick={() => profileForm.submit()}
                data-testid="save-changes-btn"
              >
                Save Changes
              </Button>
            </div>

            {/* Row 1: Personal Details + Change Password */}
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Card
                  title="Personal Details"
                  style={{ borderRadius: 12, height: "100%" }}
                  data-testid="personal-details-card"
                >
                  <Form
                    form={profileForm}
                    layout="vertical"
                    initialValues={{
                      name: user?.name,
                      email: user?.email,
                      phone: user?.phone,
                    }}
                    onFinish={(values) => saveProfileMutation.mutate(values)}
                    data-testid="profile-form"
                  >
                    <Form.Item
                      name="name"
                      label="Full Name"
                      rules={[{ required: true, message: "Please enter your full name" }]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        size="large"
                        placeholder="Your name"
                        data-testid="profile-name-input"
                      />
                    </Form.Item>

                    <Form.Item
                      name="email"
                      label="Email Address"
                      rules={[
                        { required: true, message: "Please enter your email" },
                        { type: "email", message: "Please enter a valid email" },
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined />}
                        size="large"
                        placeholder="you@example.com"
                        data-testid="profile-email-input"
                      />
                    </Form.Item>

                    <Form.Item name="phone" label="Primary Phone" style={{ marginBottom: 0 }}>
                      <Input
                        prefix={<PhoneOutlined />}
                        size="large"
                        placeholder="e.g. 081234567890"
                        data-testid="profile-phone-input"
                      />
                    </Form.Item>
                  </Form>
                </Card>
              </Col>

              <Col xs={24} md={12}>
                <Card
                  title="Change Password"
                  style={{ borderRadius: 12, height: "100%" }}
                  data-testid="change-password-card"
                >
                  <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={(values) => updatePasswordMutation.mutate(values)}
                    data-testid="password-form"
                  >
                    <Form.Item
                      name="currentPassword"
                      label="Current Password"
                      rules={[{ required: true, message: "Please enter your current password" }]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        size="large"
                        placeholder="Current password"
                        data-testid="current-password-input"
                      />
                    </Form.Item>

                    <Form.Item
                      name="newPassword"
                      label="New Password"
                      rules={[
                        { required: true, message: "Please enter a new password" },
                        { min: 8, message: "Password must be at least 8 characters" },
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        size="large"
                        placeholder="New password"
                        data-testid="new-password-input"
                      />
                    </Form.Item>

                    <Form.Item
                      name="confirmPassword"
                      label="Confirm New Password"
                      dependencies={["newPassword"]}
                      rules={[
                        { required: true, message: "Please confirm your new password" },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("newPassword") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error("Passwords do not match"));
                          },
                        }),
                      ]}
                      style={{ marginBottom: 16 }}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        size="large"
                        placeholder="Confirm new password"
                        data-testid="confirm-password-input"
                      />
                    </Form.Item>

                    <Button
                      htmlType="submit"
                      block
                      size="large"
                      loading={updatePasswordMutation.isPending}
                      disabled={updatePasswordMutation.isPending}
                      data-testid="update-password-btn"
                    >
                      Update Password
                    </Button>
                  </Form>
                </Card>
              </Col>
            </Row>

            {/* Row 2: Communication Preferences + 2-Step Verification */}
            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
              <Col xs={24} md={12}>
                <Card
                  title="Communication Preferences"
                  style={{ borderRadius: 12, height: "100%" }}
                  data-testid="communication-prefs-card"
                >
                  <div
                    style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}
                  >
                    <div>
                      <Typography.Text strong style={{ display: "block" }}>
                        Email Marketing
                      </Typography.Text>
                      <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                        Receive promotions and special offers via email
                      </Typography.Text>
                    </div>
                    <Switch
                      checked={emailMarketing}
                      onChange={(checked) => {
                        setEmailMarketing(checked);
                        message.success(
                          checked ? "Email marketing enabled" : "Email marketing disabled",
                        );
                      }}
                      data-testid="email-marketing-toggle"
                    />
                  </div>

                  <Divider style={{ margin: "16px 0" }} />

                  <div
                    style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}
                  >
                    <div>
                      <Typography.Text strong style={{ display: "block" }}>
                        SMS Notifications
                      </Typography.Text>
                      <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                        Get important updates sent to your phone
                      </Typography.Text>
                    </div>
                    <Switch
                      checked={smsNotifications}
                      onChange={(checked) => {
                        setSmsNotifications(checked);
                        message.success(
                          checked ? "SMS notifications enabled" : "SMS notifications disabled",
                        );
                      }}
                      data-testid="sms-notifications-toggle"
                    />
                  </div>

                  <Divider style={{ margin: "16px 0" }} />

                  <div
                    style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}
                  >
                    <div>
                      <Typography.Text strong style={{ display: "block" }}>
                        Transactional Alerts
                      </Typography.Text>
                      <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                        Receive confirmations for purchases and transactions
                      </Typography.Text>
                    </div>
                    <Switch
                      checked={transactionalAlerts}
                      onChange={(checked) => {
                        setTransactionalAlerts(checked);
                        message.success(
                          checked
                            ? "Transactional alerts enabled"
                            : "Transactional alerts disabled",
                        );
                      }}
                      data-testid="transactional-alerts-toggle"
                    />
                  </div>
                </Card>
              </Col>

              <Col xs={24} md={12}>
                <Card
                  title="2-Step Verification"
                  extra={
                    <Switch
                      checked={twoStepVerification}
                      onChange={(checked) => {
                        setTwoStepVerification(checked);
                        message.success(
                          checked
                            ? "2-Step Verification enabled"
                            : "2-Step Verification disabled",
                        );
                      }}
                      data-testid="two-step-verification-toggle"
                    />
                  }
                  style={{ borderRadius: 12, height: "100%" }}
                  data-testid="two-step-verification-card"
                >
                  <Typography.Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 8 }}>
                    Add an extra layer of security to your account. When enabled, you&apos;ll be
                    asked for a verification code each time you sign in.
                  </Typography.Text>
                  <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                    We&apos;ll send a one-time code to your registered phone number or email
                    whenever you log in from a new device.
                  </Typography.Text>
                </Card>
              </Col>
            </Row>

            {/* Data Privacy Promise Banner */}
            <Card
              style={{
                marginTop: 24,
                borderRadius: 12,
                background: "#f6ffed",
                border: "1px solid #b7eb8f",
              }}
              styles={{ body: { padding: 24 } }}
              data-testid="data-privacy-card"
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                <CheckCircleFilled style={{ color: "#52c41a", fontSize: 24, flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <Typography.Title level={5} style={{ margin: "0 0 4px", color: "#237804" }}>
                    Our Data Privacy Promise
                  </Typography.Title>
                  <Typography.Text style={{ fontSize: 13, color: "#389e0d", display: "block", marginBottom: 12 }}>
                    Your personal data is encrypted and securely stored. We never sell your
                    information to third parties. You have full control over your data and can
                    request deletion at any time in compliance with applicable privacy regulations.
                  </Typography.Text>
                  <Typography.Link
                    style={{ color: "#389e0d", fontSize: 13 }}
                    data-testid="download-data-link"
                  >
                    <CloudDownloadOutlined style={{ marginRight: 6 }} />
                    Download My Data
                  </Typography.Link>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </main>

      <AppFooter />
    </div>
  );
}
