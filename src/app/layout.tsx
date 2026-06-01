import type { Metadata } from "next";
import { Geist, Geist_Mono, /* ⬇️ thêm */ Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";

/* Fonts */
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* ⬇️ Inter cho toàn site (có latin-ext để support tiếng Việt) */
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "QNotion",
  description: "Your Plan, Your Choice",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      {/* ⬇️ gắn biến font Inter + dùng class font-sans của Tailwind v4 */}
      <body
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
