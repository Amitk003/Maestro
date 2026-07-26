import { TwinState, AgentLog, StaffTask } from '@maestro/shared';
import { createInitialTwinState } from './initialState';
import { propose as guestAlchemistPropose } from '../agents/guest-alchemist';
import { propose as kitchenConductorPropose } from '../agents/kitchen-conductor';
import { propose as inventoryGuardianPropose } from '../agents/inventory-guardian';
import { propose as staffHarmonyPropose } from '../agents/staff-harmony';
import { propose as demandSeerPropose } from '../agents/demand-seer';
import { resolve as orchestratorResolve } from '../agents/orchestrator';

export type MetricSnapshot = {
  timestamp: string;
  table_turnover_min: number;
  kitchen_bottleneck_pct: number;
  guest_delight_score: number;
  waste_prevented_kg: number;
  staff_energy_avg: number;
};

export interface SimulationResult {
  before: MetricSnapshot;
  after: MetricSnapshot;
  deltas: {
    table_turnover_min: number;
    kitchen_bottleneck_pct: number;
    guest_delight_score: number;
    waste_prevented_kg: number;
    staff_energy_avg: number;
  };
  recommendations: string[];
}

export class DigitalTwinEngine {
  private state: TwinState;
  private tickCount = 0;
  private metricHistory: MetricSnapshot[] = [];
  public crisisPhase = -1;
  public crisisActive = false;

  constructor() {
    this.state = createInitialTwinState();
    this.recordMetrics();
  }

  public getState(): TwinState {
    return this.state;
  }

  public getMetricHistory(): MetricSnapshot[] {
    return this.metricHistory;
  }

  private recordMetrics() {
    this.metricHistory.push({
      timestamp: this.state.timestamp,
      table_turnover_min: this.state.metrics.table_turnover_min,
      kitchen_bottleneck_pct: this.state.metrics.kitchen_bottleneck_pct,
      guest_delight_score: this.state.metrics.guest_delight_score,
      waste_prevented_kg: this.state.metrics.waste_prevented_kg,
      staff_energy_avg: this.state.metrics.staff_energy_avg,
    });
    if (this.metricHistory.length > 60) {
      this.metricHistory = this.metricHistory.slice(-60);
    }
  }

  public tick(): { state: TwinState; newLogs: AgentLog[]; newTasks: StaffTask[] } {
    this.state.timestamp = new Date().toISOString();
    this.tickCount++;

    // 1. Decay ingredients freshness slightly
    this.state.ingredients = this.state.ingredients.map((ing) => {
      const freshness_pct = Math.max(0, ing.freshness_pct - 0.2);
      return { ...ing, freshness_pct };
    });

    // 2. Adjust station heat indices based on active order load
    this.state.stations = this.state.stations.map((st) => {
      const stationOrders = this.state.activeOrders.filter((o) =>
        o.items.some((i) => i.station_id === st.id && i.status === 'in_prep')
      ).length;
      const heat_index = Math.min(100, Math.max(10, stationOrders * 20 + 10));
      return { ...st, heat_index, current_queue_depth: Math.max(st.current_queue_depth, stationOrders) };
    });

    // 3. Dynamic metric fluctuations
    this.state.metrics.waste_prevented_kg = parseFloat(
      (this.state.metrics.waste_prevented_kg + 0.05).toFixed(2)
    );
    this.state.metrics.kitchen_bottleneck_pct = Math.min(100, this.state.metrics.kitchen_bottleneck_pct + (Math.random() * 2 - 1));
    this.state.metrics.guest_delight_score = Math.min(5, Math.max(1, this.state.metrics.guest_delight_score + (Math.random() * 0.1 - 0.05)));

    this.recordMetrics();

    // 4. Run agent proposals every 3 ticks (15s) to avoid flooding logs
    if (this.tickCount % 3 === 0) {
      return this.runAgentCycle();
    }

    return { state: this.state, newLogs: [], newTasks: [] };
  }

