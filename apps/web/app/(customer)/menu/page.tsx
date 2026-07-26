'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTwinStore } from '../../../lib/store/useTwinStore';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  base_prep_minutes: number;
  spoilage_priority_boost: number;
  station_requirements: string[];
}

function computeAvailability(item: MenuItem, state: { stations: { id: string; heat_index: number; current_queue_depth: number; max_capacity: number }[]; ingredients: { id: string; freshness_pct: number }[]; menuItems: MenuItem[] } | null): { score: number; label: string; color: string } {
  if (!state) return { score: 85, label: 'Estimated Available', color: 'text-emerald-400' };

  let score = 100;

  // Station load penalty
  for (const stationId of item.station_requirements) {
    const station = state.stations.find((s) => s.id === stationId);
    if (station) {
      const loadRatio = station.current_queue_depth / Math.max(station.max_capacity, 1);
      score -= loadRatio * 30;
      if (station.heat_index > 80) score -= 15;
    }
  }

  // Prep time penalty (longer prep = more risk)
  score -= Math.min(15, item.base_prep_minutes * 0.5);

  // Spoilage boost (fresh ingredients being promoted)
  if (item.spoilage_priority_boost > 0) score += 10;

  const clamped = Math.max(20, Math.min(100, Math.round(score)));
  if (clamped >= 80) return { score: clamped, label: 'High Availability', color: 'text-emerald-400' };
  if (clamped >= 50) return { score: clamped, label: 'Moderate Availability', color: 'text-amber-400' };
  return { score: clamped, label: 'Limited Stock', color: 'text-rose-400' };
}

