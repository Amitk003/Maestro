'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useTwinStore } from '../../../lib/store/useTwinStore';
import { PageTransition } from '../../../components/ui/PageTransition';
import { ErrorBoundary } from '../../../components/ui/ErrorBoundary';

interface QueueOrderItem {
  id: string;
  menu_item_id: string;
  quantity: number;
  station_id: string;
  status: string;
  prep_started_at: string | null;
  prep_completed_at: string | null;
  menu_item: { name: string; base_prep_minutes: number } | null;
}

interface QueueOrder {
  id: string;
  table_id: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  type: string;
  order_items: QueueOrderItem[];
}

function PrepTimer({ created_at, base_prep }: { created_at: string; base_prep: number }) {
  const [, setTick] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => setTick((t) => t + 1), 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const elapsed = Math.floor((Date.now() - new Date(created_at).getTime()) / 1000);
  const total = base_prep * 60;
  const remaining = Math.max(0, total - elapsed);
  const pct = Math.min(100, (elapsed / total) * 100);

  return (
    <div className="flex items-center gap-2">
      <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden flex-1">
        <div
          className={`h-full rounded-full transition-all ${remaining <= 60 ? 'bg-rose-500' : 'bg-emerald-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-[10px] font-mono min-w-[3rem] text-right ${remaining <= 60 ? 'text-rose-400' : 'text-zinc-400'}`}>
        {remaining > 0 ? `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}` : 'DONE'}
      </span>
    </div>
  );
}

export default function KitchenKDSPage() {
  const { state, initSocket } = useTwinStore();
  const [queue, setQueue] = useState<QueueOrder[]>([]);
  const [markingReady, setMarkingReady] = useState<string | null>(null);
  const [filterStation, setFilterStation] = useState<string>('all');

  const fetchQueue = useCallback(async () => {
    try {
      const res = await fetch('/api/kitchen/queue');
      const data = await res.json();
      if (data.orders) setQueue(data.orders);
    } catch {
      // keep existing queue on error
    }
  }, []);

  useEffect(() => {
    initSocket();
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, [initSocket, fetchQueue]);

  const handleMarkReady = async (orderId: string) => {
    setMarkingReady(orderId);
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ready' }),
      });
      fetchQueue();
    } catch {
      // silent
    } finally {
      setMarkingReady(null);
    }
  };

  const stations = state?.stations || [];

  const filteredQueue = filterStation === 'all'
    ? queue
    : queue.filter((o) => o.order_items.some((i) => i.station_id === filterStation));

  return (
    <ErrorBoundary>
    <PageTransition>
    <div className="min-h-screen bg-zinc-950 text-white p-6 font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-zinc-900 pb-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Kitchen Conductor KDS</h1>
          <p className="text-xs text-zinc-400">Station load balancing and automated order pathing</p>
        </div>
        <Link href="/" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Station Heatmap */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stations.length === 0 && (
          <div className="col-span-full text-xs text-zinc-500 text-center py-4">
            Waiting for station data from agent worker...
          </div>
        )}
        {stations.map((st) => (
          <div key={st.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-bold text-white">{st.name}</span>
              <span className={`font-mono font-bold ${st.heat_index > 80 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {st.heat_index}% Heat
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className={`h-full transition-all ${st.heat_index > 80 ? 'bg-rose-500' : st.heat_index > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${st.heat_index}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-zinc-500 mt-2 font-mono">
              Queue: {st.current_queue_depth} orders | Max Cap: {st.max_capacity}
            </div>
          </div>
        ))}
      </div>

      {/* Station Filter Tabs */}
      <div className="flex gap-1 mb-6 bg-zinc-900 rounded-xl p-1 border border-zinc-800 overflow-x-auto">
        <button
          onClick={() => setFilterStation('all')}
          className={`flex-shrink-0 text-xs py-2 px-3 rounded-lg font-medium transition ${filterStation === 'all' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
        >
          All Stations
        </button>
        {stations.map((st) => (
          <button
            key={st.id}
            onClick={() => setFilterStation(st.id)}
            className={`flex-shrink-0 text-xs py-2 px-3 rounded-lg font-medium transition ${filterStation === st.id ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            {st.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Ticket Grid */}
      <h2 className="text-xl font-bold mb-4">
        {filterStation === 'all' ? 'Active Preparation Tickets' : `${stations.find((s) => s.id === filterStation)?.name || 'Station'} Tickets`}
        <span className="text-sm font-normal text-zinc-500 ml-2">({filteredQueue.length})</span>
      </h2>

      {filteredQueue.length === 0 && (
        <div className="text-xs text-zinc-500 text-center py-12 border border-dashed border-zinc-800 rounded-2xl">
          No active orders in this view
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredQueue.map((ord) => {
          const maxPrep = Math.max(...ord.order_items.map((i) => i.menu_item?.base_prep_minutes || 10));
          return (
            <div key={ord.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3 mb-3">
                <div>
                  <span className="font-bold text-white text-lg">Order #{ord.id.slice(0, 8)}</span>
                  <div className="text-xs text-rose-400 font-mono">Table {ord.table_id || 'N/A'}</div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 uppercase font-mono">
                  {ord.status}
                </span>
              </div>

              <div className="mb-3">
                <PrepTimer created_at={ord.created_at} base_prep={maxPrep} />
              </div>

              <div className="space-y-3 mb-4">
                {ord.order_items.map((item) => (
                  <div key={item.id} className="rounded-xl border border-zinc-800/80 bg-zinc-950 p-3">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{item.quantity}x {item.menu_item?.name || item.menu_item_id}</span>
                      <span className="text-zinc-500 font-mono">{item.station_id?.slice(0, 8) || 'unspecified'}</span>
                    </div>
                  </div>
                ))}
              </div>

              {ord.notes && <div className="text-xs text-purple-300 mb-4 font-mono">Notes: {ord.notes}</div>}

              <button
                onClick={() => handleMarkReady(ord.id)}
                disabled={markingReady === ord.id}
                className="w-full rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition disabled:opacity-50"
              >
                {markingReady === ord.id ? 'Marking...' : 'Mark Ticket Ready'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
    </PageTransition>
    </ErrorBoundary>
  );
}
