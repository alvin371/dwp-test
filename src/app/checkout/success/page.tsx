"use client";

import { Button, Result, Typography } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AppHeader } from "@/components/layouts/app-header";
import { AppFooter } from "@/components/layouts/app-footer";
import { getTransactionById } from "@/modules/transactions";
import { ROUTES } from "@/commons/route";
import { OPERATOR_DISPLAY_NAMES } from "@/commons/constants";
import { Suspense } from "react";

const SuccessContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const txnId = searchParams.get("txnId");

  const { data: transaction } = useQuery({
    queryKey: ["transaction", txnId],
    queryFn: () => getTransactionById(txnId!),
    enabled: !!txnId,
  });

  return (
    <Result
      status="success"
      title="Payment Successful!"
      subTitle={
        transaction ? (
          <div style={{ textAlign: "left", maxWidth: 400, margin: "0 auto" }}>
            <Typography.Paragraph>
              <strong>Package:</strong> {transaction.packageName}
            </Typography.Paragraph>
            <Typography.Paragraph>
              <strong>Phone:</strong> {transaction.phoneNumber}
            </Typography.Paragraph>
            <Typography.Paragraph>
              <strong>Operator:</strong>{" "}
              {OPERATOR_DISPLAY_NAMES[transaction.operatorId] ?? transaction.operatorId}
            </Typography.Paragraph>
            <Typography.Paragraph>
              <strong>Amount:</strong> Rp {transaction.amount.toLocaleString("id-ID")}
            </Typography.Paragraph>
            <Typography.Paragraph>
              <strong>Transaction ID:</strong>{" "}
              <Typography.Text code>{transaction.id}</Typography.Text>
            </Typography.Paragraph>
          </div>
        ) : (
          "Your data package has been activated successfully."
        )
      }
      extra={[
        <Button
          type="primary"
          key="home"
          onClick={() => router.push(ROUTES.HOME)}
          data-testid="go-home-btn"
        >
          Buy Another Package
        </Button>,
        <Button
          key="transactions"
          onClick={() => router.push(ROUTES.TRANSACTIONS)}
          data-testid="view-transactions-btn"
        >
          View Transactions
        </Button>,
      ]}
    />
  );
};

export default function CheckoutSuccessPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppHeader />

      <main
        className="main-content"
        style={{
          flex: 1,
          padding: "64px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <SuccessContent />
        </Suspense>
      </main>

      <AppFooter />
    </div>
  );
}
