"use client";

import { useEffect } from "react";
import { AppHeader } from "@/components/layouts/app-header";
import { AppFooter } from "@/components/layouts/app-footer";
import { useCheckoutStore } from "./checkout/_utils/checkout.store";
import { useAuthStore } from "@/libs/stores/auth.store";
import { UnauthHeroSection } from "./_components/home/unauthenticated/hero-section";
import { HowItWorksSection } from "./_components/home/unauthenticated/how-it-works-section";
import { FaqSection } from "./_components/home/unauthenticated/faq-section";
import { StatsSection } from "./_components/home/unauthenticated/stats-section";
import { AuthHeroSection } from "./_components/home/authenticated/hero-section";
import { FeatureCardsSection } from "./_components/home/authenticated/feature-cards-section";
import { TrustedCarriersSection } from "./_components/home/authenticated/trusted-carriers-section";

export default function HomePage() {
  const { reset, goToStep } = useCheckoutStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    reset();
    goToStep(1);
  }, [reset, goToStep]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppHeader />

      <main style={{ flex: 1 }}>
        {isAuthenticated ? (
          <>
            <AuthHeroSection />
            <FeatureCardsSection />
            <TrustedCarriersSection />
          </>
        ) : (
          <>
            <UnauthHeroSection />
            <StatsSection />
            <HowItWorksSection />
            <FaqSection />
          </>
        )}
      </main>

      <AppFooter />
    </div>
  );
}
