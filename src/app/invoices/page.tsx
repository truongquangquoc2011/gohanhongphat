"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import {
  ChevronDown,
  Download,
  FilePlus2,
  Printer,
  RefreshCcw,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PrintableInvoice from "./components/PrintableInvoice";
import {
  getInvoices,
  cancelInvoice,
  receivePayment,
  type Invoice,
  type InvoiceStatus,
  type GetInvoicesParams,
} from "../core/api/invoice.api";

const tabs: { label: string; value: string }[] = [
  { label: "Tất cả", value: "" },
  { label: "Chưa thanh toán", value: "UNPAID" },
  { label: "Thanh toán một phần", value: "PARTIAL" },
  { label: "Đã thanh toán", value: "PAID" },
  { label: "Đã hủy", value: "CANCELLED" },
];

const formatMoney = (value: number) => `${value.toLocaleString("vi-VN")}đ`;

const STATUS_LABEL: Record<string, string> = {
  UNPAID: "Chưa thanh toán",
  PARTIAL: "Một phần",
  PAID: "Đã thanh toán",
  CANCELLED: "Đã hủy",
};

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const style =
    status === "PAID"
      ? "bg-[#dcfce7] text-[#047857]"
      : status === "PARTIAL"
        ? "bg-[#dbeafe] text-[#1d4ed8]"
        : status === "UNPAID"
          ? "bg-[#fee2e2] text-[#b91c1c]"
          : "bg-[#f1f5f9] text-[#64748b]";

  return (
    <span
      className={`inline-flex whitespace-nowrap px-2 py-1 text-[11px] font-bold ${style}`}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

export default function InvoicesPage() {
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrintPdf = useReactToPrint({
    contentRef: printRef,
    documentTitle: "hoa-don-ban-le",
  });

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("");
  const [keyword, setKeyword] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [invoiceTypeFilter, setInvoiceTypeFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [sortField, setSortField] =
    useState<GetInvoicesParams["sortField"]>(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openCreateMenu, setOpenCreateMenu] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const params: GetInvoicesParams = {
        page,
        limit,
        keyword: keyword || undefined,
        status: activeTab ? (activeTab as InvoiceStatus) : undefined,
        invoiceType: invoiceTypeFilter || undefined,
        paymentMethod: paymentFilter || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        sortField,
        sortOrder,
      };

      const res = await getInvoices(params);
      setInvoices(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch {
      toast.error("Không thể tải danh sách hóa đơn");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [page, activeTab, sortField, sortOrder]);

  const handleSearch = () => {
    setPage(1);
    fetchInvoices();
  };

  const resetFilters = () => {
    setIsResetting(true);
    setActiveTab("");
    setKeyword("");
    setFromDate("");
    setToDate("");
    setInvoiceTypeFilter("");
    setPaymentFilter("");
    setSortField(undefined);
    setSortOrder("desc");
    setSelectedIds([]);
    setPage(1);
    setTimeout(() => setIsResetting(false), 450);
  };

  useEffect(() => {
    if (isResetting) fetchInvoices();
  }, [isResetting]);

  const allSelected =
    invoices.length > 0 &&
    invoices.every((inv) => selectedIds.includes(inv.id));

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? [] : invoices.map((inv) => inv.id));
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
    );
  };

  const handleReceivePayment = async () => {
    if (selectedIds.length === 0) return;
    const input = window.prompt("Nhập số tiền đã thanh toán:");
    if (!input) return;

    const amount = Number(input.replaceAll(".", "").replaceAll(",", "").trim());
    if (!amount || amount <= 0) {
      toast.error("Số tiền không hợp lệ");
      return;
    }

    try {
      await Promise.all(
        selectedIds.map((id) => receivePayment(id, { amount })),
      );
      toast.success("Đã ghi nhận thanh toán");
      setSelectedIds([]);
      fetchInvoices();
    } catch {
      toast.error("Ghi nhận thanh toán thất bại");
    }
  };

  const handleCancelInvoice = async (id: string) => {
    if (!confirm("Bạn có chắc muốn hủy hóa đơn này?")) return;
    try {
      await cancelInvoice(id);
      toast.success("Đã hủy hóa đơn");
      fetchInvoices();
    } catch {
      toast.error("Hủy hóa đơn thất bại");
    }
  };

  return (
    <div className="flex min-h-full flex-col gap-4 p-4">
      <header className="flex items-center justify-between py-1">
        <div className="leading-tight">
          <h1 className="text-[18px] font-semibold tracking-[-0.02em] text-[#0f172a]">
            Quản lý hóa đơn
          </h1>
          <p className="mt-0.5 text-[11px] text-[#64748b]">
            Theo dõi hóa đơn bán lẻ, báo giá, phiếu xuất kho và công nợ.
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
            onClick={() => setOpenCreateMenu((v) => !v)}
            className="flex h-10 items-center gap-2 bg-[#063591] px-4 text-sm font-bold text-white hover:bg-[#052b75]"
          >
            <FilePlus2 className="h-4 w-4" />
            Thêm mới
            <ChevronDown className="h-4 w-4" />
          </button>

          {openCreateMenu && (
            <div className="absolute right-0 top-12 z-20 w-[250px] border border-[#d8e0ee] bg-white shadow-lg">
              {[
                { label: "Lập hóa đơn bán lẻ", path: "/invoices/form" },
                { label: "Lập phiếu xuất kho", path: "/warehouse/create" },
                { label: "Giấy đề nghị thanh toán", path: "/quotes/create" },
                { label: "Lập báo giá", path: "/payment-request/create" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setOpenCreateMenu(false);
                    router.push(item.path);
                  }}
                  className="block w-full border-b border-[#e8edf5] px-4 py-3 text-left text-sm font-semibold hover:bg-[#f8fafc]"
                >
                  › {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <section className="border border-[#d8e0ee] bg-white">
        {/* Tabs */}
        <div className="flex border-b border-[#d8e0ee] bg-white">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setActiveTab(tab.value);
                setPage(1);
                setSelectedIds([]);
              }}
              className={[
                "h-12 border-b-2 px-5 text-sm font-semibold",
                activeTab === tab.value
                  ? "border-[#063591] text-[#063591]"
                  : "border-transparent text-[#64748b] hover:text-[#063591]",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="space-y-3 border-b border-[#d8e0ee] bg-[#f8fafc] p-4">
          <div className="grid grid-cols-[0.75fr_0.75fr_1.45fr_auto_auto] gap-3">
            <label className="flex h-10 items-center gap-2 border border-[#d8e0ee] bg-white px-3 text-sm">
              <span className="shrink-0 text-[#64748b]">Từ ngày:</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-full w-full bg-transparent outline-none"
              />
            </label>

            <label className="flex h-10 items-center gap-2 border border-[#d8e0ee] bg-white px-3 text-sm">
              <span className="shrink-0 text-[#64748b]">Đến ngày:</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="h-full w-full bg-transparent outline-none"
              />
            </label>

            <div className="flex h-10 items-center border border-[#d8e0ee] bg-white px-3">
              <Search className="mr-2 h-4 w-4 text-[#94a3b8]" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Tìm số hóa đơn, mã số thuế, tên đối tác..."
                className="h-full w-full bg-transparent text-sm outline-none placeholder:text-[#94a3b8]"
              />
            </div>

            <button
              onClick={handleSearch}
              className="flex h-10 items-center gap-2 border border-[#d8e0ee] bg-white px-4 text-sm font-semibold text-[#063591]"
            >
              Tìm kiếm
              <ChevronDown className="h-4 w-4" />
            </button>

            <button
              onClick={resetFilters}
              className="flex h-10 items-center gap-2 border border-[#d8e0ee] bg-white px-4 text-sm font-semibold"
            >
              <RefreshCcw
                className={[
                  "h-4 w-4 transition-transform duration-500",
                  isResetting ? "rotate-[360deg]" : "",
                ].join(" ")}
              />
              Đặt lại
            </button>
          </div>

          {showAdvancedSearch && (
            <div className="grid grid-cols-4 gap-3 pt-1">
              <div>
                <label className="mb-1 block text-xs font-medium text-[#64748b]">
                  Thanh toán
                </label>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="h-10 w-full border border-[#d8e0ee] bg-white px-3 text-sm outline-none"
                >
                  <option value="">Tất cả</option>
                  <option>Tiền mặt</option>
                  <option>Chuyển khoản</option>
                  <option>Công nợ</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[#64748b]">
                  Loại chứng từ
                </label>
                <select
                  value={invoiceTypeFilter}
                  onChange={(e) => setInvoiceTypeFilter(e.target.value)}
                  className="h-10 w-full border border-[#d8e0ee] bg-white px-3 text-sm outline-none"
                >
                  <option value="">Tất cả</option>
                  <option>Hóa đơn bán lẻ</option>
                  <option>Phiếu xuất kho</option>
                  <option>Giấy đề nghị thanh toán</option>
                  <option>Báo giá</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[#64748b]">
                  Sắp xếp theo
                </label>
                <select
                  value={sortField ?? ""}
                  onChange={(e) =>
                    setSortField(
                      (e.target.value as GetInvoicesParams["sortField"]) ||
                        undefined,
                    )
                  }
                  className="h-10 w-full border border-[#d8e0ee] bg-white px-3 text-sm outline-none"
                >
                  <option value="">Không sắp xếp</option>
                  <option value="invoiceDate">Ngày hóa đơn</option>
                  <option value="grandTotal">Tổng tiền</option>
                  <option value="debtValue">Còn nợ</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[#64748b]">
                  Thứ tự
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) =>
                    setSortOrder(e.target.value as "asc" | "desc")
                  }
                  className="h-10 w-full border border-[#d8e0ee] bg-white px-3 text-sm outline-none"
                >
                  <option value="asc">Tăng dần</option>
                  <option value="desc">Giảm dần</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Toolbar */}
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
              onClick={handleReceivePayment}
              className="h-9 whitespace-nowrap border border-[#d8e0ee] bg-white px-4 text-sm font-semibold text-[#b07800] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Ghi nhận thanh toán
            </button>

            <button
              disabled={selectedIds.length === 0}
              onClick={() => handlePrintPdf()}
              className="flex h-9 whitespace-nowrap items-center gap-2 border border-[#d8e0ee] bg-white px-4 text-sm font-semibold text-[#64748b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Printer className="h-4 w-4" />
              In hóa đơn
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto">
          <table className="w-full min-w-[1300px] border-collapse bg-white text-left text-[12px] [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap">
            <thead>
              <tr className="h-10 border-b border-[#d8e0ee] bg-[#f8fafc] text-[12px] font-semibold text-[#0f172a]">
                <th className="w-12 px-3">
                  <input
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    type="checkbox"
                    className="h-4 w-4"
                  />
                </th>
                <th className="w-14 px-3">STT</th>
                <th className="w-[120px] px-2">Thao tác</th>
                <th className="w-[125px] px-2">Số hóa đơn</th>
                <th className="w-[105px] px-2">Ngày HĐ</th>
                <th className="w-[120px] px-2">Loại CT</th>
                <th className="w-[115px] px-2">MST</th>
                <th className="w-[280px] px-2">Tên đơn vị / đối tác</th>
                <th className="w-[125px] px-2 text-right">Tiền hàng</th>
                <th className="w-[120px] px-2 text-right">Đã TT</th>
                <th className="w-[120px] px-2 text-right">Còn nợ</th>
                <th className="w-[120px] px-2">HTTT</th>
                <th className="w-[125px] px-2">Trạng thái</th>
                <th className="w-[130px] px-2">Người tạo</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={14}
                    className="h-32 text-center text-sm text-[#94a3b8]"
                  >
                    Đang tải...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td
                    colSpan={14}
                    className="h-32 text-center text-sm font-medium text-[#94a3b8]"
                  >
                    Không tìm thấy hóa đơn phù hợp
                  </td>
                </tr>
              ) : (
                invoices.map((invoice, index) => (
                  <tr
                    key={invoice.id}
                    className="h-9 border-b border-[#e8edf5] text-[12px] text-[#0f172a] hover:bg-[#f8fafc]"
                  >
                    <td className="px-3">
                      <input
                        checked={selectedIds.includes(invoice.id)}
                        onChange={() => toggleSelectOne(invoice.id)}
                        type="checkbox"
                        className="h-4 w-4"
                      />
                    </td>
                    <td className="px-3 text-[#64748b]">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="px-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/invoices/${invoice.id}`)}
                          className="font-semibold text-[#063591]"
                        >
                          Xem
                        </button>
                        <button
                          onClick={() =>
                            router.push(
                              `/invoices/form?mode=edit&id=${invoice.id}`,
                            )
                          }
                          className="font-semibold text-[#063591]"
                        >
                          Sửa
                        </button>
                        {invoice.status !== "CANCELLED" && (
                          <button
                            onClick={() => handleCancelInvoice(invoice.id)}
                            className="font-semibold text-red-500"
                          >
                            Hủy
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-2 font-bold text-red-600">
                      {invoice.code}
                    </td>
                    <td className="px-2">
                      {invoice.invoiceDate
                        ? new Date(invoice.invoiceDate).toLocaleDateString(
                            "vi-VN",
                          )
                        : "-"}
                    </td>
                    <td className="px-2">{invoice.invoiceType ?? "-"}</td>
                    <td className="px-2">{invoice.taxCode ?? "-"}</td>
                    <td
                      title={invoice.customerName}
                      className="max-w-[280px] truncate px-2 font-semibold"
                    >
                      {invoice.customerName}
                    </td>
                    <td className="px-2 text-right font-bold text-[#175cff]">
                      {formatMoney(invoice.grandTotal)}
                    </td>
                    <td className="px-3 text-right text-[#00994d]">
                      {formatMoney(invoice.paidValue)}
                    </td>
                    <td className="px-3 text-right font-semibold text-[#d35400]">
                      {formatMoney(invoice.debtValue)}
                    </td>
                    <td className="px-3">{invoice.paymentMethod ?? "-"}</td>
                    <td className="px-3">
                      <StatusBadge status={invoice.status} />
                    </td>
                    <td className="px-3">{invoice.createdByName ?? "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <footer className="flex h-14 items-center justify-between border-t border-[#d8e0ee] bg-white px-4 text-sm text-[#64748b]">
          <span>Tổng: {total} hóa đơn</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="disabled:opacity-40"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
              )
              .map((p, i, arr) => (
                <>
                  {i > 0 && arr[i - 1] !== p - 1 && (
                    <span key={`ellipsis-${p}`} className="text-[#94a3b8]">
                      ...
                    </span>
                  )}
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={p === page ? "font-semibold text-[#063591]" : ""}
                  >
                    {p}
                  </button>
                </>
              ))}
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="disabled:opacity-40"
            >
              ›
            </button>
          </div>
        </footer>
      </section>

      <div className="fixed left-[-99999px] top-0">
        <div ref={printRef}>
          <PrintableInvoice invoice={{ items: [] }} />
        </div>
      </div>
    </div>
  );
}