  public simulate(scenario: string, ticks: number = 20): SimulationResult {
    const before = this.metricHistory[this.metricHistory.length - 1] || this.getSnapshot();
    const simState = JSON.parse(JSON.stringify(this.state)) as TwinState;

    // Apply perturbation
    switch (scenario) {
      case 'rain_surge':
        simState.weather = { condition: 'rainy', temp_celsius: 8, description: 'Sudden heavy rain' };
        simState.metrics.kitchen_bottleneck_pct = Math.min(100, simState.metrics.kitchen_bottleneck_pct + 30);
        break;
      case 'grill_outage':
        const grill = simState.stations.find((s) => s.id === 'ST_GRILL');
        if (grill) { grill.heat_index = 0; grill.current_queue_depth = 0; }
        simState.metrics.kitchen_bottleneck_pct = Math.min(100, simState.metrics.kitchen_bottleneck_pct + 45);
        break;
      case 'event_rush':
        simState.tables = simState.tables.map((t) =>
          t.status === 'vacant' ? { ...t, status: 'seated' as const, active_session_id: `SIM_${t.id}` } : t
        );
        simState.metrics.table_turnover_min += 15;
        break;
    }

    // Run simulation ticks
    for (let i = 0; i < ticks; i++) {
      simState.ingredients = simState.ingredients.map((ing) => ({
        ...ing, freshness_pct: Math.max(0, ing.freshness_pct - 0.5),
      }));
      simState.metrics.waste_prevented_kg = parseFloat((simState.metrics.waste_prevented_kg + 0.03).toFixed(2));
      simState.metrics.kitchen_bottleneck_pct = Math.min(100, Math.max(0,
        simState.metrics.kitchen_bottleneck_pct + (Math.random() * 4 - 2)
      ));
    }

    const after = this.getSnapshotFrom(simState);
    const deltas = {
      table_turnover_min: parseFloat((after.table_turnover_min - before.table_turnover_min).toFixed(1)),
      kitchen_bottleneck_pct: parseFloat((after.kitchen_bottleneck_pct - before.kitchen_bottleneck_pct).toFixed(1)),
      guest_delight_score: parseFloat((after.guest_delight_score - before.guest_delight_score).toFixed(2)),
      waste_prevented_kg: parseFloat((after.waste_prevented_kg - before.waste_prevented_kg).toFixed(2)),
      staff_energy_avg: parseFloat((after.staff_energy_avg - before.staff_energy_avg).toFixed(1)),
    };

    const recommendations = this.generateRecommendations(scenario, deltas);

    return { before, after, deltas, recommendations };
  }

  private generateRecommendations(scenario: string, deltas: SimulationResult['deltas']): string[] {
    const recs: string[] = [];
    if (scenario === 'rain_surge') {
      recs.push('Promote comfort food items on menu (soup, risotto, warm dishes)');
      recs.push('Alert kitchen for 25% volume increase preparation');
      recs.push('Pre-stage 4 extra table settings in main and bar zones');
      if (deltas.kitchen_bottleneck_pct > 10) recs.push('Reroute cold-prep items away from overloaded saute station');
    } else if (scenario === 'grill_outage') {
      recs.push('Reroute all grill items to Saute station and Cold Prep');
      recs.push('Promote Cold Salmon Tartare and non-grill starters as Chef Features');
      recs.push('Extend estimated prep times by 8 minutes for affected orders');
      if (deltas.guest_delight_score < -0.3) recs.push('Authorize complimentary amuse-bouche for delayed tables');
    } else if (scenario === 'event_rush') {
      recs.push('Assign 2 additional waiters to main floor for next 90 minutes');
      recs.push('Activate reservation queue and notify waiting guests of 5-min delay');
      recs.push('Pre-stage dessert prep at Pastry station');
    }
    return recs;
  }

  private getSnapshot(): MetricSnapshot {
    return {
      timestamp: this.state.timestamp,
      table_turnover_min: this.state.metrics.table_turnover_min,
      kitchen_bottleneck_pct: this.state.metrics.kitchen_bottleneck_pct,
      guest_delight_score: this.state.metrics.guest_delight_score,
      waste_prevented_kg: this.state.metrics.waste_prevented_kg,
      staff_energy_avg: this.state.metrics.staff_energy_avg,
    };
  }

