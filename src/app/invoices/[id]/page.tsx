"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import { ArrowLeft, Printer, Pencil, XCircle } from "lucide-react";
import { toast } from "sonner";
import PrintableInvoice from "../components/PrintableInvoice";
import {
  getInvoiceById,
  cancelInvoice,
  type Invoice,
} from "../../core/api/invoice.api";

const formatMoney = (value: number) => `${value.toLocaleString("vi-VN")}đ`;

const STATUS_LABEL: Record<string, string> = {
  UNPAID: "Chưa thanh toán",
  PARTIAL: "Thanh toán một phần",
  PAID: "Đã thanh toán",
  CANCELLED: "Đã hủy",
};

const STATUS_STYLE: Record<string, string> = {
  PAID: "bg-[#dcfce7] text-[#047857]",
  PARTIAL: "bg-[#dbeafe] text-[#1d4ed8]",
  UNPAID: "bg-[#fee2e2] text-[#b91c1c]",
  CANCELLED: "bg-[#f1f5f9] text-[#64748b]",
};

const safeDate = (value: any, format: "date" | "datetime" = "date"): string => {
  try {
    if (!value || typeof value === "object") return "-";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "-";
    return format === "datetime"
      ? d.toLocaleString("vi-VN")
      : d.toLocaleDateString("vi-VN");
  } catch {
    return "-";
  }
};

