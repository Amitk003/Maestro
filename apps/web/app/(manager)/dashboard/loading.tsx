import { KPISkeleton } from '../../../components/ui/Skeleton';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-zinc-900 pb-4">
          <div>
            <div className="h-8 w-64 bg-zinc-800 rounded-lg animate-pulse" />
            <div className="h-4 w-48 bg-zinc-800/60 rounded mt-2 animate-pulse" />
          </div>
        </div>
        <KPISkeleton />
      </div>
    </div>
  );
}
