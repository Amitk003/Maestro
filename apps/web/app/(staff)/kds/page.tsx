export default function KDSPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold">Kitchen Display</h1>
      <p className="mt-2 text-zinc-600">
        Station-specific order queues will appear here.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Grill</h3>
          <p className="text-xs text-zinc-500">2 orders waiting</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Saute</h3>
          <p className="text-xs text-zinc-500">5 orders waiting</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Cold Prep</h3>
          <p className="text-xs text-zinc-500">1 order waiting</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Pastry</h3>
          <p className="text-xs text-zinc-500">0 orders waiting</p>
        </div>
      </div>
    </div>
  );
}
