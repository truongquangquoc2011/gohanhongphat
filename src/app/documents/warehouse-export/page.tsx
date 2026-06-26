"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Plus, Printer, Save, Trash2 } from "lucide-react";

type ExportRow = {
  id: number;
  name: string;
  maVTHH: string;
  unit: string;
  quantity: number;
  price: number;
};

const formatMoney = (v: number) => (v ? v.toLocaleString("vi-VN") : "");
const parseMoney = (s: string) =>
  Number(s.replaceAll(".", "").replaceAll(",", "")) || 0;

function WarehouseExportContent() {
  const router = useRouter();
  const params = useSearchParams();
  const editId = params.get("id");

  const [docCode, setDocCode] = useState(
    () => `PXK26-${String(Date.now()).slice(-5)}`,
  );
  const [docDate, setDocDate] = useState(new Date().toISOString().slice(0, 10));
  const [toCompany, setToCompany] = useState("");
  const [receiver, setReceiver] = useState("");
  const [reason, setReason] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [destination, setDestination] = useState("");
  const [creator, setCreator] = useState("Phạm Thị Kim Ánh");
  const [rows, setRows] = useState<ExportRow[]>([
    { id: 1, name: "", maVTHH: "", unit: "Cái", quantity: 0, price: 0 },
  ]);

  useEffect(() => {
    if (!editId) return;
    const docs = JSON.parse(localStorage.getItem("hongphat_documents") || "[]");
    const found = docs.find((d: { id: number }) => String(d.id) === editId);
    if (!found) return;
    setDocCode(found.code ?? docCode);
    setDocDate(found.rawDate ?? docDate);
    setToCompany(found.toCompany ?? "");
    setReceiver(found.receiver ?? "");
    setReason(found.reason ?? "");
    setWarehouse(found.warehouse ?? "");
    setDestination(found.destination ?? "");
    setCreator(found.creator ?? "Phạm Thị Kim Ánh");
    if (found.rows?.length) setRows(found.rows);
  }, [editId]);

  const total = rows.reduce((s, r) => s + r.quantity * r.price, 0);

  const addRow = () =>
    setRows((cur) => [
      ...cur,
      {
        id: Date.now(),
        name: "",
        maVTHH: "",
        unit: "Cái",
        quantity: 0,
        price: 0,
      },
    ]);

  const removeRow = (id: number) =>
    setRows((cur) => (cur.length === 1 ? cur : cur.filter((r) => r.id !== id)));

  const updateRow = <K extends keyof ExportRow>(
    id: number,
    key: K,
    val: ExportRow[K],
  ) =>
    setRows((cur) => cur.map((r) => (r.id === id ? { ...r, [key]: val } : r)));

  const save = () => {
    const payload = {
      id: editId ? Number(editId) : Date.now(),
      type: "warehouse-export",
      code: docCode,
      date: new Date(docDate).toLocaleDateString("vi-VN"),
      rawDate: docDate,
      toCompany,
      receiver,
      reason,
      warehouse,
      destination,
      creator,
      amount: total,
      rows,
      createdAt: new Date().toISOString(),
    };
    const all = JSON.parse(localStorage.getItem("hongphat_documents") || "[]");
    const existed = all.some(
      (d: { id: number }) => String(d.id) === String(payload.id),
    );
    const updated = existed
      ? all.map((d: { id: number }) =>
          String(d.id) === String(payload.id) ? payload : d,
        )
      : [payload, ...all];
    localStorage.setItem("hongphat_documents", JSON.stringify(updated));
    alert(`Đã lưu ${docCode}`);
    router.push("/documents");
  };

  const printData = {
    docCode,
    date: new Date(docDate).toLocaleDateString("vi-VN"),
    toCompany,
    receiver,
    reason,
    warehouse,
    destination,
    creator,
    rows,
    total,
  };

  return (
    <div className="min-h-full bg-[#eef2f8] p-4">
      <div className="mx-auto max-w-[940px]">
        <div className="print:hidden mb-4 flex items-center gap-3">
          <button
            onClick={() => router.push("/documents")}
            className="flex items-center gap-2 text-sm font-semibold text-[#063591]"
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại
          </button>
          <span className="text-[#d8e0ee]">|</span>
          <span className="text-sm font-bold">
            {editId ? "Sửa" : "Tạo"} Phiếu xuất kho
          </span>
        </div>

        {/* Form */}
        <div className="print:hidden mb-4 border border-[#d8e0ee] bg-white p-4 text-sm space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <label className="grid grid-cols-[130px_1fr] items-center gap-2">
              <span>Số phiếu</span>
              <input
                value={docCode}
                onChange={(e) => setDocCode(e.target.value)}
                className="h-9 border border-[#d8e0ee] bg-[#f1f5f9] px-3 font-semibold text-[#063591] outline-none"
              />
            </label>
            <label className="grid grid-cols-[80px_1fr] items-center gap-2">
              <span>Ngày</span>
              <input
                type="date"
                value={docDate}
                onChange={(e) => setDocDate(e.target.value)}
                className="h-9 border border-[#d8e0ee] px-3 outline-none focus:border-[#063591]"
              />
            </label>
          </div>

          <label className="grid grid-cols-[130px_1fr] items-center gap-2">
            <span>Người nhận hàng</span>
            <input
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              className="h-9 border border-[#d8e0ee] px-3 outline-none focus:border-[#063591]"
            />
          </label>
          <label className="grid grid-cols-[130px_1fr] items-center gap-2">
            <span>Đơn vị nhận</span>
            <input
              value={toCompany}
              onChange={(e) => setToCompany(e.target.value)}
              className="h-9 border border-[#d8e0ee] px-3 outline-none focus:border-[#063591]"
            />
          </label>
          <label className="grid grid-cols-[130px_1fr] items-center gap-2">
            <span>Lý do xuất</span>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-9 border border-[#d8e0ee] px-3 outline-none focus:border-[#063591]"
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="grid grid-cols-[130px_1fr] items-center gap-2">
              <span>Xuất tại kho</span>
              <input
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
                className="h-9 border border-[#d8e0ee] px-3 outline-none focus:border-[#063591]"
              />
            </label>
            <label className="grid grid-cols-[80px_1fr] items-center gap-2">
              <span>Địa điểm</span>
              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="h-9 border border-[#d8e0ee] px-3 outline-none focus:border-[#063591]"
              />
            </label>
          </div>
          <label className="grid grid-cols-[130px_1fr] items-center gap-2">
            <span>Người lập phiếu</span>
            <input
              value={creator}
              onChange={(e) => setCreator(e.target.value)}
              className="h-9 border border-[#d8e0ee] px-3 outline-none focus:border-[#063591]"
            />
          </label>

          {/* Bảng hàng hóa */}
          <div className="border border-[#d8e0ee] overflow-auto mt-2">
            <table className="w-full min-w-[700px] border-collapse text-sm">
              <thead>
                <tr className="bg-[#dff6ff] h-9 text-[12px] font-semibold">
                  <th className="border border-[#cfe8f3] px-2 w-10">STT</th>
                  <th className="border border-[#cfe8f3] px-2">
                    Tên vật tư hàng hóa
                  </th>
                  <th className="border border-[#cfe8f3] px-2 w-[110px]">
                    Mã VTHH
                  </th>
                  <th className="border border-[#cfe8f3] px-2 w-[90px]">ĐVT</th>
                  <th className="border border-[#cfe8f3] px-2 w-[90px]">
                    Số lượng
                  </th>
                  <th className="border border-[#cfe8f3] px-2 w-[120px]">
                    Đơn giá
                  </th>
                  <th className="border border-[#cfe8f3] px-2 w-[130px]">
                    Thành tiền
                  </th>
                  <th className="border border-[#cfe8f3] px-2 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.id} className="h-10">
                    <td className="border border-[#e8edf5] text-center text-[#64748b]">
                      {i + 1}
                    </td>
                    <td className="border border-[#e8edf5]">
                      <input
                        value={row.name}
                        onChange={(e) =>
                          updateRow(row.id, "name", e.target.value)
                        }
                        className="h-9 w-full px-2 outline-none"
                      />
                    </td>
                    <td className="border border-[#e8edf5]">
                      <input
                        value={row.maVTHH}
                        onChange={(e) =>
                          updateRow(row.id, "maVTHH", e.target.value)
                        }
                        className="h-9 w-full px-2 outline-none"
                      />
                    </td>
                    <td className="border border-[#e8edf5]">
                      <select
                        value={row.unit}
                        onChange={(e) =>
                          updateRow(row.id, "unit", e.target.value)
                        }
                        className="h-9 w-full px-1 outline-none"
                      >
                        <option>Cái</option>
                        <option>Bộ</option>
                        <option>Chiếc</option>
                        <option>Mét</option>
                        <option>Kg</option>
                        <option>Tấm</option>
                      </select>
                    </td>
                    <td className="border border-[#e8edf5]">
                      <input
                        type="number"
                        value={row.quantity}
                        onChange={(e) =>
                          updateRow(row.id, "quantity", Number(e.target.value))
                        }
                        className="h-9 w-full px-2 text-right outline-none"
                      />
                    </td>
                    <td className="border border-[#e8edf5]">
                      <input
                        value={formatMoney(row.price)}
                        onChange={(e) =>
                          updateRow(row.id, "price", parseMoney(e.target.value))
                        }
                        className="h-9 w-full px-2 text-right outline-none"
                      />
                    </td>
                    <td className="border border-[#e8edf5] bg-[#f8fafc] px-2 text-right font-semibold">
                      {formatMoney(row.quantity * row.price)}
                    </td>
                    <td className="border border-[#e8edf5] text-center">
                      <button onClick={() => removeRow(row.id)}>
                        <Trash2 className="h-4 w-4 text-red-400 hover:text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="h-9 bg-[#f8fafc] font-bold">
                  <td
                    colSpan={6}
                    className="border border-[#e8edf5] px-2 text-right"
                  >
                    Tổng cộng
                  </td>
                  <td className="border border-[#e8edf5] px-2 text-right text-[#175cff]">
                    {formatMoney(total)}
                  </td>
                  <td className="border border-[#e8edf5]" />
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#d8e0ee]">
            <button
              onClick={addRow}
              className="flex h-9 items-center gap-2 border border-[#bcd7ff] bg-[#eef6ff] px-3 text-sm font-bold text-[#1263b0]"
            >
              <Plus className="h-4 w-4" /> Thêm dòng
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex h-9 items-center gap-2 border border-[#d8e0ee] bg-white px-4 text-sm font-semibold text-[#063591]"
              >
                <Printer className="h-4 w-4" /> In phiếu
              </button>
              <button
                onClick={save}
                className="flex h-9 items-center gap-2 bg-[#063591] px-5 text-sm font-bold text-white"
              >
                <Save className="h-4 w-4" /> Lưu
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="print:hidden border border-[#d8e0ee] bg-white">
          <div className="border-b border-[#d8e0ee] bg-[#f8fafc] px-4 py-2 text-xs font-semibold text-[#64748b] uppercase tracking-wide">
            Xem trước phiếu xuất kho
          </div>
          <div className="overflow-auto p-4">
            <PrintableWarehouseExport {...printData} />
          </div>
        </div>

        {/* Chỉ in */}
        <div className="print:block hidden">
          <PrintableWarehouseExport {...printData} />
        </div>

        <style>{`
      @media print {
        body * { visibility: hidden; }
        .print\\:block, .print\\:block * { visibility: visible; }
        .print\\:block {
          position: fixed;
          top: 0;
          left: 0;
          width: 210mm;
        }
        @page {
          size: A4 portrait;
          margin: 0;
        }
      }
    `}</style>
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

function PrintableWarehouseExport({
  docCode,
  date,
  toCompany,
  receiver,
  reason,
  warehouse,
  destination,
  creator,
  rows,
  total,
}: {
  docCode: string;
  date: string;
  toCompany: string;
  receiver: string;
  reason: string;
  warehouse: string;
  destination: string;
  creator: string;
  rows: ExportRow[];
  total: number;
}) {
  const blank = (val: string, w = 160) =>
    val ? (
      <b>{val}</b>
    ) : (
      <span
        style={{
          display: "inline-block",
          width: w,
          borderBottom: "1px solid #000",
        }}
      >
        &nbsp;
      </span>
    );

  const displayRows = Array.from({ length: Math.max(rows.length, 5) }).map(
    (_, i) => rows[i] ?? null,
  );

  return (
    <div
      style={{
        fontFamily: "Times New Roman, serif",
        fontSize: 13,
        color: "#000",
        width: "210mm",
        minHeight: "297mm",
        margin: "0 auto",
        padding: "15mm 18mm",
        background: "#fff",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          marginBottom: 6,
          fontSize: 11,
        }}
      >
        <div>
          <div>
            <b>CÔNG TY TNHH GIA CÔNG CƠ KHÍ INOX HP HỒNG PHÁT</b>
          </div>
          <div>198 Bình Long, Khu Phố 12, Phường Phú Thạnh, TP Hồ Chí Minh</div>
          <div>MST: 0319444257</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div>
            <b>Mẫu số 02 - VT</b>
          </div>
          <div style={{ fontStyle: "italic" }}>
            (Ban hành theo TT 133/2016/TT-BTC Ngày 26/8/2016 của Bộ Tài chính)
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginBottom: 2 }}>
        <div
          style={{
            fontSize: 17,
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          Phiếu xuất kho
        </div>
        <div style={{ fontSize: 12 }}>Ngày {date}</div>
        <div style={{ fontSize: 11 }}>
          Số: <b style={{ color: "#c00" }}>{docCode}</b>
        </div>
      </div>

      <div style={{ marginBottom: 3 }}>Người nhận hàng: {blank(receiver)}</div>
      <div style={{ marginBottom: 3 }}>Theo ............. số .............</div>
      <div style={{ marginBottom: 3 }}>Lý do xuất: {blank(reason, 300)}</div>
      <div style={{ marginBottom: 8 }}>
        Xuất tại kho: {blank(warehouse)} &nbsp;&nbsp; Địa điểm:{" "}
        {blank(destination)}
      </div>

      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
      >
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            {[
              "STT",
              "Tên vật tư hàng hóa",
              "Mã VTHH",
              "Đơn vị tính",
              "Số lượng",
              "Đơn giá",
              "Thành tiền",
            ].map((h) => (
              <th
                key={h}
                style={{
                  border: "1px solid #000",
                  padding: "4px 6px",
                  textAlign: "center",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayRows.map((row, i) => (
            <tr key={i} style={{ height: 26 }}>
              <td
                style={{
                  border: "1px solid #000",
                  textAlign: "center",
                  padding: "2px 4px",
                }}
              >
                {row ? i + 1 : ""}
              </td>
              <td style={{ border: "1px solid #000", padding: "2px 6px" }}>
                {row?.name || ""}
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  textAlign: "center",
                  padding: "2px 4px",
                }}
              >
                {row?.maVTHH || ""}
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  textAlign: "center",
                  padding: "2px 4px",
                }}
              >
                {row?.unit || ""}
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  textAlign: "right",
                  padding: "2px 6px",
                }}
              >
                {row?.quantity || ""}
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  textAlign: "right",
                  padding: "2px 6px",
                }}
              >
                {row ? formatMoney(row.price) : ""}
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  textAlign: "right",
                  padding: "2px 6px",
                }}
              >
                {row ? formatMoney(row.quantity * row.price) : ""}
              </td>
            </tr>
          ))}
          <tr style={{ fontWeight: "bold" }}>
            <td
              colSpan={6}
              style={{
                border: "1px solid #000",
                textAlign: "right",
                padding: "4px 6px",
              }}
            >
              Tổng Cộng{" "}
              {!total && (
                <i style={{ fontWeight: "normal", color: "#888" }}>
                  (chưa VAT)
                </i>
              )}
            </td>
            <td
              style={{
                border: "1px solid #000",
                textAlign: "right",
                padding: "4px 6px",
              }}
            >
              {total ? formatMoney(total) : ""}
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: 6, fontSize: 12 }}>
        *Tổng số tiền (Viết bằng chữ):{" "}
        <span
          style={{
            display: "inline-block",
            width: 360,
            borderBottom: "1px solid #000",
          }}
        >
          &nbsp;
        </span>
      </div>
      <div style={{ marginTop: 4, fontSize: 12 }}>
        Số chứng từ gốc kèm theo: .............
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          textAlign: "center",
          marginTop: 20,
        }}
      >
        {[
          "Người lập phiếu",
          "Người nhận hàng",
          "Thủ kho",
          "Kế toán trưởng",
        ].map((label, i) => (
          <div key={label}>
            <div style={{ fontWeight: "bold", fontSize: 12 }}>{label}</div>
            <div style={{ fontStyle: "italic", fontSize: 11 }}>
              (Ký, họ tên)
            </div>
            {i === 0 && (
              <div style={{ marginTop: 70, fontSize: 12 }}>{creator}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WarehouseExportPage() {
  return (
    <Suspense
      fallback={<div className="p-6 text-sm text-[#64748b]">Đang tải...</div>}
    >
      <WarehouseExportContent />
    </Suspense>
  );
}
