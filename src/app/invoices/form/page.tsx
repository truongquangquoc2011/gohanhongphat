"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Copy,
  Download,
  FilePlus2,
  MoreHorizontal,
  Plus,
  Printer,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import PrintableInvoice from "../components/PrintableInvoice";
import {
  createInvoice,
  getInvoiceById,
  updateInvoice,
  type CreateInvoicePayload,
} from "../../core/api/invoice.api";

type ItemRow = {
  id: number;
  productCode: string;
  name: string;
  property: string;
  unit: string;
  quantity: number;
  price: number;
  discount: number;
};

const formatMoney = (value: number) => value.toLocaleString("vi-VN");
const parseMoney = (value: string) =>
  Number(value.replaceAll(".", "").replaceAll(",", "").trim()) || 0;

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

function CreateRetailInvoiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const editId = searchParams.get("id");
  const isEditMode = mode === "edit";

  const [invoiceCode, setInvoiceCode] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [taxCode, setTaxCode] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [buyerPerson, setBuyerPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Chuyển khoản");
  const [paidAmount, setPaidAmount] = useState(0);
  const [invoiceNote, setInvoiceNote] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [vatRate, setVatRate] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirmIssue, setShowConfirmIssue] = useState(false);
  const [isIssued, setIsIssued] = useState(false);

  const [rows, setRows] = useState<ItemRow[]>([
    {
      id: 1,
      productCode: "",
      name: "",
      property: "Hàng hóa, dịch vụ",
      unit: "Cái",
      quantity: 0,
      price: 0,
      discount: 0,
    },
  ]);

  useEffect(() => {
    if (!isEditMode || !editId) return;
    const load = async () => {
      try {
        const invoice = await getInvoiceById(editId);
        setInvoiceCode(invoice.code);
        setInvoiceDate(
          invoice.invoiceDate
            ? invoice.invoiceDate.slice(0, 10)
            : new Date().toISOString().slice(0, 10),
        );
        setBuyerName(invoice.customerName);
        setTaxCode(invoice.taxCode ?? "");
        setBuyerAddress(invoice.buyerAddress ?? "");
        setBuyerPerson(invoice.buyerPerson ?? "");
        setPhone(invoice.phone ?? "");
        setEmail(invoice.email ?? "");
        setAccountNo(invoice.accountNo ?? "");
        setPaymentMethod(invoice.paymentMethod ?? "Chuyển khoản");
        setPaidAmount(invoice.paidValue);
        setInvoiceNote(invoice.invoiceNote ?? "");
        setInternalNote(invoice.internalNote ?? "");
        setVatRate(invoice.vatRate);
        if (invoice.items?.length) {
          setRows(
            (invoice.items as any[]).map((item, i) => ({
              id: i + 1,
              productCode: item.productCode ?? "",
              name: item.name ?? "",
              property: item.property ?? "Hàng hóa, dịch vụ",
              unit: item.unit ?? "Cái",
              quantity: item.quantity ?? 0,
              price: item.price ?? 0,
              discount: item.discount ?? 0,
            })),
          );
        }
      } catch {
        toast.error("Không tìm thấy hóa đơn");
        router.push("/invoices");
      }
    };
    load();
  }, [editId, isEditMode, router]);

  const subtotal = useMemo(
    () =>
      rows.reduce(
        (sum, row) =>
          sum + Math.max(row.quantity * row.price - row.discount, 0),
        0,
      ),
    [rows],
  );

  const vatAmount = Math.round((subtotal * vatRate) / 100);
  const totalWithVat = subtotal + vatAmount;
  const debtAmount = Math.max(totalWithVat - paidAmount, 0);
  const isViewStep = currentStep === 2;

  const printableInvoice = {
    code: invoiceCode,
    date: invoiceDate,
    buyerName: buyerPerson,
    companyName: buyerName,
    taxCode,
    address: buyerAddress,
    paymentMethod,
    accountNo,
    amountInWords: numberToVietnameseWords(totalWithVat),
    vatRate: vatRate / 100,
    items: rows
      .filter((row) => row.name.trim())
      .map((row) => ({
        name: row.name,
        unit: row.unit,
        quantity: row.quantity,
        price: row.price,
      })),
  };

  const updateRow = <K extends keyof ItemRow>(
    id: number,
    key: K,
    value: ItemRow[K],
  ) => {
    if (isViewStep) return;
    setRows((cur) =>
      cur.map((row) => (row.id === id ? { ...row, [key]: value } : row)),
    );
  };

  const addEmptyRow = () => {
    if (isViewStep) return;
    setRows((cur) => [
      ...cur,
      {
        id: Date.now(),
        productCode: "",
        name: "",
        property: "Hàng hóa, dịch vụ",
        unit: "Cái",
        quantity: 0,
        price: 0,
        discount: 0,
      },
    ]);
  };

  const removeRow = (id: number) => {
    if (isViewStep) return;
    setRows((cur) => (cur.length === 1 ? cur : cur.filter((r) => r.id !== id)));
  };

  const duplicateRow = (id: number) => {
    if (isViewStep) return;
    const row = rows.find((r) => r.id === id);
    if (row) setRows((cur) => [...cur, { ...row, id: Date.now() }]);
  };

  const loadMockCustomer = () => {
    if (isViewStep) return;
    setTaxCode("0319461460");
    setBuyerName("CÔNG TY CỔ PHẦN MANDACONS");
    setBuyerAddress("53/5 Trần Thị Bảo, Phường Phú Thạnh, TP Hồ Chí Minh");
    setBuyerPerson("Anh Minh");
    setPhone("0909000000");
    setEmail("mandacons@example.com");
    setAccountNo("0123456789");
  };

  const buildPayload = (): CreateInvoicePayload => {
    const validItems = rows.filter(
      (r) => r.name.trim() && r.quantity > 0 && r.price > 0,
    );
    return {
      customerName: buyerName,
      taxCode: taxCode || undefined,
      buyerAddress,
      buyerPerson: buyerPerson || undefined,
      phone: phone || undefined,
      email: email || undefined,
      accountNo: accountNo || undefined,
      invoiceDate,
      paymentMethod: paymentMethod as any,
      invoiceType: "Hóa đơn bán lẻ",
      items: validItems.map((r) => ({
        productCode: r.productCode || undefined,
        name: r.name,
        property: r.property,
        unit: r.unit,
        quantity: r.quantity,
        price: r.price,
        discount: r.discount,
      })),
      vatRate,
      paidValue: paidAmount,
      invoiceNote: invoiceNote || undefined,
      internalNote: internalNote || undefined,
    };
  };

  const handleSave = async () => {
    if (!buyerName.trim()) {
      toast.error("Vui lòng nhập tên đơn vị / khách hàng");
      return;
    }
    if (!buyerAddress.trim()) {
      toast.error("Vui lòng nhập địa chỉ");
      return;
    }
    const validItems = rows.filter(
      (r) => r.name.trim() && r.quantity > 0 && r.price > 0,
    );
    if (validItems.length === 0) {
      toast.error("Vui lòng nhập ít nhất 1 dòng hàng hóa hợp lệ");
      return;
    }

    try {
      setIsLoading(true);
      const payload = buildPayload();
      if (isEditMode && editId) {
        await updateInvoice(editId, payload);
        toast.success(`Đã cập nhật hóa đơn ${invoiceCode}`);
      } else {
        const created = await createInvoice(payload);
        setInvoiceCode(created.code);
        toast.success(`Đã lưu hóa đơn ${created.code}`);
      }
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message ?? "Lưu hóa đơn thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleIssueInvoice = () => {
    setIsIssued(true);
    setShowConfirmIssue(false);
    toast.success(`Đã xuất hóa đơn ${invoiceCode}`);
  };

  return (
    <div className="min-h-screen bg-[#eef2f8]">
      <div className="mx-auto max-w-[1480px] border border-[#d8e0ee] bg-white">
        <header className="border-b border-[#d8e0ee] bg-white px-5 py-3">
          <div className="mb-3 flex items-center justify-between">
            <button
              onClick={() => router.push("/invoices")}
              className="flex items-center gap-2 text-sm font-semibold text-[#063591]"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại danh sách
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm">
                Trạng thái:{" "}
                <b className="text-[#063591]">
                  {isIssued
                    ? "Đã xuất hóa đơn"
                    : currentStep === 2
                      ? "Chờ xuất hóa đơn"
                      : "Nháp mới"}
                </b>
              </span>
              <span className="text-sm text-[#64748b]">|</span>
              <span className="text-sm">
                Phân loại: <b className="text-[#063591]">Hóa đơn bán lẻ</b>
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-28 text-xs text-[#64748b]">
            {["Nhập thông tin hóa đơn", "Xuất hóa đơn"].map((item, index) => (
              <div key={item} className="flex flex-col items-center">
                <div
                  className={[
                    "mb-1 flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold",
                    index + 1 === currentStep
                      ? "border-[#063591] bg-[#eef4ff] text-[#063591]"
                      : "border-[#d8e0ee] bg-white text-[#94a3b8]",
                  ].join(" ")}
                >
                  {index + 1}
                </div>
                <span
                  className={
                    index + 1 === currentStep
                      ? "font-semibold text-[#063591]"
                      : undefined
                  }
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </header>

        <section className="px-5 py-4">
          <h1 className="mb-1 text-center text-[22px] font-bold uppercase text-[#0f172a]">
            {currentStep === 2
              ? "Xuất hóa đơn bán lẻ"
              : isEditMode
                ? "Chỉnh sửa hóa đơn bán lẻ"
                : "Lập hóa đơn bán lẻ"}
          </h1>
          <p className="mb-4 text-center text-sm text-[#64748b]">
            {currentStep === 2
              ? "Kiểm tra thông tin trước khi xuất hóa đơn"
              : "Nhập thông tin khách hàng, hàng hóa và thanh toán"}
          </p>

          <fieldset
            disabled={isViewStep}
            className={isViewStep ? "opacity-90" : ""}
          >
            {/* Thông tin người mua */}
            <div className="mb-4 border border-[#d8e0ee]">
              <div className="border-b border-[#d8e0ee] bg-[#f8fafc] px-3 py-2 text-sm font-bold">
                Thông tin người mua hàng
              </div>
              <div className="grid grid-cols-[1fr_360px] gap-6 p-4 text-sm">
                <div className="space-y-3">
                  <label className="grid grid-cols-[150px_1fr] items-center gap-3">
                    <span>
                      <b className="text-red-600">*</b> Tên đơn vị / khách
                    </span>
                    <input
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="h-9 border border-[#d8e0ee] bg-[#edfdf3] px-3 outline-none focus:border-[#063591] disabled:bg-[#f1f5f9]"
                    />
                  </label>
                  <label className="grid grid-cols-[150px_1fr] items-center gap-3">
                    <span>Người mua hàng</span>
                    <input
                      value={buyerPerson}
                      onChange={(e) => setBuyerPerson(e.target.value)}
                      className="h-9 border border-[#d8e0ee] px-3 outline-none focus:border-[#063591] disabled:bg-[#f1f5f9]"
                    />
                  </label>
                  <label className="grid grid-cols-[150px_1fr] items-center gap-3">
                    <span>Mã số thuế</span>
                    <div className="flex">
                      <input
                        value={taxCode}
                        onChange={(e) => setTaxCode(e.target.value)}
                        className="h-9 flex-1 border border-[#d8e0ee] px-3 outline-none focus:border-[#063591] disabled:bg-[#f1f5f9]"
                      />
                      <button
                        type="button"
                        onClick={loadMockCustomer}
                        className="ml-2 h-9 border border-[#d8e0ee] px-3 text-xs font-semibold text-[#063591] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Lấy thông tin
                      </button>
                    </div>
                  </label>
                  <label className="grid grid-cols-[150px_1fr] items-center gap-3">
                    <span>
                      <b className="text-red-600">*</b> Địa chỉ
                    </span>
                    <input
                      value={buyerAddress}
                      onChange={(e) => setBuyerAddress(e.target.value)}
                      className="h-9 border border-[#d8e0ee] bg-[#edfdf3] px-3 outline-none focus:border-[#063591] disabled:bg-[#f1f5f9]"
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="grid grid-cols-[150px_1fr] items-center gap-3">
                      <span>Số điện thoại</span>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-9 border border-[#d8e0ee] px-3 outline-none focus:border-[#063591] disabled:bg-[#f1f5f9]"
                      />
                    </label>
                    <label className="grid grid-cols-[80px_1fr] items-center gap-3">
                      <span>Email</span>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-9 border border-[#d8e0ee] px-3 outline-none focus:border-[#063591] disabled:bg-[#f1f5f9]"
                      />
                    </label>
                  </div>
                </div>
                <div className="space-y-3 border-l border-[#d8e0ee] pl-5">
                  <label className="grid grid-cols-[130px_1fr] items-center gap-3">
                    <span>Số hóa đơn</span>
                    <input
                      value={invoiceCode || "Tự động tạo"}
                      disabled
                      className="h-9 border border-[#d8e0ee] bg-[#f1f5f9] px-3 font-semibold text-[#063591]"
                    />
                  </label>
                  <label className="grid grid-cols-[130px_1fr] items-center gap-3">
                    <span>
                      <b className="text-red-600">*</b> Ngày hóa đơn
                    </span>
                    <input
                      type="date"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      className="h-9 border border-[#d8e0ee] px-3 outline-none focus:border-[#063591] disabled:bg-[#f1f5f9]"
                    />
                  </label>
                  <label className="grid grid-cols-[130px_1fr] items-center gap-3">
                    <span>Hình thức TT</span>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-9 border border-[#d8e0ee] px-3 outline-none focus:border-[#063591] disabled:bg-[#f1f5f9]"
                    >
                      <option>Chuyển khoản</option>
                      <option>Tiền mặt</option>
                      <option>Công nợ</option>
                    </select>
                  </label>
                  <label className="grid grid-cols-[130px_1fr] items-center gap-3">
                    <span>Số tài khoản</span>
                    <input
                      value={accountNo}
                      onChange={(e) => setAccountNo(e.target.value)}
                      className="h-9 border border-[#d8e0ee] px-3 outline-none focus:border-[#063591] disabled:bg-[#f1f5f9]"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Bảng hàng hóa */}
            <div className="border border-[#d8e0ee]">
              <div className="flex items-center gap-2 border-b border-[#d8e0ee] bg-[#f8fafc] px-3 py-2">
                <div className="flex h-9 w-[260px] items-center border border-[#d8e0ee] bg-white px-3">
                  <Search className="mr-2 h-4 w-4 text-[#94a3b8]" />
                  <input
                    placeholder="(F3) Tìm hàng hóa & dịch vụ"
                    className="h-full flex-1 text-sm outline-none disabled:bg-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={addEmptyRow}
                  className="flex h-9 items-center gap-2 border border-[#bcd7ff] bg-[#eef6ff] px-3 text-sm font-bold text-[#1263b0] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  (F2) Thêm dòng trống
                </button>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center border border-[#d8e0ee] bg-white"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
              <div className="overflow-auto">
                <table className="w-full min-w-[1250px] border-collapse text-sm">
                  <thead>
                    <tr className="h-10 bg-[#dff6ff] text-[13px] font-semibold text-[#0f172a]">
                      <th className="w-12 border border-[#cfe8f3] px-2">STT</th>
                      <th className="w-20 border border-[#cfe8f3] px-2">
                        Thao tác
                      </th>
                      <th className="w-[130px] border border-[#cfe8f3] px-2">
                        Mã hàng
                      </th>
                      <th className="w-[320px] border border-[#cfe8f3] px-2">
                        Tên hàng hóa & dịch vụ
                      </th>
                      <th className="w-[150px] border border-[#cfe8f3] px-2">
                        Tính chất
                      </th>
                      <th className="w-[110px] border border-[#cfe8f3] px-2">
                        Đơn vị tính
                      </th>
                      <th className="w-[110px] border border-[#cfe8f3] px-2">
                        Số lượng
                      </th>
                      <th className="w-[130px] border border-[#cfe8f3] px-2">
                        Đơn giá
                      </th>
                      <th className="w-[120px] border border-[#cfe8f3] px-2">
                        Chiết khấu
                      </th>
                      <th className="w-[150px] border border-[#cfe8f3] px-2">
                        Thành tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => {
                      const amount = Math.max(
                        row.quantity * row.price - row.discount,
                        0,
                      );
                      return (
                        <tr key={row.id} className="h-11">
                          <td className="border border-[#e8edf5] text-center">
                            {index + 1}
                          </td>
                          <td className="border border-[#e8edf5] text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => removeRow(row.id)}
                                className="disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </button>
                              <button
                                type="button"
                                onClick={() => duplicateRow(row.id)}
                                className="disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <Copy className="h-4 w-4 text-[#64748b]" />
                              </button>
                            </div>
                          </td>
                          <td className="border border-[#e8edf5]">
                            <input
                              value={row.productCode}
                              onChange={(e) =>
                                updateRow(row.id, "productCode", e.target.value)
                              }
                              className="h-10 w-full px-2 outline-none disabled:bg-[#f8fafc]"
                            />
                          </td>
                          <td className="border border-[#e8edf5]">
                            <input
                              value={row.name}
                              onChange={(e) =>
                                updateRow(row.id, "name", e.target.value)
                              }
                              className="h-10 w-full px-2 outline-none disabled:bg-[#f8fafc]"
                            />
                          </td>
                          <td className="border border-[#e8edf5]">
                            <select
                              value={row.property}
                              onChange={(e) =>
                                updateRow(row.id, "property", e.target.value)
                              }
                              className="h-10 w-full px-2 outline-none disabled:bg-[#f8fafc]"
                            >
                              <option>Hàng hóa, dịch vụ</option>
                              <option>Ghi chú</option>
                              <option>Khuyến mãi</option>
                            </select>
                          </td>
                          <td className="border border-[#e8edf5]">
                            <select
                              value={row.unit}
                              onChange={(e) =>
                                updateRow(row.id, "unit", e.target.value)
                              }
                              className="h-10 w-full px-2 outline-none disabled:bg-[#f8fafc]"
                            >
                              <option>Cái</option>
                              <option>Bộ</option>
                              <option>Chiếc</option>
                              <option>Mét</option>
                              <option>Kg</option>
                            </select>
                          </td>
                          <td className="border border-[#e8edf5]">
                            <input
                              value={row.quantity}
                              type="number"
                              onChange={(e) =>
                                updateRow(
                                  row.id,
                                  "quantity",
                                  Number(e.target.value),
                                )
                              }
                              className="h-10 w-full px-2 text-right outline-none disabled:bg-[#f8fafc]"
                            />
                          </td>
                          <td className="border border-[#e8edf5]">
                            <input
                              value={formatMoney(row.price)}
                              onChange={(e) =>
                                updateRow(
                                  row.id,
                                  "price",
                                  parseMoney(e.target.value),
                                )
                              }
                              className="h-10 w-full px-2 text-right outline-none disabled:bg-[#f8fafc]"
                            />
                          </td>
                          <td className="border border-[#e8edf5]">
                            <input
                              value={formatMoney(row.discount)}
                              onChange={(e) =>
                                updateRow(
                                  row.id,
                                  "discount",
                                  parseMoney(e.target.value),
                                )
                              }
                              className="h-10 w-full px-2 text-right outline-none disabled:bg-[#f8fafc]"
                            />
                          </td>
                          <td className="border border-[#e8edf5] bg-[#f8fafc] px-2 text-right font-semibold">
                            {formatMoney(amount)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tổng tiền & ghi chú */}
            <div className="grid grid-cols-[minmax(0,1fr)_360px] items-start gap-6 border-x border-b border-[#d8e0ee] p-4">
              <div className="min-w-0 space-y-3">
                <label className="grid grid-cols-[130px_minmax(0,1fr)] items-center gap-3 text-sm">
                  <span>Ghi chú trên hóa đơn</span>
                  <input
                    value={invoiceNote}
                    onChange={(e) => setInvoiceNote(e.target.value)}
                    className="h-9 w-full min-w-0 border border-[#d8e0ee] px-3 outline-none disabled:bg-[#f1f5f9]"
                  />
                </label>
                <label className="grid grid-cols-[130px_minmax(0,1fr)] items-center gap-3 text-sm">
                  <span>Ghi chú nội bộ</span>
                  <input
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    className="h-9 w-full min-w-0 border border-[#d8e0ee] px-3 outline-none disabled:bg-[#f1f5f9]"
                  />
                </label>
                <p className="pt-2 text-sm">
                  <b>Số tiền bằng chữ:</b>{" "}
                  {numberToVietnameseWords(totalWithVat)}
                </p>
              </div>
              <div className="min-w-0 space-y-2 border border-[#d8e0ee] bg-white p-3 text-sm">
                <div className="grid grid-cols-[130px_minmax(0,1fr)] items-center gap-3">
                  <span>Thuế suất GTGT</span>
                  <select
                    value={vatRate}
                    onChange={(e) => setVatRate(Number(e.target.value))}
                    className="h-9 w-full border border-[#d8e0ee] px-3 outline-none disabled:bg-[#f1f5f9]"
                  >
                    <option value={0}>Không có thuế</option>
                    <option value={1}>1%</option>
                    <option value={2}>2%</option>
                    <option value={5}>5%</option>
                    <option value={8}>8%</option>
                    <option value={10}>10%</option>
                  </select>
                </div>
                <div className="grid grid-cols-[130px_minmax(0,1fr)] items-center gap-3">
                  <span>Cộng tiền hàng</span>
                  <input
                    value={formatMoney(subtotal)}
                    disabled
                    className="h-9 w-full min-w-0 border border-[#d8e0ee] bg-[#f1f5f9] px-3 text-right font-semibold"
                  />
                </div>
                {vatRate > 0 && (
                  <div className="grid grid-cols-[130px_minmax(0,1fr)] items-center gap-3">
                    <span>Thuế GTGT ({vatRate}%)</span>
                    <input
                      value={formatMoney(vatAmount)}
                      disabled
                      className="h-9 w-full min-w-0 border border-[#d8e0ee] bg-[#f1f5f9] px-3 text-right font-semibold text-orange-600"
                    />
                  </div>
                )}
                <div className="grid grid-cols-[130px_minmax(0,1fr)] items-center gap-3">
                  <span>Đã thanh toán</span>
                  <input
                    value={formatMoney(paidAmount)}
                    onChange={(e) => setPaidAmount(parseMoney(e.target.value))}
                    className="h-9 w-full min-w-0 border border-[#d8e0ee] px-3 text-right outline-none disabled:bg-[#f1f5f9]"
                  />
                </div>
                <div className="grid grid-cols-[130px_minmax(0,1fr)] items-center gap-3">
                  <span>Còn nợ</span>
                  <input
                    value={formatMoney(debtAmount)}
                    disabled
                    className="h-9 w-full min-w-0 border border-[#d8e0ee] bg-[#f1f5f9] px-3 text-right font-bold text-red-600"
                  />
                </div>
                <div className="my-2 border-t border-[#d8e0ee]" />
                <div className="grid grid-cols-[130px_minmax(0,1fr)] items-center gap-3">
                  <span>Tổng thanh toán</span>
                  <input
                    value={formatMoney(totalWithVat)}
                    disabled
                    className="h-9 w-full min-w-0 border border-[#d8e0ee] bg-[#fff7ed] px-3 text-right font-bold text-red-600"
                  />
                </div>
              </div>
            </div>
          </fieldset>

          {/* Footer actions */}
          <footer className="flex justify-end gap-2 border-x border-b border-[#d8e0ee] bg-[#f8fafc] px-4 py-3">
            {currentStep === 2 && (
              <div className="mr-auto flex items-center gap-2">
                <button
                  onClick={() => setShowPreview(true)}
                  className="flex h-10 items-center gap-2 border border-[#d8e0ee] bg-white px-4 text-sm font-semibold text-[#063591]"
                >
                  <Printer className="h-4 w-4" />
                  Xem hóa đơn
                </button>
                <button
                  onClick={() => setShowConfirmIssue(true)}
                  className="flex h-10 items-center gap-2 bg-[#063591] px-4 text-sm font-bold text-white"
                >
                  <Download className="h-4 w-4" />
                  Xuất hóa đơn
                </button>
                {isIssued && (
                  <button
                    onClick={() => window.print()}
                    className="h-10 border border-[#d8e0ee] bg-white px-4 text-sm font-semibold"
                  >
                    In
                  </button>
                )}
              </div>
            )}
            <button
              onClick={() => router.push("/invoices")}
              className="flex h-10 items-center gap-2 border border-[#d8e0ee] bg-white px-4 text-sm font-semibold"
            >
              <X className="h-4 w-4" />
              Đóng
            </button>
            {currentStep === 1 && (
              <button
                onClick={() => toast.info("Tính năng lưu nháp chưa hỗ trợ")}
                className="flex h-10 items-center gap-2 border border-[#d8e0ee] bg-white px-4 text-sm font-semibold"
              >
                <FilePlus2 className="h-4 w-4" />
                Lưu nháp
              </button>
            )}
            {currentStep === 1 ? (
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex h-10 items-center gap-2 bg-[#063591] px-5 text-sm font-bold text-white disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {isLoading ? "Đang lưu..." : isEditMode ? "Cập nhật" : "Ghi"}
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(1)}
                className="flex h-10 items-center gap-2 border border-[#d8e0ee] bg-white px-5 text-sm font-bold text-[#063591]"
              >
                Mở chỉnh sửa
              </button>
            )}
          </footer>
        </section>
      </div>

      {/* Preview modal */}
      {showPreview && (
        <div className="fixed inset-0 z-[999] flex items-start justify-center bg-black/50 p-6">
          <div className="max-h-[92vh] w-[980px] overflow-auto bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-3">
              <div>
                <p className="font-bold text-[#0f172a]">
                  {isIssued ? "Hóa đơn đã xuất" : "Hóa đơn chưa hoàn thiện"}
                </p>
                <p className="text-sm text-red-600">
                  {isIssued
                    ? "Có thể in hoặc lưu PDF"
                    : "Chưa xác nhận xuất hóa đơn"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="h-9 border border-[#d8e0ee] px-3 text-sm font-semibold"
                >
                  In
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="h-9 bg-[#063591] px-4 text-sm font-bold text-white"
                >
                  Đóng
                </button>
              </div>
            </div>
            <div className="bg-[#f1f5f9] p-4">
              <PrintableInvoice invoice={printableInvoice} />
            </div>
          </div>
        </div>
      )}

      {/* Confirm issue modal */}
      {showConfirmIssue && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
          <div className="w-[520px] bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <p className="font-bold">Thông báo</p>
              <button
                onClick={() => setShowConfirmIssue(false)}
                className="text-xl text-[#94a3b8]"
              >
                ×
              </button>
            </div>
            <div className="flex gap-4 px-5 py-8 text-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-orange-300 text-2xl font-bold text-orange-500">
                !
              </div>
              <p className="pt-3">
                Bạn có chắc chắn muốn thực hiện xuất hóa đơn này hay không?
              </p>
            </div>
            <div className="flex justify-end gap-2 border-t px-5 py-4">
              <button
                onClick={handleIssueInvoice}
                className="h-9 bg-[#063591] px-4 text-sm font-bold text-white"
              >
                Thực hiện
              </button>
              <button
                onClick={() => setShowConfirmIssue(false)}
                className="h-9 border border-[#d8e0ee] px-4 text-sm font-semibold"
              >
                Bỏ qua
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CreateRetailInvoicePage() {
  return (
    <Suspense
      fallback={<div className="p-6 text-sm text-[#64748b]">Đang tải...</div>}
    >
      <CreateRetailInvoiceContent />
    </Suspense>
  );
}
