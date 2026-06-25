import type { Metadata } from "next";
import "./globals.css";
import AppShell from "./components/AppShell";
import AuthProvider from "./components/AuthProvider";

export const metadata: Metadata = {
  title: "Hồng Phát Management",
  description: "Quản lý báo giá, hóa đơn và công nợ Hồng Phát",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}