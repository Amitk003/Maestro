import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { DigitalTwinEngine } from './twin/engine';
import { syncOrders } from './supabase/sync';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT'],
  },
});

const twinEngine = new DigitalTwinEngine();

// REST endpoints
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'maestro-agent-worker', timestamp: new Date().toISOString() });
});

app.get('/api/twin/state', (_req, res) => {
  res.json(twinEngine.getState());
});

app.post('/api/crisis/trigger', (_req, res) => {
  const result = twinEngine.triggerCrisis();
  io.emit('twin:state_update', result.state);
  io.emit('agent:proposal', result.newLogs);
  io.emit('staff:new_tasks', result.newTasks);
  io.emit('crisis:alert', { message: 'Crisis Alert: Peak Hour Crisis Simulated! Multi-Agent Swarm activated.' });
  res.json({ success: true, state: result.state });
});

app.post('/api/staff/tasks/:id/action', (req, res) => {
  const { id } = req.params;
  const state = twinEngine.resolveTask(id);
  io.emit('twin:state_update', state);
  res.json({ success: true, state });
});

// Socket.io Telemetry & Real-time Events
io.on('connection', (socket) => {
  console.log(`[Agent-Worker] Client connected: ${socket.id}`);

  // Emit immediate twin snapshot on connect
  socket.emit('twin:state_update', twinEngine.getState());

  socket.on('crisis:trigger', () => {
    const result = twinEngine.triggerCrisis();
    io.emit('twin:state_update', result.state);
    io.emit('agent:proposal', result.newLogs);
    io.emit('staff:new_tasks', result.newTasks);
    io.emit('crisis:alert', { message: 'Crisis Alert: Peak Hour Crisis Simulated!' });
  });

  socket.on('task:complete', (data: { taskId: string }) => {
    const state = twinEngine.resolveTask(data.taskId);
    io.emit('twin:state_update', state);
  });

  socket.on('disconnect', () => {
    console.log(`[Agent-Worker] Client disconnected: ${socket.id}`);
  });
});

// Continuous Digital Twin Event Loop (Every 5 seconds)
const TICK_INTERVAL_MS = 5000;
setInterval(async () => {
  const { state: updatedState, newLogs, newTasks } = twinEngine.tick();

  // Sync real orders from Supabase and emit status changes
  try {
    const syncResult = await syncOrders();
    if (syncResult.orders.length > 0) {
      updatedState.activeOrders = syncResult.orders;
    }
    for (const change of syncResult.statusChanges) {
      io.emit('order:status_change', change);
      console.log(`[Order Event] ${change.orderId}: ${change.from} -> ${change.to}`);
    }
  } catch {
    // sync silently fails - twin state continues with simulated data
  }

  // Emit agent proposals if any were generated this tick
  if (newLogs.length > 0) {
    io.emit('agent:proposal', newLogs);
  }

  // Emit new staff tasks
  if (newTasks.length > 0) {
    io.emit('staff:new_tasks', newTasks);
  }

  io.emit('twin:state_update', updatedState);
}, TICK_INTERVAL_MS);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`[Maestro Agent Worker] running on port ${PORT}`);
  console.log(`WebSocket server live; Digital Twin engine ticking every ${TICK_INTERVAL_MS}ms`);
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log(`Supabase sync enabled`);
  } else {
    console.log(`Supabase sync disabled (no SUPABASE_SERVICE_ROLE_KEY) - using simulated data`);
  }
});
