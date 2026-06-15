"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Download,
  FilePlus2,
  Printer,
  RefreshCcw,
  Search,
} from "lucide-react";

type QuoteStatus = "Nháp" | "Đã ghi" | "Đã chuyển" | "Hết hiệu lực" | "Đã hủy";

type Quote = {
  id: number;
  code: string;
  customer: string;
  taxCode: string;
  createdAt: string;
  createdDate: string;
  quoteDate: string;
  validUntil: string;
  totalValue: number;
  status: QuoteStatus;
  creator: string;
  invoiceCode?: string;
};

const initialQuotes: Quote[] = [
  {
    id: 1,
    code: "BG26-000001",
    customer: "CÔNG TY CƠ KHÍ MINH TRÍ",
    taxCode: "0101011308",
    createdAt: "02/06/2026 10:00",
    createdDate: "2026-06-02",
    quoteDate: "02/06/2026",
    validUntil: "17/06/2026",
    totalValue: 92092500,
    status: "Đã ghi",
    creator: "Trương Quang Quốc",
  },
  {
    id: 2,
    code: "BG26-000002",
    customer: "CÔNG TY NAM PHÁT",
    taxCode: "0312345678",
    createdAt: "04/06/2026 08:30",
    createdDate: "2026-06-04",
    quoteDate: "04/06/2026",
    validUntil: "19/06/2026",
    totalValue: 16800000,
    status: "Đã chuyển",
    creator: "Phạm Thị Kim Ánh",
    invoiceCode: "BL26-000004",
  },
  {
    id: 3,
    code: "BG26-000003",
    customer: "KHÁCH LẺ",
    taxCode: "-",
    createdAt: "06/06/2026 14:20",
    createdDate: "2026-06-06",
    quoteDate: "06/06/2026",
    validUntil: "21/06/2026",
    totalValue: 3250000,
    status: "Nháp",
    creator: "Nguyễn Văn Hồng",
  },
];

const tabs = [
  "Tất cả",
  "Nháp",
  "Đã ghi",
  "Đã chuyển",
  "Hết hiệu lực",
  "Đã hủy",
];

const formatMoney = (value: number) => `${value.toLocaleString("vi-VN")}đ`;

function StatusBadge({ status }: { status: QuoteStatus }) {
  const style =
    status === "Đã chuyển"
      ? "bg-[#dcfce7] text-[#047857]"
      : status === "Đã ghi"
        ? "bg-[#dbeafe] text-[#1d4ed8]"
        : status === "Nháp"
          ? "bg-[#fef3c7] text-[#b45309]"
          : status === "Hết hiệu lực"
            ? "bg-[#fee2e2] text-[#b91c1c]"
            : "bg-[#f1f5f9] text-[#64748b]";

  return (
    <span
      title={status}
      className={`inline-flex whitespace-nowrap px-2 py-1 text-[11px] font-bold ${style}`}
    >
      {status}
    </span>
  );
}

