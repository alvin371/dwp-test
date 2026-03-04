"use client";

import { Tag, Typography, Space } from "antd";
import Link from "next/link";
import dayjs from "dayjs";
import { TRANSACTION_STATUS_MAP, OPERATOR_DISPLAY_NAMES } from "@/commons/constants";
import { ROUTES } from "@/commons/route";
import type { TTransaction } from "@/modules/transactions/types";

type Props = {
  transaction: TTransaction;
};

export const TransactionRow = ({ transaction }: Props) => {
  const statusInfo = TRANSACTION_STATUS_MAP[transaction.status];

  return (
    <Space orientation="vertical" size={0} style={{ width: "100%" }}>
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <Link href={ROUTES.TRANSACTION_DETAIL(transaction.id)}>
          <Typography.Text strong style={{ color: "#1677ff" }}>
            {transaction.packageName}
          </Typography.Text>
        </Link>
        <Tag color={statusInfo?.color}>{statusInfo?.label ?? transaction.status}</Tag>
      </Space>
      <Space>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {transaction.phoneNumber}
        </Typography.Text>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          •
        </Typography.Text>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {OPERATOR_DISPLAY_NAMES[transaction.operatorId] ?? transaction.operatorId}
        </Typography.Text>
      </Space>
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <Typography.Text strong>
          Rp {transaction.amount.toLocaleString("id-ID")}
        </Typography.Text>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {dayjs(transaction.createdAt).format("DD MMM YYYY, HH:mm")}
        </Typography.Text>
      </Space>
    </Space>
  );
};
