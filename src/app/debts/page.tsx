export default function DebtsPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-extrabold text-[#1f2430]">Công nợ</h1>
        <p className="mt-3 text-sm text-[#94a3b8]">
          Quản lý công nợ khách hàng và công nợ nhà cung cấp.
        </p>
      </div>

      <div className="rounded-2xl border border-[#eef0f4] bg-white p-10 text-center text-sm font-medium text-[#94a3b8]">
        Chưa có dữ liệu công nợ.
      </div>
    </div>
  );
}
