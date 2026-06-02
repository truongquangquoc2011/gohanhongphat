export default function ProductsPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-extrabold text-[#1f2430]">Sản phẩm</h1>
        <p className="mt-3 text-sm text-[#94a3b8]">
          Quản lý danh mục sản phẩm, đơn giá và tồn kho.
        </p>
      </div>

      <div className="rounded-2xl border border-[#eef0f4] bg-white p-10 text-center text-sm font-medium text-[#94a3b8]">
        Chưa có dữ liệu sản phẩm.
      </div>
    </div>
  );
}
