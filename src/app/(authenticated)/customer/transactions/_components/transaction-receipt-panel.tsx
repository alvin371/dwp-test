"use client";

import { Avatar, Button, Divider, Typography } from "antd";
import {
  CheckCircleFilled,
  ClockCircleFilled,
  CloseCircleFilled,
  CloseOutlined,
} from "@ant-design/icons";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getTransactionById } from "@/modules/transactions";
import { getPackageById } from "@/modules/packages";
import { getSavedNumbers } from "@/modules/customer";
import { OPERATOR_DISPLAY_NAMES, PAYMENT_METHODS } from "@/commons/constants";
import { ROUTES } from "@/commons/route";
import { useCheckoutStore } from "@/app/checkout/_utils/checkout.store";

const SERVICE_FEE = 2000;

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

type Props = {
  transactionId: string | null;
  onClose: () => void;
  userId: string;
};

export const TransactionReceiptPanel = ({ transactionId, onClose, userId }: Props) => {
  const router = useRouter();
  const { setPhoneNumber, setSelectedPackage, goToStep } = useCheckoutStore();

  const { data: transaction } = useQuery({
    queryKey: ["transaction", transactionId],
    queryFn: () => getTransactionById(transactionId!),
    enabled: !!transactionId,
  });

  const { data: savedNumbers } = useQuery({
    queryKey: ["saved-numbers", userId],
    queryFn: () => getSavedNumbers(userId),
    enabled: !!userId,
  });

  const savedNumber = savedNumbers?.find((sn) => sn.phoneNumber === transaction?.phoneNumber);

  const serviceFee = SERVICE_FEE;
  const tax = transaction ? Math.round(transaction.amount * 0.1) : 0;
  const totalPaid = transaction ? transaction.amount + serviceFee + tax : 0;

  const statusConfig = {
    success: {
      icon: <CheckCircleFilled style={{ fontSize: 56, color: "#52c41a" }} />,
      label: "Payment Successful",
      color: "#52c41a",
    },
    pending: {
      icon: <ClockCircleFilled style={{ fontSize: 56, color: "#faad14" }} />,
      label: "Payment Pending",
      color: "#faad14",
    },
    failed: {
      icon: <CloseCircleFilled style={{ fontSize: 56, color: "#ff4d4f" }} />,
      label: "Payment Failed",
      color: "#ff4d4f",
    },
  };

  const status = transaction?.status ?? "pending";
  const statusInfo = statusConfig[status] ?? statusConfig.pending;

  const paymentMethodLabel =
    PAYMENT_METHODS.find((p) => p.value === transaction?.paymentMethod)?.label ??
    transaction?.paymentMethod ??
    "-";

  const operatorName = transaction ? (OPERATOR_DISPLAY_NAMES[transaction.operatorId] ?? transaction.operatorId) : "";
  const contactLabel = savedNumber?.label ?? transaction?.phoneNumber ?? "";
  const contactInitials = savedNumber ? getInitials(savedNumber.label) : (transaction?.phoneNumber?.slice(-2) ?? "??");

  const handleRepurchase = async () => {
    if (!transaction) return;

    setPhoneNumber(transaction.phoneNumber, transaction.operatorId);

    try {
      const pkg = await getPackageById(transaction.packageId);
      if (pkg) {
        setSelectedPackage(pkg);
      }
    } catch {
      // Continue to checkout even if package prefill fails.
    }

    goToStep(2);
    router.push(ROUTES.CHECKOUT);
  };

  return (
    <AnimatePresence>
      {transactionId && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              background: "rgba(0,0,0,0.45)",
            }}
            data-testid="receipt-panel-backdrop"
          />

          {/* Slide-in panel */}
          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            style={{
              position: "fixed",
              right: 0,
              top: 0,
              bottom: 0,
              width: 440,
              zIndex: 201,
              overflowY: "auto",
              background: "#fff",
              boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
              padding: 24,
            }}
            data-testid="receipt-panel"
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 24,
              }}
            >
              <Typography.Title level={5} style={{ margin: 0 }}>
                Receipt
              </Typography.Title>
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={onClose}
                data-testid="receipt-panel-close"
              />
            </div>

            {transaction && (
              <>
                {/* Status */}
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  {statusInfo.icon}
                  <Typography.Text
                    style={{ display: "block", marginTop: 8, color: statusInfo.color, fontWeight: 600 }}
                  >
                    {statusInfo.label}
                  </Typography.Text>
                  <Typography.Title level={3} style={{ margin: "4px 0 0" }}>
                    Rp {transaction.amount.toLocaleString("id-ID")}
                  </Typography.Title>
                </div>

                {/* Contact card */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    background: "#f5f6fa",
                    borderRadius: 10,
                    marginBottom: 20,
                  }}
                >
                  <Avatar style={{ backgroundColor: "#1677ff", flexShrink: 0 }}>
                    {contactInitials}
                  </Avatar>
                  <div>
                    <Typography.Text strong style={{ display: "block" }}>
                      {contactLabel}
                    </Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      {operatorName}
                    </Typography.Text>
                  </div>
                </div>

                {/* Transaction Info */}
                <Typography.Text
                  type="secondary"
                  style={{
                    fontSize: 11,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: 12,
                  }}
                >
                  Transaction Info
                </Typography.Text>

                <div style={{ marginBottom: 20 }}>
                  {[
                    { label: "Transaction ID", value: transaction.id },
                    {
                      label: "Order Date",
                      value: dayjs(transaction.createdAt).format("DD MMM YYYY, HH:mm"),
                    },
                    { label: "Payment Method", value: paymentMethodLabel },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        paddingBottom: 10,
                        gap: 8,
                      }}
                    >
                      <Typography.Text type="secondary" style={{ fontSize: 13, flexShrink: 0 }}>
                        {label}
                      </Typography.Text>
                      <Typography.Text
                        style={{ fontSize: 13, textAlign: "right", wordBreak: "break-all" }}
                      >
                        {value}
                      </Typography.Text>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <Typography.Text
                  type="secondary"
                  style={{
                    fontSize: 11,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: 12,
                  }}
                >
                  Order Summary
                </Typography.Text>

                <div
                  style={{
                    border: "1px solid #e8e8e8",
                    borderRadius: 10,
                    padding: "16px",
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}
                  >
                    <Typography.Text style={{ fontSize: 13 }}>
                      {transaction.packageName}
                    </Typography.Text>
                    <Typography.Text style={{ fontSize: 13 }}>
                      Rp {transaction.amount.toLocaleString("id-ID")}
                    </Typography.Text>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}
                  >
                    <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                      Service Fee
                    </Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                      Rp {serviceFee.toLocaleString("id-ID")}
                    </Typography.Text>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}
                  >
                    <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                      Tax (10%)
                    </Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                      Rp {tax.toLocaleString("id-ID")}
                    </Typography.Text>
                  </div>
                  <Divider style={{ margin: "0 0 12px" }} />
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography.Text strong>Total Paid</Typography.Text>
                    <Typography.Text strong>Rp {totalPaid.toLocaleString("id-ID")}</Typography.Text>
                  </div>
                </div>

                {/* Actions */}
                <Button
                  type="primary"
                  block
                  onClick={handleRepurchase}
                  style={{ marginBottom: 12 }}
                  data-testid="receipt-repurchase-btn"
                >
                  Re-purchase this plan
                </Button>
                <div style={{ textAlign: "center" }}>
                  <Typography.Link type="secondary" style={{ fontSize: 13 }}>
                    Need help with this order?
                  </Typography.Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
