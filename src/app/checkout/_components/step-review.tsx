"use client";

import { Col, Row, Typography } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthStore } from "@/libs/stores/auth.store";
import { OrderSummaryPanel } from "./review/order-summary-panel";
import { PaymentMethodPanel } from "./review/payment-method-panel";
import { LoginPanel } from "./review/login-panel";

const { Title } = Typography;

const panelVariants = {
  enter: { x: 40, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -40, opacity: 0 },
};

export const StepReview = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div
      style={{ padding: "24px 16px 40px", maxWidth: 960, margin: "0 auto", width: "100%" }}
      data-testid="step-review"
    >
      <Title level={3} style={{ marginBottom: 24 }}>
        {isAuthenticated ? "Review Your Order" : "Order Summary"}
      </Title>

      <Row gutter={[32, 24]}>
        <Col xs={24} lg={14}>
          <OrderSummaryPanel />
        </Col>

        <Col xs={24} lg={10}>
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #e8eef8",
              padding: 24,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <AnimatePresence mode="wait">
              {isAuthenticated ? (
                <motion.div
                  key="payment"
                  variants={panelVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                >
                  <PaymentMethodPanel />
                </motion.div>
              ) : (
                <motion.div
                  key="login"
                  variants={panelVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                >
                  <LoginPanel />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Col>
      </Row>
    </div>
  );
};
