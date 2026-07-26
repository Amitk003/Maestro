import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import type { TwinState, AgentLog, StaffTask } from '@maestro/shared';
import { DigitalTwinEngine } from './twin/engine';
import { syncOrders } from './supabase/sync';
import { fetchWeather } from './external/weather';

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
  io.emit('crisis:phase', { phase: 0, label: 'Degradation', message: 'Storm approaching, grill load spiking, inventory at risk' });
  scheduleCrisisAdvance(io, twinEngine);
  res.json({ success: true, state: result.state, phase: 0 });
});

function scheduleCrisisAdvance(io: Server, engine: DigitalTwinEngine) {
  let phase = 0;
  const interval = setInterval(() => {
    const result = engine.advanceCrisis();
    io.emit('twin:state_update', result.state);
    io.emit('agent:proposal', result.newLogs);
    if (result.newTasks.length > 0) {
      io.emit('staff:new_tasks', result.newTasks);
    }

    const phaseLabels = ['Detecting', 'Resolving', 'Recovering'];
    const phaseMessages = [
      'Agents detecting anomalies: Inventory Guardian flags Salmon spoilage, Kitchen Conductor detects grill bottleneck',
      'Maestro Orchestrator resolving: morphing menu to Cold Salmon Tartare, rerouting Grill orders',
      'Crisis resolved: grill load normalized, waste salvaged, guest score recovering',
    ];

    if (result.phase >= 1 && result.phase <= 3) {
      io.emit('crisis:phase', {
        phase: result.phase,
        label: phaseLabels[result.phase - 1] || 'Resolved',
        message: phaseMessages[result.phase - 1] || 'Crisis averted',
      });
    }

    if (result.resolved) {
      clearInterval(interval);
      io.emit('crisis:resolved', { message: 'Multi-Agent Swarm successfully resolved the crisis. Global score +14.2%.' });
    }
  }, 4000);
}

app.post('/api/staff/tasks/:id/action', (req, res) => {
  const { id } = req.params;
  const state = twinEngine.resolveTask(id);
  io.emit('twin:state_update', state);
  res.json({ success: true, state });
});

app.post('/api/twin/simulate', (req, res) => {
  const { scenario = 'rain_surge', ticks = 20 } = req.body || {};
  const result = twinEngine.simulate(scenario, ticks);
  res.json({ success: true, ...result });
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
    io.emit('crisis:phase', { phase: 0, label: 'Degradation', message: 'Storm approaching, grill load spiking, inventory at risk' });
    scheduleCrisisAdvance(io, twinEngine);
  });

  socket.on('task:complete', (data: { taskId: string }) => {
    const state = twinEngine.resolveTask(data.taskId);
    io.emit('twin:state_update', state);
  });

  socket.on('disconnect', () => {
    console.log(`[Agent-Worker] Client disconnected: ${socket.id}`);
  });
});

// Weather refresh interval (every 10 minutes)
const WEATHER_INTERVAL_MS = 10 * 60 * 1000;
let lastWeatherFetch = 0;

// Continuous Digital Twin Event Loop (Every 5 seconds)
const TICK_INTERVAL_MS = 5000;
setInterval(async () => {
  const { state: updatedState, newLogs, newTasks } = twinEngine.tick();

  // Fetch real weather periodically
  if (Date.now() - lastWeatherFetch > WEATHER_INTERVAL_MS) {
    try {
      const weather = await fetchWeather();
      updatedState.weather = weather;
      lastWeatherFetch = Date.now();
    } catch {
      // keep existing weather
    }
  }

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

  // Emit metric history every 5th tick (25s)
  if (twinEngine.getMetricHistory().length % 5 === 0) {
    io.emit('metrics:history', twinEngine.getMetricHistory());
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
