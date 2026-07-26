import { create } from 'zustand';
import { TwinState, AgentLog, StaffTask } from '@maestro/shared';
import { getSocket } from '../socket/client';

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || 'http://localhost:3001';

interface OrderStatusChange {
  orderId: string;
  from: string;
  to: string;
}

export interface MetricSnapshot {
  timestamp: string;
  table_turnover_min: number;
  kitchen_bottleneck_pct: number;
  guest_delight_score: number;
  waste_prevented_kg: number;
  staff_energy_avg: number;
}

interface TwinStore {
  state: TwinState | null;
  isConnected: boolean;
  isCrisisActive: boolean;
  orderStatusChanges: OrderStatusChange[];
  latestProposals: AgentLog[];
  metricHistory: MetricSnapshot[];
  initSocket: () => void;
  triggerCrisis: () => void;
  resolveTask: (taskId: string) => void;
  clearStatusChanges: () => void;
}

export const useTwinStore = create<TwinStore>((set, get) => ({
  state: null,
  isConnected: false,
  isCrisisActive: false,
  orderStatusChanges: [],
  latestProposals: [],
  metricHistory: [],

  initSocket: () => {
    if (typeof window === 'undefined') return;
    const socket = getSocket();

    socket.on('connect', () => set({ isConnected: true }));
    socket.on('disconnect', () => set({ isConnected: false }));

    socket.on('twin:state_update', (newState: TwinState) => {
      set({ state: newState });
    });

    socket.on('order:status_change', (change: OrderStatusChange) => {
      const current = get().orderStatusChanges;
      set({ orderStatusChanges: [change, ...current].slice(0, 20) });
    });

    socket.on('agent:proposal', (proposals: AgentLog[]) => {
      set({ latestProposals: proposals });
    });

    socket.on('staff:new_tasks', () => {
      // New tasks will be picked up on next state update;
      // the KDS/tasks pages also poll independently
    });

    socket.on('metrics:history', (history: MetricSnapshot[]) => {
      set({ metricHistory: history });
    });

    socket.on('crisis:alert', () => {
      set({ isCrisisActive: true });
      setTimeout(() => set({ isCrisisActive: false }), 8000);
    });
  },

  triggerCrisis: () => {
    const socket = getSocket();
    socket.emit('crisis:trigger');
    fetch(`${WORKER_URL}/api/crisis/trigger`, { method: 'POST' }).catch(() => {});
  },

  resolveTask: (taskId: string) => {
    const socket = getSocket();
    socket.emit('task:complete', { taskId });
    fetch(`${WORKER_URL}/api/staff/tasks/${taskId}/action`, { method: 'POST' }).catch(() => {});

    const currentState = get().state;
    if (currentState) {
      const updatedTasks = currentState.staffTasks.map((t) =>
        t.id === taskId ? { ...t, status: 'completed' as const } : t
      );
      set({ state: { ...currentState, staffTasks: updatedTasks } });
    }
  },

  clearStatusChanges: () => {
    set({ orderStatusChanges: [] });
  },
}));
