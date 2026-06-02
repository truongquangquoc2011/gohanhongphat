export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-6">
        <div className="rounded-2xl bg-[#30343b] p-6 text-white">
          <p className="text-sm text-white/60">Doanh thu tháng</p>
          <h2 className="mt-3 text-3xl font-extrabold">0đ</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-[#94a3b8]">Tổng hóa đơn</p>
          <h2 className="mt-3 text-3xl font-extrabold text-[#1f2430]">0</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-[#94a3b8]">Công nợ</p>
          <h2 className="mt-3 text-3xl font-extrabold text-[#1f2430]">0đ</h2>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="text-xl font-extrabold text-[#1f2430]">
          Hóa đơn gần đây
        </h3>

        <div className="mt-6 rounded-xl border border-[#eef0f4] p-10 text-center text-sm font-medium text-[#94a3b8]">
          Chưa có dữ liệu hóa đơn
        </div>
      </div>
    </div>
  );
}