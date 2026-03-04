"use client";

import {
  App,
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Spin,
  Typography,
} from "antd";
import { CreditCardOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AppHeader } from "@/components/layouts/app-header";
import { AppFooter } from "@/components/layouts/app-footer";
import { useAuthStore } from "@/libs/stores/auth.store";
import {
  createPaymentMethod,
  deletePaymentMethod,
  getPaymentMethods,
  setDefaultPaymentMethod,
  updatePaymentMethod,
} from "@/modules/customer";
import { CustomerSidebar } from "../_components/customer-sidebar";
import { PaymentMethodCard } from "./_components/payment-method-card";
import { ROUTES } from "@/commons/route";
import type {
  TCreatePaymentMethodRequest,
  TPaymentMethod,
  TPaymentMethodType,
  TUpdatePaymentMethodRequest,
} from "@/modules/customer/types";

const PM_KEY = "payment-methods";

const CARD_BRAND_OPTIONS = [
  { value: "visa", label: "Visa" },
  { value: "mastercard", label: "Mastercard" },
];

const WALLET_BRAND_OPTIONS = [
  { value: "gopay", label: "GoPay" },
  { value: "ovo", label: "OVO" },
  { value: "shopee_pay", label: "ShopeePay" },
  { value: "link_aja", label: "LinkAja" },
  { value: "dana", label: "DANA" },
];

