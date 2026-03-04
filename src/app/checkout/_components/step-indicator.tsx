"use client";

import { Steps } from "antd";
import type { TCheckoutStep } from "@/modules/checkout/types";

type Props = {
  currentStep: TCheckoutStep;
};

const steps = [{ title: "Select Package" }, { title: "Review & Pay" }];

export const StepIndicator = ({ currentStep }: Props) => {
  const displayStep = Math.max(0, currentStep - 2);

  return (
    <Steps
      current={displayStep}
      items={steps.map((step) => ({ title: step.title }))}
      style={{ marginBottom: 32 }}
      data-testid="step-indicator"
    />
  );
};
