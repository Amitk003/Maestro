import { TicketSkeleton } from '../../../components/ui/Skeleton';

export default function KDSLoading() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-zinc-900 pb-4">
        <div>
          <div className="h-8 w-48 bg-zinc-800 rounded-lg animate-pulse" />
          <div className="h-4 w-36 bg-zinc-800/60 rounded mt-2 animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse mb-2" />
            <div className="h-2 bg-zinc-800 rounded-full animate-pulse" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <TicketSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
