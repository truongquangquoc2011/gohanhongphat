type QuoteItem = {
  id?: string | number;
  name?: string;
  unit?: string;
  quantity?: number;
  price?: number;
  vat?: number;
  total?: number;
};

type PrintableQuoteProps = {
  quote: {
    code?: string;
    quoteDate?: string;
    validUntil?: string;
    customerName?: string;
    contactPerson?: string;
    taxCode?: string;
    address?: string;
    phone?: string;
    email?: string;
    creator?: string;
    deliveryTime?: string;
    paymentTerm?: string;
    note?: string;
    amountInWords?: string;
    totalAmount?: number;
    includeVat?: boolean;
    vatRate?: number;
    vatAmount?: number;
    grandTotal?: number;
    items?: QuoteItem[];
  };
};

const qrUrl = "/qr_kim_anh_card.png";

const formatMoney = (value?: number) => {
  if (!value) return "";
  return value.toLocaleString("vi-VN");
};

export default function PrintableQuote({ quote }: PrintableQuoteProps) {
  const items = quote.items ?? [];
  const hasItems = items.length > 0;

  const includeVat = Boolean(quote.includeVat);
  const vatRate = quote.vatRate ?? (includeVat ? 10 : 0);

  const subtotal = items.reduce((sum, item) => {
    const amount = item.total ?? (item.quantity ?? 0) * (item.price ?? 0);
    return sum + amount;
  }, 0);

  const vatAmount = includeVat
    ? quote.vatAmount ?? Math.round((subtotal * vatRate) / 100)
    : 0;

  const grandTotal = includeVat
    ? quote.grandTotal ?? subtotal + vatAmount
    : subtotal;

  const rows: QuoteItem[] = Array.from({ length: 14 }).map(
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

          <div className="grid min-h-[112px] grid-cols-[135px_1fr_170px] items-start">
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
              <h1 className="text-[22px] font-bold uppercase text-red-700">
                BÁO GIÁ
              </h1>
              <p className="text-[14px] font-bold italic text-red-700">
                (QUOTATION)
              </p>

              <p className="mt-2">
                Ngày <i>(Date)</i>:{" "}
                <b>{quote.quoteDate || "............................"}</b>
              </p>
            </div>

            <div className="space-y-2 pt-5 text-left text-[11px]">
              <div className="flex items-center gap-2">
                <span>Số báo giá:</span>
                <span className="inline-block w-[92px] border-b border-dotted border-black font-bold text-red-700">
                  {quote.code || ""}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span>Hiệu lực:</span>
                <span className="inline-block w-[105px] border-b border-dotted border-black">
                  {quote.validUntil || ""}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span>Người lập:</span>
                <span className="inline-block w-[96px] border-b border-dotted border-black">
                  {quote.creator || ""}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 border-t border-gray-300 pt-3">
            <div className="grid grid-cols-[1fr_340px] gap-6">
              <div className="space-y-1">
                <p>
                  Đơn vị báo giá <i>(Seller)</i>:{" "}
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
              Đơn vị / Khách hàng <i>(Customer)</i>:{" "}
              <b>{hasItems ? quote.customerName || "" : ""}</b>
            </p>

            <p className="border-b border-dotted border-black">
              Người liên hệ <i>(Contact person)</i>:{" "}
              <b>{hasItems ? quote.contactPerson || "" : ""}</b>
              <span className="ml-12">
                Số điện thoại <i>(Phone)</i>:{" "}
                <b>{hasItems ? quote.phone || "" : ""}</b>
              </span>
            </p>

            <p className="border-b border-dotted border-black">
              Mã số thuế <i>(Tax code)</i>:{" "}
              <b>{hasItems ? quote.taxCode || "" : ""}</b>
              <span className="ml-12">
                Email: <b>{hasItems ? quote.email || "" : ""}</b>
              </span>
            </p>

            <p className="border-b border-dotted border-black">
              Địa chỉ <i>(Address)</i>:{" "}
              <b>{hasItems ? quote.address || "" : ""}</b>
            </p>
          </div>

          <table className="mt-3 w-full table-fixed border-collapse border border-black text-center text-[11px]">
            <colgroup>
              <col className="w-[6%]" />
              <col className="w-[35%]" />
              <col className="w-[7%]" />
              <col className="w-[9%]" />
              <col className="w-[14%]" />
              <col className="w-[8%]" />
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
                  Thuế
                  <br />
                  <i>(VAT %)</i>
                </th>

                <th className="border border-black p-1">
                  Thành tiền
                  <br />
                  <i>(Amount)</i>
                </th>
              </tr>

              <tr>
                {["(1)", "(2)", "(3)", "(4)", "(5)", "(6)", "(7)"].map(
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
                const amount =
                  item.total ?? (item.quantity ?? 0) * (item.price ?? 0);

                const isEmpty =
                  !item.name && !item.unit && !item.quantity && !item.price;

                return (
                  <tr key={index} className="h-[22px]">
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

                    <td className="border border-black px-1 text-center">
                      {isEmpty ? "" : includeVat ? `${item.vat ?? vatRate}%` : ""}
                    </td>

                    <td className="border border-black px-1 text-right">
                      {isEmpty ? "" : formatMoney(amount)}
                    </td>
                  </tr>
                );
              })}

              <tr>
                <td colSpan={6} className="border border-black p-1 text-right">
                  Cộng tiền hàng <i>(Sub total)</i>:
                </td>
                <td className="border border-black p-1 text-right font-bold">
                  {hasItems ? formatMoney(subtotal) : ""}
                </td>
              </tr>

              {includeVat && (
                <tr>
                  <td
                    colSpan={6}
                    className="border border-black p-1 text-right"
                  >
                    Thuế GTGT {vatRate}% <i>(VAT)</i>:
                  </td>
                  <td className="border border-black p-1 text-right font-bold">
                    {hasItems ? formatMoney(vatAmount) : ""}
                  </td>
                </tr>
              )}

              <tr>
                <td colSpan={6} className="border border-black p-1 text-right">
                  Tổng cộng báo giá <i>(Total quotation)</i>:
                </td>
                <td className="border border-black p-1 text-right font-bold">
                  {hasItems ? formatMoney(grandTotal) : ""}
                </td>
              </tr>

              <tr>
                <td colSpan={7} className="border border-black p-1 text-left">
                  Số tiền viết bằng chữ <i>(Amount in words)</i>:{" "}
                  <b>{hasItems ? quote.amountInWords || "" : ""}</b>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-3 space-y-1 text-[10.5px]">
            <p className="border-b border-dotted border-black">
              Thời gian giao hàng <i>(Delivery time)</i>:{" "}
              <b>{hasItems ? quote.deliveryTime || "Theo thỏa thuận" : ""}</b>
            </p>

            <p className="border-b border-dotted border-black">
              Điều khoản thanh toán <i>(Payment terms)</i>:{" "}
              <b>{hasItems ? quote.paymentTerm || "Theo thỏa thuận" : ""}</b>
            </p>

            <p className="border-b border-dotted border-black">
              Ghi chú <i>(Note)</i>: <b>{hasItems ? quote.note || "" : ""}</b>
            </p>

            {hasItems && !includeVat && (
              <p className="font-bold italic text-red-700">
                Lưu ý: Giá trên chưa bao gồm thuế GTGT.
              </p>
            )}
          </div>

         <div className="mt-3 grid grid-cols-2 text-center text-[9.5px]">
            <div>
              <p>
                Khách hàng <i>(Customer)</i>
              </p>
              <p className="italic">(Ký, ghi rõ họ tên)</p>
            </div>

            <div>
              <p>
                Người lập báo giá <i>(Quotation maker)</i>
              </p>
              <p className="italic">(Ký, ghi rõ họ tên)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}