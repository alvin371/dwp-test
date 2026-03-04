"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AppHeader } from "@/components/layouts/app-header";
import { AppFooter } from "@/components/layouts/app-footer";
import { StepIndicator } from "./_components/step-indicator";
import { StepPackage } from "./_components/step-package";
import { StepReview } from "./_components/step-review";
import { useCheckoutStore } from "./_utils/checkout.store";
import { ROUTES } from "@/commons/route";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

export default function CheckoutPage() {
  const router = useRouter();
  const { currentStep } = useCheckoutStore();

  useEffect(() => {
    if (currentStep < 2) {
      router.replace(ROUTES.HOME);
    }
  }, [currentStep, router]);

  if (currentStep < 2) return null;

  const renderStep = () => {
    switch (currentStep) {
      case 2:
        return <StepPackage key="step-2" />;
      case 3:
        return <StepReview key="step-3" />;
      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppHeader />

      <main style={{ flex: 1 }}>
        {currentStep === 3 && (
          <div style={{ padding: "24px 24px 0", maxWidth: 900, margin: "0 auto", width: "100%" }}>
            <StepIndicator currentStep={currentStep} />
          </div>
        )}

        <AnimatePresence mode="wait" custom={currentStep}>
          <motion.div
            key={currentStep}
            custom={currentStep}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>

      <AppFooter />
    </div>
  );
}
