type InvoiceItem = {
  name?: string;
  unit?: string;
  quantity?: number;
  price?: number;
};

type PrintableInvoiceProps = {
  invoice: {
    code?: string;
    serial?: string;
    date?: string;
    buyerName?: string;
    companyName?: string;
    taxCode?: string;
    address?: string;
    paymentMethod?: string;
    accountNo?: string;
    amountInWords?: string;
    items?: InvoiceItem[];
    vatRate?: number;
  };
};

const qrUrl = "/qr_kim_anh_card.png";

const formatMoney = (value?: number) => {
  if (!value) return "";
  return value.toLocaleString("vi-VN");
};

export default function PrintableInvoice({ invoice }: PrintableInvoiceProps) {
  const items = invoice.items ?? [];
  const hasItems = items.length > 0;

  const subtotal = items.reduce(
    (sum, item) => sum + (item.quantity ?? 0) * (item.price ?? 0),
    0,
  );

  const vatRate = invoice.vatRate ?? 0;
  const vat = subtotal * vatRate;
  const total = subtotal + vat;

  const rows: InvoiceItem[] = Array.from({ length: 14 }).map(
    (_, index) => items[index] ?? {},
  );

  return (
    <div id="print-area">
      <div className="mx-auto h-[287mm] w-[200mm] overflow-hidden bg-white p-[4mm] text-[10.5px] leading-[1.25] text-black">
        <div className="relative h-full border-[2px] border-[#12306d] px-[7mm] py-[5mm]">
          <div className="absolute left-2 top-2 h-5 w-5 border-l-2 border-t-2 border-[#12306d]" />
          <div className="absolute right-2 top-2 h-5 w-5 border-r-2 border-t-2 border-[#12306d]" />
          <div className="absolute bottom-2 left-2 h-5 w-5 border-b-2 border-l-2 border-[#12306d]" />
          <div className="absolute bottom-2 right-2 h-5 w-5 border-b-2 border-r-2 border-[#12306d]" />

          <div className="grid min-h-[112px] grid-cols-[135px_1fr_150px] items-start">
            <div className="flex flex-col items-center">
              <img
                src={qrUrl}
                alt="QR thanh toán"
                className="h-[102px] w-[102px] object-contain"
              />
              <p className="-mt-1 text-center text-[9.5px] font-bold">
                Phạm Thị Kim Ánh
              </p>
              <p className="text-center text-[9.5px] font-bold">
                MB: 1000100106044
              </p>
            </div>

            <div className="pt-4 text-center">
              <h1 className="text-[20px] font-bold uppercase text-red-700">
                HÓA ĐƠN BÁN LẺ
              </h1>
              <p className="text-[14px] font-bold italic text-red-700">
                (RETAIL INVOICE)
              </p>
             
                <p className="mt-2">
                  Ngày <i>(Date)</i> ............................ tháng .............. năm ..............
                </p>
            </div>

            <div className="space-y-2 pt-5 text-left text-[11px]">
              <div className="flex items-center gap-2">
                <span>
                  Ký hiệu <i>(Serial)</i>:
                </span>
                <span className="inline-block w-[75px] border-b border-dotted border-black">
                  {invoice.serial || ""}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span>
                  Số <i>(No.)</i>:
                </span>
                <span className="inline-block w-[100px] border-b border-dotted border-black font-bold text-red-700">
                  {invoice.code || ""}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 border-t border-gray-300 pt-3">
            <div className="grid grid-cols-[1fr_340px] gap-6">
              <div className="space-y-1">
                <p>
                  Đơn vị bán hàng <i>(Seller)</i>:{" "}
                  <b className="text-red-700">
                    Công ty TNHH Gia Công Cơ Khí Inox HP Hồng Phát
                  </b>
                </p>
                <p>
                  Mã số thuế <i>(Tax code)</i>: <b>0319444257</b>
                </p>
                <p>
                  Địa chỉ <i>(Address)</i>:{" "}
                  <b>
                    198 Bình Long, Khu Phố 12, Phường Phú Thạnh, Thành phố Hồ
                    Chí Minh, Việt Nam
                  </b>
                </p>
                <p>
                  Email: <b>kimanh83738@gmail.com</b>
                </p>

                <div className="mt-1 space-y-1">
                  <p>
                    - STK công ty <b>Phạm Thị Kim Ánh</b> MB: <b>352983738</b>
                  </p>
                  <p>
                    - STK cá nhân <b>Phạm Thị Kim Ánh</b> MB:{" "}
                    <b>1000100106044</b>
                  </p>
                  <p>
                    - STK cá nhân <b>Nguyễn Văn Hồng</b> MB: <b>0985908270</b>
                  </p>
                </div>
              </div>

              <div className="mt-1 border-l-2 border-red-600 pl-4 text-[12px] font-semibold leading-[1.6] text-red-700">
                <p className="mb-3 text-center text-[18px] font-bold italic leading-none">
                  Chuyên gia công - lắp ráp - sửa chữa
                </p>

                <div className="space-y-0.5">
                  <p>◆ Thùng đá, thùng cách nhiệt, thùng nấu</p>
                  <p>◆ Khuôn kem, khay đông lạnh, máy hút khói, chữ nổi</p>
                  <p>◆ Máng xối công trình, hệ thống ống hơi</p>
                  <p>◆ Nhận thiết kế, gia công: Inox, Nhôm, Tôn</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <p className="border-b border-dotted border-black">
              Họ tên người mua hàng <i>(Buyer)</i>:{" "}
              {hasItems ? invoice.buyerName || "" : ""}
            </p>
            <p className="border-b border-dotted border-black">
              Tên đơn vị <i>(Company name)</i>:{" "}
              <b>{hasItems ? invoice.companyName || "" : ""}</b>
            </p>
            <p className="border-b border-dotted border-black">
              Mã số thuế <i>(Tax code)</i>:{" "}
              <b>{hasItems ? invoice.taxCode || "" : ""}</b>
            </p>
            <p className="border-b border-dotted border-black">
              Địa chỉ <i>(Address)</i>:{" "}
              <b>{hasItems ? invoice.address || "" : ""}</b>
            </p>
            <p className="border-b border-dotted border-black">
              Hình thức thanh toán <i>(Payment method)</i>:{" "}
              <b>{hasItems ? invoice.paymentMethod || "" : ""}</b>
              <span className="ml-12">
                Số tài khoản <i>(A/C No.)</i>:{" "}
                <b>{hasItems ? invoice.accountNo || "" : ""}</b>
              </span>
            </p>
          </div>

          <table className="mt-3 w-full table-fixed border-collapse border border-black text-center text-[11px]">
            <colgroup>
              <col className="w-[7%]" />
              <col className="w-[40%]" />
              <col className="w-[7%]" />
              <col className="w-[10%]" />
              <col className="w-[15%]" />
              <col className="w-[21%]" />
            </colgroup>

            <thead>
              <tr>
                <th className="border border-black p-1">
                  STT
                  <br />
                  <i>(No.)</i>
                </th>
                <th className="border border-black p-1">
                  Tên hàng hóa, dịch vụ
                  <br />
                  <i>(Name of goods, services)</i>
                </th>
                <th className="border border-black p-1">
                  Đơn vị tính
                  <br />
                  <i>(Unit)</i>
                </th>
                <th className="border border-black p-1">
                  Số lượng
                  <br />
                  <i>(Quantity)</i>
                </th>
                <th className="border border-black p-1">
                  Đơn giá
                  <br />
                  <i>(Unit price)</i>
                </th>
                <th className="border border-black p-1">
                  Thành tiền
                  <br />
                  <i>(Amount)</i>
                </th>
              </tr>

              <tr>
                {["(1)", "(2)", "(3)", "(4)", "(5)", "(6)=(4)x(5)"].map(
                  (item) => (
                    <th
                      key={item}
                      className="border border-black p-1 font-normal"
                    >
                      {item}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody>
              {rows.map((item, index) => {
                const amount = (item.quantity ?? 0) * (item.price ?? 0);
                const isEmpty =
                  !item.name && !item.unit && !item.quantity && !item.price;

                return (
                  <tr key={index} className="h-[18px]">
                    <td className="border border-black px-1">
                      {isEmpty ? "" : index + 1}
                    </td>
                    <td className="border border-black px-1 text-left">
                      {item.name || ""}
                    </td>
                    <td className="border border-black px-1">
                      {item.unit || ""}
                    </td>
                    <td className="border border-black px-1 text-right">
                      {item.quantity || ""}
                    </td>
                    <td className="border border-black px-1 text-right">
                      {formatMoney(item.price)}
                    </td>
                    <td className="border border-black px-1 text-right">
                      {isEmpty ? "" : formatMoney(amount)}
                    </td>
                  </tr>
                );
              })}

              <tr>
                <td colSpan={5} className="border border-black p-1 text-right">
                  Cộng tiền hàng <i>(Sub total)</i>:
                </td>
                <td className="border border-black p-1 text-right font-bold">
                  {hasItems ? formatMoney(subtotal) : ""}
                </td>
              </tr>

              <tr>
                <td colSpan={2} className="border border-black p-1 text-left">
                  Thuế suất GTGT <i>(VAT rate)</i>:{" "}
                  <b>{hasItems ? `${vatRate * 100}%` : ""}</b>
                </td>
                <td colSpan={3} className="border border-black p-1 text-right">
                  Tiền thuế GTGT <i>(VAT amount)</i>:
                </td>
                <td className="border border-black p-1 text-right font-bold">
                  {hasItems ? formatMoney(vat) : ""}
                </td>
              </tr>

              <tr>
                <td colSpan={5} className="border border-black p-1 text-right">
                  Tổng cộng tiền thanh toán <i>(Total payment)</i>:
                </td>
                <td className="border border-black p-1 text-right font-bold">
                  {hasItems ? formatMoney(total) : ""}
                </td>
              </tr>

              <tr>
                <td colSpan={6} className="border border-black p-1 text-left">
                  Số tiền viết bằng chữ <i>(Amount in words)</i>:{" "}
                  <b>{hasItems ? invoice.amountInWords || "" : ""}</b>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-7 grid grid-cols-2 text-center">
            <div>
              <p>
                Người mua hàng <i>(Buyer)</i>
              </p>
              <p className="italic">(Ký, ghi rõ họ tên)</p>
            </div>

            <div>
              <p>
                Người bán hàng <i>(Seller)</i>
              </p>
              <p className="italic">(Ký, ghi rõ họ tên)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
