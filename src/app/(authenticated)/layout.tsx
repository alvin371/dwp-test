"use client";

import { AuthGuard } from "./_components/providers/auth-guard";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
