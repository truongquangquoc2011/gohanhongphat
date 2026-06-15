"use client";
import { useRouter } from "next/navigation";
import { ReceiptText, FileText, Download, TrendingDown, Settings, ClipboardList } from "lucide-react";

const modules = [
  { title: "Hóa đơn",          desc: "Quản lý và in hóa đơn",      href: "/invoices",  Icon: ReceiptText   },
  { title: "Báo giá",           desc: "Lập và theo dõi báo giá",    href: "/quotes",    Icon: FileText      },
  { title: "Xuất mẫu đơn",     desc: "Xuất và in các mẫu đơn",    href: "/templates", Icon: Download      },
  { title: "Theo dõi công nợ", desc: "Khoản chưa thanh toán",      href: "/debts",     Icon: TrendingDown  },
  { title: "Cài đặt",           desc: "Thông tin hệ thống",         href: "/settings",  Icon: Settings      },
  { title: "Quản lý nhập",      desc: "Hàng hóa nhập kho",         href: "/imports",   Icon: ClipboardList },
];

const SIZE = 400;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R  = 155;

export default function DashboardPage() {
  const router = useRouter();

  return (
    // h-full để fill đúng phần section của AppShell, không min-h-screen
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-[#f0f4ff]">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>

        {/* Rings */}
        {([400, 285, 155] as const).map((s, i) => (
          <div key={s}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: s, height: s,
              border: `1.5px solid rgba(6,53,145,${[0.09,0.13,0.18][i]})`,
              background: i === 2 ? "rgba(6,53,145,0.04)" : "transparent",
            }}
          />
        ))}

        {/* Center hub */}
        <div
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-2 border-[#063591]/20 bg-gradient-to-br from-[#e8eeff] to-[#dce6ff] text-center"
          style={{ width: 140, height: 140 }}
        >
          <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#f7b622]">Hồng Phát</p>
          <h1 className="mt-1 text-[13px] font-black leading-tight text-[#063591]">QUẢN LÝ<br />HÓA ĐƠN</h1>
          <p className="mt-1.5 text-[8px] leading-relaxed text-[#7a8fc4]">Chọn chức năng<br />để làm việc</p>
        </div>

        {/* Nodes */}
        {modules.map(({ title, desc, href, Icon }, i) => {
          const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
          const x = CX + R * Math.cos(angle);
          const y = CY + R * Math.sin(angle);
          const connLen = R - 65;
          const connDeg = (angle * 180) / Math.PI + 90;

          return (
            <div key={href}>
              {/* Spoke */}
              <div
                className="pointer-events-none absolute origin-top-left bg-gradient-to-b from-[#063591]/12 to-transparent"
                style={{ left: CX, top: CY, width: 1, height: connLen, transform: `rotate(${connDeg}deg)` }}
              />
              {/* Node */}
              <button
                onClick={() => router.push(href)}
                className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 text-center"
                style={{ left: x, top: y, width: 96 }}
              >
                <div className="flex h-[46px] w-[46px] items-center justify-center rounded-2xl border border-[#dbe8ff] bg-white shadow-sm transition-all duration-200 group-hover:-translate-y-1 group-hover:border-[#063591] group-hover:bg-[#063591] group-hover:shadow-[0_8px_24px_rgba(6,53,145,0.35)]">
                  <Icon className="h-5 w-5 text-[#063591] transition-colors group-hover:text-white" />
                </div>
                <p className="text-[11px] font-bold leading-tight text-[#0f172a]">{title}</p>
                <p className="text-[9.5px] leading-snug text-[#64748b]">{desc}</p>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}