  private getSnapshotFrom(s: TwinState): MetricSnapshot {
    return {
      timestamp: s.timestamp,
      table_turnover_min: s.metrics.table_turnover_min,
      kitchen_bottleneck_pct: s.metrics.kitchen_bottleneck_pct,
      guest_delight_score: s.metrics.guest_delight_score,
      waste_prevented_kg: s.metrics.waste_prevented_kg,
      staff_energy_avg: s.metrics.staff_energy_avg,
    };
  }

  private runAgentCycle(): { state: TwinState; newLogs: AgentLog[]; newTasks: StaffTask[] } {
    const allProposals: AgentLog[] = [
      ...guestAlchemistPropose(this.state),
      ...kitchenConductorPropose(this.state),
      ...inventoryGuardianPropose(this.state),
      ...demandSeerPropose(this.state),
    ];

    const staffResult = staffHarmonyPropose(this.state);
    allProposals.push(...staffResult.logs);

    // Orchestrator resolves conflicts
    const resolvedLogs = orchestratorResolve(allProposals);

    // Apply accepted proposals to state
    for (const log of resolvedLogs) {
      if (log.status === 'accepted') {
        if (log.agent_name === 'inventory_guardian' && log.action_type === 'spoilage_salvage') {
          const menuItemName = (log.proposal as Record<string, unknown>).menu_item as string;
          this.state.menuItems = this.state.menuItems.map((m) =>
            m.name === menuItemName
              ? { ...m, spoilage_priority_boost: 25 }
              : m
          );
        }
      }
    }

    this.state.agentLogs = [...resolvedLogs, ...this.state.agentLogs].slice(0, 50);
    this.state.staffTasks = [...staffResult.tasks, ...this.state.staffTasks].slice(0, 20);

    return { state: this.state, newLogs: resolvedLogs, newTasks: staffResult.tasks };
  }

  public triggerCrisis(): { state: TwinState; newLogs: AgentLog[]; newTasks: StaffTask[]; phase: number } {
    this.crisisActive = true;
    this.crisisPhase = 0;
    const timestamp = new Date().toISOString();

    // Phase 0: Environment degrades
    this.state.weather = {
      condition: 'stormy',
      temp_celsius: 9,
      description: 'Heavy thunderstorm approaching - stadium event ending!',
    };
    const grill = this.state.stations.find((s) => s.id === 'ST_GRILL');
    if (grill) { grill.heat_index = 82; grill.current_queue_depth = 10; }
    const salmon = this.state.ingredients.find((i) => i.id === 'ING_SALMON');
    if (salmon) { salmon.freshness_pct = 35; }

    const phase0Log: AgentLog = {
      id: `CRISIS_P0_${Date.now()}`,
      agent_name: 'demand_seer',
      action_type: 'crisis_detected',
      target_entity: 'RESTAURANT_GLOBAL',
      proposal: { action: 'Crisis detected', reason: 'Storm + event surge inbound. 82% grill load, Salmon at 35%.' },
      utility_score: 9.9,
      status: 'proposed',
      created_at: timestamp,
    };
    this.state.agentLogs = [phase0Log, ...this.state.agentLogs];

    return { state: this.state, newLogs: [phase0Log], newTasks: [], phase: 0 };
  }

