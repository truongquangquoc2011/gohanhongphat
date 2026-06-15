"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  Package,
  FileText,
  ReceiptText,
  WalletCards,
  Settings,
  LogOut,
  HelpCircle,
} from "lucide-react";

const menus = [
  { label: "Hóa đơn", href: "/invoices", icon: ReceiptText },
  { label: "Báo giá", href: "/quotes", icon: FileText },
  { label: "Khách hàng", href: "/customers", icon: Users },
  { label: "Sản phẩm", href: "/products", icon: Package },
  { label: "Công nợ", href: "/debts", icon: WalletCards },
  { label: "Cài đặt", href: "/settings", icon: Settings },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/login") return <>{children}</>;

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-[#eef2f8] text-[#0f172a]">
      <header className="z-50 shrink-0 border-b border-[#082f63] bg-[#063591] text-white">
        <div className="flex h-[50px] items-center">
          <Link
            href="/"
            className="flex h-full w-[176px] shrink-0 items-center gap-3 border-r border-white/15 px-4"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-white">
              <span className="text-[17px] font-black italic leading-none text-[#063591]">
                HP
              </span>
            </div>

            <div className="min-w-0 leading-none">
              <p className="truncate text-[18px] font-extrabold tracking-[-0.04em] text-white">
                Hồng Phát
              </p>
              <p className="mt-[4px] text-[9px] font-bold uppercase tracking-[0.18em] text-[#f7b622]">
                Inox & Cơ Khí
              </p>
            </div>
          </Link>

          <nav className="flex h-full min-w-0 flex-1 items-center overflow-x-auto">
            {menus.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "flex h-full shrink-0 items-center gap-2 px-4 text-[13px] font-semibold transition",
                    active
                      ? "bg-[#0b4aa3] text-white"
                      : "text-white/85 hover:bg-[#0b4aa3] hover:text-white",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex h-full items-center border-l border-white/15">
            <Link
              href="/help"
              title="Trợ giúp"
              className="flex h-full w-11 items-center justify-center text-white/80 transition hover:bg-[#0b4aa3] hover:text-white"
            >
              <HelpCircle className="h-[18px] w-[18px]" />
            </Link>

            <Link
              href="/login"
              title="Đăng xuất"
              className="flex h-full items-center gap-2 px-4 text-[13px] font-semibold text-white/80 transition hover:bg-red-600 hover:text-white"
            >
              <LogOut className="h-[17px] w-[17px]" />
              Đăng xuất
            </Link>
          </div>
        </div>
      </header>

      <section className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </section>  
    </main>
  );
}
