"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Copy,
  FilePlus2,
  MoreHorizontal,
  Plus,
  Save,
  Search,
  Settings,
  Trash2,
  X,
} from "lucide-react";

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

const formatMoney = (value: number) => {
  return value.toLocaleString("vi-VN");
};

const parseMoney = (value: string) => {
  return Number(value.replaceAll(".", "").replaceAll(",", "").trim()) || 0;
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

    if (hundred > 0) {
      words.push(ones[hundred], "trăm");
    } else if (full && (ten > 0 || unit > 0)) {
      words.push("không", "trăm");
    }

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

export default function CreateRetailInvoicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const editId = searchParams.get("id");
  const isEditMode = mode === "edit";
  const [invoiceCode, setInvoiceCode] = useState("BL26-000006");
  const [invoiceDate, setInvoiceDate] = useState("2026-06-02");
  const [status] = useState("Nháp mới");
  const [classification] = useState("Hóa đơn bán lẻ");

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
  const [currentStep, setCurrentStep] = useState(1);
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

    const savedInvoices = JSON.parse(
      localStorage.getItem("hongphat_mock_invoices") || "[]",
    );

    const invoice = savedInvoices.find(
      (item: any) => String(item.id) === editId,
    );

    if (!invoice) {
      alert("Không tìm thấy hóa đơn cần sửa");
      router.push("/invoices");
      return;
    }

    setInvoiceCode(invoice.code ?? "BL26-000006");
    setInvoiceDate(invoice.createdDate ?? "2026-06-02");
    setBuyerName(invoice.customer ?? "");
    setTaxCode(invoice.taxCode === "-" ? "" : (invoice.taxCode ?? ""));
    setBuyerAddress(invoice.buyerAddress ?? "");
    setBuyerPerson(invoice.buyerPerson ?? "");
    setPhone(invoice.phone ?? "");
    setEmail(invoice.email ?? "");
    setAccountNo(invoice.accountNo ?? "");
    setPaymentMethod(invoice.paymentMethod ?? "Chuyển khoản");
    setPaidAmount(invoice.paidValue ?? 0);
    setInvoiceNote(invoice.invoiceNote ?? "");
    setInternalNote(invoice.internalNote ?? "");

    if (invoice.items?.length) {
      setRows(invoice.items);
    }
  }, [editId, isEditMode, router]);

  const subtotal = useMemo(() => {
    return rows.reduce((sum, row) => {
      const amount = row.quantity * row.price - row.discount;
      return sum + Math.max(amount, 0);
    }, 0);
  }, [rows]);

  const debtAmount = Math.max(subtotal - paidAmount, 0);

  const updateRow = <K extends keyof ItemRow>(
    id: number,
    key: K,
    value: ItemRow[K],
  ) => {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, [key]: value } : row)),
    );
  };

  const addEmptyRow = () => {
    setRows((current) => [
      ...current,
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
    setRows((current) =>
      current.length === 1 ? current : current.filter((row) => row.id !== id),
    );
  };

  const duplicateRow = (id: number) => {
    const row = rows.find((item) => item.id === id);
    if (!row) return;

    setRows((current) => [...current, { ...row, id: Date.now() }]);
  };

  const loadMockCustomer = () => {
    setTaxCode("0319461460");
    setBuyerName("CÔNG TY CỔ PHẦN MANDACONS");
    setBuyerAddress("53/5 Trần Thị Bảo, Phường Phú Thạnh, TP Hồ Chí Minh");
    setBuyerPerson("Anh Minh");
    setPhone("0909000000");
    setEmail("mandacons@example.com");
    setAccountNo("0123456789");
  };

  const handleSave = () => {
    if (!buyerName.trim()) {
      alert("Vui lòng nhập tên đơn vị / khách hàng");
      return;
    }

    if (!buyerAddress.trim()) {
      alert("Vui lòng nhập địa chỉ");
      return;
    }

    const validItems = rows.filter(
      (row) => row.name.trim() && row.quantity > 0 && row.price > 0,
    );

    if (validItems.length === 0) {
      alert("Vui lòng nhập ít nhất 1 dòng hàng hóa hợp lệ");
      return;
    }

    const newInvoice = {
      id: Date.now(),
      code: invoiceCode,
      customer: buyerName,
      taxCode: taxCode || "-",
      createdAt: new Date().toLocaleString("vi-VN"),
      createdDate: new Date().toISOString().slice(0, 10),
      invoiceDate,
      totalValue: subtotal,
      paidValue: paidAmount,
      status:
        paidAmount >= subtotal
          ? "Đã thanh toán"
          : paidAmount > 0
            ? "Thanh toán một phần"
            : "Chưa thanh toán",
      creator: "Phạm Thị Kim Ánh",
      paymentMethod,
      invoiceType: "Hóa đơn bán lẻ",
      buyerPerson,
      buyerAddress,
      phone,
      email,
      accountNo,
      invoiceNote,
      internalNote,
      items: validItems,
    };

    const oldInvoices = JSON.parse(
      localStorage.getItem("hongphat_mock_invoices") || "[]",
    );

    if (isEditMode && editId) {
      const updatedInvoices = oldInvoices.map((item: any) =>
        String(item.id) === editId
          ? {
              ...item,
              ...newInvoice,
              id: item.id,
            }
          : item,
      );

      localStorage.setItem(
        "hongphat_mock_invoices",
        JSON.stringify(updatedInvoices),
      );

      alert(`Đã cập nhật hóa đơn ${invoiceCode}`);
      setCurrentStep(2);
      return;
    }

    localStorage.setItem(
      "hongphat_mock_invoices",
      JSON.stringify([newInvoice, ...oldInvoices]),
    );

    alert(`Đã lưu hóa đơn ${invoiceCode}`);
    setCurrentStep(2);
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
                Trạng thái: <b className="text-[#063591]">{status}</b>
              </span>
              <span className="text-sm text-[#64748b]">|</span>
              <span className="text-sm">
                Phân loại: <b className="text-[#063591]">{classification}</b>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-16 text-xs text-[#64748b]">
            {[
              "Nhập thông tin hóa đơn",
              "Xuất hóa đơn",
              "In hóa đơn",
              "Ghi nhận thanh toán",
            ].map((item, index) => (
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
            {isEditMode ? "Sửa hóa đơn bán lẻ" : "Hóa đơn bán lẻ"}
          </h1>
          <p className="mb-4 text-center text-sm text-[#64748b]">
            Nhập thông tin khách hàng, hàng hóa và thanh toán
          </p>

          <div className="mb-4 border border-[#d8e0ee]">
            <div className="border-b border-[#d8e0ee] bg-[#f8fafc] px-3 py-2 text-sm font-bold">
              Thông tin người mua hàng
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)_380px] items-start gap-6 border-x border-b border-[#d8e0ee] p-4">
              <div className="w-full min-w-0 space-y-2 text-sm">
                <label className="grid grid-cols-[150px_1fr] items-center gap-3">
                  <span>
                    <b className="text-red-600">*</b> Tên đơn vị / khách
                  </span>
                  <input
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="h-9 w-full min-w-0 border border-[#d8e0ee] bg-[#edfdf3] px-3 outline-none focus:border-[#063591]"
                  />
                </label>

                <label className="grid grid-cols-[150px_1fr] items-center gap-3">
                  <span>Người mua hàng</span>
                  <input
                    value={buyerPerson}
                    onChange={(e) => setBuyerPerson(e.target.value)}
                    className="h-9 w-full min-w-0 border border-[#d8e0ee] px-3 outline-none focus:border-[#063591]"
                  />
                </label>

                <label className="grid grid-cols-[150px_1fr] items-center gap-3">
                  <span>Mã số thuế</span>
                  <div className="flex">
                    <input
                      value={taxCode}
                      onChange={(e) => setTaxCode(e.target.value)}
                      className="h-9 flex-1 border border-[#d8e0ee] px-3 outline-none focus:border-[#063591]"
                    />
                    <button
                      onClick={loadMockCustomer}
                      className="ml-2 h-9 border border-[#d8e0ee] px-3 text-xs font-semibold text-[#063591]"
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
                    className="h-9 w-full min-w-0 border border-[#d8e0ee]bg-[#edfdf3] px-3 outline-none focus:border-[#063591]"
                  />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="grid grid-cols-[150px_1fr] items-center gap-3">
                    <span>Số điện thoại</span>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-9 w-full min-w-0 border border-[#d8e0ee] px-3 outline-none focus:border-[#063591]"
                    />
                  </label>

                  <label className="grid grid-cols-[80px_1fr] items-center gap-3">
                    <span>Email</span>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-9 w-full min-w-0 border border-[#d8e0ee] px-3 outline-none focus:border-[#063591]"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-3 border-l border-[#d8e0ee] pl-5">
                <label className="grid grid-cols-[130px_1fr] items-center gap-3">
                  <span>Số hóa đơn</span>
                  <input
                    value={invoiceCode}
                    disabled
                    className="h-9 w-full min-w-0 border border-[#d8e0ee]bg-[#f1f5f9] px-3 font-semibold text-[#063591]"
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
                    className="h-9 w-full min-w-0 border border-[#d8e0ee] px-3 outline-none focus:border-[#063591]"
                  />
                </label>

                <label className="grid grid-cols-[130px_1fr] items-center gap-3">
                  <span>Hình thức TT</span>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-9 w-full min-w-0 border border-[#d8e0ee] px-3 outline-none focus:border-[#063591]"
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
                    className="h-9 w-full min-w-0 border border-[#d8e0ee] px-3 outline-none focus:border-[#063591]"
                  />
                </label>

                <div className="rounded-none border border-[#e8edf5] bg-[#f8fafc] p-3 text-xs leading-5 text-[#64748b]">
                  Các trường ở khung phải dùng để in lên hóa đơn và theo dõi
                  thanh toán nội bộ.
                </div>
              </div>
            </div>
          </div>

          <div className="border border-[#d8e0ee]">
            <div className="flex items-center justify-between border-b border-[#d8e0ee] bg-[#f8fafc] px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-[260px] items-center border border-[#d8e0ee] bg-white px-3">
                  <Search className="mr-2 h-4 w-4 text-[#94a3b8]" />
                  <input
                    placeholder="(F3) Tìm hàng hóa & dịch vụ"
                    className="h-full flex-1 text-sm outline-none"
                  />
                </div>

                <button
                  onClick={addEmptyRow}
                  className="flex h-9 items-center gap-2 border border-[#bcd7ff] bg-[#eef6ff] px-3 text-sm font-bold text-[#1263b0]"
                >
                  <Plus className="h-4 w-4" />
                  (F2) Thêm dòng trống
                </button>

                <button className="flex h-9 w-9 items-center justify-center border border-[#d8e0ee] bg-white">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-5 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  Đơn giá, số lượng bằng 0
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  Không tự tính giá trị
                </label>
                <Settings className="h-5 w-5 text-[#64748b]" />
              </div>
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
                            <button onClick={() => removeRow(row.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                            <button onClick={() => duplicateRow(row.id)}>
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
                            className="h-10 w-full px-2 outline-none"
                          />
                        </td>
                        <td className="border border-[#e8edf5]">
                          <input
                            value={row.name}
                            onChange={(e) =>
                              updateRow(row.id, "name", e.target.value)
                            }
                            className="h-10 w-full px-2 outline-none"
                          />
                        </td>
                        <td className="border border-[#e8edf5]">
                          <select
                            value={row.property}
                            onChange={(e) =>
                              updateRow(row.id, "property", e.target.value)
                            }
                            className="h-10 w-full px-2 outline-none"
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
                            className="h-10 w-full px-2 outline-none"
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
                            onChange={(e) =>
                              updateRow(
                                row.id,
                                "quantity",
                                Number(e.target.value),
                              )
                            }
                            type="number"
                            className="h-10 w-full px-2 text-right outline-none"
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
                            className="h-10 w-full px-2 text-right outline-none"
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
                            className="h-10 w-full px-2 text-right outline-none"
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

          <div className="grid grid-cols-[minmax(0,1fr)_360px] items-start gap-6 border-x border-b border-[#d8e0ee] p-4">
            <div className="min-w-0 space-y-3">
              <label className="grid grid-cols-[130px_minmax(0,1fr)] items-center gap-3 text-sm">
                <span>Hạn thanh toán</span>
                <input
                  type="date"
                  className="h-9 w-full min-w-0 border border-[#d8e0ee] px-3 outline-none"
                />
              </label>

              <label className="grid grid-cols-[130px_minmax(0,1fr)] items-center gap-3 text-sm">
                <span>Ghi chú trên hóa đơn</span>
                <input
                  value={invoiceNote}
                  onChange={(e) => setInvoiceNote(e.target.value)}
                  className="h-9 w-full min-w-0 border border-[#d8e0ee] px-3 outline-none"
                />
              </label>

              <label className="grid grid-cols-[130px_minmax(0,1fr)] items-center gap-3 text-sm">
                <span>Ghi chú nội bộ</span>
                <input
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  className="h-9 w-full min-w-0 border border-[#d8e0ee] px-3 outline-none"
                />
              </label>

              <p className="pt-2 text-sm">
                <b>Số tiền bằng chữ:</b> {numberToVietnameseWords(subtotal)}
              </p>
            </div>

            <div className="min-w-0 space-y-2 border border-[#d8e0ee] bg-white p-3 text-sm">
              <div className="grid grid-cols-[130px_minmax(0,1fr)] items-center gap-3">
                <span>Cộng tiền hàng</span>
                <input
                  value={formatMoney(subtotal)}
                  disabled
                  className="h-9 w-full min-w-0 border border-[#d8e0ee] bg-[#f1f5f9] px-3 text-right font-semibold"
                />
              </div>

              <div className="grid grid-cols-[130px_minmax(0,1fr)] items-center gap-3">
                <span>Đã thanh toán</span>
                <input
                  value={formatMoney(paidAmount)}
                  onChange={(e) => setPaidAmount(parseMoney(e.target.value))}
                  className="h-9 w-full min-w-0 border border-[#d8e0ee] px-3 text-right outline-none"
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
                  value={formatMoney(subtotal)}
                  disabled
                  className="h-9 w-full min-w-0 border border-[#d8e0ee] bg-[#fff7ed] px-3 text-right font-bold text-red-600"
                />
              </div>
            </div>
          </div>

          <footer className="flex justify-end gap-2 border-x border-b border-[#d8e0ee] bg-[#f8fafc] px-4 py-3">
            <button
              onClick={() => router.push("/invoices")}
              className="flex h-10 items-center gap-2 border border-[#d8e0ee] bg-white px-4 text-sm font-semibold"
            >
              <X className="h-4 w-4" />
              Đóng
            </button>

            <button
              onClick={() => alert("Mock: đã lưu nháp")}
              className="flex h-10 items-center gap-2 border border-[#d8e0ee] bg-white px-4 text-sm font-semibold"
            >
              <FilePlus2 className="h-4 w-4" />
              Lưu nháp
            </button>

            <button
              onClick={handleSave}
              className="flex h-10 items-center gap-2 bg-[#063591] px-5 text-sm font-bold text-white"
            >
              <Save className="h-4 w-4" />
              Ghi
            </button>
          </footer>
        </section>
      </div>
    </div>
  );
}
