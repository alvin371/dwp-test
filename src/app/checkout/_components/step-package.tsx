"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Avatar, Button, Checkbox, Col, Row, Segmented, Select, Slider, Spin, Tag, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getPackages } from "@/modules/packages";
import { PackageCard } from "./package-card";
import { OPERATOR_COLORS, OPERATOR_DISPLAY_NAMES } from "@/commons/constants";
import { ROUTES } from "@/commons/route";
import { useCheckoutStore } from "../_utils/checkout.store";
import type { TPackage } from "@/modules/packages/types";

const getSpeed = (quota: string): string => {
  if (quota.toLowerCase() === "unlimited") return "Uncapped Speeds";
  const gb = parseInt(quota);
  if (gb >= 25) return "Superfast 5G";
  if (gb >= 10) return "4G/5G Speed";
  if (gb >= 3) return "4G LTE";
  return "3G Basic";
};

const getBadge = (pkg: TPackage, all: TPackage[]): string | undefined => {
  const minPrice = Math.min(...all.map((p) => p.price));
  if (pkg.price === minPrice) return "Best Seller";
  const toGB = (q: string) => (q.toLowerCase() === "unlimited" ? 999 : parseInt(q));
  const maxGB = Math.max(...all.map((p) => toGB(p.quota)));
  if (toGB(pkg.quota) === maxGB) return "Popular";
  return undefined;
};

const getFeatures = (pkg: TPackage): string[] =>
  pkg.description.split(/\s*[+&]\s*/).filter(Boolean);

const NETWORK_SPEED_MAP: Record<string, string[]> = {
  "5G Ultra": ["Superfast 5G", "Uncapped Speeds"],
  "4G LTE": ["4G/5G Speed", "4G LTE"],
  "3G Basic": ["3G Basic"],
};

const BEST_FOR = [
  { icon: "🎬", label: "Streaming", keywords: ["streaming", "video", "youtube", "netflix", "spotify"] },
  { icon: "👥", label: "Social Media", keywords: ["social media", "whatsapp", "tiktok", "instagram", "facebook"] },
  { icon: "💼", label: "Remote Work", keywords: ["calls", "telepon", "sms", "roaming", "mbps"] },
];

type TabKey = "all" | "unlimited" | "daily" | "monthly";
type SortKey = "recommended" | "best-seller" | "popular";

const TAB_OPTIONS = [
  { label: "All Plans", value: "all" },
  { label: "Unlimited", value: "unlimited" },
  { label: "Daily", value: "daily" },
  { label: "Monthly", value: "monthly" },
];

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "best-seller", label: "Best Seller" },
  { value: "popular", label: "Popular" },
];

