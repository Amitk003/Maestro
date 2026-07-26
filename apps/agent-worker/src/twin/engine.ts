import { TwinState, AgentLog, StaffTask } from '@maestro/shared';
import { createInitialTwinState } from './initialState';
import { propose as guestAlchemistPropose } from '../agents/guest-alchemist';
import { propose as kitchenConductorPropose } from '../agents/kitchen-conductor';
import { propose as inventoryGuardianPropose } from '../agents/inventory-guardian';
import { propose as staffHarmonyPropose } from '../agents/staff-harmony';
import { propose as demandSeerPropose } from '../agents/demand-seer';
import { resolve as orchestratorResolve } from '../agents/orchestrator';

export class DigitalTwinEngine {
  private state: TwinState;
  private tickCount = 0;

  constructor() {
    this.state = createInitialTwinState();
  }

  public getState(): TwinState {
    return this.state;
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

    // 4. Run agent proposals every 3 ticks (15s) to avoid flooding logs
    if (this.tickCount % 3 === 0) {
      return this.runAgentCycle();
    }

    return { state: this.state, newLogs: [], newTasks: [] };
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

  public triggerCrisis(): { state: TwinState; newLogs: AgentLog[]; newTasks: StaffTask[] } {
    // 1. Spike Grill station to overload & change weather to stormy
    this.state.weather = {
      condition: 'stormy',
      temp_celsius: 9,
      description: 'Heavy thunderstorm + Stadium crowd arrival spike!',
    };

    const grill = this.state.stations.find((s) => s.id === 'ST_GRILL');
    if (grill) {
      grill.heat_index = 98;
      grill.current_queue_depth = 14;
    }

    // 2. Mark Atlantic Salmon as critical spoilage risk
    const salmon = this.state.ingredients.find((i) => i.id === 'ING_SALMON');
    if (salmon) {
      salmon.freshness_pct = 22;
    }

    // 3. Inject Agent Proposals & Orchestrator Consensus
    const crisisLog1: AgentLog = {
      id: `CRISIS_LOG_${Date.now()}_1`,
      agent_name: 'inventory_guardian',
      action_type: 'menu_morph_spoilage_salvage',
      target_entity: 'ING_SALMON',
      proposal: {
        action: 'Promote Cold Salmon Tartare (Station: COLD)',
        reason: 'Salmon at 22% freshness - salvage 3.5kg before expiry',
        spoilage_salvage_kg: 3.5,
      },
      utility_score: 9.4,
      status: 'accepted',
      created_at: new Date().toISOString(),
    };

    const crisisLog2: AgentLog = {
      id: `CRISIS_LOG_${Date.now()}_2`,
      agent_name: 'kitchen_conductor',
      action_type: 'grill_bottleneck_reroute',
      target_entity: 'ST_GRILL',
      proposal: {
        action: 'Reroute 4 fish mains from Grill to Cold Prep Bar',
        reason: 'Grill heat index at 98%. Rerouting drops grill latency by 14 mins.',
      },
      utility_score: 9.7,
      status: 'accepted',
      created_at: new Date().toISOString(),
    };

    const crisisLog3: AgentLog = {
      id: `CRISIS_LOG_${Date.now()}_3`,
      agent_name: 'maestro_orchestrator',
      action_type: 'global_optimum_consensus',
      target_entity: 'RESTAURANT_GLOBAL',
      proposal: {
        consensus: 'Approved Cold Salmon Tartare morph & Grill reroute',
        global_score_delta: '+14.2%',
        weighted_outcomes: { guest: +0.18, kitchen: +0.22, waste: +0.35 },
      },
      utility_score: 9.9,
      status: 'accepted',
      created_at: new Date().toISOString(),
    };

    // 4. Inject Proactive Staff Action Task
    const crisisTask: StaffTask = {
      id: `TASK_${Date.now()}`,
      title: 'Move Table 4 & Serve Cold Salmon Amuse-Bouche',
      description: 'Kitchen Conductor rerouted Grill load; Guest Alchemist authorized free perk.',
      urgency: 'critical',
      target_table_id: 'T4',
      target_station_id: 'ST_COLD',
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    this.state.agentLogs = [crisisLog3, crisisLog2, crisisLog1, ...this.state.agentLogs];
    this.state.staffTasks = [crisisTask, ...this.state.staffTasks];
    this.state.metrics.kitchen_bottleneck_pct = 88;

    return { state: this.state, newLogs: [crisisLog1, crisisLog2, crisisLog3], newTasks: [crisisTask] };
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
