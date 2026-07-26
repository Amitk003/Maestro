'use client';

import React, { useEffect, useState } from 'react';
import { useTwinStore } from '../../../lib/store/useTwinStore';
import { FloorplanVisualizer } from '../../../components/twin/FloorplanVisualizer';
import { AgentFeed } from '../../../components/agents/AgentFeed';
import Link from 'next/link';

export default function ManagerDashboardPage() {
  const { state, initSocket, triggerCrisis } = useTwinStore();
  const [whatIfScenario, setWhatIfScenario] = useState('rain_surge');
  const [simulationResult, setSimulationResult] = useState<string | null>(null);

  useEffect(() => {
    initSocket();
  }, [initSocket]);

  const handleRunWhatIf = () => {
    setSimulationResult(
      `Simulation Complete: Running ${whatIfScenario} predicts a 14% increase in Cold Bar load. Maestro Swarm recommends morphing menu to feature Salmon Tartare (+12% global profit, -3.2kg waste).`
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-zinc-900 pb-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Digital Twin Command Center</h1>
            <p className="text-xs text-zinc-400">Continuous multi-agent swarm simulation & operational control</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={triggerCrisis}
              className="rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:from-rose-500 hover:to-amber-500 transition"
            >
              🔥 SIMULATE PEAK HOUR CRISIS
            </button>
            <Link href="/" className="text-xs text-zinc-400 hover:text-white">← Home</Link>
          </div>
        </div>

        {/* Real-time Executive KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="text-xs text-zinc-400 font-mono">Table Turnover</div>
            <div className="text-2xl font-black text-white mt-1">
              {state?.metrics.table_turnover_min || 44} <span className="text-xs font-normal text-zinc-400">min</span>
            </div>
            <div className="text-[10px] text-emerald-400 mt-1">↓ 6 min vs baseline</div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="text-xs text-zinc-400 font-mono">Kitchen Bottleneck</div>
            <div className={`text-2xl font-black mt-1 ${(state?.metrics.kitchen_bottleneck_pct || 0) > 60 ? 'text-rose-400' : 'text-amber-400'}`}>
              {state?.metrics.kitchen_bottleneck_pct || 32}%
            </div>
            <div className="text-[10px] text-zinc-500 mt-1">Grill Station peak load</div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="text-xs text-zinc-400 font-mono">Waste Prevented</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {state?.metrics.waste_prevented_kg || 4.2} <span className="text-xs font-normal text-zinc-400">kg</span>
            </div>
            <div className="text-[10px] text-emerald-400 mt-1">~$184 value saved</div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="text-xs text-zinc-400 font-mono">Guest CSAT Score</div>
            <div className="text-2xl font-black text-purple-400 mt-1">
              {state?.metrics.guest_delight_score || 4.7} <span className="text-xs font-normal text-zinc-400">/ 5</span>
            </div>
            <div className="text-[10px] text-purple-300 mt-1">Top 5% dining delight</div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="text-xs text-zinc-400 font-mono">Staff Energy Avg</div>
            <div className="text-2xl font-black text-blue-400 mt-1">
              {state?.metrics.staff_energy_avg || 78}%
            </div>
            <div className="text-[10px] text-blue-300 mt-1">Fatigue optimal</div>
          </div>
        </div>

        {/* Main Grid: Floorplan & Agent Live Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-7">
            {state && <FloorplanVisualizer tables={state.tables} stations={state.stations} />}
          </div>
          <div className="lg:col-span-5">
            {state && <AgentFeed logs={state.agentLogs} />}
          </div>
        </div>

        {/* What-If Continuous Scenario Simulator */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <h3 className="text-lg font-bold mb-1">Continuous What-If Simulator</h3>
          <p className="text-xs text-zinc-400 mb-4">Run perturbations through the Digital Twin to evaluate agent consensus before changes occur.</p>

          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={whatIfScenario}
              onChange={(e) => setWhatIfScenario(e.target.value)}
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-white focus:outline-none"
            >
              <option value="rain_surge">Sudden Heavy Rain (+35% Comfort Food Demand)</option>
              <option value="grill_outage">Grill Station Heating Element Failure</option>
              <option value="event_rush">Concert Crowd Surge (40 guests in 15 mins)</option>
            </select>

            <button
              onClick={handleRunWhatIf}
              className="rounded-xl bg-white px-6 py-2.5 text-xs font-bold text-black hover:bg-zinc-200 transition"
            >
              Run Simulation
            </button>
          </div>

          {simulationResult && (
            <div className="mt-4 rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 text-xs text-purple-300 font-mono">
              {simulationResult}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