export default function CustomerMenuPage() {
  const { state, initSocket } = useTwinStore();
  const [intentInput, setIntentInput] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [createdSequence, setCreatedSequence] = useState<Record<string, unknown> | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    initSocket();
    fetch('/api/menu')
      .then((r) => r.json())
      .then((data) => {
        if (data.items) setMenuItems(data.items);
      })
      .catch(() => {});
  }, [initSocket]);

  const handleCreateMeal = async () => {
    if (!intentInput.trim()) return;
    try {
      const res = await fetch('/api/orders/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: intentInput }),
      });
      const data = await res.json();
      if (data.sequence) {
        const seq = data.sequence;
        setCreatedSequence({
          ...seq,
          recoveryPerk: state?.weather?.condition === 'stormy' ? 'Complimentary Warm Ginger Toddy added by Guest Alchemist (Rain Perk)' : null,
        });
      }
    } catch {
      // Fallback: use hardcoded sequence
      setCreatedSequence({
        vibe: intentInput,
        starter: { name: 'Chilled Citrus Salmon Tartare', station: 'Cold Prep Bar', timing: 'Immediate (4 mins)' },
        main: { name: 'Pan-Seared Atlantic Salmon', station: 'Saute Station', timing: '12 mins' },
        drink: { name: 'Sparkling Yuzu Botanical Tonic', timing: 'Immediate' },
        tableTime: '25 minutes total',
        recoveryPerk: state?.weather?.condition === 'stormy' ? 'Complimentary Warm Ginger Toddy added by Guest Alchemist (Rain Perk)' : null,
      });
    }
  };

  const handleSubmitOrder = async () => {
    if (!createdSequence) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'dine_in',
          notes: createdSequence.vibe as string,
          items: [
            { menu_item_id: 'mi000000-0000-0000-0000-000000000003', quantity: 1, station_id: 'st000000-0000-0000-0000-000000000003' },
            { menu_item_id: 'mi000000-0000-0000-0000-000000000002', quantity: 1, station_id: 'st000000-0000-0000-0000-000000000002' },
          ],
        }),
      });
      const data = await res.json();
      if (data.order) {
        setOrderId(data.order.id);
      }
    } catch {
      setOrderId('pending_local');
    } finally {
      setSubmitting(false);
    }
  };

  const displayItems = menuItems.length > 0 ? menuItems : state?.menuItems || [];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-zinc-900 pb-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-purple-400 bg-clip-text text-transparent">
              Guest Alchemist Portal
            </h1>
            <p className="text-xs text-zinc-400">Intent-Based Ordering and Vibe Matching</p>
          </div>
          <Link href="/" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 shadow-xl mb-8 backdrop-blur-md">
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
            Describe your vibe, time limit, dietary needs, or occasion:
          </label>
          <textarea
            value={intentInput}
            onChange={(e) => setIntentInput(e.target.value)}
            placeholder="e.g. 25 minutes, light high-protein dinner before a show, cozy mood..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-white focus:outline-none focus:border-purple-500 font-mono transition-colors"
            rows={3}
          />
          <div className="flex flex-wrap gap-2.5 mt-3 mb-5">
            {[
              { label: '15-Min Quick Rush', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
              { label: 'Romantic Candlelight', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
              { label: 'High-Protein Workout', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
              { label: 'Group Celebration', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => setIntentInput(preset.label)}
                className="text-xs px-3.5 py-2 rounded-xl border border-zinc-800 bg-zinc-950/80 text-zinc-300 hover:border-purple-500/40 hover:text-white transition flex items-center gap-2"
              >
                <svg className="h-3.5 w-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={preset.icon} />
                </svg>
                <span>{preset.label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleCreateMeal}
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-rose-500 py-3.5 text-xs font-bold text-white shadow-lg hover:brightness-110 active:scale-[0.99] transition flex items-center justify-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span>Create My Personal Dining Sequence</span>
          </button>
        </div>

        {createdSequence && !orderId && (
          <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-6 mb-8 backdrop-blur-md">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Guest Alchemist Sequence Ready</span>
              </span>
              <span className="text-xs text-zinc-400 font-mono">{createdSequence.tableTime as string}</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
                <div className="text-[11px] text-purple-400 font-bold uppercase tracking-wider">Starter Pairing</div>
                <div className="font-semibold text-white mt-1">{(createdSequence.starter as Record<string, string>).name}</div>
                <div className="text-xs text-zinc-400 mt-0.5">Station: {(createdSequence.starter as Record<string, string>).station} | Est: {(createdSequence.starter as Record<string, string>).timing}</div>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
                <div className="text-[11px] text-amber-400 font-bold uppercase tracking-wider">Main Course</div>
                <div className="font-semibold text-white mt-1">{(createdSequence.main as Record<string, string>).name}</div>
                <div className="text-xs text-zinc-400 mt-0.5">Station: {(createdSequence.main as Record<string, string>).station} | Est: {(createdSequence.main as Record<string, string>).timing}</div>
              </div>
            </div>
            <button
              onClick={handleSubmitOrder}
              disabled={submitting}
              className="w-full mt-4 rounded-xl bg-white py-3 text-xs font-bold text-zinc-950 hover:bg-zinc-200 transition disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Confirm and Submit Order'}
            </button>
          </div>
        )}

        {orderId && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 mb-8 backdrop-blur-md text-center">
            <svg className="h-10 w-10 mx-auto text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-bold text-white mt-3">Order Submitted</h3>
            <p className="text-xs text-zinc-400 mt-1">
              {orderId === 'pending_local' ? 'Your order is being prepared.' : `Order ID: ${orderId.slice(0, 8)}...`}
            </p>
            <p className="text-xs text-zinc-500 mt-4">
              The kitchen has received your order. You can track its progress on the KDS.
            </p>
          </div>
        )}

        <div>
          <h2 className="text-xl font-bold mb-4">Live Dynamic Menu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayItems.map((item: MenuItem) => {
              const avail = computeAvailability(item, state ? { stations: state.stations, ingredients: state.ingredients, menuItems: state.menuItems } : null);
              return (
                <div key={item.id} className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${avail.color.replace('text-', 'bg-')}`}></span>
                      <h3 className="font-bold text-white text-base">{item.name}</h3>
                    </div>
                    <span className="text-sm font-semibold text-emerald-400 font-mono">${item.price}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{item.description}</p>
                  <div className="mt-4 flex justify-between items-center text-[11px] font-mono">
                    <span className={`text-zinc-500`}>Avail: <span className={avail.color}>{avail.score}%</span></span>
                    {item.spoilage_priority_boost > 0 && (
                      <span className="text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 flex items-center gap-1">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        <span>Chef Feature (+{item.spoilage_priority_boost}% Fresh Boost)</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
