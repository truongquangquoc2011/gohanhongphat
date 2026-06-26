"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Printer, Save, Trash2, FileDown } from "lucide-react";

const formatMoney = (v: number) => v.toLocaleString("vi-VN");
const parseMoney = (s: string) => Number(s.replaceAll(".", "").replaceAll(",", "")) || 0;

const numberToWords = (value: number): string => {
  if (!value) return "Không đồng";
  const ones = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
  const readTriple = (num: number, full = false) => {
    const h = Math.floor(num / 100), t = Math.floor((num % 100) / 10), u = num % 10;
    const w: string[] = [];
    if (h > 0) w.push(ones[h], "trăm");
    else if (full && (t > 0 || u > 0)) w.push("không", "trăm");
    if (t > 1) { w.push(ones[t], "mươi"); if (u === 1) w.push("mốt"); else if (u === 5) w.push("lăm"); else if (u > 0) w.push(ones[u]); }
    else if (t === 1) { w.push("mười"); if (u === 5) w.push("lăm"); else if (u > 0) w.push(ones[u]); }
    else if (u > 0) { if (h > 0 || full) w.push("lẻ"); w.push(ones[u]); }
    return w.join(" ");
  };
  const groups = [{ v: 1_000_000_000, l: "tỷ" }, { v: 1_000_000, l: "triệu" }, { v: 1_000, l: "nghìn" }, { v: 1, l: "" }];
  let rem = Math.floor(value);
  const res: string[] = [];
  let hasHigh = false;
  for (const g of groups) {
    const n = Math.floor(rem / g.v); rem %= g.v;
    if (n > 0) { res.push(readTriple(n, hasHigh), g.l); hasHigh = true; }
  }
  const t = res.join(" ").replace(/\s+/g, " ").trim();
  return t.charAt(0).toUpperCase() + t.slice(1) + " đồng chẵn";
};

