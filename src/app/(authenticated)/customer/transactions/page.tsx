"use client";

import { App, Button, Card, Col, Input, Row, Select, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DownloadOutlined } from "@ant-design/icons";
import { Table } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import dayjs from "dayjs";
import { AppHeader } from "@/components/layouts/app-header";
import { AppFooter } from "@/components/layouts/app-footer";
import { useAuthStore } from "@/libs/stores/auth.store";
import { getTransactions } from "@/modules/transactions";
import { OPERATOR_COLORS, TRANSACTION_STATUS_MAP } from "@/commons/constants";
import { ROUTES } from "@/commons/route";
import { CustomerSidebar } from "../_components/customer-sidebar";
import { TransactionReceiptPanel } from "./_components/transaction-receipt-panel";
import type { TTransaction } from "@/modules/transactions/types";

const TRANSACTIONS_KEY = "transactions";

const OPERATOR_SHORT_NAMES: Record<string, string> = {
  telkomsel: "Tsel",
  xl: "XL",
  indosat: "Isat",
  smartfren: "Smfren",
  axis: "Axis",
  three: "3",
};

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "success", label: "Successful" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
];

const dateRangeOptions = [
  { value: "7", label: "Last 7 Days" },
  { value: "30", label: "Last 30 Days" },
  { value: "90", label: "Last 3 Months" },
];

export default function TransactionsPage() {
  const { user } = useAuthStore();
  const { message } = App.useApp();
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

  const { data: transactions, isLoading } = useQuery({
    queryKey: [TRANSACTIONS_KEY, user?.id],
    queryFn: () => getTransactions({ userId: user!.id }),
    enabled: !!user,
  });

  const filtered = (transactions ?? []).filter(
    (t) =>
      !statusFilter || t.status === statusFilter,
  ).filter(
    (t) =>
      !searchQuery ||
      t.phoneNumber.includes(searchQuery) ||
      t.packageName.toLowerCase().includes(searchQuery.toLowerCase()),
  ).sort((a, b) => {
    const updatedDiff = dayjs(b.updatedAt).valueOf() - dayjs(a.updatedAt).valueOf();
    if (updatedDiff !== 0) return updatedDiff;
    return dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf();
  });

  const columns: ColumnsType<TTransaction> = [
    {
      title: "DATE",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 130,
      render: (date: string) => (
        <div>
          <Typography.Text strong style={{ display: "block", fontSize: 13 }}>
            {dayjs(date).format("DD MMM YYYY")}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(date).format("HH:mm")}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "MOBILE NUMBER",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 160,
      render: (phone: string, record: TTransaction) => (
        <div>
          <Typography.Text
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: OPERATOR_COLORS[record.operatorId] ?? "#595959",
            }}
          >
            {OPERATOR_SHORT_NAMES[record.operatorId] ?? record.operatorId}
          </Typography.Text>{" "}
          <Typography.Text style={{ fontSize: 13 }}>{phone}</Typography.Text>
        </div>
      ),
    },
    {
      title: "PACKAGE",
      dataIndex: "packageName",
      key: "packageName",
      render: (name: string) => <Typography.Text style={{ fontSize: 13 }}>{name}</Typography.Text>,
    },
    {
      title: "AMOUNT",
      dataIndex: "amount",
      key: "amount",
      width: 100,
      render: (amount: number) => (
        <Typography.Text style={{ fontSize: 13 }}>
          Rp {amount.toLocaleString("id-ID")}
        </Typography.Text>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (status: string) => {
        const info = TRANSACTION_STATUS_MAP[status];
        const tagColor =
          status === "success" ? "success" : status === "pending" ? "warning" : "error";
        return (
          <Tag color={tagColor} data-testid={`status-tag-${status}`} style={{ borderRadius: 6 }}>
            {info?.label ?? status}
          </Tag>
        );
      },
    },
    {
      title: "ACTION",
      key: "action",
      width: 100,
      render: (_: unknown, record: TTransaction) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Button
            type="text"
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => message.info("Downloading receipt...")}
            data-testid={`download-btn-${record.id}`}
          />
          <Button
            type="link"
            size="small"
            style={{ padding: 0 }}
            onClick={() => setSelectedTransactionId(record.id)}
            data-testid={`details-btn-${record.id}`}
          >
            Details
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f5f6fa" }}
    >
      <AppHeader />

      <main
        className="main-content"
        style={{
          flex: 1,
          padding: "32px 16px",
          maxWidth: 1100,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <Row gutter={[24, 24]} align="top">
          <Col xs={24} lg={7}>
            <CustomerSidebar activePath={ROUTES.TRANSACTIONS} />
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
                  Transaction History
                </Typography.Title>
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                  View and download receipts for your recent top-ups.
                </Typography.Text>
              </div>
              <Button
                icon={<DownloadOutlined />}
                data-testid="export-all-btn"
              >
                Export All
              </Button>
            </div>

            <Card style={{ borderRadius: 12 }} styles={{ body: { padding: 24 } }}>

              {/* Filters */}
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginBottom: 20,
                  flexWrap: "wrap",
                }}
              >
                <Input.Search
                  placeholder="Search by mobile number or package..."
                  allowClear
                  style={{ flex: 1, minWidth: 200 }}
                  onSearch={setSearchQuery}
                  onChange={(e) => {
                    if (!e.target.value) setSearchQuery("");
                  }}
                  data-testid="search-input"
                />
                <Select
                  options={dateRangeOptions}
                  defaultValue="30"
                  style={{ width: 140 }}
                  data-testid="date-range-filter"
                />
                <Select
                  options={statusOptions}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  style={{ width: 130 }}
                  data-testid="status-filter"
                />
              </div>

              {/* Table */}
              <Table
                rowKey="id"
                dataSource={filtered}
                columns={columns}
                loading={isLoading}
                scroll={{ x: 600 }}
                data-testid="transactions-table"
                pagination={{
                  pageSize: 5,
                  showTotal: (total, range) =>
                    `Showing ${range[0]} to ${range[1]} of ${total} results`,
                  size: "small",
                }}
              />
            </Card>
          </Col>
        </Row>
      </main>

      <AppFooter />

      <TransactionReceiptPanel
        transactionId={selectedTransactionId}
        onClose={() => setSelectedTransactionId(null)}
        userId={user!.id}
      />
    </div>
  );
}
