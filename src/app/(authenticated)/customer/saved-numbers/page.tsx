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
import { PlusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AppHeader } from "@/components/layouts/app-header";
import { AppFooter } from "@/components/layouts/app-footer";
import { useAuthStore } from "@/libs/stores/auth.store";
import { createSavedNumber, deleteSavedNumber, getSavedNumbers } from "@/modules/customer";
import { CustomerSidebar } from "../_components/customer-sidebar";
import { SavedNumberCard } from "./_components/saved-number-card";
import { OPERATOR_DISPLAY_NAMES } from "@/commons/constants";
import { ROUTES } from "@/commons/route";
import type { TCreateSavedNumberRequest } from "@/modules/customer/types";


const SAVED_NUMBERS_KEY = "saved-numbers";

export default function SavedNumbersPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm<Omit<TCreateSavedNumberRequest, "userId">>();
  const { message } = App.useApp();

  const { data: savedNumbers, isLoading } = useQuery({
    queryKey: [SAVED_NUMBERS_KEY, user?.id],
    queryFn: () => getSavedNumbers(user!.id),
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationKey: ["create-saved-number"],
    mutationFn: (data: Omit<TCreateSavedNumberRequest, "userId">) =>
      createSavedNumber({ ...data, userId: user!.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SAVED_NUMBERS_KEY] });
      message.success("Saved number added");
      setOpen(false);
      form.resetFields();
    },
    onError: () => {
      message.error("Failed to add saved number");
    },
  });

  const deleteMutation = useMutation({
    mutationKey: ["delete-saved-number"],
    mutationFn: deleteSavedNumber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SAVED_NUMBERS_KEY] });
      message.success("Saved number deleted");
    },
    onError: () => {
      message.error("Failed to delete saved number");
    },
  });

  const operatorOptions = Object.entries(OPERATOR_DISPLAY_NAMES).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f5f6fa" }}>
      <AppHeader />

      <main
        className="main-content"
        style={{ flex: 1, padding: "32px 16px", maxWidth: 1100, margin: "0 auto", width: "100%" }}
      >
        <Row gutter={[24, 24]} align="top">
          <Col xs={24} lg={7}>
            <CustomerSidebar activePath={ROUTES.CUSTOMER_SAVED_NUMBERS} />
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
                  Saved Mobile Numbers
                </Typography.Title>
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                  Manage your saved contacts for instant top-ups.
                </Typography.Text>
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setOpen(true)}
                data-testid="add-saved-number-btn"
              >
                Add New Number
              </Button>
            </div>

            <Card style={{ borderRadius: 12 }} styles={{ body: { padding: 24 } }}>

              {isLoading && (
                <div style={{ textAlign: "center", padding: 48 }}>
                  <Spin size="large" />
                </div>
              )}

              {!isLoading && (!savedNumbers || savedNumbers.length === 0) && (
                <Empty description="No saved numbers yet" style={{ padding: "32px 0" }} />
              )}

              {!isLoading && savedNumbers && savedNumbers.length > 0 && (
                <Row gutter={[16, 16]}>
                  {savedNumbers.map((sn) => (
                    <Col xs={24} sm={12} key={sn.id}>
                      <SavedNumberCard
                        savedNumber={sn}
                        onDelete={(id) => deleteMutation.mutate(id)}
                        isDeleting={deleteMutation.isPending}
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
                  onClick={() => setOpen(true)}
                  data-testid="add-number-cta"
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
                    <PlusCircleOutlined style={{ fontSize: 20, color: "#1677ff" }} />
                  </div>
                  <div>
                    <Typography.Text strong style={{ display: "block", fontSize: 14 }}>
                      Add Another Number
                    </Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      Save more numbers for quick and easy top-ups anytime.
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
        title="Add Saved Number"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={createMutation.isPending}
        data-testid="add-saved-number-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => createMutation.mutate(values)}
          data-testid="add-saved-number-form"
        >
          <Form.Item name="label" label="Label" rules={[{ required: true }]}>
            <Input placeholder="e.g. My Number, Family" data-testid="saved-number-label-input" />
          </Form.Item>
          <Form.Item name="phoneNumber" label="Phone Number" rules={[{ required: true }]}>
            <Input placeholder="e.g. 081234567890" data-testid="saved-number-phone-input" />
          </Form.Item>
          <Form.Item name="operatorId" label="Operator" rules={[{ required: true }]}>
            <Select
              options={operatorOptions}
              placeholder="Select operator"
              data-testid="saved-number-operator-select"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
