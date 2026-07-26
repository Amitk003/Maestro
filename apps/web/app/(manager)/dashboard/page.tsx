'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTwinStore } from '../../../lib/store/useTwinStore';
import { FloorplanVisualizer } from '../../../components/twin/FloorplanVisualizer';
import { AgentFeed } from '../../../components/agents/AgentFeed';
import { MiniTrendChart } from '../../../components/ui/MiniTrendChart';
import { PageTransition } from '../../../components/ui/PageTransition';
import { ErrorBoundary } from '../../../components/ui/ErrorBoundary';
import { KPISkeleton } from '../../../components/ui/Skeleton';
import Link from 'next/link';

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || 'http://localhost:3001';

interface SimulationResult {
  before: Record<string, number>;
  after: Record<string, number>;
  deltas: Record<string, number>;
  recommendations: string[];
}

export default function ManagerDashboardPage() {
  const { state, initSocket, triggerCrisis, orderStatusChanges, clearStatusChanges, metricHistory } = useTwinStore();
  const [whatIfScenario, setWhatIfScenario] = useState('rain_surge');
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [simRunning, setSimRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'orders'>('feed');

  useEffect(() => {
    initSocket();
  }, [initSocket]);

  const handleRunWhatIf = useCallback(async () => {
    setSimRunning(true);
    setSimResult(null);
    try {
      const res = await fetch(`${WORKER_URL}/api/twin/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: whatIfScenario, ticks: 20 }),
      });
      const data = await res.json();
      if (data.deltas) setSimResult(data);
    } catch {
      // fallback: generate locally
      const fallbackRecs: Record<string, string[]> = {
        rain_surge: ['Promote comfort food items on menu', 'Alert kitchen for 25% volume increase', 'Pre-stage 4 extra table settings'],
        grill_outage: ['Reroute grill items to Saute and Cold Prep', 'Promote non-grill features', 'Extend prep times by 8 min'],
        event_rush: ['Assign 2 extra waiters', 'Activate reservation queue', 'Pre-stage dessert prep'],
      };
      setSimResult({
        before: { table_turnover_min: 44, kitchen_bottleneck_pct: 32, guest_delight_score: 4.7, waste_prevented_kg: 4.2, staff_energy_avg: 78 },
        after: { table_turnover_min: 48, kitchen_bottleneck_pct: 55, guest_delight_score: 4.4, waste_prevented_kg: 4.8, staff_energy_avg: 74 },
        deltas: { table_turnover_min: 4, kitchen_bottleneck_pct: 23, guest_delight_score: -0.3, waste_prevented_kg: 0.6, staff_energy_avg: -4 },
        recommendations: fallbackRecs[whatIfScenario] || [],
      });
    } finally {
      setSimRunning(false);
    }
  }, [whatIfScenario]);

  const latestOrders = state?.activeOrders.slice(0, 5) || [];
  const metrics = state?.metrics;

  const chartData = (key: 'table_turnover_min' | 'kitchen_bottleneck_pct' | 'guest_delight_score' | 'waste_prevented_kg' | 'staff_energy_avg') =>
    metricHistory.map((m) => ({ timestamp: m.timestamp, value: m[key] }));

  const isLoading = !state;

  return (
    <ErrorBoundary>
    <PageTransition>
    <div className="min-h-screen bg-zinc-950 text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-zinc-900 pb-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Digital Twin Command Center</h1>
            <p className="text-xs text-zinc-400">Continuous multi-agent swarm simulation and operational control</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={triggerCrisis}
              className="rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:from-rose-500 hover:to-amber-500 transition"
            >
              SIMULATE PEAK HOUR CRISIS
            </button>
            <Link href="/" className="text-xs text-zinc-400 hover:text-white">Back to Home</Link>
          </div>
        </div>

        {/* KPI Cards with Trend Charts */}
        {isLoading ? (
          <KPISkeleton />
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="text-xs text-zinc-400 font-mono">Table Turnover</div>
            <div className="text-2xl font-black text-white mt-1">
              {metrics?.table_turnover_min || 44} <span className="text-xs font-normal text-zinc-400">min</span>
            </div>
            <MiniTrendChart data={chartData('table_turnover_min')} color="#a78bfa" />
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="text-xs text-zinc-400 font-mono">Kitchen Bottleneck</div>
            <div className={`text-2xl font-black mt-1 ${(metrics?.kitchen_bottleneck_pct || 0) > 60 ? 'text-rose-400' : 'text-amber-400'}`}>
              {metrics?.kitchen_bottleneck_pct || 32}%
            </div>
            <MiniTrendChart data={chartData('kitchen_bottleneck_pct')} color="#f59e0b" />
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="text-xs text-zinc-400 font-mono">Waste Prevented</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {metrics?.waste_prevented_kg || 4.2} <span className="text-xs font-normal text-zinc-400">kg</span>
            </div>
            <MiniTrendChart data={chartData('waste_prevented_kg')} color="#10b981" />
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="text-xs text-zinc-400 font-mono">Guest CSAT Score</div>
            <div className="text-2xl font-black text-purple-400 mt-1">
              {metrics?.guest_delight_score || 4.7} <span className="text-xs font-normal text-zinc-400">/ 5</span>
            </div>
            <MiniTrendChart data={chartData('guest_delight_score')} color="#c084fc" />
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="text-xs text-zinc-400 font-mono">Staff Energy Avg</div>
            <div className="text-2xl font-black text-blue-400 mt-1">
              {metrics?.staff_energy_avg || 78}%
            </div>
            <MiniTrendChart data={chartData('staff_energy_avg')} color="#60a5fa" />
          </div>
        </div>
        )}

        {/* Main Grid: Floorplan + Agent Feed / Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-7">
            {state && <FloorplanVisualizer tables={state.tables} stations={state.stations} />}
          </div>
          <div className="lg:col-span-5">
            <div className="flex gap-1 mb-3 bg-zinc-900 rounded-xl p-1 border border-zinc-800">
              <button
                onClick={() => setActiveTab('feed')}
                className={`flex-1 text-xs py-2 rounded-lg font-medium transition ${activeTab === 'feed' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                Agent Feed
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 text-xs py-2 rounded-lg font-medium transition ${activeTab === 'orders' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                Order Status
              </button>
            </div>
            {activeTab === 'feed' && state && <AgentFeed logs={state.agentLogs} />}
            {activeTab === 'orders' && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Live Order Status</h3>
                    <p className="text-xs text-zinc-400">Active orders and status transitions</p>
                  </div>
                  {orderStatusChanges.length > 0 && (
                    <button onClick={clearStatusChanges} className="text-[10px] text-zinc-500 hover:text-white transition">Clear</button>
                  )}
                </div>
                {orderStatusChanges.length > 0 && (
                  <div className="mb-4 space-y-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">Recent Status Changes</span>
                    {orderStatusChanges.map((change, i) => (
                      <div key={i} className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-2 text-xs flex items-center gap-2">
                        <span className="text-emerald-400 font-mono">#{change.orderId.slice(0, 8)}</span>
                        <span className="text-zinc-500">{change.from}</span>
                        <svg className="h-3 w-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                        <span className="text-emerald-400">{change.to}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="space-y-2 max-h-[280px] overflow-y-auto">
                  {latestOrders.length === 0 && <div className="text-xs text-zinc-500 text-center py-8">No active orders</div>}
                  {latestOrders.map((ord) => (
                    <div key={ord.id} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-white">#{ord.id.slice(0, 8)}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-mono ${ord.status === 'in_prep' ? 'bg-amber-500/20 text-amber-400' : ord.status === 'ready' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-500/20 text-zinc-400'}`}>
                          {ord.status}
                        </span>
                      </div>
                      <div className="text-zinc-500 mt-1">Table {ord.table_id} | {ord.items.length} item(s) | {new Date(ord.created_at).toLocaleTimeString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* What-If Simulator */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <h3 className="text-lg font-bold mb-1">Continuous What-If Simulator</h3>
          <p className="text-xs text-zinc-400 mb-4">Run scenarios through the Digital Twin to evaluate agent consensus before changes occur.</p>
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <select
              value={whatIfScenario}
              onChange={(e) => setWhatIfScenario(e.target.value)}
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="rain_surge">Sudden Heavy Rain (+35% Comfort Food Demand)</option>
              <option value="grill_outage">Grill Station Heating Element Failure</option>
              <option value="event_rush">Concert Crowd Surge (40 guests in 15 mins)</option>
            </select>
            <button
              onClick={handleRunWhatIf}
              disabled={simRunning}
              className="rounded-xl bg-white px-6 py-2.5 text-xs font-bold text-black hover:bg-zinc-200 transition disabled:opacity-50"
            >
              {simRunning ? 'Running...' : 'Run Simulation'}
            </button>
          </div>

          {simResult && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Before/After Comparison */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <h4 className="text-sm font-bold text-white mb-3">KPI Impact Analysis</h4>
                <div className="space-y-2 text-xs">
                  {Object.entries(simResult.deltas).map(([key, delta]) => {
                    const label = key.replace(/_/g, ' ');
                    const isPositive = delta >= 0;
                    const color = key === 'kitchen_bottleneck_pct' || key === 'table_turnover_min'
                      ? (isPositive ? 'text-rose-400' : 'text-emerald-400')
                      : (isPositive ? 'text-emerald-400' : 'text-rose-400');
                    return (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-zinc-400 capitalize">{label}</span>
                        <span className={`font-mono font-bold ${color}`}>
                          {isPositive ? '+' : ''}{typeof delta === 'number' ? delta.toFixed(1) : delta}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommendations */}
              <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
                <h4 className="text-sm font-bold text-purple-300 mb-3">Maestro Swarm Recommendations</h4>
                <ul className="space-y-2">
                  {simResult.recommendations.map((rec, i) => (
                    <li key={i} className="text-xs text-purple-200 flex items-start gap-2">
                      <span className="text-purple-400 mt-0.5">&#8226;</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </PageTransition>
    </ErrorBoundary>
  );
}
