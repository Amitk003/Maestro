'use client';

import React, { useState } from 'react';
import { Table, KitchenStation } from '@maestro/shared';

interface FloorplanProps {
  tables: Table[];
  stations: KitchenStation[];
}

export const FloorplanVisualizer: React.FC<FloorplanProps> = ({ tables, stations }) => {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'vacant': return 'fill-emerald-500/20 stroke-emerald-500 text-emerald-400';
      case 'seated': return 'fill-blue-500/20 stroke-blue-500 text-blue-400';
      case 'ordering': return 'fill-amber-500/20 stroke-amber-500 text-amber-400';
      case 'waiting_food': return 'fill-orange-500/30 stroke-orange-500 text-orange-400 animate-pulse';
      case 'eating': return 'fill-purple-500/20 stroke-purple-500 text-purple-400';
      case 'payment': return 'fill-teal-500/20 stroke-teal-500 text-teal-400';
      case 'dirty': return 'fill-zinc-600/30 stroke-zinc-500 text-zinc-400';
      default: return 'fill-zinc-700 stroke-zinc-600 text-zinc-400';
    }
  };

  return (
    <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Live Floorplan Digital Twin</h3>
          <p className="text-xs text-zinc-400">Real-time table occupancy & station heatmaps</p>
        </div>
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Vacant</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span> Seated</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-orange-500"></span> Waiting Food</span>
        </div>
      </div>

      <div className="relative aspect-[16/9] w-full border border-zinc-900 rounded-xl bg-zinc-900/40 p-4">
        <svg className="h-full w-full" viewBox="0 0 600 400">
          {/* Grid background pattern */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#27272a" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Kitchen Station Heatmap Section */}
          <rect x="20" y="340" width="560" height="50" rx="8" fill="#18181b" stroke="#3f3f46" strokeDasharray="4 4" />
          <text x="30" y="360" fill="#a1a1aa" fontSize="10" fontWeight="bold">KITCHEN STATIONS HEATMAP</text>

          {stations.map((st, i) => {
            const x = 30 + i * 135;
            const heatColor = st.heat_index > 80 ? '#ef4444' : st.heat_index > 50 ? '#f59e0b' : '#10b981';
            return (
              <g key={st.id}>
                <rect x={x} y={365} width="125" height="18" rx="4" fill="#27272a" stroke={heatColor} strokeWidth="1.5" />
                <rect x={x} y={365} width={(125 * st.heat_index) / 100} height="18" rx="4" fill={heatColor} opacity="0.3" />
                <text x={x + 6} y={378} fill="#ffffff" fontSize="9" fontWeight="bold">
                  {st.name.split(' ')[0]} ({st.heat_index}%)
                </text>
              </g>
            );
          })}

          {/* Tables */}
          {tables.map((t) => {
            const colorClass = getStatusColor(t.status);
            return (
              <g
                key={t.id}
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={() => setSelectedTable(t)}
              >
                <rect
                  x={t.position_x}
                  y={t.position_y}
                  width="70"
                  height="70"
                  rx="12"
                  className={colorClass}
                  strokeWidth="2"
                />
                <text
                  x={t.position_x + 35}
                  y={t.position_y + 36}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="13"
                  fontWeight="bold"
                >
                  {`T${t.id.slice(-4).toUpperCase()}`}
                </text>
                <text
                  x={t.position_x + 35}
                  y={t.position_y + 52}
                  textAnchor="middle"
                  fill="#a1a1aa"
                  fontSize="9"
                >
                  {t.capacity} Seats
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Table Drawer/Modal */}
      {selectedTable && (
        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-xs">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-white text-sm">Table T{selectedTable.id.slice(-4).toUpperCase()} Details</h4>
            <button onClick={() => setSelectedTable(null)} className="text-zinc-500 hover:text-white">Close</button>
          </div>
          <div className="grid grid-cols-3 gap-2 text-zinc-300">
            <div><span className="text-zinc-500">Zone:</span> {selectedTable.zone}</div>
            <div><span className="text-zinc-500">Status:</span> {selectedTable.status}</div>
            <div><span className="text-zinc-500">Capacity:</span> {selectedTable.capacity} guests</div>
            {selectedTable.guest_intent && (
              <div className="col-span-3 mt-1 text-emerald-400">
                <span className="text-zinc-500">Guest Intent:</span> "{selectedTable.guest_intent}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
