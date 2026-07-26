'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useTwinStore } from '../../../lib/store/useTwinStore';

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

export default function KitchenKDSPage() {
  const { state, initSocket } = useTwinStore();
  const [queue, setQueue] = useState<QueueOrder[]>([]);
  const [markingReady, setMarkingReady] = useState<string | null>(null);

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

  return (
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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

      <h2 className="text-xl font-bold mb-4">Active Preparation Tickets</h2>
      {queue.length === 0 && (
        <div className="text-xs text-zinc-500 text-center py-12 border border-dashed border-zinc-800 rounded-2xl">
          No active orders in the queue
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {queue.map((ord) => (
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

            <div className="text-xs text-zinc-500 font-mono mb-3">
              Created: {new Date(ord.created_at).toLocaleTimeString()}
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
        ))}
      </div>
    </div>
  );
}