  public advanceCrisis(): { state: TwinState; newLogs: AgentLog[]; newTasks: StaffTask[]; phase: number; resolved: boolean } {
    const timestamp = new Date().toISOString();
    this.crisisPhase++;
    const phase = this.crisisPhase;

    if (phase === 1) {
      // Phase 1: Agents detect and propose
      const grill = this.state.stations.find((s) => s.id === 'ST_GRILL');
      if (grill) { grill.heat_index = 94; grill.current_queue_depth = 12; }
      const sal = this.state.ingredients.find((i) => i.id === 'ING_SALMON');
      if (sal) { sal.freshness_pct = 28; }
      this.state.metrics.kitchen_bottleneck_pct = 72;

      const log1: AgentLog = {
        id: `CRISIS_P1_${Date.now()}`,
        agent_name: 'inventory_guardian',
        action_type: 'spoilage_alert',
        target_entity: 'ING_SALMON',
        proposal: { action: 'Salmon spoilage critical', reason: 'Salmon at 28% freshness. Promote Cold Salmon Tartare immediately to salvage 2.8kg.' },
        utility_score: 9.2,
        status: 'proposed',
        created_at: timestamp,
      };
      const log2: AgentLog = {
        id: `CRISIS_P1b_${Date.now()}`,
        agent_name: 'kitchen_conductor',
        action_type: 'bottleneck_detected',
        target_entity: 'ST_GRILL',
        proposal: { action: 'Grill overload detected', reason: 'Grill at 94% heat. Reroute 3 salmon dishes to Cold Prep Bar.' },
        utility_score: 9.5,
        status: 'proposed',
        created_at: timestamp,
      };

      this.state.agentLogs = [log2, log1, ...this.state.agentLogs];
      return { state: this.state, newLogs: [log1, log2], newTasks: [], phase: 1, resolved: false };
    }

    if (phase === 2) {
      // Phase 2: Orchestrator resolves
      const log3: AgentLog = {
        id: `CRISIS_P2_${Date.now()}`,
        agent_name: 'maestro_orchestrator',
        action_type: 'global_optimum_consensus',
        target_entity: 'RESTAURANT_GLOBAL',
        proposal: {
          consensus: 'Approved Cold Salmon Tartare morph & Grill reroute. Global score +14.2%.',
          weighted_outcomes: { guest: +0.18, kitchen: +0.22, waste: +0.35 },
        },
        utility_score: 9.9,
        status: 'accepted',
        created_at: timestamp,
      };
      this.state.agentLogs = [log3, ...this.state.agentLogs];

      // Apply orchestrator actions
      this.state.menuItems = this.state.menuItems.map((m) =>
        m.name.includes('Salmon Tartare') ? { ...m, spoilage_priority_boost: 30 } : m
      );

      const crisisTask: StaffTask = {
        id: `TASK_CRISIS_${Date.now()}`,
        title: 'Move Table 4 & Serve Cold Salmon Amuse-Bouche',
        description: 'Kitchen Conductor rerouted Grill load; Guest Alchemist authorized free perk for delayed tables.',
        urgency: 'critical',
        target_table_id: 'T4',
        target_station_id: 'ST_COLD',
        status: 'pending',
        created_at: timestamp,
      };
      this.state.staffTasks = [crisisTask, ...this.state.staffTasks];

      return { state: this.state, newLogs: [log3], newTasks: [crisisTask], phase: 2, resolved: false };
    }

    if (phase === 3) {
      // Phase 3: Recovery - global score recovers
      const grill = this.state.stations.find((s) => s.id === 'ST_GRILL');
      if (grill) { grill.heat_index = 55; grill.current_queue_depth = 4; }
      this.state.metrics.kitchen_bottleneck_pct = 38;
      this.state.metrics.waste_prevented_kg = parseFloat((this.state.metrics.waste_prevented_kg + 3.2).toFixed(2));
      this.state.metrics.guest_delight_score = Math.min(5, this.state.metrics.guest_delight_score + 0.3);

      const log4: AgentLog = {
        id: `CRISIS_P3_${Date.now()}`,
        agent_name: 'maestro_orchestrator',
        action_type: 'crisis_resolved',
        target_entity: 'RESTAURANT_GLOBAL',
        proposal: {
          action: 'Crisis resolved',
          reason: 'All agents reached consensus. Grill load normalized to 55%, 3.2kg waste salvaged, guest score recovering.',
          global_score_delta: '+14.2%',
        },
        utility_score: 10.0,
        status: 'accepted',
        created_at: timestamp,
      };
      this.state.agentLogs = [log4, ...this.state.agentLogs];

      this.crisisActive = false;
      this.crisisPhase = -1;

      return { state: this.state, newLogs: [log4], newTasks: [], phase: 3, resolved: true };
    }

    return { state: this.state, newLogs: [], newTasks: [], phase, resolved: true };
  }

  public resolveTask(taskId: string): TwinState {
    this.state.staffTasks = this.state.staffTasks.map((t) =>
      t.id === taskId ? { ...t, status: 'completed' } : t
    );
    this.state.metrics.guest_delight_score = Math.min(
      5.0,
      parseFloat((this.state.metrics.guest_delight_score + 0.1).toFixed(1))
    );
    return this.state;
  }
}
