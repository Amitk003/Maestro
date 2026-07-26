import { create } from 'zustand';
import { TwinState } from '@maestro/shared';
import { getSocket } from '../socket/client';

interface TwinStore {
  state: TwinState | null;
  isConnected: boolean;
  isCrisisActive: boolean;
  initSocket: () => void;
  triggerCrisis: () => void;
  resolveTask: (taskId: string) => void;
}

export const useTwinStore = create<TwinStore>((set, get) => ({
  state: null,
  isConnected: false,
  isCrisisActive: false,

  initSocket: () => {
    if (typeof window === 'undefined') return;
    const socket = getSocket();

    socket.on('connect', () => set({ isConnected: true }));
    socket.on('disconnect', () => set({ isConnected: false }));

    socket.on('twin:state_update', (newState: TwinState) => {
      set({ state: newState });
    });

    socket.on('crisis:alert', () => {
      set({ isCrisisActive: true });
      setTimeout(() => set({ isCrisisActive: false }), 8000);
    });
  },

  triggerCrisis: () => {
    const socket = getSocket();
    socket.emit('crisis:trigger');
    fetch('http://localhost:3001/api/crisis/trigger', { method: 'POST' }).catch(() => {});
  },

  resolveTask: (taskId: string) => {
    const socket = getSocket();
    socket.emit('task:complete', { taskId });
    fetch(`http://localhost:3001/api/staff/tasks/${taskId}/action`, { method: 'POST' }).catch(() => {});

    const currentState = get().state;
    if (currentState) {
      const updatedTasks = currentState.staffTasks.map((t) =>
        t.id === taskId ? { ...t, status: 'completed' as const } : t
      );
      set({ state: { ...currentState, staffTasks: updatedTasks } });
    }
  },
}));
