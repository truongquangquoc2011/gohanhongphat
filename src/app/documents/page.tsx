"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FilePlus2, Printer, Trash2, ClipboardList, PackageOpen } from "lucide-react";

type DocType = "payment-request" | "warehouse-export";

type Document = {
  id: number;
  type: DocType;
  code: string;
  toCompany: string;
  amount?: number;
  date: string;
  createdAt: string;
  note?: string;
};

const formatMoney = (value?: number) =>
  value ? value.toLocaleString("vi-VN") + "đ" : "—";

const TYPE_LABEL: Record<DocType, string> = {
  "payment-request": "Giấy đề nghị thanh toán",
  "warehouse-export": "Phiếu xuất kho",
};

const TYPE_COLOR: Record<DocType, string> = {
  "payment-request": "bg-[#dbeafe] text-[#1d4ed8]",
  "warehouse-export": "bg-[#dcfce7] text-[#047857]",
};

export default function DocumentsPage() {
  const router = useRouter();
  const [docs, setDocs] = useState<Document[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("hongphat_documents") || "[]");
    setDocs(saved);
  }, []);

  const handleDelete = (id: number) => {
    if (!confirm("Xóa chứng từ này?")) return;
    const updated = docs.filter((d) => d.id !== id);
    setDocs(updated);
    localStorage.setItem("hongphat_documents", JSON.stringify(updated));
  };

  return (
    <div className="space-y-4 p-4">
      <header className="flex items-center justify-between py-1">
        <div className="leading-tight">
          <h1 className="text-[18px] font-semibold tracking-[-0.02em] text-[#0f172a]">
            Chứng từ
          </h1>
          <p className="mt-0.5 text-[11px] text-[#64748b]">
            Giấy đề nghị thanh toán & Phiếu xuất kho
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/documents/payment-request")}
            className="flex h-10 items-center gap-2 border border-[#d8e0ee] bg-white px-4 text-sm font-semibold text-[#063591] hover:bg-[#f8fafc]"
          >
            <ClipboardList className="h-4 w-4" />
            Đề nghị thanh toán
          </button>
          <button
            onClick={() => router.push("/documents/warehouse-export")}
            className="flex h-10 items-center gap-2 bg-[#063591] px-4 text-sm font-bold text-white hover:bg-[#052b75]"
          >
            <PackageOpen className="h-4 w-4" />
            Phiếu xuất kho
          </button>
        </div>
      </header>

      <section className="border border-[#d8e0ee] bg-white">
        <div className="overflow-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-[12px]">
            <thead>
              <tr className="h-10 border-b border-[#d8e0ee] bg-[#f8fafc] text-[12px] font-semibold text-[#0f172a]">
                <th className="w-12 px-3">STT</th>
                <th className="w-[160px] px-2">Loại chứng từ</th>
                <th className="w-[130px] px-2">Số chứng từ</th>
                <th className="w-[100px] px-2">Ngày</th>
                <th className="px-2">Đơn vị / Khách hàng</th>
                <th className="w-[140px] px-2 text-right">Số tiền</th>
                <th className="w-[120px] px-2">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {docs.length === 0 && (
                <tr>
                  <td colSpan={7} className="h-32 text-center text-sm text-[#94a3b8]">
                    Chưa có chứng từ nào. Tạo mới để bắt đầu.
                  </td>
                </tr>
              )}
              {docs.map((doc, i) => (
                <tr key={doc.id} className="h-9 border-b border-[#e8edf5] hover:bg-[#f8fafc]">
                  <td className="px-3 text-[#64748b]">{i + 1}</td>
                  <td className="px-2">
                    <span className={`inline-flex px-2 py-0.5 text-[11px] font-bold ${TYPE_COLOR[doc.type]}`}>
                      {TYPE_LABEL[doc.type]}
                    </span>
                  </td>
                  <td className="px-2 font-bold text-red-600">{doc.code}</td>
                  <td className="px-2">{doc.date}</td>
                  <td className="px-2 font-semibold">{doc.toCompany || "—"}</td>
                  <td className="px-2 text-right font-bold text-[#175cff]">
                    {formatMoney(doc.amount)}
                  </td>
                  <td className="px-2">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => router.push(`/documents/${doc.type}?id=${doc.id}`)}
                        className="font-semibold text-[#063591]"
                      >
                        Sửa / In
                      </button>
                      <button onClick={() => handleDelete(doc.id)}>
                        <Trash2 className="h-4 w-4 text-red-400 hover:text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="flex h-12 items-center border-t border-[#d8e0ee] px-4 text-sm text-[#64748b]">
          Tổng: {docs.length} chứng từ
        </footer>
      </section>
    </div>
  );
}