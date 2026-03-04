import type { Metadata } from "next";
import { ClientProviders } from "./_components/providers/client-providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "DWP Top Up — Jual Paket Internet Termurah",
  description: "Jual paket internet termurah semua operator hanya di DWP Top Up",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