export default function QuotesPage() {
  const router = useRouter();

  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [keyword, setKeyword] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả trạng thái");
  const [creatorFilter, setCreatorFilter] = useState("Tất cả");
  const [convertFilter, setConvertFilter] = useState("Tất cả");
  const [sortField, setSortField] = useState("Không sắp xếp");
  const [sortDirection, setSortDirection] = useState("Tăng dần");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const savedQuotes = JSON.parse(
      localStorage.getItem("hongphat_mock_quotes") || "[]",
    );

    const normalizedQuotes = savedQuotes.map((item: any) => ({
      id: item.id ?? Date.now(),
      code: item.code ?? "BG26-000000",
      customer: item.customer ?? "KHÁCH LẺ",
      taxCode: item.taxCode || "-",
      createdAt: item.createdAt ?? "",
      createdDate:
        item.createdDate ??
        item.quoteDate ??
        new Date().toISOString().slice(0, 10),
      quoteDate: item.quoteDateText ?? item.quoteDate ?? "",
      validUntil: item.validUntil ?? "",
      totalValue: item.totalValue ?? 0,
      status: item.status ?? "Nháp",
      creator: item.creator ?? item.createdBy?.name ?? "Phạm Thị Kim Ánh",
      invoiceCode: item.invoiceCode,
    }));

    setQuotes([...normalizedQuotes, ...initialQuotes]);
  }, []);

  const filteredQuotes = useMemo(() => {
    const result = quotes.filter((quote) => {
      const matchTab =
        activeTab === "Tất cả" ? true : quote.status === activeTab;

      const matchStatus =
        statusFilter === "Tất cả trạng thái"
          ? true
          : quote.status === statusFilter;

      const searchText =
        `${quote.code} ${quote.customer} ${quote.taxCode} ${quote.invoiceCode || ""}`.toLowerCase();

      const matchKeyword = searchText.includes(keyword.toLowerCase().trim());
      const matchFromDate = fromDate ? quote.createdDate >= fromDate : true;
      const matchToDate = toDate ? quote.createdDate <= toDate : true;

      const matchCreator =
        creatorFilter === "Tất cả" ? true : quote.creator === creatorFilter;

      const matchConvert =
        convertFilter === "Tất cả"
          ? true
          : convertFilter === "Chưa chuyển"
            ? quote.status !== "Đã chuyển"
            : quote.status === "Đã chuyển";

      return (
        matchTab &&
        matchStatus &&
        matchKeyword &&
        matchFromDate &&
        matchToDate &&
        matchCreator &&
        matchConvert
      );
    });

    if (sortField === "Tổng tiền") {
      result.sort((a, b) =>
        sortDirection === "Tăng dần"
          ? a.totalValue - b.totalValue
          : b.totalValue - a.totalValue,
      );
    }

    if (sortField === "Ngày báo giá") {
      result.sort((a, b) =>
        sortDirection === "Tăng dần"
          ? a.createdDate.localeCompare(b.createdDate)
          : b.createdDate.localeCompare(a.createdDate),
      );
    }

    return result;
  }, [
    activeTab,
    convertFilter,
    creatorFilter,
    fromDate,
    keyword,
    quotes,
    sortDirection,
    sortField,
    statusFilter,
    toDate,
  ]);

  const allSelected =
    filteredQuotes.length > 0 &&
    filteredQuotes.every((quote) => selectedIds.includes(quote.id));

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? [] : filteredQuotes.map((item) => item.id));
  };

  const toggleSelectOne = (id: number) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const resetFilters = () => {
    setIsResetting(true);
    setActiveTab("Tất cả");
    setKeyword("");
    setFromDate("");
    setToDate("");
    setStatusFilter("Tất cả trạng thái");
    setCreatorFilter("Tất cả");
    setConvertFilter("Tất cả");
    setSortField("Không sắp xếp");
    setSortDirection("Tăng dần");
    setSelectedIds([]);
    setTimeout(() => setIsResetting(false), 450);
  };

  const handleCancelQuote = (id: number) => {
    setQuotes((current) =>
      current.map((quote) =>
        quote.id === id ? { ...quote, status: "Đã hủy" } : quote,
      ),
    );
  };

  const handleConvertToInvoice = (quote: Quote) => {
    if (quote.status === "Đã chuyển") {
      alert(`Báo giá này đã chuyển thành hóa đơn ${quote.invoiceCode}`);
      return;
    }

    const invoiceCode = `BL26-${String(Date.now()).slice(-6)}`;

    const savedInvoices = JSON.parse(
      localStorage.getItem("hongphat_mock_invoices") || "[]",
    );

    const newInvoice = {
      id: Date.now(),
      code: invoiceCode,
      customer: quote.customer,
      taxCode: quote.taxCode,
      createdAt: new Date().toLocaleString("vi-VN"),
      createdDate: new Date().toISOString().slice(0, 10),
      invoiceDate: new Date().toLocaleDateString("vi-VN"),
      totalValue: quote.totalValue,
      paidValue: 0,
      status: "Chưa thanh toán",
      creator: quote.creator,
      paymentMethod: "Chuyển khoản",
      invoiceType: "Hóa đơn bán lẻ",
      sourceQuoteId: quote.id,
      sourceQuoteCode: quote.code,
    };

    localStorage.setItem(
      "hongphat_mock_invoices",
      JSON.stringify([newInvoice, ...savedInvoices]),
    );

    setQuotes((current) =>
      current.map((item) =>
        item.id === quote.id
          ? { ...item, status: "Đã chuyển", invoiceCode }
          : item,
      ),
    );

    alert(`Đã chuyển ${quote.code} thành hóa đơn ${invoiceCode}`);
  };

  return (
    <div className="space-y-4 p-4">
      <header className="flex items-center justify-between py-1">
        <div className="leading-tight">
          <h1 className="text-[18px] font-semibold tracking-[-0.02em] text-[#0f172a]">
            Quản lý báo giá
          </h1>
          <p className="mt-0.5 text-[11px] text-[#64748b]">
            Theo dõi báo giá, người lập, hiệu lực và trạng thái chuyển hóa đơn.
          </p>
        </div>

        <div className="relative flex items-center gap-2">
          <button
            onClick={() => alert("Mock: Xuất PDF danh sách báo giá")}
            className="flex h-10 items-center gap-2 border border-[#d8e0ee] bg-white px-4 text-sm font-semibold text-[#0f172a] hover:bg-[#f8fafc]"
          >
            <Download className="h-4 w-4" />
            Xuất PDF
          </button>

          <button
            onClick={() => router.push("/quotes/form")}
            className="flex h-10 items-center gap-2 bg-[#063591] px-4 text-sm font-bold text-white hover:bg-[#052b75]"
          >
            <FilePlus2 className="h-4 w-4" />
            Lập báo giá
          </button>
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
              <option>Nháp</option>
              <option>Đã ghi</option>
              <option>Đã chuyển</option>
              <option>Hết hiệu lực</option>
              <option>Đã hủy</option>
            </select>

            <div className="flex h-10 items-center border border-[#d8e0ee] bg-white px-3">
              <Search className="mr-2 h-4 w-4 text-[#94a3b8]" />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Tìm số báo giá, mã số thuế, tên đối tác..."
                className="h-full w-full bg-transparent text-sm outline-none placeholder:text-[#94a3b8]"
              />
            </div>

            <button
              onClick={() => setShowAdvancedSearch((value) => !value)}
              className="flex h-10 items-center gap-2 border border-[#d8e0ee] bg-white px-4 text-sm font-semibold text-[#063591]"
            >
              Tìm kiếm
              <ChevronDown
                className={[
                  "h-4 w-4 transition-transform duration-300",
                  showAdvancedSearch ? "rotate-180" : "",
                ].join(" ")}
              />
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
            <div className="grid overflow-hidden transition-all duration-300 ease-in-out max-h-[180px] opacity-100">
              <div className="grid grid-cols-5 gap-x-3 gap-y-4 pt-1">
                <div>
                  <label className="mb-1 block text-xs font-medium text-[#64748b]">
                    Người lập
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
                    Chuyển hóa đơn
                  </label>
                  <select
                    value={convertFilter}
                    onChange={(e) => setConvertFilter(e.target.value)}
                    className="h-10 w-full border border-[#d8e0ee] bg-white px-3 text-sm outline-none"
                  >
                    <option>Tất cả</option>
                    <option>Chưa chuyển</option>
                    <option>Đã chuyển</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-[#64748b]">
                    Loại chứng từ
                  </label>
                  <select
                    value="Báo giá"
                    disabled
                    className="h-10 w-full border border-[#d8e0ee] bg-[#f8fafc] px-3 text-sm text-[#64748b] outline-none"
                  >
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
                    <option>Ngày báo giá</option>
                    <option>Tổng tiền</option>
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
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-b border-[#d8e0ee] bg-[#f1f5f9] px-4 py-3">
          <div className="flex items-center divide-x divide-[#d8e0ee] text-sm">
            <button
              onClick={toggleSelectAll}
              className="pr-5 font-semibold text-[#0f172a]"
            >
              {allSelected ? "Bỏ chọn tất cả" : "Chọn báo giá"}
            </button>
            <span className="pl-5 text-[#64748b]">
              Đã chọn {selectedIds.length} báo giá
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={selectedIds.length === 0}
              onClick={() => alert("Mock: In các báo giá đã chọn")}
              className="flex h-9 whitespace-nowrap items-center gap-2 border border-[#d8e0ee] bg-white px-4 text-sm font-semibold text-[#64748b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Printer className="h-4 w-4" />
              In báo giá
            </button>

            <button
              disabled={selectedIds.length === 0}
              onClick={() => alert("Mock: Xuất PDF các báo giá đã chọn")}
              className="flex h-9 whitespace-nowrap items-center gap-2 border border-[#d8e0ee] bg-white px-4 text-sm font-semibold text-[#64748b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Xuất PDF
            </button>
          </div>
        </div>

        <div className="overflow-auto">
          <table className="w-full min-w-[1450px] border-collapse bg-white text-left text-[12px] [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap">
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
                <th className="w-[185px] px-2">Thao tác</th>
                <th className="w-[125px] px-2">Số báo giá</th>
                <th className="w-[105px] px-2">Ngày BG</th>
                <th className="w-[115px] px-2">Hiệu lực</th>
                <th className="w-[115px] px-2">MST</th>
                <th className="w-[340px] px-2">Tên đơn vị / đối tác</th>
                <th className="w-[135px] px-2 text-right">Tổng báo giá</th>
                <th className="w-[130px] px-2">Trạng thái</th>
                <th className="w-[130px] px-2">Người lập</th>
                <th className="w-[140px] px-2">Hóa đơn liên kết</th>
              </tr>
            </thead>

            <tbody>
              {filteredQuotes.map((quote, index) => (
                <tr
                  key={quote.id}
                  className="h-9 border-b border-[#e8edf5] text-[12px] text-[#0f172a] hover:bg-[#f8fafc]"
                >
                  <td className="px-3">
                    <input
                      checked={selectedIds.includes(quote.id)}
                      onChange={() => toggleSelectOne(quote.id)}
                      type="checkbox"
                      className="h-4 w-4"
                    />
                  </td>

                  <td className="px-3 text-[#64748b]">{index + 1}</td>

                  <td className="px-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          alert(
                            `Mock chi tiết:\n${quote.code}\nKhách: ${quote.customer}\nTổng: ${formatMoney(quote.totalValue)}\nTrạng thái: ${quote.status}`,
                          )
                        }
                        className="font-semibold text-[#063591]"
                      >
                        Xem
                      </button>

                      <button
                        onClick={() =>
                          router.push(`/quotes/form?id=${quote.id}`)
                        }
                        className="font-semibold text-[#063591]"
                      >
                        Sửa
                      </button>

                      {quote.status === "Đã chuyển" ? (
                        <button
                          onClick={() => router.push("/invoices")}
                          className="font-semibold text-[#047857]"
                        >
                          Xem HĐ
                        </button>
                      ) : (
                        <button
                          onClick={() => handleConvertToInvoice(quote)}
                          className="font-semibold text-[#d35400]"
                        >
                          Chuyển HĐ
                        </button>
                      )}

                      <button
                        onClick={() => handleCancelQuote(quote.id)}
                        className="font-semibold text-[#b91c1c]"
                      >
                        Hủy
                      </button>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-2 font-bold text-red-600">
                    {quote.code}
                  </td>
                  <td className="px-2">{quote.quoteDate}</td>
                  <td className="px-2">{quote.validUntil || "—"}</td>
                  <td className="px-2">{quote.taxCode}</td>
                  <td
                    title={quote.customer}
                    className="max-w-[340px] truncate px-2 font-semibold"
                  >
                    {quote.customer}
                  </td>
                  <td className="px-2 text-right font-bold text-[#175cff]">
                    {formatMoney(quote.totalValue)}
                  </td>
                  <td className="px-3">
                    <StatusBadge status={quote.status} />
                  </td>
                  <td className="px-3">{quote.creator}</td>
                  <td className="px-3 font-semibold text-[#64748b]">
                    {quote.invoiceCode || "—"}
                  </td>
                </tr>
              ))}

              {filteredQuotes.length === 0 && (
                <tr>
                  <td
                    colSpan={12}
                    className="h-32 text-center text-sm font-medium text-[#94a3b8]"
                  >
                    Không tìm thấy báo giá phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="flex h-14 items-center justify-between border-t border-[#d8e0ee] bg-white px-4 text-sm text-[#64748b]">
          <span>Tổng: {filteredQuotes.length} báo giá</span>

          <div className="flex items-center gap-4">
            <button className="text-[#94a3b8]">‹</button>
            <button className="font-semibold text-[#063591]">1</button>
            <button>2</button>
            <button>›</button>
            <select className="h-9 w-full min-w-0 border border-[#d8e0ee] bg-white px-3 outline-none">
              <option>10 / Trang</option>
              <option>20 / Trang</option>
              <option>50 / Trang</option>
            </select>
          </div>
        </footer>
      </section>
    </div>
  );
}
