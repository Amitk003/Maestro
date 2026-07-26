# Architecture

## How the system is built

Maestro has three main parts that work together.

### 1. Frontend (apps/web)

This is a Next.js 15 app that customers, staff, and managers use. It has three separate views:

- **Customer view**: A simple page where customers type what they want to eat. Maestro creates a meal plan for them. They can see their order status live.

- **Staff view**: A task list that tells waiters and kitchen staff what to do next. Tasks are ranked by urgency. One tap to accept or complete.

- **Manager view**: A dashboard with a live map of the restaurant, agent activity feed, and analytics numbers.

All three views update in real time using WebSockets.

### 2. Agent Worker (apps/agent-worker)

This is a separate server that runs the AI agents and the digital twin. It runs as a long-lived process (not serverless) because the agents need to run every few seconds continuously.

The agent worker has these parts:
- **Digital twin engine**: Keeps a live copy of everything - tables, kitchen stations, inventory, staff. Advances time every 5 seconds.
- **AI agents**: Six agents that each watch one part of the restaurant. They propose actions.
- **Orchestrator**: Collects proposals from all agents and picks the best ones.
- **Socket.io server**: Sends state updates to the frontend in real time.

### 3. Shared Package (packages/shared)

Code that both the frontend and agent worker use - types, validation schemas, constants. This makes sure both sides agree on the data format.

## How data flows

```
Customer types intent
       |
       v
Next.js API route receives it
       |
       v
Agent worker gets the intent
  -> Guest Alchemist agent reads it
  -> Creates a meal plan
  -> Creates the order
       |
       v
Digital twin updates (table status, station queue)
       |
       v
Socket.io broadcasts changes
       |
       v
Frontend updates (customer sees status, KDS gets order, staff sees tasks)
```

## State management

The frontend uses Zustand for client state. The real source of truth is the digital twin running in the agent worker. The frontend subscribes to changes via Socket.io and updates its local store.

## Database

We use PostgreSQL. The main tables are:
- users, restaurants, tables, kitchen_stations
- menu_items, ingredients, orders, order_items
- agent_logs

See the data models document for details.
