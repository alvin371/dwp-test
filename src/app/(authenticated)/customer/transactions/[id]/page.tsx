"use client";

import { Button, Card, Descriptions, Skeleton, Space, Tag, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import dayjs from "dayjs";
import { AppHeader } from "@/components/layouts/app-header";
import { AppFooter } from "@/components/layouts/app-footer";
import { getTransactionById } from "@/modules/transactions";
import { TRANSACTION_STATUS_MAP, OPERATOR_DISPLAY_NAMES } from "@/commons/constants";
import { ROUTES } from "@/commons/route";

export default function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: transaction, isLoading } = useQuery({
    queryKey: ["transaction", id],
    queryFn: () => getTransactionById(id),
    enabled: !!id,
  });

  const statusInfo = transaction ? TRANSACTION_STATUS_MAP[transaction.status] : null;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppHeader />

      <main
        className="main-content"
        style={{ flex: 1, padding: "32px 16px", maxWidth: 600, margin: "0 auto", width: "100%" }}
      >
        <Space style={{ marginBottom: 24 }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push(ROUTES.TRANSACTIONS)}
            data-testid="back-to-transactions-btn"
          >
            Back to Transactions
          </Button>
        </Space>

        <Typography.Title level={3} style={{ marginBottom: 24 }}>
          Transaction Receipt
        </Typography.Title>

        {isLoading && <Skeleton active paragraph={{ rows: 8 }} />}

        {transaction && (
          <Card style={{ borderRadius: 12 }} data-testid="transaction-detail-card">
            <Space orientation="vertical" style={{ width: "100%" }} size="large">
              <div style={{ textAlign: "center" }}>
                {statusInfo && (
                  <Tag color={statusInfo.color} style={{ fontSize: 14, padding: "4px 12px" }}>
                    {statusInfo.label}
                  </Tag>
                )}
                <Typography.Title level={3} style={{ marginTop: 12, marginBottom: 4 }}>
                  Rp {transaction.amount.toLocaleString("id-ID")}
                </Typography.Title>
                <Typography.Text type="secondary">{transaction.packageName}</Typography.Text>
              </div>

              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Transaction ID">
                  <Typography.Text code>{transaction.id}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label="Phone Number">
                  {transaction.phoneNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Operator">
                  {OPERATOR_DISPLAY_NAMES[transaction.operatorId] ?? transaction.operatorId}
                </Descriptions.Item>
                <Descriptions.Item label="Package">{transaction.packageName}</Descriptions.Item>
                <Descriptions.Item label="Payment Method">
                  {transaction.paymentMethod}
                </Descriptions.Item>
                <Descriptions.Item label="Date">
                  {dayjs(transaction.createdAt).format("DD MMMM YYYY, HH:mm")}
                </Descriptions.Item>
              </Descriptions>

              <Button
                type="primary"
                block
                onClick={() => router.push(ROUTES.HOME)}
                data-testid="buy-another-btn"
              >
                Buy Another Package
              </Button>
            </Space>
          </Card>
        )}
      </main>

      <AppFooter />
    </div>
  );
}
