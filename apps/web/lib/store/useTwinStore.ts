import { create } from 'zustand';
import { TwinState } from '@maestro/shared';
import { getSocket } from '../socket/client';

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || 'http://localhost:3001';

interface OrderStatusChange {
  orderId: string;
  from: string;
  to: string;
}

interface TwinStore {
  state: TwinState | null;
  isConnected: boolean;
  isCrisisActive: boolean;
  orderStatusChanges: OrderStatusChange[];
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
