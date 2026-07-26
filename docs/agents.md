# AI Agents

Maestro uses six AI agents. Each agent watches one part of the restaurant and proposes actions. The Orchestrator decides which actions to take.

## The Agents

### Demand Seer

**Job**: Predict how busy the restaurant will be.

**What it watches**:
- Weather (rain means more comfort food orders)
- Local events (concerts, games cause pre-show rushes)
- Day of week and time of day patterns

**What it can do**:
- Adjust seating forecasts
- Tell Inventory Guardian to stock up on certain items
- Tell Kitchen Conductor to prepare for a rush

### Kitchen Conductor

**Job**: Make sure the kitchen runs smooth and no station gets overloaded.

**What it watches**:
- How many orders each station has
- How long each station takes to cook
- Which chefs are working each station

**What it can do**:
- Move orders from a busy station to a free station
- Suggest different dishes to customers when a station is overloaded
- Update estimated prep times

### Inventory Guardian

**Job**: Reduce food waste and make sure ingredients are used before they go bad.

**What it watches**:
- Ingredient freshness (how old, how much time left)
- Current stock levels
- Which menu items use each ingredient

**What it can do**:
- Promote dishes that use ingredients about to go bad
- Suggest reordering when stock is low
- Warn about spoilage risk

### Guest Alchemist

**Job**: Give every customer a personal experience.

**What it watches**:
- What the customer types (mood, dietary needs, time limit)
- Past orders if the customer has eaten here before
- Current kitchen load (to promise realistic times)

**What it can do**:
- Create a personalized meal plan (starter, main, drink)
- Suggest table location based on the vibe
- Send apologies and freebies when there is a delay
- Give customers a live view of their order progress

### Staff Harmony

**Job**: Keep staff working efficiently without burning out.

**What it watches**:
- Who is assigned to what
- How many orders each staff member has handled
- How long each person has been working

**What it can do**:
- Suggest who should do what task
- Recommend breaks when it is quiet
- Alert when someone has been working too long

### Maestro Orchestrator

**Job**: The boss agent. It listens to all the other agents and makes final decisions.

**What it does**:
- Collects proposals from all agents every 15 seconds (3 engine ticks)
- Scores each proposal against the global goal (happy customers + fast kitchen + low waste + happy staff + profit)
- Resolves fights between agents (for example: Kitchen Conductor says no more grill orders, but Guest Alchemist wants to recommend a grilled dish)
- Approves or rejects proposals

## How agents make decisions

Each agent has two ways to decide:

1. **Using AI (Gemini)**: For complex reasoning. For example, reading a customer's natural language order and creating a meal plan.

2. **Using rules (Heuristic)**: For fast decisions. For example, calculating ingredient freshness. These rules always work, even without internet or API keys.

The system tries AI first. If that fails (API down, timeout, rate limit), it falls back to rules. This means the system always works.

## The agent loop

```
Every tick (5 seconds):
  1. Digital twin advances time (ingredient decay, order progression)
  2. Twin state snapshot is broadcast via WebSocket
  3. Every 3rd tick: each agent looks at the twin state and proposes actions
  4. Orchestrator collects and scores all proposals
  5. Orchestrator picks the best actions
  6. Actions are applied to the twin
  7. Changes are sent to the frontend via WebSocket
```
