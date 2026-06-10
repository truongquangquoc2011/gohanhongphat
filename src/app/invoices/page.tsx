"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import {
  ChevronDown,
  Download,
  FilePlus2,
  MoreHorizontal,
  Printer,
  RefreshCcw,
  Search,
} from "lucide-react";
import PrintableInvoice from "./components/PrintableInvoice";
import { useRouter } from "next/navigation";
type InvoiceStatus =
  | "Chưa thanh toán"
  | "Thanh toán một phần"
  | "Đã thanh toán"
  | "Công nợ"
  | "Đã hủy";

type PaymentMethod = "Tiền mặt" | "Chuyển khoản" | "Công nợ";

type InvoiceType =
  | "Hóa đơn bán lẻ"
  | "Phiếu xuất kho"
  | "Giấy đề nghị thanh toán"
  | "Báo giá";

type Invoice = {
  id: number;
  code: string;
  customer: string;
  taxCode: string;
  createdAt: string;
  createdDate: string;
  invoiceDate: string;
  totalValue: number;
  paidValue: number;
  status: InvoiceStatus;
  creator: string;
  paymentMethod: PaymentMethod;
  invoiceType: InvoiceType;
};

const printableInvoice = {
  items: [],
};

const initialInvoices: Invoice[] = [
  {
    id: 1,
    code: "BL26-000001",
    customer: "CÔNG TY CỔ PHẦN MANDACONS",
    taxCode: "0319461460",
    createdAt: "24/04/2026 09:15",
    createdDate: "2026-04-24",
    invoiceDate: "24/04/2026",
    totalValue: 10802000,
    paidValue: 0,
    status: "Công nợ",
    creator: "Phạm Thị Kim Ánh",
    paymentMethod: "Chuyển khoản",
    invoiceType: "Hóa đơn bán lẻ",
  },
  {
    id: 2,
    code: "BL26-000002",
    customer: "CÔNG TY TNHH THIẾT BỊ Y TẾ THANH KHANG",
    taxCode: "0318541811",
    createdAt: "27/05/2026 14:30",
    createdDate: "2026-05-27",
    invoiceDate: "27/05/2026",
    totalValue: 14652000,
    paidValue: 14652000,
    status: "Đã thanh toán",
    creator: "Nguyễn Văn Hồng",
    paymentMethod: "Tiền mặt",
    invoiceType: "Hóa đơn bán lẻ",
  },
  {
    id: 3,
    code: "BL26-000003",
    customer: "KHÁCH LẺ",
    taxCode: "-",
    createdAt: "31/05/2026 20:10",
    createdDate: "2026-05-31",
    invoiceDate: "31/05/2026",
    totalValue: 3250000,

    paidValue: 1000000,
    status: "Thanh toán một phần",
    creator: "Trương Quang Quốc",
    paymentMethod: "Chuyển khoản",
    invoiceType: "Hóa đơn bán lẻ",
  },
  {
    id: 4,
    code: "XK26-000001",
    customer: "CÔNG TY NAM PHÁT",
    taxCode: "0312345678",
    createdAt: "01/06/2026 08:30",
    createdDate: "2026-06-01",
    invoiceDate: "01/06/2026",
    totalValue: 6800000,
    paidValue: 0,
    status: "Chưa thanh toán",
    creator: "Phạm Thị Kim Ánh",
    paymentMethod: "Công nợ",
    invoiceType: "Phiếu xuất kho",
  },
  {
    id: 5,
    code: "BG26-000001",
    customer: "CÔNG TY CƠ KHÍ MINH TRÍ",
    taxCode: "0101011308",
    createdAt: "02/06/2026 10:00",
    createdDate: "2026-06-02",
    invoiceDate: "02/06/2026",
    totalValue: 92092500,
    paidValue: 0,
    status: "Chưa thanh toán",
    creator: "Trương Quang Quốc",
    paymentMethod: "Công nợ",
    invoiceType: "Báo giá",
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

const formatMoney = (value: number) => `${value.toLocaleString("vi-VN")}đ`;

const parseMoney = (value: string) => {
  return Number(
    value.replaceAll(".", "").replaceAll(",", "").replaceAll("đ", "").trim(),
  );
};

const getDebt = (invoice: Invoice) => {
  return Math.max(invoice.totalValue - invoice.paidValue, 0);
};

const getNextStatus = (invoice: Invoice): InvoiceStatus => {
  if (invoice.status === "Đã hủy") return "Đã hủy";
  if (invoice.paidValue >= invoice.totalValue) return "Đã thanh toán";
  if (invoice.paidValue > 0) return "Thanh toán một phần";
  return "Chưa thanh toán";
};

function StatusBadge({ status }: { status: string }) {
  const style =
    status === "Đã thanh toán"
      ? "bg-[#dcfce7] text-[#047857]"
      : status === "Công nợ"
        ? "bg-[#fef3c7] text-[#b45309]"
        : status === "Thanh toán một phần"
          ? "bg-[#dbeafe] text-[#1d4ed8]"
          : status === "Chưa thanh toán"
            ? "bg-[#fee2e2] text-[#b91c1c]"
            : "bg-[#f1f5f9] text-[#64748b]";

  const label = status === "Thanh toán một phần" ? "Một phần" : status;

  return (
    <span
      title={status}
      className={`inline-flex whitespace-nowrap px-2 py-1 text-[11px] font-bold ${style}`}
    >
      {label}
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

  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  useEffect(() => {
    const savedInvoices = JSON.parse(
      localStorage.getItem("hongphat_mock_invoices") || "[]",
    );

    const normalizedInvoices = savedInvoices.map((item: any) => ({
      id: item.id ?? Date.now(),
      code: item.code ?? "BL26-000000",
      customer: item.customer ?? "KHÁCH LẺ",
      taxCode: item.taxCode || "-",
      createdAt: item.createdAt ?? "",
      createdDate: item.createdDate ?? new Date().toISOString().slice(0, 10),
      invoiceDate: item.invoiceDate ?? "",
      totalValue: item.totalValue ?? 0,
      paidValue: item.paidValue ?? 0,
      status: item.status ?? "Chưa thanh toán",
      creator: item.creator ?? "Phạm Thị Kim Ánh",
      paymentMethod: item.paymentMethod ?? "Chuyển khoản",
      invoiceType: item.invoiceType ?? "Hóa đơn bán lẻ",
    }));

    setInvoices([...normalizedInvoices, ...initialInvoices]);
  }, []);
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [keyword, setKeyword] = useState("");
  const [fromDate, setFromDate] = useState("2026-04-01");
  const [toDate, setToDate] = useState("2026-06-02");
  const [statusFilter, setStatusFilter] = useState("Tất cả trạng thái");
  const [creatorFilter, setCreatorFilter] = useState("Tất cả");
  const [paymentFilter, setPaymentFilter] = useState("Tất cả");
  const [invoiceTypeFilter, setInvoiceTypeFilter] = useState("Tất cả");
  const [sortField, setSortField] = useState("Không sắp xếp");
  const [sortDirection, setSortDirection] = useState("Tăng dần");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openCreateMenu, setOpenCreateMenu] = useState(false);

  const filteredInvoices = useMemo(() => {
    const result = invoices.filter((invoice) => {
      const matchTab =
        activeTab === "Tất cả" ? true : invoice.status === activeTab;

      const matchStatus =
        statusFilter === "Tất cả trạng thái"
          ? true
          : invoice.status === statusFilter;

      const searchText =
        `${invoice.code} ${invoice.customer} ${invoice.taxCode}`.toLowerCase();

      const matchKeyword = searchText.includes(keyword.toLowerCase().trim());
      const matchFromDate = fromDate ? invoice.createdDate >= fromDate : true;
      const matchToDate = toDate ? invoice.createdDate <= toDate : true;

      const matchCreator =
        creatorFilter === "Tất cả" ? true : invoice.creator === creatorFilter;

      const matchPayment =
        paymentFilter === "Tất cả"
          ? true
          : invoice.paymentMethod === paymentFilter;

      const matchInvoiceType =
        invoiceTypeFilter === "Tất cả"
          ? true
          : invoice.invoiceType === invoiceTypeFilter;

      return (
        matchTab &&
        matchStatus &&
        matchKeyword &&
        matchFromDate &&
        matchToDate &&
        matchCreator &&
        matchPayment &&
        matchInvoiceType
      );
    });

    if (sortField === "Tổng tiền") {
      result.sort((a, b) =>
        sortDirection === "Tăng dần"
          ? a.totalValue - b.totalValue
          : b.totalValue - a.totalValue,
      );
    }

    if (sortField === "Ngày hóa đơn") {
      result.sort((a, b) =>
        sortDirection === "Tăng dần"
          ? a.createdDate.localeCompare(b.createdDate)
          : b.createdDate.localeCompare(a.createdDate),
      );
    }

    if (sortField === "Còn nợ") {
      result.sort((a, b) =>
        sortDirection === "Tăng dần"
          ? getDebt(a) - getDebt(b)
          : getDebt(b) - getDebt(a),
      );
    }

    return result;
  }, [
    activeTab,
    creatorFilter,
    fromDate,
    invoiceTypeFilter,
    invoices,
    keyword,
    paymentFilter,
    sortDirection,
    sortField,
    statusFilter,
    toDate,
  ]);

  const allSelected =
    filteredInvoices.length > 0 &&
    filteredInvoices.every((invoice) => selectedIds.includes(invoice.id));

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? [] : filteredInvoices.map((item) => item.id));
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
    setFromDate("2026-04-01");
    setToDate("2026-06-02");
    setStatusFilter("Tất cả trạng thái");
    setCreatorFilter("Tất cả");
    setPaymentFilter("Tất cả");
    setInvoiceTypeFilter("Tất cả");
    setSortField("Không sắp xếp");
    setSortDirection("Tăng dần");
    setSelectedIds([]);
  };

  const handleReceivePayment = () => {
    if (selectedIds.length === 0) return;

    const input = window.prompt("Nhập số tiền đã thanh toán:", "1000000");
    if (!input) return;

    const amount = parseMoney(input);

    if (!amount || amount <= 0) {
      alert("Số tiền không hợp lệ");
      return;
    }

    setInvoices((current) =>
      current.map((invoice) => {
        if (!selectedIds.includes(invoice.id)) return invoice;

        const nextPaid = Math.min(
          invoice.paidValue + amount,
          invoice.totalValue,
        );

        const nextInvoice = {
          ...invoice,
          paidValue: nextPaid,
        };

        return {
          ...nextInvoice,
          status: getNextStatus(nextInvoice),
        };
      }),
    );

    alert("Đã ghi nhận thanh toán mock");
    setSelectedIds([]);
  };

  const handleMarkDebt = () => {
    if (selectedIds.length === 0) return;

    setInvoices((current) =>
      current.map((invoice) =>
        selectedIds.includes(invoice.id)
          ? {
              ...invoice,
              status: "Công nợ",
              paymentMethod: "Công nợ",
            }
          : invoice,
      ),
    );

    alert("Đã báo công nợ mock");
    setSelectedIds([]);
  };

  const handleCancelInvoice = (id: number) => {
    setInvoices((current) =>
      current.map((invoice) =>
        invoice.id === id
          ? {
              ...invoice,
              status: "Đã hủy",
            }
          : invoice,
      ),
    );
  };

  const handleMarkSinglePaid = (id: number) => {
    setInvoices((current) =>
      current.map((invoice) =>
        invoice.id === id
          ? {
              ...invoice,
              paidValue: invoice.totalValue,
              status: "Đã thanh toán",
            }
          : invoice,
      ),
    );
  };

  return (
    <div className="space-y-4">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-[#0f172a]">
            Quản lý hóa đơn
          </h1>
          <p className="mt-1 text-sm text-[#64748b]">
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
            onClick={() => setOpenCreateMenu((value) => !value)}
            className="flex h-10 items-center gap-2 bg-[#063591] px-4 text-sm font-bold text-white hover:bg-[#052b75]"
          >
            <FilePlus2 className="h-4 w-4" />
            Thêm mới
            <ChevronDown className="h-4 w-4" />
          </button>

          {openCreateMenu && (
            <div className="absolute right-0 top-12 z-20 w-[250px] border border-[#d8e0ee] bg-white shadow-lg">
              {[
                "Lập hóa đơn bán lẻ",
                "Lập phiếu xuất kho",
                "Giấy đề nghị thanh toán",
                "Lập báo giá",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setOpenCreateMenu(false);

                    if (item === "Lập hóa đơn bán lẻ") {
                      router.push("/invoices/form");
                      return;
                    }
                    if (item === "Lập phiếu xuất kho") {
                      router.push("/warehouse/create");
                      return;
                    }
                    if (item === "Giấy đề nghị thanh toán") {
                      router.push("/quotes/create");
                      return;
                    }
                    if (item === "Lập báo giá") {
                      router.push("/payment-request/create");
                      return;
                    }

                    alert(`Mock: ${item}`);
                  }}
                  className="block w-full border-b border-[#e8edf5] px-4 py-3 text-left text-sm font-semibold hover:bg-[#f8fafc]"
                >
                  › {item}
                </button>
              ))}
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

        <div className="space-y-3 border-b border-[#d8e0ee] bg-[#f8fafc] p-4">
          <div className="grid grid-cols-[0.75fr_0.75fr_0.9fr_1.45fr_auto_auto] gap-3">
            <label className="flex h-10 items-center gap-2 border border-[#d8e0ee] bg-white px-3 text-sm">
              <span className="shrink-0 text-[#64748b]">Từ ngày:</span>
              <input
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                className="h-full w-full bg-transparent outline-none"
              />
            </label>

            <label className="flex h-10 items-center gap-2 border border-[#d8e0ee] bg-white px-3 text-sm">
              <span className="shrink-0 text-[#64748b]">Đến ngày:</span>
              <input
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
                className="h-full w-full bg-transparent outline-none"
              />
            </label>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-10 border border-[#d8e0ee] bg-white px-3 text-sm outline-none"
            >
              <option>Tất cả trạng thái</option>
              <option>Chưa thanh toán</option>
              <option>Thanh toán một phần</option>
              <option>Đã thanh toán</option>
              <option>Công nợ</option>
              <option>Đã hủy</option>
            </select>

            <div className="flex h-10 items-center border border-[#d8e0ee] bg-white px-3">
              <Search className="mr-2 h-4 w-4 text-[#94a3b8]" />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Tìm số hóa đơn, mã số thuế, tên đối tác..."
                className="h-full w-full bg-transparent text-sm outline-none placeholder:text-[#94a3b8]"
              />
            </div>

            <button
              onClick={() => setShowAdvancedSearch((value) => !value)}
              className="flex h-10 items-center gap-2 border border-[#d8e0ee] bg-white px-4 text-sm font-semibold text-[#063591]"
            >
              Tìm kiếm
              <ChevronDown className="h-4 w-4" />
            </button>

            <button
              onClick={resetFilters}
              className="flex h-10 items-center gap-2 border border-[#d8e0ee] bg-white px-4 text-sm font-semibold"
            >
              <RefreshCcw className="h-4 w-4" />
              Đặt lại
            </button>
          </div>

          {showAdvancedSearch && (
            <div className="grid grid-cols-5 gap-x-3 gap-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-[#64748b]">
                  Người tạo
                </label>
                <select
                  value={creatorFilter}
                  onChange={(e) => setCreatorFilter(e.target.value)}
                  className="h-10 w-full border border-[#d8e0ee] bg-white px-3 text-sm outline-none"
                >
                  <option>Tất cả</option>
                  <option>Phạm Thị Kim Ánh</option>
                  <option>Nguyễn Văn Hồng</option>
                  <option>Trương Quang Quốc</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[#64748b]">
                  Thanh toán
                </label>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="h-10 w-full border border-[#d8e0ee] bg-white px-3 text-sm outline-none"
                >
                  <option>Tất cả</option>
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
                  <option>Tất cả</option>
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
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                  className="h-10 w-full border border-[#d8e0ee] bg-white px-3 text-sm outline-none"
                >
                  <option>Không sắp xếp</option>
                  <option>Ngày hóa đơn</option>
                  <option>Tổng tiền</option>
                  <option>Còn nợ</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[#64748b]">
                  Thứ tự
                </label>
                <select
                  value={sortDirection}
                  onChange={(e) => setSortDirection(e.target.value)}
                  className="h-10 w-full border border-[#d8e0ee] bg-white px-3 text-sm outline-none"
                >
                  <option>Tăng dần</option>
                  <option>Giảm dần</option>
                </select>
              </div>
            </div>
          )}
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
              onClick={handleMarkDebt}
              className="h-9 whitespace-nowrap w-full min-w-0 border border-[#d8e0ee]bg-white px-4 text-sm font-semibold text-[#b07800] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Báo công nợ
            </button>

            <button
              disabled={selectedIds.length === 0}
              onClick={() => handlePrintPdf()}
              className="flex whitespace-nowrap h-9 items-center gap-2 border border-[#d8e0ee] bg-white px-4 text-sm font-semibold text-[#64748b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Printer className="h-4  w-4" />
              In hóa đơn
            </button>
          </div>
        </div>

        <div className="overflow-auto">
          <table className="w-full min-w-[1280px] border-collapse bg-white text-left text-[12px]">
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
                <th className="w-[150px] px-3">Thao tác</th>
                <th className="w-[115px] px-2">Số hóa đơn</th>
                <th className="w-[105px] px-2">Ngày HĐ</th>
                <th className="w-[105px] px-2">Loại CT</th>
                <th className="w-[115px] px-2">MST</th>
                <th className="w-[280px] px-2">Tên đơn vị / đối tác</th>
                <th className="w-[120px] px-2 text-right">Tiền hàng</th>
                <th className="w-[120px] px-2 text-right">Đã TT</th>
                <th className="w-[115px] px-2 text-right">Còn nợ</th>
                <th className="w-[105px] px-2">HTTT</th>
                <th className="w-[105px] px-2">Trạng thái</th>
                <th className="w-[120px] px-2">Người tạo</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice, index) => (
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

                  <td className="px-3 text-[#64748b]">{index + 1}</td>

                  <td className="px-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          alert(
                            `Mock chi tiết:\n${invoice.code}\nKhách: ${invoice.customer}\nTổng: ${formatMoney(invoice.totalValue)}\nCòn nợ: ${formatMoney(getDebt(invoice))}`,
                          )
                        }
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

                    </div>
                  </td>

                  <td className="whitespace-nowrap px-2 font-bold text-red-600">
                    {invoice.code}
                  </td>
                  <td className="px-3">{invoice.invoiceDate}</td>
                  <td className="px-3">{invoice.invoiceType}</td>
                  <td className="px-3">{invoice.taxCode}</td>
                  <td
                    title={invoice.customer}
                    className="max-w-[240px] truncate px-2 font-semibold"
                  >
                    {invoice.customer}
                  </td>
                  <td className="px-3 text-right font-bold text-[#175cff]">
                    {formatMoney(invoice.totalValue)}
                  </td>
                  <td className="px-3 text-right text-[#00994d]">
                    {formatMoney(invoice.paidValue)}
                  </td>
                  <td className="px-3 text-right font-semibold text-[#d35400]">
                    {formatMoney(getDebt(invoice))}
                  </td>
                  <td className="px-3">{invoice.paymentMethod}</td>
                  <td className="px-3">
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td className="px-3">{invoice.creator}</td>
                </tr>
              ))}

              {filteredInvoices.length === 0 && (
                <tr>
                  <td
                    colSpan={18}
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
            <select className="h-9 w-full min-w-0 border border-[#d8e0ee]bg-white px-3 outline-none">
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
