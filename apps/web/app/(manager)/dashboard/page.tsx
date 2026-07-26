export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-zinc-600">
        Digital twin visualization and analytics will appear here.
      </p>
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <p className="text-xs text-zinc-500">Table Turnover</p>
          <p className="mt-1 text-2xl font-bold">42 min</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-zinc-500">Kitchen Bottleneck</p>
          <p className="mt-1 text-2xl font-bold">23%</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-zinc-500">Guest Delight</p>
          <p className="mt-1 text-2xl font-bold">4.8 / 5</p>
        </div>
      </div>
    </div>
  );
}