export default function PaymentMethodsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<TPaymentMethod | null>(null);
  const [selectedType, setSelectedType] = useState<TPaymentMethodType>("credit_card");
  const [form] = Form.useForm<TCreatePaymentMethodRequest>();
  const { message } = App.useApp();

  const { data: paymentMethods, isLoading } = useQuery({
    queryKey: [PM_KEY, user?.id],
    queryFn: () => getPaymentMethods(user!.id),
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationKey: ["create-payment-method"],
    mutationFn: (data: TCreatePaymentMethodRequest) => createPaymentMethod(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PM_KEY] });
      message.success("Payment method added");
      closeModal();
    },
    onError: () => message.error("Failed to add payment method"),
  });

  const updateMutation = useMutation({
    mutationKey: ["update-payment-method"],
    mutationFn: ({ id, data }: { id: string; data: TUpdatePaymentMethodRequest }) =>
      updatePaymentMethod(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PM_KEY] });
      message.success("Payment method updated");
      closeModal();
    },
    onError: () => message.error("Failed to update payment method"),
  });

  const deleteMutation = useMutation({
    mutationKey: ["delete-payment-method"],
    mutationFn: deletePaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PM_KEY] });
      message.success("Payment method removed");
    },
    onError: () => message.error("Failed to remove payment method"),
  });

  const setDefaultMutation = useMutation({
    mutationKey: ["set-default-payment-method"],
    mutationFn: (id: string) => setDefaultPaymentMethod(id, user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PM_KEY] });
      message.success("Default payment method updated");
    },
    onError: () => message.error("Failed to update default"),
  });

  const openAdd = () => {
    setEditingMethod(null);
    setSelectedType("credit_card");
    form.resetFields();
    form.setFieldValue("type", "credit_card");
    setOpen(true);
  };

  const openEdit = (method: TPaymentMethod) => {
    setEditingMethod(method);
    setSelectedType(method.type);
    form.setFieldsValue({
      type: method.type,
      brand: method.brand,
      expiryMonth: method.expiryMonth,
      expiryYear: method.expiryYear,
      walletBrand: method.walletBrand,
      accountIdentifier: method.accountIdentifier,
    });
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditingMethod(null);
    form.resetFields();
  };

  const handleSubmit = (values: TCreatePaymentMethodRequest) => {
    if (editingMethod) {
      updateMutation.mutate({
        id: editingMethod.id,
        data: {
          type: values.type,
          brand: values.brand,
          expiryMonth: values.expiryMonth,
          expiryYear: values.expiryYear,
          walletBrand: values.walletBrand,
          accountIdentifier: values.accountIdentifier,
        },
      });
    } else {
      createMutation.mutate({ ...values, userId: user!.id });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f5f6fa" }}>
      <AppHeader />

      <main
        className="main-content"
        style={{ flex: 1, padding: "32px 16px", maxWidth: 1100, margin: "0 auto", width: "100%" }}
      >
        <Row gutter={[24, 24]} align="top">
          <Col xs={24} lg={7}>
            <CustomerSidebar activePath={ROUTES.CUSTOMER_PAYMENT_METHODS} />
          </Col>

          <Col xs={24} lg={17}>
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
                  Payment Methods
                </Typography.Title>
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                  Manage your saved payment methods for seamless checkout.
                </Typography.Text>
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={openAdd}
                data-testid="add-payment-method-btn"
              >
                Add New Payment Method
              </Button>
            </div>

            <Card style={{ borderRadius: 12 }} styles={{ body: { padding: 24 } }}>

              {isLoading && (
                <div style={{ textAlign: "center", padding: 48 }}>
                  <Spin size="large" />
                </div>
              )}

              {!isLoading && (!paymentMethods || paymentMethods.length === 0) && (
                <Empty description="No payment methods yet" style={{ padding: "32px 0" }} />
              )}

              {!isLoading && paymentMethods && paymentMethods.length > 0 && (
                <Row gutter={[16, 16]}>
                  {paymentMethods.map((pm) => (
                    <Col xs={24} sm={12} key={pm.id}>
                      <PaymentMethodCard
                        paymentMethod={pm}
                        onDelete={(id) => deleteMutation.mutate(id)}
                        onSetDefault={(id) => setDefaultMutation.mutate(id)}
                        onEdit={openEdit}
                        isDeleting={deleteMutation.isPending}
                        isSettingDefault={setDefaultMutation.isPending}
                      />
                    </Col>
                  ))}
                </Row>
              )}

              {/* Bottom CTA */}
              {!isLoading && (
                <div
                  style={{
                    marginTop: 24,
                    border: "1.5px dashed #d9d9d9",
                    borderRadius: 10,
                    padding: "20px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    cursor: "pointer",
                    background: "#fafafa",
                  }}
                  onClick={openAdd}
                  data-testid="add-payment-method-cta"
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "#e6f4ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <CreditCardOutlined style={{ fontSize: 20, color: "#1677ff" }} />
                  </div>
                  <div>
                    <Typography.Text strong style={{ display: "block", fontSize: 14 }}>
                      Add Another Card
                    </Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      Save a new payment method to quickly and securely purchase data packages.
                    </Typography.Text>
                  </div>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </main>

      <AppFooter />

      <Modal
        title={editingMethod ? "Edit Payment Method" : "Add Payment Method"}
        open={open}
        onCancel={closeModal}
        onOk={() => form.submit()}
        confirmLoading={isPending}
        data-testid="payment-method-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ type: "credit_card" }}
          data-testid="payment-method-form"
        >
          <Form.Item name="type" label="Payment Type" rules={[{ required: true }]}>
            <Select
              options={[
                { value: "credit_card", label: "Credit / Debit Card" },
                { value: "e_wallet", label: "E-Wallet" },
              ]}
              onChange={(v) => {
                setSelectedType(v as TPaymentMethodType);
                form.resetFields(["brand", "cardNumber", "expiryMonth", "expiryYear", "walletBrand", "accountIdentifier"]);
              }}
              data-testid="payment-type-select"
            />
          </Form.Item>

          {selectedType === "credit_card" && (
            <>
              <Form.Item name="brand" label="Card Brand" rules={[{ required: true }]}>
                <Select options={CARD_BRAND_OPTIONS} placeholder="Select brand" data-testid="card-brand-select" />
              </Form.Item>
              {!editingMethod && (
                <Form.Item
                  name="cardNumber"
                  label="Card Number"
                  rules={[
                    { required: true },
                    { pattern: /^[\d\s]{13,19}$/, message: "Enter a valid card number" },
                  ]}
                >
                  <Input maxLength={19} placeholder="1234 5678 9012 3456" data-testid="card-number-input" />
                </Form.Item>
              )}
              <Row gutter={8}>
                <Col span={11}>
                  <Form.Item name="expiryMonth" label="Expiry Month" rules={[{ required: true }]}>
                    <Input maxLength={2} placeholder="MM" data-testid="expiry-month-input" />
                  </Form.Item>
                </Col>
                <Col span={2} style={{ display: "flex", alignItems: "center", paddingTop: 30 }}>
                  <span style={{ textAlign: "center", width: "100%" }}>/</span>
                </Col>
                <Col span={11}>
                  <Form.Item name="expiryYear" label="Expiry Year" rules={[{ required: true }]}>
                    <Input maxLength={2} placeholder="YY" data-testid="expiry-year-input" />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          {selectedType === "e_wallet" && (
            <>
              <Form.Item name="walletBrand" label="Wallet" rules={[{ required: true }]}>
                <Select options={WALLET_BRAND_OPTIONS} placeholder="Select wallet" data-testid="wallet-brand-select" />
              </Form.Item>
              <Form.Item
                name="accountIdentifier"
                label="Phone Number"
                rules={[{ required: true }]}
              >
                <Input placeholder="e.g. 08123456789" data-testid="wallet-phone-input" />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
}
