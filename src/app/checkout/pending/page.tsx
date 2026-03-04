"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, Progress, Space, Typography, Upload } from "antd";
import { CheckCircleFilled, CloudUploadOutlined, LoadingOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AppHeader } from "@/components/layouts/app-header";
import { AppFooter } from "@/components/layouts/app-footer";
import { getTransactionById, updateTransactionStatus } from "@/modules/transactions";
import { ROUTES } from "@/commons/route";
import { OPERATOR_DISPLAY_NAMES } from "@/commons/constants";
import { useCheckoutStore } from "../_utils/checkout.store";

const { Title, Text, Paragraph } = Typography;

const COUNTDOWN_SECONDS = 10;

const PendingContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const txnId = searchParams.get("txnId");

  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const [imageUploaded, setImageUploaded] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasNavigatedRef = useRef(false);
  const reset = useCheckoutStore((s) => s.reset);

  const successUrl = `${ROUTES.CHECKOUT_SUCCESS}?txnId=${txnId}`;

  // Reset checkout store on mount (safe here — checkout page is already unmounted)
  useEffect(() => {
    reset();
  }, [reset]);

  const { data: transaction } = useQuery({
    queryKey: ["transaction", txnId],
    queryFn: () => getTransactionById(txnId!),
    enabled: !!txnId,
  });

  const navigateToSuccess = async () => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    if (txnId) {
      try {
        await updateTransactionStatus(txnId, "success");
      } catch {
        // navigate anyway if PATCH fails
      }
    }
    router.push(successUrl);
  };

  // Countdown tick — pure updater, no side effects
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Navigate when timer hits 0 (in a separate effect, not inside setState)
  useEffect(() => {
    if (secondsLeft === 0 && !imageUploaded) {
      navigateToSuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, imageUploaded]);

  const handleUpload = () => {
    setImageUploaded(true);
    setTimeout(() => {
      navigateToSuccess();
    }, 2000);
  };

  const progressPercent = Math.round(
    ((COUNTDOWN_SECONDS - secondsLeft) / COUNTDOWN_SECONDS) * 100
  );

  return (
    <div
      style={{
        maxWidth: 480,
        width: "100%",
        margin: "0 auto",
        padding: "40px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
      }}
      data-testid="pending-page"
    >
      {/* Animated spinner */}
      <div style={{ position: "relative", width: 100, height: 100 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "4px solid transparent",
            borderTopColor: "#1677ff",
            borderRightColor: "#1677ff40",
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          style={{
            position: "absolute",
            inset: 10,
            borderRadius: "50%",
            border: "3px solid transparent",
            borderTopColor: "#69b1ff",
            borderRightColor: "#69b1ff40",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LoadingOutlined style={{ fontSize: 28, color: "#1677ff" }} />
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <Title level={3} style={{ marginBottom: 8 }}>
          Processing Payment
        </Title>
        <Paragraph type="secondary" style={{ margin: 0 }}>
          Please do not refresh the page or click back.
          <br />
          This usually takes a few seconds.
        </Paragraph>
      </div>

      {/* Transaction summary */}
      {transaction && (
        <Card
          size="small"
          style={{ width: "100%", borderRadius: 10, border: "1px solid #e8eef8" }}
          data-testid="pending-summary-card"
        >
          <Space direction="vertical" size={8} style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text type="secondary">Package</Text>
              <Text strong>{transaction.packageName}</Text>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text type="secondary">Phone</Text>
              <Text>{transaction.phoneNumber}</Text>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text type="secondary">Operator</Text>
              <Text>
                {OPERATOR_DISPLAY_NAMES[transaction.operatorId] ?? transaction.operatorId}
              </Text>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text type="secondary">Payment Method</Text>
              <Text>{transaction.paymentMethod || "-"}</Text>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: 8,
                borderTop: "1px solid #f0f0f0",
              }}
            >
              <Text type="secondary">Amount</Text>
              <Text strong style={{ color: "#1677ff" }}>
                Rp {transaction.amount.toLocaleString("id-ID")}
              </Text>
            </div>
          </Space>
        </Card>
      )}

      {/* Upload proof */}
      {!imageUploaded ? (
        <div style={{ width: "100%" }} data-testid="pending-upload-area">
          <Text type="secondary" style={{ display: "block", marginBottom: 8, fontSize: 13 }}>
            Optional: Upload payment screenshot to speed up verification
          </Text>
          <Upload.Dragger
            accept="image/*"
            beforeUpload={() => {
              handleUpload();
              return false;
            }}
            showUploadList={false}
            style={{ borderRadius: 10 }}
          >
            <div style={{ padding: "16px 0" }}>
              <CloudUploadOutlined
                style={{ fontSize: 32, color: "#1677ff", marginBottom: 8 }}
              />
              <Paragraph style={{ margin: 0, fontSize: 13 }}>
                Click or drag to upload payment proof
              </Paragraph>
              <Text type="secondary" style={{ fontSize: 11 }}>
                PNG, JPG, JPEG supported
              </Text>
            </div>
          </Upload.Dragger>
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          data-testid="pending-proof-received"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 20px",
            background: "#f6ffed",
            borderRadius: 10,
            border: "1px solid #b7eb8f",
            width: "100%",
          }}
        >
          <CheckCircleFilled style={{ color: "#52c41a", fontSize: 20 }} />
          <div>
            <Text strong style={{ color: "#237804", display: "block" }}>
              Proof received!
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Redirecting to confirmation...
            </Text>
          </div>
        </motion.div>
      )}

      {/* Countdown */}
      {!imageUploaded && (
        <div style={{ textAlign: "center" }} data-testid="pending-timer">
          <Progress
            type="circle"
            percent={progressPercent}
            format={() => `${secondsLeft}s`}
            size={72}
            strokeColor="#1677ff"
          />
          <Text
            type="secondary"
            style={{ display: "block", marginTop: 8, fontSize: 12 }}
          >
            Auto-redirecting in {secondsLeft}s...
          </Text>
        </div>
      )}
    </div>
  );
};

export default function CheckoutPendingPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppHeader />

      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "linear-gradient(180deg, #f0f5ff 0%, #fff 100%)",
        }}
      >
        <Suspense fallback={<div style={{ padding: 40 }}>Loading...</div>}>
          <PendingContent />
        </Suspense>
      </main>

      <AppFooter />
    </div>
  );
}
