import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — DWP Top Up",
};

export default function UnauthenticatedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
