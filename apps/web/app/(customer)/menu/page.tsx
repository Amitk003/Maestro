'use client';

import React, { useState, useEffect } from 'react';
import { useTwinStore } from '../../../lib/store/useTwinStore';
import Link from 'next/link';

export default function CustomerMenuPage() {
  const { state, initSocket } = useTwinStore();
  const [intentInput, setIntentInput] = useState('');
  const [createdSequence, setCreatedSequence] = useState<any>(null);

  useEffect(() => {
    initSocket();
  }, [initSocket]);

  const handleCreateMeal = () => {
    if (!intentInput.trim()) return;
    // Simulate Guest Alchemist Agent Dining Sequence Generation
    setCreatedSequence({
      vibe: intentInput,
      starter: { name: 'Chilled Citrus Salmon Tartare', station: 'Cold Prep Bar', timing: 'Immediate (4 mins)' },
      main: { name: 'Pan-Seared Atlantic Salmon', station: 'Saute Station', timing: '12 mins' },
      drink: { name: 'Sparkling Yuzu Botanical Tonic', timing: 'Immediate' },
      tableTime: '25 minutes total',
      recoveryPerk: state?.weather.condition === 'stormy' ? 'Complimentary Warm Ginger Toddy added by Guest Alchemist (Rain Perk)' : null,
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-zinc-900 pb-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Guest Alchemist Portal</h1>
            <p className="text-xs text-zinc-400">Intent-Based Ordering & Vibe Matching</p>
          </div>
          <Link href="/" className="text-xs text-zinc-400 hover:text-white">← Home</Link>
        </div>

        {/* Intent Vibe Box */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-xl mb-8">
          <label className="block text-sm font-semibold text-zinc-200 mb-2">
            Describe your vibe, time limit, dietary needs, or occasion:
          </label>
          <textarea
            value={intentInput}
            onChange={(e) => setIntentInput(e.target.value)}
            placeholder="e.g. 25 minutes, light high-protein dinner before a show, cozy mood..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
            rows={3}
          />
          <div className="flex flex-wrap gap-2 mt-3 mb-4">
            {['⚡ 15-Min Quick Rush', '🍷 Romantic Candlelight', '🥗 High-Protein Workout', '🎉 Group Celebration'].map((preset) => (
              <button
                key={preset}
                onClick={() => setIntentInput(preset)}
                className="text-xs px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700 hover:text-white transition"
              >
                {preset}
              </button>
            ))}
          </div>

          <button
            onClick={handleCreateMeal}
            className="w-full rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 py-3 text-sm font-bold text-white shadow-lg hover:from-rose-500 hover:to-amber-500 transition"
          >
            ✨ Crate My Personal Dining Sequence
          </button>
        </div>

        {/* Personalized Dining Sequence Result */}
        {createdSequence && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6 mb-8 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Guest Alchemist Sequence Ready
              </span>
              <span className="text-xs text-zinc-400 font-mono">{createdSequence.tableTime}</span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
                <div className="text-xs text-purple-400 font-bold uppercase">Starter Pairing</div>
                <div className="font-semibold text-white mt-0.5">{createdSequence.starter.name}</div>
                <div className="text-xs text-zinc-400">Station: {createdSequence.starter.station} | Est: {createdSequence.starter.timing}</div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
                <div className="text-xs text-amber-400 font-bold uppercase">Main Course</div>
                <div className="font-semibold text-white mt-0.5">{createdSequence.main.name}</div>
                <div className="text-xs text-zinc-400">Station: {createdSequence.main.station} | Est: {createdSequence.main.timing}</div>
              </div>

              {createdSequence.recoveryPerk && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 font-medium">
                  🎁 {createdSequence.recoveryPerk}
                </div>
              )}
            </div>

            <button className="w-full mt-4 rounded-xl bg-white py-2.5 text-xs font-bold text-black hover:bg-zinc-200 transition">
              Confirm & Submit Order
            </button>
          </div>
        )}

        {/* Smart Dynamic Menu */}
        <div>
          <h2 className="text-xl font-bold mb-4">Live Dynamic Menu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state?.menuItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-white text-sm">{item.name}</h3>
                  <span className="text-sm font-semibold text-emerald-400">${item.price}</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">{item.description}</p>
                <div className="mt-3 flex justify-between items-center text-[10px] font-mono">
                  <span className="text-zinc-500">Base Prep: {item.base_prep_minutes}m</span>
                  {item.spoilage_priority_boost > 0 && (
                    <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      ★ Chef Feature (+{item.spoilage_priority_boost}% Fresh Boost)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
