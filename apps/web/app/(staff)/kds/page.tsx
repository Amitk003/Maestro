'use client';

import React, { useEffect } from 'react';
import { useTwinStore } from '../../../lib/store/useTwinStore';
import Link from 'next/link';

export default function KitchenKDSPage() {
  const { state, initSocket } = useTwinStore();

  useEffect(() => {
    initSocket();
  }, [initSocket]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-zinc-900 pb-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Kitchen Conductor KDS</h1>
          <p className="text-xs text-zinc-400">Station load balancing & automated order pathing</p>
        </div>
        <Link href="/" className="text-xs text-zinc-400 hover:text-white">← Home</Link>
      </div>

      {/* Kitchen Station Load Heatmap Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {state?.stations.map((st) => (
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

      {/* Active Kitchen Tickets */}
      <h2 className="text-xl font-bold mb-4">Active Preparation Tickets</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {state?.activeOrders.map((ord) => (
          <div key={ord.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3 mb-3">
              <div>
                <span className="font-bold text-white text-lg">Order #{ord.id.split('_')[1]}</span>
                <div className="text-xs text-rose-400 font-mono">Table {ord.table_id}</div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 uppercase font-mono">
                {ord.status}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              {ord.items.map((item) => (
                <div key={item.id} className="rounded-xl border border-zinc-800/80 bg-zinc-950 p-3">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>{item.quantity}x {item.menu_item_id === 'M1' ? 'Wagyu Ribeye' : 'Atlantic Salmon'}</span>
                    <span className="text-zinc-500 font-mono">{item.station_id}</span>
                  </div>
                </div>
              ))}
            </div>

            {ord.notes && <div className="text-xs text-purple-300 mb-4 font-mono">Notes: {ord.notes}</div>}

            <button className="w-full rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition">
              ✓ Mark Ticket Ready
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