function PaymentRequestContent() {
  const router = useRouter();
  const params = useSearchParams();
  const editId = params.get("id");
  const printRef = useRef<HTMLDivElement>(null);

  const [docCode, setDocCode] = useState(() => `DNTT26-${String(Date.now()).slice(-5)}`);
  const [docDate, setDocDate] = useState(new Date().toISOString().slice(0, 10));
  const [toCompany, setToCompany] = useState("");
  const [requestPerson, setRequestPerson] = useState("");
  const [department, setDepartment] = useState("");
  const [content, setContent] = useState("");
  const [amount, setAmount] = useState(0);
  const [attachments, setAttachments] = useState("");
  const [creator, setCreator] = useState("Phạm Thị Kim Ánh");

  useEffect(() => {
    if (!editId) return;
    const docs = JSON.parse(localStorage.getItem("hongphat_documents") || "[]");
    const found = docs.find((d: { id: number }) => String(d.id) === editId);
    if (!found) return;
    setDocCode(found.code ?? docCode);
    setDocDate(found.date ?? docDate);
    setToCompany(found.toCompany ?? "");
    setRequestPerson(found.requestPerson ?? "");
    setDepartment(found.department ?? "");
    setContent(found.content ?? "");
    setAmount(found.amount ?? 0);
    setAttachments(found.attachments ?? "");
    setCreator(found.creator ?? "Phạm Thị Kim Ánh");
  }, [editId]);

  const save = () => {
    const payload = {
      id: editId ? Number(editId) : Date.now(),
      type: "payment-request",
      code: docCode,
      date: new Date(docDate).toLocaleDateString("vi-VN"),
      toCompany,
      requestPerson,
      department,
      content,
      amount,
      attachments,
      creator,
      createdAt: new Date().toISOString(),
    };
    const all = JSON.parse(localStorage.getItem("hongphat_documents") || "[]");
    const existed = all.some((d: { id: number }) => String(d.id) === String(payload.id));
    const updated = existed
      ? all.map((d: { id: number }) => String(d.id) === String(payload.id) ? payload : d)
      : [payload, ...all];
    localStorage.setItem("hongphat_documents", JSON.stringify(updated));
    alert(`Đã lưu ${docCode}`);
    router.push("/documents");
  };

  const handlePrint = () => window.print();

  const isBlankPrint = !toCompany && !amount;

  return (
    <div className="min-h-full bg-[#eef2f8] p-4">
      <div className="mx-auto max-w-[860px]">
        {/* Toolbar - ẩn khi in */}
        <div className="print:hidden mb-4 flex items-center gap-3">
          <button
            onClick={() => router.push("/documents")}
            className="flex items-center gap-2 text-sm font-semibold text-[#063591]"
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại
          </button>
          <span className="text-[#d8e0ee]">|</span>
          <span className="text-sm font-bold text-[#0f172a]">
            {editId ? "Sửa" : "Tạo"} Giấy đề nghị thanh toán
          </span>
        </div>

        {/* Form nhập - ẩn khi in */}
        <div className="print:hidden mb-4 border border-[#d8e0ee] bg-white p-4 text-sm space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <label className="grid grid-cols-[140px_1fr] items-center gap-2">
              <span>Số chứng từ</span>
              <input value={docCode} onChange={e => setDocCode(e.target.value)}
                className="h-9 border border-[#d8e0ee] bg-[#f1f5f9] px-3 font-semibold text-[#063591] outline-none" />
            </label>
            <label className="grid grid-cols-[100px_1fr] items-center gap-2">
              <span>Ngày</span>
              <input type="date" value={docDate} onChange={e => setDocDate(e.target.value)}
                className="h-9 border border-[#d8e0ee] px-3 outline-none focus:border-[#063591]" />
            </label>
          </div>

          <label className="grid grid-cols-[140px_1fr] items-center gap-2">
            <span><b className="text-red-600">*</b> Kính gửi</span>
            <input value={toCompany} onChange={e => setToCompany(e.target.value)}
              placeholder="VD: CÔNG TY CỔ PHẦN MANDACONS"
              className="h-9 border border-[#d8e0ee] bg-[#edfdf3] px-3 outline-none focus:border-[#063591]" />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="grid grid-cols-[140px_1fr] items-center gap-2">
              <span>Họ tên người đề nghị</span>
              <input value={requestPerson} onChange={e => setRequestPerson(e.target.value)}
                className="h-9 border border-[#d8e0ee] px-3 outline-none focus:border-[#063591]" />
            </label>
            <label className="grid grid-cols-[100px_1fr] items-center gap-2">
              <span>Bộ phận</span>
              <input value={department} onChange={e => setDepartment(e.target.value)}
                className="h-9 border border-[#d8e0ee] px-3 outline-none focus:border-[#063591]" />
            </label>
          </div>

          <label className="grid grid-cols-[140px_1fr] items-center gap-2">
            <span>Nội dung thanh toán</span>
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={2}
              placeholder="VD: Thanh toán đơn hàng theo đơn đặt hàng ngày..."
              className="border border-[#d8e0ee] px-3 py-2 outline-none focus:border-[#063591] resize-none" />
          </label>

          <label className="grid grid-cols-[140px_1fr] items-center gap-2">
            <span><b className="text-red-600">*</b> Số tiền</span>
            <input value={formatMoney(amount)} onChange={e => setAmount(parseMoney(e.target.value))}
              className="h-9 border border-[#d8e0ee] bg-[#edfdf3] px-3 text-right font-bold outline-none focus:border-[#063591]" />
          </label>

          <label className="grid grid-cols-[140px_1fr] items-center gap-2">
            <span>Kèm theo chứng từ</span>
            <input value={attachments} onChange={e => setAttachments(e.target.value)}
              placeholder="VD: hóa đơn, biên bản nghiệm thu..."
              className="h-9 border border-[#d8e0ee] px-3 outline-none focus:border-[#063591]" />
          </label>

          <label className="grid grid-cols-[140px_1fr] items-center gap-2">
            <span>Người lập</span>
            <input value={creator} onChange={e => setCreator(e.target.value)}
              className="h-9 border border-[#d8e0ee] px-3 outline-none focus:border-[#063591]" />
          </label>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#d8e0ee]">
            <button onClick={handlePrint}
              className="flex h-9 items-center gap-2 border border-[#d8e0ee] bg-white px-4 text-sm font-semibold text-[#063591]">
              <Printer className="h-4 w-4" />
              {isBlankPrint ? "In mẫu trắng" : "Xem & In"}
            </button>
            <button onClick={save}
              className="flex h-9 items-center gap-2 bg-[#063591] px-5 text-sm font-bold text-white">
              <Save className="h-4 w-4" /> Lưu
            </button>
          </div>
        </div>

        {/* Mẫu in — luôn render, chỉ hiện khi print */}
        <div ref={printRef} className="print:block hidden print:p-0">
          <PrintablePaymentRequest
            code={docCode}
            date={new Date(docDate).toLocaleDateString("vi-VN")}
            toCompany={toCompany}
            requestPerson={requestPerson}
            department={department}
            content={content}
            amount={amount}
            attachments={attachments}
            creator={creator}
          />
        </div>

        {/* Preview luôn hiển thị bên dưới form */}
        <div className="print:hidden border border-[#d8e0ee] bg-white">
          <div className="border-b border-[#d8e0ee] bg-[#f8fafc] px-4 py-2 text-xs font-semibold text-[#64748b] uppercase tracking-wide">
            Xem trước — {isBlankPrint ? "Mẫu trắng (điền tay)" : "Có dữ liệu"}
          </div>
          <div className="overflow-auto p-4">
            <PrintablePaymentRequest
              code={docCode}
              date={new Date(docDate).toLocaleDateString("vi-VN")}
              toCompany={toCompany}
              requestPerson={requestPerson}
              department={department}
              content={content}
              amount={amount}
              attachments={attachments}
              creator={creator}
            />
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print\\:block, .print\\:block * { visibility: visible; }
          .print\\:block { position: fixed; top: 0; left: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}

function PrintablePaymentRequest({
  code, date, toCompany, requestPerson, department,
  content, amount, attachments, creator,
}: {
  code: string; date: string; toCompany: string; requestPerson: string;
  department: string; content: string; amount: number; attachments: string; creator: string;
}) {
  const blank = (val: string, width = "200px") =>
    val ? <b>{val}</b> : <span style={{ display: "inline-block", width, borderBottom: "1px solid #000" }}>&nbsp;</span>;

  const amountBlank = !amount;

  return (
    <div style={{ fontFamily: "Times New Roman, serif", fontSize: 13, color: "#000", width: 680, margin: "0 auto", padding: "20px 32px", border: "1px solid #ccc", background: "#fff" }}>
      {/* Header */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", marginBottom: 8 }}>
        <div style={{ fontSize: 11 }}>
          <div><b>Đơn vị:</b> CTY TNHH GC CK INOX HP HỒNG PHÁT</div>
          <div><b>Địa chỉ:</b> 198 Bình Long, KP. 12, P.Phú Thạnh, TP Hồ Chí Minh</div>
        </div>
        <div style={{ textAlign: "right", fontSize: 11 }}>
          <div><b>Mẫu số 05 - TT</b></div>
          <div style={{ fontStyle: "italic" }}>(Ban hành theo Thông tư số 133/2016/TT-BTC ngày 26/8/2016 của Bộ Tài chính)</div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginBottom: 4 }}>
        <div style={{ fontSize: 17, fontWeight: "bold", textTransform: "uppercase" }}>Giấy đề nghị thanh toán</div>
        <div style={{ fontSize: 12 }}>
          Ngày {date || <span style={{ display: "inline-block", width: 120, borderBottom: "1px solid #000" }}>&nbsp;</span>}
          {code && <span style={{ marginLeft: 24 }}>Số: <b style={{ color: "#c00" }}>{code}</b></span>}
        </div>
      </div>

      <div style={{ marginBottom: 6 }}>
        <b>Kính gửi:</b> {blank(toCompany, "300px")}
      </div>

      <div style={{ marginBottom: 4 }}>Họ và tên người đề nghị thanh toán: {blank(requestPerson, "260px")}</div>
      <div style={{ marginBottom: 4 }}>Bộ phận (Hoặc địa chỉ): {blank(department, "300px")}</div>
      <div style={{ marginBottom: 4 }}>
        Nội dung thanh toán: {content
          ? <span>{content}</span>
          : <span style={{ display: "inline-block", width: "100%", borderBottom: "1px solid #000", marginTop: 6 }}>&nbsp;</span>}
      </div>
      {!content && <div style={{ borderBottom: "1px solid #000", marginBottom: 4 }}>&nbsp;</div>}

      <div style={{ marginBottom: 4 }}>
        Số tiền:{" "}
        {amountBlank
          ? <span style={{ display: "inline-block", width: 160, borderBottom: "1px solid #000" }}>&nbsp;</span>
          : <b>{amount.toLocaleString("vi-VN")}</b>}
        {" "}(Viết bằng chữ):{" "}
        {amountBlank
          ? <span style={{ display: "inline-block", width: 220, borderBottom: "1px solid #000" }}>&nbsp;</span>
          : <i>{numberToWords(amount)}</i>}
        .
      </div>

      <div style={{ marginBottom: 16 }}>
        (Kèm theo {blank(attachments, "180px")} chứng từ gốc).
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", textAlign: "center", marginTop: 16 }}>
        <div>
          <div style={{ fontWeight: "bold" }}>Người đề nghị thanh toán</div>
          <div style={{ fontStyle: "italic", fontSize: 11 }}>(Ký, họ tên)</div>
          <div style={{ marginTop: 40 }}>{creator || ""}</div>
        </div>
        <div>
          <div style={{ fontWeight: "bold" }}>Kế toán trưởng</div>
          <div style={{ fontStyle: "italic", fontSize: 11 }}>(Ký, họ tên)</div>
        </div>
        <div>
          <div style={{ fontWeight: "bold" }}>Người duyệt</div>
          <div style={{ fontStyle: "italic", fontSize: 11 }}>(Ký, họ tên)</div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentRequestPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-[#64748b]">Đang tải...</div>}>
      <PaymentRequestContent />
    </Suspense>
  );
}