export default function TasksPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">Tasks</h1>
      <p className="mt-2 text-zinc-600">
        Your ranked task feed will appear here.
      </p>
      <div className="mt-8 space-y-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                Urgent
              </span>
              <p className="mt-2 text-sm">
                Move Table 12 to Table 8 now - prevents 11-min delay on
                incoming reservation.
              </p>
            </div>
            <button className="rounded bg-zinc-900 px-3 py-1 text-xs text-white hover:bg-zinc-700">
              Accept
            </button>
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                Attention
              </span>
              <p className="mt-2 text-sm">
                Serve complimentary amuse-bouche to Table 4 - Grill bottleneck
                detected.
              </p>
            </div>
            <button className="rounded bg-zinc-900 px-3 py-1 text-xs text-white hover:bg-zinc-700">
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
