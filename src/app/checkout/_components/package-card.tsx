"use client";

import { Card, Typography, Tag, Button } from "antd";
import { InfoCircleOutlined, CheckCircleFilled } from "@ant-design/icons";
import { motion } from "framer-motion";
import type { TPackage } from "@/modules/packages/types";

type Props = {
  package: TPackage;
  onSelect?: (pkg: TPackage) => void;
  selected?: boolean;
  badge?: string;
  speed?: string;
  features?: string[];
};

export const PackageCard = ({
  package: pkg,
  onSelect,
  selected = false,
  badge,
  speed,
  features,
}: Props) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      style={{ height: "100%" }}
    >
      <Card
        style={{
          border: selected ? "2px solid #1677ff" : "1px solid #e8e8e8",
          borderRadius: 12,
          cursor: "pointer",
          background: "#fff",
          height: "100%",
        }}
        onClick={() => onSelect?.(pkg)}
        data-testid={`package-card-${pkg.id}`}
        styles={{ body: { padding: 20 } }}
      >
        {/* Badge + info icon */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
            minHeight: 24,
          }}
        >
          {badge ? (
            <Tag
              color={badge === "Best Seller" ? "blue" : "purple"}
              style={{ margin: 0, fontSize: 11, fontWeight: 600 }}
            >
              {badge}
            </Tag>
          ) : (
            <span />
          )}
          <InfoCircleOutlined style={{ color: "#bfbfbf", fontSize: 14 }} />
        </div>

        {/* Package name */}
        <Typography.Text strong style={{ fontSize: 14, display: "block", marginBottom: 4 }}>
          {pkg.name}
        </Typography.Text>

        {/* Quota */}
        <Typography.Title level={3} style={{ margin: "0 0 2px", lineHeight: 1.1 }}>
          {pkg.quota}
        </Typography.Title>

        {/* Speed */}
        {speed && (
          <Typography.Text
            style={{ fontSize: 12, color: "#1677ff", display: "block", marginBottom: 8 }}
          >
            {speed}
          </Typography.Text>
        )}

        {/* Price */}
        <div style={{ marginBottom: 12 }}>
          <Typography.Text strong style={{ fontSize: 18 }}>
            Rp {pkg.price.toLocaleString("id-ID")}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {" "}/ {pkg.validity} {pkg.validityUnit}
          </Typography.Text>
        </div>

        {/* Features */}
        {features && features.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            {features.map((feature, i) => {
              const isStrikethrough = feature.startsWith("!");
              const text = isStrikethrough ? feature.slice(1) : feature;
              return (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}
                >
                  <CheckCircleFilled
                    style={{
                      color: isStrikethrough ? "#d9d9d9" : "#52c41a",
                      fontSize: 13,
                      flexShrink: 0,
                    }}
                  />
                  <Typography.Text
                    style={{
                      fontSize: 13,
                      textDecoration: isStrikethrough ? "line-through" : "none",
                      color: isStrikethrough ? "#bfbfbf" : undefined,
                    }}
                  >
                    {text}
                  </Typography.Text>
                </div>
              );
            })}
          </div>
        )}

        {onSelect && (
          <Button
            type={selected ? "primary" : "default"}
            block
            onClick={(e) => {
              e.stopPropagation();
              onSelect(pkg);
            }}
            data-testid={`select-package-btn-${pkg.id}`}
            style={{ fontWeight: 600 }}
          >
            {selected ? "Select Plan ✓" : "Select Plan →"}
          </Button>
        )}
      </Card>
    </motion.div>
  );
};
