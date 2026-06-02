"use client";

import { useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import {
  CalendarDays,
  ChevronDown,
  Download,
  FilePlus2,
  MoreHorizontal,
  Printer,
  RefreshCcw,
  Search,
} from "lucide-react";
import PrintableInvoice from "./components/PrintableInvoice";

const printableInvoice = {
  items: [],
};

const invoices = [
  {
    id: 1,
    code: "HD-2026-00001",
    customer: "CÔNG TY CỔ PHẦN MANDACONS",
    taxCode: "0319461460",
    createdAt: "24/04/2026 09:15",
    total: "10.802.000đ",
    paid: "0đ",
    debt: "10.802.000đ",
    status: "Công nợ",
    creator: "Phạm Thị Kim Ánh",
  },
  {
    id: 2,
    code: "HD-2026-00002",
    customer: "CÔNG TY TNHH THIẾT BỊ Y TẾ THANH KHANG",
    taxCode: "0318541811",
    createdAt: "27/05/2026 14:30",
    total: "14.652.000đ",
    paid: "14.652.000đ",
    debt: "0đ",
    status: "Đã thanh toán",
    creator: "Nguyễn Văn Hồng",
  },
  {
    id: 3,
    code: "HD-2026-00003",
    customer: "KHÁCH LẺ",
    taxCode: "-",
    createdAt: "31/05/2026 20:10",
    total: "3.250.000đ",
    paid: "1.000.000đ",
    debt: "2.250.000đ",
    status: "Thanh toán một phần",
    creator: "Trương Quang Quốc",
  },
  {
    id: 4,
    code: "HD-2026-00004",
    customer: "CÔNG TY NAM PHÁT",
    taxCode: "0312345678",
    createdAt: "01/06/2026 08:30",
    total: "6.800.000đ",
    paid: "0đ",
    debt: "6.800.000đ",
    status: "Chưa thanh toán",
    creator: "Phạm Thị Kim Ánh",
  },
];

const tabs = [
  "Tất cả",
  "Chưa thanh toán",
  "Thanh toán một phần",
  "Đã thanh toán",
  "Công nợ",
  "Đã hủy",
];

function StatusBadge({ status }: { status: string }) {
  const style =
    status === "Đã thanh toán"
      ? "bg-[#e8fff1] text-[#00994d]"
      : status === "Công nợ"
        ? "bg-[#fff5d6] text-[#b07800]"
        : status === "Thanh toán một phần"
          ? "bg-[#e8f0ff] text-[#175cff]"
          : status === "Chưa thanh toán"
            ? "bg-[#fff1f1] text-[#d92323]"
            : "bg-[#f1f5f9] text-[#64748b]";

  return (
    <span className={`inline-flex px-3 py-1.5 text-xs font-bold ${style}`}>
      {status}
    </span>
  );
}

export default function InvoicesPage() {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrintPdf = useReactToPrint({
    contentRef: printRef,
    documentTitle: "hoa-don-ban-le",
  });

  const [activeTab, setActiveTab] = useState("Tất cả");
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả trạng thái");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openCreateMenu, setOpenCreateMenu] = useState(false);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchTab =
        activeTab === "Tất cả" ? true : invoice.status === activeTab;

      const matchStatus =
        statusFilter === "Tất cả trạng thái"
          ? true
          : invoice.status === statusFilter;

      const searchText =
        `${invoice.code} ${invoice.customer} ${invoice.taxCode}`
          .toLowerCase()
          .trim();

      const matchKeyword = searchText.includes(keyword.toLowerCase().trim());

      return matchTab && matchStatus && matchKeyword;
    });
  }, [activeTab, keyword, statusFilter]);

  const allSelected =
    filteredInvoices.length > 0 &&
    filteredInvoices.every((invoice) => selectedIds.includes(invoice.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(filteredInvoices.map((invoice) => invoice.id));
  };

  const toggleSelectOne = (id: number) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const resetFilters = () => {
    setActiveTab("Tất cả");
    setKeyword("");
    setStatusFilter("Tất cả trạng thái");
    setSelectedIds([]);
  };

  return (
    <div className="space-y-4">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-[#0f172a]">
            Quản lý hóa đơn
          </h1>
          <p className="mt-1 text-sm text-[#64748b]">
            Theo dõi hóa đơn bán lẻ, trạng thái thanh toán và công nợ.
          </p>
        </div>

        <div className="relative flex items-center gap-2">
          <button
            onClick={() => handlePrintPdf()}
            className="flex h-10 items-center gap-2 border border-[#d8e0ee] bg-white px-4 text-sm font-semibold text-[#0f172a] hover:bg-[#f8fafc]"
          >
            <Download className="h-4 w-4" />
            Xuất PDF
          </button>

          <button
            onClick={() => setOpenCreateMenu((value) => !value)}
            className="flex h-10 items-center gap-2 bg-[#063591] px-4 text-sm font-bold text-white hover:bg-[#052b75]"
          >
            <FilePlus2 className="h-4 w-4" />
            Tạo chứng từ
            <ChevronDown className="h-4 w-4" />
          </button>

          {openCreateMenu && (
            <div className="absolute right-0 top-12 z-20 w-[220px] border border-[#d8e0ee] bg-white shadow-lg">
              <button
                onClick={() => alert("Đi tới màn hình tạo hóa đơn")}
                className="block w-full px-4 py-3 text-left text-sm font-semibold hover:bg-[#f8fafc]"
              >
                Tạo hóa đơn bán lẻ
              </button>

              <button
                onClick={() => alert("Đi tới màn hình tạo báo giá")}
                className="block w-full border-t border-[#e8edf5] px-4 py-3 text-left text-sm font-semibold hover:bg-[#f8fafc]"
              >
                Tạo báo giá
              </button>
            </div>
          )}
        </div>
      </header>

      <section className="border border-[#d8e0ee] bg-white">
        <div className="flex border-b border-[#d8e0ee] bg-white">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedIds([]);
              }}
              className={[
                "h-12 border-b-2 px-5 text-sm font-semibold",
                activeTab === tab
                  ? "border-[#063591] text-[#063591]"
                  : "border-transparent text-[#64748b] hover:text-[#063591]",
              ].join(" ")}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-[1.2fr_0.8fr_0.8fr_auto] gap-3 border-b border-[#d8e0ee] bg-[#f8fafc] p-4">
          <div className="flex h-10 items-center border border-[#d8e0ee] bg-white px-3">
            <Search className="mr-2 h-4 w-4 text-[#94a3b8]" />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm mã hóa đơn, tên khách hàng, MST..."
              className="h-full w-full bg-transparent text-sm outline-none placeholder:text-[#94a3b8]"
            />
          </div>

          <button
            onClick={() => alert("Bộ lọc ngày sẽ làm sau")}
            className="flex h-10 items-center justify-between border border-[#d8e0ee] bg-white px-3 text-sm text-[#0f172a]"
          >
            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-[#94a3b8]" />
              Thời gian tạo
            </span>
            <ChevronDown className="h-4 w-4 text-[#94a3b8]" />
          </button>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-10 border border-[#d8e0ee] bg-white px-3 text-sm text-[#0f172a] outline-none"
          >
            <option>Tất cả trạng thái</option>
            <option>Chưa thanh toán</option>
            <option>Thanh toán một phần</option>
            <option>Đã thanh toán</option>
            <option>Công nợ</option>
            <option>Đã hủy</option>
          </select>

          <button
            onClick={resetFilters}
            className="flex h-10 items-center gap-2 border border-[#d8e0ee] bg-white px-4 text-sm font-semibold text-[#0f172a] hover:bg-[#f8fafc]"
          >
            <RefreshCcw className="h-4 w-4" />
            Đặt lại
          </button>
        </div>

        <div className="flex items-center justify-between border-b border-[#d8e0ee] bg-[#f1f5f9] px-4 py-3">
          <div className="flex items-center divide-x divide-[#d8e0ee] text-sm">
            <button
              onClick={toggleSelectAll}
              className="pr-5 font-semibold text-[#0f172a]"
            >
              {allSelected ? "Bỏ chọn tất cả" : "Chọn hóa đơn"}
            </button>
            <span className="pl-5 text-[#64748b]">
              Đã chọn {selectedIds.length} hóa đơn
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={selectedIds.length === 0}
              onClick={() => alert("Ghi nhận thanh toán cho hóa đơn đã chọn")}
              className="h-9 border border-[#d8e0ee] bg-white px-4 text-sm font-semibold text-[#64748b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Ghi nhận thanh toán
            </button>

            <button
              disabled={selectedIds.length === 0}
              onClick={() => alert("Xuất giấy đề nghị thanh toán")}
              className="h-9 border border-[#d8e0ee] bg-white px-4 text-sm font-semibold text-[#64748b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Xuất giấy ĐNTT
            </button>

            <button
              disabled={selectedIds.length === 0}
              onClick={() => handlePrintPdf()}
              className="flex h-9 items-center gap-2 border border-[#d8e0ee] bg-white px-4 text-sm font-semibold text-[#64748b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Printer className="h-4 w-4" />
              In hóa đơn
            </button>
          </div>
        </div>

        <div className="overflow-auto">
          <table className="w-full min-w-[1350px] border-collapse bg-white text-left">
            <thead>
              <tr className="h-14 border-b border-[#d8e0ee] bg-[#f8fafc] text-sm font-semibold text-[#0f172a]">
                <th className="w-12 px-4">
                  <input
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    type="checkbox"
                    className="h-4 w-4"
                  />
                </th>
                <th className="w-16 px-4">STT</th>
                <th className="px-4">Mã hóa đơn</th>
                <th className="px-4">Khách hàng</th>
                <th className="px-4">MST</th>
                <th className="px-4">Thời gian tạo</th>
                <th className="px-4 text-right">Tổng tiền</th>
                <th className="px-4 text-right">Đã thanh toán</th>
                <th className="px-4 text-right">Còn nợ</th>
                <th className="px-4">Trạng thái</th>
                <th className="px-4">Người tạo</th>
                <th className="px-4">Hoạt động</th>
              </tr>
            </thead>

            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="h-[74px] border-b border-[#e8edf5] text-sm text-[#0f172a] hover:bg-[#f8fafc]"
                >
                  <td className="px-4">
                    <input
                      checked={selectedIds.includes(invoice.id)}
                      onChange={() => toggleSelectOne(invoice.id)}
                      type="checkbox"
                      className="h-4 w-4"
                    />
                  </td>
                  <td className="px-4 text-[#64748b]">{invoice.id}</td>
                  <td className="px-4 font-semibold text-[#063591]">
                    {invoice.code}
                  </td>
                  <td className="max-w-[280px] truncate px-4 font-semibold">
                    {invoice.customer}
                  </td>
                  <td className="px-4">{invoice.taxCode}</td>
                  <td className="px-4">{invoice.createdAt}</td>
                  <td className="px-4 text-right font-semibold">
                    {invoice.total}
                  </td>
                  <td className="px-4 text-right text-[#00994d]">
                    {invoice.paid}
                  </td>
                  <td className="px-4 text-right font-semibold text-[#d35400]">
                    {invoice.debt}
                  </td>
                  <td className="px-4">
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td className="px-4">{invoice.creator}</td>
                  <td className="px-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => alert(`Chi tiết ${invoice.code}`)}
                        className="font-semibold text-[#063591]"
                      >
                        Chi tiết
                      </button>

                      <button
                        onClick={() => handlePrintPdf()}
                        className="font-semibold text-[#063591]"
                      >
                        PDF
                      </button>

                      <button
                        onClick={() => alert(`Menu ${invoice.code}`)}
                        className="text-[#64748b]"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredInvoices.length === 0 && (
                <tr>
                  <td
                    colSpan={12}
                    className="h-32 text-center text-sm font-medium text-[#94a3b8]"
                  >
                    Không tìm thấy hóa đơn phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="flex h-14 items-center justify-between border-t border-[#d8e0ee] bg-white px-4 text-sm text-[#64748b]">
          <span>Tổng: {filteredInvoices.length} hóa đơn</span>

          <div className="flex items-center gap-4">
            <button className="text-[#94a3b8]">‹</button>
            <button className="font-semibold text-[#063591]">1</button>
            <button>2</button>
            <button>›</button>
            <select className="h-9 border border-[#d8e0ee] bg-white px-3 outline-none">
              <option>10 / Trang</option>
              <option>20 / Trang</option>
              <option>50 / Trang</option>
            </select>
          </div>
        </footer>
      </section>

      <div className="fixed left-[-99999px] top-0">
        <div ref={printRef}>
          <PrintableInvoice invoice={printableInvoice} />
        </div>
      </div>
    </div>
  );
}