export const StepPackage = () => {
  const router = useRouter();
  const { operatorId, phoneNumber, selectedPackage, setSelectedPackage, nextStep } =
    useCheckoutStore();

  const [localSelected, setLocalSelected] = useState<TPackage | null>(selectedPackage);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [networkTypes, setNetworkTypes] = useState<string[]>(["5G Ultra", "4G LTE"]);
  const [bestFor, setBestFor] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortKey>("recommended");
  const [showAll, setShowAll] = useState(false);

  const { data: packages, isLoading, error } = useQuery({
    queryKey: ["packages", operatorId],
    queryFn: () => getPackages(operatorId!),
    enabled: !!operatorId,
  });

  const maxPrice = useMemo(() => {
    if (!packages?.length) return 500000;
    return Math.max(...packages.map((p) => p.price));
  }, [packages]);

  const effectiveRange = useMemo<[number, number]>(
    () => priceRange ?? [0, maxPrice],
    [priceRange, maxPrice]
  );

  const processedPackages = useMemo(() => {
    if (!packages) return [];
    const toGB = (q: string) => (q.toLowerCase() === "unlimited" ? 999 : parseInt(q));
    const filtered = packages.filter((pkg) => {
      if (activeTab === "unlimited" && pkg.quota.toLowerCase() !== "unlimited") return false;
      if (activeTab === "daily" && pkg.validity !== 1) return false;
      if (activeTab === "monthly" && pkg.validity < 28) return false;
      if (pkg.price < effectiveRange[0] || pkg.price > effectiveRange[1]) return false;
      if (networkTypes.length > 0) {
        const speed = getSpeed(pkg.quota);
        if (!networkTypes.some((nt) => NETWORK_SPEED_MAP[nt]?.includes(speed))) return false;
      }
      if (bestFor.length > 0) {
        const desc = pkg.description.toLowerCase();
        if (!bestFor.some((b) => BEST_FOR.find((bf) => bf.label === b)?.keywords.some((kw) => desc.includes(kw))))
          return false;
      }
      return true;
    });
    if (sortBy === "best-seller") return [...filtered].sort((a, b) => a.price - b.price);
    if (sortBy === "popular") return [...filtered].sort((a, b) => toGB(b.quota) - toGB(a.quota));
    return [...filtered].sort((a, b) => (getBadge(a, packages) ? 0 : 1) - (getBadge(b, packages) ? 0 : 1));
  }, [packages, activeTab, effectiveRange, networkTypes, bestFor, sortBy]);

  const displayed = showAll ? processedPackages : processedPackages.slice(0, 3);
  const operatorColor = operatorId ? (OPERATOR_COLORS[operatorId] ?? "#1677ff") : "#1677ff";
  const operatorName = operatorId ? (OPERATOR_DISPLAY_NAMES[operatorId] ?? operatorId) : "Unknown";

  const handleNetworkTypeChange = (nt: string, checked: boolean) =>
    setNetworkTypes((prev) => checked ? [...prev, nt] : prev.filter((n) => n !== nt));

  const handleContinue = () => {
    if (localSelected) {
      setSelectedPackage(localSelected);
      nextStep();
    }
  };

  return (
    <div>
      {/* Phone header strip */}
      <div
        style={{
          background: "#fff", border: "1px solid #f0f0f0", borderRadius: 8,
          margin: "16px 24px", padding: "16px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
        data-testid="phone-header-strip"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Avatar size={48} style={{ background: operatorColor, flexShrink: 0, fontWeight: 700 }}>
            {operatorName[0]}
          </Avatar>
          <div>
            <Typography.Text strong style={{ fontSize: 18, display: "block" }}>{phoneNumber}</Typography.Text>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Tag style={{ margin: 0 }}>Prepaid</Tag>
              <Typography.Text type="secondary">{operatorName}</Typography.Text>
            </div>
          </div>
        </div>
        <Button type="link" onClick={() => router.push(ROUTES.HOME)} data-testid="change-number-btn">
          Change Number →
        </Button>
      </div>

      {/* Layout: sidebar + main content */}
      <Row gutter={24} style={{ padding: "0 24px 32px" }}>
        {/* Sidebar */}
        <Col flex="200px" style={{ minWidth: 180 }}>
          <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: 8, padding: 16 }}>
            {/* Price Range */}
            <div style={{ marginBottom: 24 }}>
              <Typography.Text strong style={{ display: "block", marginBottom: 8 }}>Price Range</Typography.Text>
              <Slider range min={0} max={maxPrice} value={effectiveRange}
                onChange={(val) => setPriceRange(val as [number, number])} data-testid="price-range-slider" />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography.Text type="secondary" style={{ fontSize: 11 }}>Rp {effectiveRange[0].toLocaleString("id-ID")}</Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 11 }}>Rp {effectiveRange[1].toLocaleString("id-ID")}</Typography.Text>
              </div>
            </div>

            {/* Network Type */}
            <div style={{ marginBottom: 24 }}>
              <Typography.Text strong style={{ display: "block", marginBottom: 8 }}>Network Type</Typography.Text>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(["5G Ultra", "4G LTE", "3G Basic"] as const).map((nt) => (
                  <Checkbox key={nt} checked={networkTypes.includes(nt)}
                    onChange={(e) => handleNetworkTypeChange(nt, e.target.checked)}
                    data-testid={`network-type-${nt.replace(/\s/g, "-").toLowerCase()}`}>
                    {nt}
                  </Checkbox>
                ))}
              </div>
            </div>

            {/* Best For */}
            <div>
              <Typography.Text strong style={{ display: "block", marginBottom: 8 }}>Best For</Typography.Text>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {BEST_FOR.map(({ icon, label }) => {
                  const active = bestFor.includes(label);
                  return (
                    <div
                      key={label}
                      onClick={() => setBestFor((prev) => active ? prev.filter((b) => b !== label) : [...prev, label])}
                      style={{
                        cursor: "pointer", padding: "4px 8px", borderRadius: 6,
                        background: active ? "#e6f4ff" : "transparent",
                        border: `1px solid ${active ? "#91caff" : "transparent"}`,
                      }}
                      data-testid={`best-for-${label.toLowerCase().replace(" ", "-")}`}
                    >
                      <Typography.Text style={{ fontSize: 13, color: active ? "#1677ff" : undefined }}>
                        {icon} {label}
                      </Typography.Text>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Col>

        {/* Main content */}
        <Col flex="1" style={{ minWidth: 0 }}>
          {/* Tabs + Sort */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Segmented options={TAB_OPTIONS} value={activeTab}
              onChange={(val) => setActiveTab(val as TabKey)} data-testid="package-tabs" />
            <Select value={sortBy} onChange={setSortBy} options={SORT_OPTIONS}
              style={{ width: 150 }} data-testid="sort-select" />
          </div>

          {isLoading && <div style={{ textAlign: "center", padding: 64 }}><Spin size="large" /></div>}
          {error && <Alert type="error" message="Failed to load packages. Please try again." data-testid="packages-error" />}

          {packages && (
            <>
              <Row gutter={[16, 16]}>
                {displayed.map((pkg) => (
                  <Col xs={24} sm={12} lg={8} key={pkg.id}>
                    <PackageCard
                      package={pkg}
                      onSelect={(p) => setLocalSelected((prev) => prev?.id === p.id ? null : p)}
                      selected={localSelected?.id === pkg.id}
                      badge={getBadge(pkg, packages)}
                      speed={getSpeed(pkg.quota)}
                      features={getFeatures(pkg)}
                    />
                  </Col>
                ))}
                {displayed.length === 0 && (
                  <Col span={24} style={{ textAlign: "center", padding: 48 }}>
                    <Typography.Text type="secondary">No packages match your filters.</Typography.Text>
                  </Col>
                )}
              </Row>
              {processedPackages.length > 3 && !showAll && (
                <div style={{ textAlign: "center", marginTop: 24 }}>
                  <Button type="link" onClick={() => setShowAll(true)} data-testid="show-more-btn">
                    Show more plans ↓
                  </Button>
                </div>
              )}
            </>
          )}

          <div style={{ textAlign: "right", marginTop: 32 }}>
            <Button type="primary" size="large" disabled={!localSelected}
              onClick={handleContinue} data-testid="step-package-continue-btn">
              Continue →
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};
