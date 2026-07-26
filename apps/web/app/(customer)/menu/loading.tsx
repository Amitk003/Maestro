export default function MenuLoading() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-zinc-900 pb-4">
          <div>
            <div className="h-8 w-56 bg-zinc-800 rounded-lg animate-pulse" />
            <div className="h-4 w-36 bg-zinc-800/60 rounded mt-2 animate-pulse" />
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 mb-8">
          <div className="h-4 w-48 bg-zinc-800 rounded animate-pulse mb-4" />
          <div className="h-20 bg-zinc-800/60 rounded-xl animate-pulse mb-4" />
          <div className="h-10 bg-zinc-800 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
