"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Users,
  Package,
  FileText,
  ReceiptText,
  WalletCards,
  Settings,
  LogOut,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
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
  const [collapsed, setCollapsed] = useState(false);

  if (pathname === "/login") return <>{children}</>;

  return (
    <main className="min-h-screen bg-[#eef2f8] text-[#0f172a]">
      <div
        className={[
          "grid min-h-screen transition-[grid-template-columns] duration-300",
          collapsed ? "grid-cols-[76px_1fr]" : "grid-cols-[238px_1fr]",
        ].join(" ")}
      >
        <aside className="flex min-h-screen flex-col bg-[#063591] text-white">
          <div className="flex h-[76px] items-center justify-between border-b border-white/10 px-4">
            <Link href="/invoices" className="flex min-w-0 items-center gap-3">
              <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center bg-[#0b3f96] shadow-[0_10px_25px_rgba(11,63,150,0.18)]">
                <span className="text-[17px] font-black italic leading-none text-[#f7b622]">
                  HP
                </span>
              </div>

              {!collapsed && (
                <div className="min-w-0 leading-none">
                  <p className="truncate text-[20px] font-extrabold tracking-[-0.04em] text-white">
                    Hồng Phát
                  </p>
                  <p className="mt-[3px] text-[10px] font-bold uppercase tracking-[0.18em] text-[#f7b622]">
                    Inox & Cơ Khí
                  </p>
                </div>
              )}
            </Link>

            {!collapsed && (
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                className="flex h-8 w-8 items-center justify-center border border-white/15 text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
          </div>

          {collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className="mx-auto mt-3 flex h-9 w-9 items-center justify-center border border-white/15 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}

          <nav className="mt-5 flex flex-col">
            {menus.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={[
                    "mx-3 flex h-11 items-center gap-3 border-l-4 px-3 text-[13.5px] font-bold transition",
                    active
                      ? "border-[#f7b622] bg-white text-[#0b3f96]"
                      : "border-transparent text-white/70 hover:border-white/40 hover:bg-white/10 hover:text-white",
                    collapsed ? "justify-center px-0" : "",
                  ].join(" ")}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-white/10 py-4">
            <Link
              href="/help"
              title={collapsed ? "Trợ giúp" : undefined}
              className={[
                "mx-3 flex h-11 items-center gap-3 border-l-4 border-transparent px-3 text-[13.5px] font-bold text-white/70 transition hover:border-white/40 hover:bg-white/10 hover:text-white",
                collapsed ? "justify-center px-0" : "",
              ].join(" ")}
            >
              <HelpCircle className="h-[18px] w-[18px]" />
              {!collapsed && <span>Trợ giúp</span>}
            </Link>

            <Link
              href="/login"
              title={collapsed ? "Đăng xuất" : undefined}
              className={[
                "mx-3 flex h-11 items-center gap-3 border-l-4 border-transparent px-3 text-[13.5px] font-bold text-white/70 transition hover:border-red-400 hover:bg-red-500/10 hover:text-red-200",
                collapsed ? "justify-center px-0" : "",
              ].join(" ")}
            >
              <LogOut className="h-[18px] w-[18px]" />
              {!collapsed && <span>Đăng xuất</span>}
            </Link>
          </div>
        </aside>

        <section className="min-h-screen overflow-hidden px-6 py-6">
          {children}
        </section>
      </div>
    </main>
  );
}