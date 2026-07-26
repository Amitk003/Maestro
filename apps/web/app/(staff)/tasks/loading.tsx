export default function TasksLoading() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-zinc-900 pb-4">
          <div>
            <div className="h-8 w-48 bg-zinc-800 rounded-lg animate-pulse" />
            <div className="h-4 w-36 bg-zinc-800/60 rounded mt-2 animate-pulse" />
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 mb-8">
          <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse mb-2" />
          <div className="h-8 w-24 bg-zinc-800 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