const safeDateISO = (value: any): string => {
  try {
    if (!value || typeof value === "object")
      return new Date().toISOString().slice(0, 10);
    const d = new Date(value);
    if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
    return d.toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
};

const numberToVietnameseWords = (value: number) => {
  if (!value) return "Không đồng";
  const ones = [
    "",
    "một",
    "hai",
    "ba",
    "bốn",
    "năm",
    "sáu",
    "bảy",
    "tám",
    "chín",
  ];
  const readTriple = (num: number, full = false) => {
    const hundred = Math.floor(num / 100);
    const ten = Math.floor((num % 100) / 10);
    const unit = num % 10;
    const words: string[] = [];
    if (hundred > 0) words.push(ones[hundred], "trăm");
    else if (full && (ten > 0 || unit > 0)) words.push("không", "trăm");
    if (ten > 1) {
      words.push(ones[ten], "mươi");
      if (unit === 1) words.push("mốt");
      else if (unit === 5) words.push("lăm");
      else if (unit > 0) words.push(ones[unit]);
    } else if (ten === 1) {
      words.push("mười");
      if (unit === 5) words.push("lăm");
      else if (unit > 0) words.push(ones[unit]);
    } else if (unit > 0) {
      if (hundred > 0 || full) words.push("lẻ");
      words.push(ones[unit]);
    }
    return words.join(" ");
  };
  const groups = [
    { value: 1_000_000_000, label: "tỷ" },
    { value: 1_000_000, label: "triệu" },
    { value: 1_000, label: "nghìn" },
    { value: 1, label: "" },
  ];
  let remaining = Math.floor(value);
  const result: string[] = [];
  let hasHigherGroup = false;
  for (const group of groups) {
    const groupNumber = Math.floor(remaining / group.value);
    remaining %= group.value;
    if (groupNumber > 0) {
      result.push(readTriple(groupNumber, hasHigherGroup), group.label);
      hasHigherGroup = true;
    }
  }
  const text = result.join(" ").replace(/\s+/g, " ").trim();
  return text.charAt(0).toUpperCase() + text.slice(1) + " đồng";
};

export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string)?.trim();
  const printRef = useRef<HTMLDivElement>(null);

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `hoa-don-${invoice?.code ?? ""}`,
  });

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const data = await getInvoiceById(id);
        setInvoice(data);
      } catch {
        toast.error("Không tìm thấy hóa đơn");
        router.push("/invoices");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id, router]);

  const handleCancel = async () => {
    if (!invoice) return;
    if (!confirm("Bạn có chắc muốn hủy hóa đơn này?")) return;
    try {
      await cancelInvoice(invoice.id);
      toast.success("Đã hủy hóa đơn");
      router.push("/invoices");
    } catch {
      toast.error("Hủy hóa đơn thất bại");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[#94a3b8]">
        Đang tải...
      </div>
    );
  }

  if (!invoice) return null;

  const items = (invoice.items ?? []) as any[];

  const printableInvoice = {
    code: invoice.code,
    date: safeDateISO(invoice.invoiceDate),
    buyerName: invoice.buyerPerson ?? "",
    companyName: invoice.customerName,
    taxCode: invoice.taxCode ?? "",
    address: invoice.buyerAddress ?? "",
    paymentMethod: invoice.paymentMethod ?? "",
    accountNo: invoice.accountNo ?? "",
    amountInWords: numberToVietnameseWords(invoice.grandTotal),
    vatRate: invoice.vatRate / 100,
    items: items.map((item: any) => ({
      name: item.name,
      unit: item.unit,
      quantity: item.quantity,
      price: item.price,
    })),
  };

  return (
    <div className="flex min-h-full flex-col gap-4 p-4">
      {/* Header */}
      <header className="flex items-center justify-between py-1">
        <button
          onClick={() => router.push("/invoices")}
          className="flex items-center gap-2 text-sm font-semibold text-[#063591]"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePrint()}
            className="flex h-9 items-center gap-2 border border-[#d8e0ee] bg-white px-4 text-sm font-semibold text-[#0f172a] hover:bg-[#f8fafc]"
          >
            <Printer className="h-4 w-4" />
            In hóa đơn
          </button>
          {invoice.status !== "CANCELLED" && (
            <>
              <button
                onClick={() =>
                  router.push(`/invoices/form?mode=edit&id=${invoice.id}`)
                }
                className="flex h-9 items-center gap-2 border border-[#d8e0ee] bg-white px-4 text-sm font-semibold text-[#063591] hover:bg-[#f8fafc]"
              >
                <Pencil className="h-4 w-4" />
                Chỉnh sửa
              </button>
              <button
                onClick={handleCancel}
                className="flex h-9 items-center gap-2 border border-red-200 bg-white px-4 text-sm font-semibold text-red-500 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4" />
                Hủy hóa đơn
              </button>
            </>
          )}
        </div>
      </header>

      <div className="border border-[#d8e0ee] bg-white">
        {/* Title */}
        <div className="border-b border-[#d8e0ee] bg-[#f8fafc] px-5 py-4 text-center">
          <h1 className="text-[20px] font-bold uppercase text-[#0f172a]">
            Hóa đơn bán lẻ
          </h1>
          <p className="mt-1 text-sm text-[#64748b]">
            Số hóa đơn:{" "}
            <span className="font-bold text-red-600">{invoice.code}</span>
          </p>
        </div>

        <div className="p-5">
          {/* Trạng thái */}
          <div className="mb-5 flex items-center gap-3">
            <span className="text-sm text-[#64748b]">Trạng thái:</span>
            <span
              className={`inline-flex px-3 py-1 text-xs font-bold ${STATUS_STYLE[invoice.status] ?? "bg-[#f1f5f9] text-[#64748b]"}`}
            >
              {STATUS_LABEL[invoice.status] ?? invoice.status}
            </span>
          </div>

          {/* Thông tin 2 cột */}
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div className="space-y-2 border border-[#d8e0ee] p-4">
              <p className="mb-3 font-bold text-[#0f172a]">
                Thông tin người mua
              </p>
              <Row
                label="Tên đơn vị / khách"
                value={invoice.customerName}
                bold
              />
              <Row label="Người mua hàng" value={invoice.buyerPerson} />
              <Row label="Mã số thuế" value={invoice.taxCode} />
              <Row label="Địa chỉ" value={invoice.buyerAddress} />
              <Row label="Số điện thoại" value={invoice.phone} />
              <Row label="Email" value={invoice.email} />
            </div>

            <div className="space-y-2 border border-[#d8e0ee] p-4">
              <p className="mb-3 font-bold text-[#0f172a]">Thông tin hóa đơn</p>
              <Row
                label="Số hóa đơn"
                value={invoice.code}
                bold
                color="text-red-600"
              />
              <Row label="Ngày hóa đơn" value={safeDate(invoice.invoiceDate)} />
              <Row label="Loại chứng từ" value={invoice.invoiceType} />
              <Row label="Hình thức TT" value={invoice.paymentMethod} />
              <Row label="Số tài khoản" value={invoice.accountNo} />
              <Row label="Người tạo" value={invoice.createdByName} />
              <Row
                label="Ngày tạo"
                value={safeDate(invoice.createdAt, "datetime")}
              />
            </div>
          </div>

          {/* Bảng hàng hóa */}
          <div className="mt-5 border border-[#d8e0ee]">
            <div className="border-b border-[#d8e0ee] bg-[#f8fafc] px-3 py-2 text-sm font-bold">
              Danh sách hàng hóa & dịch vụ
            </div>
            <div className="overflow-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[#dff6ff] text-[12px] font-semibold text-[#0f172a]">
                    <th className="border border-[#cfe8f3] px-3 py-2 text-center">
                      STT
                    </th>
                    <th className="border border-[#cfe8f3] px-3 py-2">
                      Mã hàng
                    </th>
                    <th className="border border-[#cfe8f3] px-3 py-2">
                      Tên hàng hóa & dịch vụ
                    </th>
                    <th className="border border-[#cfe8f3] px-3 py-2">
                      Tính chất
                    </th>
                    <th className="border border-[#cfe8f3] px-3 py-2">ĐVT</th>
                    <th className="border border-[#cfe8f3] px-3 py-2 text-right">
                      Số lượng
                    </th>
                    <th className="border border-[#cfe8f3] px-3 py-2 text-right">
                      Đơn giá
                    </th>
                    <th className="border border-[#cfe8f3] px-3 py-2 text-right">
                      Chiết khấu
                    </th>
                    <th className="border border-[#cfe8f3] px-3 py-2 text-right">
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="py-6 text-center text-[#94a3b8]"
                      >
                        Không có hàng hóa
                      </td>
                    </tr>
                  ) : (
                    items.map((item: any, index: number) => {
                      const amount = Math.max(
                        item.quantity * item.price - (item.discount ?? 0),
                        0,
                      );
                      return (
                        <tr
                          key={index}
                          className="h-10 border-b border-[#e8edf5]"
                        >
                          <td className="border border-[#e8edf5] px-3 text-center text-[#64748b]">
                            {index + 1}
                          </td>
                          <td className="border border-[#e8edf5] px-3">
                            {item.productCode || "-"}
                          </td>
                          <td className="border border-[#e8edf5] px-3 font-semibold">
                            {item.name}
                          </td>
                          <td className="border border-[#e8edf5] px-3 text-[#64748b]">
                            {item.property || "-"}
                          </td>
                          <td className="border border-[#e8edf5] px-3">
                            {item.unit || "-"}
                          </td>
                          <td className="border border-[#e8edf5] px-3 text-right">
                            {item.quantity}
                          </td>
                          <td className="border border-[#e8edf5] px-3 text-right">
                            {formatMoney(item.price)}
                          </td>
                          <td className="border border-[#e8edf5] px-3 text-right">
                            {item.discount ? formatMoney(item.discount) : "-"}
                          </td>
                          <td className="border border-[#e8edf5] bg-[#f8fafc] px-3 text-right font-semibold text-[#175cff]">
                            {formatMoney(amount)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tổng tiền */}
          <div className="mt-5 flex justify-end">
            <div className="w-[340px] space-y-2 border border-[#d8e0ee] p-4 text-sm">
              <SumRow
                label="Cộng tiền hàng"
                value={formatMoney(invoice.subtotal)}
              />
              {invoice.vatRate > 0 && (
                <SumRow
                  label={`Thuế GTGT (${invoice.vatRate}%)`}
                  value={formatMoney(invoice.vatAmount)}
                  color="text-orange-600"
                />
              )}
              <div className="my-2 border-t border-[#d8e0ee]" />
              <SumRow
                label="Tổng thanh toán"
                value={formatMoney(invoice.grandTotal)}
                bold
                color="text-red-600"
              />
              <SumRow
                label="Đã thanh toán"
                value={formatMoney(invoice.paidValue)}
                color="text-[#00994d]"
              />
              <SumRow
                label="Còn nợ"
                value={formatMoney(invoice.debtValue)}
                bold
                color="text-[#d35400]"
              />
            </div>
          </div>

          {/* Ghi chú */}
          {(invoice.invoiceNote || invoice.internalNote) && (
            <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
              {invoice.invoiceNote && (
                <div className="border border-[#d8e0ee] p-3">
                  <p className="mb-1 font-semibold text-[#64748b]">
                    Ghi chú trên hóa đơn
                  </p>
                  <p>{invoice.invoiceNote}</p>
                </div>
              )}
              {invoice.internalNote && (
                <div className="border border-[#d8e0ee] p-3">
                  <p className="mb-1 font-semibold text-[#64748b]">
                    Ghi chú nội bộ
                  </p>
                  <p>{invoice.internalNote}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hidden print area */}
      <div className="fixed left-[-99999px] top-0">
        <div ref={printRef}>
          <PrintableInvoice invoice={printableInvoice} />
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  color,
}: {
  label: string;
  value?: string | null;
  bold?: boolean;
  color?: string;
}) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-2">
      <span className="text-[#64748b]">{label}</span>
      <span className={`${bold ? "font-semibold" : ""} ${color ?? ""}`}>
        {value || "-"}
      </span>
    </div>
  );
}

function SumRow({
  label,
  value,
  bold,
  color,
}: {
  label: string;
  value: string;
  bold?: boolean;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#64748b]">{label}</span>
      <span
        className={`${bold ? "font-bold" : "font-semibold"} ${color ?? ""}`}
      >
        {value}
      </span>
    </div>
  );
}
